<template>
  <div class="client-list-page">
    <h1>科学上网客户端大全</h1>
    <p>除了 Windows 系统电脑客户端 v2rayN 之外，分享更多 Windows 代理软件，以及不同平台及设备下的推荐科学上网代理软件，可根据使用平台及使用场景来选择适合的客户端。</p>
    <p>选择不同的客户端之前，首先需要确认该客户端是否支持节点即代理服务器提供的协议，如 v2rayN 支持 VMess、VLESS、Trojan、Socks、Shadowsocks、Hysteria2、Tuic 等代理协议，所以需要确认选择的客户端是否支持服务器提供的协议。</p>

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
          <tr>
            <td><a href="https://github.com/MetaCubeX/ClashMetaForAndroid" target="_blank">Clash Meta for Android</a></td>
            <td></td><td></td><td></td><td></td><td>✔</td><td></td>
          </tr>
          <tr>
            <td><a href="https://clashvergerev.org/" target="_blank">Clash Verge Rev</a></td>
            <td>✔</td><td>✔</td><td>✔</td><td></td><td></td><td></td>
          </tr>
          <tr>
            <td><a href="https://shadowrocketios.org/" target="_blank">Shadowrocket</a></td>
            <td></td><td></td><td></td><td>✔</td><td></td><td></td>
          </tr>
          <tr>
            <td><a href="https://sing-box.org/" target="_blank">sing-box</a></td>
            <td>✔</td><td>✔</td><td>✔</td><td>✔</td><td>✔</td><td></td>
          </tr>
          <tr>
            <td><a href="https://clashstash.org/" target="_blank">Stash</a></td>
            <td></td><td>✔</td><td></td><td>✔</td><td></td><td></td>
          </tr>
          <tr>
            <td><a href="https://v2rayn.org/" target="_blank">v2rayN</a></td>
            <td>✔</td><td>✔</td><td></td><td></td><td></td><td></td>
          </tr>
          <tr>
            <td><a href="https://v2rayng.org/" target="_blank">v2rayNG</a></td>
            <td></td><td></td><td></td><td></td><td>✔</td><td></td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>桌面设备</h2>
    <h3>Windows 平台客户端</h3>
    <div class="client-btn-group">
      <a class="client-btn" href="https://clashverge.org/" target="_blank">Clsah Verge</a>
      <a class="client-btn" href="https://clashvergerev.org/" target="_blank">Clash Verge Rev</a>
      <a class="client-btn" href="https://clashnyanpasu.org/" target="_blank">Clash Nyanpasu</a>
      <a class="client-btn" href="https://clashforwindows.org/" target="_blank">Clash for Windows</a>
      <a class="client-btn" href="https://getclashn.org/" target="_blank">ClashN</a>
      <a class="client-btn" href="https://v2rayn.org/" target="_blank">v2rayN [推荐]</a>
      <a class="client-btn" href="https://winxray.org/" target="_blank">WinXray</a>
      <a class="client-btn" href="https://nekobox.tools/nekoray/" target="_blank">NekoRay</a>
      <a class="client-btn" href="https://sing-box.org/" target="_blank">sing-box</a>
      <a class="client-btn" href="https://qv2ray.org/" target="_blank">Qv2ray</a>
    </div>

    <h3>OS X 平台客户端</h3>
    <div class="client-btn-group">
      <a class="client-btn" href="https://clashverge.org/" target="_blank">Clash Verge</a>
      <a class="client-btn" href="https://clashvergerev.org/" target="_blank">Clash Verge Rev</a>
      <a class="client-btn" href="https://clashnyanpasu.org/" target="_blank">Clash Nyanpasu</a>
      <a class="client-btn" href="https://clashforwindows.org/" target="_blank">Clash for Windows</a>
      <a class="client-btn" href="https://clashx.org/" target="_blank">ClashX</a>
      <a class="client-btn" href="https://clashxpro.org/" target="_blank">ClashX Pro</a>
      <a class="client-btn" href="https://clashstash.org/" target="_blank">Stash</a>
      <a class="client-btn" href="https://v2rayu.org/" target="_blank">V2rayU [推荐]</a>
      <a class="client-btn" href="https://quantumultx.org/" target="_blank">Quantumult X</a>
      <a class="client-btn" href="https://sing-box.org/" target="_blank">sing-box</a>
      <a class="client-btn" href="https://qv2ray.org/" target="_blank">Qv2ray</a>
    </div>

    <h3>浏览器代理扩展插件</h3>
    <div class="client-btn-group">
      <a class="client-btn" href="https://switchyomega.org/" target="_blank">SwitchyOmega</a>
    </div>

    <h3>Linux 平台客户端</h3>
    <div class="client-btn-group">
      <a class="client-btn" href="https://clashverge.org/" target="_blank">Clsah Verge</a>
      <a class="animated-button animated-button-clash" href="https://clashvergerev.org/" target="_blank">
        <svg class="arr-2" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <span class="text">Clash Verge Rev [推荐]</span>
        <span class="circle"></span>
        <svg class="arr-1" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </a>
      <a class="client-btn" href="https://clashnyanpasu.org/" target="_blank">Clash Nyanpasu</a>
      <a class="client-btn" href="https://clashforwindows.org/" target="_blank">Clash for Windows</a>
      <a class="client-btn" href="https://nekobox.tools/nekoray/" target="_blank">NekoRay</a>
      <a class="client-btn" href="https://sing-box.org/" target="_blank">sing-box</a>
      <a class="client-btn" href="https://qv2ray.org/" target="_blank">Qv2ray</a>
    </div>

    <h2>移动设备</h2>
    <h3>Android 平台客户端</h3>
    <div class="client-btn-group">
      <a class="animated-button animated-button-v2ray" href="https://v2rayng.org/" target="_blank">
        <svg class="arr-2" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <span class="text">v2rayNG [推荐]</span>
        <span class="circle"></span>
        <svg class="arr-1" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </a>
      <a class="client-btn" href="https://clashforandroid.org/" target="_blank">Clash for Android</a>
      <a class="client-btn" href="https://nekobox.tools/nekoboxforandroid/" target="_blank">NekoBox for Android</a>
      <a class="client-btn" href="https://sing-box.org/" target="_blank">sing-box</a>
      <a class="client-btn" href="https://getsurfboard.org/" target="_blank">Surfboard</a>
    </div>

    <h3>iOS 平台客户端</h3>
    <div class="client-btn-group">
      <a class="animated-button animated-button-shadowrocket" href="https://shadowrocketios.org/" target="_blank">
        <svg class="arr-2" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <span class="text">Shadowrocket [推荐]</span>
        <span class="circle"></span>
        <svg class="arr-1" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </a>
      <a class="client-btn" href="https://quantumult.org/" target="_blank">Quantumult</a>
      <a class="client-btn" href="https://quantumultx.org/" target="_blank">Quantumult X</a>
      <a class="client-btn" href="https://clashstash.org/" target="_blank">Stash</a>
      <a class="client-btn" href="https://potatso.org/" target="_blank">Potatso Lite</a>
      <a class="client-btn" href="https://sing-box.org/" target="_blank">sing-box</a>
    </div>

    <h2>路由设备</h2>
    <div class="client-btn-group">
      <a class="client-btn" href="https://opwrt.org/" target="_blank">OpenWrt</a>
      <a class="client-btn" href="https://openclash.org/" target="_blank">OpenClash</a>
      <a class="client-btn" href="https://ssrplus.org/" target="_blank">SSRplus [推荐]</a>
      <a class="client-btn" href="https://passwall2.org/" target="_blank">PassWall2</a>
    </div>

    <h2>Apple TV</h2>
    <div class="client-btn-group">
      <a class="client-btn" href="https://shadowrocketios.org/" target="_blank">Shadowrocket [推荐]</a>
      <a class="client-btn" href="https://quantumultx.org/" target="_blank">Quantumult X</a>
      <a class="client-btn" href="https://clashstash.org/" target="_blank">Stash</a>
      <a class="client-btn" href="https://sing-box.org/" target="_blank">sing-box</a>
    </div>
  </div>
