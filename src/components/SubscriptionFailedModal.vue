<template>
  <div v-if="showModal" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>      <div class="modal-header">
        <h2 class="modal-title">⚠️ 订阅不可用</h2>
        <button class="close-btn" @click="closeModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="warning-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
          <p class="warning-message">
          抱歉，该订阅已不可用。为了获得更好的网络体验，建议您选择以下方案：
        </p>
        
        <div class="features">
          <div class="feature-item">
            <span class="feature-icon">机场推荐</span>
            <span><strong class="force-bold">不经常使用，可以购买长期流量</strong>；<br>如果经常使用，可以按月购买</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">免费节点</span>
            <span>免费体验，无需付费，每日更新<br>速度慢,延时高，可能有不安全</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">其他类型</span>
            <span>免费可用的VPN<br>灵活性和可操作性没有机场灵活</span>
          </div>
        </div>
      </div>
        <div class="modal-footer">
        <button class="btn-secondary" @click="closeModal">
          知道了
        </button>
        <button class="btn-free" @click="navigateToFreeNode">
          免费订阅
        </button>
        <button class="btn-primary" @click="navigateToRecommend">
          购买机场
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 20px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
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
  height: 4px;
  background: var(--main-gradient);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xl) var(--spacing-2xl) var(--spacing-lg);
  border-bottom: 1px solid var(--border-primary);
}

.modal-title {
  margin: 0;
  font-size: var(--font-size-xl);
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
  padding: var(--spacing-md);
  border-radius: 50%;
  color: var(--text-secondary);
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: var(--background-tertiary);
  color: var(--text-primary);
  transform: scale(1.1);
}

.modal-body {
  padding: var(--spacing-2xl);
  text-align: center;
}

.warning-icon {
  margin-bottom: 24px;
  animation: bounce 2s infinite;
}

.warning-message {
  font-size: var(--font-size-base);
  color: var(--text-primary);
  margin-bottom: var(--spacing-2xl);
  line-height: 1.6;
}

.features {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--background-tertiary);
  border-radius: 12px;
  border-left: 4px solid var(--text-accent);
  transition: all var(--transition-normal);
}

.feature-item:hover {
  transform: translateX(4px);
  border-left-color: var(--text-sub-accent);
}

.feature-icon {
  font-size: var(--font-size-lg);
  color: var(--text-accent);
}

.modal-footer {
  display: flex;
  gap: var(--spacing-md);
  padding: 0 var(--spacing-2xl) var(--spacing-xl);
}

.btn-primary, .btn-secondary, .btn-free {
  flex: 1;
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  border-radius: 12px;
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  transition: all var(--transition-normal);
  display: inline-block;
  position: relative;
  overflow: hidden;
  min-height: 48px;
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

.btn-free {
  background: var(--text-success);
  color: var(--text-bright);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.btn-free:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(34, 197, 94, 0.4);
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

.force-bold {
  font-weight: 700 !important;
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
  .modal-content {
    width: 95%;
    margin: var(--spacing-lg);
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: var(--spacing-lg);
    padding-right: var(--spacing-lg);
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .features {
    gap: var(--spacing-sm);
  }
  
  .feature-item {
    padding: var(--spacing-md);
  }
}
</style>
