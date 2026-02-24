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
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { InputField } from '@components/common/InputField';
import { Button } from '@components/common/Button';
import { PasswordStrengthIndicator } from '@components/common/PasswordStrengthIndicator';
import { colors, spacing, typography } from '@theme';
import { getUsernameError, getEmailError, getPasswordError } from '@utils/validators';
import { useAppDispatch, useAppSelector } from '@hooks';
import { register, clearError } from '@store/slices/authSlice';
import type { AuthStackParamList } from '../../navigation/types';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { isLoading, error: authError } = useAppSelector((state) => state.auth);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  // Clear auth error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Show auth error as alert
  useEffect(() => {
    if (authError) {
      Alert.alert('Registration Failed', authError, [
        {
          text: 'OK',
          onPress: () => dispatch(clearError()),
        },
      ]);
    }
  }, [authError, dispatch]);

  const validateForm = (): boolean => {
    const usernameErr = getUsernameError(username);
    const emailErr = getEmailError(email);
    const passwordErr = getPasswordError(password);

    let confirmPasswordErr: string | null = null;
    if (!confirmPassword || confirmPassword.trim() === '') {
      confirmPasswordErr = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      confirmPasswordErr = 'Passwords do not match';
    }

    setUsernameError(usernameErr);
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setConfirmPasswordError(confirmPasswordErr);

    return !usernameErr && !emailErr && !passwordErr && !confirmPasswordErr;
  };

  const handleRegister = async () => {
    // Clear previous errors
    setUsernameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
    dispatch(clearError());

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      // Dispatch register action
      const result = await dispatch(
        register({
          email,
          password,
          firstName: username,
          lastName: '',
        })
      ).unwrap();

      console.log('✅ Registration Successful');
      console.log('📧 OTP has been sent to:', email);
      console.log('📧 Registration response:', result);

      // Log the OTP if it's in the response (development mode)
      if (result && typeof result === 'string' && result.includes('OTP')) {
        console.log('📧 Check the backend console for the OTP code');
      } else if (result && typeof result === 'object' && 'otp' in result) {
        console.log('🔑 OTP CODE:', (result as any).otp);
        console.log('⏰ Enter this 4-digit code on the verification screen');
      }

      // Registration successful - navigate to OTP verification
      navigation.navigate('VerifyEmail', { email });
    } catch (error: any) {
      // Error is handled by the useEffect above via authError
      console.error('❌ Registration error:', error);
    }
  };

  const handleLoginNavigation = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
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
              <Ionicons name="person-add-outline" size={48} color={colors.primary} />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started with Fintrax</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <InputField
              label="Username"
              placeholder="Enter your username"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setUsernameError(null);
              }}
              type="text"
              leftIcon="person-outline"
              error={usernameError}
              autoFocus
              editable={!isLoading}
              testID="username-input"
            />

            <InputField
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError(null);
              }}
              type="email"
              leftIcon="mail-outline"
              error={emailError}
              editable={!isLoading}
              testID="email-input"
            />

            <InputField
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError(null);
              }}
              type="password"
              leftIcon="lock-closed-outline"
              error={passwordError}
              editable={!isLoading}
              testID="password-input"
            />

            {/* Password Strength Indicator */}
            <PasswordStrengthIndicator password={password} />

            <InputField
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setConfirmPasswordError(null);
              }}
              type="password"
              leftIcon="lock-closed-outline"
              error={confirmPasswordError}
              editable={!isLoading}
              testID="confirm-password-input"
            />

            {/* Terms and Conditions */}
            <Text style={styles.termsText}>
              By signing up, you agree to our <Text style={styles.termsLink}>Terms of Service</Text>{' '}
              and <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>

            {/* Register Button */}
            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={isLoading}
              disabled={isLoading}
              fullWidth
              testID="register-button"
            />

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleLoginNavigation} disabled={isLoading}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  flex: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },

  header: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
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
    marginBottom: spacing.xs,
  },

  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  form: {
    flex: 1,
  },

  termsText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
  },

  termsLink: {
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },

  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },

  signInText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },

  signInLink: {
    fontSize: typography.fontSize.md,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
});
