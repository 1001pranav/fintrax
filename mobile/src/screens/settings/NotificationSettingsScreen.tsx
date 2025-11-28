/**
 * NotificationSettingsScreen
 * Screen for managing notification settings
 * Part of Sprint 5 - US-5.2: Push Notifications Setup
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotifications } from '../../hooks/useNotifications';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const NotificationSettingsScreen: React.FC = () => {
  const { hasPermission, scheduledNotifications, cancelAllNotifications, requestPermissions } =
    useNotifications();

  // Local state for notification preferences
  const [taskReminders, setTaskReminders] = useState(true);
  const [financeAlerts, setFinanceAlerts] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  const handleEnableNotifications = async () => {
    const granted = await requestPermissions();
    if (!granted) {
      Alert.alert(
        'Permissions Required',
        'Please enable notifications in your device settings to receive alerts.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleClearAllNotifications = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all scheduled notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            const success = await cancelAllNotifications();
            if (success) {
              Alert.alert('Success', 'All notifications cleared.', [{ text: 'OK' }]);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
        {/* Notification Permission Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Permission</Text>

          {!hasPermission ? (
            <View style={styles.card}>
              <Icon name="bell-off" size={48} color="#F59E0B" style={styles.centerIcon} />
              <Text style={styles.warningText}>Notifications are disabled</Text>
              <Text style={styles.warningSubtext}>
                Enable notifications to receive important alerts about your tasks and finances.
              </Text>
              <TouchableOpacity
                style={styles.enableButton}
                onPress={handleEnableNotifications}
                activeOpacity={0.7}
              >
                <Icon name="bell-ring" size={20} color="#FFFFFF" />
                <Text style={styles.enableButtonText}>Enable Notifications</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.card}>
              <View style={styles.row}>
                <Icon name="bell-check" size={24} color="#10B981" style={styles.settingIcon} />
                <Text style={styles.successText}>Notifications are enabled</Text>
              </View>
            </View>
          )}
        </View>

        {/* Notification Types Section */}
        {hasPermission && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notification Types</Text>

              <View style={styles.card}>
                <View style={styles.settingItem}>
                  <View style={styles.iconTextContainer}>
                    <Icon
                      name="checkbox-marked-circle"
                      size={24}
                      color="#4F46E5"
                      style={styles.settingIcon}
                    />
                    <View style={styles.textContainer}>
                      <Text style={styles.settingLabel}>Task Reminders</Text>
                      <Text style={styles.settingDescription}>
                        Get reminded about upcoming and overdue tasks
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={taskReminders}
                    onValueChange={setTaskReminders}
                    trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
                    thumbColor={taskReminders ? '#4F46E5' : '#F3F4F6'}
                    ios_backgroundColor="#D1D5DB"
                  />
                </View>

                <View style={styles.divider} />

                <View style={styles.settingItem}>
                  <View style={styles.iconTextContainer}>
                    <Icon name="cash" size={24} color="#4F46E5" style={styles.settingIcon} />
                    <View style={styles.textContainer}>
                      <Text style={styles.settingLabel}>Finance Alerts</Text>
                      <Text style={styles.settingDescription}>
                        Transaction confirmations and financial updates
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={financeAlerts}
                    onValueChange={setFinanceAlerts}
                    trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
                    thumbColor={financeAlerts ? '#4F46E5' : '#F3F4F6'}
                    ios_backgroundColor="#D1D5DB"
                  />
                </View>

                <View style={styles.divider} />

                <View style={styles.settingItem}>
                  <View style={styles.iconTextContainer}>
                    <Icon name="chart-line" size={24} color="#4F46E5" style={styles.settingIcon} />
                    <View style={styles.textContainer}>
                      <Text style={styles.settingLabel}>Budget Alerts</Text>
                      <Text style={styles.settingDescription}>
                        Notifications when approaching budget limits
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={budgetAlerts}
                    onValueChange={setBudgetAlerts}
                    trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
                    thumbColor={budgetAlerts ? '#4F46E5' : '#F3F4F6'}
                    ios_backgroundColor="#D1D5DB"
                  />
                </View>
              </View>
            </View>

            {/* Notification Settings Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notification Settings</Text>

              <View style={styles.card}>
                <View style={styles.settingItem}>
                  <View style={styles.iconTextContainer}>
                    <Icon name="volume-high" size={24} color="#4F46E5" style={styles.settingIcon} />
                    <Text style={styles.settingLabel}>Sound</Text>
                  </View>
                  <Switch
                    value={soundEnabled}
                    onValueChange={setSoundEnabled}
                    trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
                    thumbColor={soundEnabled ? '#4F46E5' : '#F3F4F6'}
                    ios_backgroundColor="#D1D5DB"
                  />
                </View>

                <View style={styles.divider} />

                <View style={styles.settingItem}>
                  <View style={styles.iconTextContainer}>
                    <Icon name="vibrate" size={24} color="#4F46E5" style={styles.settingIcon} />
                    <Text style={styles.settingLabel}>Vibration</Text>
                  </View>
                  <Switch
                    value={vibrationEnabled}
                    onValueChange={setVibrationEnabled}
                    trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
                    thumbColor={vibrationEnabled ? '#4F46E5' : '#F3F4F6'}
                    ios_backgroundColor="#D1D5DB"
                  />
                </View>
              </View>
            </View>

            {/* Scheduled Notifications Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Scheduled Notifications</Text>

              <View style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.infoLabel}>Active Notifications:</Text>
                  <Text style={styles.infoValue}>{scheduledNotifications.length}</Text>
                </View>

                {scheduledNotifications.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={handleClearAllNotifications}
                    activeOpacity={0.7}
                  >
                    <Icon name="delete-sweep" size={20} color="#EF4444" />
                    <Text style={styles.clearButtonText}>Clear All</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </>
        )}

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Icon name="information" size={20} color="#6B7280" />
          <Text style={styles.infoText}>
            Notifications help you stay on top of your tasks and finances. You can customize which
            notifications you receive.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
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
  centerIcon: {
    alignSelf: 'center',
    marginBottom: 12,
  },
  warningText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  warningSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  successText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 12,
  },
  enableButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  enableButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  clearButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoSection: {
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
  },
});
