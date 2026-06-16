import { InventoryForm, inventorySchema, setInventoryItem } from '@repo/app';
import { InventoryDialogProps } from './types';
import { toast } from '../../toast';
import { Dialog } from '../../dialog';
import { Button } from '../../button';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormInput } from '../../FormField';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollView, Text, View } from 'react-native';

export function InventoryDialog({
  item,
  count = 0,
  open,
  onOpenChange,
}: InventoryDialogProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const itemExists = item ? true : false;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid, isDirty },
  } = useForm<InventoryForm>({
    resolver: zodResolver(inventorySchema),
    mode: 'onChange',
    defaultValues: {
      item: item ?? '',
      count: count,
    },
  });

  const onSubmit = async (formData: InventoryForm) => {
    try {
      await setInventoryItem(formData.item, formData.count);
      onOpenChange(false);
      toast.success(
        itemExists
          ? `Updated the number of ${formData.item}.`
          : `Added ${formData.item}.`,
      );
    } catch {
      toast.error(
        itemExists
          ? `Failed to update the number of ${formData.item}.`
          : `Failed to add ${formData.item}.`,
        'Please try again.',
      );
      return;
    }
  };

  const handleReset = () => {
    reset({
      item: item ?? '',
      count: count ?? 0,
    });
  };

  useEffect(() => {
    if (open) {
      handleReset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, item, count]);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={`${itemExists ? 'Update' : 'Add New'} Inventory Item`}
    >
      <>
        {itemExists && <Text className="text-primary -mt-4">{item}</Text>}
        <ScrollView className="gap-2">
          <FormInput<InventoryForm>
            name="item"
            control={control}
            label="Name"
            disabled={itemExists || isSubmitting}
          />
          <FormInput<InventoryForm>
            name="count"
            control={control}
            type="number"
            label="Count"
            disabled={isSubmitting}
          />
        </ScrollView>
        <View className="flex-row gap-2 justify-center mt-8">
          <Button
            label="Cancel"
            variant="secondary"
            onPress={() => onOpenChange(false)}
          />
          <Button
            label={itemExists ? 'Update' : 'Add'}
            variant="accent"
            disabled={!isValid || !isDirty}
            loading={isSubmitting}
            loadingLabel={itemExists ? 'Updating...' : 'Adding...'}
            onPress={async () => {
              handleSubmit(onSubmit)();
            }}
          />
        </View>
      </>
    </Dialog>
  );
}
