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
