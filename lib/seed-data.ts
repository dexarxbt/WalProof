import type { AppRecordSet, EvidenceType, GrantStatus, MilestoneStatus } from "@/lib/types";

const deployer = "0xa521a37bd92329ca310aeb31f12ab8b039a9ac9b3535b63780f9e9ae142d6306";

type SeedGrantInput = {
  id: string;
  name: string;
  fundingLabel: string;
  description: string;
  metadataHash: string;
  suiObjectId: string;
  createTxDigest: string;
  createdAt: string;
  projectUrl: string;
  milestoneTitle: string;
  milestoneDescription: string;
  requiredEvidenceTypes: EvidenceType[];
  status?: GrantStatus;
  milestoneStatus?: MilestoneStatus;
  proofId?: string;
};

const seedGrantInputs: SeedGrantInput[] = [
  {
    id: "mainnet-grant-walrus-storage",
    name: "Walrus Storage Integration",
    fundingLabel: "Mainnet seed record 1",
    description:
      "A real Sui mainnet Grant Room object created from the deployed WalProof registry package. Walrus evidence upload requires WAL in the connected wallet.",
    metadataHash: "walproof-mainnet-grant-walrus-storage",
    suiObjectId: "0x08c55dad12469e28c3495371e583f979bf29395eeeecf0c3cc03259f5170710b",
    createTxDigest: "6jKMRx2kmt8JK7AvUQKokPDahE3eiDuLwswTjEGWsroW",
    createdAt: "2026-05-29T10:56:40.000Z",
    projectUrl: "https://www.walrus.xyz/",
    milestoneTitle: "Walrus Storage Integration",
    milestoneDescription: "Connect real Walrus evidence upload through the official mainnet upload relay.",
    requiredEvidenceTypes: ["json_proof_packet", "walrus_blob_proof"],
    milestoneStatus: "submitted",
    proofId: "mainnet-proof-walrus-storage"
  },
  {
    id: "mainnet-grant-tatum-verification",
    name: "Tatum Verification Layer",
    fundingLabel: "Mainnet seed record 2",
    description: "A real Sui mainnet Grant Room object used to demonstrate Tatum-powered transaction lookup and object verification.",
    metadataHash: "walproof-mainnet-grant-tatum-verification",
    suiObjectId: "0x077a5b245e00a13498679b9d2921c5a2f7eadc70b21f64f5508b32402785f673",
    createTxDigest: "8pCH1U2nXvDT45EvhydYthH5v3u8fdtYy3jGRrR7iJkR",
    createdAt: "2026-05-29T10:56:50.000Z",
    projectUrl: "https://tatum.io/",
    milestoneTitle: "Tatum Mainnet Verification",
    milestoneDescription: "Verify Sui transaction and object references through the server-side Tatum RPC route.",
    requiredEvidenceTypes: ["sui_transaction_proof", "log_file"]
  },
  {
    id: "mainnet-grant-public-proof",
    name: "Public Proof Page",
    fundingLabel: "Mainnet seed record 3",
    description: "A real Sui mainnet Grant Room object created for the public WalProof demo data that ships with the app.",
    metadataHash: "walproof-mainnet-grant-public-proof",
    suiObjectId: "0x6e7a7a8c19fdd30baf9b87d66d003cc2d0e91d83d349fd6058c2d1b43dd9b2ab",
    createTxDigest: "CHFhPZUWBrNkGJj1VJWKxma8yVsQ4mZDcyxrPY9q79Y9",
    createdAt: "2026-05-29T10:57:00.000Z",
    projectUrl: "https://sui.io/",
    milestoneTitle: "Public Proof Page",
    milestoneDescription: "Show public verification cards, transaction references, and the proof timeline.",
    requiredEvidenceTypes: ["deployment_link", "final_report"]
  },
  {
    id: "mainnet-grant-evidence-vault-audit",
    name: "Evidence Vault Audit",
    fundingLabel: "Mainnet seed record 4",
    description: "A real Sui mainnet Grant Room object for evidence vault inspection and transaction visibility.",
    metadataHash: "walproof-mainnet-evidence-vault-audit",
    suiObjectId: "0xc46c23f93c7f11c7750eb4e9cec21bd8ebec29b98d0c661b34d0d19b164a24b6",
    createTxDigest: "HhtjxHHJ2kaYY9sELAfZL21LvDJXK6YRmkVdspoZJipm",
    createdAt: "2026-05-29T11:10:00.000Z",
    projectUrl: "https://www.walrus.xyz/",
    milestoneTitle: "Evidence Vault Audit",
    milestoneDescription: "Track how uploaded evidence is referenced from public Grant Room records.",
    requiredEvidenceTypes: ["screenshot", "json_proof_packet"]
  },
  {
    id: "mainnet-grant-sponsor-review-decision",
    name: "Sponsor Review Decision",
    fundingLabel: "Mainnet seed record 5",
    description: "A real Sui mainnet Grant Room object for sponsor review decision flows.",
    metadataHash: "walproof-mainnet-sponsor-review-decision",
    suiObjectId: "0x081539275d68fa8fbd21821cbf1bf0a7eba277b060b618752ddd98e87bc70a46",
    createTxDigest: "BM3gvZESET7xWyECXxVbJAPYZDmaNdcCfBAvtWQqcJPt",
    createdAt: "2026-05-29T11:11:40.000Z",
    projectUrl: "https://sui.io/",
    milestoneTitle: "Sponsor Review Decision",
    milestoneDescription: "Prepare a Funding Decision record after proof packet verification.",
    requiredEvidenceTypes: ["final_report", "sui_transaction_proof"]
  },
  {
    id: "mainnet-grant-funding-decision-trail",
    name: "Funding Decision Trail",
    fundingLabel: "Mainnet seed record 6",
    description: "A real Sui mainnet Grant Room object for funding decision audit trails.",
    metadataHash: "walproof-mainnet-funding-decision-trail",
    suiObjectId: "0xf7911923a5065ee2f5322a49da9008eff52d1b2cadbff0b08dd9029e1812e198",
    createTxDigest: "EBxGYRZnnRKEAgHsdiYiWdxPBjxFZb3dudBGfhjqWfus",
    createdAt: "2026-05-29T11:13:20.000Z",
    projectUrl: "https://tatum.io/",
    milestoneTitle: "Funding Decision Trail",
    milestoneDescription: "Show the public trail from milestone evidence to sponsor outcome.",
    requiredEvidenceTypes: ["final_report", "log_file"]
  },
  {
    id: "mainnet-grant-checkpoint-verification",
    name: "Checkpoint Verification",
    fundingLabel: "Mainnet seed record 7",
    description: "A real Sui mainnet Grant Room object for checkpoint-backed Tatum verification.",
    metadataHash: "walproof-mainnet-checkpoint-verification",
    suiObjectId: "0x1ec99c3f5cae4effcb99b39e011984784cf727da17d726db76d3841b467f6069",
    createTxDigest: "4ce1kXhTrwJdmpmZh9GC1ug9fecAaMMe1BFDDNHwFcZW",
    createdAt: "2026-05-29T11:15:00.000Z",
    projectUrl: "https://sui.io/",
    milestoneTitle: "Checkpoint Verification",
    milestoneDescription: "Verify that records resolve to successful Sui checkpoints through Tatum RPC.",
    requiredEvidenceTypes: ["sui_transaction_proof", "log_file"]
  },
  {
    id: "mainnet-grant-room-indexing",
    name: "Grant Room Indexing",
    fundingLabel: "Mainnet seed record 8",
    description: "A real Sui mainnet Grant Room object for public index and dashboard rendering.",
    metadataHash: "walproof-mainnet-grant-room-indexing",
    suiObjectId: "0x0e34971803a6c3c69796c16f26b6f2f93e86795f87401fd1681d7f739f977825",
    createTxDigest: "GAY9GqUQ88iBuEGcmrfUEyt3ShRC9NTFFKNfkr4zjjtd",
    createdAt: "2026-05-29T11:16:40.000Z",
    projectUrl: "https://sui.io/",
    milestoneTitle: "Grant Room Indexing",
    milestoneDescription: "Expose real mainnet records in dashboard cards after deployment.",
    requiredEvidenceTypes: ["json_proof_packet", "deployment_link"]
  },
  {
    id: "mainnet-grant-builder-milestone-evidence",
    name: "Builder Milestone Evidence",
    fundingLabel: "Mainnet seed record 9",
    description: "A real Sui mainnet Grant Room object for builder evidence submission flows.",
    metadataHash: "walproof-mainnet-builder-milestone-evidence",
    suiObjectId: "0xd1e7ca21ffcf82b73ecc59a0889ba9949965916f2e1ddaddc3ecc4cd32ee765c",
    createTxDigest: "D6mNUuFFZuLHJqvyegXdziJvXku9qiQt4baYsbc2TRME",
    createdAt: "2026-05-29T11:18:20.000Z",
    projectUrl: "https://www.walrus.xyz/",
    milestoneTitle: "Builder Milestone Evidence",
    milestoneDescription: "Represent builder-submitted evidence before sponsor review.",
    requiredEvidenceTypes: ["demo_video", "github_proof", "walrus_blob_proof"]
  },
  {
    id: "mainnet-grant-sui-object-lookup",
    name: "Sui Object Lookup",
    fundingLabel: "Mainnet seed record 10",
    description: "A real Sui mainnet Grant Room object for object reference lookup through Tatum.",
    metadataHash: "walproof-mainnet-sui-object-lookup",
    suiObjectId: "0x779c3907c37861d8092fe751465efd5fc04c18f51eccf347438dd1d0b8dc8cf4",
    createTxDigest: "5sobTVqpu66Fc65GhtqxdHhWW2N3LqkRBQAs4xM8hb1A",
    createdAt: "2026-05-29T11:20:00.000Z",
    projectUrl: "https://sui.io/",
    milestoneTitle: "Sui Object Lookup",
    milestoneDescription: "Keep object IDs visible and verifiable from public pages.",
    requiredEvidenceTypes: ["sui_transaction_proof", "other"]
  },
  {
    id: "mainnet-grant-demo-readiness",
    name: "Mainnet Demo Readiness",
    fundingLabel: "Mainnet seed record 11",
    description: "A real Sui mainnet Grant Room object for the final launch/demo data set.",
    metadataHash: "walproof-mainnet-demo-readiness",
    suiObjectId: "0xd51925045e88b9049c4ab477b73f2c1b215974b48357e3993c3b47854551aa97",
    createTxDigest: "ExYSQFQaQhT2AXVrVbMXZxk8JipH4eb1WktCFoxro7qq",
    createdAt: "2026-05-29T11:21:40.000Z",
    projectUrl: "https://tatum.io/",
    milestoneTitle: "Mainnet Demo Readiness",
    milestoneDescription: "Show that the Vercel deployment ships with real mainnet records.",
    requiredEvidenceTypes: ["deployment_link", "final_report"]
  }
];

