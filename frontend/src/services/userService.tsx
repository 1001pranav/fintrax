"use client";
import { apiService } from "./apiService";
import { UserLoginResponse } from "@/constants/interface";

export function login(email: string, password: string): Promise<UserLoginResponse> {
    return apiService.post<UserLoginResponse>("/api/user/login", {
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

export function forgotPassword<T>(email: string): Promise<T> {
    return apiService.post<T>("/api/user/generate-otp", {
        email,
    });
} 

export function resetPassword<T>(email: string, password: string, otp: string): Promise<T> {
    return apiService.post<T>("/api/user/forgot-password", {
        email,
        password,
        otp,
    });
}