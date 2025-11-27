<template>
  <div id="app">
    <router-view v-if="routerReady" />
    <div v-else class="loading">加载中...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { preloadDefaultAvatars } from '@/utils/avatar'

const routerReady = ref(false)

onMounted(async () => {
  console.log('App component loaded')
  // 预加载默认头像URL（从后端获取签名URL）
  preloadDefaultAvatars().catch(err => {
    console.error('预加载默认头像失败:', err)
  })
  // 确保路由已经准备好
  routerReady.value = true
})
</script>

<style lang="scss">
#app {
  height: 100vh;
  overflow: hidden;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 16px;
  color: #666;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

// 全局样式重置
ul, ol {
  list-style: none;
}

a {
  text-decoration: none;
  color: inherit;
}

button {
  border: none;
  background: none;
  cursor: pointer;
}

input, textarea {
  outline: none;
}

// 滚动条样式
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
  
  &:hover {
    background: #a8a8a8;
  }
}

// Soul风格Element Plus样式覆盖
.el-button {
  border-radius: 12px;
  font-weight: 500;
  
  &.el-button--primary {
    background: linear-gradient(135deg, #ff77c6, #7877c6);
    border-color: #ff77c6;
    
    &:hover {
      background: linear-gradient(135deg, #ff6bb3, #6b6bb3);
      border-color: #ff6bb3;
    }
  }
}

.el-input {
  .el-input__wrapper {
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: none;
    
    .el-input__inner {
      color: #ffffff;
      background: transparent;
      border: none;
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.6);
      }
    }
    
    &:hover {
      border-color: rgba(255, 255, 255, 0.3);
    }
    
    &.is-focus {
      border-color: #ff77c6;
      box-shadow: 0 0 0 2px rgba(255, 119, 198, 0.2);
    }
  }
}

.el-textarea {
  .el-textarea__wrapper {
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: none;
    
    .el-textarea__inner {
      color: #ffffff;
      background: transparent;
      border: none;
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.6);
      }
    }
    
    &:hover {
      border-color: rgba(255, 255, 255, 0.3);
    }
    
    &.is-focus {
      border-color: #ff77c6;
      box-shadow: 0 0 0 2px rgba(255, 119, 198, 0.2);
    }
  }
}

.el-select {
  .el-input__wrapper {
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: none;
    
    .el-input__inner {
      color: #ffffff;
      background: transparent;
      border: none;
    }
    
    &:hover {
      border-color: rgba(255, 255, 255, 0.3);
    }
    
    &.is-focus {
      border-color: #ff77c6;
      box-shadow: 0 0 0 2px rgba(255, 119, 198, 0.2);
    }
  }
}

.el-dialog {
  border-radius: 20px;
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  .el-dialog__header {
    padding: 20px 20px 0;
    
    .el-dialog__title {
      font-size: 18px;
      font-weight: 600;
      color: #ffffff;
    }
  }
  
  .el-dialog__body {
    padding: 20px;
    color: #ffffff;
  }
  
  .el-dialog__footer {
    padding: 0 20px 20px;
  }
}

.el-message-box {
  border-radius: 20px;
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  .el-message-box__title {
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
  }
  
  .el-message-box__content {
    color: #ffffff;
  }
}

.el-notification {
  border-radius: 16px;
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  color: #ffffff;
}

.el-loading-mask {
  background-color: rgba(26, 26, 26, 0.9);
  backdrop-filter: blur(20px);
}

// 移动端适配
@media screen and (max-width: 768px) {
  .el-dialog {
    width: 95% !important;
    margin: 5vh auto !important;
  }
  
  .el-message-box {
    width: 90% !important;
  }
  
  .el-notification {
    width: 90% !important;
    margin: 0 auto !important;
  }
}

