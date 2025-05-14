"use client";

import { Screen } from "./constant";

export interface RegisterProps {
    setScreenStatus: ( screen: Screen ) => void;
}
export interface LoginProps {
    setScreenStatus: ( screen: Screen ) => void;
}
export interface ForgetPassword {
    email: string;
    OTP?: string;
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

export interface APIResponse<T> {
    status: number;
    message: string;
    data: T;
}
export interface UserLoginResponseData {
    user_id: number;
    email: string;
    token: string;
    username: string;
}

export interface UserLoginResponse extends APIResponse<UserLoginResponseData> {
    data: UserLoginResponseData;
}