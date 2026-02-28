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
    <Card className={`items-center gap-0 ${className}`}>
      <Text className="text-xl text-primary font-semibold capitalize mb-1">
        {title}
      </Text>
      <Text className="text-3xl text-primary font-semibold">
        {formatCurrency(balance)}
      </Text>
      {date && <Text className="text-muted">Last updated on {date}</Text>}
    </Card>
  );
}
