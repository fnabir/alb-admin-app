import { DataSnapshot } from 'firebase/database';

export interface BalanceRowProps {
  data: DataSnapshot;
  title?: string;
}
