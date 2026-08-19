/**
 * Hand-written subset of the public schema.
 * After `supabase gen types typescript --linked > types/database.ts` you can replace this.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    role: "customer" | "artisan" | "admin";
                    full_name: string | null;
                    first_name: string | null;
                    phone: string | null;
                    email: string | null;
                    avatar_url: string | null;
                    location: string | null;
                    address: string | null;
                    referral_code: string;
                    created_at: string;
                };
                Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string; referral_code: string };
                Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
            };
            artisans: {
                Row: {
                    id: string;
                    user_id: string | null;
                    category_id: string;
                    name: string;
                    skill: string;
                    price_min: number;
                    price_max: number;
                    rating: number;
                    verified: boolean;
                };
                Insert: Record<string, never>;
                Update: Record<string, never>;
            };
            jobs: {
                Row: {
                    id: string;
                    public_ref: string;
                    customer_id: string;
                    artisan_id: string;
                    status: string;
                    amount: number;
                    payment_status: string;
                };
                Insert: Record<string, never>;
                Update: Record<string, never>;
            };
            payments: {
                Row: {
                    id: string;
                    tx_ref: string;
                    amount: number;
                    status: string;
                    checkout_url: string | null;
                };
                Insert: Record<string, never>;
                Update: Record<string, never>;
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
    };
};
