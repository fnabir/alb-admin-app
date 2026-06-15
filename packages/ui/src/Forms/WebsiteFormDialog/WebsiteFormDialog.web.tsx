'use client';

import {
  updateForm,
  WebsiteForm,
  websiteSchema,
  formStatusOptions,
  FormVal,
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
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { WebsiteFormDialogProps } from './types';

export function WebsiteFormDialog({
  type,
  id,
  val,
  children,
}: WebsiteFormDialogProps & {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid, isDirty },
  } = useForm<WebsiteForm>({
    resolver: zodResolver(websiteSchema),
    mode: 'onChange',
  });

  const onSubmit = async (formData: WebsiteForm) => {
    try {
      await updateForm(type, id, formData);
      setOpen(false);
      toast.success('Updated', `Updated the ${type}.`);
    } catch {
      toast.error(`Failed to update ${type}.`, 'Please try again.');
      return;
    }
  };

  const handleReset = () => {
    reset({
      note: val?.note ?? '',
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
          <DialogTitle>Update {type}</DialogTitle>
          <DialogDescription>{val?.name}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} onReset={handleReset}>
          {val.name && <p>Name: {val.name}</p>}
          {type === 'contact' ? (
            <>
              {val.email && <p>Email: {val.email}</p>}
              {val.phone && <p>Phone: {val.phone}</p>}
              {val.subject && <p>Subject: {val.subject}</p>}
            </>
          ) : (
            <>
              {val.address && <p>Address: {val.address}</p>}
              {val.product && (
                <p>
                  Product: {val.product} {val.unit ? `(${val.unit})` : ''}{' '}
                  {val.work ? `| Work: ${val.work}` : ''}
                </p>
              )}
              {(val.person || val.floor) && (
                <p>
                  {val.person ? `Person/Load: ${val.floor}` : ''}{' '}
                  {val.floor
                    ? `${val.person ? `|` : ''} Floor/Stop: ${val.floor}`
                    : ''}
                </p>
              )}
              {val.shaft && <p>Shaft Size (W X D X H): {val.unit}</p>}
            </>
          )}

          <div className="flex flex-col space-y-2 mt-4">
            <FormTextarea<WebsiteForm>
              name="note"
              control={control}
              placeholder="Note"
              disabled={isSubmitting}
            />
            <FormSelect<WebsiteForm>
              name="status"
              control={control}
              placeholder="Select Status..."
              options={formStatusOptions}
              disabled={isSubmitting}
            />
          </div>
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
              label={'Update'}
              loadingLabel={'Updating...'}
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
