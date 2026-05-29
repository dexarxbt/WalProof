import { appConfig } from "@/lib/config";

const suiNetwork = appConfig.network === "mainnet" ? "mainnet" : appConfig.network;
const suiscanBaseUrl = "https://suiscan.xyz";

export function suiTransactionUrl(digest: string) {
  return `${suiscanBaseUrl}/${suiNetwork}/tx/${encodeURIComponent(digest)}`;
}

export function suiObjectUrl(objectId: string) {
  return `${suiscanBaseUrl}/${suiNetwork}/object/${encodeURIComponent(objectId)}`;
}

export function suiAddressUrl(address: string) {
  return `${suiscanBaseUrl}/${suiNetwork}/account/${encodeURIComponent(address)}`;
}

export function walrusBlobUrl(blobId: string) {
  return `/api/walrus/read?blobId=${encodeURIComponent(blobId)}`;
}
