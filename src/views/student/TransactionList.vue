<template>
  <div class="transaction-list">
    <!-- 顶部统计卡片 -->
    <div class="stats-card">
      <div class="stat-item">
        <div class="label">本月消费</div>
        <div class="value">¥{{ monthlySpent }}</div>
      </div>
      <div class="stat-item">
        <div class="label">剩余余额</div>
        <div class="value">¥{{ balance }}</div>
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-select v-model="timeRange" placeholder="时间范围" size="large">
        <el-option label="最近一周" value="week" />
        <el-option label="最近一月" value="month" />
        <el-option label="最近三月" value="quarter" />
      </el-select>
      <el-select v-model="transactionType" placeholder="交易类型" size="large">
        <el-option label="全部" value="" />
        <el-option label="消费" value="expense" />
        <el-option label="充值" value="recharge" />
      </el-select>
    </div>

    <!-- 交易列表 -->
    <div class="transaction-items">
      <div v-for="(group, date) in groupedTransactions" :key="date" class="date-group">
        <div class="date-header">
          <span class="date">{{ formatDate(date) }}</span>
          <span class="daily-total">支出 ¥{{ getDailyTotal(group) }}</span>
        </div>
        
        <el-card v-for="item in group" :key="item.id" class="transaction-item">
          <div class="transaction-content">
            <div class="left">
              <div class="title">{{ item.title }}</div>
              <div class="time">{{ formatTime(item.time) }}</div>
            </div>
            <div class="right">
              <div class="amount" :class="item.type">
                {{ item.type === 'expense' ? '-' : '+' }}¥{{ item.amount }}
              </div>
              <div class="status">{{ getStatusText(item.status) }}</div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 加载更多 -->
    <div v-if="hasMore" class="load-more">
      <el-button :loading="loading" @click="loadMore">加载更多</el-button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'TransactionList',
  setup() {
    const timeRange = ref('month')
    const transactionType = ref('')
    const transactions = ref([])
    const loading = ref(false)
    const hasMore = ref(true)
    const balance = ref(99.50)
    const monthlySpent = ref(245.50)

    // 测试数据
    const mockTransactions = [
      {
        id: 1,
        title: '中央食堂-特色炒菜',
        amount: 15.00,
        type: 'expense',
        status: 'completed',
        time: '2024-01-20 12:30:00'
      },
      {
        id: 2,
        title: '余额充值',
        amount: 100.00,
        type: 'recharge',
        status: 'completed',
        time: '2024-01-20 10:00:00'
      },
      {
        id: 3,
        title: '沁园餐厅-面食',
        amount: 12.00,
        type: 'expense',
        status: 'completed',
        time: '2024-01-19 18:30:00'
      }
    ]

    // 按日期分组的交易记录
    const groupedTransactions = computed(() => {
      const groups = {}
      transactions.value.forEach(transaction => {
        const date = transaction.time.split(' ')[0]
        if (!groups[date]) {
          groups[date] = []
        }
        groups[date].push(transaction)
      })
      return groups
    })

    // 直接在组件内实现日期格式化
    const formatDate = (dateStr) => {
      const date = new Date(dateStr)
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${month}月${day}日`
    }

    // 时间格式化函数
    const formatTime = (datetime) => {
      return datetime.split(' ')[1].substring(0, 5)
    }

    // 获取状态文本
    const getStatusText = (status) => {
      const statusMap = {
        completed: '交易成功',
        pending: '处理中',
        failed: '交易失败'
      }
      return statusMap[status] || status
    }

    // 计算每日总支出
    const getDailyTotal = (transactions) => {
      return transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
        .toFixed(2)
    }

    // 加载更多数据
    const loadMore = async () => {
      loading.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        transactions.value.push(...mockTransactions)
        hasMore.value = transactions.value.length < 20
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      transactions.value = mockTransactions
    })

    return {
      timeRange,
      transactionType,
      groupedTransactions,
      loading,
      hasMore,
      balance,
      monthlySpent,
      formatDate,
      formatTime,
      getStatusText,
      getDailyTotal,
      loadMore
    }
  }
}
</script>

<style scoped>
.transaction-list {
  padding: 16px;
}

.stats-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.stat-item {
  text-align: center;
}

.stat-item .label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.stat-item .value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.filter-bar {
  margin-bottom: 16px;
  display: flex;
  gap: 12px;
}

.filter-bar :deep(.el-select) {
  flex: 1;
}

.date-group {
  margin-bottom: 16px;
}

.date-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  color: #909399;
  font-size: 14px;
}

.transaction-item {
  margin-bottom: 8px;
}

.transaction-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left .title {
  font-size: 16px;
  color: #303133;
  margin-bottom: 4px;
}

.left .time {
  font-size: 12px;
  color: #909399;
}

.right {
  text-align: right;
}

.right .amount {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.right .amount.expense {
  color: #f56c6c;
}

.right .amount.recharge {
  color: #67c23a;
}

.right .status {
  font-size: 12px;
  color: #909399;
}

.load-more {
  text-align: center;
  margin-top: 20px;
}

:deep(.el-card) {
  border-radius: 8px;
  margin-bottom: 8px;
}

:deep(.el-card__body) {
  padding: 12px 16px;
}
</style> 