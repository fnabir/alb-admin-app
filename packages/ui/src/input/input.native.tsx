import { useState } from 'react';
import { Text, TextInput, View, Pressable, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedIcon } from '../../../../apps/mobile/src/components/ThemedIcon';

export type InputType = 'text' | 'number' | 'password' | 'date';

export type InputProps = {
  value?: string;
  onChangeText?: (value: string) => void;
  onBlur?: () => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  type?: InputType;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  returnKeyType?: 'next' | 'done';
  className?: string;
};

export function Input({
  value = '',
  onChangeText,
  onBlur,
  label,
  placeholder,
  helperText,
  error,
  disabled = false,
  type = 'text',
  startAdornment,
  endAdornment,
  className = '',
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? 'border-error'
    : focused
      ? 'border-accent'
      : 'border-muted';

  const parseDate = (str: string): Date => {
    if (!str) return new Date();
    const [yyyy, mm, dd] = str.split('-'); // ← yyyy-MM-dd
    if (!yyyy || !mm || !dd) return new Date();
    return new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
  };

  const formatDate = (date: Date): string => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`; // ← yyyy-MM-dd to match schema
  };

  const displayDate = (str: string): string => {
    if (!str) return '';
    const [yyyy, mm, dd] = str.split('-');
    if (!yyyy || !mm || !dd) return str;
    return `${dd}.${mm}.${yyyy}`; // ← dd.MM.yyyy for the user
  };

  const isPassword = type === 'password';
  const isNumeric = type === 'number';
  const isDate = type === 'date';

  return (
    <View className={`gap-1 ${className}`}>
      {label && (
        <Text className="text-sm text-primary font-medium">{label}</Text>
      )}

      {/* Date type — pressable that opens DateTimePicker */}
      {isDate ? (
        <>
          <Pressable
            onPress={() => {
              if (!disabled) {
                setFocused(true);
                if (!showDatePicker && !value)
                  onChangeText?.(formatDate(new Date()));
                setShowDatePicker(!showDatePicker);
              }
            }}
            className={`
              flex-row items-center border rounded-lg px-3 py-3 bg-background
              ${borderColor}
              ${disabled ? 'opacity-50' : ''}
            `}
          >
            {startAdornment}
            <Text
              className={`flex-1 text-base ${value ? 'text-primary' : 'text-muted'}`}
            >
              {displayDate(value) || placeholder || 'Select date'}
            </Text>
            <ThemedIcon name="calendar" size={20} />
            {endAdornment}
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={parseDate(value)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                setFocused(true);
                if (selectedDate) {
                  onChangeText?.(formatDate(selectedDate));
                }
                if (Platform.OS !== 'ios') onBlur?.();
              }}
            />
          )}
        </>
      ) : (
        /* Text / Number / Password */
        <View
          className={`
            flex-row items-center border rounded-lg px-2 bg-background
            ${borderColor}
            ${disabled ? 'opacity-50' : ''}
          `}
        >
          {startAdornment && (
            <Text className="text-primary text-base mr-1">
              {startAdornment}
            </Text>
          )}

          <TextInput
            value={String(value ?? '')}
            onChangeText={(text) => {
              if (isNumeric) {
                // Strip non-numeric except decimal point
                const cleaned = text.replace(/[^0-9.]/g, '');
                onChangeText?.(cleaned);
              } else {
                onChangeText?.(text);
              }
            }}
            onBlur={() => {
              setFocused(false);
              onBlur?.();
            }}
            onFocus={() => setFocused(true)}
            placeholder={placeholder}
            placeholderTextColor="#9ca3af"
            secureTextEntry={isPassword && !showPassword}
            editable={!disabled}
            keyboardType={isNumeric ? 'decimal-pad' : 'default'}
            className="flex-1 text-primary h-11"
          />

          {isPassword && (
            <Pressable
              onPress={() => setShowPassword((p) => !p)}
              className="ml-2"
            >
              <Text className="text-muted text-sm">
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </Pressable>
          )}

          {endAdornment}
        </View>
      )}

      {helperText || error ? (
        <Text className={`text-sm text-${error ? 'error' : 'muted'}`}>
          {error ?? helperText}
        </Text>
      ) : null}
    </View>
  );
}
