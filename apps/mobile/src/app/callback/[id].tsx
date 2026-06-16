import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import {
  CallbackDialog,
  CallbackProjectCard,
  CallbackValType,
  EmptyUI,
  ErrorUI,
} from '@repo/ui';
import { useList } from 'react-firebase-hooks/database';
import { getDatabaseReference } from '@repo/app';
import { HeaderBar } from '@/src/components/HeaderBar';
import { Loading } from '@/src/components/Loading';
import { useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ThemedIcon } from '@/src/components/ThemedIcon';

export default function CallbackProjectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [openDialog, setOpenDialog] = useState(false);
  const [data, loading, error] = useList(
    getDatabaseReference(`callback/${id}`),
  );

  const callbacks = useMemo(() => {
    if (!data) return [];
    const map = new Map<string, CallbackValType>();

    for (const snap of data) {
      map.set(snap.key!, snap.val());
    }

    return Array.from(map.entries());
  }, [data]);

  return (
    <>
      <SafeAreaView className="flex-1 bg-background gap-2">
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
          ) : !callbacks || callbacks.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <EmptyUI />
            </View>
          ) : (
            <View className="flex-col gap-3">
              {callbacks
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([key, val]) => (
                  <CallbackProjectCard
                    key={key}
                    project={id}
                    val={val}
                    id={key}
                  />
                ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      <CallbackDialog
        project={id}
        open={openDialog}
        onOpenChange={setOpenDialog}
      />
    </>
  );
}
