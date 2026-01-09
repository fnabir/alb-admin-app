export interface TotalBalanceProps {
  title?: string;
  date?: string;
  value: number;
  error?: string;
  showUpdate?: boolean;
  onClick?: () => void;
  className?: string;
}
