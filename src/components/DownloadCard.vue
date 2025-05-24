<template>
  <div class="card">
    <div class="download-section">
      <h2>软件下载</h2>
      <p>选择适合你的客户端进行下载：</p>
      <div class="download-btn-group">
        <a class="download-btn" href="https://clashcn.com/clash-verge-rev-official" target="_blank">Clash Verge Rev（Clash中文网）</a>
        <a class="download-btn" href="https://getclashvergerev.org/download.html" target="_blank">Clash Verge Rev镜像下载</a>
        <a class="download-btn" href="https://github.com/Clash-Verge-rev/clash-verge-rev/releases" target="_blank">Clash Verge（Github Release）</a>
        <a class="download-btn" href="https://clashcn.com/clash-meta-for-android" target="_blank">Clash Meta中文网</a>
        <a class="download-btn" href="https://github.com/MetaCubeX/ClashMetaForAndroid/releases" target="_blank">Clash Meta for Android</a>
        <a class="download-btn" href="https://apps.apple.com/us/app/stash-rule-based-proxy/id1596063349" target="_blank">Stash (APPStore)</a>
        <a class="download-btn" href="https://apps.apple.com/us/app/shadowrocket/id932747118" target="_blank">Shadowrocket (APPStore)</a>
        <a class="download-btn" href="https://github.com/2dust/v2rayN/releases" target="_blank">v2rayN（Github Release）</a>
        <a class="download-btn" href="https://github.com/2dust/v2rayNG/releases" target="_blank">v2rayNG（Github Release）</a>
        <a class="download-btn" href="https://github.com/v2rayA/v2rayA/releases" target="_blank">V2raya (Linux)</a>
        <a class="download-btn" href="https://github.com/SagerNet/sing-box" target="_blank">sing-box</a>
      </div>
      <p class="note">* 请注意，部分客户端可能需要科学上网环境才能访问下载链接。</p>
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

.download-section h2 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #fff;
  font-size: 1.5em;
}

.download-section p {
  margin-bottom: 16px;
  color: #e0e0e0;
}

.download-btn-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.download-btn {
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

.download-btn:hover {
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
  .download-btn-group {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 767px) {
  .card {
    padding: 20px;
  }
  .download-btn-group {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .download-btn {
    height: 40px;
    padding: 10px 16px;
  }
}
</style>
<script setup lang="ts">
</script>