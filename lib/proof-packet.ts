import type { EvidenceFile, GrantRoom, Milestone, ProofPacket } from "@/lib/types";
import { createId, sha256Hex } from "@/lib/utils";

export async function createProofPacketPayload(args: {
  grant: GrantRoom;
  milestone: Milestone;
  evidence: EvidenceFile[];
  summary: string;
}): Promise<Omit<ProofPacket, "proofPacketBlobId" | "proofPacketHash" | "status"> & { packet: unknown; hash: string }> {
  const createdAt = new Date().toISOString();
  const packet = {
    app: "WalProof",
    version: "1.0.0",
    network: args.grant.network,
    grant: {
      id: args.grant.id,
      name: args.grant.name,
      sponsorName: args.grant.sponsorName,
      builderName: args.grant.builderName,
      fundingLabel: args.grant.fundingLabel
    },
    milestone: {
      id: args.milestone.id,
      title: args.milestone.title,
      fundingLabel: args.milestone.fundingLabel,
      requiredEvidenceTypes: args.milestone.requiredEvidenceTypes
    },
    builderWallet: args.grant.builderWallet,
    sponsorWallet: args.grant.sponsorWallet,
    summary: args.summary,
    evidence: args.evidence.map((item) => ({
      id: item.id,
      title: item.title,
      type: item.type,
      mimeType: item.mimeType,
      size: item.size,
      walrusBlobId: item.walrusBlobId,
      contentHash: item.contentHash,
      uploadedAt: item.uploadedAt
    })),
    createdAt
  };
  const hash = await sha256Hex(JSON.stringify(packet));

  return {
    id: createId("proof"),
    grantId: args.grant.id,
    milestoneId: args.milestone.id,
    builderWallet: args.grant.builderWallet,
    sponsorWallet: args.grant.sponsorWallet,
    summary: args.summary,
    evidence: args.evidence,
    createdAt,
    packet,
    hash
  };
}
