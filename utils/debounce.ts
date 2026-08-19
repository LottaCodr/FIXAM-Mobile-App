export function debounce<T extends (...args: never[]) => void>(
    fn: T,
    wait = 300,
) {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const debounced = (...args: Parameters<T>) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => fn(...args), wait);
    };

    debounced.cancel = () => {
        if (timer) clearTimeout(timer);
        timer = null;
    };

    return debounced;
}

export function sleep(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
