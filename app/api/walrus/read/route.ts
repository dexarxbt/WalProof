import { NextResponse } from "next/server";
import { getWalrusConfig } from "@/lib/env";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const blobId = searchParams.get("blobId");
  const config = getWalrusConfig();

  if (!blobId) {
    return NextResponse.json({ error: "blobId is required" }, { status: 400 });
  }

  if (!config.aggregatorUrl) {
    return NextResponse.json(
      { error: "Configure WALRUS_AGGREGATOR_URL before reading Walrus blobs." },
      { status: 503 }
    );
  }

  const readUrl = `${config.aggregatorUrl.replace(/\/$/, "")}/v1/blobs/${encodeURIComponent(blobId)}`;
  const response = await fetch(readUrl, { cache: "no-store" });
  if (!response.ok || !response.body) {
    return NextResponse.json({ error: "Walrus blob could not be retrieved" }, { status: response.status });
  }

  return new Response(response.body, {
    status: 200,
    headers: {
      "content-type": response.headers.get("content-type") ?? "application/octet-stream"
    }
  });
}

export async function HEAD(request: Request) {
  const { searchParams } = new URL(request.url);
  const blobId = searchParams.get("blobId");
  const config = getWalrusConfig();

  if (!blobId || !config.aggregatorUrl) {
    return new Response(null, { status: 404 });
  }

  const readUrl = `${config.aggregatorUrl.replace(/\/$/, "")}/v1/blobs/${encodeURIComponent(blobId)}`;
  const response = await fetch(readUrl, { method: "GET", cache: "no-store" });
  return new Response(null, { status: response.ok ? 200 : response.status });
}
