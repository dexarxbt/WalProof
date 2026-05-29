"use client";

import { useSyncExternalStore } from "react";
import { BadgeCheck, Boxes, Database, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { EmptyState } from "@/components/walproof/EmptyState";
import { GrantCard } from "@/components/walproof/GrantCard";
import { MetricCard } from "@/components/walproof/MetricCard";
import { storageAdapter } from "@/lib/storage-adapter";

export default function DashboardPage() {
  const records = useSyncExternalStore(storageAdapter.subscribe, storageAdapter.list, storageAdapter.list);
  const pendingReviews = records.proofPackets.filter((proof) => !records.reviews.some((review) => review.proofId === proof.id));
  const suiRecordCount = records.proofPackets.filter((proof) => proof.submitTxDigest).length + records.grants.filter((grant) => grant.createTxDigest).length;

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="font-[var(--font-heading)] text-4xl font-bold">Grant Rooms</h1>
        <p className="mt-2 text-slate">Track Walrus evidence, Sui Records, and Sponsor Review decisions.</p>
      </div>
      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Active Grants" value={records.grants.length} icon={<Boxes size={18} />} />
        <MetricCard label="Pending Reviews" value={pendingReviews.length} icon={<ShieldCheck size={18} />} />
        <MetricCard label="Evidence Stored" value={records.evidence.length} icon={<Database size={18} />} />
        <MetricCard label="Sui Records" value={suiRecordCount} icon={<BadgeCheck size={18} />} />
        <MetricCard label="Approved Milestones" value={records.reviews.filter((review) => review.decision === "approved").length} />
      </div>
      {records.grants.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {records.grants.map((grant) => (
            <GrantCard
              grant={grant}
              key={grant.id}
              milestones={records.milestones.filter((milestone) => milestone.grantId === grant.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No Grant Rooms yet" body="Create a Grant Room, then submit Milestone Evidence and register Proof Packets." href="/grants/new" action="Create Grant Room" />
      )}
    </AppShell>
  );
}
