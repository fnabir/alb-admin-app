import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { Text, View } from 'react-native';
import { Textarea } from '../../textarea';

type FormTextareaProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export function FormTextarea<T extends FieldValues>({
  name,
  control,
  label,
  helperText,
  placeholder,
  disabled,
  className,
}: FormTextareaProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <View className={`gap-1 ${className ?? ''}`}>
      {label && (
        <Text className="text-sm text-primary font-medium">{label}</Text>
      )}

      <Textarea
        value={field.value}
        onChangeText={field.onChange}
        onBlur={field.onBlur}
        placeholder={placeholder}
        editable={!disabled}
        error={!!error}
      />

      {error ? (
        <Text className="text-sm text-error">{error.message}</Text>
      ) : (
        helperText && <Text className="text-sm text-muted">{helperText}</Text>
      )}
    </View>
  );
}
