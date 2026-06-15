'use client';

import {
  generateDatabaseKey,
  OfferForm,
  offerSchema,
  productOptions,
  workOptions,
  formStatusOptions,
  updateForm,
} from '@repo/app';
import { Button } from '../../button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../dialog';
import { toast } from '../../toast';
import { FormInput, FormSelect, FormTextarea } from '../../FormField';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { OfferFormDialogProps } from './types';

export function OfferFormDialog({
  id,
  val,
  children,
}: OfferFormDialogProps & {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const dataExists = id ? true : false;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<OfferForm>({
    resolver: zodResolver(offerSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      address: '',
      product: '',
      work: '',
      unit: 1,
      floor: '',
      person: '',
      shaft: '',
      note: '',
      refer: '',
      status: '',
    },
  });

  const onSubmit = async (formData: OfferForm) => {
    const key = id ?? generateDatabaseKey('forms/offer');
    const updatedData = dataExists
      ? formData
      : {
          ...formData,
          date: new Date().toISOString(),
        };
    try {
      await updateForm('offer', key, updatedData);
      toast.success(
        'Updated',
        dataExists ? 'Updated the offer.' : 'Added new offer.',
      );
    } catch {
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

  useEffect(() => {
    if (open) handleReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, val]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            placeholder="Select Product Type..."
            disabled={isSubmitting}
          />
          <FormSelect<OfferForm>
            name="work"
            control={control}
            options={workOptions}
            placeholder="Select Work Type..."
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
          <FormSelect
            name="status"
            control={control}
            options={formStatusOptions}
            placeholder="Select Status..."
            disabled={isSubmitting}
          />

          <div className="flex space-x-2 pt-4 lg:pt-6 justify-center">
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
              disabled={isSubmitting}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
