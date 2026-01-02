<template>
  <div v-if="showModal" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">🚀 客户端更新提醒</h2>
        <button class="close-btn" @click="closeModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="update-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="#ffd700"/>
          </svg>
        </div>
        
        <p class="update-message">
          为了获得最佳体验，建议您下载最新版本的 <strong>Clash Verge Rev</strong> 客户端！
        </p>
        
        <div class="features">
          <div class="feature-item">
            <span class="feature-icon">✨</span>
            <span>更好的性能优化</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🔧</span>
            <span>修复致命漏洞</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🎨</span>
            <span>全新界面设计</span>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn-secondary" @click="closeModal">
          稍后提醒
        </button>
        <a 
          href="https://github.com/Clash-Verge-rev/clash-verge-rev/releases" 
          target="_blank" 
          class="btn-primary"
          @click="closeModal"
        >
          立即更新
        </a>
      </div>
      
      <div class="modal-bottom">
        <label class="checkbox-container">
          <input type="checkbox" v-model="dontShowAgain" />
          <span class="checkmark"></span>
          不再显示此提醒
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const showModal = ref(false)
const dontShowAgain = ref(false)

const STORAGE_KEY = 'clash-update-modal-dismissed'

const closeModal = () => {
  showModal.value = false
  if (dontShowAgain.value) {
    localStorage.setItem(STORAGE_KEY, 'true')
  }
}

onMounted(() => {
  // 检查是否已经选择不再显示
  const dismissed = localStorage.getItem(STORAGE_KEY)
  if (!dismissed) {
    showModal.value = true
  }
})

// 监听复选框变化，如果取消勾选则清除存储
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
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
  padding: var(--spacing-md);
  box-sizing: border-box;
}

.modal-content {
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  padding: 0;
  max-width: 420px;
  width: 100%;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  animation: slideInUp 0.4s ease-out;
  position: relative;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.modal-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--main-gradient);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
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
  padding: var(--spacing-lg);
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
  line-height: 1.5;
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
  border-radius: 8px;
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
  padding: var(--spacing-md) var(--spacing-lg);
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: 8px;
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
  min-height: 40px;
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
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-secondary {
  background: var(--background-tertiary);
  color: var(--text-primary);
  border: 2px solid var(--border-primary);
}

.btn-secondary:hover {
  background: var(--background-trans);
  border-color: var(--text-accent);
  transform: translateY(-1px);
}

.modal-bottom {
  padding: var(--spacing-sm) var(--spacing-lg) var(--spacing-md);
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
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
  60% {
    transform: translateY(-4px);
  }
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: var(--spacing-sm);
  }
  
  .modal-content {
    max-height: calc(100vh - 16px);
  }
  
  .modal-header {
    padding: var(--spacing-sm) var(--spacing-md);
  }
  
  .modal-title {
    font-size: var(--font-size-base);
  }
  
  .modal-body {
    padding: var(--spacing-md);
  }
  
  .update-icon svg {
    width: 40px;
    height: 40px;
  }
  
  .update-message {
    font-size: var(--font-size-xs);
  }
  
  .features {
    gap: var(--spacing-xs);
  }
  
  .feature-item {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-xs);
  }
  
  .modal-footer {
    padding: var(--spacing-sm) var(--spacing-md);
    gap: var(--spacing-xs);
  }
  
  .btn-primary, .btn-secondary {
    min-height: 36px;
    font-size: var(--font-size-xs);
    padding: var(--spacing-xs) var(--spacing-sm);
  }
  
  .modal-bottom {
    padding: var(--spacing-xs) var(--spacing-md) var(--spacing-sm);
  }
}

@media (max-height: 600px) {
  .modal-content {
    max-height: calc(100vh - 16px);
  }
  
  .update-icon {
    display: none;
  }
  
  .modal-body {
    padding: var(--spacing-sm) var(--spacing-md);
  }
  
  .update-message {
    margin-bottom: var(--spacing-sm);
  }
}
</style>
