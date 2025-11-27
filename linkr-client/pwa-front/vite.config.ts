import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'node:path'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/picsum\.photos\//i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30天
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-images',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7天
              }
            }
          }
        ],
        skipWaiting: true,
        clientsClaim: true
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'MetaLinkr - 智能社交平台',
        short_name: 'MetaLinkr',
        description: '找到真正懂你的人 - 综合性社交PWA应用',
        theme_color: '#667eea',
        background_color: '#f8fafc',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        categories: ['social', 'lifestyle', 'entertainment'],
        lang: 'zh-CN',
        dir: 'ltr',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
          {
            name: '开始匹配',
            short_name: '匹配',
            description: '快速开始智能匹配',
            url: '/match',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }]
          },
          {
            name: '语音派对',
            short_name: '语音',
            description: '加入语音房间',
            url: '/voice-party',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }]
          },
          {
            name: '观看直播',
            short_name: '直播',
            description: '观看精彩直播',
            url: '/live',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }]
          }
        ],
        related_applications: [],
        prefer_related_applications: false
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5176,
    host: '0.0.0.0',
    open: false,
      proxy: {
      '/api': {
        target: 'http://127.0.0.1:8082',
        changeOrigin: true,
        // 不重写路径，保留 /api 前缀，因为后端接口路径包含 /api
        // rewrite: (p) => p.replace(/^\/api/, ''),
      },
    },
  },
})
