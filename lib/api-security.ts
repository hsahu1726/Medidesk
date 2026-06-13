import { NextResponse } from "next/server";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 8;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

export function checkRateLimit(request: Request, route: string) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const clientIp =
    forwardedFor?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const key = `${route}:${clientIp}`;
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return null;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfter = Math.max(
      1,
      Math.ceil((current.resetAt - now) / 1000)
    );
    return NextResponse.json(
      { error: "Too many requests. Please wait and try again." },
      {
        status: 429,
        headers: { "Retry-After": retryAfter.toString() },
      }
    );
  }

  current.count += 1;
  return null;
}

export function isMultipartFormData(request: Request) {
  return request.headers
    .get("content-type")
    ?.toLowerCase()
    .startsWith("multipart/form-data");
}

export function validateImage(file: FormDataEntryValue | null) {
  if (!(file instanceof File)) {
    return { error: "Please upload an image file.", status: 400 } as const;
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return {
      error: "Only JPEG, PNG, and WebP images are supported.",
      status: 415,
    } as const;
  }

  if (file.size === 0) {
    return { error: "The uploaded image is empty.", status: 400 } as const;
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return {
      error: "The image is too large. The maximum size is 5 MB.",
      status: 413,
    } as const;
  }

  return { file } as const;
}

export function parseModelJson(content: string): unknown {
  const normalized = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  return JSON.parse(normalized);
}

export function hasValidImageSignature(buffer: Buffer, mimeType: string) {
  if (mimeType === "image/jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (mimeType === "image/png") {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    );
  }

  if (mimeType === "image/webp") {
    return (
      buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP"
    );
  }

  return false;
}
