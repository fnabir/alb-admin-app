import { formatCurrency, fromISODate, MonthlyLedger } from '@repo/app';

export function MonthlyLedgerCard({ data }: { data: MonthlyLedger }) {
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
