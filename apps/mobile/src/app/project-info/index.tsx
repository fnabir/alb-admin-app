import { SafeAreaView } from 'react-native-safe-area-context';
import { Linking, View, ScrollView, Text } from 'react-native';
import { Button, Card, EmptyUI, ErrorUI } from '@repo/ui';
import { useMemo } from 'react';
import { useList } from 'react-firebase-hooks/database';
import { formatCurrency, getDatabaseReference } from '@repo/app';
import { HeaderBar } from '@/src/components/HeaderBar';
import { Loading } from '@/src/components/Loading';

export default function ProjectInfoScreen() {
  const [data, loading, error] = useList(getDatabaseReference('info/project'));

  const projects = useMemo(() => {
    if (!data) return [];
    const map = new Map<string, (typeof data)[number]>();

    for (const snap of data) {
      map.set(snap.key!, snap);
    }

    return Array.from(map.values());
  }, [data]);

  return (
    <SafeAreaView className="flex-1 bg-background gap-2">
      <HeaderBar title="Project Info" />
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
        ) : !projects || projects.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <EmptyUI />
          </View>
        ) : (
          <View className="flex-col gap-1.5">
            {projects.map((item) => {
              const val = item.val();
              return (
                <Card
                  title={val.name}
                  description={val.description}
                  key={item.key!}
                  className="!gap-0 flex-row items-center"
                >
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-primary">
                      {item.key}
                    </Text>
                    {val.phone && (
                      <Text className="text-primary">{val.phone}</Text>
                    )}
                    {val.location && (
                      <Text className="text-primary">{val.location}</Text>
                    )}
                    {val.servicing && (
                      <Text className="text-primary">
                        Servicing: {formatCurrency(val.servicing)}
                      </Text>
                    )}
                  </View>
                  {val.phone && (
                    <Button
                      icon={'call'}
                      variant="transparent"
                      iconSize={28}
                      className="!px-0"
                      onPress={() => {
                        Linking.openURL(`tel:${val.phone}`);
                      }}
                    />
                  )}
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
