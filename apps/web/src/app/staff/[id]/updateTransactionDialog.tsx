import {
  fromISODate,
  generateDatabaseKey,
  toISODate,
  TransactionForm,
  transactionSchema,
  updateTransaction,
} from '@repo/app';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormInput,
  FormSelect,
  toast,
} from '@repo/ui';
import { useState } from 'react';
import { DataSnapshot } from 'firebase/database';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SelectOption } from '@repo/ui/src/select/types';

const transactionTypeOptions: SelectOption[] = [
  { value: 'Advance', label: 'Advance (-)' },
  { value: 'For Conveyance', label: 'For Conveyance (-)' },
  { value: 'House Rent', label: 'House Rent (-)' },
  { value: 'Payment', label: 'Payment (-)' },
  { value: 'Salary', label: 'Salary (+)' },
  { value: 'Bonus', label: 'Bonus (+)' },
  { value: 'Cashback', label: 'Cashback (+)' },
  { value: 'Others', label: 'Others (-)' },
];

export default function UpdateTransactionDialog({
  id,
  name,
  data,
  children,
}: {
  id: string;
  name: string;
  data?: DataSnapshot;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);

  const dataExists = data ? true : false;
  const val = data?.val();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid, isDirty },
  } = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    mode: 'onChange',
    defaultValues: {
      title: val?.title ?? '',
      details: val?.details ?? '',
      amount: val?.amount ? Math.abs(val.amount) : 0,
      date: toISODate('dd.MM.yy', val?.date ?? ''),
    },
  });

  const onSubmit = async (formData: TransactionForm) => {
    try {
      await updateTransaction(
        'staff',
        id,
        data
          ? data.key!
          : fromISODate('yyMMdd', formData.date) +
              generateDatabaseKey(`transaction/staff/${id}`),
        {
          title: formData.title,
          details: formData.details,
          amount: formData.amount * (sign == '-' ? -1 : 1),
          date: fromISODate('dd.MM.yy', formData.date),
        },
      );
      toast.success(`${dataExists ? 'Updated' : 'Added'} the transaction`);
    } catch (error: any) {
      toast.error(
        `Failed to ${dataExists ? 'update' : 'add'} : ${error}`,
        'Please try again.',
      );
      return;
    }

    setOpen(false);
  };

  const handleReset = () => {
    reset({
      title: val?.title ?? '',
      details: val?.details ?? '',
      amount: val?.amount ? Math.abs(val.amount) : 0,
      date: toISODate('dd.MM.yy', val?.date ?? ''),
    });
  };

  const handleDialogChange = (state: boolean) => {
    setOpen(state);
    handleReset();
  };

  const titleValue = useWatch({
    control,
    name: 'title',
  });

  const sign =
    titleValue == ''
      ? ''
      : ['Salary', 'Bonus', 'Cashback'].includes(titleValue)
        ? '+'
        : '-';

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={'border-error'}>
        <DialogHeader>
          <DialogTitle>{`${data ? 'Update' : 'Add New'} Transaction`}</DialogTitle>
          <DialogDescription>{name}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          onReset={handleReset}
          className="flex flex-col space-y-3"
        >
          <FormSelect<TransactionForm>
            name="title"
            control={control}
            placeholder="Select Type..."
            options={transactionTypeOptions}
            disabled={isSubmitting}
          />
          <FormInput<TransactionForm>
            name="details"
            control={control}
            placeholder="Details"
            disabled={isSubmitting}
          />
          <FormInput<TransactionForm>
            name="amount"
            control={control}
            type="number"
            placeholder="Amount"
            startAdornment={`৳ ${sign == '-' ? sign : ''}`}
            disabled={isSubmitting}
          />
          <FormInput<TransactionForm>
            name="date"
            control={control}
            type="date"
            placeholder="Date"
            disabled={dataExists || isSubmitting}
          />

          <div className="flex space-x-2 pt-4 lg:pt-6 justify-center">
            <DialogClose asChild>
              <Button label={'Close'} variant="danger" className="px-10" />
            </DialogClose>
            <Button
              type="reset"
              label={'Reset'}
              variant="secondary"
              className="px-10"
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              variant="accent"
              label={dataExists ? 'Update' : 'Add'}
              loadingLabel={dataExists ? 'Updating...' : 'Adding...'}
              className="px-10"
              loading={isSubmitting}
              disabled={!isValid || !isDirty || isSubmitting}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
