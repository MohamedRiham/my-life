import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';

import { useAppColors } from '@/hooks/useAppColors';
import { createAppButtonStyles } from './styles';

type AppButtonProps = PressableProps & {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
};

export function AppButton({
  title,
  loading = false,
  variant = 'primary',
  disabled,
  style,
  ...props
}: AppButtonProps) {
  const colors = useAppColors();
  const styles = createAppButtonStyles(colors);
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={(state) => [
        styles.button,
        styles[variant],
        (state.pressed || isDisabled) && styles.dimmed,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.primaryText : colors.primary} />
      ) : (
        <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
      )}
    </Pressable>
  );
}
