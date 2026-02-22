import { ReactNode, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { View } from 'react-native';
import { vars } from 'nativewind';

export function ThemeWrapper({ children }: { children: ReactNode }) {
  const { colorScheme } = useTheme();

  return (
    <View className={`flex-1 ${colorScheme === 'dark' ? 'dark' : ''}`}>
      {children}
    </View>
  );
}
