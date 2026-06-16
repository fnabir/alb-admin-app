'use client';

import { InventoryForm, inventorySchema, setInventoryItem } from '@repo/app';
import { InventoryDialogProps } from './types';
import { toast } from '../../toast';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../dialog';
import { Button } from '../../button';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormInput } from '../../FormField';
import { zodResolver } from '@hookform/resolvers/zod';

export function InventoryDialog({
  item,
  count = 0,
  children,
}: InventoryDialogProps & {
  children: React.ReactNode;
}) {
  const itemExists = item ? true : false;
  const [open, setOpen] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid, isDirty },
  } = useForm<InventoryForm>({
    resolver: zodResolver(inventorySchema),
    mode: 'onChange',
    defaultValues: {
      item: item ?? '',
      count: count,
    },
  });

  const onSubmit = async (formData: InventoryForm) => {
    try {
      await setInventoryItem(formData.item, formData.count);
      setOpen(false);
      toast.success(
        itemExists
          ? `Updated the number of ${formData.item}.`
          : `Added ${formData.item}.`,
      );
    } catch {
      toast.error(
        itemExists
          ? `Failed to update the number of ${formData.item}.`
          : `Failed to add ${formData.item}.`,
        'Please try again.',
      );
      return;
    }
  };

  const handleReset = () => {
    reset({
      item: item ?? '',
      count: count ?? 0,
    });
  };

  useEffect(() => {
    if (open) {
      handleReset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, item, count]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={'border-accent'}>
        <DialogHeader>
          <DialogTitle>{item ?? 'Add New Item'}</DialogTitle>
          <DialogDescription>
            {item
              ? `Update the number of ${item.toLowerCase()} in the inventory`
              : 'Add the number of the new item in the inventory'}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          onReset={handleReset}
          className="flex flex-col space-y-3"
        >
          <FormInput<InventoryForm>
            name="item"
            control={control}
            label="Name"
            disabled={itemExists || isSubmitting}
          />
          <FormInput<InventoryForm>
            name="count"
            control={control}
            type="number"
            label="Count"
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
              label={itemExists ? 'Update' : 'Add'}
              loadingLabel={itemExists ? 'Updating...' : 'Adding...'}
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
