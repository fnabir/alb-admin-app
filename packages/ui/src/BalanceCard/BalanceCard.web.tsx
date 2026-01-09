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
    <Card className={`hover:border-accent text-primary ${className}`}>
      <div className="text-lg pb-1 capitalize">{title}</div>
      <div className="text-2xl font-semibold">{formatCurrency(balance)}</div>
      {date && <div className="text-muted">Last updated on {date}</div>}
    </Card>
  );
}
