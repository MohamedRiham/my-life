import { type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { useAppColors } from '@/hooks/useAppColors';
import { createAppScreenStyles } from './styles';

type AppScreenProps = {
  children: ReactNode;
  scroll?: boolean;
};

export function AppScreen({ children, scroll = true }: AppScreenProps) {
  const colors = useAppColors();
  const styles = createAppScreenStyles(colors);
  const content = <View style={styles.content}>{children}</View>;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {scroll ? (
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {content}
        </ScrollView>
      ) : content}
    </KeyboardAvoidingView>
  );
}
