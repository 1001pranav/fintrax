"use client";

import { Screen } from "./constant";

export interface RegisterProps {
    setScreenStatus: React.Dispatch<React.SetStateAction<Screen>>;
}

export interface RegisterObject {
    username: string;
    password: string;
    email: string;
    confirmPassword: string;
}

export interface LoginObject {
    username: string;
    password: string;
}

export interface APIErrorResponse {
    status: number;
    message: string;
}
