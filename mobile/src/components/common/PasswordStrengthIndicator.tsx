import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@theme';
import { getPasswordStrength } from '@utils/validators';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
}) => {
  if (!password) {
    return null;
  }

  const strength = getPasswordStrength(password);

  const getStrengthColor = () => {
    switch (strength) {
      case 'weak':
        return colors.error;
      case 'medium':
        return colors.warning;
      case 'strong':
        return colors.success;
      case 'very-strong':
        return colors.success;
      default:
        return colors.gray300;
    }
  };

  const getStrengthWidth = () => {
    switch (strength) {
      case 'weak':
        return '25%';
      case 'medium':
        return '50%';
      case 'strong':
        return '75%';
      case 'very-strong':
        return '100%';
      default:
        return '0%';
    }
  };

  const getStrengthText = () => {
    switch (strength) {
      case 'weak':
        return 'Weak password';
      case 'medium':
        return 'Medium strength';
      case 'strong':
        return 'Strong password';
      case 'very-strong':
        return 'Very strong!';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <View
          style={[
            styles.bar,
            {
              width: getStrengthWidth(),
              backgroundColor: getStrengthColor(),
            },
          ]}
        />
      </View>
      <Text style={[styles.text, { color: getStrengthColor() }]}>{getStrengthText()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },

  barContainer: {
    height: 4,
    backgroundColor: colors.gray200,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },

  bar: {
    height: '100%',
    borderRadius: 2,
  },

  text: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
});
