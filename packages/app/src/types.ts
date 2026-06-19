export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type FormType = 'offer' | 'contact' | 'quote';

export type FormVal = {
  name: string;
  date: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  contact?: string;
  address?: string;
  product?: string;
  work?: string;
  floor?: string;
  person?: string;
  shaft?: string;
  unit?: string;
  note?: string;
  status?: string;
};

export type Ledger = {
  id: string;
  amount: number;
  title: string;
  details?: string;
  date: string;
};

export type DailyLedger = {
  date: string;
  incomeTotal: number;
  expenseTotal: number;
  incomeTx: Ledger[];
  expenseTx: Ledger[];
};

export type MonthlyLedger = {
  month: string;
  label: string;
  incomeTotal: number;
  expenseTotal: number;
  days: {
    date: string;
    income: number;
    expense: number;
  }[];
};

export type YearlyLedger = {
  year: string;
  incomeTotal: number;
  expenseTotal: number;
};

export type ProjectInfo = {
  location?: string;
  contactName?: string;
  phone?: string;
  servicing?: number;
  cancelled?: boolean;
};
