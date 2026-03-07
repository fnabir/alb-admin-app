import { View, Text, ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { BalanceCard, Card, LoadingLink } from '@repo/ui';
import { LogoutButton } from '../../components/LogoutButton';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { getDatabaseReference } from '@repo/app';
import { useList, useListKeys } from 'react-firebase-hooks/database';

const balanceOrder = ['project', 'staff', 'conveyance', 'ZZZ'] as const;

export default function HomeScreen() {
  const { user, isAdmin } = useAuth();

  const [totalBalanceData, totalBalanceLoading] = useList(
    getDatabaseReference('balance/total'),
  );

  const filteredBalanceData = useMemo(() => {
    if (totalBalanceLoading || !totalBalanceData) return [];

    if (!isAdmin) {
      return totalBalanceData.filter((item) => item.key === 'project');
    }

    return [...totalBalanceData].sort((a, b) => {
      const keyA = (a.key ?? 'ZZZ') as (typeof balanceOrder)[number] | 'ZZZ';
      const keyB = (b.key ?? 'ZZZ') as (typeof balanceOrder)[number] | 'ZZZ';
      return balanceOrder.indexOf(keyA) - balanceOrder.indexOf(keyB);
    });
  }, [totalBalanceData, totalBalanceLoading, isAdmin]);

  const [offerDataKeys, offerLoading] = useListKeys(
    getDatabaseReference('forms/offer'),
  );
  const [contactDataKeys, contactLoading] = useListKeys(
    getDatabaseReference('forms/contact'),
  );
  const [quoteDataKeys, quoteLoading] = useListKeys(
    getDatabaseReference('forms/quote'),
  );
  const formsLoading = offerLoading || contactLoading || quoteLoading;
  const totalFormCounts =
    (contactDataKeys?.length ?? 0) +
    (offerDataKeys?.length ?? 0) +
    (quoteDataKeys?.length ?? 0);

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <View className="gap-4">
        {/* Header */}
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-primary">
              Welcome Back!
            </Text>
            <Text className="text-muted">{user?.email}</Text>
          </View>
          <LogoutButton />
        </View>
        <View className="flex-col gap-2">
          {filteredBalanceData?.map((card, index) => (
            <LoadingLink href={card.key ?? '#'} key={index} className="w-full">
              <BalanceCard
                title={card?.key ?? ''}
                balance={card?.val().value}
                date={card?.val().date}
              />
            </LoadingLink>
          ))}
        </View>
        <LoadingLink href={'/forms'}>
          <Card className="gap-1.5 py-4">
            <Text className="text-primary text-2xl font-semibold text-center">
              Forms
            </Text>
            <FormCount
              index={0}
              title="Contact"
              count={contactDataKeys?.length ?? 0}
              total={totalFormCounts}
              loading={formsLoading}
            />
            <FormCount
              index={1}
              title="Quote"
              count={quoteDataKeys?.length ?? 0}
              total={totalFormCounts}
              loading={formsLoading}
            />
            <FormCount
              index={2}
              title="Offer"
              count={offerDataKeys?.length ?? 0}
              total={totalFormCounts}
              loading={formsLoading}
            />
          </Card>
        </LoadingLink>
      </View>
    </ScrollView>
  );
}

function FormCount({
  index,
  title,
  count,
  total,
  loading,
}: {
  index: number;
  title: string;
  count: number;
  total: number;
  loading: boolean;
}) {
  const getColor = () => {
    switch (index) {
      case 1:
        return 'bg-green-600';
      case 2:
        return 'bg-blue-600';
      default:
        return 'bg-cyan-600';
    }
  };

  const percentage = (count / total) * 100;

  return (
    <View>
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-primary text-lg capitalize">{title}</Text>
        <Text className="text-primary text-lg">{count}</Text>
      </View>
      <View className="h-2 bg-slate-500/50 rounded-full overflow-hidden">
        {!loading && (
          <View
            className={`h-full rounded-full ${getColor()}`}
            style={{
              width: `${percentage}%`,
            }}
          />
        )}
      </View>
    </View>
  );
}
