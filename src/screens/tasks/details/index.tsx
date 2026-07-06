import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { AppTextInput } from '@/components/ui/AppTextInput';
import { Routes } from '@/constants/Routes';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useAppColors } from '@/hooks/useAppColors';
import { type TaskStackParamList } from '@/navigation/types';
import { cancelTaskEndReminderAsync, scheduleTaskEndReminderAsync } from '@/services/taskNotifications';
import { type SubTask, type Task } from '@/types/models';
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
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

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

    const subtaskRows = await db.getAllAsync<SubTask>(
      'SELECT * FROM subtasks WHERE task_id = ? AND user_id = ? ORDER BY is_completed ASC, updated_at DESC',
      route.params.taskId,
      user.id,
    );
    setSubtasks(subtaskRows);
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

  const addSubtask = useCallback(async () => {
    if (!task || !user) {
      return;
    }

    const trimmedTitle = subtaskTitle.trim();

    if (!trimmedTitle) {
      showToast('Give your subtask a title.', { variant: 'error' });
      return;
    }

    setIsAddingSubtask(true);

    try {
      const now = new Date().toISOString();

      await db.runAsync(
        'INSERT INTO subtasks (task_id, user_id, title, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        task.id,
        user.id,
        trimmedTitle,
        null,
        now,
        now,
      );

      setSubtaskTitle('');
      showToast('Subtask added.', { variant: 'success' });
      await loadTask();
    } finally {
      setIsAddingSubtask(false);
    }
  }, [db, loadTask, showToast, subtaskTitle, task, user]);

  const toggleSubtask = useCallback(async (subtask: SubTask) => {
    if (!user) {
      return;
    }

    await db.runAsync(
      'UPDATE subtasks SET is_completed = ?, updated_at = ? WHERE id = ? AND user_id = ?',
      subtask.is_completed ? 0 : 1,
      new Date().toISOString(),
      subtask.id,
      user.id,
    );

    await loadTask();
  }, [db, loadTask, user]);

  const confirmDeleteSubtask = useCallback((subtask: SubTask) => {
    Alert.alert('Delete subtask?', `Remove "${subtask.title}" from this task?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!user) {
            return;
          }

          await db.runAsync('DELETE FROM subtasks WHERE id = ? AND user_id = ?', subtask.id, user.id);
          showToast('Subtask deleted.', { variant: 'success' });
          await loadTask();
        },
      },
    ]);
  }, [db, loadTask, showToast, user]);

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

        <View style={styles.section}>
          <View style={styles.subtaskHeader}>
            <View>
              <Text style={styles.label}>Subtasks</Text>
              <Text style={styles.subtaskSummary}>
                {subtasks.length
                  ? `${subtasks.filter((subtask) => subtask.is_completed).length}/${subtasks.length} completed`
                  : 'No subtasks yet'}
              </Text>
            </View>
          </View>

          <View style={styles.subtaskForm}>
            <AppTextInput
              label="New subtask"
              onChangeText={setSubtaskTitle}
              onSubmitEditing={addSubtask}
              placeholder="Add a smaller step"
              returnKeyType="done"
              value={subtaskTitle}
            />
            <AppButton
              loading={isAddingSubtask}
              onPress={addSubtask}
              title="Add subtask"
              variant="secondary"
            />
          </View>

          <View style={styles.subtaskList}>
            {subtasks.map((subtask) => {
              const isSubtaskCompleted = Boolean(subtask.is_completed);

              return (
                <View
                  accessible={false}
                  importantForAccessibility="no"
                  key={subtask.id}
                  style={styles.subtaskItem}
                >
                  <Pressable
                    accessibilityHint={`Double tap to mark this subtask as ${isSubtaskCompleted ? 'pending' : 'completed'}.`}
                    accessibilityLabel={`${subtask.title}, ${isSubtaskCompleted ? 'completed' : 'pending'} subtask`}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isSubtaskCompleted }}
                    hitSlop={10}
                    onPress={() => toggleSubtask(subtask)}
                    style={[
                      styles.subtaskCheckbox,
                      isSubtaskCompleted ? styles.subtaskCheckboxChecked : null,
                    ]}
                  >
                    {isSubtaskCompleted ? (
                      <Ionicons
                        color="#FFFFFF"
                        importantForAccessibility="no"
                        name="checkmark"
                        size={16}
                      />
                    ) : null}
                  </Pressable>
                  <Text
                    importantForAccessibility="no"
                    style={[
                      styles.subtaskTitle,
                      isSubtaskCompleted ? styles.subtaskTitleCompleted : null,
                    ]}
                  >
                    {subtask.title}
                  </Text>
                  <Pressable
                    accessibilityHint="Double tap to delete this subtask."
                    accessibilityLabel={`Delete subtask, ${subtask.title}`}
                    accessibilityRole="button"
                    hitSlop={10}
                    onPress={() => confirmDeleteSubtask(subtask)}
                    style={({ pressed }) => [
                      styles.subtaskDeleteButton,
                      pressed ? styles.iconButtonPressed : null,
                    ]}
                  >
                    <Ionicons
                      color={colors.danger}
                      importantForAccessibility="no"
                      name="trash-outline"
                      size={20}
                    />
                  </Pressable>
                </View>
              );
            })}
          </View>
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
