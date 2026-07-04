import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { AppTextInput } from '@/components/ui/AppTextInput';
import { Routes } from '@/constants/Routes';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useAppColors } from '@/hooks/useAppColors';
import { type AuthStackParamList } from '@/navigation/types';
import { createLoginStyles } from './styles';

export function LoginScreen() {
  const colors = useAppColors();
  const styles = createLoginStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (loginError) {
      showToast(loginError instanceof Error ? loginError.message : 'Unable to log in.', {
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleRegisterPress = () => {
    navigation.navigate(Routes.register);
  };

  return (
    <AppScreen>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Welcome back</Text>
          <Text style={styles.title}>Log in to My Life</Text>
          <Text style={styles.subtitle}>Keep your tasks organized on this device.</Text>
        </View>

        <View style={styles.form}>
          <AppTextInput
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            label="Email"
            onChangeText={setEmail}
            placeholder="you@example.com"
            value={email}
          />
          <AppTextInput
            autoCapitalize="none"
            label="Password"
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            value={password}
          />
          <AppButton loading={isSubmitting} onPress={handleLogin} title="Log in" />
        </View>

        <View style={styles.footerContainer}>
          <View importantForAccessibility="no" style={styles.line} />
          <View accessible={false} style={styles.footerPrompt}>
            <Text style={styles.footer}>No account?</Text>
            <Pressable
              accessibilityHint="Double tap to create a new account."
              accessibilityLabel="Register for a new account"
              accessibilityRole="button"
              onPress={handleRegisterPress}
              style={({ pressed }) => [
                styles.registerButton,
                pressed ? styles.registerButtonPressed : null,
              ]}
            >
              <Text style={styles.link}>Register</Text>
            </Pressable>
          </View>
          <View importantForAccessibility="no" style={styles.line} />
        </View>
      </View>
    </AppScreen>
  );
}
