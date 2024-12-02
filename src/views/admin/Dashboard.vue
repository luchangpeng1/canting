<template>
  <div class="dashboard-container">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="20" class="dashboard-header">
      <el-col :span="6" v-for="stat in statsData" :key="stat.title">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <el-icon :size="24" :color="stat.color">
              <component :is="stat.icon" />
            </el-icon>
            <div class="stat-info">
              <div class="stat-title">{{ stat.title }}</div>
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-trend" :class="{ 'up': stat.trend > 0, 'down': stat.trend < 0 }">
                <el-icon>
                  <component :is="stat.trend > 0 ? 'ArrowUp' : 'ArrowDown'" />
                </el-icon>
                {{ Math.abs(stat.trend) }}%
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>营业趋势</span>
              <el-radio-group v-model="salesTimeRange" size="small">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="year">全年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="salesChart" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>菜品销量排行</span>
              <el-select v-model="dishRankType" size="small">
                <el-option label="今日" value="today" />
                <el-option label="本周" value="week" />
                <el-option label="本月" value="month" />
              </el-select>
            </div>
          </template>
          <div ref="dishRankChart" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 下部数据表格 -->
    <el-row :gutter="20" class="data-row">
      <el-col :span="12">
        <el-card class="data-card">
          <template #header>
            <div class="card-header">
              <span>待处理订单</span>
              <el-button type="primary" link @click="handleMoreOrders">
                查看更多<el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
          </template>
          <el-table :data="pendingOrders" stripe style="width: 100%">
            <el-table-column prop="orderNo" label="订单号" width="120" />
            <el-table-column prop="time" label="下单时间" width="160" />
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-tag :type="getOrderStatusType(row.status)">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleOrder(row)">
                  处理
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="data-card">
          <template #header>
            <div class="card-header">
              <span>库存预警</span>
              <el-button type="primary" link @click="handleMoreStock">
                查看更多<el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
          </template>
          <el-table :data="stockAlerts" stripe style="width: 100%">
            <el-table-column prop="name" label="商品名称" />
            <el-table-column prop="stock" label="当前库存" width="100">
              <template #default="{ row }">
                <el-tag :type="getStockLevelType(row.stock)" effect="dark">
                  {{ row.stock }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="threshold" label="预警阈值" width="100" />
            <el-table-column fixed="right" label="操作" width="120">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleStock(row)">
                  补货
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { 
  Money, 
  ShoppingCart, 
  User, 
  Goods,
  ArrowUp,
  ArrowDown,
  ArrowRight
} from '@element-plus/icons-vue'

const router = useRouter()
const salesChart = ref(null)
const dishRankChart = ref(null)
let salesChartInstance = null
let dishRankChartInstance = null

// 统计数据
const statsData = ref([
  {
    title: '今日营业额',
    value: '¥8,846',
    trend: 12.5,
    icon: 'Money',
    color: '#409EFF'
  },
  {
    title: '今日订单数',
    value: '168',
    trend: 8.2,
    icon: 'ShoppingCart',
    color: '#67C23A'
  },
  {
    title: '今日客流量',
    value: '1,286',
    trend: -3.5,
    icon: 'User',
    color: '#E6A23C'
  },
  {
    title: '菜品总数',
    value: '86',
    trend: 4.8,
    icon: 'Goods',
    color: '#F56C6C'
  }
])

// 时间范围选择
const salesTimeRange = ref('week')
const dishRankType = ref('today')

// 待处理订单数据
const pendingOrders = ref([
  {
    orderNo: 'DD20240320001',
    time: '2024-03-20 10:30:25',
    status: '待接单'
  },
  {
    orderNo: 'DD20240320002',
    time: '2024-03-20 10:35:12',
    status: '待接单'
  },
  {
    orderNo: 'DD20240320003',
    time: '2024-03-20 10:38:45',
    status: '制作中'
  },
  {
    orderNo: 'DD20240320004',
    time: '2024-03-20 10:42:18',
    status: '待接单'
  }
])

// 库存预警数据
const stockAlerts = ref([
  {
    name: '土豆',
    stock: 5,
    threshold: 10
  },
  {
    name: '胡萝卜',
    stock: 8,
    threshold: 15
  },
  {
    name: '青椒',
    stock: 3,
    threshold: 10
  },
  {
    name: '猪肉',
    stock: 12,
    threshold: 20
  }
])

// 初始化销售趋势图表
const initSalesChart = () => {
  if (!salesChart.value) return
  
  salesChartInstance = echarts.init(salesChart.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['营业额', '订单量']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: [
      {
        type: 'value',
        name: '营业额',
        axisLabel: {
          formatter: '¥{value}'
        }
      },
      {
        type: 'value',
        name: '订单量',
        axisLabel: {
          formatter: '{value}单'
        }
      }
    ],
    series: [
      {
        name: '营业额',
        type: 'line',
        smooth: true,
        data: [5200, 4800, 6300, 5800, 7200, 8500, 7800]
      },
      {
        name: '订单量',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        data: [120, 110, 145, 135, 160, 185, 170]
      }
    ]
  }
  
  salesChartInstance.setOption(option)
}

// 初始化菜品排行图表
const initDishRankChart = () => {
  if (!dishRankChart.value) return
  
  dishRankChartInstance = echarts.init(dishRankChart.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: ['红烧肉', '鱼香肉丝', '宫保鸡丁', '麻婆豆腐', '青椒肉丝']
    },
    series: [
      {
        name: '销量',
        type: 'bar',
        data: [58, 45, 42, 38, 35]
      }
    ]
  }
  
  dishRankChartInstance.setOption(option)
}

// 监听窗口大小变化
const handleResize = () => {
  salesChartInstance?.resize()
  dishRankChartInstance?.resize()
}

// 获取订单状态对应的标签类型
const getOrderStatusType = (status) => {
  const types = {
    '待接单': 'warning',
    '制作中': 'primary',
    '待配送': 'success',
    '已完成': 'info'
  }
  return types[status] || 'info'
}

// 获取库存等级对应的标签类型
const getStockLevelType = (stock) => {
  if (stock <= 5) return 'danger'
  if (stock <= 10) return 'warning'
  return 'success'
}

// 处理订单
const handleOrder = (order) => {
  router.push({
    path: '/admin/orders',
    query: { orderNo: order.orderNo }
  })
}

// 处理库存
const handleStock = (item) => {
  router.push({
    path: '/admin/inventory',
    query: { item: item.name }
  })
}

// 查看更多订单
const handleMoreOrders = () => {
  router.push('/admin/orders')
}

// 查看更多库存
const handleMoreStock = () => {
  router.push('/admin/inventory')
}

onMounted(() => {
  initSalesChart()
  initDishRankChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  salesChartInstance?.dispose()
  dishRankChartInstance?.dispose()
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.dashboard-header {
  margin-bottom: 20px;
}

.stat-card {
  height: 120px;
}

.stat-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.stat-info {
  margin-left: 20px;
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.stat-trend {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #67C23A;
}

.stat-trend.down {
  color: #F56C6C;
}

.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  height: 400px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart {
  height: 340px;
}

.data-row {
  margin-bottom: 20px;
}

.data-card {
  height: 400px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}


</style> 