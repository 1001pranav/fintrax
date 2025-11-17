import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@components/common/Button';
import { InputField } from '@components/common/InputField';
import { colors, spacing, typography } from '@theme';
import { getEmailError } from '@utils/validators';
import { authApi } from '@api/auth.api';
import type { AuthStackParamList } from '../../navigation/types';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const emailErr = getEmailError(email);
    setEmailError(emailErr);
    return !emailErr;
  };

  const handleSendOTP = async () => {
    // Clear previous errors
    setEmailError(null);

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      // Call generate OTP API
      await authApi.generateOTP({ email });

      // Success - navigate to reset password screen
      Alert.alert(
        'OTP Sent',
        'A password reset code has been sent to your email. Please check your inbox.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('ResetPassword', { email });
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Generate OTP error:', error);
      Alert.alert('Error', error.message || 'Failed to send OTP. Please try again.', [
        { text: 'OK' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
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
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="lock-closed-outline" size={48} color={colors.primary} />
          </View>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            No worries! Enter your email address and we'll send you a code to reset your password.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <InputField
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError(null);
            }}
            error={emailError}
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            leftIcon="mail-outline"
            editable={!isLoading}
            testID="email-input"
          />
        </View>

        {/* Send OTP Button */}
        <Button
          title="Send Reset Code"
          onPress={handleSendOTP}
          loading={isLoading}
          disabled={isLoading || !email}
          fullWidth
          testID="send-otp-button"
        />

        {/* Back to Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Remember your password? </Text>
          <TouchableOpacity onPress={handleBackToLogin} disabled={isLoading}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.helpText}>
            If you don't receive the code within 5 minutes, please check your spam folder or try
            again.
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

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },

  header: {
    alignItems: 'center',
    marginTop: spacing.lg,
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
    paddingHorizontal: spacing.md,
  },

  form: {
    marginBottom: spacing.xl,
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },

  loginText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
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
