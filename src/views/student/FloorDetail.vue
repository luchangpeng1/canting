<template>
  <div class="floor-detail">
    <!-- 左侧窗口列表 -->
    <div class="window-list">
      <div
        v-for="window in windows"
        :key="window.id"
        class="window-item"
        :class="{ active: activeWindow?.id === window.id }"
        @click="selectWindow(window)"
      >
        <div class="window-info">
          <div class="window-name">{{ window.name }}</div>
          <div class="window-status" :class="{ closed: !window.status }">
            {{ window.status ? '营业中' : '已打烊' }}
          </div>
          <div class="window-hours">{{ window.operatingHours }}</div>
        </div>
      </div>
    </div>

    <!-- 右侧菜品列表 -->
    <div class="dishes-list">
      <template v-if="activeWindow">
        <div v-if="activeWindow.status">
          <!-- 这里添加菜品列表，暂时用测试数据 -->
          <div v-for="dish in testDishes" :key="dish.id" class="dish-item">
            <el-image :src="dish.image" class="dish-image" fit="cover">
              <template #error>
                <div class="image-placeholder">暂无图片</div>
              </template>
            </el-image>
            <div class="dish-info">
              <div class="dish-name">{{ dish.name }}</div>
              <div class="dish-price">¥{{ dish.price }}</div>
              <el-button type="primary" size="small" class="add-button">
                加入购物车
              </el-button>
            </div>
          </div>
        </div>
        <div v-else class="window-closed">
          该窗口已打烊，请选择其他窗口
        </div>
      </template>
      <div v-else class="no-window-selected">
        请选择左侧窗口查看菜品
      </div>
    </div>
  </div>
</template>

<script>
import { ref, inject } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'FloorDetail',
  setup() {
    const route = useRoute()
    const getFloorWindows = inject('getFloorWindows')
    
    const canteenName = route.params.canteen
    const floor = route.params.floor
    
    const windows = ref(getFloorWindows(canteenName, floor))
    const activeWindow = ref(null)

    // 测试菜品数据
    const testDishes = ref([
      {
        id: 1,
        name: '宫保鸡丁',
        price: 15,
        image: 'https://example.com/dish1.jpg'
      },
      {
        id: 2,
        name: '回锅肉',
        price: 16,
        image: 'https://example.com/dish2.jpg'
      },
      {
        id: 3,
        name: '青椒肉丝',
        price: 14,
        image: 'https://example.com/dish3.jpg'
      }
    ])

    const selectWindow = (window) => {
      activeWindow.value = window
    }

    return {
      windows,
      activeWindow,
      selectWindow,
      testDishes
    }
  }
}
</script>

<style scoped>
.floor-detail {
  display: flex;
  height: 100%;
  background: #f5f5f5;
}

.window-list {
  width: 85px;
  background: #fff;
  overflow-y: auto;
  border-right: 1px solid #eee;
}

.window-item {
  padding: 15px 10px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: all 0.3s;
}

.window-item.active {
  background: #f5f5f5;
  color: var(--el-color-primary);
}

.window-name {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
}

.window-status {
  font-size: 11px;
  color: #67c23a;
}

.window-status.closed {
  color: #909399;
}

.window-hours {
  font-size: 10px;
  color: #909399;
  margin-top: 4px;
}

.dishes-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.dish-item {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 12px;
  display: flex;
}

.dish-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  margin-right: 12px;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 12px;
}

.dish-info {
  flex: 1;
  position: relative;
}

.dish-name {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 8px;
}

.dish-price {
  color: #f56c6c;
  font-size: 16px;
  font-weight: 500;
}

.add-button {
  position: absolute;
  right: 0;
  bottom: 0;
}

.window-closed,
.no-window-selected {
  text-align: center;
  color: #909399;
  padding: 40px 0;
}
</style>