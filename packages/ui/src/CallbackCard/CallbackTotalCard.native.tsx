import { Card } from '../Card';
import { CallabckTotalCardProps } from './types';
import { Text } from 'react-native';

export function CallbackTotalCard({ project, count }: CallabckTotalCardProps) {
  return (
    <Card className="flex items-center justify-between hover:border-accent text-primary text-lg">
      <Text>{project}</Text>
      <Text className="flex items-center justify-center rounded-full bg-primary text-background size-8 font-bold">
        {count}
      </Text>
    </Card>
  );
}
