import { NativeTabs, Label, Icon } from 'expo-router/unstable-native-tabs';

export default function TabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon src={require('../../../assets/icons/home.png')} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="projects">
        <Label>Projects</Label>
        <Icon src={require('../../../assets/icons/buildings.png')} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="company">
        <Label>Company</Label>
        <Icon src={require('../../../assets/icons/briefcase.png')} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Label>Settings</Label>
        <Icon src={require('../../../assets/icons/settings.png')} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
