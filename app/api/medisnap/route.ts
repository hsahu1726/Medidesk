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

    // Build user content in NVIDIA's multimodal format
    const content = [
        {
            type: "text",
            text:
              "You are given a photo of a medicine strip, pill, or bottle label.\n" +
              "Your job is to read the label carefully and then fill a JSON structure with general, non-personalised information.\n\n" +
              "Look especially for:\n" +
              "- Brand and generic (salt) names\n" +
              "- Strength (mg, ml, %)\n" +
              "- Indication (what it is used for)\n" +
              "- Any visible dosage or frequency instructions\n" +
              "- Warnings about alcohol, liver, kidney, drowsiness, driving, pregnancy etc.\n" +
              "- Other brand names that contain the same or very similar salts (alternatives).\n\n" +
              "Return ONLY JSON in this shape:\n" +
              "{\n" +
              '  "name": "",\n' +
              '  "use": "",\n' +
              '  "dosage_general": "",\n' +
              '  "timing_general": "",\n' +
              '  "with_alcohol": "",\n' +
              '  "alternatives": [],\n' + // 👈 NEW FIELD
              '  "common_side_effects": [],\n' +
              '  "warnings": [],\n' +
              '  "disclaimer": "This is AI-generated educational information, not a medical prescription. Always follow your doctor\'s advice and pharmacist before changing brands."\n' +
              "}\n\n" +
              "Rules:\n" +
              "- If the exact dosage is written, summarise it in very general language (e.g. 'As prescribed by the doctor, dosage depends on age and condition').\n" +
              "- If dose / timing are not visible, use safe text like 'As directed by the physician'.\n" +
              "- For with_alcohol, if not explicitly stated, prefer a cautious answer such as 'Avoid heavy alcohol use with this medicine, especially if it can affect the liver or cause drowsiness'.\n" +
              "- For alternatives, list 2–5 other brand names that typically contain the same or very similar salts in common practice in India; if unsure, keep the list short or empty.\n" +
              "- Alternatives are only informational; never say a user *should* switch. Always rely on the disclaimer.\n" +
              '- Only use the word \"Unknown\" when the label is too blurry or cropped and you cannot even infer a safe, generic statement.\n',
          },
          {
            type: "text",
            text:
              "You are given a photo of a medicine strip, pill, or bottle label.\n" +
              "Your job is to read the label carefully and then fill a JSON structure with general, non-personalised information.\n\n" +
              "Look especially for:\n" +
              "- Brand and generic (salt) names\n" +
              "- Strength (mg, ml, %)\n" +
              "- Indication (what it is used for)\n" +
              "- Any visible dosage or frequency instructions\n" +
              "- Warnings about alcohol, liver, kidney, drowsiness, driving, pregnancy etc.\n" +
              "- Other brand names that contain the same or very similar salts (alternatives).\n\n" +
              "Return ONLY JSON in this shape:\n" +
              "{\n" +
              '  "name": "",\n' +
              '  "use": "",\n' +
              '  "dosage_general": "",\n' +
              '  "timing_general": "",\n' +
              '  "with_alcohol": "",\n' +
              '  "alternatives": [],\n' + // 👈 NEW FIELD
              '  "common_side_effects": [],\n' +
              '  "warnings": [],\n' +
              '  "disclaimer": "This is AI-generated educational information, not a medical prescription. Always follow your doctor\'s advice and pharmacist before changing brands."\n' +
              "}\n\n" +
              "Rules:\n" +
              "- If the exact dosage is written, summarise it in very general language (e.g. 'As prescribed by the doctor, dosage depends on age and condition').\n" +
              "- If dose / timing are not visible, use safe text like 'As directed by the physician'.\n" +
              "- For with_alcohol, if not explicitly stated, prefer a cautious answer such as 'Avoid heavy alcohol use with this medicine, especially if it can affect the liver or cause drowsiness'.\n" +
              "- For alternatives, list 2–5 other brand names that typically contain the same or very similar salts in common practice in India; if unsure, keep the list short or empty.\n" +
              "- Alternatives are only informational; never say a user *should* switch. Always rely on the disclaimer.\n" +
              '- Only use the word \"Unknown\" when the label is too blurry or cropped and you cannot even infer a safe, generic statement.\n',
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
                "You are a cautious medical information assistant. You only provide general educational information about medicines. Never give patient-specific dosing or treatment advice.",
            },
            {
              role: "user",
              content,
            },
          ],
          temperature: 0.1,
          max_tokens: 512,
          // some NVIDIA models ignore this, but it doesn't hurt to request JSON
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
      console.error("NVIDIA MediSnap error:", msg, json);
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
      console.error("Failed to parse JSON from model, raw content:", contentText);
      return NextResponse.json(
        { error: "Model returned invalid JSON.", raw: contentText },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("MediSnap API error:", err);
    return NextResponse.json(
      {
        error:
          err?.message ||
          "Something went wrong analyzing the image on the server.",
      },
      { status: 500 }
    );
  }
}

