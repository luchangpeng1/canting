<template>
  <div class="feedback-list">
    <back-header title="我的建议" />
    
    <!-- 新增日期筛选区域 -->
    <div class="filter-section">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :shortcuts="dateShortcuts"
        @change="handleDateChange"
        value-format="YYYY-MM-DD"
        class="date-picker"
      />
    </div>

    <el-empty v-if="groupedFeedbacks.length === 0" description="暂无反馈记录" />
    
    <!-- 按日期分组显示反馈 -->
    <div v-else class="feedback-items">
      <div v-for="group in groupedFeedbacks" :key="group.date" class="feedback-group">
        <div class="date-divider">
          <span class="date-text">{{ formatDateLabel(group.date) }}</span>
        </div>
        
        <el-card 
          v-for="feedback in group.items" 
          :key="feedback.id" 
          class="feedback-card"
          shadow="hover"
        >
          <div class="feedback-header">
            <div class="feedback-type">
              <el-tag 
                :type="getTypeTag(feedback.type)"
                class="type-tag"
                effect="dark"
              >
                {{ getTypeText(feedback.type) }}
              </el-tag>
            </div>
            <el-tag 
              :type="getStatusType(feedback.status)" 
              size="small"
              class="status-tag"
              effect="plain"
            >
              {{ getStatusText(feedback.status) }}
            </el-tag>
          </div>
          
          <div class="location-info">
            <span class="location-item">
              <i class="el-icon-location"></i>
              {{ feedback.canteen }}
            </span>
            <span class="location-divider">·</span>
            <span class="location-item">
              {{ feedback.stall }}
            </span>
            <span class="time">{{ feedback.time }}</span>
          </div>
          
          <div class="feedback-content">
            <p class="content-text">{{ feedback.content }}</p>
            <div v-if="feedback.images.length" class="feedback-images">
              <el-image 
                v-for="(img, index) in feedback.images" 
                :key="index"
                :src="img"
                :preview-src-list="feedback.images"
                fit="cover"
                class="feedback-image" 
              />
            </div>
          </div>
          
          <div class="feedback-reply" v-if="feedback.reply">
            <div class="reply-header">
              <i class="el-icon-chat-dot-round"></i>
              <span class="reply-title">官方回复</span>
            </div>
            <p class="reply-content">{{ feedback.reply }}</p>
            <p class="reply-time">{{ feedback.replyTime }}</p>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import BackHeader from '../components/BackHeader.vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { useStore } from 'vuex'

dayjs.locale('zh-cn')

export default {
  name: 'FeedbackList',
  components: { BackHeader },
  setup() {
    const store = useStore()
    const feedbacks = ref([])
    const dateRange = ref(null)

    // 模拟数据
    const mockFeedbacks = [
      {
        id: 1,
        type: 'dish',
        content: '建议增加水果种类',
        time: '2024-03-19 14:30',
        status: 'replied',
        images: [],
        reply: '感谢您的建议,我们会考虑增加更多品种的水果',
        replyTime: '2024-03-19 15:00',
        canteen: '第一食堂',
        stall: '水果档口'
      },
      {
        id: 2,
        type: 'service',
        content: '希望能延长营业时间',
        time: '2024-03-18 20:00',
        status: 'pending',
        images: [],
        reply: null,
        replyTime: null,
        canteen: '第二食堂',
        stall: '快餐窗口'
      }
    ]

    // 计算建议总数
    const totalFeedbacks = computed(() => feedbacks.value.length)
    
    // 监听建议数量变化并更新到 Vuex
    watch(totalFeedbacks, (newCount) => {
      store.dispatch('user/updateFeedbacksCount', newCount)
    }, { immediate: true })

    // 在组件挂载时初始化数据
    onMounted(async () => {
      // 这里可以调用 API 获取实际的反馈数据
      feedbacks.value = mockFeedbacks
      // 确保更新 Vuex 中的数量
      store.dispatch('user/updateFeedbacksCount', mockFeedbacks.length)
    })

    // 在组件卸载时保持当前数量，不要重置为 0
    onUnmounted(() => {
      // 移除之前的重置逻辑
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
        text: '最近一个月',
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          return [start, end]
        }
      },
      {
        text: '最近三个月',
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          return [start, end]
        }
      }
    ]

    // 按日期分组的反馈列表
    const groupedFeedbacks = computed(() => {
      const filtered = dateRange.value 
        ? feedbacks.value.filter(feedback => {
            const feedbackDate = dayjs(feedback.time).format('YYYY-MM-DD')
            return feedbackDate >= dateRange.value[0] && 
                   feedbackDate <= dateRange.value[1]
          })
        : feedbacks.value

      // 按日期分组
      const groups = filtered.reduce((acc, feedback) => {
        const date = dayjs(feedback.time).format('YYYY-MM-DD')
        if (!acc[date]) {
          acc[date] = []
        }
        acc[date].push(feedback)
        return acc
      }, {})

      // 转换为数组并排序
      return Object.entries(groups)
        .map(([date, items]) => ({ date, items }))
        .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
    })

    // 日期标签格式化
    const formatDateLabel = (date) => {
      const today = dayjs().format('YYYY-MM-DD')
      const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
      
      if (date === today) {
        return '今天'
      } else if (date === yesterday) {
        return '昨天'
      }
      return dayjs(date).format('M月D日')
    }

    // 日期变化处理
    const handleDateChange = (val) => {
      dateRange.value = val
    }

    const getTypeTag = (type) => {
      const types = {
        dish: 'success',
        service: 'warning',
        environment: 'info',
        other: ''
      }
      return types[type] || ''
    }

    const getTypeText = (type) => {
      const texts = {
        dish: '菜品建议',
        service: '服务建议',
        environment: '环境建议',
        other: '其他建议'
      }
      return texts[type] || type
    }

    const getStatusType = (status) => {
      const types = {
        pending: 'info',
        processing: 'warning',
        replied: 'success',
        closed: ''
      }
      return types[status] || ''
    }

    const getStatusText = (status) => {
      const texts = {
        pending: '待处理',
        processing: '处理中',
        replied: '已回复',
        closed: '已关闭'
      }
      return texts[status] || status
    }

    return {
      feedbacks,
      dateRange,
      dateShortcuts,
      groupedFeedbacks,
      formatDateLabel,
      handleDateChange,
      getTypeTag,
      getTypeText,
      getStatusType,
      getStatusText,
      totalFeedbacks
    }
  }
}
</script>

