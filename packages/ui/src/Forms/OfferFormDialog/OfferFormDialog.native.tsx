import { View, ScrollView, Text } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  generateDatabaseKey,
  updateForm,
  OfferForm,
  offerSchema,
  workOptions,
  productOptions,
  formStatusOptions,
} from '@repo/app';
import { FormInput, FormSelect, FormTextarea } from '../../FormField';
import { Button } from '../../button';
import { Dialog } from '../../dialog';
import { toast } from '../../toast';
import { OfferFormDialogProps } from './types';
import { useEffect } from 'react';

export function OfferFormDialog({
  val,
  id,
  open,
  onOpenChange,
}: OfferFormDialogProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const dataExists = id ? true : false;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid, isDirty },
  } = useForm<OfferForm>({
    resolver: zodResolver(offerSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      address: '',
      product: '',
      work: '',
      unit: 1,
      floor: '',
      person: '',
      shaft: '',
      note: '',
      refer: '',
      status: '',
    },
  });

  const onSubmit = async (formData: OfferForm) => {
    const key = id ?? generateDatabaseKey('forms/offer');
    const updatedData = dataExists
      ? formData
      : {
          ...formData,
          date: new Date().toISOString(),
        };
    try {
      await updateForm('offer', key, updatedData);
      onOpenChange(false);
      toast.success(
        'Updated',
        dataExists ? 'Updated the offer.' : 'Added new offer.',
      );
    } catch {
      toast.error(
        `Failed to ${dataExists ? 'update' : 'add'} the offer.`,
        'Please try again.',
      );
      return;
    }
  };

  const handleReset = () => {
    reset({
      name: val?.name ?? '',
      address: val?.address ?? '',
      product: val?.product ?? '',
      work: val?.work ?? '',
      unit: val?.unit ?? 1,
      floor: val?.floor ?? '',
      person: val?.person ?? '',
      shaft: val?.shaft ?? '',
      note: val?.note ?? '',
      refer: val?.refer ?? '',
      status: val?.status ?? '',
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
      title={`${dataExists ? 'Update' : 'Add New'} Offer`}
    >
      <>
        {dataExists && <Text className="text-primary -mt-4">{val?.name}</Text>}
        <ScrollView className="my-4">
          <FormInput<OfferForm>
            name="name"
            control={control}
            placeholder="Name"
            disabled={isSubmitting}
          />
          <FormInput<OfferForm>
            name="address"
            control={control}
            placeholder="Address"
            disabled={isSubmitting}
            className="mt-2"
          />
          <FormSelect<OfferForm>
            name="product"
            control={control}
            options={productOptions}
            placeholder="Select Product Type..."
            disabled={isSubmitting}
            className="mt-2"
          />
          <FormSelect<OfferForm>
            name="work"
            control={control}
            options={workOptions}
            placeholder="Select Work Type..."
            disabled={isSubmitting}
            className="mt-2"
          />
          <View className="flex-row gap-2 mt-2">
            <FormInput<OfferForm>
              name="person"
              control={control}
              label="Person/Load"
              disabled={isSubmitting}
              className="flex-[0.5]"
            />
            <FormInput<OfferForm>
              name="floor"
              control={control}
              label="Floor/Stop"
              disabled={isSubmitting}
              className="flex-[0.5]"
            />
          </View>
          <View className="flex-row gap-2 mt-2">
            <FormInput<OfferForm>
              name="unit"
              control={control}
              type="number"
              label="Unit"
              disabled={isSubmitting}
              className="flex-[0.3]"
            />
            <FormInput<OfferForm>
              name="shaft"
              control={control}
              label="Shaft Size (W X D X H)"
              disabled={isSubmitting}
              className="flex-[0.7]"
            />
          </View>
          <FormSelect<OfferForm>
            name="status"
            control={control}
            options={formStatusOptions}
            placeholder="Select Status..."
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
