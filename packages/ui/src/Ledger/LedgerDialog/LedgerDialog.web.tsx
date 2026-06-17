'use client';

import {
  fromISODate,
  generateDatabaseKey,
  ledgerOptions,
  TransactionForm,
  transactionSchema,
  updateLedgerTransaction,
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
  RadioGroup,
  toast,
} from '@repo/ui';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LedgerDialogProps } from './types';

export function LedgerDialog({
  id,
  title,
  details,
  amount = 0,
  date,
  children,
}: LedgerDialogProps & {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);

  const dataExists = id ? true : false;

  const [sign, setSign] = useState<string>(amount < 0 ? '-' : '+');

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid, isDirty },
  } = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    mode: 'onChange',
    defaultValues: {
      title: title ?? '',
      details: details ?? '',
      amount: amount ? Math.abs(amount) : 0,
      date: date ?? '',
    },
  });

  const onSubmit = async (formData: TransactionForm) => {
    const year = fromISODate('yyyy', date ?? formData.date);
    const month = fromISODate('M', date ?? formData.date);
    const day = fromISODate('d', date ?? formData.date);
    const key =
      id ??
      fromISODate('yyMMdd', formData.date) +
        generateDatabaseKey(`ledger/transaction/${year}/${month}/${date}`);

    try {
      await updateLedgerTransaction(year, month, day, key, {
        title: formData.title,
        details: formData.details,
        amount: formData.amount * (sign === '-' ? -1 : 1),
        date: formData.date,
      });
      setOpen(false);
      toast.success(
        `${dataExists ? 'Updated' : 'Added'} the ledger transaction`,
      );
    } catch (error: any) {
      toast.error(
        `Failed to ${dataExists ? 'update' : 'add'} : ${error}`,
        'Please try again.',
      );
      return;
    }
  };

  const handleReset = () => {
    reset({
      title: title ?? '',
      details: details ?? '',
      amount: amount ? Math.abs(amount) : 0,
      date: date ?? '',
    });
  };

  useEffect(() => {
    if (open) handleReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, title, details, amount, date]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={'border-error'}>
        <DialogHeader>
          <DialogTitle>{`${dataExists ? 'Update' : 'Add New'} Ledger Transaction`}</DialogTitle>
          <DialogDescription>
            {date ??
              'Date cannot be edited later. To change date, delete and add new entry.'}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-3"
        >
          <RadioGroup
            value={sign}
            onValueChange={setSign}
            options={ledgerOptions}
            disabled={dataExists || isSubmitting}
          />
          <FormInput<TransactionForm>
            name="title"
            control={control}
            placeholder="Title"
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
            startAdornment={`৳ ${sign === '-' ? sign : ''}`}
            disabled={isSubmitting}
          />
          <FormInput<TransactionForm>
            name="date"
            control={control}
            type="date"
            placeholder="Date"
            disabled={dataExists || isSubmitting}
          />

          <div className="flex space-x-2 pt-4 justify-center">
            <DialogClose asChild>
              <Button label={'Close'} variant="danger" className="w-full" />
            </DialogClose>
            <Button
              type="submit"
              variant="accent"
              label={dataExists ? 'Update' : 'Add'}
              loadingLabel={dataExists ? 'Updating...' : 'Adding...'}
              className="w-full"
              loading={isSubmitting}
              disabled={!isValid || !isDirty || isSubmitting}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
