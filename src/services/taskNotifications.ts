import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const TASK_REMINDER_CHANNEL_ID = 'task-reminders';
const TASK_END_REMINDER_OFFSET_MS = 10 * 60 * 1000;
const TASK_NOTIFICATION_SOUND = 'notification_sound.wav';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function getTaskEndReminderIdentifier(taskId: number) {
  return `task-end-reminder-${taskId}`;
}

export async function initializeTaskNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(TASK_REMINDER_CHANNEL_ID, {
      name: 'Task reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#2563EB',
      sound: TASK_NOTIFICATION_SOUND,
    });
  }
}

export async function requestTaskNotificationPermissionAsync() {
  const permissions = await Notifications.getPermissionsAsync();

  if (permissions.granted || permissions.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }

  const requestedPermissions = await Notifications.requestPermissionsAsync();
  return requestedPermissions.granted
    || requestedPermissions.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
}

export async function cancelTaskEndReminderAsync(taskId: number) {
  await Notifications.cancelScheduledNotificationAsync(getTaskEndReminderIdentifier(taskId));
}

export async function scheduleTaskEndReminderAsync(taskId: number, title: string, endAt: string | null) {
  await cancelTaskEndReminderAsync(taskId);

  if (!endAt) {
    return false;
  }

  const endDate = new Date(endAt);

  if (Number.isNaN(endDate.getTime()) || endDate.getTime() <= Date.now()) {
    return false;
  }

  const hasPermission = await requestTaskNotificationPermissionAsync();

  if (!hasPermission) {
    return false;
  }

  const reminderTime = endDate.getTime() - TASK_END_REMINDER_OFFSET_MS;
  const triggerDate = new Date(Math.max(reminderTime, Date.now() + 5000));

  await Notifications.scheduleNotificationAsync({
    identifier: getTaskEndReminderIdentifier(taskId),
    content: {
      title: 'Task ending soon',
      body: `"${title}" is about to end.`,
      data: { taskId },
      sound: TASK_NOTIFICATION_SOUND,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
      channelId: TASK_REMINDER_CHANNEL_ID,
    },
  });

  return true;
}
