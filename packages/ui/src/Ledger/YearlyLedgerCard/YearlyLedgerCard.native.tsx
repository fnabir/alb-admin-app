import { View, Text } from 'react-native';
import { formatCurrency, YearlyLedger } from '@repo/app';
import { Card } from '../../Card';

export function YearlyLedgerCard({ data }: { data: YearlyLedger }) {
  return (
    <Card>
      <View className="flex-row gap-4">
        <Text className="text-primary font-semibold text-lg w-[120px]">
          {data.year}
        </Text>
        <Text className="flex-1 text-right text-error font-semibold text-lg">
          {formatCurrency(data.expenseTotal)}
        </Text>
        <Text className="flex-1 text-right text-success font-semibold text-lg">
          {formatCurrency(data.incomeTotal)}
        </Text>
      </View>
    </Card>
  );
}
