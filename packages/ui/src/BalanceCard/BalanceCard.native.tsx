import { Text } from 'react-native';
import { Card } from '../Card';
import { formatCurrency } from '@repo/app';
import { BalanceCardProps } from './types';

export function BalanceCard({
  title,
  balance,
  date,
  className = '',
}: BalanceCardProps) {
  return (
    <Card className={`hover:border-accent ${className}`}>
      <Text className="text-lg text-primary pb-1 capitalize">{title}</Text>
      <Text className="text-2xl text-primary font-semibold">
        {formatCurrency(balance)}
      </Text>
      {date && <Text className="text-muted">Last updated on {date}</Text>}
    </Card>
  );
}
