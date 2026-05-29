import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/walproof/StatusBadge";
import type { GrantRoom, Milestone, ProofPacket } from "@/lib/types";

export function PublicProofHeader({ grant, milestone, proof }: { grant?: GrantRoom; milestone?: Milestone; proof?: ProofPacket }) {
  return (
    <Card className="mb-6">
      <StatusBadge status={proof?.status ?? "proof_not_found"} />
      <h1 className="mt-4 font-[var(--font-heading)] text-4xl font-bold text-white">{milestone?.title ?? "Public Proof Page"}</h1>
      <p className="mt-2 max-w-3xl text-slate">{grant?.name ?? "No local proof record found for this ID."}</p>
      {grant ? <p className="mt-4 text-sm font-semibold text-ice">{grant.sponsorName} funding {grant.builderName} · {grant.fundingLabel}</p> : null}
    </Card>
  );
}
