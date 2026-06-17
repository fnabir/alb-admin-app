import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderBar } from '@/src/components/HeaderBar';
import { useMemo, useState } from 'react';
import {
  DailyLedger,
  fromISODate,
  getDatabaseReference,
  Ledger,
  ledgerFilterOptions,
  MonthlyLedger,
  YearlyLedger,
} from '@repo/app';
import {
  EmptyUI,
  ErrorUI,
  DailyLedgerCard,
  MonthlyLedgerCard,
  YearlyLedgerCard,
  Select,
  Card,
} from '@repo/ui';
import { useObject } from 'react-firebase-hooks/database';
import { Loading } from '@/src/components/Loading';
import { ThemedIcon } from '@/src/components/ThemedIcon';

export default function LedgerScreen() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('');

  const [data, loading, error] = useObject(
    getDatabaseReference('ledger/transaction'),
  );

  const transactions = useMemo<Ledger[]>(() => {
    const root = data?.val();
    if (!root) return [];

    const result: Ledger[] = [];

    Object.entries(root).forEach(([_year, months]: any) => {
      Object.entries(months).forEach(([_month, days]: any) => {
        Object.entries(days).forEach(([_day, transactions]: any) => {
          Object.entries(transactions).forEach(([id, tx]: any) => {
            result.push({ id, ...tx });
          });
        });
      });
    });

    return result;
  }, [data]);

  const dailyCards = useMemo<DailyLedger[]>(() => {
    if (filter !== '') return [];

    const root = data?.val();
    if (!root) return [];

    const cards: DailyLedger[] = [];

    Object.entries(root).forEach(([year, months]: any) => {
      Object.entries(months).forEach(([month, days]: any) => {
        Object.entries(days).forEach(([day, txs]: any) => {
          const date = `${year}-${month}-${day}`;

          const txArray: Ledger[] = Object.entries(txs).map(
            ([id, tx]: any) => ({
              id,
              ...tx,
            }),
          );

          let income = 0;
          let expense = 0;
          const incomeTx: Ledger[] = [];
          const expenseTx: Ledger[] = [];

          txArray.forEach((tx) => {
            if (tx.amount > 0) {
              income += tx.amount;
              incomeTx.push(tx);
            } else {
              expense += tx.amount;
              expenseTx.push(tx);
            }
          });

          cards.push({
            date,
            incomeTotal: income,
            expenseTotal: expense,
            incomeTx,
            expenseTx,
          });
        });
      });
    });

    return cards.sort((a, b) => b.date.localeCompare(a.date));
  }, [data, filter]);

  const monthlyCards = useMemo<MonthlyLedger[]>(() => {
    if (filter !== 'monthly' || !transactions.length) return [];

    const map = new Map<string, MonthlyLedger>();

    transactions.forEach((tx) => {
      const month = fromISODate('yyyy-MM', tx.date);
      const day = tx.date.slice(0, 10);

      if (!map.has(month)) {
        map.set(month, {
          month,
          label: fromISODate('MMMM yyyy', month + '-01'),
          incomeTotal: 0,
          expenseTotal: 0,
          days: [],
        });
      }

      const card = map.get(month)!;

      let dayRow = card.days.find((d) => d.date === day);
      if (!dayRow) {
        dayRow = { date: day, income: 0, expense: 0 };
        card.days.push(dayRow);
      }

      if (tx.amount > 0) {
        card.incomeTotal += tx.amount;
        dayRow.income += tx.amount;
      } else {
        card.expenseTotal += tx.amount;
        dayRow.expense += tx.amount;
      }
    });

    return Array.from(map.values()).sort((a, b) =>
      b.month.localeCompare(a.month),
    );
  }, [transactions, filter]);

  const yearlyCards = useMemo(() => {
    if (filter !== 'yearly' || !transactions.length) return [];

    const map = new Map<
      string,
      { year: string; incomeTotal: number; expenseTotal: number }
    >();

    transactions.forEach((tx) => {
      const year = tx.date.slice(0, 4);

      if (!map.has(year)) {
        map.set(year, { year, incomeTotal: 0, expenseTotal: 0 });
      }

      const card = map.get(year)!;
      if (tx.amount > 0) card.incomeTotal += tx.amount;
      else card.expenseTotal += tx.amount;
    });

    return Array.from(map.values()).sort((a, b) =>
      b.year.localeCompare(a.year),
    );
  }, [transactions, filter]);

  const cards = useMemo(() => {
    switch (filter) {
      case 'yearly':
        return yearlyCards;
      case 'monthly':
        return monthlyCards;
      default:
        return dailyCards;
    }
  }, [filter, yearlyCards, monthlyCards, dailyCards]);

  return (
    <>
      <SafeAreaView className="flex-1 bg-background gap-2">
        <HeaderBar
          title="Financial Ledger"
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
        <Select
          value={filter}
          onChange={setFilter}
          options={ledgerFilterOptions}
          placeholder="Daily"
          className="mx-2"
        />
        <View className="flex-1 bg-background">
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <Loading />
            </View>
          ) : error ? (
            <View className="flex-1 items-center justify-center">
              <ErrorUI error={error} />
            </View>
          ) : (
            <View className="flex-1 gap-2 px-2">
              {cards.length > 0 && (
                <Card className="flex-row">
                  <Text className="text-primary font-semibold text-lg w-[120px] text-center">
                    {filter === 'monthly' ? 'Month' : 'Date'}
                  </Text>
                  <Text className="flex-1 text-center text-error font-semibold text-lg">
                    Out
                  </Text>
                  <Text className="flex-1 text-center text-success font-semibold text-lg">
                    In
                  </Text>
                </Card>
              )}
              <ScrollView
                className="bg-background"
                contentContainerStyle={{ flexGrow: 1 }}
              >
                {cards.length ? (
                  cards.map((card) => {
                    if (filter === 'yearly')
                      return (
                        <YearlyLedgerCard
                          key={(card as YearlyLedger).year}
                          data={card as YearlyLedger}
                        />
                      );
                    if (filter === 'monthly')
                      return (
                        <MonthlyLedgerCard
                          key={(card as MonthlyLedger).month}
                          data={card as MonthlyLedger}
                        />
                      );
                    return (
                      <DailyLedgerCard
                        key={(card as DailyLedger).date}
                        data={card as DailyLedger}
                      />
                    );
                  })
                ) : (
                  <View className="flex-1 items-center justify-center">
                    <EmptyUI />
                  </View>
                )}
              </ScrollView>
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}
