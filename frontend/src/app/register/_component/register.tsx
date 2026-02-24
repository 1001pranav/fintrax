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
import { validateEmail, validatePassword, validateUsername, sanitizeInput } from '@/utils/validation';

const RegisterComponent: React.FC = () => {
    const [formData, setFormData] = useState<RegisterState>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const validateForm = (): string[] => {
        const newErrors: string[] = [];

        // Validate username
        const usernameValidation = validateUsername(formData.username);
        if (!usernameValidation.isValid) {
            newErrors.push(...usernameValidation.errors);
        }

        // Validate email
        const emailValidation = validateEmail(formData.email);
        if (!emailValidation.isValid) {
            newErrors.push(...emailValidation.errors);
        }

        // Validate password (use lenient mode for now, can change to strict)
        const passwordValidation = validatePassword(formData.password, false);
        if (!passwordValidation.isValid) {
            newErrors.push(...passwordValidation.errors);
        }

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            newErrors.push('Passwords do not match');
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
            // Sanitize form data before sending
            const sanitizedData = {
                username: sanitizeInput(formData.username),
                email: sanitizeInput(formData.email),
                password: formData.password, // Don't sanitize password
            };

            const response: any = await api.register(sanitizedData);
            console.log('Registration successful:', response);

            // Store tokens in localStorage
            if (response.data) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('refreshToken', response.data.refresh_token);
                localStorage.setItem('email', response.data.email);
                localStorage.setItem('username', response.data.username);
                localStorage.setItem('user_id', response.data.user_id.toString());

                // Redirect to verify email page (or wherever appropriate)
                window.location.href = '/verify-email';
            }
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

                            <InputField
                                type="password"
                                placeholder="Confirm your password"
                                label="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={(value: string) => handleInputChange('confirmPassword', value)}
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