"use client";

import { ChangeEvent, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { validateEvidenceFile } from "@/lib/schemas";

export function UploadZone({ onFile }: { onFile: (file: File) => void }) {
  const [error, setError] = useState<string>();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const valid = validateEvidenceFile(file);
    if (!valid.valid) {
      setError(valid.error);
      return;
    }
    setError(undefined);
    onFile(file);
  }

  return (
    <label className="block cursor-pointer rounded-card border border-dashed border-electric/50 bg-electric/5 p-8 text-center transition hover:bg-electric/10">
      <UploadCloud className="mx-auto mb-3 text-ice" size={34} />
      <span className="block font-semibold text-white">Upload Evidence to Walrus</span>
      <span className="mt-1 block text-sm text-slate">PNG, JPG, WEBP, MP4, MOV, PDF, JSON, TXT, MD, LOG</span>
      <input className="sr-only" type="file" onChange={handleChange} />
      <Button className="mt-5" type="button" variant="secondary">Select file</Button>
      {error ? <p className="mt-4 text-sm font-semibold text-danger">{error}</p> : null}
    </label>
  );
}
