import { INITIAL_JOBS } from "@/data/mock";
import type { Job, JobRequestDraft, JobStatus } from "@/features/jobs/types";
import { isBackendConfigured } from "@/lib/env";
import { invokeFunction } from "@/lib/supabase";
import { sleep } from "@/utils/debounce";
import { create } from "zustand";

const ACTIVE: JobStatus[] = [
    "requested",
    "accepted",
    "en_route",
    "arrived",
    "in_progress",
];

type JobState = {
    jobs: Job[];
    loading: boolean;
    lastCreatedId: string | null;

    fetchJobs: () => Promise<void>;
    getJob: (id: string) => Job | undefined;
    createJob: (payload: JobRequestDraft & { service: string; categoryId: Job["categoryId"]; amount: number }) => Promise<Job>;
    updateStatus: (id: string, status: JobStatus, extra?: Partial<Job>) => void;
    markPaid: (id: string) => void;
    submitReview: (id: string, rating: number, review: string) => void;
};

function nextId() {
    const n = Math.floor(4000 + Math.random() * 5000);
    return `FX-${n}`;
}

export const useJobStore = create<JobState>((set, get) => ({
    jobs: INITIAL_JOBS,
    loading: false,
    lastCreatedId: null,

    fetchJobs: async () => {
        set({ loading: true });
        await sleep(200);
        set({ loading: false });
    },

    getJob: (id) => get().jobs.find((j) => j.id === id),

    createJob: async (payload) => {
        set({ loading: true });
        if (isBackendConfigured()) {
            const res = await invokeFunction<{ ok: boolean; job: Record<string, unknown> }>(
                "jobs-create",
                {
                    artisanId: payload.artisanId,
                    description: payload.description,
                    schedule: payload.schedule,
                    address: payload.address,
                },
            );
            const row = res.job;
            const job: Job = {
                id: String(row.id),
                artisanId: String(row.artisan_id),
                categoryId: row.category_id as Job["categoryId"],
                service: String(row.service),
                description: String(row.description),
                status: row.status as JobStatus,
                address: String(row.address),
                schedule: payload.schedule,
                scheduledLabel: String(row.scheduled_label ?? "ASAP"),
                createdAt: String(row.created_at),
                updatedAt: String(row.updated_at),
                amount: Number(row.amount),
                partsAmount: Number(row.parts_amount ?? 0),
                platformFee: Number(row.platform_fee ?? 0),
                artisanPayout: Number(row.artisan_payout ?? 0),
                paymentStatus: (row.payment_status as Job["paymentStatus"]) ?? "initialized",
                etaMins: row.eta_mins ? Number(row.eta_mins) : undefined,
                photos: [],
            };
            set((state) => ({
                jobs: [job, ...state.jobs],
                loading: false,
                lastCreatedId: job.id,
            }));
            return job;
        }

        await sleep(450);
        const job: Job = {
            id: nextId(),
            artisanId: payload.artisanId,
            categoryId: payload.categoryId,
            service: payload.service,
            description: payload.description,
            status: "requested",
            address: payload.address,
            schedule: payload.schedule,
            scheduledLabel:
                payload.schedule === "asap"
                    ? "ASAP"
                    : payload.schedule === "today"
                      ? "Today"
                      : "Scheduled",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            amount: payload.amount,
            partsAmount: 0,
            platformFee: Math.round(payload.amount * 0.1),
            artisanPayout: Math.round(payload.amount * 0.9),
            paymentStatus: "initialized",
            etaMins: payload.schedule === "asap" ? 18 : undefined,
            photos: [],
        };
        set((state) => ({
            jobs: [job, ...state.jobs],
            loading: false,
            lastCreatedId: job.id,
        }));
        return job;
    },

    markPaid: (id) =>
        set((state) => ({
            jobs: state.jobs.map((j) =>
                j.id === id
                    ? { ...j, paymentStatus: "successful", updatedAt: new Date().toISOString() }
                    : j,
            ),
        })),

    updateStatus: (id, status, extra) =>
        set((state) => ({
            jobs: state.jobs.map((j) =>
                j.id === id
                    ? { ...j, status, updatedAt: new Date().toISOString(), ...extra }
                    : j,
            ),
        })),

    submitReview: (id, rating, review) =>
        set((state) => ({
            jobs: state.jobs.map((j) =>
                j.id === id
                    ? {
                          ...j,
                          rating,
                          review,
                          status: "completed",
                          updatedAt: new Date().toISOString(),
                      }
                    : j,
            ),
        })),
}));

export function isActiveJob(job: Job) {
    return ACTIVE.includes(job.status);
}
