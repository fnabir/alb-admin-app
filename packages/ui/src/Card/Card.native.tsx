import { View } from 'react-native';
import { CardProps } from './types';

export function Card({ children, className = '' }: CardProps) {
  return (
    <View
      className={`w-full px-4 py-2 rounded-xl bg-card border border-border gap-2 ${className}`}
    >
      {children}
    </View>
  );
}
