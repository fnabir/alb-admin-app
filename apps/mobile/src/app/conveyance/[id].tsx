import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { getDatabaseReference, getTotalValue, updateBalance } from '@repo/app';
import { useList, useObject } from 'react-firebase-hooks/database';
import {
  EmptyUI,
  ErrorUI,
  toast,
  TotalBalanceRow,
  TransactionRow,
} from '@repo/ui';
import { GoBackButton } from '@/src/components/GoBackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useMemo } from 'react';

export default function ConveyanceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [data, transactionLoading, transactionError] = useList(
    getDatabaseReference(`transaction/conveyance/${id}`),
  );

  const [balance, balanceLoading, balanceError] = useObject(
    getDatabaseReference(`balance/conveyance/${id}`),
  );

  const balanceVal = balance?.val();
  const total = useMemo(() => {
    return data ? getTotalValue(data, 'amount') : 0;
  }, [data]);
  const totalValue = balanceVal?.value ?? 0;

  const loading = transactionLoading || balanceLoading;
  const error = transactionError || balanceError;

  useEffect(() => {
    if (loading) return;
    if (error) return;
    if (totalValue === total) return;

    const syncBalance = async () => {
      try {
        await updateBalance('conveyance', id, total);
        toast.success('Updated', 'Balance auto-synced.');
      } catch (err) {
        toast.error(
          'Failed to sync balance.',
          err instanceof Error ? err.message : 'Unknown error',
        );
      }
    };

    syncBalance();
  }, [total, totalValue, loading, error, id]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row gap-2 items-center">
        <GoBackButton />
        <View className="flex-1">
          <Text className="text-xl font-medium text-primary">
            {balanceVal?.name ?? 'Unknown'}
          </Text>
          <Text className="text-muted">Conveyance Balance</Text>
        </View>
      </View>
      <ScrollView
        className="bg-background p-2"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-muted">Loading...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center">
            <ErrorUI error={error} />
          </View>
        ) : !data?.length ? (
          <View className="flex-1 items-center justify-center">
            <EmptyUI />
          </View>
        ) : (
          <View className="gap-2">
            {data
              .sort((a, b) => b.key!.localeCompare(a.key!))
              .map((item) => (
                <TransactionRow key={item.key} data={item} />
              ))}
          </View>
        )}
        <StatusBar style="auto" />
      </ScrollView>
      {data && data.length > 0 && (
        <TotalBalanceRow
          value={totalValue}
          date={balanceVal?.date}
          error={balanceError?.message}
        />
      )}
    </SafeAreaView>
  );
}
