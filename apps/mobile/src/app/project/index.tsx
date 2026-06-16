import { View, ScrollView } from 'react-native';
import {
  BalanceRow,
  EmptyUI,
  ErrorUI,
  LoadingLink,
  toast,
  TotalBalanceRow,
} from '@repo/ui';
import {
  getDatabaseReference,
  getTotalValue,
  updateTotalBalance,
} from '@repo/app';
import { useList, useObject } from 'react-firebase-hooks/database';
import { useEffect, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderBar } from '@/src/components/HeaderBar';
import { Loading } from '@/src/components/Loading';

export default function ProjectBalanceScreen() {
  const [data, dataLoading, dataError] = useList(
    getDatabaseReference('balance/project'),
  );

  const total = useMemo(() => {
    return getTotalValue(data);
  }, [data]);

  const [balance, balanceLoading, balanceError] = useObject(
    getDatabaseReference('balance/total/project'),
  );

  const balanceVal = balance?.val();
  const totalValue = balanceVal?.value ?? 0;

  const loading = dataLoading || balanceLoading;
  const error = dataError || balanceError;

  useEffect(() => {
    if (loading) return;
    if (error) return;
    if (totalValue === total) return;

    const syncBalance = async () => {
      try {
        await updateTotalBalance('project', total);
        toast.success('Updated', 'Balance auto-synced.');
      } catch (err) {
        toast.error(
          'Failed to sync balance.',
          err instanceof Error ? err.message : 'Unknown error',
        );
      }
    };

    syncBalance();
  }, [total, totalValue, loading, error]);

  return (
    <SafeAreaView className="flex-1 bg-background gap-2">
      <HeaderBar title="Project Balance" />
      <ScrollView
        className="bg-background p-2"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <Loading />
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
          <View className="flex-col gap-2">
            {data
              .sort((a, b) => a.key!.localeCompare(b.key!))
              .map((item) => {
                return (
                  <LoadingLink key={item.key} href={`project/${item.key}`}>
                    <BalanceRow data={item} />
                  </LoadingLink>
                );
              })}
          </View>
        )}
      </ScrollView>
      {data?.length ? (
        <TotalBalanceRow
          value={total}
          date={balanceVal?.date}
          error={balanceError?.message}
        />
      ) : null}
    </SafeAreaView>
  );
}
