import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView } from 'react-native';
import { GoBackButton } from '@/src/components/GoBackButton';

export default function FormsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background gap-2">
      <View className="flex-row gap-4 items-center">
        <GoBackButton />
        <Text className="text-2xl text-primary">Forms</Text>
      </View>
      <ScrollView
        className="bg-background py-2"
        contentContainerStyle={{ flexGrow: 1 }}
      ></ScrollView>
    </SafeAreaView>
  );
}
