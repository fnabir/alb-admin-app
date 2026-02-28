import { View, Text, Pressable, Button } from 'react-native';
import { Link } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <View className="flex-1 bg-background items-center justify-center p-4">
      <Text className="text-2xl font-bold mb-2 text-primary">
        Page Not Found
      </Text>
      <Text className="text-lg text-center mb-8 text-primary">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </Text>

      <Link href="/" asChild>
        <Pressable className="bg-blue-500 px-6 py-3 rounded-lg">
          <Text className="text-white text-lg font-semibold">Go Home</Text>
        </Pressable>
      </Link>
    </View>
  );
}
