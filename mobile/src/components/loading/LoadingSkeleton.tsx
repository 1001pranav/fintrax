/**
 * LoadingSkeleton Component
 * Displays skeleton loaders while content is loading
 * Part of US-5.6: Pull-to-Refresh & Loading States
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';

interface LoadingSkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: width as any,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

interface CardSkeletonProps {
  style?: ViewStyle;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ style }) => {
  return (
    <View style={[styles.card, style]}>
      <LoadingSkeleton width="60%" height={20} style={styles.title} />
      <LoadingSkeleton width="100%" height={16} style={styles.line} />
      <LoadingSkeleton width="80%" height={16} style={styles.line} />
      <View style={styles.footer}>
        <LoadingSkeleton width={80} height={24} borderRadius={12} />
        <LoadingSkeleton width={60} height={16} />
      </View>
    </View>
  );
};

interface ListSkeletonProps {
  count?: number;
  style?: ViewStyle;
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({ count = 5, style }) => {
  return (
    <View style={style}>
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} style={styles.cardMargin} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E5E7EB',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardMargin: {
    marginBottom: 12,
  },
  title: {
    marginBottom: 12,
  },
  line: {
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
});
