import { BadgeProps } from './types';
import { Text, View } from 'react-native';

export function Badge({
  label,
  variant = 'default',
  className = '',
  textClassName = '',
}: BadgeProps) {
  const style = {
    text: {
      default: 'text-background',
      success: 'text-green-200',
      warning: 'text-yellow-200',
      error: 'text-red-200',
      light: 'text-black',
    },
    background: {
      default: 'bg-primary',
      success: 'bg-green-800',
      warning: 'bg-yellow-800',
      error: 'bg-red-800',
      light: 'bg-white',
    },
  };

  return (
    <View
      className={`self-start px-2 py-0.5 rounded-full ${style.background[variant]} ${className}`}
    >
      <Text
        className={`font-medium capitalize ${style.text[variant]} ${textClassName}`}
      >
        {label}
      </Text>
    </View>
  );
}
