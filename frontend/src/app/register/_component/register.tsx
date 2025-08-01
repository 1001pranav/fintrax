"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import AuthWrapper from '@/components/AuthWrapper';
import LoginHeader from '@/components/loginHeader';
import InputField from '@/components/Fields/InputField';
import SubmitButton from '@/components/Fields/Button';
import ErrorMessage from '@/components/Message/ErrorMessage';
import { RegisterState } from '@/constants/interfaces';
import { api } from '@/lib/api';

const RegisterComponent: React.FC = () => {
    const [formData, setFormData] = useState<RegisterState>({
        username: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const validateForm = (): string[] => {
        const newErrors: string[] = [];

        if (!formData.email) {
            newErrors.push('Email is required');
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.push('Please enter a valid email address');
        }

        if (!formData.password) {
            newErrors.push('Password is required');
        } else if (formData.password.length < 6) {
            newErrors.push('Password must be at least 6 characters long');
        }

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors([]);
        setIsLoading(true);

        try {
            const data = await api.register(formData);
            console.log('Registration successful:', data);
        } catch (_error: unknown) {
            console.error('Registration failed:', _error);
            const message = _error instanceof Error ? _error.message : 'Registration failed. Please check your credentials and try again.';
            setErrors([message]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: keyof RegisterState, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors.length > 0) {
            setErrors([]);
        }
    };

    return (
        <AuthWrapper>
                    <LoginHeader />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <InputField
                                type="username"
                                placeholder="Enter your username"
                                label="Username"
                                value={formData.username}
                                onChange={(value: string) => handleInputChange('username', value)}
                                required
                            />
                            <InputField
                                type="email"
                                placeholder="Enter your email"
                                label="Email Address"
                                value={formData.email}
                                onChange={(value: string) => handleInputChange('email', value)}
                                required
                            />

                            <InputField
                                type="password"
                                placeholder="Enter your password"
                                label="Password"
                                value={formData.password}
                                onChange={(value: string) => handleInputChange('password', value)}
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                        </div>

                        <ErrorMessage errors={errors} />

                        <SubmitButton isLoading={isLoading} loadingText={"singing you up ...,"} submitText='Sign up' />

                        <div className="text-center">
                            <p className="text-white/60 text-sm">
                                Already have an account?{' '}
                                <Link
                                    href="/login"
                                    className="text-blue-300 hover:text-blue-200 transition-colors hover:underline font-medium"
                                >
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </form>
        </AuthWrapper>
    );
};

export default RegisterComponent;