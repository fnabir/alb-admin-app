import { View } from 'react-native';
import { CardProps } from './types';

export function Card({ children, className = '' }: CardProps) {
  return (
    <View
      className={`w-full p-4 rounded-xl bg-card border border-border ${className}`}
    >
      {children}
    </View>
  );
}
