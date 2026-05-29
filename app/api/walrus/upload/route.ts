import { NextResponse } from "next/server";
import { getWalrusConfig } from "@/lib/env";

async function sha256Hex(buffer: ArrayBuffer) {
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function blobIdFromWalrusResponse(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const record = payload as Record<string, unknown>;
  return (
    (typeof record.blobId === "string" && record.blobId) ||
    (typeof record.blob_id === "string" && record.blob_id) ||
    (typeof record.newlyCreated === "object" &&
      record.newlyCreated !== null &&
      typeof (record.newlyCreated as Record<string, unknown>).blobObject === "object" &&
      typeof ((record.newlyCreated as Record<string, unknown>).blobObject as Record<string, unknown>).blobId === "string" &&
      (((record.newlyCreated as Record<string, unknown>).blobObject as Record<string, unknown>).blobId as string)) ||
    undefined
  );
}

export async function POST(request: Request) {
  const config = getWalrusConfig();
  const publisherUrlBase = config.publisherUrl;

  if (!publisherUrlBase && !config.uploadRelayUrl) {
    return NextResponse.json(
      { error: "Configure WALRUS_UPLOAD_RELAY_URL or WALRUS_PUBLISHER_URL before uploading evidence." },
      { status: 503 }
    );
  }

  if (!publisherUrlBase && config.uploadRelayUrl) {
    return NextResponse.json(
      {
        error:
          "Official Walrus upload relay is configured. Browser uploads must use the Walrus TypeScript SDK relay flow because the relay is not a PUT /v1/blobs publisher endpoint."
      },
      { status: 501 }
    );
  }

  if (!publisherUrlBase) {
    return NextResponse.json({ error: "Walrus publisher URL is not configured." }, { status: 503 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing evidence file" }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const contentHash = await sha256Hex(buffer);

  try {
    const publisherUrl = `${publisherUrlBase.replace(/\/$/, "")}/v1/blobs?epochs=1`;
    const walrusResponse = await fetch(publisherUrl, {
      method: "PUT",
      headers: {
        "content-type": file.type || "application/octet-stream"
      },
      body: buffer
    });
    const text = await walrusResponse.text();
    const payload = text ? JSON.parse(text) : {};
    const blobId = blobIdFromWalrusResponse(payload);

    if (!walrusResponse.ok || !blobId) {
      return NextResponse.json(
        { error: `Walrus upload failed: ${text || walrusResponse.statusText}` },
        { status: walrusResponse.ok ? 502 : walrusResponse.status }
      );
    }

    return NextResponse.json({
      blobId,
      contentHash,
      size: file.size,
      mimeType: file.type || "application/octet-stream"
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Walrus upload request failed" },
      { status: 502 }
    );
  }
}
