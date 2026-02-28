import { Text, View } from 'react-native';
import { Card } from '../Card';
import { formatCurrency } from '@repo/app';
import { TransactionRowProps } from './types';

export function TransactionRow({ data }: TransactionRowProps) {
  const val = data?.val();

  const bgColor: string = val.amount <= 0 ? 'bg-green-800' : 'bg-red-800';

  return (
    <Card
      className={`flex-row items-center justify-between !py-1 !px-3 ${bgColor}`}
    >
      <View>
        <Text className="text-lg text-white capitalize font-semibold">
          {val.title} {val.details && `- ${val.details}`}
        </Text>
        {val.date && <Text className="text-white">{val.date}</Text>}
      </View>
      <Text className="text-xl text-white font-semibold">
        {formatCurrency(val.amount)}
      </Text>
    </Card>
  );
}
