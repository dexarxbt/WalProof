import { z } from "zod";
import { TATUM_RPC_ENDPOINTS } from "@/lib/constants";
import type { Network } from "@/lib/types";

const networkSchema = z.enum(["mainnet", "testnet", "devnet"]);

export function getPublicNetwork(): Network {
  return networkSchema.catch("mainnet").parse(process.env.NEXT_PUBLIC_SUI_NETWORK);
}

export function getTatumEndpoint(network: Network = getPublicNetwork()) {
  const envKey = `NEXT_PUBLIC_TATUM_SUI_RPC_${network.toUpperCase()}`;
  return process.env[envKey] ?? TATUM_RPC_ENDPOINTS[network];
}

export function requireServerEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

export function getWalrusConfig() {
  return {
    network: process.env.NEXT_PUBLIC_WALRUS_NETWORK ?? "mainnet",
    publisherUrl: process.env.WALRUS_PUBLISHER_URL,
    aggregatorUrl: process.env.WALRUS_AGGREGATOR_URL,
    uploadRelayUrl: process.env.WALRUS_UPLOAD_RELAY_URL
  };
}
