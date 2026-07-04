import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';

import { AppScreen } from '@/components/ui/AppScreen';
import { Routes } from '@/constants/Routes';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useAppColors } from '@/hooks/useAppColors';
import { type TaskStackParamList } from '@/navigation/types';
import {
  cancelTaskEndReminderAsync,
  requestTaskNotificationPermissionAsync,
  scheduleTaskEndReminderAsync,
} from '@/services/taskNotifications';
import { type Task } from '@/types/models';
import { formatTaskDateRange } from '@/utils/dateTime';
import { createTaskStyles } from './styles';

type TaskStyles = ReturnType<typeof createTaskStyles>;

function EmptyState({ styles }: { styles: TaskStyles }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No tasks yet</Text>
      <Text style={styles.emptyText}>Tap the plus button to add your first task.</Text>
    </View>
  );
}

export default function TasksScreen() {
  const db = useSQLiteContext();
  const navigation = useNavigation<NativeStackNavigationProp<TaskStackParamList, 'Tasks'>>();
  const colors = useAppColors();
  const styles = useMemo(() => createTaskStyles(colors), [colors]);
  const { user } = useAuth();
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const hasRequestedNotificationPermission = useRef(false);

  const taskSummary = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.is_completed).length;
    const pending = total - completed;

    return {
      subtitle: `${total} task${total === 1 ? '' : 's'} in your list`,
      pendingLabel: pending ? `${pending} pending` : completed ? 'All done' : 'Ready when you are',
    };
  }, [tasks]);

  const loadTasks = useCallback(async () => {
    if (!user) {
      return;
    }

    const rows = await db.getAllAsync<Task>(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY is_completed ASC, updated_at DESC',
      user.id,
    );
    setTasks(rows);
  }, [db, user]);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks]),
  );

  useEffect(() => {
    if (!user || hasRequestedNotificationPermission.current) {
      return;
    }

    hasRequestedNotificationPermission.current = true;

    requestTaskNotificationPermissionAsync()
      .then((hasPermission) => {
        if (!hasPermission) {
          showToast('Enable notifications to get task end reminders.', { variant: 'info' });
        }
      })
      .catch(() => {
        showToast('Unable to request notification permission right now.', { variant: 'error' });
      });
  }, [showToast, user]);

  const toggleTask = useCallback(async (task: Task) => {
    if (!user) {
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

    await loadTasks();
  }, [db, loadTasks, user]);

  const confirmDelete = useCallback((task: Task) => {
    Alert.alert('Delete task?', `Remove "${task.title}" from your list?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!user) {
            return;
          }

          await db.runAsync('DELETE FROM tasks WHERE id = ? AND user_id = ?', task.id, user.id);
          await cancelTaskEndReminderAsync(task.id);
          await loadTasks();
        },
      },
    ]);
  }, [db, loadTasks, user]);

  const keyExtractor = useCallback((item: Task) => String(item.id), []);

  const renderTask = useCallback(({ item }: { item: Task }) => {
    const isCompleted = Boolean(item.is_completed);
    const statusLabel = isCompleted ? 'completed' : 'not completed';
    const descriptionLabel = item.description ? `, ${item.description}` : '';
    const scheduleLabel = formatTaskDateRange(item.start_at, item.end_at);

    return (
      <View accessible={false} importantForAccessibility="no" style={styles.taskCard}>
        <Pressable
          accessibilityHint={`Double tap to mark this task as ${isCompleted ? 'not completed' : 'completed'}.`}
          accessibilityLabel={`${item.title}, ${statusLabel}`}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isCompleted }}
          hitSlop={10}
          onPress={() => toggleTask(item)}
          style={[styles.checkbox, isCompleted ? styles.checkboxChecked : null]}
        >
          {isCompleted ? (
            <Ionicons
              color="#FFFFFF"
              importantForAccessibility="no"
              name="checkmark"
              size={18}
            />
          ) : null}
        </Pressable>
        <Pressable
          accessibilityHint="Double tap to view task details."
          accessibilityLabel={`View task, ${item.title}${descriptionLabel}, ${scheduleLabel}, ${statusLabel}`}
          accessibilityRole="button"
          onPress={() => navigation.navigate(Routes.taskDetails, { taskId: item.id })}
          style={styles.taskContent}
        >
          <Text
            importantForAccessibility="no"
            style={[styles.taskTitle, isCompleted ? styles.completedText : null]}
          >
            {item.title}
          </Text>
          {item.description ? (
            <Text
              importantForAccessibility="no"
              style={[styles.taskDescription, isCompleted ? styles.completedText : null]}
            >
              {item.description}
            </Text>
          ) : null}
          <Text
            importantForAccessibility="no"
            style={[styles.taskSchedule, isCompleted ? styles.completedText : null]}
          >
            {scheduleLabel}
          </Text>
        </Pressable>
        <Pressable
          accessibilityHint="Double tap to edit this task."
          accessibilityLabel={`Edit task, ${item.title}`}
          accessibilityRole="button"
          hitSlop={10}
          onPress={() => navigation.navigate(Routes.addTask, { taskId: item.id })}
          style={({ pressed }) => [styles.iconButton, pressed ? styles.iconButtonPressed : null]}
        >
          <Ionicons
            color={colors.primary}
            importantForAccessibility="no"
            name="create-outline"
            size={22}
          />
        </Pressable>
        <Pressable
          accessibilityHint="Double tap to open the delete confirmation."
          accessibilityLabel={`Delete task, ${item.title}`}
          accessibilityRole="button"
          hitSlop={10}
          onPress={() => confirmDelete(item)}
          style={({ pressed }) => [styles.iconButton, pressed ? styles.iconButtonPressed : null]}
        >
          <Ionicons
            color={colors.danger}
            importantForAccessibility="no"
            name="trash-outline"
            size={22}
          />
        </Pressable>
      </View>
    );
  }, [colors.danger, colors.primary, navigation, styles, toggleTask, confirmDelete]);

  return (
    <AppScreen scroll={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, {user?.name}</Text>
            <Text style={styles.subtitle}>{taskSummary.subtitle}</Text>
            <Text style={styles.metaText}>{taskSummary.pendingLabel}</Text>
          </View>
        </View>

        <FlatList
          accessibilityLabel="Task list"
          contentContainerStyle={styles.listContent}
          data={tasks}
          keyExtractor={keyExtractor}
          ListEmptyComponent={<EmptyState styles={styles} />}
          renderItem={renderTask}
        />

        <Pressable
          accessibilityLabel="Add task"
          accessibilityHint="Double tap to create a new task."
          accessibilityRole="button"
          onPress={() => navigation.navigate(Routes.addTask)}
          style={({ pressed }) => [styles.fab, pressed ? styles.fabPressed : null]}
        >
          <Ionicons
            color={colors.primaryText}
            importantForAccessibility="no"
            name="add"
            size={32}
          />
        </Pressable>
      </View>
    </AppScreen>
  );
}
