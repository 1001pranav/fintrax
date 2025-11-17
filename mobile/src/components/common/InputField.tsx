import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@theme';

export interface InputFieldProps extends TextInputProps {
  /**
   * Input label
   */
  label?: string;

  /**
   * Input error message
   */
  error?: string | null;

  /**
   * Input type (affects keyboard and behavior)
   */
  type?: 'text' | 'email' | 'password' | 'number';

  /**
   * Show password visibility toggle (for password type)
   */
  showPasswordToggle?: boolean;

  /**
   * Custom container style
   */
  containerStyle?: ViewStyle;

  /**
   * Left icon name (from Ionicons)
   */
  leftIcon?: keyof typeof Ionicons.glyphMap;

  /**
   * Right icon name (from Ionicons)
   */
  rightIcon?: keyof typeof Ionicons.glyphMap;

  /**
   * Right icon press handler
   */
  onRightIconPress?: () => void;

  /**
   * Test ID for testing
   */
  testID?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  type = 'text',
  showPasswordToggle = true,
  containerStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
  testID,
  ...textInputProps
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPassword = type === 'password';
  const showToggle = isPassword && showPasswordToggle;

  // Determine keyboard type based on input type
  const getKeyboardType = (): TextInputProps['keyboardType'] => {
    switch (type) {
      case 'email':
        return 'email-address';
      case 'number':
        return 'numeric';
      default:
        return 'default';
    }
  };

  // Determine autocapitalize based on input type
  const getAutoCapitalize = (): TextInputProps['autoCapitalize'] => {
    if (type === 'email') return 'none';
    return textInputProps.autoCapitalize || 'sentences';
  };

  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.inputContainer, error && styles.inputContainerError]}>
        {leftIcon && (
          <Ionicons name={leftIcon} size={20} color={colors.gray400} style={styles.leftIcon} />
        )}

        <TextInput
          style={[styles.input, leftIcon ? styles.inputWithLeftIcon : undefined]}
          placeholderTextColor={colors.inputPlaceholder}
          keyboardType={getKeyboardType()}
          autoCapitalize={getAutoCapitalize()}
          secureTextEntry={isPassword && !isPasswordVisible}
          {...textInputProps}
        />

        {showToggle && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.rightIcon}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.gray400}
            />
          </TouchableOpacity>
        )}

        {!showToggle && rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIcon}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name={rightIcon} size={20} color={colors.gray400} />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },

  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray700,
    marginBottom: spacing.xs,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    minHeight: 48,
  },

  inputContainerError: {
    borderColor: colors.error,
  },

  leftIcon: {
    marginLeft: spacing.md,
  },

  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.inputText,
  },

  inputWithLeftIcon: {
    paddingLeft: spacing.sm,
  },

  rightIcon: {
    paddingHorizontal: spacing.md,
  },

  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
