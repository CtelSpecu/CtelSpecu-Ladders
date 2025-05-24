<template>
  <div class="card recommend-card">
    <h2>梯子购买推荐</h2>
    <h3>高速、稳定、IP纯净</h3>
    <div class="button-group">
      <a href="https://a.mikasass.pro/signup?referralCode=A9ti5mtf" target="_blank" class="recommend-button">Mikasa</a>
      <a href="https://mojie.kim/register?aff=r3JESYAG" target="_blank" class="recommend-button">魔戒</a>
    </div>
    <h3>高速、大流量</h3>
    <div class="button-group">
      <a href="https://www.cutecloud.net/register?code=WUHcCLFn" target="_blank" class="recommend-button">最萌の云CuteCloud</a>
      <a href="https://xs-us.xyz/register?code=9usLmdvb" target="_blank" class="recommend-button">十八线小机场XSUS</a>
    </div>
    <h3>大流量、高性价比</h3>
    <div class="button-group">
      <a href="https://www.qingzeyy.top/#/register?code=KENq3MAR" target="_blank" class="recommend-button">快游戏云加速</a>
      <a href="https://1元机场.com/#/" target="_blank" class="recommend-button">一元机场（性价比极高）</a>
    </div>
  </div>
</template>

<style scoped>
.recommend-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 30px;
  color: white;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.recommend-card::before {
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

.recommend-card:hover::before {
  opacity: 1;
  animation: shine 1.5s ease-in-out;
}

.recommend-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 50px rgba(0,0,0,0.2);
}

@keyframes shine {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.recommend-card h2 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #fff;
  text-align: center;
}

.recommend-card h3 {
  margin-top: 20px;
  margin-bottom: 10px;
  color: #e0e0e0;
  text-align: center;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.recommend-button {
  padding: 12px 24px;
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
  border-radius: 12px;
  font-size: 1em;
  font-weight: 600;
  transition: all 0.3s;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(67, 233, 123, 0.08);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.recommend-button:hover {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(67, 233, 123, 0.18);
}

@media (max-width: 767px) {
  .recommend-card {
    padding: 20px;
  }
  .button-group {
    flex-direction: column;
    gap: 8px;
  }
  .recommend-button {
    width: 100%;
    padding: 10px 0;
  }
}
</style>

<script setup>
// 无需脚本内容，因为只是展示静态链接
</script>
