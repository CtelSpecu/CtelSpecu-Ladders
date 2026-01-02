<template>
  <div class="free-vpn-page">
    <h1 class="page-title"><span class="title-icon">🔐</span> <span class="title-text">免费VPN推荐</span></h1>
    <div class="free-vpn-content">
      <div class="free-vpn-grid">        <section class="free-vpn-section">
          <h2><span class="section-icon">🌍</span> 全平台可用</h2>
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
          <h2><span class="section-icon">📱</span> 移动端应用</h2>
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
  font-size: var(--font-size-2xl);
  font-weight: 700;
  text-align: center;
  margin-bottom: var(--spacing-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.title-icon {
  font-size: 1.2em;
  -webkit-text-fill-color: initial;
  background: none;
}

.title-text {
  color: var(--text-title-h1);
  background: var(--main-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-icon {
  -webkit-text-fill-color: initial;
  background: none;
  margin-right: var(--spacing-xs);
}

.free-vpn-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
  width: 100%;
}

.free-vpn-section {
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
  min-height: 280px;
}

.free-vpn-section::before {
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

.free-vpn-section:hover {
  transform: translateY(-8px);
  box-shadow: var(--accent-shadow);
  border-color: var(--text-accent);
}

.free-vpn-section:hover::before {
  opacity: 0.1;
}

.free-vpn-section h2 {
  font-size: var(--font-size-lg);
  color: var(--text-accent);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--text-accent);
  font-weight: 600;
}

.free-vpn-btn-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.vpn-item {
  width: 100%;
}

.free-vpn-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--main-gradient);
  color: var(--text-bright);
  border-radius: 12px;
  font-size: var(--font-size-base);
  font-weight: 600;
  transition: all var(--transition-normal);
  text-decoration: none;
  box-shadow: var(--accent-shadow);
  border: none;
  padding: var(--spacing-md) var(--spacing-lg);
  width: 100%;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-height: 48px;
}

.free-vpn-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.free-vpn-btn:hover::before {
  left: 100%;
}

.free-vpn-btn:hover {
  background: var(--strong-gradient);
  transform: translateY(-2px);
  box-shadow: var(--sub-accent-shadow);
}

.free-vpn-btn:active {
  transform: translateY(0px) scale(0.98);
}

.rating {
  display: flex;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--text-accent);
  font-weight: normal;
}

.rating i {
  font-size: var(--font-size-base);
  transition: all var(--transition-normal);
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
    padding: var(--spacing-lg);
  }

  .page-title {
    font-size: var(--font-size-xl);
  }
}
</style>

<script setup>
</script>
