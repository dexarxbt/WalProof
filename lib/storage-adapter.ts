"use client";

import type { AppRecordSet, EvidenceFile, GrantRoom, Milestone, ProofPacket, ReviewRecord } from "@/lib/types";
import { seedRecords } from "@/lib/seed-data";

const STORAGE_KEY = "walproof.records.v2";

const emptyRecords: AppRecordSet = {
  grants: [],
  milestones: [],
  evidence: [],
  proofPackets: [],
  reviews: []
};

let cachedRaw: string | null | undefined;
let cachedRecords: AppRecordSet | undefined;
let serverRecords: AppRecordSet | undefined;

function mergeRecords(local: AppRecordSet): AppRecordSet {
  const mergeById = <T extends { id: string }>(seedItems: T[], localItems: T[]) => [
    ...localItems,
    ...seedItems.filter((seed) => !localItems.some((item) => item.id === seed.id))
  ];

  return {
    grants: mergeById(seedRecords.grants, local.grants),
    milestones: mergeById(seedRecords.milestones, local.milestones),
    evidence: mergeById(seedRecords.evidence, local.evidence),
    proofPackets: mergeById(seedRecords.proofPackets, local.proofPackets),
    reviews: mergeById(seedRecords.reviews, local.reviews)
  };
}

function normalizeRecords(value: unknown): AppRecordSet {
  const record = value && typeof value === "object" ? (value as Partial<AppRecordSet>) : {};
  return {
    grants: Array.isArray(record.grants) ? record.grants : [],
    milestones: Array.isArray(record.milestones) ? record.milestones : [],
    evidence: Array.isArray(record.evidence) ? record.evidence : [],
    proofPackets: Array.isArray(record.proofPackets) ? record.proofPackets : [],
    reviews: Array.isArray(record.reviews) ? record.reviews : []
  };
}

function readRecords(): AppRecordSet {
  if (typeof window === "undefined") {
    serverRecords ??= mergeRecords(emptyRecords);
    return serverRecords;
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw && cachedRecords) return cachedRecords;

  try {
    cachedRaw = raw;
    cachedRecords = raw ? mergeRecords(normalizeRecords(JSON.parse(raw))) : mergeRecords(emptyRecords);
    return cachedRecords;
  } catch {
    cachedRaw = raw;
    cachedRecords = mergeRecords(emptyRecords);
    return cachedRecords;
  }
}

function writeRecords(records: AppRecordSet) {
  const raw = JSON.stringify(records);
  cachedRaw = raw;
  cachedRecords = records;
  window.localStorage.setItem(STORAGE_KEY, raw);
  window.dispatchEvent(new Event("walproof:records"));
}

export const storageAdapter = {
  list() {
    return readRecords();
  },
  subscribe(listener: () => void) {
    window.addEventListener("walproof:records", listener);
    window.addEventListener("storage", listener);
    return () => {
      window.removeEventListener("walproof:records", listener);
      window.removeEventListener("storage", listener);
    };
  },
  upsertGrant(grant: GrantRoom, milestones: Milestone[] = []) {
    const records = readRecords();
    records.grants = [grant, ...records.grants.filter((item) => item.id !== grant.id)];
    const milestoneIds = new Set(milestones.map((item) => item.id));
    records.milestones = [
      ...milestones,
      ...records.milestones.filter((item) => !milestoneIds.has(item.id))
    ];
    writeRecords(records);
  },
  upsertEvidence(evidence: EvidenceFile) {
    const records = readRecords();
    records.evidence = [evidence, ...records.evidence.filter((item) => item.id !== evidence.id)];
    writeRecords(records);
  },
  upsertProofPacket(proof: ProofPacket) {
    const records = readRecords();
    records.proofPackets = [proof, ...records.proofPackets.filter((item) => item.id !== proof.id)];
    records.milestones = records.milestones.map((milestone) =>
      milestone.id === proof.milestoneId
        ? { ...milestone, status: "submitted", proofId: proof.id, updatedAt: new Date().toISOString() }
        : milestone
    );
    writeRecords(records);
  },
  upsertReview(review: ReviewRecord) {
    const records = readRecords();
    records.reviews = [review, ...records.reviews.filter((item) => item.id !== review.id)];
    records.milestones = records.milestones.map((milestone) =>
      milestone.id === review.milestoneId
        ? {
            ...milestone,
            status:
              review.decision === "approved"
                ? "approved"
                : review.decision === "rejected"
                  ? "rejected"
                  : "revision_requested",
            updatedAt: new Date().toISOString()
          }
        : milestone
    );
    writeRecords(records);
  }
};
