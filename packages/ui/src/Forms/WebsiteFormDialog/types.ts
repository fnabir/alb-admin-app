import { FormVal } from '@repo/app';

export interface WebsiteFormDialogProps {
  type: 'contact' | 'quote';
  id: string;
  val: FormVal;
}
