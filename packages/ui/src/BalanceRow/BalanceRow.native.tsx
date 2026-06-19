import { formatCurrency } from '@repo/app';
import { BalanceRowProps } from './types';
import { View, Text } from 'react-native';
import { Card } from '../Card';
import { Badge } from '../badge';

export function BalanceRow({ data, title }: BalanceRowProps) {
  const val = data.val();
  const getCardStyle = () => {
    if (val.status === 'cancel') return 'bg-red-800';
    else if (val.value < 0) return 'bg-yellow-900';
    else if (val.value === 0) return 'bg-green-900';
    else return 'bg-card';
  };

  const textColor =
    getCardStyle() === 'bg-card' ? 'text-primary' : 'text-white';

  return (
    <View className="w-full mx-auto px-2">
      <Card
        className={`flex-row items-center justify-between !py-1 !px-3 ${getCardStyle()}`}
      >
        <View>
          <Text className={`text-lg font-semibold ${textColor} capitalize`}>
            {title ?? data.key}
          </Text>
          {val.date && <Text className={textColor}>{val.date}</Text>}
        </View>
        <View className="items-end">
          <Text className={`text-xl font-semibold ${textColor}`}>
            {formatCurrency(val.value)}
          </Text>
          {val.cancelled && <Badge label="Cancelled" variant="light" />}
          {val.value < 0 && <Badge label="Overpaid" variant="light" />}
        </View>
      </Card>
    </View>
  );
}
