<template>
  <div class="feedback-list">
    <back-header title="我的建议" />
    <el-empty v-if="feedbacks.length === 0" description="暂无反馈记录" />
    <div v-else class="feedback-items">
      <el-card v-for="feedback in feedbacks" :key="feedback.id" class="feedback-card">
        <div class="feedback-header">
          <div class="feedback-type">
            <el-tag :type="getTypeTag(feedback.type)">
              {{ getTypeText(feedback.type) }}
            </el-tag>
            <span class="time">{{ feedback.time }}</span>
          </div>
          <el-tag :type="getStatusType(feedback.status)" size="small">
            {{ getStatusText(feedback.status) }}
          </el-tag>
        </div>
        
        <div class="feedback-content">
          <p>{{ feedback.content }}</p>
          <div v-if="feedback.images.length" class="feedback-images">
            <el-image 
              v-for="(img, index) in feedback.images" 
              :key="index"
              :src="img"
              :preview-src-list="feedback.images"
              class="feedback-image" />
          </div>
        </div>
        
        <div class="feedback-reply" v-if="feedback.reply">
          <p class="reply-title">回复：</p>
          <p class="reply-content">{{ feedback.reply }}</p>
          <p class="reply-time">{{ feedback.replyTime }}</p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import BackHeader from '../components/BackHeader.vue'

export default {
  name: 'FeedbackList',
  components: { BackHeader },
  setup() {
    const feedbacks = ref([])

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
        replyTime: '2024-03-19 15:00'
      },
      {
        id: 2,
        type: 'service',
        content: '希望能延长营业时间',
        time: '2024-03-18 20:00',
        status: 'pending',
        images: [],
        reply: null,
        replyTime: null
      }
    ]

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

    onMounted(() => {
      feedbacks.value = mockFeedbacks
    })

    return {
      feedbacks,
      getTypeTag,
      getTypeText,
      getStatusType,
      getStatusText
    }
  }
}
</script>

<style scoped>
.feedback-list {
  padding: 16px;
}

.feedback-card {
  margin-bottom: 16px;
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.feedback-type {
  display: flex;
  align-items: center;
  gap: 12px;
}

.time {
  color: #909399;
  font-size: 13px;
}

.feedback-content {
  margin: 12px 0;
}

.feedback-images {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.feedback-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
}

.feedback-reply {
  background: #f5f7fa;
  padding: 12px;
  border-radius: 4px;
  margin-top: 12px;
}

.reply-title {
  color: #909399;
  font-size: 13px;
  margin: 0 0 4px;
}

.reply-content {
  margin: 0 0 8px;
  color: #606266;
}

.reply-time {
  margin: 0;
  color: #909399;
  font-size: 12px;
  text-align: right;
}
</style> 