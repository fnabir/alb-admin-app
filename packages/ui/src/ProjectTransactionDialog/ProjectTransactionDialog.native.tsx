import { View, Text, ScrollView } from 'react-native';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  formatCurrency,
  fromISODate,
  generateDatabaseKey,
  getLabelByValue,
  toISODate,
  TransactionForm,
  transactionSchema,
  updateTransaction,
  removeStalePaymentLinks,
  updateProjectPaymentLink,
  updateProjectPartialPaymentLinks,
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

  const initialDialogState = useMemo(() => {
    let initialPaymentType = 'notPaid';
    let initialFullPaymentData: FullPaymentDataType = {
      key: '',
      details: '',
    };
    let initialPartialDataSets: PartialPaymentDataType[] = [
      { id: 1, key: '', details: '', amount: 0 },
    ];

    if (typeof val?.amount === 'number' && val.amount >= 0) {
      if (!paidArray || paidArray.length === 0) {
        initialPaymentType = 'notPaid';
      } else if (paidArray.length === 1 && total >= val.amount) {
        initialPaymentType = 'full';
        initialFullPaymentData = {
          key: paidArray[0].key ?? '',
          details: paidArray[0].details ?? '',
        };
      } else {
        initialPaymentType = 'partial';
        initialPartialDataSets = paidArray.map((item, index) => ({
          id: index + 1,
          key: item.key ?? '',
          details: item.details ?? '',
          amount: item.amount ?? 0,
        }));
      }
    }

    return {
      paymentType: initialPaymentType,
      fullPaymentData: initialFullPaymentData,
      partialDataSets: initialPartialDataSets,
    };
  }, [paidArray, total, val]);

  const hasLocalChanges = useMemo(() => {
    return (
      paymentType !== initialDialogState.paymentType ||
      JSON.stringify(fullPaymentData) !==
        JSON.stringify(initialDialogState.fullPaymentData) ||
      JSON.stringify(partialDataSets) !==
        JSON.stringify(initialDialogState.partialDataSets)
    );
  }, [fullPaymentData, initialDialogState, partialDataSets, paymentType]);

  const hasChanges = isDirty || hasLocalChanges;

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

    let paymentData: Record<
      string,
      { amount: number; details: string }
    > | null = {};
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
      await removeStalePaymentLinks(sign, id, val, key, paymentData);

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
        await updateProjectPaymentLink(id, key, formData, {
          key: fullPaymentData.key,
          details: fullPaymentData.details,
          amount: formData.amount,
        });
      } else if (paymentType === 'partial') {
        await updateProjectPartialPaymentLinks(
          id,
          key,
          formData,
          partialDataSets,
        );
      }
      onOpenChange(false);
      toast.success(`${dataExists ? 'Updated' : 'Added'} the transaction`);
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
      title: val?.title ?? '',
      details: val?.details ?? '',
      amount: val?.amount ? Math.abs(val.amount) : 0,
      date: toISODate('dd.MM.yy', val?.date ?? ''),
    });

    setSign(data && val.amount < 0 ? '-' : '+');
    setPaymentType(initialDialogState.paymentType);
    setFullPaymentData(initialDialogState.fullPaymentData);
    setPartialDataSets(initialDialogState.partialDataSets);
  };

  useEffect(() => {
    if (open) handleReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, data]);

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
      onOpenChange={onOpenChange}
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
            <View className="gap-2">
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
                    className="w-fit mx-auto"
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
                        className={`flex-row gap-2 py-0.5 items-center`}
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
                          icon={'trash-outline'}
                          onPress={() => removePartialDataSet(set.id)}
                          className="h-12"
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
          <View className="flex-row gap-2 justify-end mt-4 mx-auto">
            <Button
              label="Cancel"
              variant="secondary"
              onPress={() => onOpenChange(false)}
            />
            <Button
              label={dataExists ? 'Update' : 'Add'}
              variant="accent"
              disabled={!isValid || !hasChanges || isSubmitting}
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
