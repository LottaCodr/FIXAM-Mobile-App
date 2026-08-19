import type { JobStatus } from "@/features/jobs/types";
import { colors } from "@/theme/tokens/color";

export const JOB_STATUS_META: Record<
    JobStatus,
    { label: string; color: string; soft: string }
> = {
    requested: { label: "Requested", color: colors.info, soft: colors.infoSoft },
    accepted: { label: "Accepted", color: colors.primary, soft: colors.primaryLight },
    en_route: { label: "On the way", color: colors.accentDark, soft: colors.accentSoft },
    arrived: { label: "Arrived", color: colors.accentDark, soft: colors.accentSoft },
    in_progress: { label: "In progress", color: colors.info, soft: colors.infoSoft },
    completed: { label: "Completed", color: colors.success, soft: colors.successSoft },
    cancelled: { label: "Cancelled", color: colors.error, soft: colors.errorSoft },
};

export const TRACK_STEPS: { key: JobStatus; label: string }[] = [
    { key: "requested", label: "Request sent" },
    { key: "accepted", label: "Artisan accepted" },
    { key: "en_route", label: "On the way" },
    { key: "arrived", label: "Arrived" },
    { key: "in_progress", label: "Work in progress" },
    { key: "completed", label: "Completed" },
];

const ORDER: JobStatus[] = TRACK_STEPS.map((s) => s.key);

export function statusIndex(status: JobStatus) {
    if (status === "cancelled") return -1;
    return ORDER.indexOf(status);
}
