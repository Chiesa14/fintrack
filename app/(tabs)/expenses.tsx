import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { expenseService } from '../../services/expenseService';
import { Expense } from '../../types/expense';
import { useUser } from '../../contexts/UserContext';
import ExpenseFormModal from '../../components/ExpenseFormModal';

export default function ExpensesScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchExpenses = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const data = await expenseService.getAllExpenses(user.id);
      setExpenses(data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch expenses',
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchExpenses();
    setRefreshing(false);
  }, [fetchExpenses]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAddExpense = () => {
    setIsModalVisible(true);
  };

  const handleExpensePress = (expenseId: string) => {
    router.push(`/expense/${expenseId}`);
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F9F9FF]">
        <Text className="text-lg text-gray-600">Please log in to view your expenses</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F9F9FF]">
      {/* Header */}

      <View className="flex flex-row items-center justify-between bg-primary-dark px-6 pb-6 pt-12">
        <View>
          <Text className="text-2xl font-bold text-white">My Expenses</Text>
          <Text className="text-white/80">Track your daily expenses</Text>
        </View>
        {/* Add Expense Button */}
        <TouchableOpacity
          onPress={handleAddExpense}
          className="  h-10 w-10 rounded-full bg-white p-4 shadow-lg">
          <FontAwesome name="plus" size={8} color="#4F46E5" className="m-auto" />
        </TouchableOpacity>
      </View>

      {/* Expenses List */}
      <ScrollView
        className="flex-1 px-6 pt-2"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {loading ? (
          <Text className="mt-4 text-center text-gray-500">Loading expenses...</Text>
        ) : expenses.length === 0 ? (
          <View className="mt-8 items-center">
            <FontAwesome name="file-text-o" size={48} color="#9CA3AF" />
            <Text className="mt-4 text-center text-gray-500">No expenses yet</Text>
            <Text className="mt-2 text-center text-gray-400">
              Tap the + button to add your first expense
            </Text>
          </View>
        ) : (
          expenses.map((expense) => (
            <TouchableOpacity
              key={expense.id}
              onPress={() => handleExpensePress(expense.id)}
              className="mb-4 rounded-lg bg-white p-4 shadow-sm">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-lg font-semibold text-gray-800">{expense.name}</Text>
                  <Text className="text-sm text-gray-500">{expense.category}</Text>
                </View>
                <Text className="text-lg font-bold text-primary-dark">
                  ${Number(expense.amount).toFixed(2)}
                </Text>
              </View>
              <Text className="mt-2 text-sm text-gray-500">
                {new Date(expense.date).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Expense Form Modal */}
      <ExpenseFormModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={fetchExpenses}
      />
    </View>
  );
}
