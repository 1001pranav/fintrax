/**
 * ProfileScreen - View in MVC Pattern
 * User profile management screen
 * Part of US-5.8: Settings & Profile Screen (MVC Pattern)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ProfileController } from '../../controllers/ProfileController';
import { UserProfileModel, UserProfile } from '../../models/UserProfileModel';
import { useTheme } from '../../theme/ThemeContext';

export const ProfileScreen: React.FC = () => {
  const { colors } = useTheme();
  const [controller] = useState(() => new ProfileController(new UserProfileModel()));
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    loadProfile();

    // Subscribe to profile changes
    const unsubscribe = controller.subscribe(() => {
      const updatedProfile = controller.getProfile();
      setProfile(updatedProfile);
      if (updatedProfile) {
        updateFormState(updatedProfile);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [controller]);

  const loadProfile = async () => {
    await controller.initialize();
    const loadedProfile = controller.getProfile();
    setProfile(loadedProfile);
    if (loadedProfile) {
      updateFormState(loadedProfile);
    }
  };

  const updateFormState = (prof: UserProfile) => {
    setFullName(prof.fullName || '');
    setEmail(prof.email || '');
    setPhoneNumber(prof.phoneNumber || '');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates: Partial<UserProfile> = {
        fullName,
        email,
        phoneNumber,
      };

      const validation = controller.validateProfile(updates);
      if (!validation.valid) {
        Alert.alert('Validation Error', validation.errors.join('\n'));
        return;
      }

      await controller.updateProfile(updates);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      updateFormState(profile);
    }
    setIsEditing(false);
  };

  const dynamicStyles = {
    container: {
      ...styles.container,
      backgroundColor: colors.background,
    },
    card: {
      ...styles.card,
      backgroundColor: colors.card,
      shadowColor: colors.shadow,
    },
    label: {
      ...styles.label,
      color: colors.textSecondary,
    },
    value: {
      ...styles.value,
      color: colors.text,
    },
    input: {
      ...styles.input,
      color: colors.text,
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
  };

  return (
    <ScrollView style={dynamicStyles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={[dynamicStyles.card, styles.headerCard]}>
        <View style={styles.avatarContainer}>
          {profile?.avatar ? (
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>{controller.getUserInitials()}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.avatarButton}>
            <Icon name="camera" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={[styles.username, { color: colors.text }]}>
          {profile?.username || 'Guest'}
        </Text>
        <Text style={[styles.email, { color: colors.textSecondary }]}>
          {profile?.email || 'No email set'}
        </Text>
      </View>

      {/* Profile Information */}
      <View style={dynamicStyles.card}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Profile Information</Text>
          {!isEditing ? (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Icon name="pencil" size={24} color={colors.primary} />
            </TouchableOpacity>
          ) : (
            <View style={styles.editActions}>
              <TouchableOpacity onPress={handleCancel} style={styles.actionButton}>
                <Text style={[styles.actionText, { color: colors.textSecondary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                disabled={isSaving}
                style={styles.actionButton}
              >
                <Text style={[styles.actionText, { color: colors.primary }]}>
                  {isSaving ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.field}>
          <Text style={dynamicStyles.label}>Full Name</Text>
          {isEditing ? (
            <TextInput
              style={dynamicStyles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor={colors.placeholder}
            />
          ) : (
            <Text style={dynamicStyles.value}>{fullName || 'Not set'}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={dynamicStyles.label}>Email</Text>
          {isEditing ? (
            <TextInput
              style={dynamicStyles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={colors.placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          ) : (
            <Text style={dynamicStyles.value}>{email || 'Not set'}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={dynamicStyles.label}>Phone Number</Text>
          {isEditing ? (
            <TextInput
              style={dynamicStyles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter your phone number"
              placeholderTextColor={colors.placeholder}
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={dynamicStyles.value}>{phoneNumber || 'Not set'}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={dynamicStyles.label}>Username</Text>
          <Text style={dynamicStyles.value}>{profile?.username || 'Not set'}</Text>
        </View>

        <View style={styles.field}>
          <Text style={dynamicStyles.label}>Member Since</Text>
          <Text style={dynamicStyles.value}>
            {profile?.createdAt
              ? new Date(profile.createdAt).toLocaleDateString()
              : 'Unknown'}
          </Text>
        </View>
      </View>

      {/* Danger Zone */}
      <View style={[dynamicStyles.card, styles.dangerCard]}>
        <Text style={[styles.cardTitle, { color: colors.error }]}>Danger Zone</Text>
        <TouchableOpacity
          style={[styles.dangerButton, { borderColor: colors.error }]}
          onPress={() => {
            Alert.alert(
              'Delete Account',
              'Are you sure you want to delete your account? This action cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive' },
              ]
            );
          }}
        >
          <Icon name="delete" size={20} color={colors.error} />
          <Text style={[styles.dangerButtonText, { color: colors.error }]}>
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>
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
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerCard: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  avatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#4F46E5',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  editActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    paddingHorizontal: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
  },
  input: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  dangerCard: {
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 12,
    gap: 8,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