</template>

<style scoped>
.client-list-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 16px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.client-list-page h1 {
  font-size: 2rem;
  margin-bottom: 1.2em;
  text-align: center;
}
.client-list-page h2 {
  margin-top: 2em;
  margin-bottom: 0.8em;
  color: #007bff;
}
.client-list-page h3 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  color: #333;
}
.client-btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 12px;
  margin-bottom: 1.2em;
}
.client-btn {
  display: inline-block;
  background-color: #007bff;
  color: var(--text-bright);
  border: none;
  border-radius: 5px;
  padding: 8px 18px;
  font-size: 1em;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  margin-bottom: 5px;
  min-width: 0;
  word-break: break-all;
}
.client-btn:hover {
  background-color: #0056b3;
  text-decoration: none;
}
@media (max-width: 768px) {
  .client-btn {
    flex: 1 1 45%;
    min-width: 120px;
    max-width: 48%;
    box-sizing: border-box;
  }
}

.table-wrapper {
  overflow-x: auto;
  margin-bottom: 2em;
}
table {
  border-collapse: collapse;
  width: 100%;
  background: #fafbfc;
}
th, td {
  border: 1px solid #e5e5e5;
  padding: 8px 12px;
  text-align: center;
}
th {
  background: #f0f2f5;
  color: #333;
}
td a {
  color: #007bff;
  text-decoration: none;
}
td a:hover {
  text-decoration: underline;
}
</style>
