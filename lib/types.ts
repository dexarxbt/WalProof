export type Network = "mainnet" | "testnet" | "devnet";

export type GrantStatus =
  | "draft"
  | "active"
  | "under_review"
  | "approved"
  | "completed"
  | "disputed";

export type MilestoneStatus =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "under_review"
  | "revision_requested"
  | "approved"
  | "rejected";

export type EvidenceStatus =
  | "idle"
  | "uploading"
  | "stored_on_walrus"
  | "failed"
  | "verified";

export type SponsorDecision = "approved" | "revision_requested" | "rejected";

export type EvidenceType =
  | "demo_video"
  | "screenshot"
  | "github_proof"
  | "deployment_link"
  | "walrus_blob_proof"
  | "sui_transaction_proof"
  | "architecture_diagram"
  | "final_report"
  | "json_proof_packet"
  | "pdf"
  | "log_file"
  | "other";

export type GrantRoom = {
  id: string;
  name: string;
  sponsorName: string;
  builderName: string;
  sponsorWallet: string;
  builderWallet: string;
  fundingLabel: string;
  projectUrl?: string;
  githubUrl?: string;
  description: string;
  network: Network;
  status: GrantStatus;
  metadataHash?: string;
  suiObjectId?: string;
  createTxDigest?: string;
  createdAt: string;
  updatedAt: string;
};

export type Milestone = {
  id: string;
  grantId: string;
  title: string;
  description: string;
  fundingLabel: string;
  dueDate?: string;
  requiredEvidenceTypes: EvidenceType[];
  status: MilestoneStatus;
  proofId?: string;
  createdAt: string;
  updatedAt: string;
};

export type EvidenceFile = {
  id: string;
  grantId: string;
  milestoneId: string;
  title: string;
  type: EvidenceType;
  mimeType: string;
  size: number;
  originalFileName: string;
  walrusBlobId: string;
  walrusUrl?: string;
  contentHash: string;
  uploaderWallet: string;
  visibility: "public" | "private";
  status: EvidenceStatus;
  uploadedAt: string;
};

export type ProofPacket = {
  id: string;
  grantId: string;
  milestoneId: string;
  builderWallet: string;
  sponsorWallet: string;
  summary: string;
  evidence: EvidenceFile[];
  proofPacketBlobId: string;
  proofPacketHash: string;
  suiProofObjectId?: string;
  submitTxDigest?: string;
  status: "created" | "registered_on_sui" | "verified";
  createdAt: string;
};

export type ReviewRecord = {
  id: string;
  proofId: string;
  grantId: string;
  milestoneId: string;
  reviewerWallet: string;
  decision: SponsorDecision;
  notes?: string;
  reviewPacketBlobId?: string;
  reviewPacketHash?: string;
  reviewObjectId?: string;
  reviewTxDigest?: string;
  createdAt: string;
};

export type SubmitProofState =
  | "idle"
  | "validating"
  | "uploading_evidence_to_walrus"
  | "evidence_uploaded"
  | "creating_proof_packet"
  | "uploading_proof_packet_to_walrus"
  | "proof_packet_uploaded"
  | "waiting_for_wallet_signature"
  | "submitting_to_sui"
  | "verifying_with_tatum"
  | "registered"
  | "failed";

export type AppRecordSet = {
  grants: GrantRoom[];
  milestones: Milestone[];
  evidence: EvidenceFile[];
  proofPackets: ProofPacket[];
  reviews: ReviewRecord[];
};
