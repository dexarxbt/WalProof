import type { Network } from "@/lib/types";

export async function tatumRpc<T = unknown>(method: string, params: unknown[] = []): Promise<T> {
  const response = await fetch("/api/tatum-rpc", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ method, params })
  });

  const payload = (await response.json()) as { result?: T; error?: { message?: string } };
  if (!response.ok || payload.error) {
    throw new Error(payload.error?.message ?? "Tatum RPC request failed");
  }
  return payload.result as T;
}

export async function getTatumHealth(): Promise<{
  connected: boolean;
  network: Network;
  latestCheckpoint?: string;
  chainIdentifier?: string;
  latencyMs?: number;
  error?: string;
}> {
  const start = performance.now();
  try {
    const [latestCheckpoint, chainIdentifier] = await Promise.all([
      tatumRpc<string>("sui_getLatestCheckpointSequenceNumber"),
      tatumRpc<string>("sui_getChainIdentifier")
    ]);
    return {
      connected: true,
      network: (process.env.NEXT_PUBLIC_SUI_NETWORK ?? "mainnet") as Network,
      latestCheckpoint,
      chainIdentifier,
      latencyMs: Math.round(performance.now() - start)
    };
  } catch (error) {
    return {
      connected: false,
      network: (process.env.NEXT_PUBLIC_SUI_NETWORK ?? "mainnet") as Network,
      latencyMs: Math.round(performance.now() - start),
      error: error instanceof Error ? error.message : "Tatum RPC failed"
    };
  }
}

export function getTransactionBlock(digest: string) {
  return tatumRpc("sui_getTransactionBlock", [
    digest,
    {
      showInput: true,
      showEffects: true,
      showEvents: true,
      showObjectChanges: true
    }
  ]);
}

export function getObject(objectId: string) {
  return tatumRpc("sui_getObject", [
    objectId,
    {
      showContent: true,
      showOwner: true,
      showType: true
    }
  ]);
}
