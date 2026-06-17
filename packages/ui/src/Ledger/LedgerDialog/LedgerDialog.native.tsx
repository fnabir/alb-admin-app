import { ScrollView, Text, View } from 'react-native';
import { Dialog } from '../../dialog';
import { toast } from '../../toast';
import { useEffect, useState } from 'react';
import { LedgerDialogProps } from './types';
import { useForm } from 'react-hook-form';
import {
  fromISODate,
  generateDatabaseKey,
  ledgerOptions,
  TransactionForm,
  transactionSchema,
  updateLedgerTransaction,
} from '@repo/app';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '../../FormField';
import { RadioGroup } from '../../radio';
import { Button } from '../../button';

export function LedgerDialog({
  id,
  title,
  details,
  amount = 0,
  date,
  open,
  onOpenChange,
}: LedgerDialogProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
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
      onOpenChange(false);
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
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={`${dataExists ? 'Update' : 'Add New'} Callback`}
    >
      <>
        {dataExists && <Text className="text-primary -mt-4">{title}</Text>}
        <ScrollView className="my-4">
          <View className="gap-2">
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
          </View>
        </ScrollView>
        <View className="flex-row gap-2 justify-center mt-8">
          <Button
            label="Cancel"
            variant="secondary"
            onPress={() => onOpenChange(false)}
          />
          <Button
            label={dataExists ? 'Update' : 'Add'}
            variant="accent"
            disabled={!isValid || !isDirty}
            loading={isSubmitting}
            loadingLabel={dataExists ? 'Updating...' : 'Adding...'}
            onPress={async () => {
              handleSubmit(onSubmit)();
            }}
          />
        </View>
      </>
    </Dialog>
  );
}
