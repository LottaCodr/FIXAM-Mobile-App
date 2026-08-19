export type AuthSession = {
    userId: string;
    accessToken: string;
    refreshToken: string;
};

export type OtpChallenge = {
    phone: string;
    expiresIn: number;
};
