"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/form";
import { buildCreateGrantTx } from "@/lib/contract";
import { createGrantSchema } from "@/lib/schemas";
import { storageAdapter } from "@/lib/storage-adapter";
import { getTransactionBlock } from "@/lib/tatum";
import { uploadJsonToWalrus } from "@/lib/walrus";
import { createId, sha256Hex } from "@/lib/utils";
import type { EvidenceType, GrantRoom, Milestone } from "@/lib/types";

type FormData = {
  name: string;
  sponsorName: string;
  builderName: string;
  fundingLabel: string;
  sponsorWallet: string;
  builderWallet: string;
  projectUrl: string;
  githubUrl: string;
  description: string;
  network: "mainnet" | "testnet" | "devnet";
};

const defaultMilestones = [
  "Walrus Storage Integration",
  "Tatum Verification Layer",
  "Public Proof Page"
];

export default function NewGrantPage() {
  const router = useRouter();
  const account = useCurrentAccount();
  const { mutateAsync } = useSignAndExecuteTransaction();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState<string>();
  const { register, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      network: "mainnet",
      sponsorWallet: account?.address ?? "",
      builderWallet: "",
      name: "",
      sponsorName: "",
      builderName: "",
      fundingLabel: "",
      projectUrl: "",
      githubUrl: "",
      description: ""
    }
  });

  async function onSubmit(values: FormData) {
    setError(undefined);
    const now = new Date().toISOString();
    const grantId = createId("grant");
    const milestones = defaultMilestones.map((title, index) => ({
      id: createId("milestone"),
      grantId,
      title,
      description: `${title} deliverables, validation notes, and proof files.`,
      fundingLabel: index === 0 ? values.fundingLabel : "Milestone tranche",
      requiredEvidenceTypes: ["demo_video", "github_proof", "json_proof_packet"] as EvidenceType[],
      status: "not_started" as const,
      createdAt: now,
      updatedAt: now
    }));
    const parsed = createGrantSchema.safeParse({ ...values, milestones });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid grant form");
      return;
    }
    if (!account) {
      setError("Connect a Sui wallet before creating a Grant Room.");
      return;
    }

    try {
      setStatus("uploading grant metadata to Walrus");
      const metadata = { ...parsed.data, id: grantId, createdAt: now };
      const metadataHash = await sha256Hex(JSON.stringify(metadata));
      await uploadJsonToWalrus(metadata, `walproof-grant-${grantId}.json`, {
        ownerAddress: account.address,
        signAndExecuteTransaction: mutateAsync as never
      });
      setStatus("waiting for wallet signature");
      const tx = await buildCreateGrantTx({
        sponsor: parsed.data.sponsorWallet,
        builder: parsed.data.builderWallet,
        metadataHash,
        createdAtMs: Date.now()
      });
      const result = await mutateAsync({ transaction: tx as never });
      setStatus("verifying transaction through Tatum");
      await getTransactionBlock(result.digest);
      const grant: GrantRoom = {
        id: grantId,
        name: parsed.data.name,
        sponsorName: parsed.data.sponsorName,
        builderName: parsed.data.builderName,
        sponsorWallet: parsed.data.sponsorWallet,
        builderWallet: parsed.data.builderWallet,
        fundingLabel: parsed.data.fundingLabel,
        projectUrl: parsed.data.projectUrl || undefined,
        githubUrl: parsed.data.githubUrl || undefined,
        description: parsed.data.description,
        network: parsed.data.network,
        status: "active",
        metadataHash,
        createTxDigest: result.digest,
        createdAt: now,
        updatedAt: now
      };
      storageAdapter.upsertGrant(grant, milestones as Milestone[]);
      setStatus("registered");
      router.push(`/grants/${grantId}`);
    } catch (err) {
      setStatus("failed");
      setError(err instanceof Error ? err.message : "Create Grant Room failed");
    }
  }

  return (
    <AppShell>
      <h1 className="font-[var(--font-heading)] text-5xl text-white sm:text-6xl">Create Grant Room</h1>
      <p className="mb-6 mt-2 text-slateText">Default network is mainnet. Tatum API key stays server-side.</p>
      <Card>
        <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Grant name"><Input {...register("name")} /></Field>
            <Field label="Funding label"><Input placeholder="25,000 SUI grant" {...register("fundingLabel")} /></Field>
            <Field label="Sponsor name"><Input {...register("sponsorName")} /></Field>
            <Field label="Builder/team name"><Input {...register("builderName")} /></Field>
            <Field label="Sponsor wallet"><Input className="mono" {...register("sponsorWallet")} /></Field>
            <Field label="Builder wallet"><Input className="mono" {...register("builderWallet")} /></Field>
            <Field label="Project URL"><Input {...register("projectUrl")} /></Field>
            <Field label="GitHub URL"><Input {...register("githubUrl")} /></Field>
            <Field label="Network"><Select {...register("network")}><option value="mainnet">mainnet</option><option value="testnet">testnet</option><option value="devnet">devnet</option></Select></Field>
          </div>
          <Field label="Short description"><Textarea {...register("description")} /></Field>
          <div className="rounded-card border border-border bg-white/5 p-4">
            <p className="mb-2 text-sm font-semibold text-white">Milestones created for grant flow</p>
            <ul className="text-sm text-slate">{defaultMilestones.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <Button type="submit">Create Grant Room</Button>
          <p className="text-sm text-slate">State: {status} · Network: {watch("network")}</p>
          {error ? <p className="text-sm font-semibold text-danger">{error}</p> : null}
        </form>
      </Card>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-2"><Label>{label}</Label>{children}</label>;
}
