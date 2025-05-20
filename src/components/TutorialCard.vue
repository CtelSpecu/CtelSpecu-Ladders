<template>
  <div class="card">
    <div class="tutorial-section">
      <h2>各平台教程</h2>
      <p>选择适合你的平台或系统，快速跳转到教程页面。</p>
      <div class="tutorial-btn-group">
        <a class="tutorial-btn" href="https://ny05pu.mikasadocs.com" target="_blank">教程官网</a>
        <a class="tutorial-btn" href="https://8mkhkm.mikasadocs.com/tutorials/windows/clash-verge/" target="_blank">Clash Verge Windows</a>
        <a class="tutorial-btn" href="https://5s63qp.mikasadocs.com/tutorials/windows/v2rayn6/" target="_blank">v2rayN Windows</a>
        <a class="tutorial-btn" href="https://8mkhkm.mikasadocs.com/tutorials/macos/clash-verge/" target="_blank">Clash Verge MacOS</a>
        <a class="tutorial-btn" href="https://iqrclj.mikasadocs.com/tutorials/macos/v2rayN7/" target="_blank">v2rayN MacOS</a>
        <a class="tutorial-btn" href="https://8mkhkm.mikasadocs.com/tutorials/ios/shadowrocket/" target="_blank">Shadowrocket iOS</a>
        <a class="tutorial-btn" href="https://8mkhkm.mikasadocs.com/tutorials/android/clash-meta-for-android/" target="_blank">Clash Meta for Android</a>
        <a class="tutorial-btn" href="https://clash-verge-rev.org/guide/term.html" target="_blank">Clash 名词解释</a>
        <a class="tutorial-btn" href="https://v2rayn.org" target="_blank">v2rayN 使用教程配置从入门到精通</a>
        <a class="tutorial-btn" href="https://www.linuxcross.com" target="_blank">科学上网指南&软件推荐与测评</a>
      </div>
      <p class="note">* 请根据网络情况自行选择客户端。</p>
    </div>
  </div>
</template>

<style scoped>
.card {
  background-color: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.tutorial-section h2 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #333;
  font-size: 1.5em;
}

.tutorial-section p {
  margin-bottom: 16px;
  color: #666;
}

.tutorial-btn-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.tutorial-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 12px 16px;
  font-size: 0.95em;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 44px;
}

.tutorial-btn:hover {
  background-color: #0056b3;
  text-decoration: none;
}

.note {
  font-size: 0.9em;
  color: #666;
  margin-top: 16px;
  margin-bottom: 0;
}

@media (max-width: 1199px) {
  .tutorial-btn-group {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 767px) {
  .card {
    padding: 20px;
  }

  .tutorial-btn-group {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .tutorial-btn {
    height: 40px;
    padding: 10px 16px;
  }
}
</style>

<script setup>
</script>
