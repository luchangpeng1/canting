<template>
  <div class="order-management">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="20" class="statistics">
      <el-col :span="6" v-for="stat in statistics" :key="stat.title">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-content">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-title">{{ stat.title }}</div>
          </div>
          <el-icon class="stat-icon"><component :is="stat.icon" /></el-icon>
        </el-card>
      </el-col>
    </el-row>

    <!-- 筛选工具栏 -->
    <div class="toolbar">
      <div class="filters">
        <el-select 
          v-model="canteenFilter" 
          placeholder="选择餐厅" 
          clearable
          @change="windowFilter = ''">
          <el-option
            v-for="canteen in canteens"
            :key="canteen.id"
            :label="canteen.name"
            :value="canteen.id">
          </el-option>
        </el-select>
        
        <el-select 
          v-model="windowFilter" 
          placeholder="选择窗口" 
          clearable
          :disabled="!canteenFilter">
          <el-option
            v-for="window in windows"
            :key="window.id"
            :label="window.name"
            :value="window.id">
          </el-option>
        </el-select>

        <el-select v-model="statusFilter" placeholder="订单状态" clearable>
          <el-option
            v-for="status in orderStatuses"
            :key="status.value"
            :label="status.label"
            :value="status.value">
          </el-option>
        </el-select>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :shortcuts="dateShortcuts"
        />
      </div>
      <div class="actions">
        <el-button type="primary" @click="exportOrders">
          <el-icon><Download /></el-icon>导出订单
        </el-button>
      </div>
    </div>

    <!-- 订单表格 -->
    <el-table
      :data="filteredOrders"
      style="width: 100%"
      border
      stripe
      v-loading="loading">
      <el-table-column prop="order_id" label="订单号" width="160" fixed />
      <el-table-column prop="canteen" label="餐厅" width="120" />
      <el-table-column prop="window" label="窗口" width="120" />
      <el-table-column label="订单内容" min-width="200">
        <template #default="{ row }">
          <div class="order-dishes">
            <el-tooltip
              v-for="dish in row.dishes"
              :key="dish.id"
              :content="`${dish.name} x${dish.quantity}`"
              placement="top"
              :show-after="500">
              <el-tag 
                size="small"
                class="dish-tag"
                :style="{ cursor: 'pointer' }">
                {{ dish.name }} x{{ dish.quantity }}
              </el-tag>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="total_amount" label="金额" width="100" align="right">
        <template #default="{ row }">
          ¥{{ row.total_amount.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="meal_type" label="就餐方式" width="90" align="center">
        <template #default="{ row }">
          <el-tag :type="row.meal_type === 'dine_in' ? 'success' : 'warning'" size="small">
            {{ row.meal_type === 'dine_in' ? '堂食' : '打包' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="90" align="center">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)" size="small">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="下单时间" width="150" align="center">
        <template #default="{ row }">
          {{ formatDateTime(row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right" align="center">
        <template #default="{ row }">
          <el-button-group>
            <el-button 
              link 
              type="primary" 
              @click="showOrderDetail(row)"
              :disabled="row.status === 'completed'">
              查看
            </el-button>
            <el-button 
              link 
              type="success" 
              v-if="row.status === 'pending'"
              @click="handleOrder(row, 'accept')">
              接单
            </el-button>
            <el-button 
              link 
              type="danger" 
              v-if="row.status === 'pending'"
              @click="handleOrder(row, 'reject')">
              拒绝
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 订单详情对话框 -->
    <el-dialog
      title="订单详情"
      v-model="detailDialogVisible"
      width="600px">
      <div v-if="currentOrder" class="order-detail">
        <div class="detail-section">
          <h4>基本信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="订单号">{{ currentOrder.order_id }}</el-descriptions-item>
            <el-descriptions-item label="下单时间">{{ formatDateTime(currentOrder.created_at) }}</el-descriptions-item>
            <el-descriptions-item label="餐厅">{{ currentOrder.canteen }}</el-descriptions-item>
            <el-descriptions-item label="窗口">{{ currentOrder.window }}</el-descriptions-item>
            <el-descriptions-item label="就餐方式">
              {{ currentOrder.meal_type === 'dine_in' ? '堂食' : '打包' }}
            </el-descriptions-item>
            <el-descriptions-item label="订单状态">
              <el-tag :type="getStatusType(currentOrder.status)">
                {{ getStatusText(currentOrder.status) }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="detail-section">
          <h4>菜品信息</h4>
          <el-table :data="currentOrder.dishes" border>
            <el-table-column prop="name" label="菜品名称" />
            <el-table-column prop="price" label="单价">
              <template #default="{ row }">¥{{ row.price.toFixed(2) }}</template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" width="100" />
            <el-table-column label="小计" width="120">
              <template #default="{ row }">
                ¥{{ (row.price * row.quantity).toFixed(2) }}
              </template>
            </el-table-column>
          </el-table>
          <div class="order-total">
            总计：<span class="total-amount">¥{{ currentOrder.total_amount.toFixed(2) }}</span>
          </div>
        </div>

        <div class="detail-section">
          <h4>备注信息</h4>
          <p class="remark">{{ currentOrder.remark || '无' }}</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button 
          type="primary" 
          v-if="currentOrder?.status === 'pending'"
          @click="handleOrder(currentOrder, 'accept')">
          接单
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Download,
  ShoppingCart,
  Check,
  Close,
  Timer
} from '@element-plus/icons-vue'
import dayjs from 'dayjs'

// 模拟窗口数据
const windowsData = {
  1: [ // 中央食堂
    { id: 101, name: '川湘菜窗口' },
    { id: 102, name: '粤式炖汤' },
    { id: 103, name: '新疆风味' },
    { id: 104, name: '面食档口' }
  ],
  2: [ // 沁园餐厅
    { id: 201, name: '江浙小炒' },
    { id: 202, name: '东北菜' },
    { id: 203, name: '清真窗口' }
  ],
  3: [ // 馨园餐厅
    { id: 301, name: '特色炒饭' },
    { id: 302, name: '火锅窗口' },
    { id: 303, name: '小吃档口' }
  ],
  4: [ // 仲园餐厅
    { id: 401, name: '日韩料理' },
    { id: 402, name: '西式快餐' },
    { id: 403, name: '粉面档口' }
  ],
  5: [ // 雅园餐厅
    { id: 501, name: '创意简餐' },
    { id: 502, name: '养生套餐' },
    { id: 503, name: '水饺馄饨' }
  ]
}

// 模拟订单数据
const mockOrders = [
  {
    id: 1,
    order_id: 'ORD20240301001',
    canteen_id: 1,
    canteen: '中央食堂',
    window_id: 101,
    window: '川湘菜窗口',
    dishes: [
      { id: 1, name: '宫保鸡丁', price: 18.00, quantity: 1 },
      { id: 2, name: '米饭', price: 2.00, quantity: 2 }
    ],
    total_amount: 22.00,
    meal_type: 'dine_in',
    status: 'pending',
    created_at: '2024-03-01 12:30:00',
    remark: '不要太辣'
  },
  {
    id: 2,
    order_id: 'ORD20240301002',
    canteen_id: 2,
    canteen: '沁园餐厅',
    window_id: 201,
    window: '江浙小炒',
    dishes: [
      { id: 3, name: '糖醋里脊', price: 22.00, quantity: 1 },
      { id: 4, name: '蛋炒饭', price: 12.00, quantity: 1 }
    ],
    total_amount: 34.00,
    meal_type: 'takeout',
    status: 'accepted',
    created_at: '2024-03-01 12:35:00',
    remark: ''
  },
  {
    id: 3,
    order_id: 'ORD20240301003',
    canteen_id: 3,
    canteen: '馨园餐厅',
    window_id: 302,
    window: '火锅窗口',
    dishes: [
      { id: 5, name: '牛肉火锅', price: 48.00, quantity: 1 },
      { id: 6, name: '青菜拼盘', price: 15.00, quantity: 1 }
    ],
    total_amount: 63.00,
    meal_type: 'dine_in',
    status: 'completed',
    created_at: '2024-03-01 13:00:00',
    remark: '多放香菜'
  },
  {
    id: 4,
    order_id: 'ORD20240301004',
    canteen_id: 4,
    canteen: '仲园餐厅',
    window_id: 401,
    window: '日韩料理',
    dishes: [
      { id: 7, name: '寿司拼盘', price: 35.00, quantity: 1 },
      { id: 8, name: '味增汤', price: 8.00, quantity: 1 }
    ],
    total_amount: 43.00,
    meal_type: 'dine_in',
    status: 'pending',
    created_at: '2024-03-01 13:15:00',
    remark: ''
  },
  {
    id: 5,
    order_id: 'ORD20240301005',
    canteen_id: 5,
    canteen: '雅园餐厅',
    window_id: 502,
    window: '养生套餐',
    dishes: [
      { id: 9, name: '五谷杂粮套餐', price: 28.00, quantity: 1 },
      { id: 10, name: '银耳汤', price: 12.00, quantity: 1 }
    ],
    total_amount: 40.00,
    meal_type: 'takeout',
    status: 'accepted',
    created_at: '2024-03-01 13:30:00',
    remark: '汤要热的'
  }
]

export default {
  name: 'OrderManagement',
  components: {
    Download,
    ShoppingCart,
    Check,
    Close,
    Timer
  },
  setup() {
    // 状态和数据
    const loading = ref(false)
    const orders = ref([])
    const currentPage = ref(1)
    const pageSize = ref(20)
    const total = ref(0)
    const canteenFilter = ref('')
    const statusFilter = ref('')
    const dateRange = ref([])
    const detailDialogVisible = ref(false)
    const currentOrder = ref(null)
    const windowFilter = ref('')

    // 统计数据
    const statistics = ref([
      { title: '今日订单', value: 0, type: 'primary', icon: 'ShoppingCart' },
      { title: '待处理', value: 0, type: 'warning', icon: 'Timer' },
      { title: '已完成', value: 0, type: 'success', icon: 'Check' },
      { title: '已取消', value: 0, type: 'danger', icon: 'Close' }
    ])

    // 餐厅数据
    const canteens = [
      { id: 1, name: '中央食堂' },
      { id: 2, name: '沁园餐厅' },
      { id: 3, name: '馨园餐厅' },
      { id: 4, name: '仲园餐厅' },
      { id: 5, name: '雅园餐厅' }
    ]

    // 订单状态
    const orderStatuses = [
      { value: 'pending', label: '待处理' },
      { value: 'accepted', label: '已接单' },
      { value: 'completed', label: '已完成' },
      { value: 'cancelled', label: '已取消' },
      { value: 'rejected', label: '已拒绝' }
    ]

    // 日期快捷选项
    const dateShortcuts = [
      {
        text: '最近一周',
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          return [start, end]
        }
      },
      {
        text: '最近一个月',
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          return [start, end]
        }
      }
    ]

    // 添加窗口筛选
    const windows = computed(() => {
      if (!canteenFilter.value) return []
      return windowsData[canteenFilter.value] || []
    })

    // 修改筛选逻辑
    const filteredOrders = computed(() => {
      return orders.value.filter(order => {
        let match = true
        if (canteenFilter.value) {
          match = match && order.canteen_id === canteenFilter.value
        }
        if (windowFilter.value) {
          match = match && order.window_id === windowFilter.value
        }
        if (statusFilter.value) {
          match = match && order.status === statusFilter.value
        }
        if (dateRange.value && dateRange.value.length === 2) {
          const orderDate = new Date(order.created_at)
          match = match && orderDate >= dateRange.value[0] && 
                          orderDate <= dateRange.value[1]
        }
        return match
      })
    })

    // 监听餐厅筛选变化
    watch(canteenFilter, () => {
      windowFilter.value = '' // 重置窗口筛选
    })

    // 获取状态类型
    const getStatusType = (status) => {
      const types = {
        pending: 'warning',
        accepted: 'primary',
        completed: 'success',
        cancelled: 'info',
        rejected: 'danger'
      }
      return types[status] || 'info'
    }

    // 获取状态文本
    const getStatusText = (status) => {
      const texts = {
        pending: '待处理',
        accepted: '已接单',
        completed: '已完成',
        cancelled: '已取消',
        rejected: '已拒绝'
      }
      return texts[status] || status
    }

    // 格式化日期时间
    const formatDateTime = (datetime) => {
      return dayjs(datetime).format('YYYY-MM-DD HH:mm:ss')
    }

    // 处理订单
    const handleOrder = async (order, action) => {
      try {
        const confirmText = action === 'accept' ? '接单' : '拒绝'
        await ElMessageBox.confirm(
          `确定要${confirmText}这个订单吗？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: action === 'accept' ? 'success' : 'warning'
          }
        )

        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // 直接修改订单状态
        order.status = action === 'accept' ? 'accepted' : 'rejected'
        
        ElMessage.success(`订单已${confirmText}`)
        detailDialogVisible.value = false
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error(`${action === 'accept' ? '接单' : '拒绝'}失败`)
        }
      }
    }

    // 导出订单
    const exportOrders = () => {
      ElMessage.success('订单导出功能在前端模式下不可用')
    }

    // 查看订单详情
    const showOrderDetail = (order) => {
      currentOrder.value = order
      detailDialogVisible.value = true
    }

    // 分页处理
    const handleSizeChange = (val) => {
      pageSize.value = val
      fetchOrders()
    }

    const handleCurrentChange = (val) => {
      currentPage.value = val
      fetchOrders()
    }

    // 获取订单列表
    const fetchOrders = async () => {
      loading.value = true
      try {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 过滤模拟数据
        let filteredData = [...mockOrders]
        if (canteenFilter.value) {
          filteredData = filteredData.filter(order => order.canteen_id === canteenFilter.value)
        }
        if (statusFilter.value) {
          filteredData = filteredData.filter(order => order.status === statusFilter.value)
        }
        if (dateRange.value?.length === 2) {
          filteredData = filteredData.filter(order => {
            const orderDate = new Date(order.created_at)
            return orderDate >= dateRange.value[0] && orderDate <= dateRange.value[1]
          })
        }

        // 更新订单数据
        orders.value = filteredData
        total.value = filteredData.length

        // 更新统计数据
        const today = dayjs().format('YYYY-MM-DD')
        statistics.value[0].value = filteredData.filter(order => 
          order.created_at.startsWith(today)).length
        statistics.value[1].value = filteredData.filter(order => 
          order.status === 'pending').length
        statistics.value[2].value = filteredData.filter(order => 
          order.status === 'completed').length
        statistics.value[3].value = filteredData.filter(order => 
          order.status === 'cancelled').length

      } catch (error) {
        ElMessage.error('获取订单列表失败')
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchOrders()
    })

    return {
      loading,
      orders,
      currentPage,
      pageSize,
      total,
      canteenFilter,
      statusFilter,
      dateRange,
      detailDialogVisible,
      currentOrder,
      statistics,
      canteens,
      orderStatuses,
      dateShortcuts,
      filteredOrders,
      getStatusType,
      getStatusText,
      formatDateTime,
      handleOrder,
      exportOrders,
      showOrderDetail,
      handleSizeChange,
      handleCurrentChange,
      windowFilter,
      windows,
    }
  }
}
</script>

<style scoped>
.order-management {
  padding: 20px;
}

.statistics {
  margin-bottom: 20px;
}

.stat-card {
  position: relative;
  overflow: hidden;
}

.stat-content {
  position: relative;
  z-index: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-title {
  color: #666;
}

.stat-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 48px;
  opacity: 0.2;
}

.stat-card.primary {
  background: linear-gradient(135deg, #1890ff 0%, #36a3f7 100%);
  color: white;
}
.stat-card.primary .stat-title {
  color: rgba(255, 255, 255, 0.8);
}

.stat-card.warning {
  background: linear-gradient(135deg, #ffa940 0%, #ffc53d 100%);
  color: white;
}
.stat-card.warning .stat-title {
  color: rgba(255, 255, 255, 0.8);
}

.stat-card.success {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  color: white;
}
.stat-card.success .stat-title {
  color: rgba(255, 255, 255, 0.8);
}

.stat-card.danger {
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
  color: white;
}
.stat-card.danger .stat-title {
  color: rgba(255, 255, 255, 0.8);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.filters {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.filters .el-select {
  min-width: 160px;
}

.order-dishes {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 4px 0;
}

.dish-tag {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all 0.3s;
}

.dish-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-section h4 {
  margin: 0 0 10px;
  padding-left: 10px;
  border-left: 4px solid #409EFF;
}

.order-total {
  margin-top: 10px;
  text-align: right;
  font-size: 16px;
}

.total-amount {
  color: #f56c6c;
  font-weight: bold;
  font-size: 20px;
}

.remark {
  color: #666;
  line-height: 1.5;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    gap: 10px;
  }

  .filters {
    flex-direction: column;
  }

  .filters > * {
    width: 100%;
  }
}

/* 添加窗口标签样式 */
.window-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 4px;
  background-color: #f0f2f5;
  font-size: 12px;
  color: #666;
  margin-right: 8px;
}

/* 表格相关样式 */
.el-table {
  --el-table-border-color: #ebeef5;
  --el-table-header-bg-color: #f5f7fa;
}

:deep(.el-table__header) {
  font-weight: 600;
}

:deep(.el-table__row) {
  transition: all 0.3s;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa !important;
}

:deep(.el-button-group) {
  display: inline-flex;
  gap: 4px;
}

/* 确保表格在小屏幕上也能正常显示 */
@media screen and (max-width: 1400px) {
  .el-table {
    width: 100%;
    overflow-x: auto;
  }
  
  .dish-tag {
    max-width: 100px;
  }
}

@media screen and (max-width: 768px) {
  .el-table {
    font-size: 13px;
  }
  
  .dish-tag {
    max-width: 80px;
    font-size: 12px;
  }
  
  :deep(.el-button--small) {
    padding: 4px 8px;
    font-size: 12px;
  }
}
</style> 