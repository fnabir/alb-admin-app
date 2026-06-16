import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
  formatCurrency,
  getDatabaseReference,
  getTotalValue,
  updateBalance,
} from '@repo/app';
import { useList, useObject } from 'react-firebase-hooks/database';
import {
  EmptyUI,
  ErrorUI,
  ProjectTransactionDialog,
  ProjectTransactionRow,
  SelectOption,
  toast,
  TotalBalanceRow,
} from '@repo/ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useMemo, useState } from 'react';
import { HeaderBar } from '@/src/components/HeaderBar';
import { Loading } from '@/src/components/Loading';
import { ThemedIcon } from '@/src/components/ThemedIcon';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [openDialog, setOpenDialog] = useState(false);

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

  const billData = useMemo(
    () => uniqueData.filter((item) => item.val().amount >= 0),
    [uniqueData],
  );
  const paymentData = useMemo(
    () => uniqueData.filter((item) => item.val().amount < 0),
    [uniqueData],
  );

  const totalBill = useMemo(
    () => getTotalValue(billData, 'amount'),
    [billData],
  );
  const totalPayment = useMemo(
    () => getTotalValue(paymentData, 'amount'),
    [paymentData],
  );

  const balanceVal = balance?.val();
  const total = useMemo(
    () => totalBill + totalPayment,
    [totalBill, totalPayment],
  );
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

  const paidDataOptions: SelectOption[] | undefined = useMemo(
    () =>
      uniqueData
        ?.filter((t) => t.val().amount < 0)
        .sort((a, b) => b.key!.localeCompare(a.key!))
        .map((item) => ({
          value: item.key!,
          label: `${item.val().date} ${item.val().title}: ${formatCurrency(
            Math.abs(item.val().amount),
          )}`,
        })),
    [uniqueData],
  );

  const servicingCharge = Number(
    useObject(getDatabaseReference(`info/project/${id}/servicing`))[0]?.val() ??
      0,
  );

  return (
    <>
      <SafeAreaView className="flex-1 bg-background">
        <HeaderBar
          title={id}
          right={
            <TouchableOpacity
              onPress={() => {
                setOpenDialog(true);
              }}
            >
              <ThemedIcon name="add-circle-outline" size={30} />
            </TouchableOpacity>
          }
        />
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
            <View className="gap-2 pb-4">
              {uniqueData
                .sort((a, b) => b.key!.localeCompare(a.key!))
                .map((item) => (
                  <ProjectTransactionRow
                    key={item.key}
                    id={id}
                    transactionData={item}
                    servicingCharge={servicingCharge}
                    paidArray={paidDataOptions}
                    paidDataOptions={paidDataOptions}
                    total={totalPayment}
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

      {openDialog && (
        <ProjectTransactionDialog
          id={id}
          paidDataOptions={paidDataOptions}
          servicingCharge={servicingCharge}
          open={openDialog}
          onOpenChange={setOpenDialog}
        />
      )}
    </>
  );
}
