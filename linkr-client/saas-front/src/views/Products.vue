<template>
  <div class="products-page">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">商品管理</h1>
        <p class="page-subtitle">管理您的商品库存和价格</p>
      </div>
      <div class="header-right">
        <el-button type="primary" size="large" @click="showAddDialog = true">
          <el-icon><Plus /></el-icon>
          添加商品
        </el-button>
      </div>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="filters-section">
      <div class="filters-left">
        <el-input
          v-model="searchQuery"
          placeholder="搜索商品名称、SKU..."
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <el-select v-model="categoryFilter" placeholder="选择分类" clearable>
          <el-option label="全部分类" value="" />
          <el-option label="电子产品" value="electronics" />
          <el-option label="服装配饰" value="clothing" />
          <el-option label="家居用品" value="home" />
        </el-select>
        
        <el-select v-model="statusFilter" placeholder="选择状态" clearable>
          <el-option label="全部状态" value="" />
          <el-option label="在售" value="active" />
          <el-option label="下架" value="inactive" />
          <el-option label="缺货" value="out_of_stock" />
        </el-select>
      </div>
      
      <div class="filters-right">
        <el-button @click="resetFilters">重置筛选</el-button>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>
    
    <!-- 商品列表 -->
    <div class="products-table">
      <el-table :data="products" style="width: 100%" v-loading="loading">
        <el-table-column type="selection" width="55" />
        
        <el-table-column label="商品" width="300">
          <template #default="{ row }">
            <div class="product-info">
              <el-image
                :src="row.image"
                class="product-image"
                fit="cover"
              >
                <template #error>
                  <div class="image-error">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
              <div class="product-details">
                <div class="product-name">{{ row.name }}</div>
                <div class="product-sku">SKU: {{ row.sku }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="category" label="分类" width="120" />
        
        <el-table-column label="价格" width="120">
          <template #default="{ row }">
            <div class="price-info">
              <div class="current-price">¥{{ row.price }}</div>
              <div v-if="row.comparePrice" class="compare-price">¥{{ row.comparePrice }}</div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="库存" width="100">
          <template #default="{ row }">
            <div class="stock-info">
              <span :class="{ 'low-stock': row.stock < 10 }">{{ row.stock }}</span>
              <el-tag v-if="row.stock === 0" type="danger" size="small">缺货</el-tag>
              <el-tag v-else-if="row.stock < 10" type="warning" size="small">库存不足</el-tag>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="createdAt" label="创建时间" width="120" />
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="editProduct(row)">
              编辑
            </el-button>
            <el-button type="success" size="small" link @click="duplicateProduct(row)">
              复制
            </el-button>
            <el-button type="danger" size="small" link @click="deleteProduct(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    
    <!-- 添加商品对话框 -->
    <el-dialog
      v-model="showAddDialog"
      title="添加商品"
      width="800px"
      :before-close="handleCloseDialog"
    >
      <div class="dialog-placeholder">
        <el-icon class="dialog-icon"><Plus /></el-icon>
        <p>商品添加表单</p>
        <small>这里将显示商品添加表单</small>
      </div>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus, Search, Picture
} from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const searchQuery = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const showAddDialog = ref(false)

// 模拟商品数据
const products = ref([
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    sku: 'IPH15PM-256',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=80&h=80&fit=crop&crop=center',
    category: '电子产品',
    price: 9999,
    comparePrice: 10999,
    stock: 25,
    status: 'active',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'MacBook Pro 16"',
    sku: 'MBP16-512',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=80&h=80&fit=crop&crop=center',
    category: '电子产品',
    price: 19999,
    comparePrice: null,
    stock: 8,
    status: 'active',
    createdAt: '2024-01-14'
  },
  {
    id: 3,
    name: 'AirPods Pro',
    sku: 'APP-2ND',
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=80&h=80&fit=crop&crop=center',
    category: '电子产品',
    price: 1999,
    comparePrice: 2199,
    stock: 0,
    status: 'out_of_stock',
    createdAt: '2024-01-13'
  },
  {
    id: 4,
    name: 'Nike Air Max 270',
    sku: 'NAM270-BLK',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop&crop=center',
    category: '服装配饰',
    price: 899,
    comparePrice: null,
    stock: 5,
    status: 'active',
    createdAt: '2024-01-12'
  },
  {
    id: 5,
    name: 'Apple Watch Series 9',
    sku: 'AWS9-45MM',
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=80&h=80&fit=crop&crop=center',
    category: '电子产品',
    price: 3299,
    comparePrice: 3599,
    stock: 15,
    status: 'active',
    createdAt: '2024-01-11'
  },
  {
    id: 6,
    name: 'iPad Pro 12.9"',
    sku: 'IPP12-256',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=80&h=80&fit=crop&crop=center',
    category: '电子产品',
    price: 8999,
    comparePrice: null,
    stock: 12,
    status: 'active',
    createdAt: '2024-01-10'
  }
])

