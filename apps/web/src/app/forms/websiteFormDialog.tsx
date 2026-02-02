import { updateForm, WebsiteForm, websiteSchema } from '@repo/app';
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
import { DataSnapshot } from 'firebase/database';
import { statusOptions } from './offerFormDialog';

export default function WebsiteFormDialog({
  type,
  data,
  children,
}: {
  type: 'contact' | 'quote';
  data: DataSnapshot;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);

  const val = data?.val();

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
      await updateForm(type, data.key!, formData);
      toast.success('Updated', `Updated the ${type}.`);
    } catch (error: any) {
      toast.error(`Failed to update ${type}.`, 'Please try again.');
      return;
    }

    setOpen(false);
  };

  const handleReset = () => {
    reset({
      note: val?.note ?? '',
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
          <DialogTitle>Update {type}</DialogTitle>
          <DialogDescription>{val?.name}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          onReset={handleReset}
          className="flex flex-col space-y-3"
        >
          {val?.name && <p>Name: {val.name}</p>}
          {val?.address && <p>Address: {val.address}</p>}
          {val?.product && <p>Product: {val.product}</p>}
          {val?.Work && <p>Work: {val.work}</p>}
          {val?.person && <p>Person/Load: {val.person}</p>}
          {val?.floor && <p>Floor/Stop: {val.floor}</p>}
          {val?.unit && <p>Unit: {val.unit}</p>}
          {val?.shaft && <p>Shaft Size (W X D X H): {val.unit}</p>}

          <FormTextarea<WebsiteForm>
            name="note"
            control={control}
            placeholder="Note"
            disabled={isSubmitting}
          />
          <FormSelect name="status" control={control} options={statusOptions} />
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
