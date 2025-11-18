/**
 * LoadingDecorator
 * Adds loading state to components
 * Concrete implementation of Decorator Pattern
 */

import React from 'react';
import { ActivityIndicator, GestureResponderEvent, View, StyleSheet } from 'react-native';
import { ComponentDecorator } from './ComponentDecorator';

export class LoadingDecorator implements ComponentDecorator {
  private isLoading: boolean;
  private loadingColor: string;
  private disableWhileLoading: boolean;

  constructor(
    isLoading: boolean = false,
    loadingColor: string = '#4F46E5',
    disableWhileLoading: boolean = true
  ) {
    this.isLoading = isLoading;
    this.loadingColor = loadingColor;
    this.disableWhileLoading = disableWhileLoading;
  }

  decorateOnPress(
    originalOnPress?: (event: GestureResponderEvent) => void
  ): ((event: GestureResponderEvent) => void) | undefined {
    if (this.isLoading && this.disableWhileLoading) {
      return () => {
        // Do nothing while loading
      };
    }
    return originalOnPress;
  }

  decorateChildren(originalChildren?: React.ReactNode): React.ReactNode {
    if (this.isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={this.loadingColor} />
          {originalChildren && <View style={styles.hiddenChildren}>{originalChildren}</View>}
        </View>
      );
    }
    return originalChildren;
  }

  setLoading(loading: boolean): void {
    this.isLoading = loading;
  }

  setLoadingColor(color: string): void {
    this.loadingColor = color;
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenChildren: {
    opacity: 0,
    position: 'absolute',
  },
});
