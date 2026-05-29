import { NextResponse } from "next/server";
import { z } from "zod";
import { ALLOWED_TATUM_METHODS } from "@/lib/constants";
import { getPublicNetwork, getTatumEndpoint, requireServerEnv } from "@/lib/env";

const requestSchema = z.object({
  method: z.string().refine(
    (method) => ALLOWED_TATUM_METHODS.includes(method as (typeof ALLOWED_TATUM_METHODS)[number]),
    "RPC method is not allowed"
  ),
  params: z.array(z.unknown()).optional().default([])
});

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: { message: "Unsupported or invalid Tatum RPC request" } },
      { status: 400 }
    );
  }

  let apiKey: string;
  try {
    apiKey = requireServerEnv("TATUM_API_KEY");
  } catch {
    return NextResponse.json(
      { error: { message: "TATUM_API_KEY is not configured on the server" } },
      { status: 500 }
    );
  }

  const network = getPublicNetwork();
  const endpoint = getTatumEndpoint(network);
  const body = {
    jsonrpc: "2.0",
    id: crypto.randomUUID(),
    method: parsed.data.method,
    params: parsed.data.params
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey
      },
      body: JSON.stringify(body),
      cache: "no-store"
    });
    const payload = await response.json();
    return NextResponse.json(payload, { status: response.ok ? 200 : response.status });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : "Tatum RPC gateway request failed"
        }
      },
      { status: 502 }
    );
  }
}
