import Link from "next/link";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/walproof/StatusBadge";
import type { Milestone } from "@/lib/types";

export function MilestoneCard({ milestone }: { milestone: Milestone }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{milestone.title}</CardTitle>
        <StatusBadge status={milestone.status} />
      </CardHeader>
      <p className="mb-4 text-sm text-slate">{milestone.description}</p>
      <p className="mb-5 text-sm font-semibold text-ice">{milestone.fundingLabel}</p>
      <Link href={`/grants/${milestone.grantId}/milestones/${milestone.id}/submit`}>
        <Button variant="secondary">
          <UploadCloud size={16} />
          Submit Proof
        </Button>
      </Link>
    </Card>
  );
}
