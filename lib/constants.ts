import type { EvidenceType, Network } from "@/lib/types";

export const APP_NAME = "WalProof";
export const DEFAULT_NETWORK: Network = "mainnet";

export const TATUM_RPC_ENDPOINTS: Record<Network, string> = {
  mainnet: "https://sui-mainnet.gateway.tatum.io",
  testnet: "https://sui-testnet.gateway.tatum.io",
  devnet: "https://sui-devnet.gateway.tatum.io"
};

export const ALLOWED_TATUM_METHODS = [
  "sui_getLatestCheckpointSequenceNumber",
  "sui_getCheckpoint",
  "sui_getTransactionBlock",
  "sui_getObject",
  "sui_multiGetObjects",
  "sui_getBalance",
  "sui_getChainIdentifier",
  "sui_getTotalTransactionBlocks",
  "sui_devInspectTransactionBlock",
  "suix_getOwnedObjects"
] as const;

export const EVIDENCE_TYPES: EvidenceType[] = [
  "demo_video",
  "screenshot",
  "github_proof",
  "deployment_link",
  "walrus_blob_proof",
  "sui_transaction_proof",
  "architecture_diagram",
  "final_report",
  "json_proof_packet",
  "pdf",
  "log_file",
  "other"
];

export const ACCEPTED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "application/pdf",
  "application/json",
  "text/plain",
  "text/markdown",
  "application/octet-stream"
];

export const FILE_LIMITS = {
  image: 10 * 1024 * 1024,
  document: 20 * 1024 * 1024,
  video: 100 * 1024 * 1024
};
