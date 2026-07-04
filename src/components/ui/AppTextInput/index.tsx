import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, TextInput, type TextInputProps, View } from 'react-native';

import { useAppColors } from '@/hooks/useAppColors';
import { createAppTextInputStyles } from './styles';

type AppTextInputProps = TextInputProps & {
  label: string;
};

export function AppTextInput({
  label,
  style,
  placeholderTextColor,
  secureTextEntry,
  ...props
}: AppTextInputProps) {
  const colors = useAppColors();
  const styles = createAppTextInputStyles(colors);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const shouldShowPasswordToggle = Boolean(secureTextEntry);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          placeholderTextColor={placeholderTextColor ?? colors.mutedText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          style={[
            styles.input,
            shouldShowPasswordToggle && styles.inputWithToggle,
            props.multiline && styles.multiline,
            style,
          ]}
          {...props}
        />
        {shouldShowPasswordToggle ? (
          <Pressable
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
            accessibilityRole="button"
            onPress={() => setIsPasswordVisible((currentValue) => !currentValue)}
            style={styles.passwordToggle}
          >
            <Ionicons
              color={colors.primary}
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={22}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
