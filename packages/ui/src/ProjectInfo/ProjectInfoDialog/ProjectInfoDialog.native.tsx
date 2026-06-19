import { ProjectInfoDialogProps } from './types';
import { FormCheckbox, FormInput } from '../../FormField';
import { useEffect, useState } from 'react';
import { toast } from '../../toast';
import {
  getCurrentDate,
  getDatabaseReference,
  getDatabaseReferenceExists,
  ProjectInfoForm,
  projectInfoSchema,
  updateProjectInfo,
} from '@repo/app';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { set, update } from 'firebase/database';
import { Dialog } from '../../dialog';
import { ScrollView, Text, View } from 'react-native';
import { Input } from '../../input';
import { Button } from '../../button';

export function ProjectInfoDialog({
  id,
  val,
  open,
  onOpenChange,
}: ProjectInfoDialogProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
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
      onOpenChange(false);
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
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={id ? 'Update Project Info' : 'Add New Project'}
    >
      {id && <Text className="text-primary -mt-4">{id}</Text>}
      <ScrollView className="my-4">
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
          className="mt-2"
        />
        <FormInput<ProjectInfoForm>
          name="contactName"
          control={control}
          label="Contact Name"
          disabled={isSubmitting}
          className="mt-2"
        />
        <FormInput<ProjectInfoForm>
          name="phone"
          control={control}
          label="Phone Number"
          placeholder="01XXXXXXXXX"
          disabled={isSubmitting}
          className="mt-2"
        />
        <FormInput<ProjectInfoForm>
          name="servicing"
          control={control}
          type="number"
          label="Servicing Charge"
          disabled={isSubmitting}
          startAdornment={'৳'}
          className="mt-2"
        />
        <FormCheckbox<ProjectInfoForm>
          name="cancelled"
          control={control}
          label="Cancelled"
          disabled={isSubmitting}
          className="mt-2"
        />
      </ScrollView>
      <View className="flex-row gap-2 justify-center mt-4">
        <Button
          label="Cancel"
          variant="secondary"
          onPress={() => onOpenChange(false)}
        />
        <Button
          label={id ? 'Update' : 'Add'}
          variant="accent"
          disabled={!isValid || !isDirty}
          loading={isSubmitting}
          loadingLabel={id ? 'Updating...' : 'Adding...'}
          onPress={async () => {
            handleSubmit(onSubmit)();
          }}
        />
      </View>
    </Dialog>
  );
}
