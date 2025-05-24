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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 30px;
  color: white;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.08), transparent);
  transform: rotate(45deg);
  transition: all 0.6s ease;
  opacity: 0;
}

.card:hover::before {
  opacity: 1;
  animation: shine 1.5s ease-in-out;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 50px rgba(0,0,0,0.2);
}

@keyframes shine {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.tutorial-section h2 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #fff;
  font-size: 1.5em;
}

.tutorial-section p {
  margin-bottom: 16px;
  color: #e0e0e0;
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
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(67, 233, 123, 0.08);
  text-decoration: none;
}

.tutorial-btn:hover {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(67, 233, 123, 0.18);
}

.note {
  font-size: 0.95em;
  color: #e0e0e0;
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
