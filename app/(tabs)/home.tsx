import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useUser } from '../../contexts/UserContext';
import { useState } from 'react';
import ExpenseFormModal from '../../components/ExpenseFormModal';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [isModalVisible, setIsModalVisible] = useState(false);

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F9F9FF]">
        <Text className="text-lg text-gray-600">Please log in to view your dashboard</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#F9F9FF]">
      {/* Header */}
      <View className="bg-primary-dark px-6 pt-12 pb-6">
        <Text className="text-2xl font-bold text-white">Welcome back,</Text>
        <Text className="text-xl text-white/80">{user.firstName}!</Text>
      </View>

      {/* Quick Actions */}
      <View className="px-6 py-6">
        <Text className="mb-4 text-lg font-semibold text-gray-800">Quick Actions</Text>
        <View className="flex-row flex-wrap gap-4">
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
            className="flex-1 min-w-[150px] rounded-xl bg-white p-4 shadow-sm">
            <View className="mb-2 h-12 w-12 items-center justify-center rounded-full bg-primary-light">
              <FontAwesome name="plus" size={20} color="#4F46E5" />
            </View>
            <Text className="font-semibold text-gray-800">Add Expense</Text>
            <Text className="text-sm text-gray-500">Record new spending</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/expenses')}
            className="flex-1 min-w-[150px] rounded-xl bg-white p-4 shadow-sm">
            <View className="mb-2 h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <FontAwesome name="list" size={20} color="#059669" />
            </View>
            <Text className="font-semibold text-gray-800">View Expenses</Text>
            <Text className="text-sm text-gray-500">See all transactions</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Financial Overview */}
      <View className="px-6 py-6">
        <Text className="mb-4 text-lg font-semibold text-gray-800">Financial Overview</Text>
        <View className="rounded-xl bg-white p-6 shadow-sm">
          <View className="mb-6">
            <Text className="text-sm text-gray-500">Total Expenses</Text>
            <Text className="text-2xl font-bold text-gray-800">$0.00</Text>
          </View>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-sm text-gray-500">This Month</Text>
              <Text className="text-lg font-semibold text-gray-800">$0.00</Text>
            </View>
            <View>
              <Text className="text-sm text-gray-500">Last Month</Text>
              <Text className="text-lg font-semibold text-gray-800">$0.00</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Recent Activity */}
      <View className="px-6 py-6">
        <Text className="mb-4 text-lg font-semibold text-gray-800">Recent Activity</Text>
        <View className="rounded-xl bg-white p-6 shadow-sm">
          <View className="items-center justify-center py-8">
            <FontAwesome name="history" size={48} color="#9CA3AF" />
            <Text className="mt-4 text-center text-gray-500">No recent activity</Text>
            <Text className="mt-2 text-center text-sm text-gray-400">
              Your recent transactions will appear here
            </Text>
          </View>
        </View>
      </View>

      {/* Expense Form Modal */}
      <ExpenseFormModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={() => {
          setIsModalVisible(false);
          router.push('/expenses');
        }}
      />
    </ScrollView>
  );
}
