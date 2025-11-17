/**
 * MoreScreen - Main Settings Hub
 * Central navigation for settings and profile
 * Part of US-5.8: Settings & Profile Screen (MVC Pattern)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import { ProfileController } from '../../controllers/ProfileController';
import { UserProfileModel } from '../../models/UserProfileModel';

export const MoreScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const [controller] = useState(() => new ProfileController(new UserProfileModel()));
  const [username, setUsername] = useState('Guest');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    await controller.initialize();
    const profile = controller.getProfile();
    if (profile) {
      setUsername(profile.username || profile.fullName || 'User');
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await controller.logout();
          // Navigate to login screen
          // navigation.navigate('Login');
        },
      },
    ]);
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: 'account',
          label: 'Profile',
          subtitle: 'Manage your profile information',
          onPress: () => {
            /* navigation.navigate('Profile') */
          },
        },
        {
          icon: 'shield-account',
          label: 'Security',
          subtitle: 'Biometric authentication & password',
          onPress: () => {
            /* navigation.navigate('SecuritySettings') */
          },
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: 'palette',
          label: 'Appearance',
          subtitle: 'Theme and display settings',
          onPress: () => {
            /* navigation.navigate('AppearanceSettings') */
          },
        },
        {
          icon: 'bell',
          label: 'Notifications',
          subtitle: 'Manage notification preferences',
          onPress: () => {
            /* navigation.navigate('NotificationSettings') */
          },
        },
        {
          icon: 'translate',
          label: 'Language & Region',
          subtitle: 'Change language and currency',
          onPress: () => {
            /* navigation.navigate('LanguageSettings') */
          },
        },
      ],
    },
    {
      title: 'Data & Privacy',
      items: [
        {
          icon: 'database',
          label: 'Data Usage',
          subtitle: 'Manage app data and storage',
          onPress: () => {},
        },
        {
          icon: 'shield-check',
          label: 'Privacy',
          subtitle: 'Privacy policy and terms',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help-circle',
          label: 'Help & Support',
          subtitle: 'FAQs and contact support',
          onPress: () => {},
        },
        {
          icon: 'information',
          label: 'About',
          subtitle: 'App version and legal information',
          onPress: () => {},
        },
        {
          icon: 'star',
          label: 'Rate App',
          subtitle: 'Rate Fintrax on the App Store',
          onPress: () => {},
        },
      ],
    },
  ];

  const dynamicStyles = {
    container: {
      ...styles.container,
      backgroundColor: colors.background,
    },
    profileCard: {
      ...styles.profileCard,
      backgroundColor: colors.card,
      shadowColor: colors.shadow,
    },
    sectionTitle: {
      ...styles.sectionTitle,
      color: colors.textSecondary,
    },
    settingsCard: {
      ...styles.settingsCard,
      backgroundColor: colors.card,
      shadowColor: colors.shadow,
    },
    settingLabel: {
      ...styles.settingLabel,
      color: colors.text,
    },
    settingSubtitle: {
      ...styles.settingSubtitle,
      color: colors.textSecondary,
    },
    divider: {
      ...styles.divider,
      backgroundColor: colors.divider,
    },
  };

  return (
    <ScrollView style={dynamicStyles.container} contentContainerStyle={styles.content}>
      {/* Profile Card */}
      <TouchableOpacity
        style={dynamicStyles.profileCard}
        onPress={() => {
          /* navigation.navigate('Profile') */
        }}
        activeOpacity={0.7}
      >
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>{controller.getUserInitials()}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.username, { color: colors.text }]}>{username}</Text>
          <Text style={[styles.viewProfile, { color: colors.primary }]}>
            View Profile
          </Text>
        </View>
        <Icon name="chevron-right" size={24} color={colors.textTertiary} />
      </TouchableOpacity>

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={dynamicStyles.sectionTitle}>{section.title}</Text>
          <View style={dynamicStyles.settingsCard}>
            {section.items.map((item, itemIndex) => (
              <React.Fragment key={itemIndex}>
                <TouchableOpacity
                  style={styles.settingItem}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <Icon name={item.icon} size={24} color={colors.primary} />
                  <View style={styles.settingContent}>
                    <Text style={dynamicStyles.settingLabel}>{item.label}</Text>
                    <Text style={dynamicStyles.settingSubtitle}>{item.subtitle}</Text>
                  </View>
                  <Icon name="chevron-right" size={24} color={colors.textTertiary} />
                </TouchableOpacity>
                {itemIndex < section.items.length - 1 && (
                  <View style={dynamicStyles.divider} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>
      ))}

      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.logoutButton, { borderColor: colors.error }]}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Icon name="logout" size={20} color={colors.error} />
        <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
      </TouchableOpacity>

      {/* App Version */}
      <Text style={[styles.version, { color: colors.textTertiary }]}>
        Fintrax v1.0.0
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  viewProfile: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  settingsCard: {
    borderRadius: 12,
    padding: 4,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  settingContent: {
    flex: 1,
    marginLeft: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    marginHorizontal: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 8,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 16,
    marginBottom: 8,
  },
});
