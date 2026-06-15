import { View, ScrollView, Text } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  updateForm,
  formStatusOptions,
  WebsiteForm,
  websiteSchema,
} from '@repo/app';
import { FormSelect, FormTextarea } from '../../FormField';
import { Button } from '../../button';
import { Dialog } from '../../dialog';
import { toast } from '../../toast';
import { useEffect } from 'react';
import { WebsiteFormDialogProps } from './types';

export function WebsiteFormDialog({
  type,
  val,
  id,
  open,
  onOpenChange,
}: WebsiteFormDialogProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
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
      onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange} title={`Update ${type}`}>
      <>
        <Text className="text-primary -mt-4">{val?.name}</Text>
        <ScrollView className="my-4">
          {val.name && <Text className="text-primary">Name: {val.name}</Text>}
          {type === 'contact' ? (
            <>
              {val.email && (
                <Text className="text-primary">Email: {val.email}</Text>
              )}
              {val.phone && (
                <Text className="text-primary">Phone: {val.phone}</Text>
              )}
              {val.subject && (
                <Text className="text-primary">Subject: {val.subject}</Text>
              )}
            </>
          ) : (
            <>
              {val.address && (
                <Text className="text-primary">Address: {val.address}</Text>
              )}
              {val.product && (
                <Text className="text-primary">
                  Product: {val.product} {val.unit ? `(${val.unit})` : ''}{' '}
                  {val.work ? `| Work: ${val.work}` : ''}
                </Text>
              )}
              {(val.person || val.floor) && (
                <Text className="text-primary">
                  {val.person ? `Person/Load: ${val.floor}` : ''}{' '}
                  {val.floor
                    ? `${val.person ? `|` : ''} Floor/Stop: ${val.floor}`
                    : ''}
                </Text>
              )}
              {val.shaft && (
                <Text className="text-primary">
                  Shaft Size (W X D X H): {val.unit}
                </Text>
              )}
            </>
          )}
          <FormTextarea<WebsiteForm>
            name="note"
            control={control}
            placeholder="Note"
            disabled={isSubmitting}
            className="mt-2"
          />
          <FormSelect<WebsiteForm>
            name="status"
            control={control}
            placeholder="Select Status..."
            options={formStatusOptions}
            disabled={isSubmitting}
            className="mt-2"
          />
          <View className="flex-row gap-2 justify-end mt-4">
            <Button
              label="Cancel"
              variant="secondary"
              onPress={() => onOpenChange(false)}
            />
            <Button
              type="submit"
              variant="accent"
              label={'Update'}
              loadingLabel={'Updating...'}
              className="px-10"
              loading={isSubmitting}
              disabled={!isValid || !isDirty || isSubmitting}
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
