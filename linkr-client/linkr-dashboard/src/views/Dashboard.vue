<template>
  <el-container class="oa-dashboard">
    <!-- 左侧导航 -->
    <el-aside width="220px" class="oa-aside">
      <div class="logo">
        <el-icon><Grid /></el-icon>
        <span>MetaLinkr</span>
      </div>
      <el-menu class="oa-menu" :default-active="activeMenu" router>
        <el-menu-item-group v-for="group in sideMenus" :key="group.name">
          <template #title>
            <span class="group-title">{{ group.name }}</span>
          </template>
          <el-menu-item v-for="item in group.items" :key="item.path" :index="item.path">
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.label }}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-menu>
    </el-aside>

    <!-- 右侧主体 -->
    <el-container>
      <el-header class="oa-header">
        <div class="left">
          <el-input v-model="keyword" placeholder="搜索流程/公告/人员…" clearable prefix-icon="Search" class="search" />
        </div>
        <div class="right">
          <el-tooltip content="消息">
            <el-button text circle><el-icon><Bell /></el-icon></el-button>
          </el-tooltip>
          <el-tooltip content="设置">
            <el-button text circle><el-icon><Setting /></el-icon></el-button>
          </el-tooltip>
          <el-avatar size="small" src="https://dummyimage.com/80x80/2f4056/fff&text=U" />
        </div>
      </el-header>

      <el-main class="oa-main">
        <div class="dashboard-grid">
          <!-- 待办流程 -->
          <div class="grid-item grid-item-large">
            <el-card class="block">
              <template #header>
                <div class="block-header">
                  <div class="title">
                    <span class="strong">待办流程</span>
                    <el-segmented v-model="todoTab" :options="todoTabs" size="small" class="seg" />
                  </div>
                  <el-input v-model="todoSearch" placeholder="搜索待办" size="small" clearable style="width: 180px" />
                </div>
              </template>

              <el-table :data="filteredTodos" size="small" border style="width: 100%">
                <el-table-column prop="title" label="标题" min-width="200" />
                <el-table-column prop="dept" label="部门" width="80" />
                <el-table-column prop="owner" label="发起人" width="80" />
                <el-table-column prop="date" label="日期" width="90" />
              </el-table>
            </el-card>
          </div>

          <!-- 快捷入口 -->
          <div class="grid-item grid-item-medium">
            <el-card class="block">
              <template #header>
                <div class="block-header"><span class="strong">快捷入口</span></div>
              </template>
              <div class="quick-grid">
                <div class="quick-item" v-for="q in quickEntries" :key="q.text">
                  <div class="icon-wrap">
                    <el-icon :size="22"><component :is="q.icon" /></el-icon>
                  </div>
                  <div class="q-text">{{ q.text }}</div>
                </div>
              </div>
            </el-card>
          </div>

          <!-- 集团新闻 -->
          <div class="grid-item grid-item-large">
            <el-card class="block">
              <template #header>
                <div class="block-header"><span class="strong">集团新闻</span></div>
              </template>
              <el-scrollbar height="260px">
                <div class="news-list">
                  <div class="news-item" v-for="n in news" :key="n.id">
                    <img :src="n.cover" class="thumb" />
                    <div class="meta">
                      <div class="title ellipsis">{{ n.title }}</div>
                      <div class="sub">{{ n.dept }} · {{ n.date }}</div>
                    </div>
                  </div>
                </div>
              </el-scrollbar>
            </el-card>
          </div>

          <!-- 新员工介绍 -->
          <div class="grid-item grid-item-medium">
            <el-card class="block">
              <template #header>
                <div class="block-header"><span class="strong">新员工介绍</span></div>
              </template>
              <div class="staff">
                <el-avatar size="large" :src="staff.avatar" />
                <div class="info">
                  <div class="name">{{ staff.name }}</div>
                  <div class="desc ellipsis">{{ staff.desc }}</div>
                  <div class="date">入职日期：{{ staff.date }}</div>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
  
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Bell, Setting, Grid, Tickets, Document, Stamp, Edit, Notebook, Folder, User, ChatDotRound, Search } from '@element-plus/icons-vue'

const activeMenu = ref('/')
const keyword = ref('')

