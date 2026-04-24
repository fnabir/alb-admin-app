import { ActivityIndicator, Text, View } from 'react-native';

export function LoadingUI() {
  return (
    <View className="items-center">
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text className="text-primary text-xl mt-4">Loading...</Text>
    </View>
  );
}
