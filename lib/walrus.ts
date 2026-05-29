import { IntegrationError } from "@/lib/errors";
import { sha256Hex } from "@/lib/utils";
import type { Transaction } from "@mysten/sui/transactions";

type WalletUploadOptions = {
  ownerAddress?: string;
  signAndExecuteTransaction?: (input: { transaction: Transaction }) => Promise<unknown>;
};

function getWalrusRelayUrl() {
  return process.env.NEXT_PUBLIC_WALRUS_UPLOAD_RELAY_URL ?? "https://upload-relay.mainnet.walrus.space";
}

function getWalrusGrpcUrl() {
  const network = process.env.NEXT_PUBLIC_WALRUS_NETWORK ?? "mainnet";
  if (network === "testnet") return "https://fullnode.testnet.sui.io:443";
  return "https://fullnode.mainnet.sui.io:443";
}

function getWalrusNetwork(): "mainnet" | "testnet" {
  return process.env.NEXT_PUBLIC_WALRUS_NETWORK === "testnet" ? "testnet" : "mainnet";
}

function transactionDigest(result: unknown) {
  const record = result as {
    digest?: string;
    Transaction?: { digest?: string };
    effects?: { transactionDigest?: string };
    $kind?: string;
    FailedTransaction?: { status?: { error?: { message?: string } } };
  };
  if (record.$kind === "FailedTransaction") {
    throw new IntegrationError(
      record.FailedTransaction?.status?.error?.message ?? "Wallet transaction failed",
      "WALRUS_WALLET_TRANSACTION_FAILED"
    );
  }
  const digest = record.digest ?? record.Transaction?.digest ?? record.effects?.transactionDigest;
  if (!digest) {
    throw new IntegrationError("Wallet did not return a transaction digest", "WALRUS_DIGEST_MISSING");
  }
  return digest;
}

async function uploadWithWalletWalrusSdk(file: File, options: Required<WalletUploadOptions>) {
  if (typeof window === "undefined") {
    throw new IntegrationError("Walrus wallet uploads must run in the browser.", "WALRUS_BROWSER_ONLY");
  }
  const [{ SuiGrpcClient }, { walrus }] = await Promise.all([
    import("@mysten/sui/grpc"),
    import("@mysten/walrus")
  ]);
  const bytes = new Uint8Array(await file.arrayBuffer());
  const contentHash = await sha256Hex(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
  const client = new SuiGrpcClient({
    network: getWalrusNetwork(),
    baseUrl: getWalrusGrpcUrl()
  }).$extend(
    walrus({
      uploadRelay: {
        host: getWalrusRelayUrl(),
        sendTip: { max: 5_000_000 }
      }
    })
  );

  const flow = client.walrus.writeBlobFlow({ blob: bytes });
  const encoded = await flow.encode();
  const registerTx = flow.register({
    epochs: 1,
    owner: options.ownerAddress,
    deletable: false
  });
  const registerResult = await options.signAndExecuteTransaction({ transaction: registerTx });
  const registerDigest = transactionDigest(registerResult);
  await flow.upload({ digest: registerDigest });
  const certifyTx = flow.certify();
  const certifyResult = await options.signAndExecuteTransaction({ transaction: certifyTx });
  transactionDigest(certifyResult);

  return {
    blobId: encoded.blobId,
    contentHash,
    size: file.size,
    mimeType: file.type || "application/octet-stream"
  };
}

export async function uploadEvidenceToWalrus(file: File): Promise<{
  blobId: string;
  contentHash: string;
  size: number;
  mimeType: string;
}>;
export async function uploadEvidenceToWalrus(file: File, options: WalletUploadOptions): Promise<{
  blobId: string;
  contentHash: string;
  size: number;
  mimeType: string;
}>;
export async function uploadEvidenceToWalrus(file: File, options: WalletUploadOptions = {}): Promise<{
  blobId: string;
  contentHash: string;
  size: number;
  mimeType: string;
}> {
  if (options.ownerAddress && options.signAndExecuteTransaction) {
    return uploadWithWalletWalrusSdk(file, {
      ownerAddress: options.ownerAddress,
      signAndExecuteTransaction: options.signAndExecuteTransaction
    });
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/walrus/upload", {
    method: "POST",
    body: formData
  });
  const payload = (await response.json()) as {
    blobId?: string;
    contentHash?: string;
    size?: number;
    mimeType?: string;
    error?: string;
  };

  if (!response.ok || !payload.blobId || !payload.contentHash) {
    throw new IntegrationError(payload.error ?? "Walrus upload failed", "WALRUS_UPLOAD_FAILED");
  }

  return {
    blobId: payload.blobId,
    contentHash: payload.contentHash,
    size: payload.size ?? file.size,
    mimeType: payload.mimeType ?? file.type
  };
}

export async function uploadJsonToWalrus(data: unknown, fileName: string): Promise<{
  blobId: string;
  contentHash: string;
  size: number;
  mimeType: "application/json";
}>;
export async function uploadJsonToWalrus(data: unknown, fileName: string, options: WalletUploadOptions): Promise<{
  blobId: string;
  contentHash: string;
  size: number;
  mimeType: "application/json";
}>;
export async function uploadJsonToWalrus(data: unknown, fileName: string, options: WalletUploadOptions = {}): Promise<{
  blobId: string;
  contentHash: string;
  size: number;
  mimeType: "application/json";
}> {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const file = new File([blob], fileName, { type: "application/json" });
  const result = await uploadEvidenceToWalrus(file, options);
  return { ...result, mimeType: "application/json" };
}

export function getWalrusReadUrl(blobId: string): string {
  const encoded = encodeURIComponent(blobId);
  return `/api/walrus/read?blobId=${encoded}`;
}

export async function verifyWalrusBlob(blobId: string): Promise<{
  exists: boolean;
  retrievable: boolean;
  url?: string;
}> {
  const url = getWalrusReadUrl(blobId);
  const response = await fetch(url, { method: "HEAD" });
  return {
    exists: response.ok,
    retrievable: response.ok,
    url: response.ok ? url : undefined
  };
}

export async function hashFile(file: File) {
  return sha256Hex(await file.arrayBuffer());
}
