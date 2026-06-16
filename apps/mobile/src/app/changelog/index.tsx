import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderBar } from '@/src/components/HeaderBar';
import { changelog } from '@repo/app';
import { VersionCard } from '@repo/ui';
import { useAuth } from '@/src/contexts/AuthContext';

export default function ChangelogScreen() {
  const { isAdmin } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-background gap-2">
      <HeaderBar title="Changelog" />
      <ScrollView
        className="bg-background p-2"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="gap-2">
          {Object.keys(changelog).map((version, index) => {
            return (
              <VersionCard key={index} isAdmin={isAdmin} version={version} />
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
