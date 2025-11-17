import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@components/common/Button';
import { colors, spacing, typography } from '@theme';
import { getOTPError } from '@utils/validators';
import { useAppDispatch, useAppSelector } from '@hooks';
import { clearError } from '@store/slices/authSlice';
import { authApi } from '@api/auth.api';

interface VerifyEmailScreenProps {
  email?: string;
  onNavigateToLogin?: () => void;
  onVerificationSuccess?: () => void;
}

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

export const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = ({
  email: propEmail,
  onNavigateToLogin,
  onVerificationSuccess,
}) => {
  const dispatch = useAppDispatch();
  const { error: authError } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState(propEmail || '');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Refs for OTP input fields
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Clear auth error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Show auth error as alert
  useEffect(() => {
    if (authError) {
      Alert.alert('Verification Failed', authError, [
        {
          text: 'OK',
          onPress: () => dispatch(clearError()),
        },
      ]);
    }
  }, [authError, dispatch]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (value: string, index: number) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last digit
    setOtp(newOtp);
    setOtpError(null);

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    // Handle backspace to focus previous input
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const validateOtp = (): boolean => {
    const otpString = otp.join('');
    const error = getOTPError(otpString);
    setOtpError(error);
    return !error;
  };

  const handleVerify = async () => {
    // Clear previous errors
    setOtpError(null);
    dispatch(clearError());

    // Validate OTP
    if (!validateOtp()) {
      return;
    }

    const otpString = otp.join('');

    try {
      setIsVerifying(true);

      // Call verify email API
      await authApi.verifyEmail({
        email,
        otp: otpString,
      });

      // Verification successful
      Alert.alert(
        'Email Verified',
        'Your email has been verified successfully. You can now sign in.',
        [
          {
            text: 'OK',
            onPress: () => {
              if (onVerificationSuccess) {
                onVerificationSuccess();
              } else if (onNavigateToLogin) {
                onNavigateToLogin();
              }
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Verification error:', error);
      setOtpError(error.message || 'Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) {
      return;
    }

    try {
      setIsResending(true);
      dispatch(clearError());

      // Call generate OTP API
      await authApi.generateOTP({ email });

      // Show success message
      Alert.alert(
        'OTP Sent',
        'A new verification code has been sent to your email.',
        [{ text: 'OK' }]
      );

      // Clear OTP inputs
      setOtp(['', '', '', '', '', '']);
      setOtpError(null);

      // Start cooldown
      setResendCooldown(RESEND_COOLDOWN);

      // Focus first input
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      Alert.alert('Error', error.message || 'Failed to resend OTP. Please try again.', [
        { text: 'OK' },
      ]);
    } finally {
      setIsResending(false);
    }
  };

  const handleLoginNavigation = () => {
    if (onNavigateToLogin) {
      onNavigateToLogin();
    } else {
      Alert.alert('Sign In', 'This will navigate to the login screen.', [{ text: 'OK' }]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="mail-outline" size={48} color={colors.primary} />
          </View>
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            We've sent a verification code to{'\n'}
            <Text style={styles.emailText}>{email || 'your email'}</Text>
          </Text>
        </View>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          <Text style={styles.otpLabel}>Enter Verification Code</Text>
          <View style={styles.otpInputsContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[styles.otpInput, otpError && styles.otpInputError]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                editable={!isVerifying && !isResending}
                testID={`otp-input-${index}`}
              />
            ))}
          </View>
          {otpError && <Text style={styles.errorText}>{otpError}</Text>}
        </View>

        {/* Verify Button */}
        <Button
          title="Verify Email"
          onPress={handleVerify}
          loading={isVerifying}
          disabled={isVerifying || isResending || otp.some((digit) => !digit)}
          fullWidth
          testID="verify-button"
        />

        {/* Resend OTP */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          <TouchableOpacity
            onPress={handleResendOtp}
            disabled={isVerifying || isResending || resendCooldown > 0}
          >
            <Text
              style={[
                styles.resendLink,
                (isResending || resendCooldown > 0) && styles.resendLinkDisabled,
              ]}
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Back to Login Link */}
        <View style={styles.loginContainer}>
          <TouchableOpacity onPress={handleLoginNavigation} disabled={isVerifying || isResending}>
            <Text style={styles.loginLink}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.helpText}>
            The verification code is valid for 10 minutes. If you don't receive it, check your spam
            folder or request a new code.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },

  header: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },

  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },

  title: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },

  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.fontSize.md * typography.lineHeight.relaxed,
  },

  emailText: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },

  otpContainer: {
    marginBottom: spacing.xl,
  },

  otpLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray700,
    marginBottom: spacing.md,
    textAlign: 'center',
  },

  otpInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },

  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    backgroundColor: colors.inputBackground,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
  },

  otpInputError: {
    borderColor: colors.error,
  },

  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.xs,
  },

  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },

  resendText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },

  resendLink: {
    fontSize: typography.fontSize.md,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },

  resendLinkDisabled: {
    color: colors.gray400,
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },

  loginLink: {
    fontSize: typography.fontSize.md,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },

  helpContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },

  helpText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
  },
});
