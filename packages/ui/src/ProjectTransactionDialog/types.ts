import { DataSnapshot } from 'firebase/database';
import { SelectOption } from '@repo/app';

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
