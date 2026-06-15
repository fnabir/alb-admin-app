import { View, ScrollView } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Dialog } from '../../dialog';
import { toast } from '../../toast';
import { useEffect } from 'react';
import { useListKeys } from 'react-firebase-hooks/database';
import { CallbackDialogProps } from './types';

export function CallbackDialog({
  project,
  val,
  id,
  open,
  onOpenChange,
}: CallbackDialogProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
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
            generateDatabaseKey(`callback/${project}`),
        {
          details: formData.details,
          name: formData.name,
          status: formData.status,
          date: fromISODate('dd.MM.yy', formData.date),
        },
      );
      onOpenChange(false);
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
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={`${dataExists ? 'Update' : 'Add New'} Callback`}
    >
      <>
        <ScrollView className="space-y-1 my-4">
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
          <View className="flex-row gap-2 justify-end mt-4">
            <Button
              label="Cancel"
              variant="secondary"
              onPress={() => onOpenChange(false)}
            />
            <Button
              label={dataExists ? 'Update' : 'Add'}
              variant="accent"
              disabled={!isValid || !isDirty}
              loading={isSubmitting}
              loadingLabel={dataExists ? 'Updating...' : 'Adding...'}
              onPress={async () => {
                handleSubmit(onSubmit)();
              }}
            />
          </View>
        </ScrollView>
      </>
    </Dialog>
  );
}
