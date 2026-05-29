"use client";

import { getJsonRpcFullnodeUrl } from "@mysten/sui/jsonRpc";
import type { Network } from "@/lib/types";

export const suiNetworks = {
  mainnet: {
    url: process.env.NEXT_PUBLIC_TATUM_SUI_RPC_MAINNET ?? "https://sui-mainnet.gateway.tatum.io",
    network: "mainnet"
  },
  testnet: {
    url: process.env.NEXT_PUBLIC_TATUM_SUI_RPC_TESTNET ?? getJsonRpcFullnodeUrl("testnet"),
    network: "testnet"
  },
  devnet: {
    url: process.env.NEXT_PUBLIC_TATUM_SUI_RPC_DEVNET ?? getJsonRpcFullnodeUrl("devnet"),
    network: "devnet"
  }
} satisfies Record<Network, { url: string; network: Network }>;
