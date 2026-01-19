import { Text } from 'react-native';
import { Card } from '../Card';
import { formatCurrency } from '@repo/app';
import { TransactionRowProps } from './types';

export function ProjectTransactionRow({ data }: TransactionRowProps) {
  const val = data?.val();
  return (
    <Card className={'hover:border-accent'}>
      <Text className="text-sm">{val.date}</Text>
      <Text className="text-lg text-primary pb-1 capitalize">{val.title}</Text>
      <Text className="text-2xl text-primary font-semibold">
        {formatCurrency(val.amount)}
      </Text>
    </Card>
  );
}
