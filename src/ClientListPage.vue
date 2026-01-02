<template>
  <div class="client-list-page">
    <h1 class="page-title">科学上网客户端大全</h1>
    
    <div class="client-content">
      <section class="client-section intro-section">
        <p class="section-description">
          除了 Windows 系统电脑客户端 v2rayN 之外，分享更多 Windows 代理软件，以及不同平台及设备下的推荐科学上网代理软件，可根据使用平台及使用场景来选择适合的客户端。
        </p>
        <p class="section-description">
          选择不同的客户端之前，首先需要确认该客户端是否支持节点即代理服务器提供的协议，如 v2rayN 支持 VMess、VLESS、Trojan、Socks、Shadowsocks、Hysteria2、Tuic 等代理协议，所以需要确认选择的客户端是否支持服务器提供的协议。
        </p>
      </section>

      <section class="client-section">
        <h2>科学上网客户端列表</h2>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>客户端</th>
                <th>Windows</th>
                <th>macOS</th>
                <th>Linux</th>
                <th>iOS</th>
                <th>Android</th>
                <th>路由器</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(client, index) in clientList" :key="index">
                <td><a :href="client.url" target="_blank">{{ client.name }}</a></td>
                <td><span v-if="client.windows" class="check-mark">✔</span></td>
                <td><span v-if="client.macos" class="check-mark">✔</span></td>
                <td><span v-if="client.linux" class="check-mark">✔</span></td>
                <td><span v-if="client.ios" class="check-mark">✔</span></td>
                <td><span v-if="client.android" class="check-mark">✔</span></td>
                <td><span v-if="client.router" class="check-mark">✔</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="client-section">
        <h2>桌面设备</h2>
        
        <div class="platform-group">
          <h3>Windows 平台客户端</h3>
          <div class="client-btn-group">
            <a v-for="btn in windowsClients" :key="btn.name" :href="btn.url" target="_blank" class="client-btn" :class="{ 'recommended': btn.recommended }">
              {{ btn.name }} <span v-if="btn.recommended" class="recommend-tag">[推荐]</span>
            </a>
          </div>
        </div>

        <div class="platform-group">
          <h3>OS X 平台客户端</h3>
          <div class="client-btn-group">
            <a v-for="btn in macClients" :key="btn.name" :href="btn.url" target="_blank" class="client-btn" :class="{ 'recommended': btn.recommended }">
              {{ btn.name }} <span v-if="btn.recommended" class="recommend-tag">[推荐]</span>
            </a>
          </div>
        </div>

        <div class="platform-group">
          <h3>浏览器代理扩展插件</h3>
          <div class="client-btn-group">
            <a href="https://switchyomega.org/" target="_blank" class="client-btn">SwitchyOmega</a>
          </div>
        </div>

        <div class="platform-group">
          <h3>Linux 平台客户端</h3>
          <div class="client-btn-group">
            <a v-for="btn in linuxClients" :key="btn.name" :href="btn.url" target="_blank" class="client-btn" :class="{ 'recommended': btn.recommended }">
              {{ btn.name }} <span v-if="btn.recommended" class="recommend-tag">[推荐]</span>
            </a>
          </div>
        </div>
      </section>

      <section class="client-section">
        <h2>移动设备</h2>
        
        <div class="platform-group">
          <h3>Android 平台客户端</h3>
          <div class="client-btn-group">
            <a v-for="btn in androidClients" :key="btn.name" :href="btn.url" target="_blank" class="client-btn" :class="{ 'recommended': btn.recommended }">
              {{ btn.name }} <span v-if="btn.recommended" class="recommend-tag">[推荐]</span>
            </a>
          </div>
        </div>

        <div class="platform-group">
          <h3>iOS 平台客户端</h3>
          <div class="client-btn-group">
            <a v-for="btn in iosClients" :key="btn.name" :href="btn.url" target="_blank" class="client-btn" :class="{ 'recommended': btn.recommended }">
              {{ btn.name }} <span v-if="btn.recommended" class="recommend-tag">[推荐]</span>
            </a>
          </div>
        </div>
      </section>

      <section class="client-section">
        <h2>其他设备</h2>
        
        <div class="platform-group">
          <h3>路由设备</h3>
          <div class="client-btn-group">
            <a v-for="btn in routerClients" :key="btn.name" :href="btn.url" target="_blank" class="client-btn" :class="{ 'recommended': btn.recommended }">
              {{ btn.name }} <span v-if="btn.recommended" class="recommend-tag">[推荐]</span>
            </a>
          </div>
        </div>

        <div class="platform-group">
          <h3>Apple TV</h3>
          <div class="client-btn-group">
            <a v-for="btn in tvClients" :key="btn.name" :href="btn.url" target="_blank" class="client-btn" :class="{ 'recommended': btn.recommended }">
              {{ btn.name }} <span v-if="btn.recommended" class="recommend-tag">[推荐]</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
