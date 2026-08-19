export type CardBrand = "visa" | "mastercard" | "verve" | "unknown";

export type PaymentMethod = {
    id: string;
    brand: CardBrand;
    last4: string;
    expiry: string;
    isDefault: boolean;
};

export type PaymentBreakdown = {
    serviceFee: number;
    partsAmount: number;
    platformFee?: number;
    total: number;
    paidAt?: string;
};

export type PaymentStatus =
    | "initialized"
    | "pending"
    | "successful"
    | "failed"
    | "cancelled"
    | "refunded";

export type CheckoutSession = {
    paymentId: string;
    txRef: string;
    checkoutUrl: string;
    amount: number;
    currency: string;
};

export type Bank = {
    id: number;
    code: string;
    name: string;
};
