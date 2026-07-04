import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SQLiteProvider } from 'expo-sqlite';
import { useEffect } from 'react';

import { NavigationThemes } from '@/constants/Colors';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { migrateDatabase } from '@/db/migrations';
import { useAppColorScheme } from '@/hooks/useAppColors';
import { RootNavigator } from '@/navigation/RootNavigator';
import { initializeTaskNotificationsAsync } from '@/services/taskNotifications';

export default function App() {
  const colorScheme = useAppColorScheme();

  useEffect(() => {
    initializeTaskNotificationsAsync();
  }, []);

  return (
    <NavigationContainer theme={NavigationThemes[colorScheme]}>
      <SQLiteProvider databaseName="my-life.db" onInit={migrateDatabase}>
        <ToastProvider>
          <AuthProvider>
            <RootNavigator />
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </AuthProvider>
        </ToastProvider>
      </SQLiteProvider>
    </NavigationContainer>
  );
}
