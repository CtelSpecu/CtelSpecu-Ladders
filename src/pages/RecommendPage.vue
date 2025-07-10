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
            <a href="https://mojie.kim/register?aff=r3JESYAG" target="_blank" class="recommend-btn">魔戒</a>
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
            <a href="https://www.cutecloud.net/register?code=WUHcCLFn" target="_blank" class="recommend-btn">最萌の云CuteCloud</a>
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
                   'fas fa-star active': i <= 4,
                   'far fa-star': i > 4
                 }">
              </i>
            </div>
            <span class="rating-text">4/5 推荐</span>
          </div>
          <h3><i class="fas fa-check"></i>高速<i class="fas fa-check"></i>优质<i class="fas fa-check"></i>IP纯净</h3>
          <div class="recommend-btn-group">
            <a href="https://www.优信云.com/#/register?code=UJUm53s7" target="_blank" class="recommend-btn">优信云</a>
            <a href="https://3fan.3f66.net:?code=VaaANnLd" target="_blank" class="recommend-btn">三番云</a>
            <a href="https://aff01.dgy02.com/#/register?code=0CJS9fTR" target="_blank" class="recommend-btn">大哥云</a>
            
          </div>
        </section>

        <section class="recommend-section">
          <div class="rating-container">
            <div class="stars">
              <i v-for="i in 5" 
                 :key="i" 
                 class="star" 
                 :class="{ 
                   'fas fa-star active': i <= 3,
                   'far fa-star': i > 3
                 }">
              </i>
            </div>
            <span class="rating-text">3/5 推荐</span>
          </div>
          <h3><i class="fas fa-check"></i>高速<i class="fas fa-check"></i>优质</h3>
          <div class="recommend-btn-group">
            <a href="https://suyunti981.xyz/auth/register?code=CGXE" target="_blank" class="recommend-btn">速云梯</a>
            <a href="https://inv03.lmaff01.cc/register?aff=HlFmJcm7" target="_blank" class="recommend-btn">龙猫云机场</a>
            <a href="https://inv02.ffaff.cc/register?aff=wacXIRos" target="_blank" class="recommend-btn">FlashFox</a>
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

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  width: 100%;
}

.recommend-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 30px;
  color: white;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.recommend-section::before {
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

.recommend-section:hover::before {
  opacity: 1;
  animation: shine 1.5s ease-in-out;
}

.recommend-section:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 50px rgba(0,0,0,0.2);
}

@keyframes shine {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.recommend-section h2 {
  font-size: 1.5em;
  color: #fff;
  margin-bottom: 24px;
  padding-bottom: 8px;
  border-bottom: 2px solid #43e97b;
  text-align: center;
}

.recommend-section h3 {
  font-size: 1.2em;
  color: #fff;
  margin-bottom: 20px;
  text-align: center;
  opacity: 0.9;
}

.recommend-section h3 .fas.fa-check {
  color: #43e97b;
  margin-right: 5px;
  margin-left: 5px;
}

.rating-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.stars {
  display: flex;
  gap: 5px;
}

.star {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
}

.star.active {
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.star:hover {
  transform: scale(1.2);
}

.rating-text {
  font-size: 16px;
  font-weight: 600;
  opacity: 0.9;
  color: #fff;
}

.recommend-section h3 .fas.fa-check {
  color: #43e97b;
  margin-right: 5px;
  margin-left: 5px;
}

.recommend-btn-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  width: 100%;
}

.recommend-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
  border-radius: 12px;
  font-size: 1.1em;
  font-weight: 600;
  transition: all 0.3s;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(67, 233, 123, 0.08);
  border: none;
  padding: 16px 24px;
}

.recommend-btn:hover {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(67, 233, 123, 0.18);
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