// 方法
const handleSearch = () => {
  loading.value = true
  // 模拟搜索
  setTimeout(() => {
    loading.value = false
    ElMessage.success('搜索完成')
  }, 1000)
}

const resetFilters = () => {
  searchQuery.value = ''
  categoryFilter.value = ''
  statusFilter.value = ''
  handleSearch()
}

const getStatusType = (status: string) => {
  switch (status) {
    case 'active': return 'success'
    case 'inactive': return 'info'
    case 'out_of_stock': return 'danger'
    default: return 'info'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return '在售'
    case 'inactive': return '下架'
    case 'out_of_stock': return '缺货'
    default: return '未知'
  }
}

const editProduct = (product: any) => {
  ElMessage.info(`编辑商品: ${product.name}`)
}

const duplicateProduct = (product: any) => {
  ElMessage.success(`复制商品: ${product.name}`)
}

const deleteProduct = async (product: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除商品 "${product.name}" 吗？`, '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    ElMessage.success('删除成功')
  } catch {
    // 用户取消
  }
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  handleSearch()
}

const handleCloseDialog = () => {
  showAddDialog.value = false
}

onMounted(() => {
  total.value = products.value.length
})
</script>

<style lang="scss" scoped>
.products-page {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  
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

.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  background: var(--saas-bg-primary);
  border-radius: 8px;
  box-shadow: var(--saas-shadow);
  border: 1px solid var(--saas-border-light);
}

.filters-left {
  display: flex;
  gap: 16px;
  align-items: center;
  
  .search-input {
    width: 300px;
  }
  
  .el-select {
    width: 150px;
  }
}

.filters-right {
  display: flex;
  gap: 12px;
}

.products-table {
  background: var(--saas-bg-primary);
  border-radius: 8px;
  box-shadow: var(--saas-shadow);
  border: 1px solid var(--saas-border-light);
  overflow: hidden;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 12px;
  
  .product-image {
    width: 60px;
    height: 60px;
    border-radius: 6px;
    border: 1px solid var(--saas-border-light);
  }
  
  .image-error {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--saas-bg-tertiary);
    color: var(--saas-text-tertiary);
    font-size: 20px;
  }
  
  .product-details {
    .product-name {
      font-weight: 500;
      color: var(--saas-text-primary);
      margin-bottom: 4px;
    }
    
    .product-sku {
      font-size: 12px;
      color: var(--saas-text-tertiary);
    }
  }
}

.price-info {
  .current-price {
    font-weight: 600;
    color: var(--saas-text-primary);
  }
  
  .compare-price {
    font-size: 12px;
    color: var(--saas-text-tertiary);
    text-decoration: line-through;
  }
}

.stock-info {
  .low-stock {
    color: var(--saas-warning);
    font-weight: 500;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.dialog-placeholder {
  text-align: center;
  padding: 40px;
  color: var(--saas-text-tertiary);
  
  .dialog-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  p {
    font-size: 16px;
    margin-bottom: 8px;
  }
  
  small {
    font-size: 14px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .products-page {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .filters-section {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .filters-left {
    flex-direction: column;
    gap: 12px;
    
    .search-input {
      width: 100%;
    }
    
    .el-select {
      width: 100%;
    }
  }
  
  .filters-right {
    justify-content: center;
  }
}
</style>
