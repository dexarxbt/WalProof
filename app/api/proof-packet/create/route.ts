import { NextResponse } from "next/server";
import { proofPacketCreateSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const parsed = proofPacketCreateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid proof packet request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Proof packet request is valid. The client must upload the packet JSON to Walrus before Sui registration."
  });
}
