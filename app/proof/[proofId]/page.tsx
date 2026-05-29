"use client";

import { useParams } from "next/navigation";
import { useSyncExternalStore } from "react";
import { AppShell } from "@/components/app/AppShell";
import { EvidenceVault } from "@/components/walproof/EvidenceVault";
import { ProofPacketCard } from "@/components/walproof/ProofPacketCard";
import { ProofTimeline } from "@/components/walproof/ProofTimeline";
import { PublicProofHeader } from "@/components/walproof/PublicProofHeader";
import { SponsorDecisionPanel } from "@/components/walproof/SponsorDecisionPanel";
import { SuiObjectPill } from "@/components/walproof/SuiObjectPill";
import { TransactionPill } from "@/components/walproof/TransactionPill";
import { VerificationCard } from "@/components/walproof/VerificationCard";
import { storageAdapter } from "@/lib/storage-adapter";

export default function PublicProofPage() {
  const params = useParams<{ proofId: string }>();
  const records = useSyncExternalStore(storageAdapter.subscribe, storageAdapter.list, storageAdapter.list);
  const proofId = params.proofId === "demo-proof" ? "mainnet-proof-walrus-storage" : params.proofId;
  const proof = records.proofPackets.find((item) => item.id === proofId);
  const grant = records.grants.find((item) => item.id === proof?.grantId);
  const milestone = records.milestones.find((item) => item.id === proof?.milestoneId);
  const review = records.reviews.find((item) => item.proofId === proof?.id);

  return (
    <AppShell>
      <PublicProofHeader grant={grant} milestone={milestone} proof={proof} />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <VerificationCard title="Stored on Walrus" state={proof?.proofPacketBlobId ? "success" : "failed"} detail={proof?.proofPacketBlobId ?? "No Proof Packet blob found"} />
        <VerificationCard title="Registered on Sui" state={proof?.submitTxDigest ? "success" : "failed"} detail={proof?.submitTxDigest ?? "No Sui transaction digest found"} />
        <VerificationCard title="Verified through Tatum" state={proof?.status === "verified" ? "success" : "warning"} detail={proof?.status === "verified" ? "Transaction lookup completed" : "Verification pending"} />
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        {proof?.submitTxDigest ? <TransactionPill digest={proof.submitTxDigest} /> : null}
        {proof?.suiProofObjectId ? <SuiObjectPill label="Proof object" objectId={proof.suiProofObjectId} /> : null}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <div className="grid gap-4">
          <EvidenceVault evidence={proof?.evidence ?? []} />
          <ProofPacketCard proof={proof} />
        </div>
        <div className="grid gap-4">
          <ProofTimeline items={["Milestone Evidence stored on Walrus", "Proof Packet stored on Walrus", "Proof Packet reference registered on Sui", review ? `Funding Decision: ${review.decision}` : "Sponsor Review pending"]} />
          {review ? (
            <VerificationCard title="Sponsor Review" state={review.decision === "approved" ? "success" : "warning"} detail={review.notes || review.decision} />
          ) : (
            <SponsorDecisionPanel proof={proof} />
          )}
        </div>
      </div>
    </AppShell>
  );
}
