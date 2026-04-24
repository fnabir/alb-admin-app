import { View, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getDatabaseReference, getTotalValue, updateBalance } from '@repo/app';
import { useList, useObject } from 'react-firebase-hooks/database';
import {
  EmptyUI,
  ErrorUI,
  LoadingUI,
  ProjectTransactionRow,
  toast,
  TotalBalanceRow,
} from '@repo/ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useMemo } from 'react';
import { HeaderBar } from '@/src/components/HeaderBar';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [data, transactionLoading, transactionError] = useList(
    getDatabaseReference(`transaction/project/${id}`),
  );

  const uniqueData = useMemo(() => {
    if (!data) return [];

    const seen = new Set<string>();

    return data.filter((snap) => {
      if (!snap.key) return false;
      if (seen.has(snap.key)) return false;
      seen.add(snap.key);
      return true;
    });
  }, [data]);

  const [balance, balanceLoading, balanceError] = useObject(
    getDatabaseReference(`balance/project/${id}`),
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
        await updateBalance('project', id, total);
        toast.success('Updated', 'Balance auto-synced.');
      } catch (e) {
        toast.error(
          'Failed to sync balance.',
          e instanceof Error ? e.message : 'Unknown error',
        );
      }
    };

    syncBalance();
  }, [total, totalValue, loading, error, id]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <HeaderBar title={id} />
      <ScrollView
        className="bg-background p-2"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <LoadingUI />
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
          <View className="gap-2 pb-4">
            {uniqueData
              .sort((a, b) => b.key!.localeCompare(a.key!))
              .map((item) => (
                <ProjectTransactionRow
                  key={item.key}
                  id={id}
                  transactionData={item}
                />
              ))}
          </View>
        )}
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
