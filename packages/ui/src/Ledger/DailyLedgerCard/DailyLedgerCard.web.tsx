import { DailyLedger, formatCurrency, fromISODate } from '@repo/app';
import { DeleteLedgerDialog } from '../LedgerDialog/DeleteLedgerDialog';
import { Button } from '../../button';
import { MdEdit } from 'react-icons/md';
import { LedgerDialog } from '../LedgerDialog';

export function DailyLedgerCard({ data }: { data: DailyLedger }) {
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
                  <LedgerDialog
                    id={tx.id}
                    title={tx.title}
                    details={tx.details}
                    amount={tx.amount}
                    date={tx.date}
                  >
                    <Button icon={MdEdit} className="size-6" />
                  </LedgerDialog>
                  <DeleteLedgerDialog date={tx.date} id={tx.id}>
                    {transaction}
                  </DeleteLedgerDialog>
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
                  <LedgerDialog
                    id={tx.id}
                    title={tx.title}
                    details={tx.details}
                    amount={tx.amount}
                    date={tx.date}
                  >
                    <Button icon={MdEdit} className="size-6" />
                  </LedgerDialog>
                  <DeleteLedgerDialog date={tx.date} id={tx.id}>
                    {transaction}
                  </DeleteLedgerDialog>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
