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
  background-color: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.download-section h2 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #333;
  font-size: 1.5em;
}

.download-section p {
  margin-bottom: 16px;
  color: #666;
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

.download-btn:hover {
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