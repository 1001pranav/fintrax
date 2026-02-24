import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@components/common/Button';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { createProject } from '../../store/slices/projectsSlice';

const COLOR_OPTIONS = [
  { value: '#3B82F6', label: 'Blue' },
  { value: '#10B981', label: 'Green' },
  { value: '#F59E0B', label: 'Orange' },
  { value: '#EF4444', label: 'Red' },
  { value: '#8B5CF6', label: 'Purple' },
  { value: '#EC4899', label: 'Pink' },
];

export const AddProjectScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a project name');
      return;
    }

    setSaving(true);
    try {
      await dispatch(
        createProject({
          name: name.trim(),
          description: description.trim(),
          color: selectedColor,
          userId: user?.id || '',
        })
      ).unwrap();

      // Project created successfully, navigate back
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to create project. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={28} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Project</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Name Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Project Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter project name"
              placeholderTextColor="#9CA3AF"
              autoFocus
            />
          </View>

          {/* Description Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter project description (optional)"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Color Selector */}
          <View style={styles.section}>
            <Text style={styles.label}>Color</Text>
            <View style={styles.colorContainer}>
              {COLOR_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.colorOption,
                    selectedColor === option.value && styles.colorOptionActive,
                  ]}
                  onPress={() => setSelectedColor(option.value)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[styles.colorCircle, { backgroundColor: option.value }]}
                  />
                  {selectedColor === option.value && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={option.value}
                      style={styles.checkmark}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color="#3B82F6" />
            <Text style={styles.infoText}>
              Projects help you organize tasks and track progress across different areas of work.
            </Text>
          </View>

          {/* Save Button */}
          <Button
            title="Create Project"
            onPress={handleSave}
            loading={saving}
            disabled={saving || !name.trim()}
            fullWidth
            testID="save-project-button"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerSpacer: {
    width: 28,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  colorOption: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  colorOptionActive: {
    transform: [{ scale: 1.1 }],
  },
  checkmark: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 12,
    gap: 8,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 18,
  },
});
