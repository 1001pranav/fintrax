/**
 * SecuritySettingsScreen
 * Screen for managing security settings including biometric authentication
 * Part of Sprint 5 - US-5.1: Biometric Authentication
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useBiometrics } from '../../hooks/useBiometrics';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const SecuritySettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const {
    isSupported,
    isEnabled,
    isLoading,
    biometricType,
    retryAttempts,
    remainingAttempts,
    enableBiometric,
    disableBiometric,
    authenticate,
  } = useBiometrics();

  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleToggleBiometric = async (value: boolean) => {
    if (value) {
      // Enable biometric authentication
      setIsSwitchLoading(true);
      try {
        // First authenticate the user
        const authResult = await authenticate();

        if (authResult.success) {
          await enableBiometric();
          Alert.alert(
            'Success',
            `${biometricType} authentication has been enabled for Fintrax.`,
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            'Authentication Failed',
            authResult.error || 'Failed to authenticate. Please try again.',
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        Alert.alert(
          'Error',
          'An error occurred while enabling biometric authentication.',
          [{ text: 'OK' }]
        );
      } finally {
        setIsSwitchLoading(false);
      }
    } else {
      // Disable biometric authentication
      Alert.alert(
        'Disable Biometric Authentication',
        `Are you sure you want to disable ${biometricType}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: async () => {
              setIsSwitchLoading(true);
              try {
                await disableBiometric();
                Alert.alert(
                  'Success',
                  'Biometric authentication has been disabled.',
                  [{ text: 'OK' }]
                );
              } catch (error) {
                Alert.alert('Error', 'Failed to disable biometric authentication.', [
                  { text: 'OK' },
                ]);
              } finally {
                setIsSwitchLoading(false);
              }
            },
          },
        ]
      );
    }
  };

  const handleTestBiometric = async () => {
    try {
      const result = await authenticate();

      if (result.success) {
        Alert.alert('Success', 'Authentication successful!', [{ text: 'OK' }]);
      } else {
        Alert.alert(
          'Authentication Failed',
          result.error || 'Authentication failed. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during authentication.', [
        { text: 'OK' },
      ]);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Biometric Authentication Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Biometric Authentication</Text>

        {!isSupported ? (
          <View style={styles.card}>
            <Icon name="alert-circle" size={48} color="#FF6B6B" style={styles.icon} />
            <Text style={styles.notSupportedText}>
              Biometric authentication is not available on this device.
            </Text>
            <Text style={styles.notSupportedSubtext}>
              Make sure you have set up Face ID, Touch ID, or Fingerprint in your device
              settings.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.card}>
              <View style={styles.row}>
                <View style={styles.iconTextContainer}>
                  <Icon
                    name={
                      biometricType.includes('Face')
                        ? 'face-recognition'
                        : 'fingerprint'
                    }
                    size={24}
                    color="#4F46E5"
                    style={styles.settingIcon}
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.settingLabel}>Use {biometricType}</Text>
                    <Text style={styles.settingDescription}>
                      Unlock Fintrax with {biometricType} for quick and secure access
                    </Text>
                  </View>
                </View>
                <Switch
                  value={isEnabled}
                  onValueChange={handleToggleBiometric}
                  disabled={isSwitchLoading}
                  trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
                  thumbColor={isEnabled ? '#4F46E5' : '#F3F4F6'}
                  ios_backgroundColor="#D1D5DB"
                />
              </View>
            </View>

            {isEnabled && (
              <TouchableOpacity
                style={styles.testButton}
                onPress={handleTestBiometric}
                activeOpacity={0.7}
              >
                <Icon name="shield-check" size={20} color="#FFFFFF" />
                <Text style={styles.testButtonText}>Test {biometricType}</Text>
              </TouchableOpacity>
            )}

            {retryAttempts > 0 && (
              <View style={styles.warningCard}>
                <Icon name="alert" size={20} color="#F59E0B" />
                <Text style={styles.warningText}>
                  {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''}{' '}
                  remaining before password fallback
                </Text>
              </View>
            )}
          </>
        )}
      </View>

      {/* Additional Security Options Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Security</Text>

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              /* TODO: Navigate to Change Password */
            }}
            activeOpacity={0.7}
          >
            <View style={styles.iconTextContainer}>
              <Icon name="key" size={24} color="#4F46E5" style={styles.settingIcon} />
              <View style={styles.textContainer}>
                <Text style={styles.settingLabel}>Change Password</Text>
                <Text style={styles.settingDescription}>
                  Update your account password
                </Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              /* TODO: Navigate to Two-Factor Auth */
            }}
            activeOpacity={0.7}
          >
            <View style={styles.iconTextContainer}>
              <Icon
                name="two-factor-authentication"
                size={24}
                color="#4F46E5"
                style={styles.settingIcon}
              />
              <View style={styles.textContainer}>
                <Text style={styles.settingLabel}>Two-Factor Authentication</Text>
                <Text style={styles.settingDescription}>
                  Add an extra layer of security
                </Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Icon name="information" size={20} color="#6B7280" />
        <Text style={styles.infoText}>
          Biometric data is stored securely on your device and is never sent to our
          servers.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  testButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  warningCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  warningText: {
    fontSize: 14,
    color: '#92400E',
    marginLeft: 8,
    flex: 1,
  },
  notSupportedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginTop: 12,
  },
  notSupportedSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  icon: {
    alignSelf: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
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