<style scoped>
.feedback-list {
  padding: 4px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.feedback-items {
  padding: 4px;
}

.feedback-card {
  margin-bottom: 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.feedback-card:hover {
  transform: translateY(-2px);
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.feedback-type {
  display: flex;
  align-items: center;
  gap: 12px;
}

.type-tag {
  font-weight: 500;
}

.status-tag {
  border-radius: 12px;
  padding: 0 12px;
}

.location-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: -8px 0 12px 0;
  color: #606266;
  font-size: 14px;
}

.location-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.location-item i {
  font-size: 14px;
  color: #909399;
}

.location-divider {
  color: #dcdfe6;
}

.time {
  color: #909399;
  font-size: 13px;
  margin-left: auto;
}

.feedback-content {
  margin-top: 12px;
}

.content-text {
  font-size: 15px;
  line-height: 1.6;
  color: #303133;
  margin: 0;
}

.feedback-images {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.feedback-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.feedback-image:hover {
  transform: scale(1.05);
}

.feedback-reply {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
  position: relative;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.reply-title {
  color: #409EFF;
  font-size: 14px;
  font-weight: 500;
}

.reply-content {
  margin: 0 0 12px;
  color: #606266;
  line-height: 1.6;
  font-size: 14px;
}

.reply-time {
  margin: 0;
  color: #909399;
  font-size: 12px;
  text-align: right;
}

/* 响应式布局 */
@media screen and (max-width: 480px) {
  .feedback-list {
    padding: 12px;
  }
  
  .feedback-image {
    width: 80px;
    height: 80px;
  }
  
  .content-text {
    font-size: 14px;
  }
  
  .location-info {
    flex-wrap: wrap;
    gap: 4px 8px;
  }
  
  .time {
    width: 100%;
    margin-top: 4px;
  }
}

.filter-section {
  margin: 8px 0;
  padding: 0 8px;
}

.date-picker {
  width: 100%;
}

.feedback-group {
  margin-bottom: 24px;
}

.date-divider {
  display: flex;
  align-items: center;
  margin: 8px 0;
  padding: 0 8px;
}

.date-text {
  position: relative;
  padding: 0 12px;
  color: #909399;
  font-size: 14px;
  font-weight: 500;
  background: #f5f7fa;
}

.date-text::before,
.date-text::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 24px;
  height: 1px;
  background: #dcdfe6;
}

.date-text::before {
  left: -24px;
}

.date-text::after {
  right: -24px;
}

/* 移动端适配 */
@media screen and (max-width: 480px) {
  .filter-section {
    padding: 0 12px;
  }
  
  .date-divider {
    padding: 0 12px;
  }
  
  .date-text::before,
  .date-text::after {
    width: 16px;
  }
  
  .date-text::before {
    left: -16px;
  }
  
  .date-text::after {
    right: -16px;
  }
}
</style> 