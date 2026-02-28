import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/src/contexts/ThemeContext';

export default function TabsLayout() {
  const { colorScheme } = useTheme();

  const tabBarColors = {
    activeTintColor: '#3B82F6',
    inactiveTintColor: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
    backgroundColor: colorScheme === 'dark' ? '#18181b' : '#ffffff',
    borderTopColor: colorScheme === 'dark' ? '#3f3f46' : '#e5e7eb',
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: tabBarColors.activeTintColor,
          tabBarInactiveTintColor: tabBarColors.inactiveTintColor,
          tabBarStyle: {
            backgroundColor: tabBarColors.backgroundColor,
            borderTopColor: tabBarColors.borderTopColor,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="projects"
          options={{
            title: 'Projects',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="business" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="company"
          options={{
            title: 'Company',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="briefcase" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
