"use client";
import { useState } from 'react';
import Link from 'next/link';
import AuthWrapper from '@/components/AuthWrapper';
import LoginHeader from '@/components/loginHeader';
import InputField from '@/components/Fields/InputField';
import SubmitButton from '@/components/Fields/Button';
import ErrorMessage from '@/components/Message/ErrorMessage';
import { APP_NAME } from '@/constants/generalConstants';
import { api } from '@/lib/api';

export default function LoginComponent() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        // rememberMe: false
    });
    const [errors, setErrors] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false);
    const validateForm = () => {
        const newErrors: string[] = []
        
        if (!formData.email) {
        newErrors.push('Email is required')
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.push('Please enter a valid email address')
        }
        
        if (!formData.password) {
        newErrors.push('Password is required')
        } else if (formData.password.length < 6) {
        newErrors.push('Password must be at least 6 characters long')
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
            const data = await api.login(formData)
            console.log('Login successful:', data)
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Login failed. Please check your credentials and try again.'
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
        <AuthWrapper>
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
              
              <InputField
                type="password"
                placeholder="Enter your password"
                label="Password"
                value={formData.password}
                onChange={(value) => handleInputChange('password', value)}
                required
              />
            </div>
            
            <div className="flex items-center justify-between text-sm">
              
              <Link
                href="/forgot-password"
                className="text-blue-300 hover:text-blue-200 transition-colors hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <ErrorMessage errors={errors} />

            <SubmitButton isLoading={isLoading} loadingText={"logging you in ...,"} submitText={`login in to ${APP_NAME}`}/>
            
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
        </AuthWrapper>
    )
}