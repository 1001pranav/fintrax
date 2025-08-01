"use client"

export interface RegisterState {
    username: string;
    email: string;
    password: string;
}

export interface OTPFieldProps {
    onComplete: (otp: string) => void
    onOtpChange?: (otp: string) => void
    disabled?: boolean
    error?: boolean
    className?: string
}

export interface Project {
    id: string;
    name: string;
    description: string;
    color: string;
    createdDate: Date;
    coverImage?: string;
    taskCount?: number;
}

export interface Tags {
    id: string;
    name: string;
    color: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    tags: Tags[];
    notes?: string;
    priority: 'low' | 'medium' | 'high';
    status: 'todo' | 'in-progress' | 'done';
    parentTaskId?: string;
    projectId: string;
    createdDate: Date;
    subtasks?: Task[];
}

export interface TaskFormData {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    tags: Tags[];
    notes: string;
    priority: 'low' | 'medium' | 'high';
    status: 'todo' | 'in-progress' | 'done';
    parentTaskId?: string;
}
