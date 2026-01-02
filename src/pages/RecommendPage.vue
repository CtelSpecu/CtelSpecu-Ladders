<template>
  <div class="recommend-page">
    <h1 class="page-title">机场推荐</h1>
    <div class="recommend-content">
      <div class="recommend-grid">
        <section class="recommend-section">
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
            <span class="rating-text">5/5 推荐</span>
          </div>
          <h3><i class="fas fa-check"></i>高速<i class="fas fa-check"></i>稳定<i class="fas fa-check"></i>IP纯净（推荐）</h3>
          <div class="recommend-btn-group">
            <a href="https://a.mikasass.pro/signup?referralCode=A9ti5mtf" target="_blank" class="recommend-btn">Mikasa</a>
            <a href="https://www.优信云.com/#/register?code=UJUm53s7" target="_blank" class="recommend-btn">优信云</a>
            <a href="https://www.cutecloud.net/register?code=WUHcCLFn" target="_blank" class="recommend-btn">最萌の云CuteCloud</a>
            
          </div>
        </section>

        <section class="recommend-section">
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
          <h3><i class="fas fa-check"></i>高速<i class="fas fa-check"></i>大流量<i class="fas fa-check"></i>性价比</h3>
          <div class="recommend-btn-group">
            <a href="https://cokecloud.cyou/#/register?code=wvIsDmnG" target="_blank" class="recommend-btn">CokeCloud</a>
            <a href="https://mojie.kim/register?aff=r3JESYAG" target="_blank" class="recommend-btn">魔戒</a>
            <a href="https://xs-us.xyz/register?code=9usLmdvb" target="_blank" class="recommend-btn">十八线小机场XSUS</a>
          </div>
        </section>
        <section class="recommend-section">
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
            <span class="rating-text">2/5 推荐</span>
          </div>
          <h3><i class="fas fa-check"></i>大流量<i class="fas fa-check"></i>高性价比</h3>
          <div class="recommend-btn-group">
            <a href="https://www.qingzeyy.top/#/register?code=KENq3MAR" target="_blank" class="recommend-btn">快游戏云加速</a>
            <a href="https://1元机场.com/#/" target="_blank" class="recommend-btn">一元机场（性价比极高）</a>
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
  margin-bottom: var(--spacing-xl);
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
  bottom: 0;
  background: var(--sub-gradient);
  opacity: 0;
  transition: opacity var(--transition-normal);
  z-index: -1;
}

.recommend-section:hover {
  transform: translateY(-8px);
  box-shadow: var(--accent-shadow);
  border-color: var(--text-accent);
}

.recommend-section:hover::before {
  opacity: 0.1;
}

.recommend-section h3 {
  font-size: var(--font-size-lg);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  text-align: center;
  font-weight: 600;
}

.recommend-section h3 .fas.fa-check {
  color: var(--text-accent);
  margin-right: var(--spacing-xs);
  margin-left: var(--spacing-xs);
}

.rating-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.stars {
  display: flex;
  gap: var(--spacing-xs);
}

.star {
  font-size: var(--font-size-lg);
  color: var(--text-quaternary);
  transition: all var(--transition-normal);
  cursor: pointer;
}

.star.active {
  color: var(--text-accent);
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

.star:hover {
  transform: scale(1.2);
}

.rating-text {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-secondary);
}

.recommend-btn-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  width: 100%;
}

.recommend-btn {
  display: flex;
  align-items: center;
  justify-content: center;
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
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-height: 48px;
}

.recommend-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.recommend-btn:hover::before {
  left: 100%;
}

.recommend-btn:hover {
  background: var(--strong-gradient);
  transform: translateY(-2px);
  box-shadow: var(--sub-accent-shadow);
}

.recommend-btn:active {
  transform: translateY(0px) scale(0.98);
}

@media (max-width: 1200px) {
  .recommend-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .recommend-grid {
    grid-template-columns: 1fr;
  }

  .recommend-btn-group {
    grid-template-columns: 1fr;
  }
}
</style>

<script setup>
</script>
