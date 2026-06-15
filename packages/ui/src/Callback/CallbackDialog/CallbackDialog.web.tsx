'use client';

import {
  fromISODate,
  generateDatabaseKey,
  toISODate,
  callbackSchema,
  CallbackForm,
  getDatabaseReference,
  updateCallback,
  callbackStatusOptions,
} from '@repo/app';
import { FormInput, FormSelect } from '../../FormField';
import { Button } from '../../button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../../dialog';
import { toast } from '../../toast';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useListKeys } from 'react-firebase-hooks/database';
import { CallbackDialogProps } from './types';

export function CallbackDialog({
  project,
  val,
  id,
  children,
}: CallbackDialogProps & { children: React.ReactNode }) {
  const [open, setOpen] = useState<boolean>(false);

  const projectNames = useListKeys(getDatabaseReference(`info/project`))[0];
  const projectNameOptions = projectNames
    ? projectNames.map((name) => ({
        value: name,
        label: name,
      }))
    : [];

  const dataExists = id ? true : false;
  const projectNameExists = project ? true : false;
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid, isDirty },
  } = useForm<CallbackForm>({
    resolver: zodResolver(callbackSchema),
    mode: 'onChange',
    defaultValues: {
      project: project ?? '',
      details: val?.details ?? '',
      name: val?.name ?? '',
      status: val?.status ?? '',
      date: toISODate('dd.MM.yy', val?.date ?? ''),
    },
  });

  const onSubmit = async (formData: CallbackForm) => {
    try {
      await updateCallback(
        formData.project,
        id ??
          fromISODate('yyMMdd', formData.date) +
            generateDatabaseKey(`callback/${formData.project}`),
        {
          details: formData.details,
          name: formData.name,
          status: formData.status,
          date: fromISODate('dd.MM.yy', formData.date),
        },
      );
      setOpen(false);
      toast.success(`${dataExists ? 'Updated' : 'Added'} the callback details`);
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
      project: project ?? '',
      details: val?.details ?? '',
      name: val?.name ?? '',
      status: val?.status ?? '',
      date: toISODate('dd.MM.yy', val?.date ?? ''),
    });
  };

  useEffect(() => {
    if (open) handleReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, val]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={'border-error'}>
        <DialogHeader>
          <DialogTitle>{`${val ? 'Update' : 'Add New'} Callback`}</DialogTitle>
          <DialogDescription>
            {project ?? 'Select Project Name'}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          onReset={handleReset}
          className="flex flex-col space-y-3"
        >
          <FormSelect<CallbackForm>
            name="project"
            control={control}
            placeholder="Select Project..."
            options={projectNameOptions}
            disabled={isSubmitting || projectNameExists}
          />
          <FormInput<CallbackForm>
            name="details"
            control={control}
            placeholder="Details"
            disabled={isSubmitting}
          />
          <FormInput<CallbackForm>
            name="name"
            control={control}
            placeholder="Staff Name"
            disabled={isSubmitting}
          />
          <FormInput<CallbackForm>
            name="date"
            control={control}
            type="date"
            placeholder="Date"
            disabled={dataExists || isSubmitting}
          />
          <FormSelect<CallbackForm>
            name="status"
            control={control}
            placeholder="Select Status..."
            options={callbackStatusOptions}
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
