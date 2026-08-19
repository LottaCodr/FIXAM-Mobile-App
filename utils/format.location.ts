export function formatDistance(km: number): string {
    if (km < 1) return `${Math.round(km * 1000)} m`;
    return `${km.toFixed(km < 10 ? 1 : 0)} km`;
}

export function shortAddress(address: string): string {
    const parts = address.split(",").map((p) => p.trim());
    return parts.slice(0, 2).join(", ");
}
