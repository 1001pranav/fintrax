/**
 * Finance Navigator
 * Stack navigator for Finance section
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { FinanceScreen } from '../screens/finance/FinanceScreen';
import { AddTransactionScreen } from '../screens/finance/AddTransactionScreen';
import { TransactionListScreen } from '../screens/finance/TransactionListScreen';
import { SavingsScreen } from '../screens/finance/SavingsScreen';
import { LoansScreen } from '../screens/finance/LoansScreen';

export type FinanceStackParamList = {
  FinanceHome: undefined;
  AddTransaction: { transactionId?: string } | undefined;
  TransactionList: undefined;
  Savings: undefined;
  Loans: undefined;
};

const Stack = createStackNavigator<FinanceStackParamList>();

export const FinanceNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="FinanceHome" component={FinanceScreen} />
      <Stack.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen name="TransactionList" component={TransactionListScreen} />
      <Stack.Screen name="Savings" component={SavingsScreen} />
      <Stack.Screen name="Loans" component={LoansScreen} />
    </Stack.Navigator>
  );
};
