import { NextResponse } from "next/server";
import {
  checkRateLimit,
  hasValidImageSignature,
  isMultipartFormData,
  parseModelJson,
  validateImage,
} from "@/lib/api-security";
import { mediSnapSchema } from "@/lib/medical-ai";

export const runtime = "nodejs";

const NVIDIA_API_URL =
  "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = "nvidia/nemotron-nano-12b-v2-vl";
const MIN_CONFIDENCE = 0.75;

const prompt = `Analyze the uploaded image using only clearly visible evidence.

First decide whether it clearly shows a medicine strip, blister pack, medicine box, or bottle label with readable medicine-identifying text. A loose pill without readable packaging is not sufficient.

Return ONLY JSON in exactly this shape:
{
  "is_medicine_image": false,
  "confidence": 0,
  "visible_evidence": [],
  "name": "",
  "use": "",
  "dosage_general": "",
  "timing_general": "",
  "with_alcohol": "",
  "alternatives": [],
  "common_side_effects": [],
  "warnings": [],
  "disclaimer": "This is AI-generated educational information, not a medical prescription. Verify the medicine with a pharmacist or doctor before relying on this result."
}

Rules:
- Never identify a medicine from colors, shapes, logos, context, or prior knowledge alone.
- Set is_medicine_image to false when the image is unrelated, blurry, cropped, or lacks readable medicine-identifying text.
- visible_evidence must quote short pieces of text actually visible in the image.
- confidence is a number from 0 to 1 reflecting confidence in the identification.
- If is_medicine_image is false, keep all medicine information fields empty.
- Do not provide patient-specific dosing or treatment advice.
- Only list alternatives when the active ingredient is clearly readable; otherwise return an empty array.
- Prefer empty fields over guesses.`;

export async function POST(request: Request) {
  const limited = checkRateLimit(request, "medisnap");
  if (limited) return limited;

  try {
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "The medicine analysis service is not configured." },
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
              "You are a cautious visual verification assistant. Reject uncertain or unrelated images and never invent medicine details.",
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
        max_tokens: 700,
        response_format: { type: "json_object" },
      }),
      signal: AbortSignal.timeout(45_000),
    });

    const upstreamData: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("NVIDIA MediSnap request failed", response.status);
      return NextResponse.json(
        { error: "The medicine analysis service is temporarily unavailable." },
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
        { error: "The analysis service returned an incomplete response." },
        { status: 502 }
      );
    }

    const result = mediSnapSchema.safeParse(parseModelJson(content));

    if (!result.success) {
      console.error("Invalid MediSnap model response", result.error.flatten());
      return NextResponse.json(
        { error: "The analysis could not be verified. Please try another image." },
        { status: 502 }
      );
    }

    if (
      !result.data.is_medicine_image ||
      result.data.confidence < MIN_CONFIDENCE ||
      result.data.visible_evidence.length === 0 ||
      !result.data.name.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "No medicine label could be identified reliably. Upload a clear close-up showing the medicine name and strength.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      name: result.data.name,
      use: result.data.use,
      dosage_general: result.data.dosage_general,
      timing_general: result.data.timing_general,
      with_alcohol: result.data.with_alcohol,
      alternatives: result.data.alternatives,
      common_side_effects: result.data.common_side_effects,
      warnings: result.data.warnings,
      disclaimer: result.data.disclaimer,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return NextResponse.json(
        { error: "The analysis timed out. Please try again." },
        { status: 504 }
      );
    }

    console.error("MediSnap API error", error);
    return NextResponse.json(
      { error: "Something went wrong while analyzing the image." },
      { status: 500 }
    );
  }
}
