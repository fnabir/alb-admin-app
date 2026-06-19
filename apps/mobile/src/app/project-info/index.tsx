import { SafeAreaView } from 'react-native-safe-area-context';
import { Linking, View, ScrollView, Text } from 'react-native';
import { Button, Card, EmptyUI, ErrorUI, ProjectInfoCard } from '@repo/ui';
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
              return (
                <ProjectInfoCard
                  key={item.key}
                  id={item.key}
                  val={item.val()}
                />
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
