/**
 * TransactionFilters Component
 * Filter controls for transactions (type, category, date range)
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TransactionType } from '../../constants/types';
import { ALL_CATEGORIES } from '../../constants/financeCategories';

export interface TransactionFilters {
  type: 'all' | TransactionType;
  categories: string[];
  dateRange: 'all' | 'today' | 'week' | 'month' | 'custom';
}

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFilterChange: (filters: TransactionFilters) => void;
  onReset: () => void;
}

export const TransactionFiltersComponent: React.FC<TransactionFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const handleTypeChange = (type: 'all' | TransactionType) => {
    onFilterChange({ ...filters, type });
  };

  const handleDateRangeChange = (dateRange: 'all' | 'today' | 'week' | 'month' | 'custom') => {
    onFilterChange({ ...filters, dateRange });
  };

  const handleCategoryToggle = (categoryId: string) => {
    const categories = filters.categories.includes(categoryId)
      ? filters.categories.filter((c) => c !== categoryId)
      : [...filters.categories, categoryId];
    onFilterChange({ ...filters, categories });
  };

  const hasActiveFilters =
    filters.type !== 'all' || filters.categories.length > 0 || filters.dateRange !== 'all';

  return (
    <View style={styles.container}>
      {/* Type Filter */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Type</Text>
        <View style={styles.chipRow}>
          <FilterChip
            label="All"
            isSelected={filters.type === 'all'}
            onPress={() => handleTypeChange('all')}
          />
          <FilterChip
            label="Income"
            isSelected={filters.type === TransactionType.INCOME}
            onPress={() => handleTypeChange(TransactionType.INCOME)}
            color="#10B981"
          />
          <FilterChip
            label="Expense"
            isSelected={filters.type === TransactionType.EXPENSE}
            onPress={() => handleTypeChange(TransactionType.EXPENSE)}
            color="#EF4444"
          />
        </View>
      </View>

      {/* Date Range Filter */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Date Range</Text>
        <View style={styles.chipRow}>
          <FilterChip
            label="All Time"
            isSelected={filters.dateRange === 'all'}
            onPress={() => handleDateRangeChange('all')}
          />
          <FilterChip
            label="Today"
            isSelected={filters.dateRange === 'today'}
            onPress={() => handleDateRangeChange('today')}
          />
          <FilterChip
            label="This Week"
            isSelected={filters.dateRange === 'week'}
            onPress={() => handleDateRangeChange('week')}
          />
          <FilterChip
            label="This Month"
            isSelected={filters.dateRange === 'month'}
            onPress={() => handleDateRangeChange('month')}
          />
        </View>
      </View>

      {/* Category Filter */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {ALL_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                filters.categories.includes(category.id) && {
                  backgroundColor: category.color + '20',
                  borderColor: category.color,
                },
              ]}
              onPress={() => handleCategoryToggle(category.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={category.icon as any}
                size={16}
                color={filters.categories.includes(category.id) ? category.color : '#6B7280'}
              />
              <Text
                style={[
                  styles.categoryChipText,
                  filters.categories.includes(category.id) && {
                    color: category.color,
                    fontWeight: '600',
                  },
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Reset Button */}
      {hasActiveFilters && (
        <TouchableOpacity style={styles.resetButton} onPress={onReset}>
          <Ionicons name="refresh" size={16} color="#3B82F6" />
          <Text style={styles.resetButtonText}>Reset Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  color?: string;
}

const FilterChip: React.FC<FilterChipProps> = ({
  label,
  isSelected,
  onPress,
  color = '#3B82F6',
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        isSelected && {
          backgroundColor: color + '20',
          borderColor: color,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipText, isSelected && { color, fontWeight: '600' }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 14,
    color: '#6B7280',
  },
  categoryScroll: {
    paddingVertical: 4,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 6,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 8,
  },
  resetButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
    marginLeft: 4,
  },
});
