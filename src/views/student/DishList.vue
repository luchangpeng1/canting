<template>
  <div class="dish-list">
    <!-- 添加3D地图组件 -->
    <CampusMap3D 
      :canteens="mapCanteens"
      @select-canteen="handleMapCanteenSelect"
      class="map-section"
    />
    
    <!-- 原有的顶部餐厅导航 -->
    <div class="canteen-nav">
      <el-tabs v-model="activeCanteen" type="card" @tab-click="handleCanteenChange">
        <el-tab-pane 
          v-for="canteen in canteens" 
          :key="canteen.id" 
          :label="canteen.name" 
          :name="canteen.name">
          <!-- 餐厅信息卡片 -->
          <el-card class="canteen-info">
            <div class="canteen-header">
              <div class="canteen-basic">
                <h3>{{ canteen.name }}</h3>
                <div class="status-tags">
                  <el-tag 
                    :type="isCanteenOpen(canteen) ? 'success' : 'info'"
                    size="small">
                    {{ isCanteenOpen(canteen) ? '营业中' : '已打烊' }}
                  </el-tag>
                  <el-tag 
                    :type="getCrowdLevelType(canteen.name)"
                    size="small"
                    effect="dark">
                    {{ getCrowdLevelText(canteen.name) }}
                  </el-tag>
                </div>
              </div>
              <el-button 
                type="primary" 
                @click="viewFloorPlan"
                v-if="selectedCanteen">
                <el-icon><Location /></el-icon>
                查看平面图
              </el-button>
            </div>
            <div class="canteen-details">
              <p><el-icon><Timer /></el-icon> 营业时间：10:30-13:30, 16:30-19:00</p>
              <p><el-icon><Position /></el-icon> 位置：{{ canteen.location }}</p>
            </div>
          </el-card>

          <!-- 窗口分类展示 -->
          <div class="window-navigation">
            <!-- 楼层导航 -->
            <div class="nav-section floor-nav">
              <div class="nav-list">
                <div
                  v-for="floor in canteen.floors"
                  :key="floor"
                  class="nav-item"
                  :class="{ active: selectedFloor === floor }"
                  @click="selectFloor(floor)">
                  {{ floor }}层
                </div>
              </div>
            </div>
            
            <!-- 窗口导航 -->
            <div class="nav-section window-nav" v-if="selectedFloor">
              <div class="nav-label">窗口：</div>
              <div class="nav-list">
                <div class="windows-grid">
                  <div
                    v-for="window in displayWindows"
                    :key="window.id"
                    class="window-grid-item"
                    :class="{ active: selectedWindow?.id === window.id }"
                    @click="selectWindow(window)"
                  >
                    <div class="window-grid-content">
                      <div class="window-header">
                        <span class="window-name">{{ window.name }}</span>
                        <el-tag 
                          size="small"
                          :type="isWindowOpen(window) ? 'success' : 'info'">
                          {{ isWindowOpen(window) ? '营业中' : '已打烊' }}
                        </el-tag>
                      </div>
                      <div class="window-content">
                        <div class="window-info">
                          <el-icon><Timer /></el-icon>
                          {{ window.operatingHours }}
                        </div>
                        <div class="window-info">
                          今日供应 {{ getWindowDishCount(window.id) }} 个菜品
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 分页器 -->
                <div class="pagination-wrapper" v-if="totalPages > 1">
                  <el-pagination
                    v-model:current-page="currentPage"
                    :page-size="pageSize"
                    :total="totalWindows"
                    layout="prev, pager, next"
                    @current-change="handlePageChange"
                  />
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 菜品列表 -->
    <div class="dishes-container" v-if="selectedWindow">
      <!-- 顶部导航区域 -->
      <div class="top-nav">
        <!-- 楼层导航 -->
        <div class="nav-row floor-nav">
          <span class="nav-label">楼层：</span>
          <div class="nav-items">
            <div 
              v-for="floor in canteens.find(c => c.name === activeCanteen)?.floors"
              :key="floor"
              class="nav-item"
              :class="{ active: selectedFloor === floor }"
              @click="selectFloor(floor)">
              {{ floor }}层
            </div>
          </div>
        </div>
        
        <!-- 窗口导航 -->
        <div class="nav-row window-nav" v-if="selectedFloor">
          <span class="nav-label">窗口：</span>
          <div class="nav-items">
            <div 
              v-for="window in getFloorWindows(activeCanteen, selectedFloor)"
              :key="window.id"
              class="nav-item"
              :class="{ active: selectedWindow?.id === window.id }"
              @click="selectWindow(window)">
              {{ window.name }}
            </div>
          </div>
        </div>

        <!-- 搜索和筛选区域 -->
        <div class="filter-actions">
          <el-input
            v-model="searchQuery"
            placeholder="搜索菜品"
            clearable
            class="search-input">
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select v-model="categoryFilter" placeholder="菜品类别" clearable>
            <el-option
              v-for="category in categories"
              :key="category"
              :label="category"
              :value="category">
            </el-option>
          </el-select>
          <el-select v-model="priceSort" placeholder="价格排序">
            <el-option label="默认排序" value=""></el-option>
            <el-option label="价格从低到高" value="asc"></el-option>
            <el-option label="价格从高到低" value="desc"></el-option>
          </el-select>
        </div>
      </div>

      <div class="dishes-content">
        <!-- 右侧菜品列表 -->
        <div class="dishes-list full-width">
          <div 
            v-for="dish in filteredDishes"
            :key="dish.id"
            class="dish-item"
            @click="showDishDetail(dish)">
            <div class="dish-image-wrapper">
              <el-image 
                :src="dish.image_url"
                class="dish-img"
                fit="cover">
                <template #error>
                  <div class="image-placeholder">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </div>
            <div class="dish-info">
              <div class="dish-main-info">
                <h4 class="dish-name">{{ dish.name }}</h4>
                <el-tag size="small" :type="getCategoryType(dish.category)">
                  {{ dish.category }}
                </el-tag>
              </div>
              <p class="dish-description">{{ dish.description }}</p>
              <div class="dish-bottom">
                <div class="dish-price">
                  <span class="price-symbol">¥</span>
                  <span class="price-value">{{ dish.price }}</span>
                  <span class="stock-info" v-if="dish.stock <= 10 && dish.stock > 0">
                    仅剩{{ dish.stock }}份
                  </span>
                  <span class="stock-info sold-out" v-if="dish.stock === 0">
                    已售罄
                  </span>
                </div>
                <el-button 
                  type="primary" 
                  size="small"
                  :disabled="dish.stock === 0"
                  @click.stop="orderDish(dish)">
                  {{ dish.stock > 0 ? '预订' : '已售罄' }}
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 平面图对话框 -->
    <el-dialog
      :title="`${currentCanteen?.name || ''} 平面图`"
      v-model="floorPlanVisible"
      width="80%"
      class="floor-plan-dialog">
      <!-- 平面图内容与管理端相同 -->
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Location, 
  Timer, 
  Position, 
  Picture,
  Search 
} from '@element-plus/icons-vue'
import CampusMap3D from './components/CampusMap3D.vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

