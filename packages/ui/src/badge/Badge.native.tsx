import { BadgeProps } from './types';
import { Text, View } from 'react-native';

export function Badge({
  label,
  variant = 'default',
  className = '',
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-primary text-background',
    success: 'bg-green-200 text-green-800',
    warning: 'bg-yellow-200 text-yellow-800',
    error: 'bg-red-200 text-red-800',
  };

  return (
    <View
      className={`self-start px-2 py-0.25 rounded-full ${variantStyles[variant]} ${className}`}
    >
      <Text className="font-medium capitalize">{label}</Text>
    </View>
  );
}
