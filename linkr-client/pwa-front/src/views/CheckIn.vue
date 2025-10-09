<template>
  <div class="checkin-page">
    <div class="checkin-header">
      <el-button type="text" @click="$router.back()" class="back-btn">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <h2>地点打卡</h2>
      <el-button type="text" class="map-btn">
        <el-icon><Location /></el-icon>
      </el-button>
    </div>

    <div class="checkin-stats">
      <div class="stat-item">
        <div class="stat-number">{{ checkInCount }}</div>
        <div class="stat-label">累计打卡</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ badgeCount }}</div>
        <div class="stat-label">获得徽章</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ points }}</div>
        <div class="stat-label">获得积分</div>
      </div>
    </div>

    <div class="recent-checkins">
      <h3>最近打卡</h3>
      <div class="checkin-list">
        <div class="checkin-item" v-for="item in recentCheckins" :key="item.id">
          <div class="checkin-avatar">
            <el-avatar :src="item.photo" :size="60" shape="square" />
          </div>
          <div class="checkin-info">
            <div class="location-name">{{ item.locationName }}</div>
            <div class="checkin-time">{{ item.checkInTime }}</div>
            <div class="checkin-content">{{ item.content }}</div>
          </div>
          <div class="checkin-points">
            <span class="points">+{{ item.points }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="floating-action">
      <el-button type="primary" size="large" round class="checkin-btn">
        <el-icon><Plus /></el-icon>
        立即打卡
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface CheckInItem {
  id: string
  locationName: string
  photo: string
  content: string
  checkInTime: string
  points: number
}

const checkInCount = 28
const badgeCount = 5
const points = 560

const recentCheckins: CheckInItem[] = [
  {
    id: '1',
    locationName: '中央公园',
    photo: 'https://picsum.photos/200/200?random=101',
    content: '今天天气很好，来这里散步~',
    checkInTime: '2小时前',
    points: 20
  },
  {
    id: '2',
    locationName: '星巴克咖啡',
    photo: 'https://picsum.photos/200/200?random=102',
    content: '工作累了，来杯咖啡休息一下',
    checkInTime: '1天前',
    points: 20
  },
  {
    id: '3',
    locationName: '健身房',
    photo: 'https://picsum.photos/200/200?random=103',
    content: '坚持锻炼，保持健康！',
    checkInTime: '2天前',
    points: 20
  }
]
</script>

<style scoped>
.checkin-page {
  height: 100vh;
  background: #f9fafb;
  padding-bottom: 100px;
}

.checkin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.checkin-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.back-btn, .map-btn {
  color: #6b7280;
}

.checkin-stats {
  display: flex;
  background: white;
  margin: 16px;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #6366f1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}

.recent-checkins {
  margin: 16px;
}

.recent-checkins h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.checkin-list {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.checkin-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.checkin-item:last-child {
  border-bottom: none;
}

.checkin-avatar {
  margin-right: 12px;
}

.checkin-info {
  flex: 1;
  min-width: 0;
}

.location-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 16px;
  margin-bottom: 4px;
}

.checkin-time {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 4px;
}

.checkin-content {
  color: #6b7280;
  font-size: 14px;
}

.checkin-points {
  margin-left: 12px;
}

.points {
  color: #10b981;
  font-weight: 600;
  font-size: 16px;
}

.floating-action {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
}

.checkin-btn {
  padding: 16px 32px;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}
</style>