// 侧边菜单（示例）
const sideMenus = [
  { name: '协同门户', items: [
    { label: '个人门户', path: '/', icon: User },
    { label: '集团门户', path: '/group', icon: Grid },
    { label: '销售门户', path: '/sales', icon: Tickets },
    { label: '产品门户', path: '/product', icon: Notebook },
    { label: '客户门户', path: '/customer', icon: ChatDotRound },
  ]},
  { name: '应用', items: [
    { label: '新闻管理', path: '/news', icon: Document },
    { label: '会议管理', path: '/meeting', icon: Folder },
    { label: '人资管理', path: '/hr', icon: User },
    { label: '公文管理', path: '/doc', icon: Stamp },
  ]},
]

// 待办流程
const todoTabs = [ '待办(9)', '已办', '我的', '抄送', '发起' ]
const todoTab = ref(todoTabs[0])
const todoSearch = ref('')
const todos = reactive([
  { title: '招聘审批：华东研发项目，预算 3,900', dept: '人资', owner: '刘新云', date: '2023-12-28' },
  { title: '上海XX项目立项审批流程', dept: '运营', owner: '云欢', date: '2023-12-23' },
  { title: '北京办公小型采购申请流程', dept: '采购', owner: '赵杰', date: '2023-12-19' },
  { title: '发文签发流程：通知-部门例会安排', dept: '行政', owner: '王宁', date: '2023-12-18' },
  { title: '差旅报销审批：华南客户拜访', dept: '财务', owner: '毛毛', date: '2023-12-15' },
])
const filteredTodos = computed(() => {
  const k = todoSearch.value.trim()
  return k ? todos.filter(t => Object.values(t).some(v => String(v).includes(k))) : todos
})

// 快捷入口
const quickEntries = reactive([
  { icon: Edit, text: '发文拟稿' },
  { icon: Document, text: '发文处理' },
  { icon: Stamp, text: '印章申请' },
  { icon: Tickets, text: '用印审批' },
  { icon: Notebook, text: '证件年审' },
  { icon: Folder, text: '合同申请' },
  { icon: User, text: '人员入职' },
  { icon: User, text: '人员离职' },
  { icon: Grid, text: '档案管理' },
  { icon: Document, text: '发布公告' },
  { icon: Document, text: '收文办理' },
  { icon: Tickets, text: '补卡申请' },
])

// 新闻/新员工
const news = reactive([
  { id: 1, title: '集团召开季度经营会议圆满召开', dept: '集团办公室', date: '2023-12-29', cover: 'https://dummyimage.com/120x72/ebedf0/909399&text=NEWS' },
  { id: 2, title: '某项目成功交付，客户验收通过', dept: '项目管理部', date: '2023-12-28', cover: 'https://dummyimage.com/120x72/f5f7fa/909399&text=NEWS' },
  { id: 3, title: '2023 年度优秀员工表彰大会举行', dept: '人力资源部', date: '2023-12-26', cover: 'https://dummyimage.com/120x72/ebedf0/909399&text=NEWS' },
  { id: 4, title: '产品重大更新发布说明', dept: '产品中心', date: '2023-12-24', cover: 'https://dummyimage.com/120x72/f5f7fa/909399&text=NEWS' },
])

const staff = reactive({
  name: '王小丽',
  desc: '来自华南区售前，擅长大客户需求分析与方案设计，欢迎加入！',
  date: '2023-12-29',
  avatar: 'https://dummyimage.com/96x96/2f4056/fff&text=W',
})
</script>

<style scoped>
/* 年轻化Dashboard样式 */
.oa-dashboard { 
  height: 100%; 
  min-height: calc(100vh - 0px); 
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  animation: fadeIn 0.5s ease-out;
}

.oa-aside { 
  background: rgba(255, 255, 255, 0.95); 
  color: var(--text-primary); 
  border-right: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-lg);
}

.logo { 
  height: 64px; 
  display: flex; 
  align-items: center; 
  gap: 12px; 
  padding: 0 20px; 
  color: var(--primary-color); 
  font-weight: 700; 
  font-size: 18px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.oa-menu { 
  --el-menu-bg-color: transparent; 
  border-right: none; 
  padding: 16px 0;
}

.group-title { 
  color: var(--text-secondary); 
  font-size: 12px; 
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 16px 20px 8px;
}

.oa-header { 
  height: 64px; 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  padding: 0 24px; 
  background: rgba(255, 255, 255, 0.95); 
  color: var(--text-primary); 
  border-bottom: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-sm);
}

.oa-header .search { 
  width: 320px; 
  border-radius: var(--radius-lg);
}

.oa-header .right { 
  display: flex; 
  align-items: center; 
  gap: 12px; 
}

.oa-main { 
  padding: 16px; 
  background: var(--bg-secondary);
  min-height: calc(100vh - 64px);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto auto;
  gap: 16px;
  height: calc(100vh - 96px);
  min-width: 0;
  overflow: hidden;
}

