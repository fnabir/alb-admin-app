import type { SelectOption } from '@repo/ui';

export const staffTransactionTypeOptions: SelectOption[] = [
  { value: 'Advance', label: 'Advance (-)' },
  { value: 'For Conveyance', label: 'For Conveyance (-)' },
  { value: 'House Rent', label: 'House Rent (-)' },
  { value: 'Payment', label: 'Payment (-)' },
  { value: 'Salary', label: 'Salary (+)' },
  { value: 'Bonus', label: 'Bonus (+)' },
  { value: 'Cashback', label: 'Cashback (+)' },
  { value: 'Others', label: 'Others (-)' },
];
