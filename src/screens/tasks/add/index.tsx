import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Keyboard, Platform, Pressable, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { AppTextInput } from '@/components/ui/AppTextInput';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useAppColors } from '@/hooks/useAppColors';
import { type TaskStackParamList } from '@/navigation/types';
import { scheduleTaskEndReminderAsync } from '@/services/taskNotifications';
import { type Task } from '@/types/models';
import { formatTaskDateTime } from '@/utils/dateTime';
import { createAddTaskStyles } from './styles';

type AddTaskRoute = RouteProp<TaskStackParamList, 'AddTask'>;
type AddTaskNavigation = NativeStackNavigationProp<TaskStackParamList, 'AddTask'>;
type DateField = 'start' | 'end';
type PickerMode = 'date' | 'time';

type ActivePicker = {
  field: DateField;
  mode: PickerMode;
};

function mergeDatePart(currentValue: Date | null, selectedDate: Date) {
  const next = new Date(currentValue ?? selectedDate);
  next.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
  return next;
}

function mergeTimePart(currentValue: Date | null, selectedDate: Date) {
  const next = new Date(currentValue ?? selectedDate);
  next.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
  return next;
}

export default function AddTaskScreen() {
  const db = useSQLiteContext();
  const navigation = useNavigation<AddTaskNavigation>();
  const route = useRoute<AddTaskRoute>();
  const colors = useAppColors();
  const styles = useMemo(() => createAddTaskStyles(colors), [colors]);
  const { user } = useAuth();
  const { showToast } = useToast();
  const taskId = route.params?.taskId;
  const isEditing = Boolean(taskId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startAt, setStartAt] = useState<Date | null>(null);
  const [endAt, setEndAt] = useState<Date | null>(null);
  const [activePicker, setActivePicker] = useState<ActivePicker | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);

  const loadTask = useCallback(async () => {
    if (!user || !taskId) {
      setIsLoading(false);
      return;
    }

    const task = await db.getFirstAsync<Task>(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      taskId,
      user.id,
    );

    if (!task) {
      showToast('Task could not be found.', { variant: 'error' });
      navigation.goBack();
      return;
    }

    setTitle(task.title);
    setDescription(task.description ?? '');
    setStartAt(task.start_at ? new Date(task.start_at) : null);
    setEndAt(task.end_at ? new Date(task.end_at) : null);
    setIsLoading(false);
  }, [db, navigation, showToast, taskId, user]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  function updateDateTime(field: DateField, mode: PickerMode, selectedDate: Date) {
    const setValue = field === 'start' ? setStartAt : setEndAt;
    const currentValue = field === 'start' ? startAt : endAt;
    setValue(mode === 'date' ? mergeDatePart(currentValue, selectedDate) : mergeTimePart(currentValue, selectedDate));
  }

  function openPicker(field: DateField, mode: PickerMode) {
    Keyboard.dismiss();

    const value = field === 'start' ? startAt : endAt;

    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        mode,
        value: value ?? new Date(),
        onValueChange: (_event, selectedDate) => {
          updateDateTime(field, mode, selectedDate);
        },
      });
      return;
    }

    setActivePicker({ field, mode });
  }

  function handleInlinePickerValueChange(_event: DateTimePickerChangeEvent, selectedDate: Date) {
    if (!activePicker) {
      return;
    }

    updateDateTime(activePicker.field, activePicker.mode, selectedDate);
  }

  function renderDateControls(label: string, field: DateField, value: Date | null) {
    return (
      <View style={styles.dateGroup}>
        <View style={styles.dateHeader}>
          <View>
            <Text style={styles.dateLabel}>{label}</Text>
            <Text style={styles.dateValue}>{formatTaskDateTime(value?.toISOString())}</Text>
          </View>
          {value ? (
            <Pressable
              accessibilityLabel={`Clear ${label.toLowerCase()}`}
              accessibilityRole="button"
              onPress={() => (field === 'start' ? setStartAt(null) : setEndAt(null))}
              style={({ pressed }) => [styles.clearButton, pressed ? styles.clearButtonPressed : null]}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.dateActions}>
          <AppButton onPress={() => openPicker(field, 'date')} title="Date" variant="secondary" style={styles.dateAction} />
          <AppButton onPress={() => openPicker(field, 'time')} title="Time" variant="secondary" style={styles.dateAction} />
        </View>

        {Platform.OS === 'ios' && activePicker?.field === field ? (
          <View style={styles.inlinePicker}>
            <DateTimePicker
              display="spinner"
              mode={activePicker.mode}
              onDismiss={() => setActivePicker(null)}
              onValueChange={handleInlinePickerValueChange}
              value={value ?? new Date()}
            />
            <AppButton onPress={() => setActivePicker(null)} title="Done" variant="secondary" />
          </View>
        ) : null}
      </View>
    );
  }

  async function saveTask() {
    if (!user) {
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      showToast('Give your task a title.', { variant: 'error' });
      return;
    }

    if (startAt && endAt && endAt.getTime() < startAt.getTime()) {
      showToast('End date/time cannot be before start date/time.', { variant: 'error' });
      return;
    }

    setIsSaving(true);

    try {
      const now = new Date().toISOString();
      const startValue = startAt?.toISOString() ?? null;
      const endValue = endAt?.toISOString() ?? null;

      if (taskId) {
        await db.runAsync(
          'UPDATE tasks SET title = ?, description = ?, start_at = ?, end_at = ?, updated_at = ? WHERE id = ? AND user_id = ?',
          trimmedTitle,
          trimmedDescription,
          startValue,
          endValue,
          now,
          taskId,
          user.id,
        );
        await scheduleTaskEndReminderAsync(taskId, trimmedTitle, endValue);
        showToast('Task updated.', { variant: 'success' });
      } else {
        const result = await db.runAsync(
          'INSERT INTO tasks (user_id, title, description, start_at, end_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
          user.id,
          trimmedTitle,
          trimmedDescription,
          startValue,
          endValue,
          now,
          now,
        );
        await scheduleTaskEndReminderAsync(result.lastInsertRowId, trimmedTitle, endValue);
        showToast('Task added.', { variant: 'success' });
      }

      navigation.goBack();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AppScreen>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>{isEditing ? 'Edit task' : 'Add a task'}</Text>
          <Text style={styles.subtitle}>
            {isEditing ? 'Update the task details.' : 'Capture the next thing you want to finish.'}
          </Text>
        </View>

        <View style={styles.formCard}>
          <AppTextInput
            label="Title"
            onChangeText={setTitle}
            placeholder="Plan the week"
            value={title}
          />
          <AppTextInput
            label="Description"
            multiline
            onChangeText={setDescription}
            placeholder="Notes, details, or next steps"
            value={description}
          />
          {renderDateControls('Start date/time', 'start', startAt)}
          {renderDateControls('End date/time', 'end', endAt)}
          <AppButton
            disabled={isLoading}
            loading={isSaving}
            onPress={saveTask}
            title={isEditing ? 'Save changes' : 'Add task'}
          />
        </View>
      </View>
    </AppScreen>
  );
}