export const seedRecords: AppRecordSet = {
  grants: seedGrantInputs.map((item) => ({
    id: item.id,
    name: item.name,
    sponsorName: "WalProof Mainnet Sponsor",
    builderName: "WalProof Core Builder",
    sponsorWallet: deployer,
    builderWallet: deployer,
    fundingLabel: item.fundingLabel,
    projectUrl: item.projectUrl,
    githubUrl: "https://github.com/MystenLabs/sui",
    description: item.description,
    network: "mainnet",
    status: item.status ?? "active",
    metadataHash: item.metadataHash,
    suiObjectId: item.suiObjectId,
    createTxDigest: item.createTxDigest,
    createdAt: item.createdAt,
    updatedAt: item.createdAt
  })),
  milestones: seedGrantInputs.map((item) => ({
    id: `${item.id}-milestone`,
    grantId: item.id,
    title: item.milestoneTitle,
    description: item.milestoneDescription,
    fundingLabel: item.fundingLabel,
    requiredEvidenceTypes: item.requiredEvidenceTypes,
    status: item.milestoneStatus ?? "in_progress",
    proofId: item.proofId,
    createdAt: item.createdAt,
    updatedAt: item.createdAt
  })),
  evidence: [
    {
      id: "mainnet-evidence-walrus-proof-packet",
      grantId: "mainnet-grant-walrus-storage",
      milestoneId: "mainnet-grant-walrus-storage-milestone",
      title: "Seed Proof Packet JSON",
      type: "json_proof_packet",
      mimeType: "application/json",
      size: 1420,
      originalFileName: "walproof-seed-proof-packet.json",
      walrusBlobId: "m_wOf8Q5RgMCFb_Uo3Zoxk-ie63miM99_xP9f54SjP0",
      walrusUrl: "/api/walrus/read?blobId=m_wOf8Q5RgMCFb_Uo3Zoxk-ie63miM99_xP9f54SjP0",
      contentHash: "94388789e65e4780f2a3ef304a1915ea3044061153172a1532d29001dcd812f9",
      uploaderWallet: deployer,
      visibility: "public",
      status: "verified",
      uploadedAt: "2026-05-29T11:13:13.749Z"
    }
  ],
  proofPackets: [
    {
      id: "mainnet-proof-walrus-storage",
      grantId: "mainnet-grant-walrus-storage",
      milestoneId: "mainnet-grant-walrus-storage-milestone",
      builderWallet: deployer,
      sponsorWallet: deployer,
      summary: "Real Walrus mainnet seed Proof Packet registered through the deployed WalProof registry.",
      evidence: [
        {
          id: "mainnet-evidence-walrus-proof-packet",
          grantId: "mainnet-grant-walrus-storage",
          milestoneId: "mainnet-grant-walrus-storage-milestone",
          title: "Seed Proof Packet JSON",
          type: "json_proof_packet",
          mimeType: "application/json",
          size: 1420,
          originalFileName: "walproof-seed-proof-packet.json",
          walrusBlobId: "m_wOf8Q5RgMCFb_Uo3Zoxk-ie63miM99_xP9f54SjP0",
          walrusUrl: "/api/walrus/read?blobId=m_wOf8Q5RgMCFb_Uo3Zoxk-ie63miM99_xP9f54SjP0",
          contentHash: "94388789e65e4780f2a3ef304a1915ea3044061153172a1532d29001dcd812f9",
          uploaderWallet: deployer,
          visibility: "public",
          status: "verified",
          uploadedAt: "2026-05-29T11:13:13.749Z"
        }
      ],
      proofPacketBlobId: "m_wOf8Q5RgMCFb_Uo3Zoxk-ie63miM99_xP9f54SjP0",
      proofPacketHash: "94388789e65e4780f2a3ef304a1915ea3044061153172a1532d29001dcd812f9",
      suiProofObjectId: "0xfc69fa3c8cd6ae140db7e58db739e0f7d887ee5daabbe25b35267f1aae55154b",
      submitTxDigest: "D8AoW5gGBNgCyw4a2bdQyoDQrjjWKMR5FFp6eK7HzNRp",
      status: "verified",
      createdAt: "2026-05-29T11:13:13.749Z"
    }
  ],
  reviews: []
};
