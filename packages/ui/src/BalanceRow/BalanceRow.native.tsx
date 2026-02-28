import { formatCurrency } from '@repo/app';
import { BalanceRowProps } from './types';
import { View, Text } from 'react-native';
import { Card } from '../Card';
import { Badge } from '../badge/Badge.native';

export function BalanceRow({ data, title }: BalanceRowProps) {
  const val = data.val();
  const getCardStyle = () => {
    if (val.status === 'cancel') return 'bg-red-900 text-white';
    else if (val.value < 0) return 'bg-yellow-900 text-white';
    else if (val.value === 0) return 'bg-green-900 text-white';
    else return 'bg-card text-primary';
  };

  const badge =
    val.status === 'cancel' ? 'Cancelled' : val.value < 0 ? 'Overpaid' : '';

  return (
    <View className="w-full mx-auto px-2">
      <Card
        className={`flex-row items-center justify-between !py-1 !px-3 ${getCardStyle()}`}
      >
        <View>
          <Text className="text-lg font-semibold text-primary">
            {title ?? data.key}
          </Text>
          {val.date && <Text className="text-primary">{val.date}</Text>}
        </View>
        <View className="items-end">
          <Text className="text-xl font-semibold text-primary">
            {formatCurrency(val.value)}
          </Text>
          {badge && <Badge label={badge} className="self-end" />}
        </View>
      </Card>
    </View>
  );
}
