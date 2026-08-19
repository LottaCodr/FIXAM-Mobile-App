import { ARTISANS } from "@/data/mock";
import { listArtisans } from "@/features/artisans/services";
import type { Artisan } from "@/features/artisans/types";
import { create } from "zustand";

export type SortKey = "distance" | "rating" | "price";

type Filters = {
    maxDistance?: number;
    minRating?: number;
    verifiedOnly?: boolean;
    sort: SortKey;
};

type ArtisanStore = {
    artisans: Artisan[];
    filters: Filters;
    loading: boolean;
    savedIds: string[];

    setFilters: (filters: Partial<Filters>) => void;
    resetFilters: () => void;
    fetchArtisans: (categoryId?: string, query?: string) => Promise<void>;
    toggleSaved: (id: string) => void;
    isSaved: (id: string) => boolean;
};

const DEFAULT_FILTERS: Filters = { sort: "distance" };

function applyFilters(list: Artisan[], filters: Filters) {
    let next = [...list];
    if (filters.maxDistance) {
        next = next.filter((a) => a.distance <= filters.maxDistance!);
    }
    if (filters.minRating) {
        next = next.filter((a) => a.rating >= filters.minRating!);
    }
    if (filters.verifiedOnly) {
        next = next.filter((a) => a.verified);
    }
    next.sort((a, b) => {
        if (filters.sort === "rating") return b.rating - a.rating;
        if (filters.sort === "price") return a.price - b.price;
        return a.distance - b.distance;
    });
    return next;
}

export const useArtisanStore = create<ArtisanStore>((set, get) => ({
    artisans: [],
    filters: DEFAULT_FILTERS,
    loading: true,
    savedIds: ["a1", "a5"],

    setFilters: (filters) =>
        set((state) => ({
            filters: { ...state.filters, ...filters },
        })),

    resetFilters: () => set({ filters: DEFAULT_FILTERS }),

    fetchArtisans: async (categoryId, query) => {
        set({ loading: true });
        const source = await listArtisans(categoryId);
        const fallback = categoryId ? ARTISANS.filter((a) => a.categoryId === categoryId) : ARTISANS;
        const list = source.length ? source : fallback;
        const q = query?.trim().toLowerCase() ?? "";
        const filtered = list.filter((a) => {
            const matchesQuery = q
                ? a.name.toLowerCase().includes(q) ||
                  a.skill.toLowerCase().includes(q) ||
                  a.categoryId.includes(q) ||
                  a.location.toLowerCase().includes(q)
                : true;
            return matchesQuery;
        });
        set({
            artisans: applyFilters(filtered, get().filters),
            loading: false,
        });
    },

    toggleSaved: (id) =>
        set((state) => ({
            savedIds: state.savedIds.includes(id)
                ? state.savedIds.filter((x) => x !== id)
                : [...state.savedIds, id],
        })),

    isSaved: (id) => get().savedIds.includes(id),
}));
