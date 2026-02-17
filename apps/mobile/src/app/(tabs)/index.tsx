import { View, Text, ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '@repo/ui';
import { LogoutButton } from '../../components/LogoutButton';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  const { user, userData, isAdmin } = useAuth();

  return (
    <ScrollView className="flex-1 bg-black dark:bg-zinc-950">
      <View className="p-4 gap-4">
        {/* Header */}
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome Back!
            </Text>
            <Text className="text-gray-600 dark:text-gray-400">
              {user?.email}
            </Text>
          </View>
          <LogoutButton />
        </View>

        {/* User Info Card */}
        <Card className="p-6">
          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Your Profile
          </Text>

          <View className="gap-2">
            <View className="flex-row">
              <Text className="text-gray-600 dark:text-gray-400 w-24">
                Email:
              </Text>
              <Text className="text-gray-900 dark:text-white flex-1">
                {user?.email}
              </Text>
            </View>

            <View className="flex-row">
              <Text className="text-gray-600 dark:text-gray-400 w-24">
                Role:
              </Text>
              <Text className="text-gray-900 dark:text-white flex-1">
                {userData?.role || 'user'}
              </Text>
            </View>

            <View className="flex-row">
              <Text className="text-gray-600 dark:text-gray-400 w-24">
                Admin:
              </Text>
              <Text className="text-gray-900 dark:text-white flex-1">
                {isAdmin ? 'Yes ✅' : 'No'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Admin Panel */}
        {isAdmin && (
          <Card className="p-6 bg-yellow-50 dark:bg-yellow-900/20">
            <Text className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Admin Panel
            </Text>
            <Text className="text-gray-600 dark:text-gray-400">
              You have admin access to this application.
            </Text>
          </Card>
        )}

        {/* Stats Cards */}
        <View className="flex-row gap-4">
          <Card className="flex-1 p-4">
            <Text className="text-3xl font-bold text-blue-600">24</Text>
            <Text className="text-gray-600 dark:text-gray-400 text-sm">
              Tasks
            </Text>
          </Card>

          <Card className="flex-1 p-4">
            <Text className="text-3xl font-bold text-green-600">12</Text>
            <Text className="text-gray-600 dark:text-gray-400 text-sm">
              Completed
            </Text>
          </Card>
        </View>
      </View>
      <StatusBar style="auto" />
    </ScrollView>
  );
}
