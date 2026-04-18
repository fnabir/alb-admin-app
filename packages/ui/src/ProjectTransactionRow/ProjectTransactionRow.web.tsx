'use client';

import { formatCurrency } from '@repo/app';
import { ProjectTransactionRowProps } from './types';

export function ProjectTransactionRow({
  transactionData,
  children,
  paidArray,
  totalPaid = 0,
}: ProjectTransactionRowProps) {
  const val = transactionData?.val();

  const amount = Number(val.amount);
  const afterPayment = totalPaid + amount;

  const styles: string =
    amount === 0
      ? 'bg-green-800 hover:bg-green-900'
      : amount < 0
        ? afterPayment === 0
          ? 'bg-green-800 hover:bg-green-900'
          : totalPaid === 0
            ? 'bg-zinc-800 hover:bg-zinc-900'
            : totalPaid > amount
              ? 'bg-yellow-800 hover:bg-yellow-900'
              : 'bg-blue-800 hover:bg-blue-900'
        : totalPaid === 0
          ? 'bg-red-800 hover:bg-red-900'
          : amount === totalPaid
            ? 'bg-green-800 hover:bg-green-900'
            : totalPaid > amount
              ? 'bg-yellow-800 hover:bg-yellow-900'
              : 'bg-blue-800 hover:bg-blue-900';

  return (
    <div
      className={`group flex space-x-2 items-center px-1.5 md:px-2 lg:px-3 py-0.5 lg:py-1 rounded-lg text-white transition-colours duration-200 ${styles}`}
    >
      <div className="flex flex-col w-full items-center">
        <div className="w-full mx-auto flex items-center justify-between text-sm md:text-base space-x-2 lg:space-x-3">
          <span className="text-sm">{val.date}</span>
          <div className="flex-grow space-x-1">
            <span className="font-semibold">{val.title}</span>
            {val.details && <span>- {val.details}</span>}
          </div>
          <div className="lg:text-lg font-semibold">
            {formatCurrency(val.amount)}
          </div>
        </div>
        <div className="w-full bg-black/80 rounded-md">
          {paidArray &&
            paidArray
              .sort((a, b) => b.key!.localeCompare(a.key!))
              .map((item) => {
                return (
                  <div
                    className="flex space-x-2 lg:space-x-3 px-2 text-xs md:text-sm pt-1"
                    key={item.key}
                  >
                    <div>{item.details.substring(0, 8)}</div>
                    <div className="flex-1">{item.details.substring(8)}</div>
                    <div>{formatCurrency(item.amount)}</div>
                  </div>
                );
              })}
        </div>
      </div>
      <div className="pl-2 flex space-x-2">{children}</div>
    </div>
  );
}
