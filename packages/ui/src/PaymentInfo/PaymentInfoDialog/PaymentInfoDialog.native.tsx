import { useListKeys } from 'react-firebase-hooks/database';
import {
  addNewPaymentInfo,
  getDatabaseReference,
  PaymentInfoForm,
  paymentInfoOptions,
  paymentInfoSchema,
} from '@repo/app';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '../../toast';
import { useEffect, useMemo } from 'react';
import { Button } from '../../button';
import { Dialog } from '../../dialog';
import { FormInput, FormSelect } from '../../FormField';
import { ScrollView, View } from 'react-native';

export function PaymentInfoDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const projectNames = useListKeys(getDatabaseReference(`balance/project`))[0];
  const projectNameOptions = projectNames
    ? projectNames.map((projectName) => ({
        label: projectName,
        value: projectName,
      }))
    : [];

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid, isDirty },
  } = useForm<PaymentInfoForm>({
    resolver: zodResolver(paymentInfoSchema),
    mode: 'onChange',
    defaultValues: {
      project: '',
      type: '',
      details: '',
    },
  });

  const onSubmit = async (data: PaymentInfoForm) => {
    if (!data) {
      toast.error('Error', 'No form data found!.');
      return;
    }

    try {
      await addNewPaymentInfo(data);
      onOpenChange(false);
      toast.success('Saved the new payment info.');
    } catch (error: any) {
      toast.error(`Failed: ${error.message}. Please try again.`);
      return;
    }
  };

  const handleReset = () => {
    reset({
      project: '',
      type: '',
      details: '',
    });
  };

  useEffect(() => {
    if (!open) {
      handleReset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const typeValue = useWatch({
    control,
    name: 'type',
  });

  const projectValue = useWatch({
    control,
    name: 'project',
  });

  const detailsLabel = useMemo(() => {
    switch (typeValue) {
      case 'account':
      case 'cellAccount':
        return 'Account Number (last 8 digits only)';
      case 'bank':
      case 'cheque':
        return 'Bank Name, Branch';
      case 'bKash':
      case 'cell':
        return 'Phone Number';
      default:
        return 'Details';
    }
  }, [typeValue]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Add Payment Info">
      <ScrollView className="gap-2">
        <FormSelect
          name="project"
          control={control}
          placeholder="Select Project Name..."
          options={projectNameOptions}
          disabled={isSubmitting}
        />
        {projectValue !== '' && (
          <FormSelect
            name="type"
            control={control}
            placeholder="Select Payment Type..."
            options={paymentInfoOptions}
            disabled={isSubmitting}
          />
        )}
        {projectValue !== '' && typeValue !== 'cash' && typeValue !== '' && (
          <FormInput
            name="details"
            control={control}
            placeholder={detailsLabel}
            disabled={isSubmitting || typeValue === 'cash'}
          />
        )}
      </ScrollView>
      <View className="flex-row gap-2 justify-center mt-8">
        <Button
          label="Cancel"
          variant="secondary"
          onPress={() => onOpenChange(false)}
        />
        <Button
          label="Add"
          variant="accent"
          disabled={isSubmitting || !isValid || !isDirty}
          loading={isSubmitting}
          loadingLabel="Adding..."
          onPress={async () => {
            handleSubmit(onSubmit)();
          }}
        />
      </View>
    </Dialog>
  );
}
