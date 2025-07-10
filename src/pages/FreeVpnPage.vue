<template>
  <div class="free-vpn-page">
    <h1 class="page-title">免费可用优质VPN</h1>
    <div class="free-vpn-content">
      <div class="free-vpn-grid">        <section class="free-vpn-section">
          <h2>全平台可用</h2>
          <div class="free-vpn-btn-group">            <div class="vpn-item">
              <a href="https://china-letsvpn.com/" target="_blank" class="free-vpn-btn">
                LetsVPN
                <span class="rating">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                </span>
              </a>
            </div>
            <div class="vpn-item">
              <a href="https://cn.bing.com/search?q=turbo+vpn&qs=ds&form=QBRE" target="_blank" class="free-vpn-btn">
                Turbo VPN
                <span class="rating">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="far fa-star"></i>
                </span>
              </a>
            </div>
            <div class="vpn-item">
              <a href="https://pandavpnpro.com/" target="_blank" class="free-vpn-btn">
                PandaVPN Pro
                <span class="rating">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="far fa-star"></i>
                </span>
              </a>
            </div>
            <div class="vpn-item">
              <a href="https://join.protonvpn.com/downloads" target="_blank" class="free-vpn-btn">
                ProtonVPN
                <span class="rating">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="far fa-star"></i>
                  <i class="far fa-star"></i>
                </span>
              </a>
            </div>
          </div>
        </section>

        <section class="free-vpn-section">
          <h2>移动端应用</h2>
          <div class="free-vpn-btn-group">            <div class="vpn-item">
              <a href="https://apps.apple.com/us/app/pandavpn-lite-最好最快無限流量的-vpn/id1466932207?l=zh" target="_blank" class="free-vpn-btn">
                PandaVPN Lite (iOS)
                <span class="rating">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="far fa-star"></i>
                </span>
              </a>
            </div>
            <div class="vpn-item">
              <a href="https://orbot.app/en/download/" target="_blank" class="free-vpn-btn">
                Orbot
                <span class="rating">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="far fa-star"></i>
                  <i class="far fa-star"></i>
                </span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.free-vpn-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  margin: 0;
  color: #333;
  font-size: 2.2em;
  font-weight: 700;
  text-shadow: 0 2px 8px rgba(255, 255, 255, 0.8);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  margin-bottom: 32px;
}

.free-vpn-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  width: 100%;
}

.free-vpn-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 30px;
  color: white;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  min-height: 280px;
}

.free-vpn-section::before {
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

.free-vpn-section:hover::before {
  opacity: 1;
  animation: shine 1.5s ease-in-out;
}

.free-vpn-section:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 50px rgba(0,0,0,0.2);
}

@keyframes shine {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.free-vpn-section h2 {
  font-size: 1.5em;
  color: #fff;
  margin-bottom: 24px;
  padding-bottom: 8px;
  border-bottom: 2px solid #43e97b;
  text-align: center;
}

.free-vpn-btn-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.vpn-item {
  width: 100%;
}

.free-vpn-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
  border-radius: 12px;
  font-size: 1.1em;
  font-weight: 600;
  transition: all 0.3s;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(67, 233, 123, 0.08);
  border: none;
  padding: 16px 20px;
  width: 100%;
  box-sizing: border-box;
}

.free-vpn-btn:hover {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(67, 233, 123, 0.18);
}

.rating {
  display: flex;
  gap: 2px;
  font-size: 0.9em;
  color: #ffd700;
  font-weight: normal;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.rating i {
  font-size: 1em;
  transition: transform 0.2s ease;
}

.rating i:hover {
  transform: scale(1.1);
}

@media (max-width: 1200px) {
  .free-vpn-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .free-vpn-grid {
    grid-template-columns: 1fr;
  }

  .free-vpn-section {
    min-height: auto;
  }

  .page-title {
    font-size: 1.8em;
  }
}
</style>

<script setup>
</script>
