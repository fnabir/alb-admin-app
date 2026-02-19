import { View, Text, ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { BalanceCard, LoadingLink } from '@repo/ui';
import { LogoutButton } from '../../components/LogoutButton';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { getDatabaseReference } from '@repo/app';
import { useList } from 'react-firebase-hooks/database';

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
            <LoadingLink href={card?.key ?? '#'} key={index} className="w-full">
              <BalanceCard
                title={card?.key ?? ''}
                balance={card?.val().value}
                date={card?.val().date}
              />
            </LoadingLink>
          ))}
        </View>
      </View>
      <StatusBar style="auto" />
    </ScrollView>
  );
}
