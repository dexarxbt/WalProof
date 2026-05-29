import { NextResponse } from "next/server";
import { getPublicNetwork, getTatumEndpoint, getWalrusConfig } from "@/lib/env";

export async function GET() {
  const network = getPublicNetwork();
  const walrus = getWalrusConfig();
  return NextResponse.json({
    app: "WalProof",
    status: "ok",
    network,
    tatum: {
      endpoint: getTatumEndpoint(network),
      apiKeyDetectedServerSide: Boolean(process.env.TATUM_API_KEY)
    },
    walrus: {
      network: walrus.network,
      publisherConfigured: Boolean(walrus.publisherUrl),
      relayConfigured: Boolean(walrus.uploadRelayUrl),
      aggregatorConfigured: Boolean(walrus.aggregatorUrl)
    },
    timestamp: new Date().toISOString()
  });
}
