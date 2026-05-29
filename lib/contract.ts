import { Transaction } from "@mysten/sui/transactions";
import type { SponsorDecision } from "@/lib/types";

const DECISION_TO_U8: Record<SponsorDecision, number> = {
  approved: 1,
  revision_requested: 2,
  rejected: 3
};

function moduleTarget(functionName: string) {
  const packageId = process.env.NEXT_PUBLIC_WALPROOF_PACKAGE_ID;
  const moduleName = process.env.NEXT_PUBLIC_WALPROOF_REGISTRY_MODULE ?? "registry";
  if (!packageId) {
    throw new Error("NEXT_PUBLIC_WALPROOF_PACKAGE_ID is not configured");
  }
  return `${packageId}::${moduleName}::${functionName}`;
}

function bytes(tx: Transaction, value: string) {
  return tx.pure.vector("u8", Array.from(new TextEncoder().encode(value)));
}

export async function buildCreateGrantTx(args: {
  sponsor: string;
  builder: string;
  metadataHash: string;
  createdAtMs: number;
}): Promise<Transaction> {
  const tx = new Transaction();
  tx.moveCall({
    target: moduleTarget("create_grant"),
    arguments: [
      tx.pure.address(args.sponsor),
      tx.pure.address(args.builder),
      bytes(tx, args.metadataHash),
      tx.pure.u64(args.createdAtMs)
    ]
  });
  return tx;
}

export async function buildSubmitProofTx(args: {
  grantRef: string;
  milestoneRef: string;
  sponsor: string;
  proofPacketBlobId: string;
  proofPacketHash: string;
  createdAtMs: number;
}): Promise<Transaction> {
  const tx = new Transaction();
  tx.moveCall({
    target: moduleTarget("submit_proof"),
    arguments: [
      bytes(tx, args.grantRef),
      bytes(tx, args.milestoneRef),
      tx.pure.address(args.sponsor),
      bytes(tx, args.proofPacketBlobId),
      bytes(tx, args.proofPacketHash),
      tx.pure.u64(args.createdAtMs)
    ]
  });
  return tx;
}

export async function buildReviewProofTx(args: {
  proofRef: string;
  decision: SponsorDecision;
  reviewPacketBlobId: string;
  reviewPacketHash: string;
  createdAtMs: number;
}): Promise<Transaction> {
  const tx = new Transaction();
  tx.moveCall({
    target: moduleTarget("review_proof"),
    arguments: [
      bytes(tx, args.proofRef),
      tx.pure.u8(DECISION_TO_U8[args.decision]),
      bytes(tx, args.reviewPacketBlobId),
      bytes(tx, args.reviewPacketHash),
      tx.pure.u64(args.createdAtMs)
    ]
  });
  return tx;
}
