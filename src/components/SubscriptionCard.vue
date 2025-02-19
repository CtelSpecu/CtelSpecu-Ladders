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
      <button @click="importToClient('Clash')">导入至Clash</button>
      <button @click="importToClient('sing-box')">导入至sing-box</button>
      <button @click="importToClient('Shadowrocket')">导入至Shadowrocket</button>
      <button @click="importToClient('Loon')">导入至Loon</button>
    </div>

    <div class="subscription-info" v-if="subscriptionData">
      <p v-if="subscriptionData.usage">流量使用: {{ subscriptionData.usage }}</p>
      <p v-if="subscriptionData.expire">到期时间: {{ subscriptionData.expire }}</p>
      <p v-if="subscriptionData.resetDay">距离下次重置剩余： {{ subscriptionData.resetDay }}</p>
    </div>
    <div class="subscription-info" v-else-if="error && !notificationVisible">
      <p style="color: red;">获取订阅信息失败，请稍后重试。</p>
    </div>
    <div class="subscription-info" v-else-if="!notificationVisible">
      <p>正在加载订阅信息...</p>
    </div>

    <div v-if="notificationVisible" class="notification-box">
      <p class="notification-message">{{ notificationMessage }}</p>
      <div class="notification-progress-bar"> <div class="notification-progress-bar-inner"></div> </div>
      <button class="notification-close-button" @click="closeNotification">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17.5 17.5L6.5 6.5M17.5 6.5L6.5 17.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  subscriptionName: String,
  subscriptionLink: String,
  subscriptionDataFile: String,
});

const subscriptionLinkTextarea = ref(null);
const subscriptionData = ref(null);
const error = ref(false);

// 新增：控制提示框显示和隐藏的 ref 变量
const notificationVisible = ref(false);
// 新增：存储提示信息的 ref 变量
const notificationMessage = ref('');


onMounted(async () => {
  await fetchCachedSubscriptionInfo();
});

async function fetchCachedSubscriptionInfo() {
  try {
    const response = await axios.get(props.subscriptionDataFile); // 请求仓库中的 JSON 文件
    const cachedData = response.data; // 获取 JSON 数据

    if (cachedData && cachedData.subscriptionContentBase64) {
      const decodedString = atob(cachedData.subscriptionContentBase64);
      console.log("Decoded Subscription Data from Cache:", decodedString);

      if (decodedString.startsWith('mixed-port')) {
        parseClashYamlInfo(decodedString);
      } else if (decodedString.startsWith('trojan://') || decodedString.startsWith('vmess://') || decodedString.startsWith('vless://') || decodedString.startsWith('ss://')) {
        parseTrojanListInfo(decodedString);
      } else {
        error.value = true;
        console.error("未知订阅格式 (缓存数据)");
        // 修改：不再使用 alert，显示自定义提示框
        showNotification("未知订阅格式 (缓存数据)，请检查缓存数据或联系管理员。");
      }
    } else {
      error.value = true;
      console.error("缓存数据格式错误或缺少订阅内容");
      // 修改：不再使用 alert，显示自定义提示框
      showNotification("缓存数据格式错误或缺少订阅内容，请检查缓存数据或稍后重试。(不代表订阅不可用)");
    }
  } catch (e) {
    console.error("获取缓存订阅信息失败:", e);
    error.value = true;
    // 修改：不再使用 alert，显示自定义提示框
    showNotification("获取缓存订阅信息失败，请稍后重试。");
  }
}

function showNotification(message, type = 'error') { // 新增 type 参数，默认为 'error'
  notificationMessage.value = message;
  notificationVisible.value = true;

  // 根据 type 参数动态设置提示框 class
  let notificationBoxElement = document.querySelector('.notification-box'); // 先尝试获取已有的 .notification-box 元素

  if (!notificationBoxElement) { // 如果 .notification-box 不存在，尝试获取 .success-notification-box
    notificationBoxElement = document.querySelector('.success-notification-box');
  }

  if (notificationBoxElement) { // 确保找到 notificationBoxElement 才进行操作
    if (type === 'success') {
      notificationBoxElement.classList.remove('notification-box'); // 移除 error 样式，如果存在
      notificationBoxElement.classList.add('success-notification-box'); // 添加 success 样式
    } else { // 默认为 'error' 类型，保持原有的 .notification-box 样式
      notificationBoxElement.classList.remove('success-notification-box'); // 移除 success 样式，如果存在
      notificationBoxElement.classList.add('notification-box'); // 确保添加 notification-box 样式
    }
  } else {
    console.warn("找不到 notification-box 元素，无法应用样式"); // 打印警告信息，方便调试
    // 在找不到元素的情况下，你可能需要考虑如何处理，例如创建并插入一个新的提示框元素
  }


  setTimeout(() => {
    notificationVisible.value = false; // 3秒后自动隐藏
  }, 3000);
}

function closeNotification() {
  notificationVisible.value = false; // 手动关闭提示框
}


