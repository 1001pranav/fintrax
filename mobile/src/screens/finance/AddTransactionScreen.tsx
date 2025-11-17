/**
 * AddTransactionScreen
 * Form for creating and editing transactions
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../../store/slices/financeSlice';
import { TransactionType } from '../../constants/types';
import { AmountInput } from '../../components/common/AmountInput';
import { InputField } from '../../components/common/InputField';
import { CategoryPicker } from '../../components/finance/CategoryPicker';
import { Button } from '../../components/common/Button';
import { DEFAULT_EXPENSE_CATEGORY } from '../../constants/financeCategories';

export const AddTransactionScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { transactions } = useAppSelector((state) => state.finance);

  const transactionId = route.params?.transactionId;
  const existingTransaction = transactionId
    ? transactions.find((t) => t.id === transactionId)
    : null;

  const [transactionType, setTransactionType] = useState<TransactionType>(
    existingTransaction?.type || TransactionType.EXPENSE
  );
  const [amount, setAmount] = useState(
    existingTransaction?.amount.toString() || ''
  );
  const [category, setCategory] = useState(
    existingTransaction?.category || DEFAULT_EXPENSE_CATEGORY.id
  );
  const [description, setDescription] = useState(
    existingTransaction?.description || ''
  );
  const [date, setDate] = useState(
    existingTransaction?.date || new Date().toISOString().split('T')[0]
  );
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!existingTransaction;

  const handleTypeToggle = (type: TransactionType) => {
    setTransactionType(type);
    // Reset category when switching types
    if (type === TransactionType.INCOME) {
      setCategory('salary');
    } else {
      setCategory(DEFAULT_EXPENSE_CATEGORY.id);
    }
  };

  const validateForm = (): boolean => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid amount');
      return false;
    }
    if (!category) {
      Alert.alert('Validation Error', 'Please select a category');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const transactionData = {
        amount: parseFloat(amount),
        category,
        description: description.trim(),
        type: transactionType,
        date,
        userId: user?.id || '',
      };

      if (isEditing) {
        await dispatch(
          updateTransaction({
            id: transactionId,
            updates: transactionData,
          })
        ).unwrap();
        Alert.alert('Success', 'Transaction updated successfully');
      } else {
        await dispatch(createTransaction(transactionData)).unwrap();
        Alert.alert('Success', 'Transaction created successfully');
      }

      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save transaction');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteTransaction(transactionId)).unwrap();
              navigation.goBack();
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.message || 'Failed to delete transaction'
              );
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Edit Transaction' : 'Add Transaction'}
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Type Toggle */}
        <View style={styles.typeToggle}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              styles.typeButtonLeft,
              transactionType === TransactionType.INCOME &&
                styles.typeButtonActive,
              transactionType === TransactionType.INCOME && {
                backgroundColor: '#10B981',
              },
            ]}
            onPress={() => handleTypeToggle(TransactionType.INCOME)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.typeButtonText,
                transactionType === TransactionType.INCOME &&
                  styles.typeButtonTextActive,
              ]}
            >
              Income
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              styles.typeButtonRight,
              transactionType === TransactionType.EXPENSE &&
                styles.typeButtonActive,
              transactionType === TransactionType.EXPENSE && {
                backgroundColor: '#EF4444',
              },
            ]}
            onPress={() => handleTypeToggle(TransactionType.EXPENSE)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.typeButtonText,
                transactionType === TransactionType.EXPENSE &&
                  styles.typeButtonTextActive,
              ]}
            >
              Expense
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <AmountInput
          value={amount}
          onChangeText={setAmount}
          label="Amount"
          placeholder="0.00"
        />

        {/* Category Picker */}
        <CategoryPicker
          selectedCategory={category}
          onSelectCategory={setCategory}
          transactionType={transactionType}
        />

        {/* Description */}
        <InputField
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="What was this for?"
          multiline
          numberOfLines={3}
        />

        {/* Date */}
        <InputField
          label="Date"
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          keyboardType="default"
        />

        {/* Save Button */}
        <Button
          title={isEditing ? 'Update Transaction' : 'Save Transaction'}
          onPress={handleSave}
          loading={isLoading}
          style={styles.saveButton}
        />

        {/* Delete Button (only when editing) */}
        {isEditing && (
          <Button
            title="Delete Transaction"
            onPress={handleDelete}
            variant="secondary"
            style={styles.deleteButton}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cancelButton: {
    fontSize: 16,
    color: '#3B82F6',
    width: 60,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  typeToggle: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  typeButtonLeft: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderRightWidth: 1,
  },
  typeButtonRight: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderLeftWidth: 1,
  },
  typeButtonActive: {
    borderColor: 'transparent',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  saveButton: {
    marginTop: 24,
  },
  deleteButton: {
    marginTop: 12,
    backgroundColor: '#FEE2E2',
  },
});
