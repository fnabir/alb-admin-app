import { View, Text, ScrollView } from 'react-native';
import { Card, LoadingLink } from '@repo/ui';
import { Ionicons } from '@expo/vector-icons';
import { ThemedIcon } from '@/src/components/ThemedIcon';
import { SafeAreaView } from 'react-native-safe-area-context';

type itemProps = {
  href?: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  details?: string;
  color: string;
};

const items: itemProps[] = [
  {
    href: '/project-info',
    icon: 'file-tray-full',
    title: 'Financial Ledger',
    details: 'Daily Cash Flow',
    color: '#4ade80',
  },
  {
    href: '/inventory',
    icon: 'cube',
    title: 'Inventory',
    details: 'Item Name, Count',
    color: '#3b82f6',
  },
  {
    href: '/error',
    icon: 'book',
    title: 'Error Code',
    details: 'NICE 3000',
    color: '#ef4444',
  },
];

export default function CompanyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 p-4">
        <View className="gap-4">
          <Text className="text-2xl font-bold text-primary text-center">
            Company
          </Text>

          {items.map((item, index) => (
            <LoadingLink href={item.href} key={index}>
              <Card className="flex-row items-center justify-between py-3">
                <View className="flex-row items-center gap-3">
                  <Ionicons name={item.icon} size={24} color={item.color} />
                  <View>
                    <Text className="text-xl font-medium text-primary">
                      {item.title}
                    </Text>
                    {item.details && (
                      <Text className="text-muted">{item.details}</Text>
                    )}
                  </View>
                </View>
                <ThemedIcon name="chevron-forward" size={24} />
              </Card>
            </LoadingLink>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
