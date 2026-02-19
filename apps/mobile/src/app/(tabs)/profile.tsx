import { View, Text, ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '@repo/ui';
import { StatusBar } from 'expo-status-bar';

export default function ProfileScreen() {
  const { user, userData } = useAuth();

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <View className="gap-4">
        <Text className="text-2xl font-bold text-primary text-center">
          Profile
        </Text>

        <Card>
          <View className="items-center mb-4">
            <View className="flex size-16 rounded-full bg-accent items-center justify-center p-2 mb-2">
              <Text className="text-white text-5xl font-bold p-1">
                {user?.displayName?.[0].toUpperCase() ||
                  user?.email?.[0].toUpperCase()}
              </Text>
            </View>

            <Text className="text-2xl font-semibold text-primary">
              {user?.displayName || 'User'}
            </Text>
            <Text className="text-lg text-muted">{user?.email}</Text>
            <Text className="text-lg text-muted">{userData?.title}</Text>
          </View>

          {/* Info Section */}
          <View className="border-t-2 border-border pt-4 gap-1">
            {userData?.phone && (
              <View className="flex-row justify-between">
                <Text className="text-lg text-muted">Phone</Text>
                <Text className="text-lg text-primary font-medium">
                  {userData?.phone}
                </Text>
              </View>
            )}
            <View className="flex-row justify-between">
              <Text className="text-lg text-muted">Role</Text>
              <Text className="text-lg text-primary font-medium">
                {userData?.role?.toUpperCase() || 'User'}
              </Text>
            </View>
          </View>
        </Card>
      </View>
      <StatusBar style="auto" />
    </ScrollView>
  );
}
