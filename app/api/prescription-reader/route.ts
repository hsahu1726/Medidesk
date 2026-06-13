import { NextResponse } from "next/server";
import {
  checkRateLimit,
  hasValidImageSignature,
  isMultipartFormData,
  parseModelJson,
  validateImage,
} from "@/lib/api-security";
import { prescriptionSchema } from "@/lib/medical-ai";

export const runtime = "nodejs";

const NVIDIA_API_URL =
  "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = "nvidia/nemotron-nano-12b-v2-vl";
const MIN_CONFIDENCE = 0.65;

const prompt = `Analyze the uploaded image using only clearly visible evidence.

First decide whether the image clearly shows a medical prescription containing readable prescription or medicine text.

Return ONLY JSON in exactly this shape:
{
  "is_prescription_image": false,
  "confidence": 0,
  "visible_evidence": [],
  "patient_name": "",
  "medicines": [
    {
      "name": "Unclear",
      "dose": "Unclear",
      "frequency": "Unclear",
      "timing": "Unclear",
      "duration": "Unclear"
    }
  ],
  "notes": "",
  "disclaimer": "This is AI-generated educational information based on the prescription image. Verify every detail with the prescribing doctor or pharmacist."
}

Rules:
- Set is_prescription_image to false for unrelated, blank, severely cropped, or unreadable images.
- visible_evidence must contain short pieces of text actually visible in the image.
- confidence is a number from 0 to 1 reflecting confidence that this is a prescription.
- If it is not a prescription, return an empty medicines array and empty text fields.
- Never infer a medicine name or instruction from context.
- Use "Unclear" for any unreadable field instead of guessing.
- Preserve medicine names and instructions as written.
- Do not add treatment recommendations or reinterpret the doctor's intent.`;

export async function POST(request: Request) {
  const limited = checkRateLimit(request, "prescription-reader");
  if (limited) return limited;

  try {
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "The prescription reading service is not configured." },
        { status: 503 }
      );
    }

    if (!isMultipartFormData(request)) {
      return NextResponse.json(
        { error: "Please upload an image using multipart form data." },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const validation = validateImage(formData.get("file"));

    if ("error" in validation) {
      return NextResponse.json(
        { error: validation.error },
        { status: validation.status }
      );
    }

    const { file } = validation;
    const buffer = Buffer.from(await file.arrayBuffer());

    if (!hasValidImageSignature(buffer, file.type)) {
      return NextResponse.json(
        { error: "The uploaded file does not appear to be a valid image." },
        { status: 415 }
      );
    }

    const base64Image = buffer.toString("base64");

    const response = await fetch(NVIDIA_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "You transcribe prescriptions conservatively. Reject unrelated images and mark unreadable details as unclear rather than guessing.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:${file.type};base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        temperature: 0,
        max_tokens: 900,
        response_format: { type: "json_object" },
      }),
      signal: AbortSignal.timeout(45_000),
    });

    const upstreamData: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("NVIDIA prescription request failed", response.status);
      return NextResponse.json(
        { error: "The prescription reading service is temporarily unavailable." },
        { status: 502 }
      );
    }

    const content =
      typeof upstreamData === "object" &&
      upstreamData !== null &&
      "choices" in upstreamData &&
      Array.isArray(upstreamData.choices)
        ? upstreamData.choices[0]?.message?.content
        : null;

    if (typeof content !== "string") {
      return NextResponse.json(
        { error: "The reading service returned an incomplete response." },
        { status: 502 }
      );
    }

    const result = prescriptionSchema.safeParse(parseModelJson(content));

    if (!result.success) {
      console.error(
        "Invalid prescription model response",
        result.error.flatten()
      );
      return NextResponse.json(
        { error: "The prescription result could not be verified." },
        { status: 502 }
      );
    }

    if (
      !result.data.is_prescription_image ||
      result.data.confidence < MIN_CONFIDENCE ||
      result.data.visible_evidence.length === 0 ||
      result.data.medicines.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "No readable prescription could be identified. Upload a clear, well-lit photo showing the full prescription.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      patient_name: result.data.patient_name,
      medicines: result.data.medicines,
      notes: result.data.notes,
      disclaimer: result.data.disclaimer,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return NextResponse.json(
        { error: "The reading request timed out. Please try again." },
        { status: 504 }
      );
    }

    console.error("Prescription API error", error);
    return NextResponse.json(
      { error: "Something went wrong while reading the prescription." },
      { status: 500 }
    );
  }
}
