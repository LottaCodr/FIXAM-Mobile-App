import { api } from "@/services/api";
import { create } from "zustand";


export type Job = {
    id: string;
    category: string;
    description: string;
    status: "pending" | "assigned" | "completed";
}

type JobState = {
    jobs: Job[],
    loading: boolean,

    fetchJobs: () => Promise<void>;
    createJob: (payload: {
        category: string;
        description: string;
    }) => Promise<void>
};

export const useJobStore = create<JobState>((set) => ({
    jobs: [],
    loading: false,


    fetchJobs: async () => {
        set({ loading: true });
        const res = await api.get("/jobs");
        set({ jobs: res.data, loading: false })
    },

    createJob: async (payload) => {
        set({ loading: true });
        const res = await api.post("/jobs", payload);
        set((state) => ({
            jobs: [res.data, ...state.jobs]
        }))
    }
}))