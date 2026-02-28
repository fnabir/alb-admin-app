import { View, Text, ScrollView } from 'react-native';
import {
  BalanceCard,
  BalanceRow,
  EmptyUI,
  ErrorUI,
  LoadingLink,
  SelectOption,
  toast,
  TotalBalanceRow,
} from '@repo/ui';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../contexts/ThemeContext';
import {
  getDatabaseReference,
  getTotalValue,
  updateTotalBalance,
  usePersistedState,
} from '@repo/app';
import { useList, useObject } from 'react-firebase-hooks/database';
import { useEffect, useMemo } from 'react';
import { GoBackButton } from '@/src/components/GoBackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DataSnapshot } from 'firebase/database';

const sortOptions: SelectOption[] = [
  { value: 'position', label: 'Position' },
  { value: 'balance', label: 'Balance' },
];

type StaffBalance = {
  snap: DataSnapshot;
  parsed: {
    name: string;
    position: number;
    value: number;
  };
};

export default function ConveyanceBalanceScreen() {
  const [data, dataLoading, dataError] = useList(
    getDatabaseReference('balance/conveyance'),
  );

  const total = useMemo(() => {
    return getTotalValue(data);
  }, [data]);

  const [balance, balanceLoading, balanceError] = useObject(
    getDatabaseReference('balance/total/conveyance'),
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
        await updateTotalBalance('conveyance', total);
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
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center">
        <GoBackButton />
        <Text className="text-2xl text-primary">Conveyance Balance</Text>
      </View>
      <ScrollView
        className="bg-background py-2"
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
          <View className="flex-col gap-2">
            {data
              .sort((a, b) => a.val().position - b.val().position)
              .map((item) => {
                return (
                  <LoadingLink key={item.key} href={`conveyance/${item.key}`}>
                    <BalanceRow data={item} title={item.val().name} />
                  </LoadingLink>
                );
              })}
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
