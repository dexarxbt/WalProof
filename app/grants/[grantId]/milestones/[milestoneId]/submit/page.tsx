"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/form";
import { EvidenceCard } from "@/components/walproof/EvidenceCard";
import { EmptyState } from "@/components/walproof/EmptyState";
import { UploadZone } from "@/components/walproof/UploadZone";
import { buildSubmitProofTx } from "@/lib/contract";
import { createProofPacketPayload } from "@/lib/proof-packet";
import { storageAdapter } from "@/lib/storage-adapter";
import { getTransactionBlock } from "@/lib/tatum";
import { uploadEvidenceToWalrus, uploadJsonToWalrus } from "@/lib/walrus";
import { createId } from "@/lib/utils";
import type { EvidenceFile, SubmitProofState } from "@/lib/types";

export default function SubmitProofPage() {
  const params = useParams<{ grantId: string; milestoneId: string }>();
  const account = useCurrentAccount();
  const { mutateAsync } = useSignAndExecuteTransaction();
  const records = useSyncExternalStore(storageAdapter.subscribe, storageAdapter.list, storageAdapter.list);
  const grant = records.grants.find((item) => item.id === params.grantId);
  const milestone = records.milestones.find((item) => item.id === params.milestoneId);
  const evidence = records.evidence.filter((item) => item.milestoneId === params.milestoneId);
  const [summary, setSummary] = useState("");
  const [state, setState] = useState<SubmitProofState>("idle");
  const [error, setError] = useState<string>();
  const [publicProofId, setPublicProofId] = useState<string>();

  if (!grant || !milestone) {
    return <AppShell><EmptyState title="Milestone not found" body="Create a Grant Room before submitting proof." href="/dashboard" action="Back to dashboard" /></AppShell>;
  }

  const grantRoom = grant;
  const milestoneRecord = milestone;

  async function uploadFile(file: File) {
    if (!account) {
      setError("Connect the builder wallet before uploading evidence.");
      return;
    }
    try {
      setError(undefined);
      setState("uploading_evidence_to_walrus");
      const uploaded = await uploadEvidenceToWalrus(file, {
        ownerAddress: account.address,
        signAndExecuteTransaction: mutateAsync as never
      });
      const record: EvidenceFile = {
        id: createId("evidence"),
        grantId: grantRoom.id,
        milestoneId: milestoneRecord.id,
        title: file.name,
        type: file.type.startsWith("video/") ? "demo_video" : file.type === "application/pdf" ? "pdf" : "other",
        mimeType: uploaded.mimeType,
        size: uploaded.size,
        originalFileName: file.name,
        walrusBlobId: uploaded.blobId,
        walrusUrl: `/api/walrus/read?blobId=${encodeURIComponent(uploaded.blobId)}`,
        contentHash: uploaded.contentHash,
        uploaderWallet: account.address,
        visibility: "public",
        status: "stored_on_walrus",
        uploadedAt: new Date().toISOString()
      };
      storageAdapter.upsertEvidence(record);
      setState("evidence_uploaded");
    } catch (err) {
      setState("failed");
      setError(err instanceof Error ? err.message : "Walrus upload failed");
    }
  }

  async function registerProof() {
    if (!account) {
      setError("Connect a Sui wallet before registering proof.");
      return;
    }
    if (!evidence.length) {
      setError("Upload at least one real Walrus evidence blob before creating a Proof Packet.");
      return;
    }
    try {
      setError(undefined);
      setState("creating_proof_packet");
      const payload = await createProofPacketPayload({ grant: grantRoom, milestone: milestoneRecord, evidence, summary });
      setState("uploading_proof_packet_to_walrus");
      const upload = await uploadJsonToWalrus(payload.packet, `walproof-proof-${payload.id}.json`, {
        ownerAddress: account.address,
        signAndExecuteTransaction: mutateAsync as never
      });
      setState("proof_packet_uploaded");
      setState("waiting_for_wallet_signature");
      const tx = await buildSubmitProofTx({
        grantRef: grantRoom.id,
        milestoneRef: milestoneRecord.id,
        sponsor: grantRoom.sponsorWallet,
        proofPacketBlobId: upload.blobId,
        proofPacketHash: payload.hash,
        createdAtMs: Date.now()
      });
      const result = await mutateAsync({ transaction: tx as never });
      setState("verifying_with_tatum");
      await getTransactionBlock(result.digest);
      storageAdapter.upsertProofPacket({
        id: payload.id,
        grantId: grantRoom.id,
        milestoneId: milestoneRecord.id,
        builderWallet: grantRoom.builderWallet,
        sponsorWallet: grantRoom.sponsorWallet,
        summary,
        evidence,
        proofPacketBlobId: upload.blobId,
        proofPacketHash: payload.hash,
        submitTxDigest: result.digest,
        status: "verified",
        createdAt: payload.createdAt
      });
      setPublicProofId(payload.id);
      setState("registered");
    } catch (err) {
      setState("failed");
      setError(err instanceof Error ? err.message : "Proof registration failed");
    }
  }

  return (
    <AppShell>
      <h1 className="font-[var(--font-heading)] text-4xl font-bold">Submit Proof</h1>
      <p className="mb-6 mt-2 text-slate">{grantRoom.name} · {milestoneRecord.title}</p>
      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <Card>
          <div className="grid gap-5">
            <Textarea placeholder="Builder update for the Proof Packet" value={summary} onChange={(event) => setSummary(event.target.value)} />
            <UploadZone onFile={uploadFile} />
            <Button disabled={!summary || !evidence.length} onClick={registerProof}>Create Proof Packet and Register Proof on Sui</Button>
            <p className="text-sm text-slate">Submit Proof State: {state}</p>
            {error ? <p className="text-sm font-semibold text-danger">{error}</p> : null}
            {publicProofId ? <Link className="text-sm font-semibold text-ice" href={`/proof/${publicProofId}`}>View Public Proof Page</Link> : null}
          </div>
        </Card>
        <div className="grid gap-3">
          {evidence.map((item) => <EvidenceCard evidence={item} key={item.id} />)}
        </div>
      </div>
    </AppShell>
  );
}
