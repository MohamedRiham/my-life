import { Ionicons } from '@expo/vector-icons';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { Text, View } from 'react-native';

import { Routes } from '@/constants/Routes';
import { useAuth } from '@/context/AuthContext';
import { useAppColors } from '@/hooks/useAppColors';
import { TasksStackNavigator } from '../TasksStackNavigator';
import { type AppDrawerParamList } from '../types';
import { createDrawerStyles } from './styles';

const Drawer = createDrawerNavigator<AppDrawerParamList>();

function AppDrawerContent(props: DrawerContentComponentProps) {
  const colors = useAppColors();
  const styles = createDrawerStyles(colors);
  const { logout, user } = useAuth();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.profile}>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>
      <DrawerItemList {...props} />
      <View style={styles.footer}>
        <DrawerItem
          icon={({ size }) => (
            <Ionicons color={colors.danger} name="log-out-outline" size={size} />
          )}
          label="Log out"
          labelStyle={styles.logoutLabel}
          onPress={logout}
        />
      </View>
    </DrawerContentScrollView>
  );
}

export function AppDrawerNavigator() {
  const colors = useAppColors();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <AppDrawerContent {...props} />}
      screenOptions={{
        drawerActiveBackgroundColor: colors.inputBackground,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.text,
        drawerStyle: { backgroundColor: colors.surface },
        headerShown: false,
      }}
    >
      <Drawer.Screen
        name={Routes.dashboard}
        component={TasksStackNavigator}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons color={color} name="list-outline" size={size} />
          ),
          title: 'Dashboard',
        }}
      />
    </Drawer.Navigator>
  );
}
