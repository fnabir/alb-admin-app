import { View, Text, ScrollView } from 'react-native';
import { Card, LoadingLink } from '@repo/ui';
import { LogoutButton } from '../../components/LogoutButton';
import { Ionicons } from '@expo/vector-icons';
import { ThemeSelector } from '@/src/components/ThemeSelector';
import { useAuth } from '@/src/contexts/AuthContext';
import packageJson from '@/package.json';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { user, userData } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 p-4">
        <View className="gap-4">
          <Text className="text-2xl font-bold text-center text-primary">
            Settings
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
            <View className="border-t-2 border-border py-2 gap-1">
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
                <Text className="text-lg text-primary font-medium capitalize">
                  {userData?.role || 'User'}
                </Text>
              </View>
            </View>
            <View className="border-t-2 border-border py-2 gap-1">
              <View className="flex-row justify-between">
                <Text className="text-lg text-muted">App Version</Text>
                <Text className="text-lg text-primary font-medium capitalize">
                  {packageJson.version}
                </Text>
              </View>
            </View>
          </Card>

          <LoadingLink href="/changelog">
            <Card className="flex-row items-center gap-3 py-3">
              <Ionicons name="calendar-outline" size={18} color="#6B7280" />
              <Text className="flex-grow text-primary">Changelog</Text>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </Card>
          </LoadingLink>

          <Card className="p-4">
            <Text className="text-lg font-semibold text-center text-primary mb-2">
              Theme
            </Text>
            <ThemeSelector />
          </Card>

          <LogoutButton />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
