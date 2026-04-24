import { View, ScrollView } from 'react-native';
import {
  BalanceRow,
  EmptyUI,
  ErrorUI,
  LoadingLink,
  LoadingUI,
  TotalBalanceRow,
} from '@repo/ui';
import { StatusBar } from 'expo-status-bar';
import { getDatabaseReference } from '@repo/app';
import { useList, useObject } from 'react-firebase-hooks/database';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderBar } from '@/src/components/HeaderBar';

export default function StaffBalanceScreen() {
  const [data, dataLoading, dataError] = useList(
    getDatabaseReference('balance/staff'),
  );

  const [balance, balanceLoading, balanceError] = useObject(
    getDatabaseReference('balance/total/staff'),
  );

  const [conveyance] = useObject(
    getDatabaseReference('balance/total/conveyance'),
  );

  const balanceVal = balance?.val();
  const totalValue = balanceVal?.value ?? 0;

  const conveyanceVal = conveyance?.val();
  const totalConveyance = conveyanceVal?.amount ?? 0;

  const loading = dataLoading || balanceLoading;
  const error = dataError || balanceError;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <HeaderBar title="Staff Balance" />
      <ScrollView
        className="bg-background py-2"
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
          <View className="flex-col gap-2">
            {data
              .sort((a, b) => a.val().position - b.val().position)
              .map((staff, index) => {
                const val = staff.val();
                return (
                  <LoadingLink
                    href={`/staff/${staff.key}`}
                    key={staff.key ?? index}
                    className="w-full"
                  >
                    <BalanceRow data={staff} title={val.name} />
                  </LoadingLink>
                );
              })}
          </View>
        )}
        <StatusBar style="auto" />
      </ScrollView>
      {data && data.length > 0 && (
        <TotalBalanceRow
          value={totalValue + totalConveyance}
          date={balanceVal?.date}
          error={balanceError?.message}
        />
      )}
    </SafeAreaView>
  );
}
