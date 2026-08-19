import type { ServiceCategory } from "@/features/artisans/types";

export const SERVICE_CATEGORIES: ServiceCategory[] = [
    {
        id: "plumbing",
        title: "Plumbing",
        subtitle: "Leaks, pipes & heaters",
        icon: "water-outline",
        color: "#1F7A5B",
        soft: "#E6F3EE",
    },
    {
        id: "electrical",
        title: "Electrical",
        subtitle: "Wiring & installations",
        icon: "flash-outline",
        color: "#F7931E",
        soft: "#FFF1DE",
    },
    {
        id: "ac-repair",
        title: "AC Repair",
        subtitle: "Cooling & gas refill",
        icon: "snow-outline",
        color: "#2563EB",
        soft: "#DBEAFE",
    },
    {
        id: "painting",
        title: "Painting",
        subtitle: "Interior & exterior",
        icon: "color-palette-outline",
        color: "#DC2626",
        soft: "#FEE2E2",
    },
    {
        id: "cleaning",
        title: "Cleaning",
        subtitle: "Home & deep clean",
        icon: "sparkles-outline",
        color: "#16A34A",
        soft: "#DCFCE7",
    },
    {
        id: "generator",
        title: "Generator",
        subtitle: "Service & repair",
        icon: "battery-charging-outline",
        color: "#D97706",
        soft: "#FEF3C7",
    },
    {
        id: "carpentry",
        title: "Carpentry",
        subtitle: "Doors, shelves & more",
        icon: "hammer-outline",
        color: "#78716C",
        soft: "#F5F5F4",
    },
    {
        id: "gardening",
        title: "Gardening",
        subtitle: "Lawns & landscaping",
        icon: "leaf-outline",
        color: "#145A42",
        soft: "#E6F3EE",
    },
];

export function getCategory(id: string) {
    return SERVICE_CATEGORIES.find((c) => c.id === id);
}
