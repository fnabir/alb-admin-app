import {
  fromISODate,
  generateDatabaseKey,
  toISODate,
  callbackSchema,
  CallbackForm,
  getDatabaseReference,
  updateCallback,
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
  toast,
} from '@repo/ui';
import { useState } from 'react';
import { DataSnapshot } from 'firebase/database';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SelectOption } from '@repo/ui';
import { useListKeys } from 'react-firebase-hooks/database';

const statusOptions: SelectOption[] = [
  { value: 'New', label: 'New' },
  { value: 'Assigned', label: 'Assigned' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Fixed', label: 'Fixed' },
  { value: 'Cannot be fixed', label: 'Cannot be fixed' },
];

export default function UpdateCallbackDialog({
  project,
  data,
  children,
}: {
  project?: string;
  data?: DataSnapshot;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);

  const projectNames = useListKeys(getDatabaseReference(`info/project`))[0];
  const projectNameOptions = projectNames
    ? projectNames.map((name) => ({
        value: name,
        label: name,
      }))
    : [];

  const dataExists = data ? true : false;
  const projectNameExists = project ? true : false;
  const val = data?.val();
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
        data
          ? data.key!
          : fromISODate('yyMMdd', formData.date) +
              generateDatabaseKey(`callback/${project}`),
        {
          details: formData.details,
          name: formData.name,
          status: formData.status,
          date: fromISODate('dd.MM.yy', formData.date),
        },
      );
      console.log(formData);
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
      project: project ?? '',
      details: val?.details ?? '',
      name: val?.name ?? '',
      status: val?.status ?? '',
      date: toISODate('dd.MM.yy', val?.date ?? ''),
    });
  };

  const handleDialogChange = (state: boolean) => {
    setOpen(state);
    handleReset();
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={'border-error'}>
        <DialogHeader>
          <DialogTitle>{`${data ? 'Update' : 'Add New'} Callback`}</DialogTitle>
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
            options={statusOptions}
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
