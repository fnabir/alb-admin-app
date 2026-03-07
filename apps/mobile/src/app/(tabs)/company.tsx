import { View, Text, ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '@repo/ui';
import { StatusBar } from 'expo-status-bar';

export default function CompanyScreen() {
  const { user, userData } = useAuth();

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <View className="gap-4">
        <Text className="text-2xl font-bold text-primary text-center">
          Company
        </Text>
      </View>
    </ScrollView>
  );
}
