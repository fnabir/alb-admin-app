import { Card } from '../../Card';
import { Text, View } from 'react-native';
import { CallbackTotalCardProps } from './types';

export function CallbackTotalCard({ project, count }: CallbackTotalCardProps) {
  return (
    <Card className="flex-row items-center justify-between">
      <Text className="text-lg font-semibold text-primary">{project}</Text>
      <View className="rounded-full bg-primary size-8 items-center justify-center">
        <Text className="text-lg text-background font-bold">{count}</Text>
      </View>
    </Card>
  );
}
