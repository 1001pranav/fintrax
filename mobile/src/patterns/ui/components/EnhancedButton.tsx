/**
 * EnhancedButton Component
 * Button component enhanced with decorators
 * Demonstrates Decorator Pattern usage
 */

import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
  Animated,
} from 'react-native';
import { HapticDecorator, HapticFeedbackType } from '../decorators/HapticDecorator';
import { AnimatedDecorator, AnimationType } from '../decorators/AnimatedDecorator';
import { LoadingDecorator } from '../decorators/LoadingDecorator';

interface EnhancedButtonProps {
  title: string;
  onPress: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  hapticFeedback?: HapticFeedbackType | false;
  animation?: AnimationType | false;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  hapticFeedback = 'light',
  animation = 'scale',
  fullWidth = false,
  icon,
  style,
  textStyle,
}) => {
  const [isLoading, setIsLoading] = useState(loading);

  // Create decorators
  const hapticDecorator = hapticFeedback
    ? new HapticDecorator(hapticFeedback, !disabled && !isLoading)
    : null;

  const animatedDecorator = animation ? new AnimatedDecorator(animation) : null;

  const loadingDecorator = new LoadingDecorator(isLoading, getLoadingColor(variant));

  // Compose onPress handler with decorators
  const handlePress = async (event: GestureResponderEvent) => {
    if (disabled || isLoading) return;

    let decoratedOnPress = async () => {
      setIsLoading(true);
      try {
        await onPress();
      } finally {
        setIsLoading(false);
      }
    };

    // Apply haptic decorator
    if (hapticDecorator) {
      const originalOnPress = decoratedOnPress;
      decoratedOnPress = async () => {
        hapticDecorator.decorateOnPress(() => {})(event);
        await originalOnPress();
      };
    }

    await decoratedOnPress();
  };

  // Get button style
  const buttonStyle = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    fullWidth && styles.fullWidth,
    (disabled || isLoading) && styles.disabled,
    style,
  ];

  // Get text style
  const buttonTextStyle = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    textStyle,
  ];

  // Apply animation decorator
  const animatedStyle = animatedDecorator
    ? animatedDecorator.decorateStyle(buttonStyle)
    : buttonStyle;

  // Render children with loading decorator
  const children = loadingDecorator.decorateChildren(
    <>
      {icon}
      <Text style={buttonTextStyle}>{title}</Text>
    </>
  );

  if (animatedDecorator) {
    return (
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          onPress={handlePress}
          disabled={disabled || isLoading}
          activeOpacity={0.7}
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={handlePress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
};

const getLoadingColor = (variant: string): string => {
  switch (variant) {
    case 'primary':
    case 'danger':
      return '#FFFFFF';
    default:
      return '#4F46E5';
  }
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    gap: 8,
  },
  // Variant styles
  button_primary: {
    backgroundColor: '#4F46E5',
  },
  button_secondary: {
    backgroundColor: '#9333EA',
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  button_ghost: {
    backgroundColor: 'transparent',
  },
  button_danger: {
    backgroundColor: '#EF4444',
  },
  // Size styles
  button_small: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  button_medium: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  button_large: {
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  // Text styles
  text: {
    fontWeight: '600',
  },
  text_primary: {
    color: '#FFFFFF',
  },
  text_secondary: {
    color: '#FFFFFF',
  },
  text_outline: {
    color: '#4F46E5',
  },
  text_ghost: {
    color: '#4F46E5',
  },
  text_danger: {
    color: '#FFFFFF',
  },
  text_small: {
    fontSize: 14,
  },
  text_medium: {
    fontSize: 16,
  },
  text_large: {
    fontSize: 18,
  },
  // Other styles
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});
