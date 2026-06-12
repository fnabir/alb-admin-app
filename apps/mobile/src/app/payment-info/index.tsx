import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView } from 'react-native';
import { EmptyUI, ErrorUI, PaymentInfoRow, Select } from '@repo/ui';
import { useMemo, useState } from 'react';
import { useList } from 'react-firebase-hooks/database';
import { getDatabaseReference, paymentOptions } from '@repo/app';
import { HeaderBar } from '@/src/components/HeaderBar';
import { Loading } from '@/src/components/Loading';

export default function PaymentInfoScreen() {
  const [type, setType] = useState<string>('account');

  const [data, loading, error] = useList(getDatabaseReference('info/payment'));

  const paymentData = useMemo(() => {
    if (!data) return {};
    return Object.fromEntries(data.map((snapshot) => [snapshot.key, snapshot]));
  }, [data]);

  return (
    <SafeAreaView className="flex-1 bg-background gap-2">
      <HeaderBar title="Payment Info" />
      <Select
        value={type}
        onChange={setType}
        options={paymentOptions}
        className="mx-2"
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
        ) : !paymentData[type] || paymentData[type].length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <EmptyUI />
          </View>
        ) : (
          <View className="flex-col gap-3">
            {Object.entries(paymentData[type].val()).map(([key, value]) => (
              <PaymentInfoRow
                type={type}
                id={key}
                value={value!.toString()}
                key={key}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
