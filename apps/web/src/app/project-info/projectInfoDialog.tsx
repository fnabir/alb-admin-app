import {
  getCurrentDate,
  getDatabaseReference,
  getDatabaseReferenceExists,
  ProjectInfoForm,
  projectInfoSchema,
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
  Input,
  toast,
} from '@repo/ui';
import { DataSnapshot } from 'firebase/database';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@repo/ui';
import { set, update } from 'firebase/database';

export default function ProjectInfoDialog({
  data,
  children,
}: {
  data?: DataSnapshot;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [project, setProject] = useState<string>('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid, isDirty },
  } = useForm<ProjectInfoForm>({
    resolver: zodResolver(projectInfoSchema),
    mode: 'onChange',
    defaultValues: {
      location: '',
      contactName: '',
      phone: '',
      servicing: 0,
    },
  });

  const onSubmit = async (formData: ProjectInfoForm) => {
    if (!data && project.length === 0) {
      toast.error('Error', 'Project Name is required.');
      return;
    }

    try {
      if (data)
        await update(
          getDatabaseReference(`info/project/${data?.key!}`),
          formData,
        );
      else {
        await set(getDatabaseReference(`info/project/${project}`), formData);

        const balanceRef = `balance/project/${project}`;
        if (!(await getDatabaseReferenceExists(balanceRef)))
          await set(getDatabaseReference(balanceRef), {
            date: getCurrentDate('dd MMM yyyy'),
            value: 0,
          });
      }

      toast.success(
        data ? data.key! : project,
        'Updated the project info successfully.',
      );
    } catch (error: any) {
      toast.error(
        data ? data.key! : project,
        'Failed to update the project info. Please try again.',
      );
      return;
    }

    setOpen(false);
  };

  const handleReset = () => {
    setProject('');
    reset({
      location: data?.val().location ?? '',
      contactName: data?.val().contactName ?? '',
      phone: data?.val().phone ?? '',
      servicing: data?.val().servicing ?? 0,
    });
  };

  const handleDialogChange = (state: boolean) => {
    setOpen(state);
    if (!state) {
      setProject('');
      reset({
        location: '',
        contactName: '',
        phone: '',
        servicing: 0,
      });
    }
  };

  useEffect(() => {
    if (!open || !data) return;
    reset(data.val());
  }, [open, data, reset]);

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={'border-accent'}>
        <DialogHeader>
          <DialogTitle>
            {data ? `${data.key ?? 'Project'} Info` : 'Add New Project'}
          </DialogTitle>
          <DialogDescription>
            {data
              ? 'Update project info'
              : 'Add new project info and in the balance list'}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          onReset={handleReset}
          className="flex flex-col space-y-3"
        >
          {!data && (
            <Input
              label="Project Name"
              value={project}
              onChangeText={setProject}
              required
            />
          )}
          <FormInput<ProjectInfoForm>
            name="location"
            control={control}
            label="Location"
            disabled={isSubmitting}
          />
          <FormInput<ProjectInfoForm>
            name="contactName"
            control={control}
            label="Contact Name"
            disabled={isSubmitting}
          />
          <FormInput<ProjectInfoForm>
            name="phone"
            control={control}
            label="Phone Number"
            placeholder="01XXXXXXXXX"
            disabled={isSubmitting}
          />
          <FormInput<ProjectInfoForm>
            name="servicing"
            control={control}
            type="number"
            label="Servicing Charge"
            disabled={isSubmitting}
            startAdornment={'৳'}
          />

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
              label={data ? 'Update' : 'Submit'}
              loadingLabel={data ? 'Updating...' : 'Submitting...'}
              className="px-10"
              loading={isSubmitting}
              disabled={
                !isValid ||
                !isDirty ||
                isSubmitting ||
                (data ? false : project?.length == 0)
              }
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
