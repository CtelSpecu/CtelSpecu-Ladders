<template>
  <div class="card subscription-card">
    <h2>{{ subscriptionName }}</h2>
    <div class="subscription-link-area">
      <textarea
          ref="subscriptionLinkTextarea"
          readonly
          :value="props.subscriptionLink"
      ></textarea>
      <button @click="copySubscriptionLink">复制链接</button>
    </div>

    <div class="import-buttons">
      <button @click="importToClient('Clash')">导入至Clash</button>&nbsp;&nbsp;
      <button @click="importToClient('sing-box')">导入至sing-box</button>&nbsp;&nbsp;
      <button @click="importToClient('Shadowrocket')">导入至Shadowrocket</button>&nbsp;&nbsp;
      <button @click="importToClient('Loon')">导入至Loon</button>
    </div>

    <div class="subscription-info">
      <p>流量使用: {{ props.trafficUsage }}</p>
      <p>套餐到期: {{ props.expireDate }}</p>
      <p>最大速率： {{ props.maximumRate }}</p>
    </div>

    <div v-if="notificationVisible" :class="notificationClass" class="notification-box">
      <p class="notification-message">{{ notificationMessage }}</p>
      <div class="notification-progress-bar"> <div class="notification-progress-bar-inner"></div> </div>
      <button class="notification-close-button" @click="closeNotification">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17.5 17.5L6.5 6.5M17.5 6.5L6.5 17.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  subscriptionName: String,
  subscriptionLink: String,
  trafficUsage: String,
  expireDate: String,
  maximumRate: String
});

const subscriptionLinkTextarea = ref(null);

// 新增：控制提示框显示和隐藏的 ref 变量
const notificationVisible = ref(false);
// 新增：存储提示信息的 ref 变量
const notificationMessage = ref('');
// 新增：控制提示框样式的 ref 变量
const notificationClass = ref('');
// 新增：复制链接点击计数器
const copyLinkCounter = ref(0);


function showNotification(message, type = 'default') { // type 参数控制样式
  notificationMessage.value = message;
  notificationVisible.value = true;

  if (type === 'success') {
    notificationClass.value = 'success-notification-box'; // 绿色成功样式
  } else if (type === 'error_first_copy') {
    notificationClass.value = 'error-notification-box'; // 红色首次复制成功样式 (根据您的需求定义)
  } else {
    notificationClass.value = 'default-notification-box'; // 默认样式，如果您还需要其他类型的通知
  }


  setTimeout(() => {
    notificationVisible.value = false;
  }, 3000);
}

function closeNotification() {
  notificationVisible.value = false;
}


function copySubscriptionLink() {
  if (subscriptionLinkTextarea.value) {
    subscriptionLinkTextarea.value.select();
    document.execCommand('copy');
    copyLinkCounter.value++; // 增加计数器

    if (copyLinkCounter.value === 1) {
      showNotification('订阅链接已复制到剪贴板！', 'error_first_copy'); // 首次复制，红色
    } else {
      showNotification('订阅链接已复制到剪贴板！', 'success'); // 后续复制，绿色
    }
  }
}

function importToClient(clientName) {
  let importUrl = '';
  if (clientName === 'Clash') {
    importUrl = `clash://install-config?url=${encodeURIComponent(props.subscriptionLink)}`;
  } else if (clientName === 'sing-box') {
    importUrl = `sing-box://import?url=${encodeURIComponent(props.subscriptionLink)}`;
  } else if (clientName === 'Shadowrocket') {
    importUrl = `shadowrocket://add/server?url=${encodeURIComponent(props.subscriptionLink)}`;
  } else if (clientName === 'Loon') {
    importUrl = `loon://import?url=${encodeURIComponent(props.subscriptionLink)}`;
  }

  if (importUrl) {
    window.open(importUrl, '_blank');
  } else {
    alert(`暂不支持直接导入到 ${clientName}，请手动复制订阅链接导入。`);
  }
}
</script>

<style scoped>
/* 样式保持不变 */
.subscription-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  position: relative; /*  设置为 relative，方便 notification-box 定位 */
}

.subscription-card h2 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  text-align: center;
}

.subscription-link-area {
  display: flex;
  margin-bottom: 15px;
}

.subscription-link-area textarea {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
  font-size: 0.9em;
}

.subscription-link-area button {
  margin-left: 10px;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}

.subscription-link-area button:hover {
  background-color: #0056b3;
}

.import-buttons {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.import-buttons button {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  background-color: #28a745;
  color: #fff;
  cursor: pointer;
  font-size: 0.9em;
}

.import-buttons button:hover {
  background-color: #1e7e34;
}

.subscription-info {
  margin-top: 10px;
  font-size: 0.95em;
  color: #555;
  text-align: center;
}


/* 默认提示框样式 (红色 - 用于首次复制成功) */
.notification-box.error-notification-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 15px;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #721c24; /* 深红色文字 */
  border-radius: 4px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  z-index: 10;
}

.notification-box.error-notification-box .notification-message,
.notification-box.error-notification-box .notification-close-button,
.notification-box.error-notification-box .notification-close-button svg {
  color: #721c24;
}


/* 成功提示框样式 (绿色 - 用于后续复制成功) */
.notification-box.success-notification-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 15px;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  border-radius: 4px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  z-index: 10;
}

.notification-box.success-notification-box .notification-message,
.notification-box.success-notification-box .notification-close-button,
.notification-box.success-notification-box .notification-close-button svg{
  color: #155724;
}


/*  基础 notification-box 样式，可以用于其他类型的通知，目前未使用，您可以根据需要扩展 */
.notification-box.default-notification-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 15px;
  background-color: #d4edda;
  border: 1px solid ;
  color: #333;
  border-radius: 4px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  z-index: 10;
}

.notification-box.default-notification-box .notification-message,
.notification-box.default-notification-box .notification-close-button,
.notification-box.default-notification-box .notification-close-button svg {
  color: #333;
}


.notification-box .notification-message {
  margin: 0;
  font-size: 0.95em;
}

.notification-box .notification-close-button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 10px;
  opacity: 0.7;
  transition: opacity 0.2s ease-in-out;
}

.notification-box .notification-close-button:hover {
  opacity: 1;
}

.notification-box .notification-close-button svg {
  width: 16px;
  height: 16px;
  display: block;
}

/* 进度条样式 (所有通知框通用) */
.notification-progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 0 0 4px 4px;
  overflow: hidden;
}

.notification-progress-bar-inner {
  height: 100%;
  width: 100%;
  background-color: currentColor; /*  继承 notification-box 的文字颜色 */
  border-radius: 0 0 4px 4px;
  transform-origin: right center;
  animation: progress-bar-countdown 3s linear forwards;
}

@keyframes progress-bar-countdown {
  0% {
    transform: scaleX(1);
  }
  100% {
    transform: scaleX(0);
  }
}

</style>