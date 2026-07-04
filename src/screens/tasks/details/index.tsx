import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { Routes } from '@/constants/Routes';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useAppColors } from '@/hooks/useAppColors';
import { type TaskStackParamList } from '@/navigation/types';
import { cancelTaskEndReminderAsync, scheduleTaskEndReminderAsync } from '@/services/taskNotifications';
import { type Task } from '@/types/models';
import { formatTaskDateTime } from '@/utils/dateTime';
import { createTaskDetailsStyles } from './styles';

type TaskDetailsRoute = RouteProp<TaskStackParamList, 'TaskDetails'>;
type TaskDetailsNavigation = NativeStackNavigationProp<TaskStackParamList, 'TaskDetails'>;

export default function TaskDetailsScreen() {
  const db = useSQLiteContext();
  const navigation = useNavigation<TaskDetailsNavigation>();
  const route = useRoute<TaskDetailsRoute>();
  const colors = useAppColors();
  const styles = useMemo(() => createTaskDetailsStyles(colors), [colors]);
  const { user } = useAuth();
  const { showToast } = useToast();
  const [task, setTask] = useState<Task | null>(null);

  const loadTask = useCallback(async () => {
    if (!user) {
      return;
    }

    const row = await db.getFirstAsync<Task>(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      route.params.taskId,
      user.id,
    );

    if (!row) {
      showToast('Task could not be found.', { variant: 'error' });
      navigation.goBack();
      return;
    }

    setTask(row);
  }, [db, navigation, route.params.taskId, showToast, user]);

  useFocusEffect(
    useCallback(() => {
      loadTask();
    }, [loadTask]),
  );

  const toggleTask = useCallback(async () => {
    if (!task || !user) {
      return;
    }

    const nextCompleted = task.is_completed ? 0 : 1;

    await db.runAsync(
      'UPDATE tasks SET is_completed = ?, updated_at = ? WHERE id = ? AND user_id = ?',
      nextCompleted,
      new Date().toISOString(),
      task.id,
      user.id,
    );

    if (nextCompleted) {
      await cancelTaskEndReminderAsync(task.id);
    } else {
      await scheduleTaskEndReminderAsync(task.id, task.title, task.end_at);
    }

    await loadTask();
  }, [db, loadTask, task, user]);

  if (!task) {
    return (
      <AppScreen>
        <Text style={styles.loadingText}>Loading task...</Text>
      </AppScreen>
    );
  }

  const isCompleted = Boolean(task.is_completed);

  return (
    <AppScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleGroup}>
            <Text style={styles.title}>{task.title}</Text>
            <Text style={styles.status}>{isCompleted ? 'Completed' : 'Pending'}</Text>
          </View>
          <Pressable
            accessibilityHint="Double tap to edit this task."
            accessibilityLabel={`Edit task, ${task.title}`}
            accessibilityRole="button"
            onPress={() => navigation.navigate(Routes.addTask, { taskId: task.id })}
            style={({ pressed }) => [styles.iconButton, pressed ? styles.iconButtonPressed : null]}
          >
            <Ionicons color={colors.primary} importantForAccessibility="no" name="create-outline" size={22} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{task.description || 'No description added.'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Start</Text>
          <Text style={styles.value}>{formatTaskDateTime(task.start_at)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>End</Text>
          <Text style={styles.value}>{formatTaskDateTime(task.end_at)}</Text>
        </View>

        <AppButton
          onPress={toggleTask}
          title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
          variant={isCompleted ? 'secondary' : 'primary'}
        />
      </View>
    </AppScreen>
  );
}
