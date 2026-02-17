import { View, Text, ScrollView, Pressable } from 'react-native';
import { Card } from '@repo/ui';
import { LogoutButton } from '../../components/LogoutButton';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function SettingsScreen() {
  return (
    <ScrollView className="flex-1 bg-white dark:bg-zinc-950">
      <View className="p-4 gap-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </Text>

        {/* Settings Options */}
        <Card className="p-4">
          <Pressable className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center gap-3">
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#6B7280"
              />
              <Text className="text-gray-900 dark:text-white">
                Notifications
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </Pressable>

          <View className="border-t border-gray-200 dark:border-gray-700" />

          <Pressable className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center gap-3">
              <Ionicons name="moon-outline" size={24} color="#6B7280" />
              <Text className="text-gray-900 dark:text-white">Dark Mode</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </Pressable>

          <View className="border-t border-gray-200 dark:border-gray-700" />

          <Pressable className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center gap-3">
              <Ionicons name="lock-closed-outline" size={24} color="#6B7280" />
              <Text className="text-gray-900 dark:text-white">Privacy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </Pressable>
        </Card>

        {/* Logout */}
        <Card className="p-4">
          <LogoutButton />
        </Card>
      </View>
      <StatusBar style="auto" />
    </ScrollView>
  );
}
