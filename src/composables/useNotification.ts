import { ref } from 'vue'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export interface NotificationItem {
  id: number
  message: string
  type: NotificationType
  duration: number
  visible: boolean
}

const notifications = ref<NotificationItem[]>([])
let notificationId = 0

export function useNotification() {
  const addNotification = (
    message: string,
    type: NotificationType = 'success',
    duration = 3000,
  ): number => {
    const notification: NotificationItem = {
      id: ++notificationId,
      message,
      type,
      duration,
      visible: true,
    }

    notifications.value.push(notification)

    setTimeout(() => {
      removeNotification(notification.id)
    }, duration)

    return notification.id
  }

  const removeNotification = (id: number): void => {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const showSuccess = (message: string, duration = 3000): number => {
    return addNotification(message, 'success', duration)
  }

  const showError = (message: string, duration = 4000): number => {
    return addNotification(message, 'error', duration)
  }

  const showInfo = (message: string, duration = 3000): number => {
    return addNotification(message, 'info', duration)
  }

  const showWarning = (message: string, duration = 3500): number => {
    return addNotification(message, 'warning', duration)
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  }
}
