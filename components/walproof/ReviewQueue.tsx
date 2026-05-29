import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ProofPacket } from "@/lib/types";

export function ReviewQueue({ proofs }: { proofs: ProofPacket[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Queue</CardTitle>
      </CardHeader>
      <div className="grid gap-3">
        {proofs.map((proof) => (
          <div className="flex items-center justify-between rounded-card border border-border bg-white/5 p-3" key={proof.id}>
            <div>
              <p className="font-semibold text-white">{proof.id}</p>
              <p className="text-sm text-slate">{proof.summary}</p>
            </div>
            <Link href={`/proof/${proof.id}`}>
              <Button variant="secondary">Inspect</Button>
            </Link>
          </div>
        ))}
      </div>
    </Card>
  );
}
