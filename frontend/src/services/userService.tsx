"use client";
import { apiService } from "./apiService";

interface LoginResponse {
    status: number;
    message: string;
    data: {
        user_id: number;
        email: string;
        token: string;
        username: string;
    };
}
export function login<LoginResponse>(email: string, password: string): Promise<LoginResponse> {
    return apiService.post("/api/user/login", {
        email,
        password,
    });
}

export function register<T,>(email: string, password: string, username: string): Promise<T> {
    try {
        return apiService.post("/api/user/register", {
            email,
            password,
            username,
        });
    } catch (error) {
        console.log("Error in register function: ", error);
        return Promise.reject(error);
    }
}