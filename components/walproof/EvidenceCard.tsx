import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BlobIdPill } from "@/components/walproof/BlobIdPill";
import { StatusBadge } from "@/components/walproof/StatusBadge";
import { formatBytes, titleCase } from "@/lib/format";
import type { EvidenceFile } from "@/lib/types";

export function EvidenceCard({ evidence }: { evidence: EvidenceFile }) {
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <FileText className="mt-1 text-ice" size={18} />
          <div>
            <h3 className="font-semibold text-white">{evidence.title}</h3>
            <p className="text-xs text-slate">{titleCase(evidence.type)} · {formatBytes(evidence.size)}</p>
          </div>
        </div>
        <StatusBadge status={evidence.status} />
      </div>
      <BlobIdPill blobId={evidence.walrusBlobId} />
    </Card>
  );
}
