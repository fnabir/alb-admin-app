import {
  generateDatabaseKey,
  OfferForm,
  offerSchema,
  updateForm,
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
  FormSelect,
  FormTextarea,
  toast,
} from '@repo/ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@repo/ui';
import { DataSnapshot } from 'firebase/database';
import { SelectOption } from '@repo/ui/src/select/types';

export const productOptions: SelectOption[] = [
  { value: 'Passenger Lift', label: 'Passenger Lift' },
  { value: 'Cargo Lift', label: 'Cargo Lift' },
  { value: 'Hospital Lift', label: 'Hospital Lift' },
  { value: 'Capsule Lift', label: 'Capsule Lift' },
  { value: 'Escalator', label: 'Escalator' },
  { value: 'Dumbwaiter', label: 'Dumbwaiter' },
  { value: 'Generator', label: 'Generator' },
  { value: 'Other', label: 'Other' },
];

export const workOptions: SelectOption[] = [
  { value: 'Full Project', label: 'Full Project' },
  { value: 'Servicing', label: 'Servicing' },
  { value: 'Installation', label: 'Installation' },
  { value: 'Repair', label: 'Repair' },
];

export default function OfferFormDialog({
  data,
  children,
}: {
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
  } = useForm<OfferForm>({
    resolver: zodResolver(offerSchema),
    mode: 'onChange',
  });

  const onSubmit = async (formData: OfferForm) => {
    const key = dataExists ? data?.key! : generateDatabaseKey('forms/offer');
    try {
      await updateForm('offer', key, formData);
      toast.success(
        'Updated',
        dataExists ? 'Updated the offer.' : 'Added new offer.',
      );
    } catch (error: any) {
      toast.error(
        `Failed to ${dataExists ? 'update' : 'add'} the offer.`,
        'Please try again.',
      );
      return;
    }

    setOpen(false);
  };

  const handleReset = () => {
    reset({
      name: val?.name ?? '',
      address: val?.address ?? '',
      product: val?.product ?? '',
      work: val?.work ?? '',
      unit: val?.unit ?? 1,
      floor: val?.floor ?? '',
      person: val?.person ?? '',
      shaft: val?.shaft ?? '',
      note: val?.note ?? '',
      refer: val?.refer ?? '',
      status: val?.status ?? '',
    });
  };

  const handleDialogChange = (state: boolean) => {
    setOpen(state);
    handleReset();
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={'border-accent'}>
        <DialogHeader>
          <DialogTitle>{dataExists ? 'Update' : 'Add New'} Offer</DialogTitle>
          <DialogDescription>
            {val?.name ?? 'Add a project or personal name'}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          onReset={handleReset}
          className="flex flex-col space-y-3"
        >
          <FormInput<OfferForm>
            name="name"
            control={control}
            placeholder="Name"
            disabled={isSubmitting}
          />
          <FormInput<OfferForm>
            name="address"
            control={control}
            placeholder="Address"
            disabled={isSubmitting}
          />
          <FormSelect<OfferForm>
            name="product"
            control={control}
            options={productOptions}
            placeholder="Select Product Type"
            disabled={isSubmitting}
          />
          <FormSelect<OfferForm>
            name="work"
            control={control}
            options={workOptions}
            placeholder="Select Work Type"
            disabled={isSubmitting}
          />
          <div className="flex space-x-2">
            <FormInput<OfferForm>
              name="person"
              control={control}
              label="Person/Load"
              disabled={isSubmitting}
            />
            <FormInput<OfferForm>
              name="floor"
              control={control}
              label="Floor/Stop"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex space-x-2">
            <FormInput<OfferForm>
              name="unit"
              control={control}
              type="number"
              label="Unit"
              disabled={isSubmitting}
              className="flex-[0.3]"
            />
            <FormInput<OfferForm>
              name="shaft"
              control={control}
              label="Shaft Size (W X D X H)"
              disabled={isSubmitting}
              className="flex-[0.7]"
            />
          </div>
          <FormTextarea<OfferForm>
            name="note"
            control={control}
            placeholder="Note"
            disabled={isSubmitting}
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
