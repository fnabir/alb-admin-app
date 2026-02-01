import { isValid, parse, format, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { DataSnapshot } from 'firebase/database';

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export type FormatCurrencyOptions = {
  symbol?: string | null;
  decimals?: number;
};

export function formatCurrency(
  value: number | string | undefined,
  options: FormatCurrencyOptions = {},
) {
  if (value == null || value === '') return '';

  const num = Number(value);
  if (isNaN(num)) return String(value);

  const { symbol = '৳', decimals = 0 } = options;

  const isNegative = num < 0;
  const absValue = Math.abs(num);

  const fixed = absValue.toFixed(decimals);

  const parts = fixed.split('.');
  const intPart = parts[0] ?? '0';
  const decimalPart = parts[1] ?? '';

  const formatted = intPart.replace(/(\d)(?=(\d{3})(\d{2})*$)/g, '$1,');

  const finalNumber = decimals > 0 ? `${formatted}.${decimalPart}` : formatted;

  return `${isNegative ? '- ' : ''}${symbol ?? ''} ${finalNumber}`;
}

export function getTotalValue(
  data: DataSnapshot[] | undefined,
  dataName?: string,
): number {
  if (!data) return 0;
  else {
    if (dataName == 'amount')
      return data.reduce((sum, snap) => {
        const val = snap.val();
        return sum + (val.amount || 0);
      }, 0);
    else
      return data.reduce((sum, snap) => {
        const val = snap.val();
        return sum + (val.value || 0);
      }, 0);
  }
}

export function getCurrentDate(format: string): string {
  return formatInTimeZone(new Date(), 'Asia/Dhaka', format);
}

export function toISODate(dateFormat: string, value?: string) {
  if (!value) return '';
  const date = parse(value, dateFormat, new Date());
  return isValid(date) ? format(date, 'yyyy-MM-dd') : '';
}

export function fromISODate(dateFormat: string, value?: string) {
  if (!value) return '';
  const date = parseISO(value);
  return isValid(date) ? format(date, dateFormat) : '';
}

export function getLabelByValue(
  options: { value: string; label: string }[],
  value: string,
) {
  return options.find((o) => o.value === value)?.label ?? '';
}
