import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getGreeting } from '../../utils/dateUtils';

interface WelcomeHeaderProps {
  userName: string;
  onNotificationPress?: () => void;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ userName, onNotificationPress }) => {
  const greeting = getGreeting();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      <View style={styles.greetingRow}>
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>
            {greeting}, {userName}!
          </Text>
          <Text style={styles.date}>{today}</Text>
        </View>
        <TouchableOpacity
          onPress={onNotificationPress}
          style={styles.notificationButton}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={24} color="#3B82F6" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
