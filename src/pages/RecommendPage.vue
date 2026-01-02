<template>
  <div class="recommend-page">
    <h1 class="page-title">🚀 机场推荐</h1>
    <p class="page-subtitle">精选优质服务商，稳定高速的网络体验</p>
    <div class="recommend-content">
      <div class="recommend-grid">
        <section class="recommend-section premium">
          <div class="section-badge">精选</div>
          <div class="rating-container">
            <div class="stars">
              <i v-for="i in 5" 
                 :key="i" 
                 class="star" 
                 :class="{ 
                   'fas fa-star active': i <= 5,
                   'far fa-star': i > 5
                 }">
              </i>
            </div>
            <span class="rating-text">5/5 强烈推荐</span>
          </div>
          <h3>
            <span class="tag">高速</span>
            <span class="tag">稳定</span>
            <span class="tag">IP纯净</span>
          </h3>
          <div class="recommend-btn-group">
            <a href="https://a.mikasass.pro/signup?referralCode=A9ti5mtf" target="_blank" class="recommend-btn">
              <span class="btn-icon">⚡</span>Mikasa
            </a>
            <a href="https://www.优信云.com/#/register?code=UJUm53s7" target="_blank" class="recommend-btn">
              <span class="btn-icon">☁️</span>优信云
            </a>
            <a href="https://www.cutecloud.net/register?code=WUHcCLFn" target="_blank" class="recommend-btn">
              <span class="btn-icon">🌸</span>CuteCloud
            </a>
          </div>
        </section>

        <section class="recommend-section good">
          <div class="section-badge secondary">优选</div>
          <div class="rating-container">
            <div class="stars">
              <i v-for="i in 5" 
                 :key="i" 
                 class="star" 
                 :class="{ 
                   'fas fa-star active': i <= 4,
                   'far fa-star': i > 4
                 }">
              </i>
            </div>
            <span class="rating-text">4/5 推荐</span>
          </div>
          <h3>
            <span class="tag">高速</span>
            <span class="tag">大流量</span>
            <span class="tag">性价比</span>
          </h3>
          <div class="recommend-btn-group">
            <a href="https://cokecloud.cyou/#/register?code=wvIsDmnG" target="_blank" class="recommend-btn">
              <span class="btn-icon">🥤</span>CokeCloud
            </a>
            <a href="https://mojie.kim/register?aff=r3JESYAG" target="_blank" class="recommend-btn">
              <span class="btn-icon">💍</span>魔戒
            </a>
            <a href="https://xs-us.xyz/register?code=9usLmdvb" target="_blank" class="recommend-btn">
              <span class="btn-icon">✈️</span>XSUS小机场
            </a>
          </div>
        </section>

        <section class="recommend-section budget">
          <div class="section-badge tertiary">实惠</div>
          <div class="rating-container">
            <div class="stars">
              <i v-for="i in 5" 
                 :key="i" 
                 class="star" 
                 :class="{ 
                   'fas fa-star active': i <= 2,
                   'far fa-star': i > 2
                 }">
              </i>
            </div>
            <span class="rating-text">2/5 可用</span>
          </div>
          <h3>
            <span class="tag">大流量</span>
            <span class="tag">超高性价比</span>
          </h3>
          <div class="recommend-btn-group">
            <a href="https://www.qingzeyy.top/#/register?code=KENq3MAR" target="_blank" class="recommend-btn">
              <span class="btn-icon">🎮</span>快游戏云加速
            </a>
            <a href="https://1元机场.com/#/" target="_blank" class="recommend-btn">
              <span class="btn-icon">💰</span>一元机场
            </a>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recommend-page {
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
  margin-bottom: var(--spacing-sm);
}

.page-subtitle {
  text-align: center;
  color: var(--text-secondary);
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-xl);
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-lg);
  width: 100%;
}

.recommend-section {
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

.recommend-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--main-gradient);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.recommend-section.premium::before {
  opacity: 1;
  background: linear-gradient(90deg, #00d4ff, #667eea);
}

.recommend-section.good::before {
  opacity: 1;
  background: linear-gradient(90deg, #22c55e, #16a34a);
}

.recommend-section.budget::before {
  opacity: 1;
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.recommend-section:hover {
  transform: translateY(-6px);
  box-shadow: var(--accent-shadow);
  border-color: var(--text-accent);
}

.section-badge {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  background: var(--main-gradient);
  color: var(--text-bright);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: 20px;
  font-size: var(--font-size-xs);
  font-weight: 600;
}

.section-badge.secondary {
  background: linear-gradient(135deg, #22c55e, #16a34a);
}

.section-badge.tertiary {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.recommend-section h3 {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  margin-top: var(--spacing-sm);
}

.tag {
  display: inline-flex;
  align-items: center;
  background: var(--background-tertiary);
  color: var(--text-accent);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: 20px;
  font-size: var(--font-size-sm);
  font-weight: 500;
  border: 1px solid var(--border-primary);
}

.rating-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.stars {
  display: flex;
  gap: var(--spacing-xs);
}

.star {
  font-size: var(--font-size-lg);
  color: var(--text-quaternary);
  transition: all var(--transition-normal);
}

.star.active {
  color: #fbbf24;
  text-shadow: 0 0 8px rgba(251, 191, 36, 0.5);
}

.rating-text {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-secondary);
}

.recommend-btn-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  width: 100%;
}

.recommend-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  background: var(--background-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
  border-radius: 10px;
  font-size: var(--font-size-base);
  font-weight: 500;
  transition: all var(--transition-normal);
  text-decoration: none;
  padding: var(--spacing-md) var(--spacing-lg);
  position: relative;
  overflow: hidden;
}

.btn-icon {
  font-size: 1.1em;
}

.recommend-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.recommend-btn:hover::before {
  left: 100%;
}

.recommend-btn:hover {
  background: var(--background-trans);
  border-color: var(--text-accent);
  transform: translateX(4px);
  box-shadow: var(--soft-shadow);
}

.recommend-btn:active {
  transform: translateX(2px) scale(0.98);
}

@media (max-width: 768px) {
  .recommend-grid {
    grid-template-columns: 1fr;
  }
  
  .recommend-section {
    padding: var(--spacing-lg);
  }

  .recommend-btn {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-sm);
  }
}
</style>

<script setup>
</script>
