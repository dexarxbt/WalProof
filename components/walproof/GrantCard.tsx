import Link from "next/link";
import { ArrowRight, Boxes } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/walproof/StatusBadge";
import { FundingProgress } from "@/components/walproof/FundingProgress";
import { WalletPill } from "@/components/walproof/WalletPill";
import type { GrantRoom, Milestone } from "@/lib/types";

export function GrantCard({ grant, milestones }: { grant: GrantRoom; milestones: Milestone[] }) {
  const approved = milestones.filter((item) => item.status === "approved").length;
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{grant.name}</CardTitle>
          <p className="mt-1 text-sm text-slate">{grant.sponsorName} funding {grant.builderName}</p>
        </div>
        <StatusBadge status={grant.status} />
      </CardHeader>
      <div className="mb-5 flex flex-wrap gap-2">
        <WalletPill address={grant.builderWallet} />
        <span className="rounded-full border border-border px-2.5 py-1 text-xs font-semibold text-ice">{grant.fundingLabel}</span>
      </div>
      <FundingProgress current={approved} total={Math.max(milestones.length, 1)} />
      <Link href={`/grants/${grant.id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ice">
        Open Grant Room <ArrowRight size={16} />
      </Link>
      <div className="mt-4 flex items-center gap-2 text-xs text-slate">
        <Boxes size={15} />
        {milestones.length} milestones
      </div>
    </Card>
  );
}