function parseTrojanListInfo(decodedString) {
  const lines = decodedString.split('\n');
  let usageInfo = null;
  let resetDayInfo = null;

  for (const line of lines) {
    if (line.startsWith('trojan://')) {
      try {
        const url = new URL(line);
        const hash = decodeURIComponent(url.hash.substring(1));
        if (hash.includes('剩余流量')) {
          const usageMatch = hash.match(/剩余流量：([\d.]+)\s*GB/);
          if (usageMatch) {
            usageInfo = usageMatch[1] + ' GB';
          }
        }
        if (hash.includes('距离下次重置剩余')) {
          const resetDayMatch = hash.match(/距离下次重置剩余：(\d+)\s*天/);
          if (resetDayMatch) {
            resetDayInfo = resetDayMatch[1] + ' 天';
          }
        }
      } catch (e) {
        console.error("解析 Trojan 链接出错:", e);
      }
    }
    // 可以添加其他协议 (vmess, vless, ss) 的解析逻辑，如果你的订阅包含这些类型
  }

  if (usageInfo || resetDayInfo) {
    subscriptionData.value = {
      usage: usageInfo,
      resetDay: resetDayInfo,
      //  你可能还需要提取和显示 "套餐到期" 信息，如果 Trojan 链接中有提供
    };
  } else {
    error.value = true;
    console.error("未在 Trojan 链接中解析到流量或到期时间信息 (缓存数据)");
    showNotification("未在 Trojan 链接中解析到流量或到期时间信息 (缓存数据)。"); // 也可选择显示提示，或不显示
  }
}


function parseClashYamlInfo(decodedString) {
  let usageInfo = null;
  let expireTimeInfo = null;

  const lines = decodedString.split('\n');
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('- name:')) {
      const nameValue = trimmedLine.substring(trimmedLine.indexOf(':') + 1).trim().replace(/['"]/g, '');
      if (nameValue.includes('剩余流量')) {
        const usageMatch = nameValue.match(/剩余流量：([\d.]+)\s*GB/);
        if (usageMatch) {
          usageInfo = usageMatch[1] + ' GB';
        }
      } else if (nameValue.includes('套餐到期')) {
        const expireMatch = nameValue.match(/套餐到期：([\d-]+)/);
        if (expireMatch) {
          expireTimeInfo = expireMatch[1];
        }
      }
    }
  }

  if (usageInfo || expireTimeInfo) {
    subscriptionData.value = {
      usage: usageInfo,
      expire: expireTimeInfo,
    };
  } else {
    error.value = true;
    console.error("未在 Clash YAML 中解析到流量或到期时间信息 (缓存数据)");
    showNotification("未在 Clash YAML 中解析到流量或到期时间信息 (缓存数据)。"); // 也可选择显示提示，或不显示
  }
}


function copySubscriptionLink() {
  if (subscriptionLinkTextarea.value) {
    subscriptionLinkTextarea.value.select();
    document.execCommand('copy');
    // alert('订阅链接已复制到剪贴板！'); //  原先的弹窗提示
    showNotification('订阅链接已复制到剪贴板！', 'success'); // 指定使用 'success' 类型的绿色提示框
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
    alert(`暂不支持直接导入到 ${clientName}，请手动复制订阅链接导入。`); // 导入失败提示仍然保留 alert，可考虑替换
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


/* 默认提示框样式 (例如，用于错误或警告) - 保持红色系 */
.notification-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 15px;
  background-color: #f8d7da; /* 淡红色背景 */
  border: 1px solid #f5c6cb; /* 边框 */
  color: #721c24; /* 深红色文字 */
  border-radius: 4px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  z-index: 10;
}

.notification-box .notification-message {
  margin: 0;
  font-size: 0.95em;
}

.notification-box .notification-close-button {
  background: transparent;
  border: none;
  color: #721c24;
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


/* 新增：成功提示框样式 - 绿色系 */
.success-notification-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 15px;
  background-color: #d4edda; /* 淡绿色背景 -  与之前的代码一致，如果你需要更深的绿色，可以调整这里，例如 #e6f7ec */
  border: 1px solid #c3e6cb; /* 绿色边框 -  与之前的代码一致，如果你需要更深的绿色，可以调整这里，例如 #9ae1b3 */
  color: #155724; /* 深绿色文字 -  与之前的代码一致，如果你需要更深的绿色，可以调整这里，例如 #004d1a */
  border-radius: 4px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  z-index: 10;
}

.success-notification-box .notification-message { /* 确保信息文字样式也应用到新的类 */
  margin: 0;
  font-size: 0.95em;
}

.success-notification-box .notification-close-button { /* 确保关闭按钮样式也应用到新的类 */
  background: transparent;
  border: none;
  color: #155724; /* 深绿色关闭按钮颜色 -  与之前的代码一致，如果你需要更深的绿色，可以调整这里 */
  cursor: pointer;
  padding: 0;
  margin-left: 10px;
  opacity: 0.7;
  transition: opacity 0.2s ease-in-out;
}

.success-notification-box .notification-close-button:hover {
  opacity: 1;
}

.success-notification-box .notification-close-button svg { /* 确保 SVG 样式也应用到新的类 */
  width: 16px;
  height: 16px;
  display: block;
}

/* 进度条样式 */
.notification-progress-bar {
  position: absolute; /* 绝对定位，相对于 notification-box */
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5px; /* 进度条高度 */
  background-color: rgba(0, 0, 0, 0.1); /* 浅灰色背景，可以根据提示框颜色调整 */
  border-radius: 0 0 4px 4px; /* 与提示框底部圆角一致 */
  overflow: hidden; /* 裁剪超出容器的内容，保证进度条动画效果 */
}

.notification-progress-bar-inner {
  height: 100%;
  width: 100%; /* 初始宽度 100% */
  background-color: currentColor; /* 使用 notification-box 的文字颜色作为进度条颜色，保持一致性 */
  border-radius: 0 0 4px 4px; /* 与容器底部圆角一致 */
  transform-origin: right center; /* 动画基点设置为右侧中心 */
  animation: progress-bar-countdown 3s linear forwards; /* 应用动画 */
}

@keyframes progress-bar-countdown {
  0% {
    transform: scaleX(1); /* 初始宽度 100% */
  }
  100% {
    transform: scaleX(0); /* 最终宽度 0% */
  }
}

</style>