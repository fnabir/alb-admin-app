import {
  addNewPaymentInfo,
  getDatabaseReference,
  PaymentInfoForm,
  paymentInfoSchema,
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
  toast,
  FormSelect,
} from '@repo/ui';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useListKeys } from 'react-firebase-hooks/database';
import { MdAdd } from 'react-icons/md';
import { SelectOption } from '@repo/ui/src/select/types';

export const paymentInfoOptions: SelectOption[] = [
  { value: 'account', label: 'Account Transfer' },
  { value: 'bank', label: 'Bank Transfer' },
  { value: 'bKash', label: 'bKash' },
  { value: 'cash', label: 'Cash' },
  { value: 'cell', label: 'CellFin (Phone)' },
  { value: 'cellAccount', label: 'CellFin (Account)' },
  { value: 'cheque', label: 'Cheque' },
];

export default function AddPaymentInfoDialog() {
  const [open, setOpen] = useState<boolean>(false);
  const [detailsLabel, setDetailsLabel] = useState<string>('Details');

  const projectNames = useListKeys(getDatabaseReference(`balance/project`))[0];
  const projectNameOptions = projectNames
    ? projectNames.map((projectName) => ({
        label: projectName,
        value: projectName,
      }))
    : [];

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<PaymentInfoForm>({
    resolver: zodResolver(paymentInfoSchema),
    mode: 'onChange',
    defaultValues: {
      project: '',
      type: '',
      details: '',
    },
  });

  const onSubmit = async (data: PaymentInfoForm) => {
    if (!data) {
      toast.error('Error', 'No form data found!.');
      return;
    }

    try {
      await addNewPaymentInfo(data);
      setOpen(false);
      toast.success('Saved the new payment info.');
    } catch (error: any) {
      toast.error(`Failed: ${error.message}. Please try again.`);
      return;
    }
  };

  const handleReset = () => {
    reset({
      project: '',
      type: '',
      details: '',
    });
  };

  const handleDialogChange = (state: boolean) => {
    setOpen(state);
    if (!state) {
      handleReset();
    }
  };

  const typeValue = watch('type');
  const projectValue = watch('project');
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    switch (typeValue) {
      case 'account':
      case 'cellAccount':
        setDetailsLabel('Account Number (last 8 digits only)');
        setValue('details', '');
        break;
      case 'bank':
      case 'cheque':
        setDetailsLabel('Bank Name, Branch');
        setValue('details', '');
        break;
      case 'bKash':
      case 'cell':
        setDetailsLabel('Phone Number');
        setValue('details', '');
        break;
      case 'cash':
        setDetailsLabel('Details');
        setValue('details', projectValue || '');
        break;
      default:
        setDetailsLabel('Details');
        setValue('details', '');
        break;
    }
  }, [typeValue, projectValue, setValue]);

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button
          label="Add Payment Info"
          icon={MdAdd}
          ariaLabel="Add Payment Info dialog button"
        />
      </DialogTrigger>
      <DialogContent className={'border-accent'}>
        <DialogHeader>
          <DialogTitle>Add New Payment Info</DialogTitle>
          <DialogDescription>
            Add the payment type uses by a project
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          onReset={handleReset}
          className="flex flex-col space-y-3"
        >
          <FormSelect
            name="project"
            control={control}
            label="Project Name"
            options={projectNameOptions}
            disabled={isSubmitting}
          />
          {projectValue !== '' && (
            <FormSelect
              name="type"
              control={control}
              label="Payment Type"
              options={paymentInfoOptions}
              disabled={isSubmitting}
            />
          )}
          {projectValue !== '' && typeValue != 'cash' && typeValue != '' && (
            <FormInput
              name="details"
              control={control}
              label={detailsLabel}
              disabled={isSubmitting || typeValue === 'cash'}
            />
          )}
          <div className="flex space-x-2 pt-6 justify-center">
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
              label="Submit"
              loadingLabel="Submitting..."
              className="px-10"
              loading={isSubmitting}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
