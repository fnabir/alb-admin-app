import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderBar } from '@/src/components/HeaderBar';
import { useMemo, useState } from 'react';
import { getDatabaseReference } from '@repo/app';
import { EmptyUI, ErrorUI, InventoryCard, InventoryDialog } from '@repo/ui';
import { useObject } from 'react-firebase-hooks/database';
import { Loading } from '@/src/components/Loading';
import { ThemedIcon } from '@/src/components/ThemedIcon';

export default function InventoryScreen() {
  const [openDialog, setOpenDialog] = useState(false);

  const [data, loading, error] = useObject(
    getDatabaseReference('company/inventory'),
  );

  const inventoryList = useMemo(() => {
    if (!data) return [];

    return Object.entries((data.val() as Record<string, number>) ?? {}).map(
      ([name, count]) => ({
        name,
        count,
      }),
    );
  }, [data]);

  return (
    <>
      <SafeAreaView className="flex-1 bg-background gap-2">
        <HeaderBar
          title="Inventory"
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
          ) : !data || inventoryList.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <EmptyUI />
            </View>
          ) : (
            <View className="gap-2">
              {inventoryList.map((item) => (
                <InventoryCard
                  key={item.name}
                  item={item.name}
                  count={item.count}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      <InventoryDialog open={openDialog} onOpenChange={setOpenDialog} />
    </>
  );
}
