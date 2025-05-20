<template>
  <div class="recommend-page">
    <h1 class="page-title">梯子购买推荐</h1>
    <div class="recommend-content">
      <div class="recommend-grid">
        <section class="recommend-section">
          <h2>高速、稳定、IP纯净</h2>
          <div class="recommend-btn-group">
            <a href="https://a.mikasass.pro/signup?referralCode=A9ti5mtf" target="_blank" class="recommend-btn">Mikasa</a>
            <a href="https://mojie.kim/register?aff=r3JESYAG" target="_blank" class="recommend-btn">魔戒</a>
          </div>
        </section>

        <section class="recommend-section">
          <h2>高速、大流量</h2>
          <div class="recommend-btn-group">
            <a href="https://www.cutecloud.net/register?code=WUHcCLFn" target="_blank" class="recommend-btn">最萌の云CuteCloud</a>
            <a href="https://xs-us.xyz/register?code=9usLmdvb" target="_blank" class="recommend-btn">十八线小机场XSUS</a>
          </div>
        </section>

        <section class="recommend-section">
          <h2>大流量、高性价比</h2>
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
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 2em;
  color: #333;
  margin-bottom: 32px;
  text-align: center;
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  width: 100%;
}

.recommend-section {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.recommend-section h2 {
  font-size: 1.5em;
  color: #333;
  margin-bottom: 24px;
  padding-bottom: 8px;
  border-bottom: 2px solid #007bff;
  text-align: center;
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
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 16px 24px;
  font-size: 1.1em;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.recommend-btn:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

@media (max-width: 1200px) {
  .recommend-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .recommend-page {
    padding: 16px;
  }

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
