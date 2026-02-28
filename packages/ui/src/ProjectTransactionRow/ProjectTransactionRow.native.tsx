'use client';

import { formatCurrency } from '@repo/app';
import { ProjectTransactionRowProps } from './types';
import { View, Text } from 'react-native';

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
    <View
      className={`group flex space-x-2 items-center px-1.5 md:px-2 lg:px-3 py-0.5 lg:py-1 rounded-lg text-white transition-colours duration-200 ${styles}`}
    >
      <View className="flex flex-col w-full items-center">
        <View className="w-full mx-auto flex items-center justify-between text-sm md:text-base space-x-2 lg:space-x-3">
          <Text className="text-sm">{val.date}</Text>
          <View className="flex-grow space-x-1">
            <Text className="font-semibold">{val.title}</Text>
            {val.details && <Text>- {val.details}</Text>}
          </View>
          <Text className="text-lg font-semibold">
            {formatCurrency(val.amount)}
          </Text>
        </View>
        <View className="w-full bg-black/80 rounded-md">
          {paidArray &&
            paidArray
              .sort((a, b) => b.key!.localeCompare(a.key!))
              .map((item) => {
                return (
                  <View
                    className="flex space-x-2 lg:space-x-3 px-2 text-xs md:text-sm pt-1"
                    key={item.key}
                  >
                    <View>{item.details.substring(0, 8)}</View>
                    <View className="flex-1">{item.details.substring(8)}</View>
                    <View>{formatCurrency(item.amount)}</View>
                  </View>
                );
              })}
        </View>
      </View>
    </View>
  );
}