// 清新风格全局浅色主题 - 仅在非登录页面应用
body:not(.login-page) {
  background: linear-gradient(135deg, #faf7ff 0%, #f3f0ff 100%);
  color: #334155;
}

.el-button {
  &.el-button--default {
    background: rgba(255, 255, 255, 0.8);
    border-color: rgba(148, 163, 184, 0.3);
    color: #475569;
    
    &:hover {
      background: rgba(255, 255, 255, 0.9);
      border-color: rgba(148, 163, 184, 0.5);
      color: #334155;
    }
  }
}

// 滚动条样式
::-webkit-scrollbar-track {
  background: rgba(148, 163, 184, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 6px;
  
  &:hover {
    background: rgba(148, 163, 184, 0.5);
  }
}

// 动画效果
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-10px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(10px);
  }
}

// 工具类
.fade-in {
  animation: fadeIn 0.3s ease-out;
}

.slide-in {
  animation: slideIn 0.3s ease-out;
}

.slide-out {
  animation: slideOut 0.3s ease-out;
}

.bounce {
  animation: bounce 1s;
}

.pulse {
  animation: pulse 2s infinite;
}

.shake {
  animation: shake 0.5s;
}

// 响应式工具类
.hidden-mobile {
  @media screen and (max-width: 768px) {
    display: none !important;
  }
}

.hidden-desktop {
  @media screen and (min-width: 769px) {
    display: none !important;
  }
}

// 文本工具类
.text-center {
  text-align: center;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

.text-primary {
  color: #ff6b6b;
}

.text-success {
  color: #52c41a;
}

.text-warning {
  color: #ffa500;
}

.text-error {
  color: #ff4757;
}

.text-muted {
  color: #999;
}

// 布局工具类
.flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex-around {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.flex-wrap {
  flex-wrap: wrap;
}

.flex-1 {
  flex: 1;
}

// 间距工具类
.m-0 { margin: 0; }
.m-1 { margin: 8px; }
.m-2 { margin: 16px; }
.m-3 { margin: 24px; }
.m-4 { margin: 32px; }

.mt-0 { margin-top: 0; }
.mt-1 { margin-top: 8px; }
.mt-2 { margin-top: 16px; }
.mt-3 { margin-top: 24px; }
.mt-4 { margin-top: 32px; }

.mb-0 { margin-bottom: 0; }
.mb-1 { margin-bottom: 8px; }
.mb-2 { margin-bottom: 16px; }
.mb-3 { margin-bottom: 24px; }
.mb-4 { margin-bottom: 32px; }

.ml-0 { margin-left: 0; }
.ml-1 { margin-left: 8px; }
.ml-2 { margin-left: 16px; }
.ml-3 { margin-left: 24px; }
.ml-4 { margin-left: 32px; }

.mr-0 { margin-right: 0; }
.mr-1 { margin-right: 8px; }
.mr-2 { margin-right: 16px; }
.mr-3 { margin-right: 24px; }
.mr-4 { margin-right: 32px; }

.p-0 { padding: 0; }
.p-1 { padding: 8px; }
.p-2 { padding: 16px; }
.p-3 { padding: 24px; }
.p-4 { padding: 32px; }

.pt-0 { padding-top: 0; }
.pt-1 { padding-top: 8px; }
.pt-2 { padding-top: 16px; }
.pt-3 { padding-top: 24px; }
.pt-4 { padding-top: 32px; }

.pb-0 { padding-bottom: 0; }
.pb-1 { padding-bottom: 8px; }
.pb-2 { padding-bottom: 16px; }
.pb-3 { padding-bottom: 24px; }
.pb-4 { padding-bottom: 32px; }

.pl-0 { padding-left: 0; }
.pl-1 { padding-left: 8px; }
.pl-2 { padding-left: 16px; }
.pl-3 { padding-left: 24px; }
.pl-4 { padding-left: 32px; }

.pr-0 { padding-right: 0; }
.pr-1 { padding-right: 8px; }
.pr-2 { padding-right: 16px; }
.pr-3 { padding-right: 24px; }
.pr-4 { padding-right: 32px; }
</style>
