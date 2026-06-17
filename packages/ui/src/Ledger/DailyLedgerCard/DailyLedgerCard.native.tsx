import { View, Text } from 'react-native';
import { DailyLedger, formatCurrency, fromISODate, Ledger } from '@repo/app';
import { Card } from '../../Card';

function TxRow({ tx, color }: { tx: Ledger; color: 'red' | 'green' }) {
  const bgClass = color === 'red' ? 'bg-red-500/20' : 'bg-green-500/20';
  const amountClass = color === 'red' ? 'text-error' : 'text-success';

  return (
    <View className="flex-row items-center gap-2">
      <View
        className={`flex-1 flex-row justify-between rounded-lg px-2 py-1 ${bgClass}`}
      >
        <Text className="text-primary font-medium flex-1" numberOfLines={1}>
          {tx.title}
          {tx.details ? (
            <Text className="text-primary font-normal"> - {tx.details}</Text>
          ) : null}
        </Text>
        <Text className={`font-medium ${amountClass}`}>
          {formatCurrency(tx.amount)}
        </Text>
      </View>
    </View>
  );
}

export function DailyLedgerCard({ data }: { data: DailyLedger }) {
  return (
    <Card>
      {/* Header */}
      <View className="flex-row gap-4">
        <Text className="text-primary font-semibold text-lg w-[120px]">
          {fromISODate('dd MMM yyyy', data.date)}
        </Text>
        <Text className="flex-1 text-right text-error font-semibold text-lg">
          {formatCurrency(data.expenseTotal)}
        </Text>
        <Text className="flex-1 text-right text-success font-semibold text-lg">
          {formatCurrency(data.incomeTotal)}
        </Text>
      </View>

      {/* Transactions */}
      {(data.expenseTx.length > 0 || data.incomeTx.length > 0) && (
        <View className="gap-1">
          {data.expenseTx.map((tx) => (
            <TxRow key={tx.id} tx={tx} color="red" />
          ))}
          {data.incomeTx.map((tx) => (
            <TxRow key={tx.id} tx={tx} color="green" />
          ))}
        </View>
      )}
    </Card>
  );
}
