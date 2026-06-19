'use client';

import {
  getCurrentDate,
  getDatabaseReference,
  getDatabaseReferenceExists,
  ProjectInfoForm,
  projectInfoSchema,
  updateProjectInfo,
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
import { FormCheckbox, FormInput } from '../../FormField';
import { Input } from '../../input';
import { toast } from '../../toast';
import { set, update } from 'firebase/database';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProjectInfoDialogProps } from './types';

export function ProjectInfoDialog({
  id,
  val,
  children,
}: ProjectInfoDialogProps & {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [project, setProject] = useState<string>(id ?? '');

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
    if (!id && project.length === 0) {
      toast.error('Error', 'Project Name is required.');
      return;
    }

    const key = id ?? project;

    try {
      await updateProjectInfo(key, formData);

      const balanceRef = `balance/project/${key}`;
      if (await getDatabaseReferenceExists(balanceRef))
        await update(getDatabaseReference(balanceRef), {
          cancelled: formData.cancelled ? true : undefined,
        });
      else {
        await set(getDatabaseReference(balanceRef), {
          date: getCurrentDate('dd MMM yyyy'),
          value: 0,
          cancelled: formData.cancelled ? true : undefined,
        });
      }
      setOpen(false);
      toast.success(key, 'Updated the project info successfully.');
    } catch (error: any) {
      toast.error(key, 'Failed to update the project info. Please try again.');
      console.error('Error updating project info:', error);
      return;
    }
  };

  const handleReset = () => {
    setProject('');
    reset({
      location: val?.location ?? '',
      contactName: val?.contactName ?? '',
      phone: val?.phone ?? '',
      servicing: val?.servicing ?? 0,
    });
  };

  useEffect(() => {
    if (open) handleReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={'border-accent'}>
        <DialogHeader>
          <DialogTitle>
            {id ? `${id} Project Info` : 'Add New Project'}
          </DialogTitle>
          <DialogDescription>
            {id
              ? 'Update project info'
              : 'Add new project info and in the balance list'}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          onReset={handleReset}
          className="flex flex-col space-y-3"
        >
          {!id && (
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
          <FormCheckbox<ProjectInfoForm>
            name="cancelled"
            control={control}
            label="Cancelled"
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
              label={id ? 'Update' : 'Submit'}
              loadingLabel={id ? 'Updating...' : 'Submitting...'}
              className="px-10"
              loading={isSubmitting}
              disabled={
                !isValid ||
                !isDirty ||
                isSubmitting ||
                (!id && project?.length === 0)
              }
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
