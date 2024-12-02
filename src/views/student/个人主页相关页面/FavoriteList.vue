<template>
  <div class="favorite-list">
    <back-header title="我的收藏" />
    <el-empty v-if="favorites.length === 0" description="暂无收藏的菜品" />
    <el-row v-else :gutter="20">
      <el-col v-for="dish in favorites" :key="dish.id" :span="12">
        <el-card class="dish-card" :body-style="{ padding: '0px' }">
          <div class="dish-image">
            <el-image :src="dish.image_url" fit="cover">
              <template #error>
                <div class="image-placeholder">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </div>
          <div class="dish-info">
            <h3>{{ dish.name }}</h3>
            <p class="price">¥{{ dish.price }}</p>
            <div class="actions">
              <el-button type="danger" size="small" @click="removeFavorite(dish.id)">
                取消收藏
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'
import BackHeader from '../components/BackHeader.vue'

export default {
  name: 'FavoriteList',
  components: { Picture, BackHeader },
  setup() {
    const favorites = ref([])

    // 模拟数据
    const mockFavorites = [
      {
        id: 1,
        name: '红烧肉',
        price: 15,
        image_url: 'https://example.com/hongshaorou.jpg'
      },
      {
        id: 2,
        name: '清炒时蔬',
        price: 8,
        image_url: 'https://example.com/qingcao.jpg'
      }
    ]

    const removeFavorite = async (id) => {
      try {
        // 这里应该调用API删除收藏
        favorites.value = favorites.value.filter(item => item.id !== id)
        ElMessage.success('已取消收藏')
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }

    onMounted(() => {
      // 模拟加载数据
      favorites.value = mockFavorites
    })

    return {
      favorites,
      removeFavorite
    }
  }
}
</script>

<style scoped>
.favorite-list {
  padding: 16px;
}

.dish-card {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.dish-image {
  height: 150px;
}

.dish-image .el-image {
  width: 100%;
  height: 100%;
}

.image-placeholder {
  height: 100%;
  background: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #909399;
}

.dish-info {
  padding: 12px;
}

.dish-info h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.price {
  color: #f56c6c;
  font-size: 16px;
  margin: 8px 0;
}

.actions {
  display: flex;
  justify-content: flex-end;
}
</style> 