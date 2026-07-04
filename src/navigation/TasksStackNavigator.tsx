import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable } from 'react-native';

import { Routes } from '@/constants/Routes';
import { useAppColors } from '@/hooks/useAppColors';
import AddTaskScreen from '@/screens/tasks/add';
import TaskDetailsScreen from '@/screens/tasks/details';
import TasksScreen from '@/screens/tasks/home';
import { type TaskStackParamList } from './types';

const Stack = createNativeStackNavigator<TaskStackParamList>();

export function TasksStackNavigator() {
  const colors = useAppColors();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '800' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name={Routes.tasks}
        component={TasksScreen}
        options={({ navigation }) => ({
          title: 'Dashboard',
          headerLeft: () => (
            <Pressable
              accessibilityLabel="Open menu"
              accessibilityRole="button"
              hitSlop={12}
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              style={{ marginRight: 16 }}
            >
              <Ionicons color={colors.text} name="menu-outline" size={26} />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name={Routes.addTask}
        component={AddTaskScreen}
        options={({ route }) => ({
          title: route.params?.taskId ? 'Edit Task' : 'Add Task',
        })}
      />
      <Stack.Screen
        name={Routes.taskDetails}
        component={TaskDetailsScreen}
        options={{ title: 'Task Details' }}
      />
    </Stack.Navigator>
  );
}
