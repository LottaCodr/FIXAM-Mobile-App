import { create } from "zustand";

type Filters = {
    maxDistance?: number;
    minRating?: number;
    priceRange?: [number, number];
};

type ArtisanStore = {
    artisans: any[];
    filters: Filters;
    page: number;
    hasMore: boolean;
    loading: boolean;

    setFilters: (filters: Partial<Filters>) => void;
    fetchArtisan: (categoryId: string) => Promise<void>;
}

export const useArtisanStore = create<ArtisanStore>((set, get) => ({
    artisans: [],
    filters: {},
    page: 1,
    hasMore: true,
    loading: false,

    setFilters: (filters) =>
        set((state) => ({
            filters: { ...state.filters, ...filters },
            page: 1,
            artisans: []
        })),

    fetchArtisan: async (categoryId) => {
        const { filters, page } = get();

        set({ loading: true });

        const query = new URLSearchParams({
            categoryId,
            page: String(page),
            ...(filters.maxDistance && { maxDistance: String(filters.maxDistance) }),
            ...(filters.minRating && { minRating: String(filters.minRating) })
        });

        const res = await fetch(`https://api.yourapp.com/artisans?${query}`);

        const data = await res.json();

        set((state) => ({
            artisans: page === 1
                ? data.items
                : [...state.artisans, ...data.items],
            hasMore: data.hasMore,
            loading: false
        }))


    }
}))