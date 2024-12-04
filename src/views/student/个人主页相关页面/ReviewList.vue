<template>
  <div class="review-list">
    <back-header title="历史评价" />
    <el-empty v-if="reviews.length === 0" description="暂无评价记录" />
    <div v-else class="review-items">
      <el-card v-for="review in reviews" :key="review.id" class="review-card">
        <div class="dish-info">
          <el-image :src="review.dish.image_url" class="dish-image" fit="cover" />
          <div class="dish-detail">
            <h3>{{ review.dish.name }}</h3>
            <p class="window">{{ review.window }}</p>
          </div>
          <div class="review-score">
            <el-rate v-model="review.score" disabled />
            <span class="time">{{ review.time }}</span>
          </div>
        </div>
        <div class="review-content">
          <p>{{ review.content }}</p>
          <div v-if="review.images.length" class="review-images">
            <el-image 
              v-for="(img, index) in review.images" 
              :key="index"
              :src="img"
              :preview-src-list="review.images"
              class="review-image" />
          </div>
        </div>
        <div class="review-reply" v-if="review.reply">
          <p class="reply-title">商家回复：</p>
          <p class="reply-content">{{ review.reply }}</p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import BackHeader from '../components/BackHeader.vue'

export default {
  name: 'ReviewList',
  components: { BackHeader },
  setup() {
    const reviews = ref([])

    // 模拟数据
    const mockReviews = [
      {
        id: 1,
        dish: {
          name: '红烧肉',
          image_url: 'https://example.com/hongshaorou.jpg'
        },
        window: '中央食堂-特色炒菜',
        score: 4.5,
        content: '味道不错,分量足,下次还会再来',
        time: '2024-03-19 12:30',
        images: [],
        reply: '感谢您的好评,欢迎再次光临!'
      },
      {
        id: 2,
        dish: {
          name: '清炒时蔬',
          image_url: 'https://example.com/qingcao.jpg'
        },
        window: '沁园餐厅-素菜窗口',
        score: 5,
        content: '蔬菜新鲜,清淡可口',
        time: '2024-03-18 18:45',
        images: [],
        reply: null
      }
    ]

    onMounted(() => {
      reviews.value = mockReviews
    })

    return {
      reviews
    }
  }
}
</script>

<style scoped>
.review-list {
  padding: 4px;
}

.review-card {
  margin-bottom: 8px;
  border-radius: 4px;
}

.dish-info {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.dish-image {
  width: 60px;
  height: 60px;
  border-radius: 3px;
  margin-right: 8px;
}

.dish-detail {
  flex: 1;
}

.dish-detail h3 {
  margin: 0 0 4px;
  font-size: 16px;
}

.window {
  color: #909399;
  font-size: 13px;
  margin: 0;
}

.review-score {
  text-align: right;
}

.time {
  display: block;
  color: #909399;
  font-size: 12px;
  margin-top: 4px;
}

.review-content {
  margin: 8px 0;
}

.review-images {
  display: flex;
  gap: 4px;
  margin-top: 4px;
}

.review-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
}

.review-reply {
  background: #f5f7fa;
  padding: 8px;
  border-radius: 3px;
  margin-top: 8px;
}

.reply-title {
  color: #909399;
  font-size: 13px;
  margin: 0 0 4px;
}

.reply-content {
  margin: 0;
  color: #606266;
}
</style> 