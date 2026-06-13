import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "NVIDIA_API_KEY is not set on the server." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Convert uploaded image to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";

    // Build user content in NVIDIA multimodal format
    const content = [
      {
        type: "text",
        text:
          "You are given a photo of a doctor's prescription. " +
          "Read the handwriting and extract a clean medicine schedule.\n\n" +
          "Return ONLY JSON in exactly this shape:\n\n" +
          "{\n" +
          '  "patient_name": "",\n' +
          '  "medicines": [\n' +
          '    { "name": "", "dose": "", "frequency": "", "timing": "", "duration": "" }\n' +
          "  ],\n" +
          '  "notes": "",\n' +
          '  "disclaimer": "This is AI-generated educational information based on the prescription image. Always follow instructions written by your doctor and pharmacist."\n' +
          "}\n\n" +
          "Rules:\n" +
          "- If you cannot read a field, set it to \"Unclear\" instead of guessing.\n" +
          "- Keep medicine names exactly as written as far as possible.\n" +
          "- Frequency examples: \"1-0-1\", \"once daily\", \"twice daily\".\n" +
          "- Timing examples: \"after food\", \"before breakfast\", \"at night\".\n",
      },
      {
        type: "image_url",
        image_url: {
          url: `data:${mimeType};base64,${base64Image}`,
        },
      },
    ];

    const response = await fetch(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "nvidia/nemotron-nano-12b-v2-vl",
          messages: [
            {
              role: "system",
              content:
                "You convert handwritten prescriptions into a structured medicine schedule. You NEVER change the doctor's intent and always remind users to follow their doctor.",
            },
            {
              role: "user",
              content,
            },
          ],
          temperature: 0.1,
          max_tokens: 700,
          response_format: { type: "json_object" },
        }),
      }
    );

    const json = await response.json();

    if (!response.ok) {
      const msg =
        json?.error?.message ||
        json?.message ||
        "NVIDIA API request failed.";
      console.error("NVIDIA Prescription error:", msg, json);
      return NextResponse.json({ error: msg }, { status: response.status });
    }

    const contentText = json?.choices?.[0]?.message?.content;

    if (!contentText) {
      return NextResponse.json(
        { error: "Model returned no content." },
        { status: 500 }
      );
    }

    let data;
    try {
      data = JSON.parse(contentText);
    } catch (e) {
      console.error(
        "Failed to parse JSON from model, raw content:",
        contentText
      );
      return NextResponse.json(
        { error: "Model returned invalid JSON.", raw: contentText },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Prescription API error:", err);
    return NextResponse.json(
      {
        error:
          err?.message ||
          "Something went wrong reading the prescription on the server.",
      },
      { status: 500 }
    );
  }
}
