import { Ionicons } from "@expo/vector-icons";

export type CategoryId =
    | "plumbing"
    | "electrical"
    | "ac-repair"
    | "painting"
    | "cleaning"
    | "generator"
    | "carpentry"
    | "gardening";

export type IconName = keyof typeof Ionicons.glyphMap;

export type ServiceCategory = {
    id: CategoryId;
    title: string;
    subtitle: string;
    icon: IconName;
    color: string;
    soft: string;
};

export type Review = {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    comment: string;
    createdAt: string;
};

export type Artisan = {
    id: string;
    name: string;
    categoryId: CategoryId;
    skill: string;
    rating: number;
    reviewCount: number;
    distance: number;
    price: number;
    priceMax: number;
    avatar: string;
    cover: string;
    verified: boolean;
    yearsExp: number;
    jobsDone: number;
    about: string;
    location: string;
    responseMins: number;
    online: boolean;
    saved?: boolean;
    portfolio: string[];
    reviews: Review[];
};