const clientList = [
  { name: 'Clash Meta for Android', url: 'https://github.com/MetaCubeX/ClashMetaForAndroid', android: true },
  { name: 'Clash Verge Rev', url: 'https://clashvergerev.org/', windows: true, macos: true, linux: true },
  { name: 'Shadowrocket', url: 'https://shadowrocketios.org/', ios: true },
  { name: 'sing-box', url: 'https://sing-box.org/', windows: true, macos: true, linux: true, ios: true, android: true },
  { name: 'Stash', url: 'https://clashstash.org/', macos: true, ios: true },
  { name: 'v2rayN', url: 'https://v2rayn.org/', windows: true, macos: true },
  { name: 'v2rayNG', url: 'https://v2rayng.org/', android: true },
];

const windowsClients = [
  { name: 'Clash Verge', url: 'https://clashverge.org/' },
  { name: 'Clash Verge Rev', url: 'https://clashvergerev.org/' },
  { name: 'Clash Nyanpasu', url: 'https://clashnyanpasu.org/' },
  { name: 'Clash for Windows', url: 'https://clashforwindows.org/' },
  { name: 'ClashN', url: 'https://getclashn.org/' },
  { name: 'v2rayN', url: 'https://v2rayn.org/', recommended: true },
  { name: 'WinXray', url: 'https://winxray.org/' },
  { name: 'NekoRay', url: 'https://nekobox.tools/nekoray/' },
  { name: 'sing-box', url: 'https://sing-box.org/' },
  { name: 'Qv2ray', url: 'https://qv2ray.org/' },
];

const macClients = [
  { name: 'Clash Verge', url: 'https://clashverge.org/' },
  { name: 'Clash Verge Rev', url: 'https://clashvergerev.org/' },
  { name: 'Clash Nyanpasu', url: 'https://clashnyanpasu.org/' },
  { name: 'Clash for Windows', url: 'https://clashforwindows.org/' },
  { name: 'ClashX', url: 'https://clashx.org/' },
  { name: 'ClashX Pro', url: 'https://clashxpro.org/' },
  { name: 'Stash', url: 'https://clashstash.org/' },
  { name: 'V2rayU', url: 'https://v2rayu.org/', recommended: true },
  { name: 'Quantumult X', url: 'https://quantumultx.org/' },
  { name: 'sing-box', url: 'https://sing-box.org/' },
  { name: 'Qv2ray', url: 'https://qv2ray.org/' },
];

const linuxClients = [
  { name: 'Clash Verge', url: 'https://clashverge.org/' },
  { name: 'Clash Verge Rev', url: 'https://clashvergerev.org/', recommended: true },
  { name: 'Clash Nyanpasu', url: 'https://clashnyanpasu.org/' },
  { name: 'Clash for Windows', url: 'https://clashforwindows.org/' },
  { name: 'NekoRay', url: 'https://nekobox.tools/nekoray/' },
  { name: 'sing-box', url: 'https://sing-box.org/' },
  { name: 'Qv2ray', url: 'https://qv2ray.org/' },
];

const androidClients = [
  { name: 'v2rayNG', url: 'https://v2rayng.org/', recommended: true },
  { name: 'Clash for Android', url: 'https://clashforandroid.org/' },
  { name: 'NekoBox for Android', url: 'https://nekobox.tools/nekoboxforandroid/' },
  { name: 'sing-box', url: 'https://sing-box.org/' },
  { name: 'Surfboard', url: 'https://getsurfboard.org/' },
];

const iosClients = [
  { name: 'Shadowrocket', url: 'https://shadowrocketios.org/', recommended: true },
  { name: 'Quantumult', url: 'https://quantumult.org/' },
  { name: 'Quantumult X', url: 'https://quantumultx.org/' },
  { name: 'Stash', url: 'https://clashstash.org/' },
  { name: 'Potatso Lite', url: 'https://potatso.org/' },
  { name: 'sing-box', url: 'https://sing-box.org/' },
];

