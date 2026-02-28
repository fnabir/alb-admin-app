import { Text, View } from 'react-native';
import { ThemedIcon } from '../../../../apps/mobile/src/components/ThemedIcon';

export function EmptyUI({ text = 'No Record Found' }: { text?: string }) {
  return (
    <View className="items-center">
      <ThemedIcon name="information-circle-outline" size={64} />
      <Text className="text-2xl text-primary font-semibold">{text}</Text>
    </View>
  );
}
