import { ref, reactive } from 'vue'

// 全局通知状态
const notifications = ref([])
let notificationId = 0

export function useNotification() {
  const addNotification = (message, type = 'success', duration = 3000) => {
    const notification = {
      id: ++notificationId,
      message,
      type,
      duration,
      visible: true
    }
    
    notifications.value.push(notification)
    
    // 自动移除通知
    setTimeout(() => {
      removeNotification(notification.id)
    }, duration)
    
    return notification.id
  }
  
  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }
  
  const showSuccess = (message, duration = 3000) => {
    return addNotification(message, 'success', duration)
  }
  
  const showError = (message, duration = 4000) => {
    return addNotification(message, 'error', duration)
  }
  
  const showInfo = (message, duration = 3000) => {
    return addNotification(message, 'info', duration)
  }
  
  const showWarning = (message, duration = 3500) => {
    return addNotification(message, 'warning', duration)
  }
  
  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning
  }
}
