'use client';

import {
  formatCurrency,
  fromISODate,
  generateDatabaseKey,
  getLabelByValue,
  monthOptions,
  projectExpenseOptions,
  projectPaymentOptions,
  projectPaymentTypeOptions,
  projectTransactionOptions,
  toISODate,
  TransactionForm,
  transactionSchema,
  updateTransaction,
  removeStalePaymentLinks,
  updateProjectPaymentLink,
  updateProjectPartialPaymentLinks,
} from '@repo/app';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FullPaymentDataType, PartialPaymentDataType, Props } from './types';
import { RadioGroup } from '../radio';
import { MdAdd, MdDelete } from 'react-icons/md';
import { Select } from '../select/Select';
import { Input } from '../input/input';
import { FormInput, FormSelect } from '../FormField';
import { toast } from '../toast/useToast';
import { Button } from '../button/Button';

export function ProjectTransactionDialog({
  id,
  data,
  servicingCharge = 0,
  paidArray,
  paidDataOptions,
  children,
  total = 0,
}: Props) {
  const [open, setOpen] = useState<boolean>(false);

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

    setSign(data && val.amount < 0 ? '-' : '+');
    setPaymentType(initialDialogState.paymentType);
    setFullPaymentData(initialDialogState.fullPaymentData);
    setPartialDataSets(initialDialogState.partialDataSets);
  };

  const handleDialogChange = (state: boolean) => {
    setOpen(state);
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
    switch (titleValue) {
      case 'Account Transfer':
      case 'CellFin (Account)':
        setValue('details', 'A/C No.**');
        setValue('amount', 0);
        break;
      case 'CellFin (Phone)':
      case 'bKash':
        setValue('details', '01');
        setValue('amount', 0);
        break;
      case 'Servicing':
        setValue('details', '');
        setValue('amount', servicingCharge);
        break;
      default:
        setValue('details', '');
        setValue('amount', 0);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleValue]);

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={'border-error'}>
        <DialogHeader>
          <DialogTitle>{`${data ? 'Update' : 'Add New'} Transaction`}</DialogTitle>
          <DialogDescription>{id}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-3"
        >
          <RadioGroup
            value={sign}
            onValueChange={(value: string) => {
              setSign(value);
              setValue('title', '');
              setValue('details', '');
            }}
            options={projectTransactionOptions}
            disabled={dataExists || isSubmitting}
          />
          <FormSelect<TransactionForm>
            name="title"
            control={control}
            placeholder={
              sign === '+' ? 'Select Expense Type...' : 'Select Payment Type...'
            }
            options={
              sign === '+' ? projectExpenseOptions : projectPaymentOptions
            }
            disabled={isSubmitting}
          />
          {titleValue === 'Servicing' ? (
            <FormSelect<TransactionForm>
              name="details"
              control={control}
              placeholder="Select Month..."
              options={monthOptions}
              disabled={isSubmitting}
            />
          ) : (
            <FormInput<TransactionForm>
              name="details"
              control={control}
              placeholder={detailsLabel}
              disabled={isSubmitting}
            />
          )}
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

          {sign === '+' ? (
            <div className="flex flex-col space-y-2 pt-4">
              <RadioGroup
                value={paymentType}
                onValueChange={setPaymentType}
                options={projectPaymentTypeOptions}
                disabled={(paidDataOptions ? false : true) || isSubmitting}
              />
              {paidDataOptions &&
                paymentType === 'partial' &&
                partialDataSets.length < 10 && (
                  <Button
                    icon={MdAdd}
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
                  <div className="max-h-60 overflow-y-auto overflow-x-hidden space-y-2">
                    {partialDataSets.map((set, index) => (
                      <div
                        key={set.id}
                        className={`flex space-x-1 items-center`}
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
                          value={partialDataSets[index].amount}
                          onChangeText={(value: string) =>
                            handlePartialDataAmountChange(set.id, Number(value))
                          }
                          startAdornment={'৳'}
                          className="w-24"
                        />
                        <Button
                          icon={MdDelete}
                          onPress={() => removePartialDataSet(set.id)}
                          className="h-8"
                        />
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          ) : (
            paidArray && (
              <div className="flex flex-col mt-4 border rounded-lg space-y-1 px-2 py-1 divide-y">
                {paidArray
                  .sort((a, b) => b.key!.localeCompare(a.key!))
                  .map((item) => {
                    return (
                      <div
                        className="flex space-x-2 lg:space-x-3 text-xs md:text-sm"
                        key={item.key}
                      >
                        <div>{item.details.substring(0, 8)}</div>
                        <div className="flex-1">
                          {item.details.substring(8)}
                        </div>
                        <div>{formatCurrency(item.amount)}</div>
                      </div>
                    );
                  })}
              </div>
            )
          )}

          <div className="flex space-x-2 pt-4 justify-center">
            <DialogClose asChild>
              <Button label={'Close'} variant="danger" className="px-10" />
            </DialogClose>
            <Button
              type="submit"
              variant="accent"
              label={dataExists ? 'Update' : 'Add'}
              loadingLabel={dataExists ? 'Updating...' : 'Adding...'}
              className="px-10"
              loading={isSubmitting}
              disabled={!isValid || !hasChanges || isSubmitting}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
