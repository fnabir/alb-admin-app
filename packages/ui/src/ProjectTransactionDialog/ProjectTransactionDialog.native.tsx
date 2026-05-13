import { View, Text, ScrollView } from 'react-native';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  formatCurrency,
  fromISODate,
  generateDatabaseKey,
  getDatabaseReference,
  getLabelByValue,
  toISODate,
  TransactionForm,
  transactionSchema,
  updateTransaction,
} from '@repo/app';
import { Dialog } from '../dialog';
import { useEffect, useMemo, useState } from 'react';
import {
  expenseOptions,
  FullPaymentDataType,
  monthOptions,
  PartialPaymentDataType,
  paymentOptions,
  paymentTypeOptions,
  Props,
  transactionOptions,
} from './types';
import { RadioGroup } from '../radio/radio.native';
import { update } from 'firebase/database';
import { Select } from '../select/Select.native';
import { Input } from '../input/input.native';
import { FormInput, FormSelect } from '../FormField';
import { toast } from '../toast/useToast';
import { Button } from '../button/Button.native';

export function ProjectTransactionDialog({
  id,
  data,
  servicingCharge = 0,
  paidArray,
  paidDataOptions,
  total = 0,
  open,
  onOpenChange,
}: Props & { open: boolean; onOpenChange: (open: boolean) => void }) {
  const dataExists = data ? true : false;
  const val = data?.val();

  const [sign, setSign] = useState<string>(data && val.amount < 0 ? '-' : '+');
  const [paymentType, setPaymentType] = useState<string>('notPaid');
  const [fullPaymentData, setFullPaymentData] = useState<FullPaymentDataType>({
    key: '',
    details: '',
  });
  const [partialDataSets, setPartialDataSets] = useState<
    PartialPaymentDataType[]
  >([{ id: 1, key: '', details: '', amount: 0 }]);

  const {
    control,
    setValue,
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

  const addPartialDataSet = () => {
    if (partialDataSets.length < 10) {
      setPartialDataSets((prev: PartialPaymentDataType[]) => [
        ...prev,
        { id: prev.length + 1, key: '', details: '', amount: 0 },
      ]);
    }
  };

  const removePartialDataSet = (id: number) => {
    setPartialDataSets((prev) => prev.filter((set) => set.id !== id));
  };

  function handlePartialDataChange(
    id: number,
    field: 'details' | 'key',
    value: string,
  ) {
    setPartialDataSets((prev) =>
      prev.map((set) => (set.id === id ? { ...set, [field]: value } : set)),
    );
  }

  function handlePartialDataAmountChange(id: number, value: number) {
    setPartialDataSets((prev) =>
      prev.map((set) => (set.id === id ? { ...set, amount: value } : set)),
    );
  }

  const updatePaymentData = async (
    data: TransactionForm,
    transactionId: string,
    key: string,
    details: string,
    amount: number,
  ) => {
    const expenseRef = getDatabaseReference(
      `transaction/project/${id}/${transactionId}/data/${key}`,
    );
    const paymentRef = getDatabaseReference(
      `transaction/project/${id}/${key}/data/${transactionId}`,
    );
    const expenseData = {
      details: `${fromISODate('dd.MM.yy', data.date)} ${data.title} - ${
        data.details
      }`,
      amount: amount,
    };
    const paymentData = {
      details: details,
      amount: amount,
    };
    update(expenseRef, paymentData).catch((error) =>
      console.error(`Payment Data in Expense Transaction: ${error.message}`),
    );
    update(paymentRef, expenseData).catch((error) =>
      console.error(`Expense Data in Payment Transaction: ${error.message}`),
    );
  };

  const updatePartialPaymentData = async (
    data: TransactionForm,
    newKey: string,
  ) => {
    partialDataSets.forEach((partialDataSet) => {
      if (
        partialDataSet.key &&
        partialDataSet.key !== 'Select' &&
        partialDataSet.details !== 'Select'
      ) {
        updatePaymentData(
          data,
          newKey,
          partialDataSet.key,
          partialDataSet.details,
          partialDataSet.amount,
        );
      }
    });
  };

  const onSubmit = async (formData: TransactionForm) => {
    if (sign === '+') {
      if (
        paymentType === 'full' &&
        (!fullPaymentData || !fullPaymentData.key || !fullPaymentData.details)
      ) {
        toast.error('Full Payment Date', 'Please select a valid payment date');
        return;
      }

      if (paymentType === 'partial') {
        const invalidPartial = partialDataSets.some(
          (p) => !p.key || !p.details || p.amount <= 0,
        );

        if (invalidPartial) {
          toast.error(
            'Partial Payment Dates and Amounts',
            'Please select valid payment dates and amounts for all partial payments',
          );
          return;
        }
      }
    }

    let paymentData = {};
    if (sign === '+') {
      if (paymentType === 'full') {
        paymentData = {
          [fullPaymentData.key]: {
            details: fullPaymentData.details,
            amount: formData.amount,
          },
        };
      } else if (paymentType === 'partial') {
        paymentData = partialDataSets.reduce(
          (partialDataObject, partialData) => {
            if (
              partialData.key &&
              partialData.key !== 'Select' &&
              partialData.details !== 'Select'
            ) {
              partialDataObject[partialData.key] = {
                amount: partialData.amount,
                details: partialData.details,
              };
            }
            return partialDataObject;
          },
          {} as { [key: string]: { amount: number; details: string } },
        );
      }
    } else {
      paymentData = val?.data ?? null;
    }

    const key = data
      ? data.key!
      : fromISODate('yyMMdd', formData.date) +
        generateDatabaseKey(`transaction/staff/${id}`);

    try {
      await updateTransaction(
        'project',
        id,
        data
          ? data.key!
          : fromISODate('yyMMdd', formData.date) +
              generateDatabaseKey(`transaction/staff/${id}`),
        {
          title: formData.title,
          details: formData.details,
          amount: formData.amount * (sign === '-' ? -1 : 1),
          date: fromISODate('dd.MM.yy', formData.date),
          data: paymentData,
        },
      );

      if (paymentType === 'full') {
        await updatePaymentData(
          formData,
          key,
          fullPaymentData.key,
          fullPaymentData.details,
          formData.amount,
        );
      } else if (paymentType === 'partial') {
        await updatePartialPaymentData(formData, key);
      }

      toast.success(`${dataExists ? 'Updated' : 'Added'} the transaction`);
    } catch (error: any) {
      toast.error(
        `Failed to ${dataExists ? 'update' : 'add'} : ${error}`,
        'Please try again.',
      );
      return;
    }

    onOpenChange(false);
  };

  const handleReset = () => {
    reset({
      title: val?.title ?? '',
      details: val?.details ?? '',
      amount: val?.amount ? Math.abs(val.amount) : 0,
      date: toISODate('dd.MM.yy', val?.date ?? ''),
    });

    if (val?.amount && val.amount >= 0) {
      if (!paidArray || paidArray.length === 0) {
        setPaymentType('notPaid');
      } else if (paidArray.length === 1 && total >= val.amount) {
        setPaymentType('full');
        paidArray.map((item) => {
          setFullPaymentData({ key: item.key!, details: item.details });
        });
      } else {
        setPaymentType('partial');
        const updatedPartialData: PartialPaymentDataType[] = paidArray.map(
          (item, index) => ({
            id: index + 1,
            key: item.key!,
            details: item.details,
            amount: item.amount,
          }),
        );
        setPartialDataSets(updatedPartialData);
      }
    }
  };

  const handleDialogChange = (state: boolean) => {
    onOpenChange(state);
    handleReset();
  };

  const titleValue = useWatch({
    control,
    name: 'title',
  });

  const detailsLabel = useMemo(() => {
    switch (titleValue) {
      case 'Cash':
        return 'Receiver';
      case 'Cheque':
      case 'Bank Transfer':
        return 'Bank Name, Branch';
      case 'Account Transfer':
      case 'CellFin (Account)':
        return 'Account Number';
      case 'CellFin (Phone)':
        return 'Phone Number';
      case 'bKash':
        return 'bKash Number';
      case 'Spare Parts':
        return 'Name of Parts';
      default:
        return 'Details';
    }
  }, [titleValue]);

  useEffect(() => {
    setValue('details', '');
    if (titleValue === 'Servicing') setValue('amount', servicingCharge);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleValue]);

  return (
    <Dialog
      open={open}
      onOpenChange={handleDialogChange}
      title={`${dataExists ? 'Update' : 'Add New'} Transaction`}
    >
      <>
        <Text className="text-primary -mt-4">{id}</Text>
        <ScrollView className="space-y-1 my-4">
          <RadioGroup
            value={sign}
            onValueChange={(value: string) => {
              setSign(value);
              setValue('title', '');
              setValue('details', '');
            }}
            options={transactionOptions}
            disabled={dataExists || isSubmitting}
          />
          <FormSelect<TransactionForm>
            name="title"
            control={control}
            placeholder={
              sign === '+' ? 'Select Expense Type...' : 'Select Payment Type...'
            }
            options={sign === '+' ? expenseOptions : paymentOptions}
            disabled={isSubmitting}
            className="mb-3"
          />
          {titleValue === 'Servicing' ? (
            <FormSelect<TransactionForm>
              name="details"
              control={control}
              placeholder="Select Month..."
              options={monthOptions}
              disabled={isSubmitting}
              className="mb-3"
            />
          ) : (
            <FormInput<TransactionForm>
              name="details"
              control={control}
              placeholder={detailsLabel}
              disabled={isSubmitting}
              className="mb-3"
            />
          )}
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
          {sign === '+' ? (
            <View className="pt-4">
              <RadioGroup
                value={paymentType}
                onValueChange={setPaymentType}
                options={paymentTypeOptions}
                disabled={(paidDataOptions ? false : true) || isSubmitting}
              />
              {paidDataOptions &&
                paymentType === 'partial' &&
                partialDataSets.length < 10 && (
                  <Button
                    icon={'add'}
                    label="Add"
                    onPress={addPartialDataSet}
                  />
                )}
              {paidDataOptions &&
                paymentType !== 'notPaid' &&
                (paymentType === 'full' ? (
                  <Select
                    options={paidDataOptions}
                    value={fullPaymentData.key ?? ''}
                    onChange={(value: string) =>
                      setFullPaymentData({
                        key: value,
                        details: getLabelByValue(paidDataOptions, value),
                      })
                    }
                  />
                ) : (
                  <View>
                    {partialDataSets.map((set, index) => (
                      <View
                        key={set.id}
                        className={`flex-row gap-2 items-center`}
                      >
                        <Select
                          options={paidDataOptions}
                          value={partialDataSets[index].key}
                          onChange={(value: string) => {
                            handlePartialDataChange(set.id, 'key', value);
                            handlePartialDataChange(
                              set.id,
                              'details',
                              getLabelByValue(paidDataOptions, value),
                            );
                          }}
                          className="flex-grow"
                        />
                        <Input
                          placeholder="Amount"
                          type="number"
                          value={String(
                            partialDataSets[index].amount === 0
                              ? ''
                              : partialDataSets[index].amount,
                          )}
                          onChangeText={(value: string) =>
                            handlePartialDataAmountChange(set.id, Number(value))
                          }
                          startAdornment={'৳'}
                          className="w-24"
                        />
                        <Button
                          icon={'delete'}
                          onPress={() => removePartialDataSet(set.id)}
                          className="h-8"
                        />
                      </View>
                    ))}
                  </View>
                ))}
            </View>
          ) : (
            paidArray && (
              <View className="flex flex-col mt-4 border rounded-lg space-y-1 px-2 py-1 divide-y">
                {paidArray
                  .sort((a, b) => b.key!.localeCompare(a.key!))
                  .map((item) => {
                    return (
                      <View
                        className="flex-row gap-2 items-center text-xs md:text-sm"
                        key={item.key}
                      >
                        <Text>{item.details.substring(0, 8)}</Text>
                        <Text className="flex-1">
                          {item.details.substring(8)}
                        </Text>
                        <Text>{formatCurrency(item.amount)}</Text>
                      </View>
                    );
                  })}
              </View>
            )
          )}
          <View className="flex-row gap-2 justify-end mt-4">
            <Button
              label="Cancel"
              variant="secondary"
              onPress={() => handleDialogChange(false)}
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
