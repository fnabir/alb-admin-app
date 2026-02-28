import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

type ThemedIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  lightColor?: string;
  darkColor?: string;
};

export function ThemedIcon({
  name,
  size = 24,
  lightColor = '#18181b',
  darkColor = '#fafafa',
}: ThemedIconProps) {
  const { colorScheme } = useTheme();
  const color = colorScheme === 'dark' ? darkColor : lightColor;

  return <Ionicons name={name} size={size} color={color} />;
}
