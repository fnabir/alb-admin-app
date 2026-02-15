import { Card } from '../Card';
import { CallabckCardProps } from './types';
import { View, Text } from 'react-native';

export function CallbackCard({ data, children }: CallabckCardProps) {
  const val = data?.val();
  return (
    <Card className={`flex space-x-2 hover:border-accent text-primary`}>
      <View className="flex-1">
        <Text>{val.date}</Text>
        <Text className="flex-1 font-semibold pt-1">{val.details}</Text>
        <Text className="text-sm opacity-80">{val.name}</Text>
      </View>

      {(val.status || children) && (
        <View className="space-y-2">
          <Text className="text-sm text-background bg-primary rounded-lg px-2 py-0.5 text-center">
            {val.status}
          </Text>
        </View>
      )}
    </Card>
  );
}
