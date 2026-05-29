import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { BlobIdPill } from "@/components/walproof/BlobIdPill";
import { SuiObjectPill } from "@/components/walproof/SuiObjectPill";
import { StatusBadge } from "@/components/walproof/StatusBadge";
import type { ProofPacket } from "@/lib/types";

export function ProofPacketCard({ proof }: { proof?: ProofPacket }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Proof Packet</CardTitle>
        {proof ? <StatusBadge status={proof.status} /> : null}
      </CardHeader>
      {proof ? (
        <div className="space-y-3">
          <p className="text-sm text-slate">{proof.summary}</p>
          <BlobIdPill blobId={proof.proofPacketBlobId} />
          {proof.suiProofObjectId ? <SuiObjectPill label="Proof object" objectId={proof.suiProofObjectId} /> : null}
          <p className="mono break-all text-xs text-slate">hash: {proof.proofPacketHash}</p>
        </div>
      ) : (
        <p className="text-sm text-slate">No Proof Packet has been created for this milestone.</p>
      )}
    </Card>
  );
}
