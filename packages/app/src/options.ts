import { SelectOption } from './types';

export const filterOptions: SelectOption[] = [
  { value: 'offer', label: 'Offer' },
  { value: 'contact', label: 'Contact' },
  { value: 'quote', label: 'Quote' },
];

export const paymentOptions: SelectOption[] = [
  { label: 'Account Transfer', value: 'account' },
  { label: 'Bank Transfer', value: 'bank' },
  { label: 'Bkash Transfer', value: 'bKash' },
  { label: 'Cash', value: 'cash' },
  { label: 'CellFin', value: 'cell' },
  { label: 'Cheque', value: 'cheque' },
];

export const callbackStatusOptions: SelectOption[] = [
  { value: 'New', label: 'New' },
  { value: 'Assigned', label: 'Assigned' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Fixed', label: 'Fixed' },
  { value: 'Cannot be fixed', label: 'Cannot be fixed' },
];

// Forms
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
