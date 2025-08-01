"use client"

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {LoginBackgroundEffect } from '@/components/BackgroundEffect';
import FormWrapper  from '@/components/FormWrapper';
import LoginHeader from '@/components/loginHeader';
import InputField from '@/components/Fields/InputField';
import SubmitButton from '@/components/Fields/Button';
import ErrorMessage from '@/components/Message/ErrorMessage';
import { api } from '@/lib/api';

export default function ForgetPasswordComponent() {
    const [formData, setFormData] = useState({
        email: '',
        // rememberMe: false
    });

    const [errors, setErrors] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const validateForm = () => {
        const newErrors: string[] = []
        
        if (!formData.email) {
        newErrors.push('Email is required')
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.push('Please enter a valid email address')
        }
        
        return newErrors
    }
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
        if (validationErrors.length > 0) {
            setErrors(validationErrors)
            return
        }
        
            setErrors([])
            setIsLoading(true)
        
        try {
            await api.generateOtp(formData.email)
            if (typeof window !== 'undefined') {
                localStorage.setItem('resetEmail', formData.email)
            }
            router.push('/reset-password')
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to send OTP. Please try again.'
            setErrors([message])
        } finally {
            setIsLoading(false)
        }
    }
    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Clear errors when user starts typing
        if (errors.length > 0) {
            setErrors([])
        }
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <LoginBackgroundEffect />
        
        <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <FormWrapper>
            <LoginHeader />
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                <InputField
                    type="email"
                    placeholder="Enter your email"
                    label="Email Address"
                    value={formData.email}
                    onChange={(value) => handleInputChange('email', value)}
                    required
                />
                
                </div>
                
                <div className="flex items-center justify-between text-sm">
                
                <Link
                    href="/login"
                    className="text-blue-300 hover:text-blue-200 transition-colors hover:underline"
                >
                    Remembered Password? Go back to Login
                </Link>
                </div>
                
                <ErrorMessage errors={errors} />
                
                <SubmitButton isLoading={isLoading} loadingText={"Sending you OTP...,"} submitText={`OTP sent`}/>
                
                <div className="text-center">
                <p className="text-white/60 text-sm">
                    Don&apos;t have an account?{' '}
                    <Link
                    href="/register"
                    className="text-blue-300 hover:text-blue-200 transition-colors hover:underline font-medium"
                    >
                    Sign up here
                    </Link>
                </p>
                </div>
            </form>
            </FormWrapper>
        </div>
        </div>
    )
}