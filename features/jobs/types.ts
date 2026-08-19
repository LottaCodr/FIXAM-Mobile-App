import type { CategoryId } from "@/features/artisans/types";

export type JobStatus =
    | "requested"
    | "accepted"
    | "en_route"
    | "arrived"
    | "in_progress"
    | "completed"
    | "cancelled";

export type JobSchedule = "asap" | "today" | "schedule";

export type Job = {
    id: string;
    artisanId: string;
    categoryId: CategoryId;
    service: string;
    description: string;
    status: JobStatus;
    address: string;
    schedule: JobSchedule;
    scheduledLabel: string;
    createdAt: string;
    updatedAt: string;
    amount: number;
    partsAmount: number;
    platformFee?: number;
    artisanPayout?: number;
    paymentStatus?: "initialized" | "pending" | "successful" | "failed" | "cancelled" | "refunded";
    etaMins?: number;
    rating?: number;
    review?: string;
    photos: string[];
};

export type JobRequestDraft = {
    artisanId: string;
    description: string;
    schedule: JobSchedule;
    address: string;
};
