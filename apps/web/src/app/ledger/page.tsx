'use client';

import { useBreadcrumbs } from '@/components/BreadcrumbContext';
import { Loading } from '@/components/Loading';
import {
  formatCurrency,
  fromISODate,
  getDatabaseReference,
  usePersistedState,
} from '@repo/app';
import { Button, EmptyUI, ErrorUI, Select } from '@repo/ui';
import { SelectOption } from '@repo/ui/src/select/types';
import { useEffect, useMemo } from 'react';
import { useObject } from 'react-firebase-hooks/database';
import { MdAdd, MdEdit } from 'react-icons/md';
import UpdateLedgerTransactionDialog from './updateTransactionDialog';
import DeleteLedgerTransactionDialog from './deleteTransactionDialog';

type Transaction = {
  id: string;
  amount: number;
  title: string;
  details?: string;
  date: string;
};

type DailyCard = {
  date: string;
  incomeTotal: number;
  expenseTotal: number;
  incomeTx: Transaction[];
  expenseTx: Transaction[];
};

type MonthlyCard = {
  month: string;
  label: string;
  incomeTotal: number;
  expenseTotal: number;
  days: {
    date: string;
    income: number;
    expense: number;
  }[];
};

const filterOptions: SelectOption[] = [{ value: 'monthly', label: 'Monthly' }];

