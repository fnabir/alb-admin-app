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
  Input,
  RadioGroup,
  Select,
  toast,
} from '@repo/ui';
import { useEffect, useMemo, useState } from 'react';
import { DataSnapshot } from 'firebase/database';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SelectOption } from '@repo/ui';
import { update } from 'firebase/database';
import { MdAdd, MdDelete } from 'react-icons/md';

const transactionOptions: SelectOption[] = [
  { value: '+', label: 'Expense' },
  { value: '-', label: 'Payment' },
];

const expenseOptions: SelectOption[] = [
  { value: 'Servicing', label: 'Servicing' },
  { value: 'Callback', label: 'Callback' },
  { value: 'Spare Parts', label: 'Spare Parts' },
  { value: 'Repairing', label: 'Repairing' },
  { value: 'Others', label: 'Others' },
];

const paymentOptions: SelectOption[] = [
  { value: 'Cash', label: 'Cash' },
  { value: 'Cheque', label: 'Cheque' },
  { value: 'Account Transfer', label: 'Account Transfer' },
  { value: 'Bank Transfer', label: 'Bank Transfer' },
  { value: 'CellFin', label: 'CellFin (Phone)' },
  { value: 'CellFin (Account)', label: 'CellFin (Account)' },
  { value: 'bKash', label: 'bKash' },
];

const monthOptions: SelectOption[] = [
  { value: 'January', label: 'January' },
  { value: 'February', label: 'February' },
  { value: 'March', label: 'March' },
  { value: 'April', label: 'April' },
  { value: 'May', label: 'May' },
  { value: 'June', label: 'June' },
  { value: 'July', label: 'July' },
  { value: 'August', label: 'August' },
  { value: 'September', label: 'September' },
  { value: 'October', label: 'October' },
  { value: 'November', label: 'November' },
  { value: 'December', label: 'December' },
];

const paymentTypeOptions: SelectOption[] = [
  { value: 'notPaid', label: 'Not Paid' },
  { value: 'full', label: 'Full' },
  { value: 'partial', label: 'Partial' },
];

type FullPaymentDataType = {
  key: string;
  details: string;
};

type PartialPaymentDataType = {
  id: number;
  key: string;
  details: string;
  amount: number;
};

export default function UpdateTransactionDialog({
  id,
  data,
  servicingCharge = 0,
  paidArray,
  paidDataOptions,
  children,
  total = 0,
}: {
  id: string;
  data?: DataSnapshot;
  servicingCharge?: number;
  children: React.ReactNode;
  paidArray?: any[];
  paidDataOptions?: SelectOption[];
  total?: number;
}) {
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
    if (sign == '+') {
      if (
        paymentType == 'full' &&
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
      if (paymentType == 'full') {
        paymentData = {
          [fullPaymentData.key]: {
            details: fullPaymentData.details,
            amount: formData.amount,
          },
        };
      } else if (paymentType == 'partial') {
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
          amount: formData.amount * (sign == '-' ? -1 : 1),
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

    setOpen(false);
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
      } else if (paidArray.length == 1 && total >= val.amount) {
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
    setValue('details', '');
    if (titleValue == 'Servicing') setValue('amount', servicingCharge);
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
            options={transactionOptions}
            disabled={dataExists || isSubmitting}
          />
          <FormSelect<TransactionForm>
            name="title"
            control={control}
            placeholder={
              sign == '+' ? 'Select Expense Type...' : 'Select Payment Type...'
            }
            options={sign == '+' ? expenseOptions : paymentOptions}
            disabled={isSubmitting}
          />
          {titleValue == 'Servicing' ? (
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

          {sign == '+' ? (
            <div className="flex flex-col space-y-2 pt-4">
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
                    icon={MdAdd}
                    label="Add"
                    onPress={addPartialDataSet}
                  />
                )}
              {paidDataOptions &&
                paymentType != 'notPaid' &&
                (paymentType == 'full' ? (
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
              disabled={!isValid || !isDirty || isSubmitting}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
