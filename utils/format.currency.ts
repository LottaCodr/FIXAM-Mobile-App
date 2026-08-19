export function formatNaira(amount: number, compact = false): string {
    if (compact && amount >= 1000) {
        return `₦${new Intl.NumberFormat("en-NG", {
            maximumFractionDigits: amount >= 10000 ? 0 : 1,
        }).format(amount / 1000)}k`;
    }

    return `₦${new Intl.NumberFormat("en-NG", {
        maximumFractionDigits: 0,
    }).format(amount)}`;
}

export function formatNairaRange(min: number, max: number): string {
    return `${formatNaira(min)} – ${formatNaira(max)}`;
}
