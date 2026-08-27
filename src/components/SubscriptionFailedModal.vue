<template>
  <div v-if="showModal" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-accent"></div>
      <div class="modal-header">
        <h2 class="modal-title">
          <VueIcon class="title-icon" icon="triangle-exclamation" aria-label="订阅获取失败" />
          订阅获取失败
        </h2>
        <button class="close-btn" @click="closeModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="warning-icon">
          <VueIcon icon="triangle-exclamation" style="font-size:48px; color: var(--text-warning);" />
        </div>
        <p class="warning-message">
          当前订阅暂时无法获取，可能是网络问题或订阅源暂时不可用。请尝试以下操作：
        </p>
        <div class="features">
          <div class="feature-item">
            <span class="feature-icon">🔄</span>
            <div class="feature-content">
              <span class="feature-title">检查网络</span>
              <span class="feature-desc">确保网络连接正常</span>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">⏰</span>
            <div class="feature-content">
              <span class="feature-title">稍后重试</span>
              <span class="feature-desc">订阅源可能临时不可用</span>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🌐</span>
            <div class="feature-content">
              <span class="feature-title">尝试其他订阅</span>
              <span class="feature-desc">选择其他可用订阅源</span>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" @click="closeModal">知道了</button>
        <button class="btn-primary" @click="navigateToRecommend">查看推荐</button>
        <button class="btn-free" @click="navigateToFreeNode">免费节点</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import VueIcon from './VueIcon.vue'

const showModal = ref(false)

const emit = defineEmits(['navigate'])

const closeModal = () => {
  showModal.value = false
}

const navigateToRecommend = () => {
  emit('navigate', 'recommend')
  closeModal()
}

const navigateToFreeNode = () => {
  emit('navigate', 'freenode')
  closeModal()
}

const show = () => {
  showModal.value = true
}

defineExpose({
  show
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(12px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
  padding: 16px;
  box-sizing: border-box;
}
.modal-content {
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--card-radius-lg);
  max-width: 460px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: var(--elevated-shadow);
  position: relative;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  animation: slideInUp 0.4s ease-out;
}
.modal-content::before {
  content: '';
  position: absolute;
  width: 48px;
  height: 48px;
  right: 4px;
  top: 8px;
  background: var(--orb-violet);
  border-radius: 9999px;
  filter: blur(12px);
  opacity: calc(var(--orb-opacity) * 0.7);
  z-index: 0;
  transition: all 0.5s;
}
.modal-content::after {
  content: '';
  position: absolute;
  width: 80px;
  height: 80px;
  right: 32px;
  top: 14px;
  background: var(--orb-rose);
  border-radius: 9999px;
  filter: blur(16px);
  opacity: calc(var(--orb-opacity) * 0.6);
  z-index: 0;
  transition: all 0.5s;
}
.modal-accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--main-gradient);
  z-index: 2;
}
.modal-header,
.modal-body,
.modal-footer {
  position: relative;
  z-index: 1;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid var(--border-primary);
}
.modal-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 700;
  background: var(--main-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}
.title-icon {
  -webkit-text-fill-color: initial;
  color: var(--text-accent);
}
.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: 50%;
  color: var(--text-secondary);
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
}
.close-btn svg {
  width: 20px;
  height: 20px;
}
.close-btn:hover {
  background: var(--background-tertiary);
  color: var(--text-primary);
  transform: scale(1.1);
}
.modal-body {
  padding: var(--spacing-xl);
  text-align: center;
}
.warning-icon {
  margin-bottom: var(--spacing-md);
  animation: pulse 2s infinite;
}
.warning-message {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  line-height: 1.6;
}
.features {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
.feature-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--background-tertiary);
  border-radius: 10px;
  border-left: 3px solid var(--text-accent);
  transition: all var(--transition-normal);
}
.feature-item:hover {
  transform: translateX(4px);
  border-left-color: var(--text-sub-accent);
}
.feature-icon {
  font-size: var(--font-size-base);
  flex-shrink: 0;
}
.feature-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
}
.feature-title {
  font-weight: 600;
  color: var(--text-primary);
  font-size: var(--font-size-sm);
}
.feature-desc {
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
}
.modal-footer {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl) var(--spacing-lg);
}
.btn-primary, .btn-secondary, .btn-free {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: 10px;
  font-size: var(--font-size-sm);
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  min-height: 42px;
}
.btn-primary {
  background: var(--main-gradient);
  color: var(--text-bright);
  box-shadow: var(--accent-shadow);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--sub-accent-shadow);
  background: var(--strong-gradient);
}
.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}
.btn-primary:hover::before {
  left: 100%;
}
.btn-free {
  background: var(--text-success);
  color: #fff;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}
.btn-free:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(34, 197, 94, 0.4);
}
.btn-secondary {
  background: var(--background-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}
.btn-secondary:hover {
  background: var(--surface-hover);
  border-color: var(--text-accent);
  transform: translateY(-1px);
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideInUp {
  from { opacity: 0; transform: translateY(40px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes pulse {
  0%,100% { transform: scale(1); opacity:1; }
  50% { transform: scale(1.05); opacity:0.85; }
}
@media (max-width: 480px) {
  .modal-content {
    width: 95%;
    max-height: calc(100vh - 16px);
  }
  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: var(--spacing-md);
    padding-right: var(--spacing-md);
  }
  .modal-footer {
    flex-direction: column;
  }
}
</style>