export default function Ledger() {
  const { setItems } = useBreadcrumbs();

  useEffect(() => {
    setItems([{ label: 'Home', href: '/' }, { label: 'Financial Ledger' }]);
  }, [setItems]);

  const [filter, setFilter] = usePersistedState<string>('ledger-filter', '');

  const [data, loading, error] = useObject(
    getDatabaseReference('ledger/transaction'),
  );

  const transactions = useMemo<Transaction[]>(() => {
    const root = data?.val();
    if (!root) return [];

    const result: Transaction[] = [];

    Object.entries(root).forEach(([year, months]: any) => {
      Object.entries(months).forEach(([month, days]: any) => {
        Object.entries(days).forEach(([day, transactions]: any) => {
          Object.entries(transactions).forEach(([id, tx]: any) => {
            result.push({ id, ...tx });
          });
        });
      });
    });

    return result;
  }, [data]);

  const dailyCards = useMemo<DailyCard[]>(() => {
    if (filter !== '') return [];

    const root = data?.val();
    if (!root) return [];

    const cards: DailyCard[] = [];

    Object.entries(root).forEach(([year, months]: any) => {
      Object.entries(months).forEach(([month, days]: any) => {
        Object.entries(days).forEach(([day, txs]: any) => {
          const date = `${year}-${month}-${day}`;

          const txArray: Transaction[] = Object.entries(txs).map(
            ([id, tx]: any) => ({
              id,
              ...tx,
            }),
          );

          let income = 0;
          let expense = 0;
          const incomeTx: Transaction[] = [];
          const expenseTx: Transaction[] = [];

          txArray.forEach((tx) => {
            if (tx.amount > 0) {
              income += tx.amount;
              incomeTx.push(tx);
            } else {
              expense += tx.amount;
              expenseTx.push(tx);
            }
          });

          cards.push({
            date,
            incomeTotal: income,
            expenseTotal: expense,
            incomeTx,
            expenseTx,
          });
        });
      });
    });

    return cards.sort((a, b) => b.date.localeCompare(a.date));
  }, [data, filter]);

  const monthlyCards = useMemo<MonthlyCard[]>(() => {
    if (filter !== 'monthly' || !transactions.length) return [];

    const map = new Map<string, MonthlyCard>();

    transactions.forEach((tx) => {
      const month = fromISODate('yyyy-MM', tx.date);
      const day = tx.date.slice(0, 10);

      if (!map.has(month)) {
        map.set(month, {
          month,
          label: fromISODate('MMMM yyyy', month + '-01'),
          incomeTotal: 0,
          expenseTotal: 0,
          days: [],
        });
      }

      const card = map.get(month)!;

      let dayRow = card.days.find((d) => d.date === day);
      if (!dayRow) {
        dayRow = { date: day, income: 0, expense: 0 };
        card.days.push(dayRow);
      }

      if (tx.amount > 0) {
        card.incomeTotal += tx.amount;
        dayRow.income += tx.amount;
      } else {
        card.expenseTotal += tx.amount;
        dayRow.expense += tx.amount;
      }
    });

    return Array.from(map.values()).sort((a, b) =>
      b.month.localeCompare(a.month),
    );
  }, [transactions, filter]);

  return (
    <div className="size-full flex flex-col space-y-2">
      <div className="flex items-center space-x-2 px-2 md:px-3 lg:px-4">
        <span>Show</span>
        <Select
          value={filter}
          options={filterOptions}
          onChange={setFilter}
          placeholder="Daily"
          className="max-w-36"
        />
        <UpdateLedgerTransactionDialog>
          <Button icon={MdAdd} label="Add Transaction" />
        </UpdateLedgerTransactionDialog>
      </div>
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loading isFullScreen={false} />
        </div>
      ) : error ? (
        <ErrorUI error={error} />
      ) : (
        <div className="flex-1 space-y-2">
          {dailyCards.length > 0 && (
            <div className="grid grid-cols-[200px_1fr_1fr] gap-4 px-4 pb-1 text-center mx-4">
              <span className="text-left">
                {filter == 'monthly' ? 'Month' : 'Date'}
              </span>
              <span>Money Out</span>
              <span>Money In</span>
            </div>
          )}

          {filter === 'monthly' ? (
            monthlyCards.length ? (
              monthlyCards.map((card) => (
                <MonthlyLedgerCard key={card.month} data={card} />
              ))
            ) : (
              <div className="flex h-full">
                <EmptyUI />
              </div>
            )
          ) : dailyCards.length ? (
            dailyCards.map((card) => (
              <DailyLedgerCard key={card.date} data={card} />
            ))
          ) : (
            <div className="flex h-full">
              <EmptyUI />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function DailyLedgerCard({ data }: { data: DailyCard }) {
  const formattedDate = fromISODate('dd MMM yyyy', data.date);

  return (
    <div className="border border-border rounded-xl mx-4 px-4 py-2 shadow-sm space-y-3 bg-card">
      {/* Header */}
      <div className="grid grid-cols-[200px_1fr_1fr] gap-4 font-semibold text-lg">
        <h3 className="font-semibold">{formattedDate}</h3>
        <div className="text-right text-error">
          {formatCurrency(data.expenseTotal)}
        </div>
        <div className="text-right text-success">
          {formatCurrency(data.incomeTotal)}
        </div>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-[200px_1fr_1fr] gap-4 text-sm">
        {/* Date column spacer */}
        <div />

        {/* Expense Column */}
        <div className="space-y-1 text-base">
          {data.expenseTx.map((tx) => {
            const transaction = (
              <div className="flex-1 flex justify-between font-medium bg-red-500/20 rounded-lg px-2 py-1">
                <div className="space-x-1">
                  <span className="truncate">{tx.title}</span>
                  <span className="truncate font-normal">
                    {tx.details ? `- ${tx.details}` : ''}
                  </span>
                </div>
                <span>{formatCurrency(tx.amount)}</span>
              </div>
            );

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between space-x-2"
              >
                {transaction}
                <div className="flex space-x-1">
                  <UpdateLedgerTransactionDialog
                    id={tx.id}
                    title={tx.title}
                    details={tx.details}
                    amount={tx.amount}
                    date={tx.date}
                  >
                    <Button icon={MdEdit} className="size-6" />
                  </UpdateLedgerTransactionDialog>
                  <DeleteLedgerTransactionDialog date={tx.date} id={tx.id}>
                    {transaction}
                  </DeleteLedgerTransactionDialog>
                </div>
              </div>
            );
          })}
        </div>

        {/* Income Column */}
        <div className="space-y-1">
          {data.incomeTx.map((tx) => {
            const transaction = (
              <div className="flex-1 flex justify-between font-medium bg-green-500/20 rounded-lg px-2 py-1">
                <div className="space-x-1">
                  <span className="truncate">{tx.title}</span>
                  <span className="truncate font-normal">
                    {tx.details ? `- ${tx.details}` : ''}
                  </span>
                </div>
                <span>{formatCurrency(tx.amount)}</span>
              </div>
            );

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between space-x-2"
              >
                {transaction}
                <div className="flex space-x-1">
                  <UpdateLedgerTransactionDialog
                    id={tx.id}
                    title={tx.title}
                    details={tx.details}
                    amount={tx.amount}
                    date={tx.date}
                  >
                    <Button icon={MdEdit} className="size-6" />
                  </UpdateLedgerTransactionDialog>
                  <DeleteLedgerTransactionDialog date={tx.date} id={tx.id}>
                    {transaction}
                  </DeleteLedgerTransactionDialog>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function MonthlyLedgerCard({ data }: { data: MonthlyCard }) {
  return (
    <div className="border border-border rounded-xl mx-4 px-4 py-2 shadow-sm space-y-3 bg-card">
      {/* Header */}
      <div className="grid grid-cols-[200px_1fr_1fr] gap-4 font-semibold text-lg">
        <h3 className="font-semibold">{data.label}</h3>
        <div className="text-right text-error">
          {formatCurrency(data.expenseTotal)}
        </div>
        <div className="text-right text-success">
          {formatCurrency(data.incomeTotal)}
        </div>
      </div>

      <hr className="h-px bg-zinc-500 border-0" />

      {/* Daily Rows */}
      <div className="space-y-1">
        {data.days.map((day) => {
          const dateLabel = fromISODate('dd MMM', day.date);

          return (
            <div
              key={day.date}
              className="grid grid-cols-[200px_1fr_1fr] gap-4 font-medium"
            >
              <div className="bg-sky-500/20 rounded-lg px-2 py-1">
                {dateLabel}
              </div>
              <div className="text-right bg-red-500/20 rounded-lg px-2 py-1">
                {formatCurrency(day.expense)}
              </div>
              <div className="text-right bg-green-500/20 rounded-lg px-2 py-1">
                {formatCurrency(day.income)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
