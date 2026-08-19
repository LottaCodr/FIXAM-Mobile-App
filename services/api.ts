import { env, isBackendConfigured } from "@/lib/env";
import { useAuthStore } from "@/store/auth.store";
import axios from "axios";

const baseURL = isBackendConfigured()
    ? `${env.supabaseUrl.replace(/\/$/, "")}/functions/v1`
    : "https://api.fixam.ng/v1";

export const api = axios.create({
    baseURL,
    timeout: 20000,
    headers: {
        "Content-Type": "application/json",
        ...(isBackendConfigured() ? { apikey: env.supabaseAnonKey } : {}),
    },
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
