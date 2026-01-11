import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

export const api = axios.create({
    baseURL: "https://api.fixam.ng/v1",
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
