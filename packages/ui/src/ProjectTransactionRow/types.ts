import { DataSnapshot } from 'firebase/database';

export interface ProjectTransactionRowProps {
  transactionData?: DataSnapshot;
  children?: React.ReactNode;
  paidArray?: any[];
  totalPaid?: number;
}
