export type ApiListResponse<T> = {
    items: T[];
    hasMore: boolean;
    page: number;
};

export type ApiError = {
    message: string;
    code?: string;
};
