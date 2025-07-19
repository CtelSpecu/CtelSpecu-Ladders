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
            <span><strong>不经常使用，可以购买长期流量</strong>；<br>如果经常使用，可以按月购买</span>
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
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  animation: slideInUp 0.4s ease-out;
  position: relative;
}

.modal-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #43e97b 100%);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-title {
  margin: 0;
  font-size: 1.5em;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  color: #666;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #333;
  transform: scale(1.1);
}

.modal-body {
  padding: 32px;
  text-align: center;
}

.warning-icon {
  margin-bottom: 24px;
  animation: bounce 2s infinite;
}

.warning-message {
  font-size: 1.1em;
  color: #333;
  margin-bottom: 32px;
  line-height: 1.6;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.feature-icon {
  font-size: 1.2em;
}

.modal-footer {
  display: flex;
  gap: 16px;
  padding: 0 32px 32px;
}

.btn-primary, .btn-secondary, .btn-free {
  flex: 1;
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  transition: all 0.2s ease;
  display: inline-block;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.btn-free {
  background: linear-gradient(135deg, #00c851 0%, #007e33 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 200, 81, 0.3);
}

.btn-free:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 200, 81, 0.4);
}

.btn-secondary {
  background: #f8f9fa;
  color: #666;
  border: 2px solid #e9ecef;
}

.btn-secondary:hover {
  background: #e9ecef;
  color: #333;
  transform: translateY(-1px);
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

@media (max-width: 600px) {
  .modal-content {
    width: 95%;
    margin: 20px;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: 20px;
    padding-right: 20px;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .features {
    gap: 12px;
  }
  
  .feature-item {
    padding: 10px 12px;
  }
}
</style>
