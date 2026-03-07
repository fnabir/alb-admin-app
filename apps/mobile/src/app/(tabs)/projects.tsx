import { View, Text, ScrollView, Pressable } from 'react-native';
import { Card, LoadingLink } from '@repo/ui';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ThemedIcon } from '@/src/components/ThemedIcon';

type itemProps = {
  href?: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  details?: string;
  color: string;
};

const items: itemProps[] = [
  {
    href: '/payment-info',
    icon: 'card',
    title: 'Payment Info',
    details: 'Method, Details',
    color: '#3b82f6',
  },
  {
    href: '/callback',
    icon: 'build-outline',
    title: 'Callback',
    details: 'Details, Status',
    color: '#ef4444',
  },
];

export default function ProjectsScreen() {
  return (
    <ScrollView className="flex-1 bg-background p-4">
      <View className="gap-4">
        <Text className="text-2xl font-bold text-primary text-center">
          Projects
        </Text>

        <Card className="p-4">
          <Pressable className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center gap-3">
              <Ionicons name="business" size={24} color="#4ade80" />
              <Text className="text-xl font-medium text-primary">
                Projects Info
              </Text>
            </View>
            <ThemedIcon name="chevron-forward" size={24} />
          </Pressable>
        </Card>

        {items.map((item, index) => (
          <LoadingLink href={item.href} key={index}>
            <Card className="p-4">
              <Pressable className="flex-row items-center justify-between py-3">
                <View className="flex-row items-center gap-3">
                  <Ionicons name={item.icon} size={24} color={item.color} />
                  <Text className="text-xl font-medium text-primary">
                    {item.title}
                  </Text>
                </View>
                <ThemedIcon name="chevron-forward" size={24} />
              </Pressable>
            </Card>
          </LoadingLink>
        ))}
      </View>
    </ScrollView>
  );
}
