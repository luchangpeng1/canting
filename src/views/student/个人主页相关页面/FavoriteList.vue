<template>
  <div class="favorite-list">
    <back-header title="我的收藏" />
    
    <!-- 搜索和筛选区域 -->
    <div class="filter-section">
      <el-input
        v-model="searchQuery"
        placeholder="搜索菜品名称"
        class="search-input"
        clearable
        :prefix-icon="Search"
      />
      <div class="filter-buttons">
        <el-select
          v-model="selectedCanteen"
          placeholder="选择餐厅"
          clearable
          class="filter-select"
        >
          <el-option
            v-for="canteen in canteenOptions"
            :key="canteen"
            :label="canteen"
            :value="canteen"
          />
        </el-select>
        
        <el-select
          v-model="selectedWindow"
          placeholder="选择窗口"
          clearable
          class="filter-select"
        >
          <el-option
            v-for="window in windowOptions"
            :key="window"
            :label="window"
            :value="window"
          />
        </el-select>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-wrapper">
      <el-skeleton :rows="3" animated />
    </div>
    
    <!-- 空状态 -->
    <el-empty 
      v-else-if="filteredFavorites.length === 0" 
      :description="searchQuery || selectedCanteen || selectedWindow ? '没有找到符合条件的菜品' : '暂无收藏的菜品'"
      :image-size="180" 
    />
    
    <!-- 菜品列表 -->
    <transition-group 
      v-else 
      name="list"
      tag="div"
      class="favorites-container"
    >
      <el-card
        v-for="dish in filteredFavorites"
        :key="dish.id"
        class="dish-card"
        :body-style="{ padding: '0px' }"
        shadow="hover"
      >
        <div class="dish-content">
          <div class="dish-image">
            <el-image 
              :src="dish.image_url" 
              fit="cover"
              loading="lazy"
              :preview-src-list="[dish.image_url]"
            >
              <template #placeholder>
                <div class="image-placeholder">
                  <el-icon class="is-loading"><Loading /></el-icon>
                </div>
              </template>
              <template #error>
                <div class="image-placeholder">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <div class="collect-time">
              <el-icon><Calendar /></el-icon>
              {{ formatDate(dish.collectedAt) }}
            </div>
          </div>
          <div class="dish-info">
            <div class="dish-header">
              <h3>{{ dish.name }}</h3>
              <div class="price">¥{{ dish.price }}</div>
            </div>
            
            <div class="location-info">
              <el-tag size="small" type="success" effect="dark">
                <el-icon><Location /></el-icon>
                {{ dish.canteen }}
              </el-tag>
              <el-tag size="small" type="warning">{{ dish.window }}</el-tag>
            </div>
            
            <div class="dish-stats">
              <div class="stat-item" :style="{ color: getRatingColor(dish.rating) }">
                <el-icon><Star /></el-icon>
                <span>{{ dish.rating }}分</span>
              </div>
              <div class="stat-item">
                <el-icon><Timer /></el-icon>
                <span>等待{{ dish.waitTime }}分钟</span>
              </div>
              <div class="stat-item">
                <el-icon><Sell /></el-icon>
                <span>月售{{ dish.monthlySales || 0 }}</span>
              </div>
            </div>
            
            <div class="tags-container" v-if="dish.tags && dish.tags.length">
              <el-tag 
                v-for="tag in dish.tags" 
                :key="tag"
                size="small"
                effect="light"
                class="dish-tag"
              >
                {{ tag }}
              </el-tag>
            </div>
            
            <div class="actions">
              <el-button 
                type="primary" 
                size="small" 
                plain
                @click="viewDishDetail(dish.id)"
              >
                查看详情
              </el-button>
              <el-popconfirm
                title="确定取消收藏该菜品吗？"
                @confirm="removeFavorite(dish.id)"
                confirm-button-text="确定"
                cancel-button-text="取消"
              >
                <template #reference>
                  <el-button 
                    type="danger" 
                    size="small" 
                    plain
                    :loading="removing === dish.id"
                  >
                    {{ removing === dish.id ? '取消中...' : '取消收藏' }}
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </div>
      </el-card>
    </transition-group>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Picture, Loading, Star, Timer, Search, 
  Location, Calendar, Sell 
} from '@element-plus/icons-vue'
import BackHeader from '../components/BackHeader.vue'
import { formatDate } from '@/utils/date'  // 假设有这个工具函数

