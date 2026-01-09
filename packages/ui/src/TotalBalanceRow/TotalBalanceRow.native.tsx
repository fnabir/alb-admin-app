import { Text } from 'react-native';
import { Card } from '../Card';
import { formatCurrency } from '@repo/app';
import { TotalBalanceProps } from './types';

export function TotalBalanceRow({
  title,
  date,
  value,
  error,
  showUpdate = false,
  onClick,
  className,
}: TotalBalanceProps) {
  return (
    <Card className={`hover:border-accent ${className}`}>
      <Text className="text-lg text-primary pb-1 capitalize">{title}</Text>
      <Text className="text-2xl text-primary font-semibold">
        {formatCurrency(value)}
      </Text>
      {date && <Text className="text-muted">Last updated on {date}</Text>}
    </Card>
  );
}
