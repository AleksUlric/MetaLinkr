<template>
  <div class="customer-service-page">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">客服中心</h1>
        <p class="page-subtitle">管理客户服务和在线支持</p>
      </div>
      <div class="header-right">
        <el-button type="primary" size="large" @click="openChat">
          <el-icon><ChatDotRound /></el-icon>
          开始对话
        </el-button>
      </div>
    </div>
    
    <div class="service-overview">
      <div class="overview-cards">
        <div class="overview-card">
          <div class="card-icon online">
            <el-icon><UserFilled /></el-icon>
          </div>
          <div class="card-content">
            <div class="card-value">{{ onlineAgents }}</div>
            <div class="card-label">在线客服</div>
            <div class="card-change positive">活跃</div>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="card-icon waiting">
            <el-icon><Clock /></el-icon>
          </div>
          <div class="card-content">
            <div class="card-value">{{ waitingCustomers }}</div>
            <div class="card-label">等待中</div>
            <div class="card-change warning">需关注</div>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="card-icon resolved">
            <el-icon><Check /></el-icon>
          </div>
          <div class="card-content">
            <div class="card-value">{{ resolvedTickets }}</div>
            <div class="card-label">已解决</div>
            <div class="card-change positive">+15.3%</div>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="card-icon satisfaction">
            <el-icon><Star /></el-icon>
          </div>
          <div class="card-content">
            <div class="card-value">{{ satisfactionRate }}%</div>
            <div class="card-label">满意度</div>
            <div class="card-change positive">+8.2%</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="service-content">
      <div class="service-main">
        <!-- 在线聊天 -->
        <div class="chat-section">
          <div class="section-header">
            <h2>在线聊天</h2>
            <div class="header-actions">
              <el-button size="small" @click="refreshChats">
                <el-icon><Refresh /></el-icon>
                刷新
              </el-button>
            </div>
          </div>
          
          <div class="chat-list">
            <div 
              v-for="chat in activeChats" 
              :key="chat.id"
              class="chat-item"
              :class="{ active: selectedChat?.id === chat.id }"
              @click="selectChat(chat)"
            >
              <div class="chat-avatar">
                <el-avatar :src="chat.customer.avatar" :size="40">
                  {{ chat.customer.name.charAt(0) }}
                </el-avatar>
                <div class="online-indicator" :class="{ online: chat.customer.isOnline }"></div>
              </div>
              
              <div class="chat-info">
                <div class="chat-header">
                  <h4 class="customer-name">{{ chat.customer.name }}</h4>
                  <span class="chat-time">{{ formatTime(chat.lastMessage.time) }}</span>
                </div>
                <p class="last-message">{{ chat.lastMessage.content }}</p>
                <div class="chat-meta">
                  <el-tag :type="getChatStatusType(chat.status)" size="small">
                    {{ getChatStatusText(chat.status) }}
                  </el-tag>
                  <span class="message-count">{{ chat.unreadCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 聊天窗口 -->
        <div v-if="selectedChat" class="chat-window">
          <div class="chat-header">
            <div class="customer-info">
              <el-avatar :src="selectedChat.customer.avatar" :size="32">
                {{ selectedChat.customer.name.charAt(0) }}
              </el-avatar>
              <div class="customer-details">
                <h4 class="customer-name">{{ selectedChat.customer.name }}</h4>
                <p class="customer-status">
                  {{ selectedChat.customer.isOnline ? '在线' : '离线' }}
                </p>
              </div>
            </div>
            <div class="chat-actions">
              <el-button size="small" @click="transferChat">
                <el-icon><Switch /></el-icon>
                转接
              </el-button>
              <el-button size="small" @click="closeChat">
                <el-icon><Close /></el-icon>
                结束
              </el-button>
            </div>
          </div>
          
          <div class="chat-messages" ref="chatMessagesRef">
            <div 
              v-for="message in selectedChat.messages" 
              :key="message.id"
              class="message-item"
              :class="{ 'is-agent': message.isAgent }"
            >
              <div class="message-avatar">
                <el-avatar 
                  :src="message.isAgent ? agentAvatar : selectedChat.customer.avatar" 
                  :size="32"
                >
                  {{ message.isAgent ? 'A' : selectedChat.customer.name.charAt(0) }}
                </el-avatar>
              </div>
              <div class="message-content">
                <div class="message-header">
                  <span class="sender-name">
                    {{ message.isAgent ? '客服' : selectedChat.customer.name }}
                  </span>
                  <span class="message-time">{{ formatTime(message.time) }}</span>
                </div>
                <div class="message-text">{{ message.content }}</div>
              </div>
            </div>
          </div>
          
          <div class="chat-input">
            <el-input
              v-model="newMessage"
              type="textarea"
              :rows="3"
              placeholder="输入消息..."
              @keyup.ctrl.enter="sendMessage"
            />
            <div class="input-actions">
              <el-button size="small" @click="sendQuickReply">
                <el-icon><ChatDotRound /></el-icon>
                快捷回复
              </el-button>
              <el-button type="primary" @click="sendMessage" :disabled="!newMessage.trim()">
                发送
              </el-button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 工单系统 -->
      <div class="tickets-section">
        <div class="section-header">
          <h2>工单系统</h2>
          <el-button type="primary" size="small" @click="createTicket">
            <el-icon><Plus /></el-icon>
            新建工单
          </el-button>
        </div>
        
        <div class="tickets-filters">
          <el-select v-model="ticketFilter" placeholder="筛选状态" clearable>
            <el-option label="全部状态" value="" />
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="已解决" value="resolved" />
            <el-option label="已关闭" value="closed" />
          </el-select>
          <el-select v-model="priorityFilter" placeholder="筛选优先级" clearable>
            <el-option label="全部优先级" value="" />
            <el-option label="高" value="high" />
            <el-option label="中" value="medium" />
            <el-option label="低" value="low" />
          </el-select>
        </div>
        
        <div class="tickets-list">
          <div 
            v-for="ticket in filteredTickets" 
            :key="ticket.id"
            class="ticket-item"
            @click="viewTicket(ticket)"
          >
            <div class="ticket-header">
              <h4 class="ticket-title">{{ ticket.title }}</h4>
              <div class="ticket-meta">
                <el-tag :type="getTicketStatusType(ticket.status)" size="small">
                  {{ getTicketStatusText(ticket.status) }}
                </el-tag>
                <el-tag :type="getPriorityType(ticket.priority)" size="small">
                  {{ getPriorityText(ticket.priority) }}
                </el-tag>
              </div>
            </div>
            <p class="ticket-description">{{ ticket.description }}</p>
            <div class="ticket-footer">
              <span class="ticket-customer">{{ ticket.customer.name }}</span>
              <span class="ticket-time">{{ formatTime(ticket.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 知识库 -->
    <div class="knowledge-base-section">
      <div class="section-header">
        <h2>知识库</h2>
        <el-button type="primary" size="small" @click="createArticle">
          <el-icon><Plus /></el-icon>
          新建文章
        </el-button>
      </div>
      
      <div class="knowledge-categories">
        <div 
          v-for="category in knowledgeCategories" 
          :key="category.id"
          class="category-card"
        >
          <div class="category-header">
            <h3 class="category-name">{{ category.name }}</h3>
            <span class="article-count">{{ category.articleCount }} 篇文章</span>
          </div>
          <p class="category-desc">{{ category.description }}</p>
          <div class="category-actions">
            <el-button size="small" @click="viewCategory(category)">查看</el-button>
            <el-button size="small" type="primary" @click="editCategory(category)">编辑</el-button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 快捷回复对话框 -->
    <el-dialog
      v-model="showQuickReplyDialog"
      title="快捷回复"
      width="600px"
    >
      <div class="quick-replies">
        <div 
          v-for="reply in quickReplies" 
          :key="reply.id"
          class="quick-reply-item"
          @click="selectQuickReply(reply)"
        >
          <h4 class="reply-title">{{ reply.title }}</h4>
          <p class="reply-content">{{ reply.content }}</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ChatDotRound, UserFilled, Clock, Check, Star, Refresh, Switch, Close, Plus
} from '@element-plus/icons-vue'

// 响应式数据
const onlineAgents = ref(3)
const waitingCustomers = ref(5)
const resolvedTickets = ref(156)
const satisfactionRate = ref(92)

const selectedChat = ref(null)
const newMessage = ref('')
const chatMessagesRef = ref()
const agentAvatar = ref('https://via.placeholder.com/32x32')

const ticketFilter = ref('')
const priorityFilter = ref('')
const showQuickReplyDialog = ref(false)

// 在线聊天数据
const activeChats = ref([
  {
    id: 1,
    customer: {
      name: '张三',
      avatar: 'https://via.placeholder.com/40x40',
      isOnline: true
    },
    status: 'active',
    unreadCount: 2,
    lastMessage: {
      content: '请问这个产品有现货吗？',
      time: new Date(Date.now() - 5 * 60 * 1000)
    },
    messages: [
      {
        id: 1,
        content: '您好，有什么可以帮助您的吗？',
        isAgent: true,
        time: new Date(Date.now() - 10 * 60 * 1000)
      },
      {
        id: 2,
        content: '请问这个产品有现货吗？',
        isAgent: false,
        time: new Date(Date.now() - 5 * 60 * 1000)
      }
    ]
  },
  {
    id: 2,
    customer: {
      name: '李四',
      avatar: 'https://via.placeholder.com/40x40',
      isOnline: false
    },
    status: 'waiting',
    unreadCount: 0,
    lastMessage: {
      content: '好的，谢谢！',
      time: new Date(Date.now() - 30 * 60 * 1000)
    },
    messages: [
      {
        id: 1,
        content: '您好，请问有什么问题吗？',
        isAgent: true,
        time: new Date(Date.now() - 35 * 60 * 1000)
      },
      {
        id: 2,
        content: '我想了解一下退换货政策',
        isAgent: false,
        time: new Date(Date.now() - 32 * 60 * 1000)
      },
      {
        id: 3,
        content: '我们提供7天无理由退换货服务',
        isAgent: true,
        time: new Date(Date.now() - 31 * 60 * 1000)
      },
      {
        id: 4,
        content: '好的，谢谢！',
        isAgent: false,
        time: new Date(Date.now() - 30 * 60 * 1000)
      }
    ]
  }
])

// 工单数据
const tickets = ref([
  {
    id: 1,
    title: '产品质量问题',
    description: '收到的产品有质量问题，需要退换货',
    status: 'pending',
    priority: 'high',
    customer: { name: '王五' },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 2,
    title: '物流查询',
    description: '订单已发货，但物流信息没有更新',
    status: 'processing',
    priority: 'medium',
    customer: { name: '赵六' },
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
  },
  {
    id: 3,
    title: '账户问题',
    description: '无法登录账户，提示密码错误',
    status: 'resolved',
    priority: 'low',
    customer: { name: '钱七' },
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
  }
])

// 知识库分类
const knowledgeCategories = ref([
  {
    id: 1,
    name: '常见问题',
    description: '客户最常遇到的问题和解答',
    articleCount: 25
  },
  {
    id: 2,
    name: '产品使用',
    description: '产品使用说明和操作指南',
    articleCount: 18
  },
  {
    id: 3,
    name: '退换货政策',
    description: '退换货相关政策和流程',
    articleCount: 12
  },
  {
    id: 4,
    name: '账户管理',
    description: '账户注册、登录、密码重置等',
    articleCount: 8
  }
])

// 快捷回复
const quickReplies = ref([
  {
    id: 1,
    title: '欢迎语',
    content: '您好，欢迎咨询！我是您的专属客服，有什么可以帮助您的吗？'
  },
  {
    id: 2,
    title: '产品咨询',
    content: '这款产品目前有现货，支持7天无理由退换货。您还有其他问题吗？'
  },
  {
    id: 3,
    title: '物流查询',
    content: '您的订单已发货，预计3-5个工作日送达。您可以关注物流信息更新。'
  },
  {
    id: 4,
    title: '结束语',
    content: '感谢您的咨询！如果还有其他问题，随时联系我们。祝您购物愉快！'
  }
])

// 计算属性
const filteredTickets = computed(() => {
  let filtered = tickets.value
  
  if (ticketFilter.value) {
    filtered = filtered.filter(ticket => ticket.status === ticketFilter.value)
  }
  
  if (priorityFilter.value) {
    filtered = filtered.filter(ticket => ticket.priority === priorityFilter.value)
  }
  
  return filtered
})

// 方法
const selectChat = (chat: any) => {
  selectedChat.value = chat
  chat.unreadCount = 0
  nextTick(() => {
    scrollToBottom()
  })
}

const sendMessage = () => {
  if (!newMessage.value.trim() || !selectedChat.value) return
  
  const message = {
    id: Date.now(),
    content: newMessage.value,
    isAgent: true,
    time: new Date()
  }
  
  selectedChat.value.messages.push(message)
  selectedChat.value.lastMessage = {
    content: newMessage.value,
    time: new Date()
  }
  
  newMessage.value = ''
  nextTick(() => {
    scrollToBottom()
  })
  
  ElMessage.success('消息已发送')
}

const sendQuickReply = () => {
  showQuickReplyDialog.value = true
}

const selectQuickReply = (reply: any) => {
  newMessage.value = reply.content
  showQuickReplyDialog.value = false
}

const scrollToBottom = () => {
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
  }
}

const formatTime = (time: Date) => {
  const now = new Date()
  const diff = now.getTime() - time.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (minutes < 1440) return `${Math.floor(minutes / 60)}小时前`
  return time.toLocaleDateString()
}

const getChatStatusType = (status: string) => {
  switch (status) {
    case 'active': return 'success'
    case 'waiting': return 'warning'
    case 'closed': return 'info'
    default: return 'info'
  }
}

const getChatStatusText = (status: string) => {
  switch (status) {
    case 'active': return '进行中'
    case 'waiting': return '等待中'
    case 'closed': return '已结束'
    default: return '未知'
  }
}

const getTicketStatusType = (status: string) => {
  switch (status) {
    case 'pending': return 'warning'
    case 'processing': return 'primary'
    case 'resolved': return 'success'
    case 'closed': return 'info'
    default: return 'info'
  }
}

const getTicketStatusText = (status: string) => {
  switch (status) {
    case 'pending': return '待处理'
    case 'processing': return '处理中'
    case 'resolved': return '已解决'
    case 'closed': return '已关闭'
    default: return '未知'
  }
}

const getPriorityType = (priority: string) => {
  switch (priority) {
    case 'high': return 'danger'
    case 'medium': return 'warning'
    case 'low': return 'info'
    default: return 'info'
  }
}

const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'high': return '高'
    case 'medium': return '中'
    case 'low': return '低'
    default: return '未知'
  }
}

const openChat = () => {
  ElMessage.info('开始新的对话')
}

const refreshChats = () => {
  ElMessage.success('聊天列表已刷新')
}

const transferChat = () => {
  ElMessage.info('转接功能开发中...')
}

const closeChat = () => {
  if (selectedChat.value) {
    selectedChat.value.status = 'closed'
    ElMessage.success('对话已结束')
  }
}

const createTicket = () => {
  ElMessage.info('创建工单功能开发中...')
}

const viewTicket = (ticket: any) => {
  ElMessage.info(`查看工单: ${ticket.title}`)
}

const createArticle = () => {
  ElMessage.info('创建知识库文章功能开发中...')
}

const viewCategory = (category: any) => {
  ElMessage.info(`查看分类: ${category.name}`)
}

const editCategory = (category: any) => {
  ElMessage.info(`编辑分类: ${category.name}`)
}

onMounted(() => {
  // 初始化数据
})
</script>

<style lang="scss" scoped>
.customer-service-page {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  
  .header-left {
    .page-title {
      font-size: 32px;
      font-weight: 700;
      color: var(--saas-text-primary);
      margin-bottom: 8px;
    }
    
    .page-subtitle {
      font-size: 16px;
      color: var(--saas-text-secondary);
    }
  }
  
  .header-right {
    .el-button {
      height: 40px;
      padding: 0 20px;
      font-weight: 500;
      
      .el-icon {
        margin-right: 8px;
      }
    }
  }
}

.service-overview {
  margin-bottom: 32px;
  
  .overview-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
    
    .overview-card {
      background: var(--saas-bg-primary);
      border-radius: 12px;
      padding: 24px;
      box-shadow: var(--saas-shadow);
      border: 1px solid var(--saas-border-light);
      display: flex;
      align-items: center;
      gap: 16px;
      
      .card-icon {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: white;
        
        &.online {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        &.waiting {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        
        &.resolved {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        
        &.satisfaction {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
      }
      
      .card-content {
        flex: 1;
        
        .card-value {
          font-size: 28px;
          font-weight: 700;
          color: var(--saas-text-primary);
          margin-bottom: 4px;
        }
        
        .card-label {
          font-size: 14px;
          color: var(--saas-text-secondary);
          margin-bottom: 8px;
        }
        
        .card-change {
          font-size: 12px;
          font-weight: 600;
          
          &.positive {
            color: var(--saas-success);
          }
          
          &.warning {
            color: var(--saas-warning);
          }
        }
      }
    }
  }
}

.service-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.service-main {
  .chat-section {
    background: var(--saas-bg-primary);
    border-radius: 12px;
    padding: 24px;
    box-shadow: var(--saas-shadow);
    border: 1px solid var(--saas-border-light);
    margin-bottom: 24px;
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      
      h2 {
        font-size: 20px;
        font-weight: 600;
        color: var(--saas-text-primary);
      }
    }
    
    .chat-list {
      max-height: 400px;
      overflow-y: auto;
      
      .chat-item {
        display: flex;
        gap: 12px;
        padding: 16px;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s;
        border: 1px solid transparent;
        
        &:hover {
          background: var(--saas-bg-tertiary);
        }
        
        &.active {
          background: rgba(var(--saas-primary), 0.05);
          border-color: var(--saas-primary);
        }
        
        .chat-avatar {
          position: relative;
          
          .online-indicator {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: var(--saas-text-tertiary);
            border: 2px solid white;
            
            &.online {
              background: var(--saas-success);
            }
          }
        }
        
        .chat-info {
          flex: 1;
          
          .chat-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
            
            .customer-name {
              font-size: 14px;
              font-weight: 600;
              color: var(--saas-text-primary);
            }
            
            .chat-time {
              font-size: 12px;
              color: var(--saas-text-tertiary);
            }
          }
          
          .last-message {
            font-size: 13px;
            color: var(--saas-text-secondary);
            margin-bottom: 8px;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .chat-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .message-count {
              background: var(--saas-primary);
              color: white;
              border-radius: 10px;
              padding: 2px 6px;
              font-size: 11px;
              min-width: 18px;
              text-align: center;
            }
          }
        }
      }
    }
  }
  
  .chat-window {
    background: var(--saas-bg-primary);
    border-radius: 12px;
    box-shadow: var(--saas-shadow);
    border: 1px solid var(--saas-border-light);
    height: 500px;
    display: flex;
    flex-direction: column;
    
    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid var(--saas-border-light);
      
      .customer-info {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .customer-details {
          .customer-name {
            font-size: 16px;
            font-weight: 600;
            color: var(--saas-text-primary);
            margin-bottom: 2px;
          }
          
          .customer-status {
            font-size: 12px;
            color: var(--saas-text-secondary);
          }
        }
      }
      
      .chat-actions {
        display: flex;
        gap: 8px;
      }
    }
    
    .chat-messages {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      
      .message-item {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;
        
        &.is-agent {
          flex-direction: row-reverse;
          
          .message-content {
            background: var(--saas-primary);
            color: white;
          }
        }
        
        .message-content {
          max-width: 70%;
          background: var(--saas-bg-tertiary);
          border-radius: 12px;
          padding: 12px 16px;
          
          .message-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
            
            .sender-name {
              font-size: 12px;
              font-weight: 600;
            }
            
            .message-time {
              font-size: 11px;
              opacity: 0.7;
            }
          }
          
          .message-text {
            font-size: 14px;
            line-height: 1.4;
          }
        }
      }
    }
    
    .chat-input {
      padding: 16px 20px;
      border-top: 1px solid var(--saas-border-light);
      
      .input-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 12px;
      }
    }
  }
}

