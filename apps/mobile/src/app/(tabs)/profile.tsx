import { View, Text, ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '@repo/ui';
import { StatusBar } from 'expo-status-bar';

export default function ProfileScreen() {
  const { user, userData } = useAuth();

  return (
    <ScrollView className="flex-1 bg-white dark:bg-zinc-950">
      <View className="p-4 gap-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          Profile
        </Text>

        <Card className="p-6">
          <View className="items-center mb-6">
            {/* Avatar */}
            <View className="w-24 h-24 rounded-full bg-blue-500 items-center justify-center mb-4">
              <Text className="text-white text-3xl font-bold">
                {user?.email?.[0].toUpperCase()}
              </Text>
            </View>

            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              {userData?.displayName || 'User'}
            </Text>
            <Text className="text-gray-600 dark:text-gray-400">
              {user?.email}
            </Text>
          </View>

          {/* Info Section */}
          <View className="border-t border-gray-200 dark:border-gray-700 pt-4 gap-3">
            <View className="flex-row justify-between">
              <Text className="text-gray-600 dark:text-gray-400">Role</Text>
              <Text className="text-gray-900 dark:text-white font-medium">
                {userData?.role || 'User'}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-gray-600 dark:text-gray-400">
                Member Since
              </Text>
              <Text className="text-gray-900 dark:text-white font-medium">
                {new Date().toLocaleDateString()}
              </Text>
            </View>
          </View>
        </Card>
      </View>
      <StatusBar style="auto" />
    </ScrollView>
  );
}
