import { Text, TextInput, View, Pressable } from 'react-native';
import { InputProps } from './types';
import { inputStyles } from './styles';
import { useState } from 'react';

export function Input(props: InputProps) {
  const {
    value,
    onChangeText,
    onBlur,
    label,
    placeholder,
    helperText,
    error,
    secureTextEntry,
    disabled,
    startAdornment,
    endAdornment,
    className = '',
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`${inputStyles.container} ${className}`}>
      {label && <Text className={inputStyles.label}>{label}</Text>}

      <View
        className={`
          ${inputStyles.fieldWrapper}
          ${error ? 'border-red-500' : 'border-border'}
          ${disabled ? 'opacity-50' : ''}
        `}
      >
        {startAdornment}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry && !showPassword}
          editable={!disabled}
          className={inputStyles.field}
        />

        {secureTextEntry && (
          <Pressable onPress={() => setShowPassword((p) => !p)}>
            <Text className="text-muted">{showPassword ? 'Hide' : 'Show'}</Text>
          </Pressable>
        )}

        {endAdornment}
      </View>

      {error ? (
        <Text className={inputStyles.error}>{error}</Text>
      ) : (
        helperText && <Text className={inputStyles.helper}>{helperText}</Text>
      )}
    </View>
  );
}
