import { SelectOption } from './types';

export const projectSortOptions: SelectOption[] = [
  { value: 'name', label: 'Name' },
  { value: 'balance', label: 'Balance' },
];

export const projectTransactionOptions: SelectOption[] = [
  { value: '+', label: 'Expense' },
  { value: '-', label: 'Payment' },
];

export const projectExpenseOptions: SelectOption[] = [
  { value: 'Servicing', label: 'Servicing' },
  { value: 'Callback', label: 'Callback' },
  { value: 'Spare Parts', label: 'Spare Parts' },
  { value: 'Repairing', label: 'Repairing' },
  { value: 'Others', label: 'Others' },
];

export const projectPaymentOptions: SelectOption[] = [
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

export const projectPaymentTypeOptions: SelectOption[] = [
  { value: 'notPaid', label: 'Not Paid' },
  { value: 'full', label: 'Full' },
  { value: 'partial', label: 'Partial' },
];

// Staff
export const staffSortOptions: SelectOption[] = [
  { value: 'position', label: 'Position' },
  { value: 'balance', label: 'Balance' },
];

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

// Callback
export const callbackStatusOptions: SelectOption[] = [
  { value: 'New', label: 'New' },
  { value: 'Assigned', label: 'Assigned' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Fixed', label: 'Fixed' },
  { value: 'Cannot be fixed', label: 'Cannot be fixed' },
];

// Forms
export const formFilterOptions: SelectOption[] = [
  { value: 'offer', label: 'Offer' },
  { value: 'contact', label: 'Contact' },
  { value: 'quote', label: 'Quote' },
];

export const productOptions: SelectOption[] = [
  { value: 'Passenger Lift', label: 'Passenger Lift' },
  { value: 'Cargo Lift', label: 'Cargo Lift' },
  { value: 'Hospital Lift', label: 'Hospital Lift' },
  { value: 'Capsule Lift', label: 'Capsule Lift' },
  { value: 'Escalator', label: 'Escalator' },
  { value: 'Dumbwaiter', label: 'Dumbwaiter' },
  { value: 'Generator', label: 'Generator' },
  { value: 'Other', label: 'Other' },
];

export const workOptions: SelectOption[] = [
  { value: 'Full Project', label: 'Full Project' },
  { value: 'Servicing', label: 'Servicing' },
  { value: 'Installation', label: 'Installation' },
  { value: 'Repair', label: 'Repair' },
];

export const formStatusOptions: SelectOption[] = [
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Quote Submitted', label: 'Quote Submitted' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Closed', label: 'Closed' },
];

// Ledger
export const ledgerFilterOptions: SelectOption[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

export const ledgerOptions: SelectOption[] = [
  { value: '+', label: 'Money In (+)' },
  { value: '-', label: 'Money Out (-)' },
];

// Payment Info
export const paymentInfoOptions: SelectOption[] = [
  { value: 'account', label: 'Account Transfer' },
  { value: 'bank', label: 'Bank Transfer' },
  { value: 'bKash', label: 'bKash' },
  { value: 'cash', label: 'Cash' },
  { value: 'cell', label: 'CellFin (Phone)' },
  { value: 'cellAccount', label: 'CellFin (Account)' },
  { value: 'cheque', label: 'Cheque' },
];