export default {
  name: 'FavoriteList',
  components: { 
    Picture, 
    BackHeader, 
    Loading,
    Star,
    Timer,
    Search,
    Location,
    Calendar,
    Sell
  },
  setup() {
    const favorites = ref([])
    const loading = ref(true)
    const removing = ref(null)
    const searchQuery = ref('')
    const selectedCanteen = ref('')
    const selectedWindow = ref('')

    // 更新模拟数据
    const mockFavorites = [
      {
        id: 1,
        name: '红烧肉',
        price: 15,
        image_url: 'https://example.com/hongshaorou.jpg',
        canteen: '第一食堂',
        window: '大众餐窗口',
        rating: 4.5,
        waitTime: 10,
        tags: ['热销', '招牌菜', '肉类'],
        collectedAt: '2024-03-15 12:30'
      },
      {
        id: 2,
        name: '清炒时蔬',
        price: 8,
        image_url: 'https://example.com/qingcao.jpg',
        canteen: '第二食堂',
        window: '素食窗口',
        rating: 4.2,
        waitTime: 5,
        tags: ['素菜', '健康'],
        collectedAt: '2024-03-14 18:20'
      }
    ]

    // 计算餐厅选项
    const canteenOptions = computed(() => {
      return [...new Set(favorites.value.map(dish => dish.canteen))]
    })

    // 计算窗口选项
    const windowOptions = computed(() => {
      return [...new Set(favorites.value.map(dish => dish.window))]
    })

    // 过滤后的收藏列表
    const filteredFavorites = computed(() => {
      return favorites.value.filter(dish => {
        const matchQuery = !searchQuery.value || 
          dish.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchCanteen = !selectedCanteen.value || 
          dish.canteen === selectedCanteen.value
        const matchWindow = !selectedWindow.value || 
          dish.window === selectedWindow.value
        return matchQuery && matchCanteen && matchWindow
      })
    })

    const removeFavorite = async (id) => {
      try {
        removing.value = id
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        favorites.value = favorites.value.filter(item => item.id !== id)
        ElMessage.success('已取消收藏')
      } catch (error) {
        ElMessage.error('操作失败')
      } finally {
        removing.value = null
      }
    }

    const getRatingColor = (rating) => {
      if (rating >= 4.5) return '#ff6b6b'
      if (rating >= 4.0) return '#ff922b'
      if (rating >= 3.5) return '#51cf66'
      return '#868e96'
    }

    const viewDishDetail = (id) => {
      // 实现查看详情功能
      console.log('查看详情:', id)
    }

    onMounted(async () => {
      try {
        // 模拟加载延迟
        await new Promise(resolve => setTimeout(resolve, 800))
        favorites.value = mockFavorites
      } finally {
        loading.value = false
      }
    })

    return {
      favorites,
      loading,
      removing,
      searchQuery,
      selectedCanteen,
      selectedWindow,
      canteenOptions,
      windowOptions,
      filteredFavorites,
      removeFavorite,
      getRatingColor,
      viewDishDetail,
      formatDate,
      Search
    }
  }
}
</script>

<style scoped>
.favorite-list {
  padding: 4px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 搜索和筛选区域样式 */
.filter-section {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #f5f7fa;
  padding: 4px;
  margin: -4px -4px 8px -4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-input {
  margin-bottom: 4px;
}

.filter-buttons {
  display: flex;
  gap: 4px;
}

.filter-select {
  flex: 1;
}

/* 双列布局样式 */
.favorites-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  max-width: 100%;
  margin: 0;
  padding: 0;
}

.dish-card {
  margin-bottom: 0;
  border-radius: 4px;
  overflow: hidden;
}

.dish-content {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  transition: transform 0.3s ease;
}

.dish-content:hover {
  transform: translateY(-2px);
}

.dish-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.collect-time {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.dish-info {
  padding: 16px;
}

.dish-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.dish-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  flex: 1;
  padding-right: 12px;
}

.price {
  color: #f56c6c;
  font-size: 20px;
  font-weight: bold;
  white-space: nowrap;
}

.location-info {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.location-info .el-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  height: 24px;
}

.dish-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  padding: 8px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #666;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.dish-tag {
  border-radius: 12px;
  padding: 0 8px;
  height: 22px;
  line-height: 20px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .favorite-list {
    padding: 0;
  }

  .filter-section {
    padding: 8px 12px;
    margin: 0 0 8px 0;
  }

  .favorites-container {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .dish-image {
    height: 180px;
  }

  .dish-info {
    padding: 10px;
  }

  .dish-header h3 {
    font-size: 15px;
  }

  .price {
    font-size: 16px;
  }

  .location-info .el-tag {
    font-size: 11px;
    height: 22px;
    padding: 0 6px;
  }

  .dish-stats {
    gap: 8px;
    padding: 6px 0;
    font-size: 12px;
  }

  .stat-item {
    font-size: 12px;
  }

  .tags-container {
    gap: 4px;
    margin-bottom: 8px;
  }

  .dish-tag {
    height: 20px;
    line-height: 18px;
    font-size: 11px;
    padding: 0 6px;
  }

  .actions {
    gap: 6px;
  }

  .actions .el-button {
    padding: 6px 12px;
    font-size: 12px;
  }

  .filter-buttons {
    flex-direction: row;
  }

  .filter-select {
    font-size: 12px;
  }

  /* 优化搜索框在移动端的显示 */
  :deep(.el-input__wrapper) {
    padding: 0 8px;
  }

  :deep(.el-input__inner) {
    font-size: 13px;
    height: 32px;
  }

  /* 优化下拉选择器在移动端的显示 */
  :deep(.el-select) {
    width: 100%;
  }

  :deep(.el-select__wrapper) {
    height: 32px;
  }
}

/* 超小屏幕适配 */
@media screen and (max-width: 360px) {
  .filter-buttons {
    flex-direction: column;
  }

  .dish-image {
    height: 160px;
  }

  .actions {
    flex-direction: column;
  }

  .actions .el-button {
    width: 100%;
  }
}

/* 加载状态优化 */
.loading-wrapper {
  padding: 8px;
  gap: 8px;
}

/* 优化图片加载效果 */
.image-placeholder {
  background: linear-gradient(
    45deg,
    #f5f7fa 25%,
    #e4e7ed 25%,
    #e4e7ed 50%,
    #f5f7fa 50%,
    #f5f7fa 75%,
    #e4e7ed 75%,
    #e4e7ed
  );
  background-size: 8px 8px;
}

/* 优化卡片动画效果 */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 添加滚动优化 */
.favorite-list {
  -webkit-overflow-scrolling: touch;
}

/* 优化空状态显示 */
:deep(.el-empty) {
  padding: 24px 0;
}

:deep(.el-empty__description) {
  margin-top: 0;
}
</style> 