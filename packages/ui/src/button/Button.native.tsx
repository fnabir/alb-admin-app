import { Text, TouchableOpacity } from 'react-native';
import { ButtonProps } from './types';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../apps/mobile/src/contexts/ThemeContext';

const style = {
  text: {
    accent: 'text-white',
    primary: 'text-background',
    danger: 'text-white',
    secondary: 'text-white',
    outline: 'text-primary',
    transparent: 'text-primary',
  },
  background: {
    accent: 'bg-blue-600 border-transparent',
    primary: 'bg-primary border-transparent',
    danger: 'bg-red-600 border-transparent',
    secondary: 'bg-zinc-600 border-transparent',
    outline: 'bg-transparent border-border',
    transparent: 'bg-transparent border-transparent',
  },
};

export function Button({
  label,
  loadingLabel,
  icon,
  variant = 'primary',
  loading = false,
  disabled = false,
  onPress,
  className = '',
  textClassName = '',
  iconSize = 20,
}: ButtonProps & { icon?: string; iconSize?: number }) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isDisabled}
      onPress={onPress}
      className={`flex-row items-center px-4 py-1 rounded-lg border ${isDisabled ? 'bg-muted border-transparent opacity-60' : style.background[variant]} ${className}`}
    >
      {icon && (
        <Ionicons
          name={icon as any}
          size={iconSize}
          color={isDark ? '#fafafa' : '#0a0a0a'}
        />
      )}
      <Text
        className={`text-lg ${style.text[variant]} ${isDisabled ? 'opacity-50' : ''} ${textClassName}`}
      >
        {loading && loadingLabel ? loadingLabel : label}
      </Text>
    </TouchableOpacity>
  );
}
