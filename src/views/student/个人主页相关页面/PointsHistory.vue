<template>
  <div class="points-history">
    <!-- 顶部导航栏 -->
    <div class="page-header">
      <el-button class="back-btn" link @click="$router.back()">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <h2 class="page-title">积分记录</h2>
    </div>

    <!-- 积分概览卡片 -->
    <el-card class="points-overview">
      <div class="overview-content">
        <div class="points-total">
          <div class="label">当前积分</div>
          <div class="value">{{ userInfo.points }}</div>
          <div class="points-tips">
            <el-icon><Trophy /></el-icon>
            <span>距离下一等级还需 {{ getNextLevelPoints }} 分</span>
          </div>
        </div>
        <div class="member-level">
          <div class="label">会员等级</div>
          <div class="value">{{ getMemberLevel }}</div>
          <div class="level-discount">订单享{{ getMemberDiscount }}折</div>
        </div>
      </div>
      <div class="level-progress">
        <el-progress 
          :percentage="getLevelProgress" 
          :format="formatProgress"
          :stroke-width="8"
          :show-text="false"
        />
        <div class="progress-labels">
          <span>{{ getCurrentLevelRange }}</span>
          <span>{{ getNextLevelRange }}</span>
        </div>
      </div>
    </el-card>

    <!-- 积分记录列表 -->
    <el-card class="history-list">
      <template #header>
        <div class="card-header">
          <div class="filter-label">筛选</div>
          <el-radio-group v-model="filter" size="small">
            <el-radio-button :value="'all'">全部</el-radio-button>
            <el-radio-button :value="'earn'">获取</el-radio-button>
            <el-radio-button :value="'exchange'">兑换</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      
      <div class="timeline-wrapper">
        <el-timeline>
          <el-timeline-item
            v-for="record in filteredHistory"
            :key="record.id"
            :type="record.type === 'earn' ? 'success' : 'warning'"
            :timestamp="formatTime(record.createTime)"
            :hollow="true"
          >
            <div class="history-item">
              <div class="history-content">
                <div class="description">{{ record.description }}</div>
                <div class="points" :class="record.type">
                  {{ record.type === 'earn' ? '+' : '-' }}{{ Math.abs(record.points) }}
                </div>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>

        <div v-if="filteredHistory.length === 0" class="empty-state">
          暂无积分记录
        </div>
        
        <div v-if="loading" class="loading-state">
          <el-skeleton :rows="3" animated />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import dayjs from 'dayjs'
import { ArrowLeft, Trophy } from '@element-plus/icons-vue'

export default {
  name: 'PointsHistory',
  components: {
    ArrowLeft,
    Trophy
  },
  
  setup() {
    const store = useStore()
    const userInfo = computed(() => store.getters['user/userInfo'])
    const pointsHistory = ref([])
    const filter = ref('all')
    const loading = ref(false)
    
    // 获取会员等级
    const getMemberLevel = computed(() => {
      const points = userInfo.value.points
      if (points >= 1000) return '钻石会员'
      if (points >= 501) return '黄金会员'
      if (points >= 101) return '白银会员'
      return '普通会员'
    })
    
    // 获取会员折扣
    const getMemberDiscount = computed(() => {
      const points = userInfo.value.points
      if (points >= 1000) return '85'
      if (points >= 501) return '90'
      if (points >= 101) return '95'
      return '100'
    })
    
    // 获取等级进度
    const getLevelProgress = computed(() => {
      const points = userInfo.value.points
      if (points >= 1000) return 100
      if (points >= 501) return Math.floor((points - 501) / 5)
      if (points >= 101) return Math.floor((points - 101) / 4)
      return Math.floor(points)
    })
    
    // 获取下一等级所需积分
    const getNextLevelPoints = computed(() => {
      const points = userInfo.value.points
      if (points >= 1000) return 0
      if (points >= 501) return 1000 - points
      if (points >= 101) return 501 - points
      return 101 - points
    })
    
    // 获取当前等级范围
    const getCurrentLevelRange = computed(() => {
      const points = userInfo.value.points
      if (points >= 1000) return '1000+'
      if (points >= 501) return '501-1000'
      if (points >= 101) return '101-500'
      return '0-100'
    })
    
    // 获取下一等级范围
    const getNextLevelRange = computed(() => {
      const points = userInfo.value.points
      if (points >= 1000) return ''
      if (points >= 501) return '1000+'
      if (points >= 101) return '501-1000'
      return '101-500'
    })
    
    const formatProgress = (percentage) => {
      return `${percentage}%`
    }
    
    // 过滤积分记录
    const filteredHistory = computed(() => {
      if (filter.value === 'all') return pointsHistory.value
      return pointsHistory.value.filter(record => record.type === filter.value)
    })
    
    // 格式化时间
    const formatTime = (time) => {
      return dayjs(time).format('YYYY-MM-DD HH:mm')
    }
    
    // 获取积分历史记录
    const loadPointsHistory = async () => {
      try {
        loading.value = true
        const history = await store.dispatch('user/getPointsHistory')
        pointsHistory.value = history
      } catch (error) {
        console.error('获取积分历史失败:', error)
      } finally {
        loading.value = false
      }
    }
    
    onMounted(() => {
      loadPointsHistory()
    })
    
    return {
      userInfo,
      filter,
      filteredHistory,
      getMemberLevel,
      getMemberDiscount,
      getLevelProgress,
      getNextLevelPoints,
      getCurrentLevelRange,
      getNextLevelRange,
      formatProgress,
      formatTime,
      loading
    }
  }
}
</script>

<style scoped>
.points-history {
  padding: 4px;
  max-width: 600px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  position: relative;
}

.back-btn {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #606266;
  position: absolute;
  left: 0;
}

.back-btn .el-icon {
  margin-right: 4px;
}

.page-title {
  flex: 1;
  text-align: center;
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.points-overview {
  margin-bottom: 8px;
  padding: 12px 8px;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.overview-content {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.points-total,
.member-level {
  text-align: center;
  flex: 1;
}

.label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.value {
  font-size: 28px;
  font-weight: 600;
  color: var(--el-color-primary);
  margin-bottom: 8px;
}

.points-tips {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #909399;
  gap: 4px;
}

.level-discount {
  font-size: 13px;
  color: #67c23a;
}

.level-progress {
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
}

.filter-label {
  font-size: 14px;
  color: #606266;
}

.timeline-wrapper {
  padding: 4px;
}

.history-item {
  padding: 8px 0;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
}

.history-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.description {
  font-size: 14px;
  color: #303133;
}

.points {
  font-weight: 600;
  font-size: 16px;
}

.points.earn {
  color: #67c23a;
}

.points.exchange {
  color: #e6a23c;
}

.empty-state {
  text-align: center;
  color: #909399;
  padding: 32px 0;
}

.loading-state {
  padding: 16px;
}

:deep(.el-timeline-item__node) {
  background-color: transparent;
}

:deep(.el-timeline-item__tail) {
  border-left-style: dashed;
}

:deep(.el-radio-group) {
  border-radius: 20px;
  overflow: hidden;
}

:deep(.el-radio-button__inner) {
  padding: 8px 16px;
}
</style> 