.tickets-section {
  background: var(--saas-bg-primary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--saas-shadow);
  border: 1px solid var(--saas-border-light);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      font-size: 20px;
      font-weight: 600;
      color: var(--saas-text-primary);
    }
  }
  
  .tickets-filters {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
  }
  
  .tickets-list {
    max-height: 400px;
    overflow-y: auto;
    
    .ticket-item {
      padding: 16px;
      border: 1px solid var(--saas-border-light);
      border-radius: 8px;
      margin-bottom: 12px;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        border-color: var(--saas-primary);
        box-shadow: var(--saas-shadow-sm);
      }
      
      .ticket-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8px;
        
        .ticket-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--saas-text-primary);
        }
        
        .ticket-meta {
          display: flex;
          gap: 6px;
        }
      }
      
      .ticket-description {
        font-size: 13px;
        color: var(--saas-text-secondary);
        margin-bottom: 8px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .ticket-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .ticket-customer {
          font-size: 12px;
          color: var(--saas-text-tertiary);
        }
        
        .ticket-time {
          font-size: 12px;
          color: var(--saas-text-tertiary);
        }
      }
    }
  }
}

.knowledge-base-section {
  background: var(--saas-bg-primary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--saas-shadow);
  border: 1px solid var(--saas-border-light);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      font-size: 20px;
      font-weight: 600;
      color: var(--saas-text-primary);
    }
  }
  
  .knowledge-categories {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    
    .category-card {
      border: 1px solid var(--saas-border-light);
      border-radius: 8px;
      padding: 20px;
      transition: all 0.2s;
      
      &:hover {
        border-color: var(--saas-primary);
        box-shadow: var(--saas-shadow-sm);
      }
      
      .category-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        
        .category-name {
          font-size: 16px;
          font-weight: 600;
          color: var(--saas-text-primary);
        }
        
        .article-count {
          font-size: 12px;
          color: var(--saas-text-tertiary);
        }
      }
      
      .category-desc {
        font-size: 14px;
        color: var(--saas-text-secondary);
        margin-bottom: 16px;
        line-height: 1.4;
      }
      
      .category-actions {
        display: flex;
        gap: 8px;
      }
    }
  }
}

.quick-replies {
  .quick-reply-item {
    padding: 16px;
    border: 1px solid var(--saas-border-light);
    border-radius: 8px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      border-color: var(--saas-primary);
      background: rgba(var(--saas-primary), 0.05);
    }
    
    .reply-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--saas-text-primary);
      margin-bottom: 8px;
    }
    
    .reply-content {
      font-size: 13px;
      color: var(--saas-text-secondary);
      line-height: 1.4;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .customer-service-page {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .overview-cards {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .service-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .tickets-filters {
    flex-direction: column;
  }
  
  .knowledge-categories {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
