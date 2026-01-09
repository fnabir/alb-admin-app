import { formatCurrency } from '@repo/app';
import { BalanceRowProps } from './types';

export function BalanceRow({ data, title }: BalanceRowProps) {
  const val = data.val();
  const getCardStyle = () => {
    if (val.status === 'cancel')
      return 'bg-red-900 text-white hover:border-red-600';
    else if (val.value < 0)
      return 'bg-yellow-900 text-white hover:border-yellow-600';
    else if (val.value === 0)
      return 'bg-green-900 text-white hover:border-green-600';
    else return 'bg-card text-primary hover:border-accent';
  };

  const badge =
    val.status === 'cancel' ? 'Cancelled' : val.value < 0 ? 'Overpaid' : '';

  return (
    <div
      className={`flex w-full rounded-lg border-2 border-transparent px-2 lg:px-4 py-1 lg:py-1.5 transition-colors duration-200 ${getCardStyle()}`}
    >
      <div className="flex-1 flex items-center space-x-2">
        <div className="flex flex-col">
          <span className="font-semibold">{title ?? data.key}</span>
          <span className="text-sm">{val.date}</span>
        </div>
        {badge !== '' && (
          <div className="rounded-xl bg-white text-black text-[13px] px-2 py-0.5 font-semibold">
            {badge}
          </div>
        )}
      </div>
      <div className="text-xl font-semibold">{formatCurrency(val.value)}</div>
    </div>
  );
}
