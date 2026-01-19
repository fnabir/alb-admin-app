import { DataSnapshot } from 'firebase/database';

export interface TransactionRowProps {
  data?: DataSnapshot;
  children?: React.ReactNode;
}
