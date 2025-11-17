/**
 * AnimatedDecorator
 * Adds animations to component interactions
 * Concrete implementation of Decorator Pattern
 */

import React, { useRef, useEffect } from 'react';
import { Animated, GestureResponderEvent } from 'react-native';
import { ComponentDecorator } from './ComponentDecorator';

export type AnimationType = 'scale' | 'fade' | 'slide' | 'bounce';

export class AnimatedDecorator implements ComponentDecorator {
  private animationType: AnimationType;
  private duration: number;
  private animatedValue: Animated.Value;

  constructor(animationType: AnimationType = 'scale', duration: number = 150) {
    this.animationType = animationType;
    this.duration = duration;
    this.animatedValue = new Animated.Value(1);
  }

  decorateOnPress(
    originalOnPress?: (event: GestureResponderEvent) => void
  ): (event: GestureResponderEvent) => void {
    return (event: GestureResponderEvent) => {
      this.animate(() => {
        if (originalOnPress) {
          originalOnPress(event);
        }
      });
    };
  }

  decorateStyle(originalStyle?: any): any {
    const animatedStyle = this.getAnimatedStyle();
    return [originalStyle, animatedStyle];
  }

  private animate(callback?: () => void): void {
    // Press animation
    Animated.sequence([
      Animated.timing(this.animatedValue, {
        toValue: 0.95,
        duration: this.duration / 2,
        useNativeDriver: true,
      }),
      Animated.timing(this.animatedValue, {
        toValue: 1,
        duration: this.duration / 2,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (callback) {
        callback();
      }
    });
  }

  private getAnimatedStyle(): any {
    switch (this.animationType) {
      case 'scale':
        return {
          transform: [{ scale: this.animatedValue }],
        };
      case 'fade':
        return {
          opacity: this.animatedValue,
        };
      case 'slide':
        return {
          transform: [
            {
              translateY: this.animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 0],
              }),
            },
          ],
        };
      case 'bounce':
        return {
          transform: [
            {
              scale: this.animatedValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [1, 1.1, 1],
              }),
            },
          ],
        };
      default:
        return {};
    }
  }

  getAnimatedValue(): Animated.Value {
    return this.animatedValue;
  }
}
