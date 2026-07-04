import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Routes } from '@/constants/Routes';
import { useAuth } from '@/context/AuthContext';
import { LoginScreen } from '@/screens/auth/login';
import { RegisterScreen } from '@/screens/auth/register';
import { AppDrawerNavigator } from './drawer/AppDrawerNavigator';
import { type RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return null;
  }

  if (user) {
    return <AppDrawerNavigator />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Routes.login} component={LoginScreen} />
      <Stack.Screen name={Routes.register} component={RegisterScreen} />
    </Stack.Navigator>
  );
}
