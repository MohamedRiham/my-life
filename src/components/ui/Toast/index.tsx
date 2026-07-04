import { Text, View } from 'react-native';

import { useAppColors } from '@/hooks/useAppColors';
import { createToastStyles } from './styles';

export type ToastVariant = 'error' | 'success' | 'info';

type ToastProps = {
  message: string;
  variant: ToastVariant;
};

export function Toast({ message, variant }: ToastProps) {
  const colors = useAppColors();
  const styles = createToastStyles(colors);

  return (
    <View style={[styles.container, styles[variant]]}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}
