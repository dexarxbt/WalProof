import { z } from "zod";
import { ACCEPTED_FILE_TYPES, EVIDENCE_TYPES, FILE_LIMITS } from "@/lib/constants";
import { isSuiAddress } from "@/lib/utils";

const wallet = z.string().refine(isSuiAddress, "Enter a valid Sui address");

export const milestoneFormSchema = z.object({
  title: z.string().min(2, "Milestone title is required"),
  description: z.string().min(8, "Milestone description is required"),
  fundingLabel: z.string().min(1, "Funding label is required"),
  dueDate: z.string().optional(),
  requiredEvidenceTypes: z.array(z.enum(EVIDENCE_TYPES as [string, ...string[]])).min(1)
});

export const createGrantSchema = z.object({
  name: z.string().min(3, "Grant name is required"),
  sponsorName: z.string().min(2, "Sponsor name is required"),
  builderName: z.string().min(2, "Builder/team name is required"),
  fundingLabel: z.string().min(1, "Funding label is required"),
  sponsorWallet: wallet,
  builderWallet: wallet,
  projectUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().min(20, "Add a short grant description"),
  network: z.enum(["mainnet", "testnet", "devnet"]).default("mainnet"),
  milestones: z.array(milestoneFormSchema).min(1).max(6)
});

export const evidenceMetadataSchema = z.object({
  grantId: z.string().min(1),
  milestoneId: z.string().min(1),
  title: z.string().min(2),
  type: z.enum(EVIDENCE_TYPES as [string, ...string[]]),
  uploaderWallet: wallet,
  visibility: z.enum(["public", "private"])
});

export const proofPacketCreateSchema = z.object({
  grantId: z.string().min(1),
  milestoneId: z.string().min(1),
  builderWallet: wallet,
  sponsorWallet: wallet,
  summary: z.string().min(12),
  evidenceIds: z.array(z.string()).min(1)
});

export const sponsorReviewSchema = z.object({
  proofId: z.string().min(1),
  grantId: z.string().min(1),
  milestoneId: z.string().min(1),
  reviewerWallet: wallet,
  decision: z.enum(["approved", "revision_requested", "rejected"]),
  notes: z.string().max(2000).optional()
});

export function validateEvidenceFile(file: File) {
  if (!ACCEPTED_FILE_TYPES.includes(file.type) && !file.name.endsWith(".log")) {
    return { valid: false, error: "Unsupported file type" };
  }

  const limit = file.type.startsWith("image/")
    ? FILE_LIMITS.image
    : file.type.startsWith("video/")
      ? FILE_LIMITS.video
      : FILE_LIMITS.document;

  if (file.size > limit) {
    return { valid: false, error: `File is too large. Limit is ${Math.round(limit / 1024 / 1024)}MB.` };
  }

  return { valid: true };
}
