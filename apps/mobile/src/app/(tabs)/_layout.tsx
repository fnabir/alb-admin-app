import { useTheme } from '@/src/contexts/ThemeContext';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Platform } from 'react-native';

export default function TabsLayout() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const isIOS = Platform.OS === 'ios';

  const color = {
    background: isDark ? '#18181b' : '#fafafa',
    indicator: isDark ? '#3f3f47' : '#18181b',
    icon: {
      default: isDark ? '#6b7280' : '#52525b',
      selected: isDark ? '#fafafa' : '#fafafa',
    },
    text: {
      selected: isIOS ? '#fafafa' : isDark ? '#fafafa' : '#18181b',
      default: isDark ? '#9f9fa9' : '#3f3f47',
    },
  };
  return (
    <NativeTabs
      iconColor={{
        default: color.icon.default, // inactive tab icon color
        selected: color.icon.selected, // active tab icon color
      }}
      labelStyle={{
        default: { color: color.text.default },
        selected: { color: color.text.selected },
      }}
      indicatorColor={color.indicator}
      backgroundColor={color.background}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="projects">
        <NativeTabs.Trigger.Label>Projects</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="business" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="company">
        <NativeTabs.Trigger.Label>Company</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="business_center" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="settings" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
