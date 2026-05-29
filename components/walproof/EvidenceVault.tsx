import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { EvidenceCard } from "@/components/walproof/EvidenceCard";
import type { EvidenceFile } from "@/lib/types";

export function EvidenceVault({ evidence }: { evidence: EvidenceFile[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evidence Vault</CardTitle>
      </CardHeader>
      <div className="grid gap-3">
        {evidence.length ? evidence.map((item) => <EvidenceCard evidence={item} key={item.id} />) : <p className="text-sm text-slate">No Milestone Evidence stored on Walrus yet. Open the demo proof to see the real mainnet Walrus packet.</p>}
      </div>
    </Card>
  );
}
