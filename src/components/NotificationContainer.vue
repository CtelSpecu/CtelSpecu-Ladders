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
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
  width: 100%;
}

.notification-item {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  margin-bottom: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
}

.notification-content {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  gap: 12px;
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
  font-size: 14px;
  line-height: 1.5;
  color: white;
  font-weight: 500;
}

.notification-close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.notification-progress {
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.notification-progress-bar {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.4), transparent);
  animation: progress linear forwards;
  transform-origin: left;
}

@keyframes progress {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}

.notification-success {
  border-left: 4px solid #28a745;
}

.notification-success .notification-icon {
  background: rgba(40, 167, 69, 0.2);
  color: #28a745;
}

.notification-success .notification-progress-bar {
  background: #28a745;
}

.notification-error {
  border-left: 4px solid #dc3545;
}

.notification-error .notification-icon {
  background: rgba(220, 53, 69, 0.2);
  color: #dc3545;
}

.notification-error .notification-progress-bar {
  background: #dc3545;
}

.notification-warning {
  border-left: 4px solid #ffc107;
}

.notification-warning .notification-icon {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.notification-warning .notification-progress-bar {
  background: #ffc107;
}

.notification-info {
  border-left: 4px solid #17a2b8;
}

.notification-info .notification-icon {
  background: rgba(23, 162, 184, 0.2);
  color: #17a2b8;
}

.notification-info .notification-progress-bar {
  background: #17a2b8;
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