.grid-item {
  display: flex;
  flex-direction: column;
}

.grid-item-large {
  grid-row: span 1;
}

.grid-item-medium {
  grid-row: span 1;
}

.block { 
  height: 100%;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
  background: var(--bg-primary);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.block:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.block :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.block-header { 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  padding: 20px 20px 0;
  min-width: 0;
}

.block-header .title { 
  display: flex; 
  align-items: center; 
  gap: 12px; 
  min-width: 0;
  flex: 1;
}

.strong { 
  font-weight: 700; 
  color: var(--text-primary);
  font-size: 16px;
}

.seg :deep(.el-segmented__item) { 
  padding: 4px 12px; 
  border-radius: var(--radius-md);
}

.quick-grid { 
  display: grid; 
  grid-template-columns: repeat(3, 1fr); 
  gap: 12px; 
  padding: 16px;
  flex: 1;
  min-width: 0;
}

.quick-item { 
  background: var(--bg-secondary); 
  border: 1px solid var(--border-light); 
  border-radius: var(--radius-lg); 
  padding: 16px 12px; 
  text-align: center; 
  cursor: pointer; 
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.quick-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.quick-item:hover::before {
  transform: scaleX(1);
}

.quick-item:hover { 
  background: var(--bg-primary); 
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.icon-wrap { 
  width: 40px; 
  height: 40px; 
  margin: 0 auto 8px; 
  border-radius: var(--radius-lg); 
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  display: flex; 
  align-items: center; 
  justify-content: center; 
  color: white;
  transition: all 0.3s ease;
}

.quick-item:hover .icon-wrap {
  transform: scale(1.1);
}

.q-text { 
  font-size: 12px; 
  color: var(--text-primary);
  font-weight: 500;
}

.news-list { 
  display: flex; 
  flex-direction: column; 
  gap: 12px; 
  padding: 16px;
  flex: 1;
  min-width: 0;
}

.news-item { 
  display: flex; 
  gap: 12px; 
  align-items: center; 
  padding: 12px; 
  border-radius: var(--radius-lg); 
  transition: all 0.3s ease;
  border: 1px solid transparent;
  min-width: 0;
}

.news-item:hover { 
  background: var(--bg-secondary); 
  border-color: var(--border-color);
  transform: translateX(4px);
}

.thumb { 
  width: 80px; 
  height: 50px; 
  border-radius: var(--radius-md); 
  object-fit: cover; 
  background: var(--bg-tertiary);
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
}

.meta .title { 
  font-weight: 600; 
  margin-bottom: 4px; 
  color: var(--text-primary);
  font-size: 13px;
  min-width: 0;
}

.meta .sub { 
  color: var(--text-secondary); 
  font-size: 12px; 
}

.staff { 
  display: flex; 
  gap: 16px; 
  align-items: center; 
  padding: 16px;
  flex: 1;
  min-width: 0;
}

.staff .info { 
  display: flex; 
  flex-direction: column; 
  gap: 8px; 
  min-width: 0;
  flex: 1;
}

.staff .name { 
  font-weight: 700; 
  color: var(--text-primary);
  font-size: 16px;
}

.staff .desc {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.4;
  min-width: 0;
}

.staff .date { 
  color: var(--text-tertiary); 
  font-size: 12px; 
}

.ellipsis { 
  overflow: hidden; 
  text-overflow: ellipsis; 
  white-space: nowrap; 
}

/* 表格适配 */
.block :deep(.el-table) {
  width: 100% !important;
}

.block :deep(.el-table__body-wrapper) {
  overflow-x: auto;
}

.block :deep(.el-table__header-wrapper) {
  overflow-x: auto;
}

/* 确保内容不会溢出容器 */
.oa-main {
  overflow-x: hidden;
}

.grid-item {
  min-width: 0;
  overflow: hidden;
}

.mt16 { 
  margin-top: 24px; 
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto;
  }
  
  .grid-item-large,
  .grid-item-medium {
    grid-row: span 1;
  }
}

@media (max-width: 768px) {
  .dashboard-grid {
    gap: 12px;
  }
  
  .quick-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .oa-header .search {
    width: 180px;
  }
  
  .oa-main {
    padding: 12px;
  }
  
  .block-header {
    padding: 16px 16px 0;
  }
  
  .quick-grid,
  .news-list {
    padding: 12px;
  }
  
  .staff {
    padding: 12px;
  }
}
</style>


