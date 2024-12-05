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
    <div class="filter-container">
      <el-select 
        v-model="selectedCanteen" 
        placeholder="选择餐厅"
        clearable
        @change="handleCanteenChange"
        style="width: 120px;"
      >
        <el-option 
          v-for="item in canteenOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      
      <el-select 
        v-model="selectedWindow"
        placeholder="选择窗口"
        clearable
        :disabled="!selectedCanteen"
        @change="handleWindowChange"
        style="width: 120px;"
      >
        <el-option
          v-for="item in windowOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <div class="header-left">
                <span class="title">餐厅营业情况</span>
                <el-radio-group v-model="salesTimeRange" size="small">
                  <el-radio-button :value="'week'">本周</el-radio-button>
                  <el-radio-button :value="'month'">本月</el-radio-button>
                  <el-radio-button :value="'year'">全年</el-radio-button>
                </el-radio-group>
              </div>
              <el-select 
                v-model="selectedViewCanteen" 
                placeholder="选择餐厅查看"
                clearable
                size="small"
                style="width: 120px;"
              >
                <el-option 
                  v-for="item in canteenOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </template>
          <el-scrollbar height="350px" class="canteen-stats">
            <div v-for="canteen in filteredCanteenStats" :key="canteen.id" class="canteen-item">
              <div class="canteen-header">
                <span class="canteen-name">{{ canteen.name }}</span>
                <el-tag v-if="canteen.performance !== '良好'" :type="getPerformanceType(canteen.performance)">
                  {{ canteen.performance }}
                </el-tag>
                <span v-else class="performance-normal">{{ canteen.performance }}</span>
              </div>
              <div class="canteen-details">
                <div class="detail-item">
                  <span class="label">营业额</span>
                  <span class="value">¥{{ canteen.revenue }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">订单数</span>
                  <span class="value">{{ canteen.orderCount }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">客单价</span>
                  <span class="value">¥{{ canteen.avgOrder }}</span>
                </div>
              </div>
              <div class="trend-indicator" :class="canteen.trend > 0 ? 'up' : 'down'">
                <el-icon><component :is="canteen.trend > 0 ? 'ArrowUp' : 'ArrowDown'" /></el-icon>
                <span>{{ Math.abs(canteen.trend) }}%</span>
              </div>
            </div>
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <div class="header-left">
                <span class="title">热门窗口排行</span>
              </div>
              <el-select 
                v-model="rankTimeRange" 
                size="small"
                style="width: 100px;"
              >
                <el-option label="今日" value="today" />
                <el-option label="本周" value="week" />
                <el-option label="本月" value="month" />
              </el-select>
            </div>
          </template>
          <el-scrollbar height="350px" class="window-ranking">
            <div v-for="(window, index) in topWindows" :key="window.id" 
              class="window-item" :class="{ 'top-three': index < 3 }">
              <div class="rank-number">{{ index + 1 }}</div>
              <div class="window-info">
                <div class="window-name">{{ window.name }}</div>
                <div class="window-canteen">{{ window.canteenName }}</div>
              </div>
              <div class="window-revenue">
                <div class="amount">¥{{ window.revenue }}</div>
                <div class="orders">{{ window.orderCount }}单</div>
              </div>
            </div>
          </el-scrollbar>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
// 1. 首先导入所需的依赖
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { 
  Money, 
  ShoppingCart, 
  User, 
  Goods,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  House,
  Shop
} from '@element-plus/icons-vue'
import { checkPermission, isSuperAdmin } from '@/utils/permission'
import { ElMessage } from 'element-plus'

// 2. 基础变量声明
const router = useRouter()
const salesTimeRange = ref('week')
const rankTimeRange = ref('today')
const selectedCanteen = ref('')
const selectedWindow = ref('')
const selectedViewCanteen = ref('')

// 3. 数据源声明
const canteens = ref([
  { id: '1', name: '第一餐厅', location: 'A区' },
  { id: '2', name: '第二餐厅', location: 'B区' },
  { id: '3', name: '第三餐厅', location: 'C区' },
  { id: '4', name: '第四餐厅', location: 'D区' },
  { id: '5', name: '第五餐厅', location: 'E区' },
  { id: '6', name: '教工餐厅', location: 'F区' },
  { id: '7', name: '研究生餐厅', location: 'G区' }
])

const windows = ref([
  // 第一餐厅
  { id: '101', name: '川湘菜', canteenId: '1', dailyRevenue: 3200 },
  { id: '102', name: '粤式炒饭', canteenId: '1', dailyRevenue: 2800 },
  { id: '103', name: '面食档口', canteenId: '1', dailyRevenue: 2500 },
  { id: '104', name: '特色小炒', canteenId: '1', dailyRevenue: 3100 },
  { id: '105', name: '烧腊饭', canteenId: '1', dailyRevenue: 3400 },
  
  // 第二餐厅
  { id: '201', name: '东北菜', canteenId: '2', dailyRevenue: 3500 },
  { id: '202', name: '清真档口', canteenId: '2', dailyRevenue: 2900 },
  { id: '203', name: '特色小炒', canteenId: '2', dailyRevenue: 3100 },
  { id: '204', name: '麻辣烫', canteenId: '2', dailyRevenue: 3800 },
  { id: '205', name: '快餐套餐', canteenId: '2', dailyRevenue: 2600 },
  
  // 第三餐厅
  { id: '301', name: '江浙菜', canteenId: '3', dailyRevenue: 3300 },
  { id: '302', name: '火锅档口', canteenId: '3', dailyRevenue: 4200 },
  { id: '303', name: '快餐套餐', canteenId: '3', dailyRevenue: 2700 },
  { id: '304', name: '日式料理', canteenId: '3', dailyRevenue: 3900 },
  { id: '305', name: '韩式料理', canteenId: '3', dailyRevenue: 3600 },
  
  // 第四餐厅
  { id: '401', name: '湘菜档口', canteenId: '4', dailyRevenue: 3700 },
  { id: '402', name: '粤式烧腊', canteenId: '4', dailyRevenue: 4100 },
  { id: '403', name: '面食档口', canteenId: '4', dailyRevenue: 2800 },
  { id: '404', name: '特色炒饭', canteenId: '4', dailyRevenue: 3200 },
  { id: '405', name: '快餐套餐', canteenId: '4', dailyRevenue: 2500 },
  
  // 第五餐厅
  { id: '501', name: '川菜档口', canteenId: '5', dailyRevenue: 3800 },
  { id: '502', name: '东北菜', canteenId: '5', dailyRevenue: 3400 },
  { id: '503', name: '清真美食', canteenId: '5', dailyRevenue: 3100 },
  { id: '504', name: '面食档口', canteenId: '5', dailyRevenue: 2700 },
  { id: '505', name: '快餐套餐', canteenId: '5', dailyRevenue: 2400 },
  
  // 教工餐厅
  { id: '601', name: '精品炒菜', canteenId: '6', dailyRevenue: 4500 },
  { id: '602', name: '营养套餐', canteenId: '6', dailyRevenue: 3900 },
  { id: '603', name: '特色面点', canteenId: '6', dailyRevenue: 3200 },
  { id: '604', name: '粤式烧腊', canteenId: '6', dailyRevenue: 4300 },
  { id: '605', name: '日韩料理', canteenId: '6', dailyRevenue: 4000 },
  
  // 研究生餐厅
  { id: '701', name: '自选快餐', canteenId: '7', dailyRevenue: 3700 },
  { id: '702', name: '特色小炒', canteenId: '7', dailyRevenue: 3400 },
  { id: '703', name: '面食档口', canteenId: '7', dailyRevenue: 2900 },
  { id: '704', name: '火锅档口', canteenId: '7', dailyRevenue: 4100 },
  { id: '705', name: '麻辣烫', canteenId: '7', dailyRevenue: 3500 }
])

const weeklySalesData = ref({
  '1': [15800, 16200, 14900, 16500, 17200, 12500, 13800],
  '2': [16500, 17200, 15800, 16900, 18200, 13500, 14200],
  '3': [17200, 16800, 16200, 17500, 18800, 14200, 15100]
})

// 4. 状态变量
const statsData = ref([
  {
    title: '总营业额',
    value: '¥0',
    trend: 0,
    icon: 'Money',
    color: '#409EFF'
  },
  {
    title: '总订单数',
    value: '0',
    trend: 0,
    icon: 'ShoppingCart',
    color: '#67C23A'
  },
  {
    title: '餐厅数量',
    value: '0',
    trend: 0,
    icon: 'House',
    color: '#E6A23C'
  },
  {
    title: '窗口总数',
    value: '0',
    trend: 0,
    icon: 'Shop',
    color: '#F56C6C'
  }
])

// 5. 计算属性
const windowOptions = computed(() => {
  if (!selectedCanteen.value) return []
  return windows.value
    .filter(w => w.canteenId === selectedCanteen.value)
    .map(w => ({
      label: w.name,
      value: w.id
    }))
})

const canteenOptions = computed(() => {
  return canteens.value.map(canteen => ({
    label: canteen.name,
    value: canteen.id
  }))
})

const canteenStats = computed(() => {
  return canteens.value.map(canteen => {
    const canteenWindows = windows.value.filter(w => w.canteenId === canteen.id)
    const totalRevenue = canteenWindows.reduce((sum, w) => sum + w.dailyRevenue, 0)
    const orderCount = Math.floor(totalRevenue / 25)
    
    return {
      id: canteen.id,
      name: canteen.name,
      revenue: totalRevenue.toLocaleString(),
      orderCount,
      avgOrder: Math.round(totalRevenue / orderCount).toLocaleString(),
      performance: totalRevenue > 9000 ? '优秀' : totalRevenue > 7000 ? '良好' : '一般',
      trend: Math.floor(Math.random() * 20) - 10
    }
  })
})

const topWindows = computed(() => {
  return windows.value
    .map(window => ({
      ...window,
      canteenName: canteens.value.find(c => c.id === window.canteenId)?.name,
      revenue: window.dailyRevenue.toLocaleString(),
      orderCount: Math.floor(window.dailyRevenue / 25)
    }))
    .sort((a, b) => b.dailyRevenue - a.dailyRevenue)
})

const filteredCanteenStats = computed(() => {
  if (!selectedViewCanteen.value) return canteenStats.value
  return canteenStats.value.filter(canteen => canteen.id === selectedViewCanteen.value)
})

// 6. 工具函数
const getPerformanceType = (performance) => {
  if (performance === '优秀') return 'success'
  if (performance === '良好') return 'info'
  if (performance === '一般') return 'warning'
  return 'info'
}

// 7. 事件处理函数
const handleCanteenChange = (value) => {
  selectedWindow.value = ''
  updateChartData()
}

const handleWindowChange = () => {
  updateChartData()
}

const handleResize = () => {
  // 不再需要处理图表resize
}

// 8. 数据更新函数
const updateChartData = async () => {
  try {
    // 获取选中的餐厅数据
    const canteenData = selectedCanteen.value ? 
      weeklySalesData.value[selectedCanteen.value] : 
      Object.values(weeklySalesData.value).reduce((acc, curr) => 
        curr.map((val, idx) => (acc[idx] || 0) + val), [])

    // 更新统计数据
    statsData.value = [
      {
        title: '总营业额',
        value: `¥${canteenData.reduce((sum, val) => sum + val, 0).toLocaleString()}`,
        trend: 12.5,
        icon: 'Money',
        color: '#409EFF'
      },
      {
        title: '总订单数',
        value: Math.floor(canteenData.reduce((sum, val) => sum + val, 0) / 25).toString(),
        trend: 8.2,
        icon: 'ShoppingCart',
        color: '#67C23A'
      },
      {
        title: '餐厅数量',
        value: canteens.value.length.toString(),
        trend: 0,
        icon: 'House',
        color: '#E6A23C'
      },
      {
        title: '窗口总数',
        value: windows.value.length.toString(),
        trend: 4.8,
        icon: 'Shop',
        color: '#F56C6C'
      }
    ]
  } catch (error) {
    console.error('更新数据失败:', error)
    ElMessage.error('更新数据失败')
  }
}

// 9. 生命周期钩子
onMounted(() => {
  updateChartData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  background: linear-gradient(to bottom right, #f0f2f5, #ffffff);
  min-height: calc(100vh - 60px);
}

.dashboard-header {
  margin-bottom: 15px;
}

.stat-card {
  height: 130px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
  border-radius: 12px;
  border: none;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: flex-start;
  height: 100%;
  padding: 20px;
  background: linear-gradient(45deg, #ffffff, #f8f9fa);
  border-radius: 12px;
}

.stat-info {
  margin-left: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-title {
  font-size: 14px;
  color: #909399;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.stat-trend {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #67C23A;
  gap: 4px;
}

.stat-trend.down {
  color: #F56C6C;
}

.chart-row {
  margin-bottom: 15px;
}

.chart-card {
  height: 420px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  padding-bottom: 0;
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.chart-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
  min-height: 56px;
  margin-bottom: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
  margin-right: 15px;
}

.header-left .title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  white-space: nowrap;
}

.chart {
  height: 380px;
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

.filter-container {
  margin-bottom: 15px;
  display: flex;
  gap: 20px;
  padding: 10px 20px;
  justify-content: flex-end;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

@media screen and (max-width: 1400px) {
  .stat-card {
    height: 150px;
  }
  
  .stat-info {
    gap: 6px;
  }
  
  .stat-value {
    font-size: 22px;
  }
}

@media screen and (max-width: 1200px) {
  .stat-card {
    height: 160px;
  }
  
  .stat-content {
    padding: 12px;
  }
  
  .stat-info {
    margin-left: 15px;
  }
}

.canteen-stats,
.window-ranking {
  padding: 15px 20px;
  height: 340px;
  margin-bottom: 0;
}

.canteen-item,
.window-item {
  padding: 15px;
  margin-bottom: 8px;
}

.canteen-item:last-child,
.window-item:last-child {
  margin-bottom: 0;
}

.canteen-item,
.window-item {
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 12px;
  background: linear-gradient(45deg, #ffffff, #f8f9fa);
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.canteen-item:hover,
.window-item:hover {
  background: linear-gradient(45deg, #ecf5ff, #ffffff);
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.canteen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.canteen-name {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.canteen-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-item .label {
  font-size: 12px;
  color: #909399;
}

.detail-item .value {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.trend-indicator {
  position: absolute;
  right: 20px;
  bottom: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.trend-indicator.up {
  color: #67C23A;
  background: linear-gradient(45deg, rgba(103, 194, 58, 0.1), rgba(103, 194, 58, 0.2));
}

.trend-indicator.down {
  color: #F56C6C;
  background: linear-gradient(45deg, rgba(245, 108, 108, 0.1), rgba(245, 108, 108, 0.2));
}

.window-ranking {
  padding: 0 15px;
  height: 100%;
}

.window-item {
  display: grid;
  grid-template-columns: 40px 1fr 120px;
  gap: 15px;
  align-items: center;
}

.rank-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #909399;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.window-item.top-three:nth-child(1) .rank-number {
  background: linear-gradient(45deg, #f7ba2a, #ff7d00);
}

.window-item.top-three:nth-child(2) .rank-number {
  background: linear-gradient(45deg, #8e9dab, #b8c6db);
}

.window-item.top-three:nth-child(3) .rank-number {
  background: linear-gradient(45deg, #dd9933, #cd7f32);
}

.window-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.window-name {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.window-canteen {
  font-size: 12px;
  color: #909399;
}

.window-revenue {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.window-revenue .amount {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.window-revenue .orders {
  font-size: 12px;
  color: #909399;
}

:deep(.el-scrollbar__bar.is-vertical) {
  width: 6px;
  right: 2px;
}

:deep(.el-scrollbar__thumb) {
  background-color: #909399;
  opacity: 0.2;
  border-radius: 3px;
}

:deep(.el-scrollbar__thumb:hover) {
  opacity: 0.4;
}

.performance-normal {
  font-size: 12px;
  padding: 4px 8px;
  background-color: #f4f4f5;
  color: #909399;
  border-radius: 4px;
  background: linear-gradient(45deg, #f4f4f5, #e9e9eb);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

:deep(.el-radio-group) {
  margin-left: 0;
  display: flex;
  flex-direction: row;
}

:deep(.el-radio-button__inner) {
  padding: 0 12px;
  height: 28px;
  line-height: 28px;
  font-size: 12px;
}

:deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-radius: 4px 0 0 4px;
}

:deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 0 4px 4px 0;
}

:deep(.el-select) {
  flex-shrink: 0;
}

:deep(.el-input__wrapper) {
  height: 28px;
}

:deep(.el-input__inner) {
  font-size: 12px;
  padding: 0 8px;
}

</style> 