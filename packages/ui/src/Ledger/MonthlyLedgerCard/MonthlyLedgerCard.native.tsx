import { View, Text } from 'react-native';
import { formatCurrency, fromISODate, MonthlyLedger } from '@repo/app';
import { Card } from '../../Card';

export function MonthlyLedgerCard({ data }: { data: MonthlyLedger }) {
  return (
    <Card>
      {/* Header */}
      <View className="flex-row gap-4">
        <Text className="text-primary font-semibold text-lg w-[120px]">
          {data.label}
        </Text>
        <Text className="flex-1 text-right text-error font-semibold text-lg">
          {formatCurrency(data.expenseTotal)}
        </Text>
        <Text className="flex-1 text-right text-success font-semibold text-lg">
          {formatCurrency(data.incomeTotal)}
        </Text>
      </View>

      <View className="h-px bg-zinc-500" />

      {/* Daily Rows */}
      <View className="gap-1">
        {data.days.map((day) => (
          <View key={day.date} className="flex-row gap-4">
            <View className="w-[120px] bg-sky-500/20 rounded-lg px-2 py-1">
              <Text className="text-primary font-medium">
                {fromISODate('dd MMM', day.date)}
              </Text>
            </View>
            <View className="flex-1 bg-red-500/20 rounded-lg px-2 py-1">
              <Text className="text-error font-medium text-right">
                {formatCurrency(day.expense)}
              </Text>
            </View>
            <View className="flex-1 bg-green-500/20 rounded-lg px-2 py-1">
              <Text className="text-success font-medium text-right">
                {formatCurrency(day.income)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}
