import { View, ActivityIndicator, Text } from 'react-native';
import { useLoading } from '../contexts/LoadingContext';

export function LoadingOverlay() {
  const { isLoading, isFullScreen } = useLoading();

  // Full screen loading overlay
  if (isFullScreen && isLoading) {
    return (
      <View className="absolute inset-0 z-50 flex items-center justify-center bg-white dark:bg-zinc-950">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600 dark:text-gray-400 text-lg">
          Loading...
        </Text>
      </View>
    );
  }

  // Regular loading indicator (top bar)
  if (!isLoading) return null;

  return (
    <View className="absolute top-0 left-0 right-0 z-50 h-1 bg-blue-600" />
  );
}
