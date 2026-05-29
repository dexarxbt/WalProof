"use client";

import { useSyncExternalStore } from "react";
import { AppShell } from "@/components/app/AppShell";
import { EmptyState } from "@/components/walproof/EmptyState";
import { ReviewQueue } from "@/components/walproof/ReviewQueue";
import { SponsorDecisionPanel } from "@/components/walproof/SponsorDecisionPanel";
import { storageAdapter } from "@/lib/storage-adapter";

export default function ReviewPage() {
  const records = useSyncExternalStore(storageAdapter.subscribe, storageAdapter.list, storageAdapter.list);
  const pending = records.proofPackets.filter((proof) => !records.reviews.some((review) => review.proofId === proof.id));
  return (
    <AppShell>
      <h1 className="font-[var(--font-heading)] text-4xl font-bold">Sponsor Review</h1>
      <p className="mb-6 mt-2 text-slate">Inspect Walrus evidence, verify the Sui Record through Tatum, then record a Funding Decision.</p>
      {pending.length ? (
        <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
          <ReviewQueue proofs={pending} />
          <SponsorDecisionPanel proof={pending[0]} />
        </div>
      ) : (
        <EmptyState title="No pending Sponsor Reviews" body="Submit a milestone Proof Packet to create a review item." href="/dashboard" action="Open dashboard" />
      )}
    </AppShell>
  );
}
