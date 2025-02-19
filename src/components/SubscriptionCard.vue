<template>
  <div class="card subscription-card">
    <h2>{{ subscriptionName }}</h2>
    <div class="subscription-link-area">
      <textarea
          ref="subscriptionLinkTextarea"
          readonly
          :value="subscriptionLink"
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
    <div class="subscription-info" v-else-if="error">
      <p style="color: red;">获取订阅信息失败，请稍后重试。</p>
    </div>
    <div class="subscription-info" v-else>
      <p>正在加载订阅信息...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  subscriptionName: String,
  subscriptionLink: String,
});

const subscriptionLinkTextarea = ref(null);
const subscriptionData = ref(null);
const error = ref(false);

onMounted(async () => {
  await fetchSubscriptionInfo();
});

async function fetchSubscriptionInfo() {
  try {
    const response = await axios.get(props.subscriptionLink, { responseType: 'text' }); // 获取文本响应
    const base64String = response.data;
    const decodedString = atob(base64String); // Base64 解码
    console.log("Decoded Subscription Data:", decodedString); // 打印解码后的数据

    if (decodedString.startsWith('mixed-port')) {
      // Clash YAML 格式
      parseClashYamlInfo(decodedString);
    } else if (decodedString.startsWith('trojan://') || decodedString.startsWith('vmess://') || decodedString.startsWith('vless://') || decodedString.startsWith('ss://')) {
      // Trojan/VMess/VLESS/Shadowsocks 链接列表格式 (这里只处理 Trojan 示例，你可以扩展到其他类型)
      parseTrojanListInfo(decodedString);
    } else {
      error.value = true;
      console.error("未知订阅格式");
      alert("未知订阅格式，请检查订阅链接或联系管理员。");
    }

  } catch (e) {
    console.error("获取订阅信息失败:", e);
    error.value = true;
  }
}

function parseTrojanListInfo(decodedString) {
  const lines = decodedString.split('\n');
  let usageInfo = null;
  let resetDayInfo = null;

  for (const line of lines) {
    if (line.startsWith('trojan://')) {
      try {
        const url = new URL(line);
        const hash = decodeURIComponent(url.hash.substring(1)); // 获取 # 后面的内容并解码
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
    error.value = true; // 如果没有解析到流量或到期时间，也显示错误
    console.error("未在 Trojan 链接中解析到流量或到期时间信息");
  }
}


function parseClashYamlInfo(decodedString) {
  let usageInfo = null;
  let expireTimeInfo = null;

  const lines = decodedString.split('\n');
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('- name:')) {
      const nameValue = trimmedLine.substring(trimmedLine.indexOf(':') + 1).trim().replace(/['"]/g, ''); // 提取 name 值并去除引号
      if (nameValue.includes('剩余流量')) {
        const usageMatch = nameValue.match(/剩余流量：([\d.]+)\s*GB/);
        if (usageMatch) {
          usageInfo = usageMatch[1] + ' GB';
        }
      } else if (nameValue.includes('套餐到期')) {
        const expireMatch = nameValue.match(/套餐到期：([\d-]+)/); // 假设日期格式为 YYYY-MM-DD 或 YYYY-MM-DD HH:mm:ss
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
    error.value = true; // 如果没有解析到流量或到期时间，也显示错误
    console.error("未在 Clash YAML 中解析到流量或到期时间信息");
  }
}


function copySubscriptionLink() {
  if (subscriptionLinkTextarea.value) {
    subscriptionLinkTextarea.value.select();
    document.execCommand('copy');
    alert('订阅链接已复制到剪贴板！');
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
</style>