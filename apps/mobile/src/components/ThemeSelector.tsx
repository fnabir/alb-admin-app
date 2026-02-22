import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

type ThemeOption = 'system' | 'light' | 'dark';

const themeOptions: { value: ThemeOption; label: string; icon: any }[] = [
  { value: 'system', label: 'System', icon: 'phone-portrait-outline' },
  { value: 'light', label: 'Light', icon: 'sunny-outline' },
  { value: 'dark', label: 'Dark', icon: 'moon-outline' },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <View>
      {themeOptions.map((option, index) => (
        <View key={option.value}>
          <Pressable
            className="flex-row items-center justify-between py-2"
            onPress={() => setTheme(option.value)}
          >
            <View className="flex-row items-center gap-3">
              <Ionicons name={option.icon} size={18} color="#6B7280" />
              <Text className="text-primary">{option.label}</Text>
            </View>
            {theme === option.value && (
              <Ionicons name="checkmark" size={18} color="#0284c7" />
            )}
          </Pressable>
          {index < themeOptions.length - 1 && (
            <View className="border-t border-border" />
          )}
        </View>
      ))}
    </View>
  );
}
