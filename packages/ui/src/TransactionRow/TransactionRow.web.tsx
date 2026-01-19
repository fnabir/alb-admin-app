'use client';

import { formatCurrency } from '@repo/app';
import { TransactionRowProps } from './types';

export function TransactionRow({ data, children }: TransactionRowProps) {
  const val = data?.val();
  const amount = val?.amount ?? 0;

  const styles: string =
    amount <= 0
      ? 'bg-green-800 hover:bg-green-900'
      : 'bg-red-800 hover:bg-red-900';

  return (
    <div
      className={`group flex space-x-2 items-center px-1.5 md:px-2 lg:px-3 py-0.5 lg:py-1 rounded-lg text-white transition-colours duration-200 ${styles}`}
    >
      <div className="w-full flex items-center text-sm md:text-base space-x-2 lg:space-x-3">
        <span className="text-sm">{val.date}</span>
        <div className="flex-grow space-x-1">
          <span className="font-semibold">{val.title}</span>
          {val.details && <span>- {val.details}</span>}
        </div>
        <span className="text-lg font-semibold">{formatCurrency(amount)}</span>
      </div>
      <div className="pl-2 flex space-x-2">{children}</div>
    </div>
  );
}
