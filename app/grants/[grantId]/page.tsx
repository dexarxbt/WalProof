"use client";

import { useParams } from "next/navigation";
import { useSyncExternalStore } from "react";
import { AppShell } from "@/components/app/AppShell";
import { EvidenceVault } from "@/components/walproof/EvidenceVault";
import { MilestoneCard } from "@/components/walproof/MilestoneCard";
import { ProofPacketCard } from "@/components/walproof/ProofPacketCard";
import { ProofTimeline } from "@/components/walproof/ProofTimeline";
import { VerificationCard } from "@/components/walproof/VerificationCard";
import { WalletPill } from "@/components/walproof/WalletPill";
import { EmptyState } from "@/components/walproof/EmptyState";
import { SuiObjectPill } from "@/components/walproof/SuiObjectPill";
import { TransactionPill } from "@/components/walproof/TransactionPill";
import { storageAdapter } from "@/lib/storage-adapter";

export default function GrantDetailPage() {
  const params = useParams<{ grantId: string }>();
  const records = useSyncExternalStore(storageAdapter.subscribe, storageAdapter.list, storageAdapter.list);
  const grant = records.grants.find((item) => item.id === params.grantId);
  const milestones = records.milestones.filter((item) => item.grantId === params.grantId);
  const evidence = records.evidence.filter((item) => item.grantId === params.grantId);
  const proof = records.proofPackets.find((item) => item.grantId === params.grantId);

  if (!grant) {
    return <AppShell><EmptyState title="Grant Room not found" body="This local adapter has no Grant Room for that ID." href="/dashboard" action="Back to dashboard" /></AppShell>;
  }

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="font-[var(--font-heading)] text-4xl font-bold">{grant.name}</h1>
        <p className="mt-2 max-w-3xl text-slate">{grant.description}</p>
        <div className="mt-4 flex flex-wrap gap-2"><WalletPill address={grant.sponsorWallet} /><WalletPill address={grant.builderWallet} /></div>
      </div>
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <VerificationCard title="Stored on Walrus" state={evidence.length ? "success" : "warning"} detail={`${evidence.length} evidence files in the vault`} />
        <VerificationCard title="Registered on Sui" state={proof?.submitTxDigest || grant.createTxDigest ? "success" : "warning"} detail={proof?.submitTxDigest ?? grant.createTxDigest ?? "No proof transaction yet"} />
        <VerificationCard title="Verified through Tatum" state={proof?.status === "verified" || grant.createTxDigest ? "success" : "warning"} detail={grant.createTxDigest ? "Mainnet Grant Room transaction verified through Tatum RPC." : "Tatum RPC verifies Sui transactions after wallet execution."} />
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        {grant.createTxDigest ? <TransactionPill digest={grant.createTxDigest} /> : null}
        {grant.suiObjectId ? <SuiObjectPill label="Grant object" objectId={grant.suiObjectId} /> : null}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <div className="grid gap-4">{milestones.map((milestone) => <MilestoneCard milestone={milestone} key={milestone.id} />)}</div>
        <div className="grid gap-4">
          <EvidenceVault evidence={evidence} />
          <ProofPacketCard proof={proof} />
          <ProofTimeline items={["Grant Room created", "Milestone Evidence uploaded", "Proof Packet created", "Sui Record registered", "Sponsor Review recorded"]} />
        </div>
      </div>
    </AppShell>
  );
}
