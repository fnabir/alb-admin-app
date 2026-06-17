import { formatCurrency, YearlyLedger } from '@repo/app';
import { Card } from '../../Card';

export function YearlyLedgerCard({ data }: { data: YearlyLedger }) {
  return (
    <Card>
      <div className="grid grid-cols-[200px_1fr_1fr] gap-4 font-semibold text-lg">
        <h3 className="font-semibold">{data.year}</h3>
        <div className="text-right text-error">
          {formatCurrency(data.expenseTotal)}
        </div>
        <div className="text-right text-success">
          {formatCurrency(data.incomeTotal)}
        </div>
      </div>
    </Card>
  );
}
