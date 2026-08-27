<template>
  <div v-if="showModal" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-accent"></div>
      <div class="modal-header">
        <h2 class="modal-title">
          <VueIcon class="title-icon" icon="rocket" aria-label="客户端更新提醒" />
          客户端更新提醒
        </h2>
        <button class="close-btn" @click="closeModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="update-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z" fill="var(--text-accent)" />
          </svg>
        </div>
        <p class="update-message">
          检测到 Clash 客户端有更新，建议及时升级以获得更好的使用体验和安全性。
        </p>
        <div class="features">
          <div class="feature-item">
            <span class="feature-icon">🚀</span>
            <span>性能优化与新功能</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🛡️</span>
            <span>安全性增强</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🐛</span>
            <span>问题修复</span>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn-secondary" @click="closeModal">稍后提醒</button>
        <button class="btn-primary" @click="goToClients">立即查看</button>
      </div>
      
      <div class="modal-bottom">
        <label class="checkbox-container">
          <input type="checkbox" v-model="dontShowAgain" />
          <span class="checkmark"></span>
          不再显示
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, onMounted, watch } from 'vue'
import VueIcon from './VueIcon.vue'

const showModal = ref(false)
const dontShowAgain = ref(false)
const navigate = inject('navigate', null)

const STORAGE_KEY = 'clash-update-modal-dismissed'

const closeModal = () => {
  showModal.value = false
  if (dontShowAgain.value) {
    localStorage.setItem(STORAGE_KEY, 'true')
  }
}

const goToClients = () => {
  closeModal()
  if (typeof navigate === 'function') {
    navigate('guide')
  }
}

onMounted(() => {
  const dismissed = localStorage.getItem(STORAGE_KEY)
  if (!dismissed) {
    showModal.value = true
  }
})

watch(dontShowAgain, (newValue) => {
  if (!newValue) {
    localStorage.removeItem(STORAGE_KEY)
  }
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
.modal-footer,
.modal-bottom {
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
  flex-shrink: 0;
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
.update-icon {
  margin-bottom: var(--spacing-md);
}
.update-icon svg {
  width: 48px;
  height: 48px;
  animation: bounce 2s infinite;
}
.update-message {
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
  font-size: var(--font-size-sm);
}
.feature-item:hover {
  transform: translateX(4px);
  border-left-color: var(--text-sub-accent);
}
.feature-icon {
  font-size: var(--font-size-base);
  color: var(--text-accent);
  flex-shrink: 0;
}
.modal-footer {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl) var(--spacing-lg);
}
.btn-primary,
.btn-secondary {
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
.modal-bottom {
  padding: var(--spacing-sm) var(--spacing-xl) var(--spacing-md);
  border-top: 1px solid var(--border-primary);
}
.checkbox-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  justify-content: center;
}
.checkbox-container input[type="checkbox"] {
  display: none;
}
.checkmark {
  width: 16px;
  height: 16px;
  border: 2px solid var(--border-primary);
  border-radius: 4px;
  position: relative;
  transition: all var(--transition-normal);
  flex-shrink: 0;
}
.checkbox-container input[type="checkbox"]:checked + .checkmark {
  background: var(--main-gradient);
  border-color: var(--text-accent);
}
.checkbox-container input[type="checkbox"]:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideInUp {
  from { opacity: 0; transform: translateY(40px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes bounce {
  0%,20%,50%,80%,100% { transform: translateY(0); }
  40% { transform: translateY(-8px); }
  60% { transform: translateY(-4px); }
}
@media (max-width: 480px) {
  .modal-content {
    width: 95%;
    max-height: calc(100vh - 16px);
  }
  .modal-header,
  .modal-body,
  .modal-footer,
  .modal-bottom {
    padding-left: var(--spacing-md);
    padding-right: var(--spacing-md);
  }
}
</style>
