import { Text, View } from 'react-native';
import { ThemedIcon } from '../../../../apps/mobile/src/components/ThemedIcon';

export function ErrorUI({ error }: { error: Error }) {
  return (
    <View className="items-center">
      <ThemedIcon name="information-circle-outline" size={64} />
      <Text className="text-2xl text-primary font-semibold">
        {error.message}
      </Text>
    </View>
  );
}
