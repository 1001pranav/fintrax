"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoginBackgroundEffect as BackgroundEffect } from "@/components/BackgroundEffect";
import { ResetPasswordFormData } from "@/app/reset-password/constant/instances";
import FormWrapper from "@/components/FormWrapper";
import LoginHeader from "@/components/loginHeader";
import InputField from "@/components/Fields/InputField";
import SubmitButton from "@/components/Fields/Button";
import ErrorMessage from "@/components/Message/ErrorMessage";
import { OTP_LENGTH } from "@/constants/generalConstants";
import OTPField from "@/components/Fields/otpField";
import { api } from "@/lib/api";

export default function ResetComponent() {
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    otp: "",
    password: "",
    confirmPassword: "",
    // rememberMe: false
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpComplete, setOtpComplete] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const router = useRouter();

  const validateOtp = () => {
    const newErrors: string[] = [];

    if (!formData.otp || formData.otp.length !== OTP_LENGTH) {
      newErrors.push(`Please enter a valid ${OTP_LENGTH}-digit OTP`);
    }

    return newErrors;
  };

  const validatePasswordForm = () => {
    const newErrors: string[] = [];

    if (!formData.password) {
      newErrors.push("Password is required");
    } else if (formData.password.length < 6) {
      newErrors.push("Password must be at least 6 characters long");
    }

    if (!formData.confirmPassword) {
      newErrors.push("Please confirm your password");
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.push("Passwords do not match");
    }

    return newErrors;
  };

  const handleOtpComplete = (otp: string) => {
    setFormData((prev) => ({ ...prev, otp }));
    setOtpComplete(true);
    // Clear errors when OTP is complete
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleOtpChange = (otp: string) => {
    setFormData((prev) => ({ ...prev, otp }));
    setOtpComplete(otp.length === OTP_LENGTH);
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleVerifyOtp = async () => {
    const validationErrors = validateOtp();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setIsVerifyingOtp(true);

    try {
      // Simulate API call for OTP verification
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success/failure - replace with actual API call
      if (formData.otp === "123456") {
        // Mock successful OTP
        setIsOtpVerified(true);
        setErrors([]);
        console.log("OTP verified successfully");
      } else {
        setErrors(["Invalid OTP. Please try again."]);
      }
    } catch (_error) {
      setErrors(["OTP verification failed. Please try again."]);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResendingOtp(true);
    setErrors([]);

    try {
      const email = typeof window !== 'undefined' ? localStorage.getItem('resetEmail') : null;
      if (!email) {
        throw new Error('Missing email. Please request a new OTP.');
      }
      await api.generateOtp(email);

      // Reset OTP state
      setFormData((prev) => ({ ...prev, otp: "" }));
      setOtpComplete(false);
      setIsOtpVerified(false);

      // Start cooldown timer
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      console.log("OTP resent successfully");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to resend OTP. Please try again.";
      setErrors([message]);
    } finally {
      setIsResendingOtp(false);
    }
  };

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!formData.password) {
      newErrors.push("Password is required");
    } else if (formData.password.length < 6) {
      newErrors.push("Password must be at least 6 characters long");
    }

    return newErrors;
  };
  
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isOtpVerified) {
      setErrors(["Please verify your OTP first"]);
      return;
    }

    const validationErrors = validatePasswordForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setIsLoading(true);

    try {
      const email = typeof window !== 'undefined' ? localStorage.getItem('resetEmail') : null;
      if (!email) {
        throw new Error('Missing email. Please request a new OTP.');
      }
      await api.resetPassword({ email, password: formData.password, otp: formData.otp });
      router.push('/login');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Password reset failed. Please try again.';
      setErrors([message]);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <BackgroundEffect />

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <FormWrapper>
          <LoginHeader />

          <form onSubmit={handleResetPassword} className="space-y-6">
            {/* OTP Verification Section */}
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {isOtpVerified ? "OTP Verified ✓" : "Verify Your OTP"}
                </h3>
                <p className="text-white/70 text-sm">
                  {isOtpVerified
                    ? "You can now reset your password"
                    : `Enter the ${OTP_LENGTH}-digit code sent to your email`}
                </p>
              </div>

              {/* OTP Field */}
              <div className="space-y-4">
                <OTPField
                  onComplete={handleOtpComplete}
                  onOtpChange={handleOtpChange}
                  disabled={isOtpVerified || isVerifyingOtp}
                  error={errors.some((error) => error.includes("OTP"))}
                />

                {/* OTP Action Buttons */}
                {!isOtpVerified && (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={!otpComplete || isVerifyingOtp}
                      className="flex-1 py-2.5 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isVerifyingOtp ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Verifying...</span>
                        </div>
                      ) : (
                        "Verify OTP"
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isResendingOtp || resendCooldown > 0}
                      className="flex-1 py-2.5 px-4 bg-white/10 border border-white/20 hover:bg-white/15 text-white font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isResendingOtp ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </div>
                      ) : resendCooldown > 0 ? (
                        `Resend (${resendCooldown}s)`
                      ) : (
                        "Resend OTP"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Password Fields Section */}
            <div
              className={`space-y-4 transition-all duration-300 ${
                isOtpVerified ? "opacity-100" : "opacity-50 pointer-events-none"
              }`}
            >
              <div className="border-t border-white/10 pt-4">
                <h3 className="text-lg font-semibold text-white mb-4 text-center">
                  Set New Password
                </h3>
              </div>

              <InputField
                type="password"
                placeholder="Enter your new password"
                label="New Password"
                value={formData.password}
                onChange={(value) => handleInputChange("password", value)}
                disabled={!isOtpVerified}
                required
              />

              <InputField
                type="password"
                placeholder="Confirm your new password"
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={(value) =>
                  handleInputChange("confirmPassword", value)
                }
                disabled={!isOtpVerified}
                required
              />
            </div>

            <ErrorMessage errors={errors} />

            {/* Submit Button - Only show when OTP is verified */}
            {isOtpVerified && (
              <SubmitButton
                isLoading={isLoading}
                loadingText="Resetting your password..."
                submitText="Reset Password"
              />
            )}

            <div className="text-center space-y-2">
              <p className="text-white/60 text-sm">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="text-blue-300 hover:text-blue-200 transition-colors hover:underline font-medium"
                >
                  Back to Login
                </Link>
              </p>
            </div>
          </form>
        </FormWrapper>
      </div>
    </div>
  );
}
