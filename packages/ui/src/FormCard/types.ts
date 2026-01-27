import { DataSnapshot } from 'firebase/database';

export interface FormCardProps {
  type: 'offer' | 'contact' | 'quote';
  data: DataSnapshot;
  children?: React.ReactNode;
}