export default {
  name: 'DishList',
  components: {
    Location,
    Timer,
    Position,
    Picture,
    Search,
    CampusMap3D
  },
  setup() {
    const router = useRouter()
    const activeCanteen = ref('中央食堂')
    const selectedFloor = ref(null)
    const selectedWindow = ref(null)
    const searchQuery = ref('')
    const categoryFilter = ref('')
    const priceSort = ref('')
    const floorPlanVisible = ref(false)
    const currentCanteen = ref(null)
    const dishes = ref([])

    // 注入函数
    const isCanteenOpen = inject('isCanteenOpen')
    const getFloorWindows = inject('getFloorWindows')
    const isWindowOpen = inject('isWindowOpen')
    const getCrowdLevelType = inject('getCrowdLevelType')
    const getCrowdLevelText = inject('getCrowdLevelText')
    const getWindowDishCount = inject('getWindowDishCount')

    // 创建包装函数以确保正确的上文
    const windowStatus = (window) => isWindowOpen(window)
    const canteenStatus = (canteen) => isCanteenOpen(canteen)
    const crowdLevel = (canteen) => getCrowdLevelType(canteen)
    const crowdText = (canteen) => getCrowdLevelText(canteen)
    const dishCount = (windowId) => getWindowDishCount(windowId)
    const windows = (canteenName, floor) => getFloorWindows(canteenName, floor)

    // 使用之前定义的测试数据
    const canteens = [
      { id: 1, name: '中央食堂', floors: 3, location: '校园中心区' },
      { id: 2, name: '沁园餐厅', floors: 2, location: '学生宿舍区' },
      { id: 3, name: '馨园餐厅', floors: 1, location: '教学区' },
      { id: 4, name: '仲园餐厅', floors: 2, location: '图书馆附近' },
      { id: 5, name: '雅园餐厅', floors: 1, location: '体育馆附近' },
      { id: 6, name: 'F区服务点', floors: 1, location: 'F区教学楼' },
      { id: 7, name: 'A区服务点', floors: 1, location: 'A区教学楼' }
    ]

    // 测试数据 - 窗口列表
    const testWindows = {
      '中央食堂': {
        1: [
          { id: 1, name: '川湘菜', operatingHours: '10:30-13:30, 16:30-19:00', status: 'open' },
          { id: 2, name: '粤式炖汤', operatingHours: '10:30-13:30', status: 'closed' },
          { id: 3, name: '新疆风味', operatingHours: '10:30-19:00', status: 'open' }
        ],
        2: [
          { id: 4, name: '面食档口', operatingHours: '10:30-19:00', status: 'open' },
          { id: 5, name: '米饭窗口', operatingHours: '10:30-13:30, 16:30-19:00', status: 'open' }
        ],
        3: [
          { id: 6, name: '特色小炒', operatingHours: '10:30-19:00', status: 'open' },
          { id: 7, name: '清真窗口', operatingHours: '10:30-19:00', status: 'closed' }
        ]
      },
      'F区服务点': {
        1: [
          { id: 20, name: 'F区快餐', operatingHours: '10:30-13:30, 16:30-19:00', status: 'open' },
          { id: 21, name: 'F区饮品', operatingHours: '08:30-20:00', status: 'open' }
        ]
      },
      'A区服务点': {
        1: [
          { id: 22, name: 'A区快餐', operatingHours: '10:30-13:30, 16:30-19:00', status: 'open' },
          { id: 23, name: 'A区饮品', operatingHours: '08:30-20:00', status: 'open' }
        ]
      }
    }

    // 测试数据 - 菜品列表
    const testDishes = [
      {
        id: 1,
        name: '麻婆豆腐',
        price: 12,
        description: '使用四川特制豆瓣酱，口感麻辣鲜香',
        category: '川菜',
        image_url: 'https://example.com/mapo-tofu.jpg',
        stock: 20
      },
      {
        id: 2,
        name: '红烧排骨',
        price: 16,
        description: '精选五花肉，红烧入味',
        category: '本帮菜',
        image_url: 'https://example.com/paigu.jpg',
        stock: 15
      },
      {
        id: 3,
        name: '清炒时蔬',
        price: 8,
        description: '当季新鲜蔬菜',
        category: '素菜',
        image_url: 'https://example.com/vegetables.jpg',
        stock: 30
      },
      {
        id: 4,
        name: '番茄牛肉面',
        price: 15,
        description: '手工面条，配以新鲜番茄和优质牛肉',
        category: '面食',
        image_url: 'https://example.com/beef-noodles.jpg',
        stock: 0
      }
    ]

    // 测试数据 - 菜品分类
    const categories = ['川菜', '本帮菜', '粤菜', '面食', '素菜', '饮品']

    // 添加菜品分类样式映射函数
    const getCategoryType = (category) => {
      const typeMap = {
        '川菜': 'danger',    // 红色
        '本帮菜': 'warning', // 黄色
        '粤菜': 'success',   // 绿色
        '面食': 'primary',   // ���色
        '素菜': 'info',      // 灰色
        '饮品': ''          // 默认
      }
      return typeMap[category] || ''
    }

    // 修改餐厅切换处理函数
    const handleCanteenChange = (tab) => {
      activeCanteen.value = tab.props.name
      selectedFloor.value = null // 清空已选楼层
      selectedWindow.value = null // 清空已选窗口
      currentPage.value = 1 // 重置页码
    }

    // 添加地图相关的数据
    const mapCanteens = ref([
      {
        id: 1,
        name: '中央食堂',
        position: { x: -20, z: -20 },
        location: '校园中心区'
      },
      {
        id: 2,
        name: '沁园餐厅',
        position: { x: 20, z: 20 },
        location: '学生宿舍区'
      },
      {
        id: 3,
        name: '馨园餐厅',
        position: { x: 0, z: -30 },
        location: '中央食堂附近'
      },
      {
        id: 4,
        name: '仲园餐厅',
        position: { x: -30, z: 0 },
        location: 'D区附近'
      },
      {
        id: 5,
        name: '雅园餐厅',
        position: { x: 30, z: -20 },
        location: '信科附近'
      },
      {
        id: 6,
        name: 'F区服务点',
        position: { x: 10, z: -10 },
        location: 'F区宿舍'
      },
      {
        id: 7,
        name: 'A区服务点',
        position: { x: -10, z: 10 },
        location: 'A区宿舍'
      }
    ])

    // 处理地食堂选择
    const handleMapCanteenSelect = (canteen) => {
      activeCanteen.value = canteen.name
      // 触发 tab 切换
      const tab = {
        props: {
          name: canteen.name
        }
      }
      handleCanteenChange(tab)
    }

    // 添加窗口选择函数
    const selectWindow = (window) => {
      selectedWindow.value = window
      // 加载该窗口的菜品列表
      if (window) {
        loadWindowDishes(window.id)
      } else {
        dishes.value = [] // 清空菜品列表
      }
    }

    // 添加加载窗口菜品的函数
    const loadWindowDishes = async (windowId) => {
      try {
        // 在实际开发中替换为真实的 API 调用
        // const response = await request.get(`/student/windows/${windowId}/dishes`)
        // dishes.value = response.data
        
        // 使用测试数据 - 根据窗口ID筛选菜品
        const windowDishMap = {
          1: [ // 川湘菜窗口
            {
              id: 1,
              name: '麻婆豆腐',
              price: 12,
              description: '使用四川特制豆瓣酱，口感麻辣鲜香',
              category: '川菜',
              image_url: 'https://example.com/mapo-tofu.jpg',
              stock: 20
            },
            {
              id: 5,
              name: '水煮肉片',
              price: 22,
              description: '新鲜猪肉，麻辣鲜香',
              category: '川菜',
              image_url: 'https://example.com/shuizhu.jpg',
              stock: 15
            }
          ],
          2: [ // 粤式炖汤窗口
            {
              id: 6,
              name: '莲藕排骨汤',
              price: 16,
              description: '清甜可口，营养丰富',
              category: '粤菜',
              image_url: 'https://example.com/soup.jpg',
              stock: 10
            }
          ],
          4: [ // 面食档口
            {
              id: 4,
              name: '番茄牛肉面',
              price: 15,
              description: '手工面条，配以新鲜番茄和优质牛肉',
              category: '面食',
              image_url: 'https://example.com/beef-noodles.jpg',
              stock: 0
            },
            {
              id: 7,
              name: '担担面',
              price: 12,
              description: '正宗川式担担面，香辣可口',
              category: '面食',
              image_url: 'https://example.com/dandanmian.jpg',
              stock: 25
            }
          ],
          20: [ // F区快餐窗口
            {
              id: 30,
              name: 'F区套餐A',
              price: 15,
              description: '米饭、炒菜、汤品',
              category: '套餐',
              image_url: 'https://example.com/f-meal-a.jpg',
              stock: 30
            }
          ],
          21: [ // F区饮品窗口
            {
              id: 31,
              name: '奶茶',
              price: 8,
              description: '珍珠奶茶',
              category: '饮品',
              image_url: 'https://example.com/milk-tea.jpg',
              stock: 50
            }
          ],
          22: [ // A区快餐窗口
            {
              id: 32,
              name: 'A区套餐B',
              price: 16,
              description: '米饭、炒菜、水果',
              category: '套餐',
              image_url: 'https://example.com/a-meal-b.jpg',
              stock: 25
            }
          ],
          23: [ // A区饮品窗口
            {
              id: 33,
              name: '果汁',
              price: 10,
              description: '鲜榨果汁',
              category: '饮品',
              image_url: 'https://example.com/juice.jpg',
              stock: 40
            }
          ]
        }
        
        dishes.value = windowDishMap[windowId] || []
        
        if (dishes.value.length === 0) {
          ElMessage.info('该窗口暂无菜品信息')
        }
      } catch (error) {
        console.error('加载菜品列表失败:', error)
        ElMessage.error('加载菜品列表失败')
        dishes.value = []
      }
    }

    // 添加示菜品详情的函数
    const showDishDetail = (dish) => {
      router.push(`/student/dishes/${dish.id}`)
    }

    // 添加下单函数
    const orderDish = (dish) => {
      router.push(`/student/dishes/${dish.id}`)
    }

    // 添加菜品过滤计算属性
    const filteredDishes = computed(() => {
      let result = dishes.value

      // 搜索过滤
      if (searchQuery.value) {
        result = result.filter(dish => 
          dish.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      }

      // 分类过滤
      if (categoryFilter.value) {
        result = result.filter(dish => 
          dish.category === categoryFilter.value
        )
      }

      // 价格排序
      if (priceSort.value) {
        result.sort((a, b) => {
          if (priceSort.value === 'asc') {
            return a.price - b.price
          } else {
            return b.price - a.price
          }
        })
      }

      return result
    })

    // 添加分页相关的响应式数据
    const currentPage = ref(1)
    const pageSize = ref(8) // 每页显示8个窗口

    // 计算总窗口数和总页数
    const totalWindows = computed(() => {
      const windows = getFloorWindows(activeCanteen.value, selectedFloor.value) || []
      return windows.length
    })

    const totalPages = computed(() => {
      return Math.ceil(totalWindows.value / pageSize.value)
    })

    // 计算当前页显示的窗口
    const displayWindows = computed(() => {
      const windows = getFloorWindows(activeCanteen.value, selectedFloor.value) || []
      const start = (currentPage.value - 1) * pageSize.value
      return windows.slice(start, start + pageSize.value)
    })

    // 处理页码改变
    const handlePageChange = (page) => {
      currentPage.value = page
    }

    // 添加楼层选择函数
    const selectFloor = (floor) => {
      selectedFloor.value = floor
      selectedWindow.value = null // 清空已选窗口
      currentPage.value = 1 // 重置页码
    }

    // 平面图相关状态
    const currentFloor = ref(1)
    const selectedCanteen = ref(null)

    // 查看平面图
    const viewFloorPlan = () => {
      if (selectedCanteen.value) {
        floorPlanVisible.value = true
      }
    }

    // 获取当前楼层平面图
    const getCurrentFloorPlan = () => {
      if (!selectedCanteen.value) return ''
      // 这里返回对应的平面图URL
      return `/floor-plans/${selectedCanteen.value.id}-${currentFloor.value}.png`
    }

    return {
      activeCanteen,
      selectedWindow,
      searchQuery,
      categoryFilter,
      priceSort,
      canteens,
      floorPlanVisible,
      currentCanteen,
      // 返回注入的函数
      isCanteenOpen: canteenStatus,
      getFloorWindows: windows,
      isWindowOpen: windowStatus,
      getCrowdLevelType: crowdLevel,
      getCrowdLevelText: crowdText,
      getWindowDishCount: dishCount,
      handleCanteenChange,  // 记得返回这个函数
      mapCanteens,
      handleMapCanteenSelect,
      selectWindow,
      showDishDetail,
      orderDish,
      dishes,
      filteredDishes,
      categories, // 添加到返回值中
      getCategoryType, // 添加到返回值中
      selectedFloor,
      selectFloor,
      currentPage,
      totalPages,
      displayWindows,
      handlePageChange,
      viewFloorPlan,
      currentFloor,
      selectedCanteen,
      getCurrentFloorPlan
    }
  }
}
</script>

<style scoped>
.dish-list {
  padding: 20px;
}

.canteen-nav {
  margin-bottom: 30px;
}

.canteen-info {
  margin-bottom: 20px;
}

.canteen-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.canteen-basic h3 {
  margin: 0 0 10px;
}

.status-tags {
  display: flex;
  gap: 10px;
}

.canteen-details {
  margin-top: 15px;
  color: #666;
}

.canteen-details p {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 5px 0;
}

.window-navigation {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.nav-section {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.nav-label {
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
  font-weight: 500;
}

.nav-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.nav-item {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  background: #f5f7fa;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.nav-item:hover {
  background: #ecf5ff;
  color: #409EFF;
}

.nav-item.active {
  background: #409EFF;
  color: #fff;
}

.nav-item.closed {
  opacity: 0.7;
}

.filter-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.search-input {
  width: 200px;
}

.dishes-content {
  display: flex;
}

.dishes-list {
  flex: 1;
  padding: 20px;
  min-height: 500px;
  background: #fff;
}

.dishes-list.full-width {
  width: 100%;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .top-nav {
    flex-direction: column;
  }

  .filter-actions {
    flex-direction: column;
    width: 100%;
  }

  .filter-actions .el-input,
  .filter-actions .el-select {
    width: 100%;
  }

  .nav-items {
    flex-direction: column;
    width: 100%;
  }

  .nav-item {
    width: 100%;
    text-align: center;
  }

  .nav-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .nav-list {
    width: 100%;
  }

  .nav-item {
    width: 100%;
    justify-content: center;
  }
}

/* 添加地图相关样式 */
.map-section {
  width: 100%;
  height: 300px;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  position: relative;
}

.map-section canvas {
  width: 100% !important;
  height: 100% !important;
}

.dishes-content {
  display: flex;
}

.category-nav {
  width: 200px;
  margin-right: 20px;
}

.category-item {
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-item:hover {
  background: #f5f7fa;
}

.category-item.active {
  background: #409EFF;
  color: #fff;
}

.dishes-list {
  flex: 1;
}

.dish-item {
  display: flex;
  align-items: center;
  padding: 10px;
  transition: all 0.3s;
  cursor: pointer;
}

.dish-item:hover {
  background: #f5f7fa;
}

.dish-image-wrapper {
  width: 100px;
  height: 100px;
  margin-right: 10px;
}

.dish-img {
  width: 100%;
  height: 100%;
}

.dish-main-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dish-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price-symbol {
  font-size: 18px;
  font-weight: bold;
}

.price-value {
  font-size: 18px;
  font-weight: bold;
}

.stock-info {
  font-size: 13px;
  color: #409EFF;
}

.stock-info.sold-out {
  color: #f56c6c;
}

.window-card {
  margin: 0;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  background: transparent;
}

.window-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.window-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.window-name {
  font-weight: 500;
}

.window-content {
  margin-top: 5px;
  color: #666;
  font-size: 13px;
}

.floor-nav {
  padding: 0;
}

.floor-nav .nav-list {
  display: flex;
  width: 100%;
  gap: 0;
}

.floor-nav .nav-item {
  flex: 1;
  border-radius: 0;
  padding: 15px 0;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  background: transparent;
  border-bottom: 2px solid transparent;
}

.floor-nav .nav-item:hover {
  background: #f5f7fa;
  color: #409EFF;
}

.floor-nav .nav-item.active {
  background: transparent;
  color: #409EFF;
  border-bottom-color: #409EFF;
}

.floor-nav .nav-item:first-child {
  border-radius: 8px 0 0 8px;
}

.floor-nav .nav-item:last-child {
  border-radius: 0 8px 8px 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .floor-nav .nav-list {
    flex-wrap: wrap;
  }

  .floor-nav .nav-item {
    flex: 1;
    min-width: 33.33%;
  }
}

.windows-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  width: 100%;
}

.window-grid-item {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #ebeef5;
}

.window-grid-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.window-grid-item.active {
  border-color: #409EFF;
  background: #ecf5ff;
}

.window-grid-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.window-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.window-name {
  font-size: 16px;
  font-weight: 500;
}

.window-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.window-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 13px;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .windows-grid {
    grid-template-columns: 1fr;
  }
}

.floor-plan-container {
  padding: 20px;
}

.floor-selector {
  margin-bottom: 20px;
  text-align: center;
}

.floor-plan {
  width: 100%;
  text-align: center;
}

.floor-plan-image {
  max-width: 100%;
  height: auto;
}

</style> 