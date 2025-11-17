/**
 * HapticDecorator
 * Adds haptic feedback to component interactions
 * Concrete implementation of Decorator Pattern
 */

import * as Haptics from 'expo-haptics';
import { GestureResponderEvent } from 'react-native';
import { ComponentDecorator } from './ComponentDecorator';

export type HapticFeedbackType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error'
  | 'selection';

export class HapticDecorator implements ComponentDecorator {
  private feedbackType: HapticFeedbackType;
  private enabled: boolean;

  constructor(feedbackType: HapticFeedbackType = 'light', enabled: boolean = true) {
    this.feedbackType = feedbackType;
    this.enabled = enabled;
  }

  decorateOnPress(
    originalOnPress?: (event: GestureResponderEvent) => void
  ): (event: GestureResponderEvent) => void {
    return (event: GestureResponderEvent) => {
      if (this.enabled) {
        this.triggerHaptic();
      }
      if (originalOnPress) {
        originalOnPress(event);
      }
    };
  }

  private async triggerHaptic(): Promise<void> {
    try {
      switch (this.feedbackType) {
        case 'light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'success':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        case 'selection':
          await Haptics.selectionAsync();
          break;
      }
    } catch (error) {
      console.warn('[HapticDecorator] Haptic feedback failed:', error);
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  setFeedbackType(type: HapticFeedbackType): void {
    this.feedbackType = type;
  }
}
