/**
 * AppearanceSettingsScreen
 * Screen for managing appearance settings including theme
 * Part of Sprint 5 - US-5.4: Dark Mode
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { ThemeMode } from '../../patterns/theme/ThemeManager';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const AppearanceSettingsScreen: React.FC = () => {
  const { colors, mode, isDark, setTheme } = useTheme();
  const [isChanging, setIsChanging] = useState(false);

  const themeOptions: Array<{
    mode: ThemeMode;
    title: string;
    description: string;
    icon: string;
  }> = [
    {
      mode: 'light',
      title: 'Light',
      description: 'Always use light theme',
      icon: 'white-balance-sunny',
    },
    {
      mode: 'dark',
      title: 'Dark',
      description: 'Always use dark theme',
      icon: 'weather-night',
    },
    {
      mode: 'auto',
      title: 'Auto',
      description: 'Follow system settings',
      icon: 'theme-light-dark',
    },
  ];

  const handleThemeChange = async (newMode: ThemeMode) => {
    if (newMode === mode) return;

    setIsChanging(true);
    try {
      await setTheme(newMode);
    } catch (error) {
      Alert.alert('Error', 'Failed to change theme. Please try again.', [
        { text: 'OK' },
      ]);
    } finally {
      setIsChanging(false);
    }
  };

  const dynamicStyles = {
    container: {
      ...styles.container,
      backgroundColor: colors.background,
    },
    section: {
      ...styles.section,
    },
    sectionTitle: {
      ...styles.sectionTitle,
      color: colors.text,
    },
    card: {
      ...styles.card,
      backgroundColor: colors.card,
      shadowColor: colors.shadow,
    },
    themeOption: {
      ...styles.themeOption,
      borderColor: colors.border,
    },
    themeOptionActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight + '20',
    },
    themeTitle: {
      ...styles.themeTitle,
      color: colors.text,
    },
    themeDescription: {
      ...styles.themeDescription,
      color: colors.textSecondary,
    },
    infoSection: {
      ...styles.infoSection,
      backgroundColor: colors.primary + '20',
    },
    infoText: {
      ...styles.infoText,
      color: colors.textSecondary,
    },
  };

  return (
    <ScrollView style={dynamicStyles.container} contentContainerStyle={styles.content}>
      {/* Theme Selection Section */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Theme</Text>

        <View style={dynamicStyles.card}>
          {themeOptions.map((option, index) => {
            const isActive = option.mode === mode;

            return (
              <React.Fragment key={option.mode}>
                <TouchableOpacity
                  style={[
                    dynamicStyles.themeOption,
                    isActive && dynamicStyles.themeOptionActive,
                  ]}
                  onPress={() => handleThemeChange(option.mode)}
                  disabled={isChanging || isActive}
                  activeOpacity={0.7}
                >
                  <View style={styles.themeContent}>
                    <Icon
                      name={option.icon}
                      size={32}
                      color={isActive ? colors.primary : colors.textSecondary}
                      style={styles.themeIcon}
                    />
                    <View style={styles.themeTextContainer}>
                      <Text style={dynamicStyles.themeTitle}>{option.title}</Text>
                      <Text style={dynamicStyles.themeDescription}>
                        {option.description}
                      </Text>
                    </View>
                  </View>
                  {isActive && (
                    <Icon name="check-circle" size={24} color={colors.primary} />
                  )}
                </TouchableOpacity>

                {index < themeOptions.length - 1 && (
                  <View style={[styles.divider, { backgroundColor: colors.divider }]} />
                )}
              </React.Fragment>
            );
          })}
        </View>
      </View>

      {/* Current Theme Preview Section */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Preview</Text>

        <View style={dynamicStyles.card}>
          <View style={styles.previewContainer}>
            <View style={styles.previewRow}>
              <Text style={dynamicStyles.themeTitle}>Current Theme:</Text>
              <Text style={[dynamicStyles.themeTitle, { color: colors.primary }]}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </View>

            <View style={styles.previewRow}>
              <Text style={dynamicStyles.themeTitle}>Dark Mode:</Text>
              <Text style={[dynamicStyles.themeTitle, { color: colors.primary }]}>
                {isDark ? 'Yes' : 'No'}
              </Text>
            </View>

            <View style={styles.colorPreviewContainer}>
              <View style={styles.colorPreviewRow}>
                <View style={styles.colorBox}>
                  <View
                    style={[styles.colorCircle, { backgroundColor: colors.primary }]}
                  />
                  <Text style={[styles.colorLabel, { color: colors.textSecondary }]}>
                    Primary
                  </Text>
                </View>

                <View style={styles.colorBox}>
                  <View
                    style={[styles.colorCircle, { backgroundColor: colors.accent }]}
                  />
                  <Text style={[styles.colorLabel, { color: colors.textSecondary }]}>
                    Accent
                  </Text>
                </View>

                <View style={styles.colorBox}>
                  <View
                    style={[styles.colorCircle, { backgroundColor: colors.success }]}
                  />
                  <Text style={[styles.colorLabel, { color: colors.textSecondary }]}>
                    Success
                  </Text>
                </View>
              </View>

              <View style={styles.colorPreviewRow}>
                <View style={styles.colorBox}>
                  <View
                    style={[styles.colorCircle, { backgroundColor: colors.warning }]}
                  />
                  <Text style={[styles.colorLabel, { color: colors.textSecondary }]}>
                    Warning
                  </Text>
                </View>

                <View style={styles.colorBox}>
                  <View
                    style={[styles.colorCircle, { backgroundColor: colors.error }]}
                  />
                  <Text style={[styles.colorLabel, { color: colors.textSecondary }]}>
                    Error
                  </Text>
                </View>

                <View style={styles.colorBox}>
                  <View
                    style={[styles.colorCircle, { backgroundColor: colors.info }]}
                  />
                  <Text style={[styles.colorLabel, { color: colors.textSecondary }]}>
                    Info
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Info Section */}
      <View style={dynamicStyles.infoSection}>
        <Icon name="information" size={20} color={colors.textSecondary} />
        <Text style={dynamicStyles.infoText}>
          The theme setting applies to the entire app. Auto mode will automatically switch
          between light and dark themes based on your device settings.
        </Text>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    padding: 0,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 2,
    borderRadius: 8,
    marginHorizontal: 12,
    marginVertical: 6,
  },
  themeOptionActive: {
    borderWidth: 2,
  },
  themeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  themeIcon: {
    marginRight: 16,
  },
  themeTextContainer: {
    flex: 1,
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  themeDescription: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginVertical: 4,
    marginHorizontal: 12,
  },
  previewContainer: {
    padding: 16,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  colorPreviewContainer: {
    marginTop: 16,
  },
  colorPreviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  colorBox: {
    alignItems: 'center',
    flex: 1,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
  },
  colorLabel: {
    fontSize: 12,
  },
  infoSection: {
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
});
