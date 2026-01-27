import { DataSnapshot } from 'firebase/database';

export interface CallabckCardProps {
  project: string;
  data?: DataSnapshot;
  children?: React.ReactNode;
}

export interface CallabckTotalCardProps {
  project: string;
  count?: number;
}
