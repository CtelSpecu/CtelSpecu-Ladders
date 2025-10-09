<template>
  <div class="notification-container">
    <transition-group name="notification" tag="div">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'notification-item',
          `notification-${notification.type}`
        ]"
      >
        <div class="notification-content">
          <div class="notification-icon">
            <i :class="getIconClass(notification.type)"></i>
          </div>
          <div class="notification-message">
            {{ notification.message }}
          </div>
          <button 
            class="notification-close"
            @click="removeNotification(notification.id)"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="notification-progress">
          <div 
            class="notification-progress-bar"
            :style="{ animationDuration: notification.duration + 'ms' }"
          ></div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useNotification } from '../composables/useNotification.js'

const { notifications, removeNotification } = useNotification()

const getIconClass = (type) => {
  const iconMap = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  }
  return iconMap[type] || iconMap.info
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: var(--spacing-xl);
  right: var(--spacing-xl);
  z-index: 9999;
  max-width: 400px;
  width: 100%;
}

.notification-item {
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  box-shadow: var(--soft-shadow);
  margin-bottom: var(--spacing-md);
  overflow: hidden;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: relative;
  transition: all var(--transition-normal);
}

.notification-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--sub-gradient);
  opacity: 0;
  transition: opacity var(--transition-normal);
  z-index: -1;
}

.notification-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--accent-shadow);
  border-color: var(--text-accent);
}

.notification-item:hover::before {
  opacity: 0.1;
}

.notification-content {
  display: flex;
  align-items: flex-start;
  padding: var(--spacing-lg);
  gap: var(--spacing-md);
}

.notification-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-top: 2px;
}

.notification-message {
  flex: 1;
  font-size: var(--font-size-base);
  line-height: 1.5;
  color: var(--text-primary);
  font-weight: 500;
}

.notification-close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: 8px;
  transition: all var(--transition-normal);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-close:hover {
  background: var(--background-tertiary);
  color: var(--text-primary);
}

.notification-progress {
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.notification-progress-bar {
  height: 100%;
  width: 100%;
  background: var(--main-gradient);
  animation: progress linear forwards;
  transform-origin: left;
}

@keyframes progress {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}

.notification-success {
  border-left: 4px solid var(--text-success);
}

.notification-success .notification-icon {
  background: rgba(34, 197, 94, 0.2);
  color: var(--text-success);
}

.notification-success .notification-progress-bar {
  background: var(--text-success);
}

.notification-error {
  border-left: 4px solid var(--text-error);
}

.notification-error .notification-icon {
  background: rgba(239, 68, 68, 0.2);
  color: var(--text-error);
}

.notification-error .notification-progress-bar {
  background: var(--text-error);
}

.notification-warning {
  border-left: 4px solid var(--text-warning);
}

.notification-warning .notification-icon {
  background: rgba(251, 191, 36, 0.2);
  color: var(--text-warning);
}

.notification-warning .notification-progress-bar {
  background: var(--text-warning);
}

.notification-info {
  border-left: 4px solid var(--text-info);
}

.notification-info .notification-icon {
  background: rgba(59, 130, 246, 0.2);
  color: var(--text-info);
}

.notification-info .notification-progress-bar {
  background: var(--text-info);
}

/* 动画效果 */
.notification-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.notification-leave-active {
  transition: all 0.3s ease-in;
}

.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.notification-move {
  transition: transform 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .notification-container {
    left: 20px;
    right: 20px;
    max-width: none;
  }
  
  .notification-content {
    padding: 12px;
  }
  
  .notification-message {
    font-size: 13px;
  }
}
</style>
