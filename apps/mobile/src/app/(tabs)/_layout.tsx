import { useTheme } from '@/src/contexts/ThemeContext';
import {
  NativeTabs,
  Label,
  Icon,
  VectorIcon,
} from 'expo-router/unstable-native-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabsLayout() {
  const { colorScheme } = useTheme();
  const color = {
    background: colorScheme === 'dark' ? '#18181b' : '#fafafa',
    indicator: colorScheme === 'dark' ? '#3f3f47' : '#18181b',
    icon: {
      default: colorScheme === 'dark' ? '#6b7280' : '#52525b',
      selected: colorScheme === 'dark' ? '#fafafa' : '#fafafa',
    },
    text: {
      selected: colorScheme === 'dark' ? '#fafafa' : '#18181b',
      default: colorScheme === 'dark' ? '#9f9fa9' : '#3f3f47',
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
        <Label>Home</Label>
        <Icon src={<VectorIcon family={Ionicons} name="home" />} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="projects">
        <Label>Projects</Label>
        <Icon src={<VectorIcon family={Ionicons} name="business" />} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="company">
        <Label>Company</Label>
        <Icon src={<VectorIcon family={Ionicons} name="briefcase" />} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Label>Settings</Label>
        <Icon src={<VectorIcon family={Ionicons} name="settings" />} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
