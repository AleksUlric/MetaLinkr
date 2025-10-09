<template>
  <div class="splash-screen">
    <!-- MetaLinkr 品牌展示 -->
    <div class="brand-section">
      <div class="brand-content">
        <div class="brand-logo">
          <div class="logo-icon">🔗</div>
          <h1 class="brand-title">MetaLinkr</h1>
          <p class="brand-slogan">"找到真正懂你的人"</p>
        </div>
        
        <div class="brand-images">
          <div class="image-grid">
            <div class="image-item">
              <img src="https://picsum.photos/300/200?random=1" alt="社交连接" />
              <div class="image-overlay">
                <span class="image-title">社交连接</span>
              </div>
            </div>
            <div class="image-item">
              <img src="https://picsum.photos/300/200?random=2" alt="智能匹配" />
              <div class="image-overlay">
                <span class="image-title">智能匹配</span>
              </div>
            </div>
            <div class="image-item">
              <img src="https://picsum.photos/300/200?random=3" alt="真实互动" />
              <div class="image-overlay">
                <span class="image-title">真实互动</span>
              </div>
            </div>
            <div class="image-item">
              <img src="https://picsum.photos/300/200?random=4" alt="心灵共鸣" />
              <div class="image-overlay">
                <span class="image-title">心灵共鸣</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="brand-features">
          <div class="feature-item">
            <div class="feature-icon">💝</div>
            <span class="feature-text">精准匹配</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🎯</div>
            <span class="feature-text">真实社交</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🌟</div>
            <span class="feature-text">安全可靠</span>
          </div>
        </div>
        
        <div class="loading-section">
          <div class="loading-spinner">
            <div class="spinner"></div>
          </div>
          <p class="loading-text">正在加载精彩内容...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // 3秒后自动跳转到首页
  setTimeout(() => {
    router.push('/home')
  }, 3000)
})
</script>

<style lang="scss" scoped>
.splash-screen {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.splash-screen::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="10" cy="50" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="90" cy="30" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.brand-section {
  width: 100%;
  max-width: 1200px;
  padding: 40px 20px;
  text-align: center;
  position: relative;
  z-index: 2;
}

.brand-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

.brand-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  animation: fadeInUp 1s ease-out;
}

.logo-icon {
  font-size: 80px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.brand-title {
  font-size: 48px;
  font-weight: 800;
  color: white;
  margin: 0;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  background: linear-gradient(45deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from { filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5)); }
  to { filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.8)); }
}

.brand-slogan {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 300;
  letter-spacing: 2px;
  animation: fadeInUp 1s ease-out 0.5s both;
}

.brand-images {
  width: 100%;
  animation: fadeInUp 1s ease-out 1s both;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.image-item {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
}

.image-item:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.image-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  transition: all 0.3s ease;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 20px;
  color: white;
  transform: translateY(100%);
  transition: all 0.3s ease;
}

.image-item:hover .image-overlay {
  transform: translateY(0);
}

.image-title {
  font-size: 16px;
  font-weight: 600;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.brand-features {
  display: flex;
  gap: 40px;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeInUp 1s ease-out 1.5s both;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 32px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.feature-text {
  font-size: 14px;
  color: white;
  font-weight: 500;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  animation: fadeInUp 1s ease-out 2s both;
}

.loading-spinner {
  position: relative;
  width: 60px;
  height: 60px;
}

.spinner {
  width: 100%;
  height: 100%;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
  letter-spacing: 1px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .brand-title {
    font-size: 36px;
  }
  
  .brand-slogan {
    font-size: 16px;
  }
  
  .image-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
  }
  
  .image-item img {
    height: 120px;
  }
  
  .brand-features {
    gap: 20px;
  }
  
  .feature-item {
    padding: 15px;
  }
  
  .feature-icon {
    font-size: 24px;
  }
  
  .feature-text {
    font-size: 12px;
  }
}

@media screen and (max-width: 480px) {
  .brand-title {
    font-size: 28px;
  }
  
  .brand-slogan {
    font-size: 14px;
  }
  
  .image-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .image-item img {
    height: 100px;
  }
  
  .brand-features {
    flex-direction: column;
    gap: 15px;
  }
  
  .logo-icon {
    font-size: 60px;
  }
}
</style>