const routerClients = [
  { name: 'OpenWrt', url: 'https://opwrt.org/' },
  { name: 'OpenClash', url: 'https://openclash.org/' },
  { name: 'SSRplus', url: 'https://ssrplus.org/', recommended: true },
  { name: 'PassWall2', url: 'https://passwall2.org/' },
];

const tvClients = [
  { name: 'Shadowrocket', url: 'https://shadowrocketios.org/', recommended: true },
  { name: 'Quantumult X', url: 'https://quantumultx.org/' },
  { name: 'Stash', url: 'https://clashstash.org/' },
  { name: 'sing-box', url: 'https://sing-box.org/' },
];
</script>

<style scoped>
.client-list-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  margin: 0;
  color: var(--text-title-h1);
  font-size: var(--font-size-2xl);
  font-weight: 700;
  background: var(--main-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.client-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.client-section {
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  padding: var(--spacing-xl);
  color: var(--text-primary);
  box-shadow: var(--soft-shadow);
  position: relative;
  overflow: hidden;
  transition: all var(--transition-normal);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.client-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--sub-gradient);
  opacity: 0;
  transition: opacity var(--transition-normal);
  z-index: -1;
}

.client-section:hover {
  transform: translateY(-4px);
  box-shadow: var(--accent-shadow);
  border-color: var(--text-accent);
}

.client-section:hover::before {
  opacity: 0.05;
}

.client-section h2 {
  font-size: var(--font-size-lg);
  color: var(--text-accent);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--text-accent);
  font-weight: 600;
}

.client-section h3 {
  font-size: var(--font-size-md);
  color: var(--text-primary);
  margin-top: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
  font-weight: 500;
}

.client-section h3:first-of-type,
.platform-group:first-child h3 {
  margin-top: 0;
}

.platform-group {
  margin-bottom: var(--spacing-md);
}

.platform-group:last-child {
  margin-bottom: 0;
}

.platform-group:last-child .client-btn-group {
  margin-bottom: 0;
}

.section-description {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
  line-height: 1.6;
}

.intro-section {
  border-left: 4px solid var(--text-accent);
}

.intro-section .section-description:last-child {
  margin-bottom: 0;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid var(--border-primary);
}

table {
  border-collapse: collapse;
  width: 100%;
  background: var(--background-tertiary);
}

th, td {
  border: 1px solid var(--border-secondary);
  padding: 12px 16px;
  text-align: center;
  color: var(--text-primary);
}

th {
  background: var(--background-secondary-alt);
  color: var(--text-accent);
  font-weight: 600;
}

td a {
  color: var(--text-link);
  text-decoration: none;
  transition: color var(--transition-fast);
}

td a:hover {
  color: var(--text-link-hover);
  text-decoration: underline;
}

.check-mark {
  color: var(--text-success);
  font-weight: bold;
}

.client-btn-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.client-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  padding: 10px 14px;
  text-decoration: none;
  transition: all var(--transition-normal);
  font-size: var(--font-size-sm);
  font-weight: 500;
  text-align: center;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}

.client-btn:hover {
  background: var(--background-trans);
  border-color: var(--text-accent);
  transform: translateY(-2px);
  box-shadow: var(--soft-shadow);
  color: var(--text-bright);
}

.client-btn.recommended {
  border-color: var(--text-sub-accent);
  background: rgba(255, 0, 110, 0.05);
}

.client-btn.recommended:hover {
  background: rgba(255, 0, 110, 0.1);
  box-shadow: 0 0 15px rgba(255, 0, 110, 0.2);
}

.recommend-tag {
  font-size: 0.8em;
  color: var(--text-sub-accent);
  margin-left: 4px;
}

@media (max-width: 768px) {
  .client-section {
    padding: var(--spacing-md);
  }
  
  .client-section h2 {
    font-size: var(--font-size-base);
    margin-bottom: var(--spacing-md);
  }
  
  .client-section h3 {
    font-size: var(--font-size-sm);
    margin-top: var(--spacing-md);
    margin-bottom: var(--spacing-sm);
  }
  
  .client-btn-group {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: var(--spacing-xs);
  }
  
  .client-btn {
    padding: 8px 10px;
    font-size: var(--font-size-xs);
  }
  
  .recommend-tag {
    font-size: 0.7em;
  }
  
  th, td {
    padding: 8px;
    font-size: var(--font-size-sm);
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: var(--font-size-xl);
  }
  
  .client-btn-group {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
