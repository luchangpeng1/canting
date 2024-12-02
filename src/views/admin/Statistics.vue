<template>
  <div class="statistics-container">
    <!-- 时间范围选择 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="统计时间">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="dateShortcuts"
          />
        </el-form-item>
        <el-form-item label="统计类型">
          <el-select v-model="filterForm.type">
            <el-option label="营业额" value="revenue" />
            <el-option label="订单量" value="orders" />
            <el-option label="客流量" value="customers" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleExport">导出报表</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 统计概览 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :span="8" v-for="stat in statsData" :key="stat.title">
        <el-card shadow="hover">
          <div class="stat-item">
            <div class="stat-icon" :style="{ background: stat.color }">
              <el-icon><component :is="stat.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-title">{{ stat.title }}</div>
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-trend" :class="{ 'up': stat.trend > 0, 'down': stat.trend < 0 }">
                <el-icon><component :is="stat.trend > 0 ? 'ArrowUp' : 'ArrowDown'" /></el-icon>
                {{ Math.abs(stat.trend) }}%
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表展示 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>营业趋势分析</span>
              <el-radio-group v-model="chartType" size="small">
                <el-radio-button label="day">日视图</el-radio-button>
                <el-radio-button label="week">周视图</el-radio-button>
                <el-radio-button label="month">月视图</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="trendChart" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>收入构成</span>
            </div>
          </template>
          <div ref="pieChart" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据明细 -->
    <el-card class="detail-card">
      <template #header>
        <div class="detail-header">
          <span>营业明细</span>
          <el-button type="primary" link>
            查看更多<el-icon class="el-icon--right"><ArrowRight /></el-icon>
          </el-button>
        </div>
      </template>
      <el-table :data="detailData" stripe style="width: 100%">
        <el-table-column prop="date" label="日期" width="180" />
        <el-table-column prop="revenue" label="营业额" width="150">
          <template #default="{ row }">
            ¥{{ row.revenue }}
          </template>
        </el-table-column>
        <el-table-column prop="orders" label="订单数" width="120" />
        <el-table-column prop="customers" label="客流量" width="120" />
        <el-table-column prop="avgOrder" label="客单价" width="120">
          <template #default="{ row }">
            ¥{{ row.avgOrder }}
          </template>
        </el-table-column>
        <el-table-column prop="trend" label="同比">
          <template #default="{ row }">
            <span :class="row.trend >= 0 ? 'trend-up' : 'trend-down'">
              {{ row.trend >= 0 ? '+' : '' }}{{ row.trend }}%
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { Money, ShoppingCart, User, ArrowUp, ArrowDown, ArrowRight } from '@element-plus/icons-vue'

// 筛选表单
const filterForm = ref({
  dateRange: [],
  type: 'revenue'
})

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
    text: '最近一月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: '最近三月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]

// 统计数据
const statsData = ref([
  {
    title: '总营业额',
    value: '¥128,960',
    trend: 12.5,
    icon: 'Money',
    color: '#409EFF'
  },
  {
    title: '总订单数',
    value: '1,286',
    trend: 8.2,
    icon: 'ShoppingCart',
    color: '#67C23A'
  },
  {
    title: '总客流量',
    value: '3,862',
    trend: -3.5,
    icon: 'User',
    color: '#E6A23C'
  }
])

// 图表类型
const chartType = ref('week')

// 图表实例
const trendChart = ref(null)
const pieChart = ref(null)
let trendChartInstance = null
let pieChartInstance = null

// 明细数据
const detailData = ref([
  {
    date: '2024-03-20',
    revenue: 15680,
    orders: 186,
    customers: 560,
    avgOrder: 84.3,
    trend: 12.5
  },
  {
    date: '2024-03-19',
    revenue: 14520,
    orders: 165,
    customers: 495,
    avgOrder: 88.0,
    trend: -5.2
  },
  {
    date: '2024-03-18',
    revenue: 16890,
    orders: 198,
    customers: 594,
    avgOrder: 85.3,
    trend: 8.7
  }
])

// 初始化趋势图表
const initTrendChart = () => {
  if (!trendChart.value) return
  
  trendChartInstance = echarts.init(trendChart.value)
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
        data: [15200, 14800, 16300, 15800, 17200, 18500, 17800]
      },
      {
        name: '订单量',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        data: [180, 165, 190, 185, 200, 220, 210]
      }
    ]
  }
  
  trendChartInstance.setOption(option)
}

// 初始化饼图
const initPieChart = () => {
  if (!pieChart.value) return
  
  pieChartInstance = echarts.init(pieChart.value)
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        radius: '70%',
        data: [
          { value: 45600, name: '堂食' },
          { value: 38200, name: '外卖' },
          { value: 25800, name: '预订' },
          { value: 19360, name: '其他' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  
  pieChartInstance.setOption(option)
}

// 处理搜索
const handleSearch = () => {
  console.log('搜索条件：', filterForm.value)
}

// 处理导出
const handleExport = () => {
  console.log('导出报表')
}

// 监听窗口大小变化
const handleResize = () => {
  trendChartInstance?.resize()
  pieChartInstance?.resize()
}

onMounted(() => {
  initTrendChart()
  initPieChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  trendChartInstance?.dispose()
  pieChartInstance?.dispose()
})
</script>

<style scoped>
.statistics-container {
  padding: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.stat-cards {
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.stat-icon .el-icon {
  font-size: 24px;
  color: #fff;
}

.stat-info {
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

.detail-card {
  margin-bottom: 20px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.trend-up {
  color: #67C23A;
}

.trend-down {
  color: #F56C6C;
}
</style> 