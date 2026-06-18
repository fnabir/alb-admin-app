import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import {
  EmptyUI,
  ErrorUI,
  PaymentInfoDialog,
  PaymentInfoRow,
  Select,
} from '@repo/ui';
import { useMemo, useState } from 'react';
import { useList } from 'react-firebase-hooks/database';
import { getDatabaseReference, paymentInfoOptions } from '@repo/app';
import { HeaderBar } from '@/src/components/HeaderBar';
import { Loading } from '@/src/components/Loading';
import { ThemedIcon } from '@/src/components/ThemedIcon';
import { useAuth } from '@/src/contexts/AuthContext';

export default function PaymentInfoScreen() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [type, setType] = useState<string>('account');

  const { isAdmin } = useAuth();

  const [data, loading, error] = useList(getDatabaseReference('info/payment'));

  const paymentData = useMemo(() => {
    if (!data) return {};
    return Object.fromEntries(data.map((snapshot) => [snapshot.key, snapshot]));
  }, [data]);

  return (
    <>
      <SafeAreaView className="flex-1 bg-background gap-2">
        <HeaderBar
          title="Payment Info"
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
          value={type}
          onChange={setType}
          options={paymentInfoOptions}
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
                  type
                  id={key}
                  value={value!.toString()}
                  key={key}
                  isAdmin
                />
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      <PaymentInfoDialog open={openDialog} onOpenChange={setOpenDialog} />
    </>
  );
}
