import { View, Text, ScrollView } from 'react-native';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  fromISODate,
  generateDatabaseKey,
  toISODate,
  TransactionForm,
  transactionSchema,
  updateTransaction,
} from '@repo/app';
import { Dialog } from '../dialog';
import { Button } from '../button/Button.native';
import { toast } from '../toast';
import { FormInput, FormSelect } from '../FormField';
import { DataSnapshot } from 'firebase/database';
import { staffTransactionTypeOptions } from './options';
import { useEffect } from 'react';

type Props = {
  type: 'staff' | 'conveyance';
  id: string;
  name: string;
  data?: DataSnapshot;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function StaffTransactionDialog({
  type,
  id,
  name,
  data,
  open,
  onOpenChange,
}: Props) {
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

  const titleValue = useWatch({ control, name: 'title' });
  const sign = !titleValue
    ? ''
    : ['Salary', 'Bonus', 'Cashback'].includes(titleValue)
      ? '+'
      : '-';

  const handleReset = () => {
    reset({
      title: val?.title ?? '',
      details: val?.details ?? '',
      amount: val?.amount ? Math.abs(val.amount) : 0,
      date: toISODate('dd.MM.yy', val?.date ?? ''),
    });
  };

  useEffect(() => {
    if (open) handleReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, data]);

  const onSubmit = async (formData: TransactionForm) => {
    try {
      await updateTransaction(
        type,
        id,
        data
          ? data.key!
          : fromISODate('yyMMdd', formData.date) +
              generateDatabaseKey(`transaction/${type}/${id}`),
        {
          title: formData.title,
          details: formData.details,
          amount: formData.amount * (sign === '-' ? -1 : 1),
          date: fromISODate('dd.MM.yy', formData.date),
        },
      );
      onOpenChange(false);
      toast.success(`${dataExists ? 'Updated' : 'Added'} the transaction`);
    } catch (error: any) {
      toast.error(
        `Failed to ${dataExists ? 'update' : 'add'}: ${error}`,
        'Please try again.',
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={`${dataExists ? 'Update' : 'Add New'} Transaction`}
    >
      <>
        <Text className="text-primary -mt-4">{name}</Text>
        <ScrollView className="space-y-1 my-4">
          <FormSelect<TransactionForm>
            name="title"
            control={control}
            placeholder="Select Transaction Type..."
            options={staffTransactionTypeOptions}
            disabled={isSubmitting}
            className="mb-3"
          />
          <FormInput<TransactionForm>
            name="details"
            control={control}
            placeholder="Details"
            disabled={isSubmitting}
            className="mb-3"
          />
          <FormInput<TransactionForm>
            name="amount"
            control={control}
            type="number"
            placeholder="Amount"
            startAdornment={`৳ ${sign === '-' ? sign : ''}`}
            disabled={isSubmitting}
            className="mb-3"
          />
          <FormInput<TransactionForm>
            name="date"
            control={control}
            type="date"
            placeholder="Date"
            disabled={dataExists || isSubmitting}
            className="mb-3"
          />
          <View className="flex-row gap-2 justify-end mt-4">
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
        </ScrollView>
      </>
    </Dialog>
  );
}
