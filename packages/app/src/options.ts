import type { SelectOption } from '@repo/ui';

export const paymentOptions: SelectOption[] = [
  { label: 'Account Transfer', value: 'account' },
  { label: 'Bank Transfer', value: 'bank' },
  { label: 'Bkash Transfer', value: 'bKash' },
  { label: 'Cash', value: 'cash' },
  { label: 'CellFin', value: 'cell' },
  { label: 'Cheque', value: 'cheque' },
];
