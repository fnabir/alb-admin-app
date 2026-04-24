import { Text, View } from 'react-native';
import { Card } from '../Card';
import { formatCurrency } from '@repo/app';
import { TotalBalanceProps } from './types';

export function TotalBalanceRow({
  title = 'Total Balance',
  value = 0,
  date,
  error,
  className = '',
}: TotalBalanceProps) {
  return (
    <View>
      {error ? (
        <Card className={`!bg-blue-700 ${className}`}>
          <Text className="text-2xl text-white">{error}</Text>
        </Card>
      ) : (
        <Card
          className={`flex-row items-center !bg-blue-700 !rounded-none ${className}`}
        >
          <View className="flex-1">
            <Text className="text-xl text-white font-semibold pb-1 capitalize">
              {title}
            </Text>
            {date && (
              <Text className="text-[15px] text-white/90">
                Last updated on {date}
              </Text>
            )}
          </View>
          <Text className="text-2xl text-white font-semibold">
            {formatCurrency(value)}
          </Text>
        </Card>
      )}
    </View>
  );
}
