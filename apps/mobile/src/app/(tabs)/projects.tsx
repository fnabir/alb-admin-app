import { View, Text, ScrollView } from 'react-native';
import { Card, LoadingLink } from '@repo/ui';
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
    href: '/project-info',
    icon: 'business',
    title: 'Project Info',
    details: 'Details, Contact',
    color: '#4ade80',
  },
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
        <Text className="text-2xl font-medium text-primary text-center">
          Projects
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
  );
}
