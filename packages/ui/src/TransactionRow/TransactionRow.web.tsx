'use client';

import { formatCurrency } from '@repo/app';
import { TransactionRowProps } from './types';

export function TransactionRow({ data }: TransactionRowProps) {
  const val = data?.val();
  return (
    <div className="w-full flex items-center py-1 lg:py-1.5 px-2 md:px-3 lg:px-4 space-x-4 bg-card rounded-lg">
      <span className="text-sm">{val.date}</span>
      <div className="flex-grow space-x-1">
        <span className="font-semibold">{val.title}</span>
        {val.details && <span>- {val.details}</span>}
      </div>
      <span className="text-lg font-semibold">
        {formatCurrency(val.amount)}
      </span>
    </div>
  );
}
