import { Pressable, Text } from 'react-native';
import { ButtonProps } from './types';
import { Ionicons } from '@expo/vector-icons';

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
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      className={`flex-row items-center px-4 py-1 rounded-lg border ${style.background[variant]} ${className}`}
    >
      {icon && (
        <Ionicons
          name={icon as any}
          size={16}
          color={variant === 'outline' ? '#3b82f6' : '#fff'}
        />
      )}
      <Text
        className={`text-lg ${style.text[variant]} ${isDisabled ? 'opacity-50' : ''}`}
      >
        {loading && loadingLabel ? loadingLabel : label}
      </Text>
    </Pressable>
  );
}
