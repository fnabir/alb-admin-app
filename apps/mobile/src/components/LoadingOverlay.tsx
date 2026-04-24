import { View, ActivityIndicator, Text } from 'react-native';
import { useLoading } from '../contexts/LoadingContext';

export function LoadingOverlay() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <View className="absolute inset-0 z-50 flex items-center justify-center bg-background">
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text className="mt-4 text-primary text-lg">Loading...</Text>
    </View>
  );
}
