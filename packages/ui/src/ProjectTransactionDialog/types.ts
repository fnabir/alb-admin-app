import { DataSnapshot } from 'firebase/database';
import type { SelectOption } from '@repo/ui';

export const transactionOptions: SelectOption[] = [
  { value: '+', label: 'Expense' },
  { value: '-', label: 'Payment' },
];

export const expenseOptions: SelectOption[] = [
  { value: 'Servicing', label: 'Servicing' },
  { value: 'Callback', label: 'Callback' },
  { value: 'Spare Parts', label: 'Spare Parts' },
  { value: 'Repairing', label: 'Repairing' },
  { value: 'Others', label: 'Others' },
];

export const paymentOptions: SelectOption[] = [
  { value: 'Cash', label: 'Cash' },
  { value: 'Cheque', label: 'Cheque' },
  { value: 'Account Transfer', label: 'Account Transfer' },
  { value: 'Bank Transfer', label: 'Bank Transfer' },
  { value: 'CellFin', label: 'CellFin (Phone)' },
  { value: 'CellFin (Account)', label: 'CellFin (Account)' },
  { value: 'bKash', label: 'bKash' },
];

export const monthOptions: SelectOption[] = [
  { value: 'January', label: 'January' },
  { value: 'February', label: 'February' },
  { value: 'March', label: 'March' },
  { value: 'April', label: 'April' },
  { value: 'May', label: 'May' },
  { value: 'June', label: 'June' },
  { value: 'July', label: 'July' },
  { value: 'August', label: 'August' },
  { value: 'September', label: 'September' },
  { value: 'October', label: 'October' },
  { value: 'November', label: 'November' },
  { value: 'December', label: 'December' },
];

export const paymentTypeOptions: SelectOption[] = [
  { value: 'notPaid', label: 'Not Paid' },
  { value: 'full', label: 'Full' },
  { value: 'partial', label: 'Partial' },
];

export type FullPaymentDataType = {
  key: string;
  details: string;
};

export type PartialPaymentDataType = {
  id: number;
  amount: number;
} & FullPaymentDataType;

export interface Props {
  id: string;
  data?: DataSnapshot;
  servicingCharge?: number;
  children: React.ReactNode;
  paidArray?: any[];
  paidDataOptions?: SelectOption[];
  total?: number;
}
