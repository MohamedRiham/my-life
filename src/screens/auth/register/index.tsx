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
import { createRegisterStyles } from './styles';

export function RegisterScreen() {
  const colors = useAppColors();
  const styles = createRegisterStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { register } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister() {
    setIsSubmitting(true);

    try {
      await register(name, email, password);
    } catch (registerError) {
      showToast(registerError instanceof Error ? registerError.message : 'Unable to register.', {
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleLoginPress = () => {
    navigation.navigate(Routes.login);
  };

  return (
    <AppScreen>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Start fresh</Text>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Your account and tasks are stored locally on this device.</Text>
        </View>

        <View style={styles.form}>
          <AppTextInput
            autoComplete="name"
            label="Name"
            onChangeText={setName}
            placeholder="Your name"
            value={name}
          />
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
            placeholder="At least 6 characters"
            secureTextEntry
            value={password}
          />
          <AppButton loading={isSubmitting} onPress={handleRegister} title="Create account" />
        </View>

        <View style={styles.footerContainer}>
          <View importantForAccessibility="no" style={styles.line} />
          <View accessible={false} style={styles.footerPrompt}>
            <Text style={styles.footer}>Already registered?</Text>
            <Pressable
              accessibilityHint="Double tap to go back to the login screen."
              accessibilityLabel="Log in to your existing account"
              accessibilityRole="button"
              onPress={handleLoginPress}
              style={({ pressed }) => [
                styles.loginButton,
                pressed ? styles.loginButtonPressed : null,
              ]}
            >
              <Text style={styles.link}>Log in</Text>
            </Pressable>
          </View>
          <View importantForAccessibility="no" style={styles.line} />
        </View>
      </View>
    </AppScreen>
  );
}
