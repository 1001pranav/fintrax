/**
 * AmountInput Component
 * Large number input for entering monetary amounts
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardType } from 'react-native';
import { formatCurrency } from '../../utils/formatters';

interface AmountInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  currency?: string;
  showFormatted?: boolean;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChangeText,
  label = 'Amount',
  placeholder = '0.00',
  error,
  currency = '$',
  showFormatted = true,
}) => {
  const handleTextChange = (text: string) => {
    // Allow only numbers and decimal point
    const cleanText = text.replace(/[^0-9.]/g, '');

    // Ensure only one decimal point
    const parts = cleanText.split('.');
    if (parts.length > 2) {
      return;
    }

    // Limit decimal places to 2
    if (parts.length === 2 && parts[1].length > 2) {
      return;
    }

    onChangeText(cleanText);
  };

  const numericValue = parseFloat(value) || 0;
  const formattedValue = showFormatted && numericValue > 0 ? formatCurrency(numericValue) : '';

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.inputContainer, error && styles.inputContainerError]}>
        <Text style={styles.currency}>{currency}</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType="decimal-pad"
          maxLength={12}
          autoFocus={false}
        />
      </View>

      {showFormatted && numericValue > 0 && (
        <Text style={styles.formattedText}>{formattedValue}</Text>
      )}

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputContainerError: {
    borderColor: '#EF4444',
  },
  currency: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6B7280',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1F2937',
    paddingVertical: 12,
  },
  formattedText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'right',
  },
  error: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 4,
  },
});
