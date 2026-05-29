"use client";

import { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/form";
import { buildReviewProofTx } from "@/lib/contract";
import { getTransactionBlock } from "@/lib/tatum";
import { uploadJsonToWalrus } from "@/lib/walrus";
import { storageAdapter } from "@/lib/storage-adapter";
import { createId, sha256Hex } from "@/lib/utils";
import type { ProofPacket, SponsorDecision } from "@/lib/types";

export function SponsorDecisionPanel({ proof }: { proof?: ProofPacket }) {
  const account = useCurrentAccount();
  const { mutateAsync } = useSignAndExecuteTransaction();
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState<string>();

  async function decide(decision: SponsorDecision) {
    if (!proof || !account) return;
    setError(undefined);
    try {
      setStatus("uploading review packet to Walrus");
      const reviewPacket = { proofId: proof.id, decision, notes, reviewerWallet: account.address, createdAt: new Date().toISOString() };
      const reviewHash = await sha256Hex(JSON.stringify(reviewPacket));
      const upload = await uploadJsonToWalrus(reviewPacket, `walproof-review-${proof.id}.json`, {
        ownerAddress: account.address,
        signAndExecuteTransaction: mutateAsync as never
      });
      setStatus("waiting for wallet signature");
      const tx = await buildReviewProofTx({
        proofRef: proof.id,
        decision,
        reviewPacketBlobId: upload.blobId,
        reviewPacketHash: reviewHash,
        createdAtMs: Date.now()
      });
      const result = await mutateAsync({ transaction: tx as never });
      setStatus("verifying with Tatum");
      await getTransactionBlock(result.digest);
      storageAdapter.upsertReview({
        id: createId("review"),
        proofId: proof.id,
        grantId: proof.grantId,
        milestoneId: proof.milestoneId,
        reviewerWallet: account.address,
        decision,
        notes,
        reviewPacketBlobId: upload.blobId,
        reviewPacketHash: reviewHash,
        reviewTxDigest: result.digest,
        createdAt: new Date().toISOString()
      });
      setStatus("verified through Tatum");
    } catch (err) {
      setStatus("failed");
      setError(err instanceof Error ? err.message : "Sponsor Review failed");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sponsor Review</CardTitle>
      </CardHeader>
      <Textarea placeholder="Reviewer notes for the Funding Decision" value={notes} onChange={(event) => setNotes(event.target.value)} />
      <div className="mt-4 flex flex-wrap gap-3">
        <Button disabled={!proof || !account} onClick={() => decide("approved")}>Approve Milestone</Button>
        <Button disabled={!proof || !account} onClick={() => decide("revision_requested")} variant="secondary">Request Revision</Button>
        <Button disabled={!proof || !account} onClick={() => decide("rejected")} variant="danger">Reject Milestone</Button>
      </div>
      {!account ? <p className="mt-3 text-sm text-slate">Connect a wallet with SUI and WAL to upload the review packet and record the Funding Decision.</p> : null}
      <p className="mt-4 text-sm text-slate">State: {status}</p>
      {error ? <p className="mt-2 text-sm font-semibold text-danger">{error}</p> : null}
    </Card>
  );
}
