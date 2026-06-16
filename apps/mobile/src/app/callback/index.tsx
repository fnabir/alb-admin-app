import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import {
  CallbackDialog,
  CallbackTotalCard,
  EmptyUI,
  ErrorUI,
  LoadingLink,
} from '@repo/ui';
import { useList } from 'react-firebase-hooks/database';
import { getDatabaseReference } from '@repo/app';
import { HeaderBar } from '@/src/components/HeaderBar';
import { Loading } from '@/src/components/Loading';
import { ThemedIcon } from '@/src/components/ThemedIcon';
import { useState } from 'react';

export default function CallbackScreen() {
  const [openDialog, setOpenDialog] = useState(false);

  const [data, loading, error] = useList(getDatabaseReference('callback'));

  return (
    <>
      <SafeAreaView className="flex-1 bg-background gap-2">
        <HeaderBar
          title="Callback"
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
          ) : !data || data.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <EmptyUI />
            </View>
          ) : (
            <View className="flex-col gap-3">
              {data.map((snapshot) => {
                const { key, size } = snapshot;
                return (
                  <LoadingLink key={key} href={`callback/${key}`}>
                    <CallbackTotalCard key={key} project={key} count={size} />
                  </LoadingLink>
                );
              })}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      <CallbackDialog open={openDialog} onOpenChange={setOpenDialog} />
    </>
  );
}
