<template>
  <div class="menu-management">
    <!-- 顶部操作栏 -->
    <div class="top-actions">
      <div class="left">
        <el-button type="primary" @click="showAddDialog">
          <el-icon><Plus /></el-icon>上传菜单
        </el-button>
        <el-date-picker
          v-model="selectedDate"
          type="date"
          placeholder="选择日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          @change="handleDateChange"
          :disabled-date="disabledDate"
          class="date-picker">
        </el-date-picker>
        <el-button 
          type="warning" 
          plain
          @click="showPeakHoursDialog">
          <el-icon><Timer /></el-icon>
          高峰时段管理
        </el-button>
        <el-button 
          type="primary" 
          plain
          @click="goToDishManagement">
          <el-icon><Plus /></el-icon>
          管理菜品库
        </el-button>
      </div>
      <div class="right">
        <el-select 
          v-model="canteenFilter" 
          placeholder="选择餐厅" 
          clearable 
          @change="handleFilter"
          class="filter-item">
          <el-option
            v-for="canteen in canteens"
            :key="canteen.id"
            :label="canteen.name"
            :value="canteen.name">
          </el-option>
        </el-select>
        <el-select 
          v-model="windowFilter" 
          placeholder="选择窗口" 
          clearable 
          @change="handleFilter"
          class="filter-item">
          <el-option-group
            v-for="canteen in canteens"
            :key="canteen.id"
            :label="canteen.name">
            <el-option
              v-for="window in windows.filter(w => w.canteen === canteen.name)"
              :key="window.id"
              :label="window.name"
              :value="window.id">
              <span style="float: left">{{ window.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ window.location }}
              </span>
            </el-option>
          </el-option-group>
        </el-select>
      </div>
    </div>

    <!-- 菜单展示区 -->
    <div class="menu-content">
      <el-tabs v-model="activeCanteen" type="card" class="canteen-tabs">
        <el-tab-pane 
          v-for="canteen in canteens" 
          :key="canteen.id"
          :label="canteen.name"
          :name="canteen.name">
          <div class="canteen-header">
            <h3>{{ canteen.name }}</h3>
            <el-button 
              type="primary" 
              plain 
              size="small"
              @click="showFloorPlan(canteen)">
              <el-icon><Location /></el-icon>
              查看平面图
            </el-button>
          </div>
          
          <el-row :gutter="20">
            <el-col :span="24">
              <el-card class="menu-card">
                <template #header>
                  <div class="card-header">
                    <span class="header-title">
                      {{ formatDate(selectedDate || new Date()) }} 菜单安排
                    </span>
                    <el-tag type="success" effect="dark" class="status-tag">
                      {{ isPublished ? '已发布' : '未发布' }}
                    </el-tag>
                  </div>
                </template>
                
                <!-- 窗口菜单列表 -->
                <div class="window-menus">
                  <el-collapse v-model="activeWindows">
                    <el-collapse-item 
                      v-for="window in filteredWindows" 
                      :key="window.id"
                      :title="window.name"
                      :name="window.id">
                      <div class="window-menu">
                        <div class="menu-header">
                          <div class="menu-time">营业时间：{{ window.operatingHours }}</div>
                          <div class="menu-actions">
                            <el-button 
                              v-if="window.editable"
                              type="primary" 
                              link 
                              @click="editWindowMenu(window)">
                              <el-icon><Edit /></el-icon>编辑菜单
                            </el-button>
                          </div>
                        </div>
                        
                        <!-- 菜品列表 -->
                        <el-table 
                          :data="getWindowDishes(window.id)"
                          style="width: 100%"
                          :header-cell-style="{ background: '#f5f7fa' }">
                          <el-table-column prop="name" label="菜品名称">
                            <template #default="{ row }">
                              <div class="dish-info">
                                <el-image 
                                  :src="row.image_url" 
                                  :preview-src-list="[row.image_url]"
                                  class="dish-image">
                                </el-image>
                                <span>{{ row.name }}</span>
                              </div>
                            </template>
                          </el-table-column>
                          <el-table-column prop="category" label="类别" width="120">
                            <template #default="{ row }">
                              <el-tag size="small" :type="getCategoryType(row.category)">
                                {{ row.category }}
                              </el-tag>
                            </template>
                          </el-table-column>
                          <el-table-column prop="price" label="价格" width="120">
                            <template #default="{ row }">
                              <span class="price">¥{{ row.price }}</span>
                            </template>
                          </el-table-column>
                          <el-table-column label="库存状态" width="120">
                            <template #default="{ row }">
                              <el-tag 
                                :type="row.stock > 10 ? 'success' : row.stock > 0 ? 'warning' : 'danger'"
                                size="small">
                                {{ row.stock > 0 ? `剩余${row.stock}份` : '已售罄' }}
                              </el-tag>
                            </template>
                          </el-table-column>
                          <el-table-column label="操作" width="150" fixed="right">
                            <template #default="{ row }">
                              <template v-if="hasPermission(window.id)">
                                <el-button 
                                  type="primary" 
                                  link 
                                  @click="updateStock(row)">
                                  更新库存
                                </el-button>
                                <el-button 
                                  type="danger" 
                                  link 
                                  @click="removeDish(row)">
                                  移除
                                </el-button>
                              </template>
                              <template v-else>
                                <el-button 
                                  type="info" 
                                  link 
                                  @click="viewDishDetails(row)">
                                  查看详情
                                </el-button>
                              </template>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 编辑菜单对话框 -->
    <el-dialog 
      :title="`编辑${currentWindow?.name || ''}菜单`"
      v-model="dialogVisible"
      width="60%">
      <div class="dialog-content">
        <div class="selected-dishes">
          <h4>已选菜品</h4>
          <el-table :data="selectedDishes" style="width: 100%">
            <el-table-column prop="name" label="菜品名称"></el-table-column>
            <el-table-column prop="category" label="类别" width="120"></el-table-column>
            <el-table-column prop="price" label="价格" width="120"></el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <el-button 
                  type="danger" 
                  link 
                  @click="removeSelectedDish(row)">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="dish-selector">
          <h4>添加菜品</h4>
          <div class="selector-filters">
            <el-input
              v-model="dishSearchQuery"
              placeholder="搜索菜品"
              clearable
              class="search-input">
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select 
              v-model="dishCategoryFilter"
              placeholder="菜品类别"
              clearable>
              <el-option
                v-for="category in categories"
                :key="category"
                :label="category"
                :value="category">
              </el-option>
            </el-select>
          </div>

          <el-table 
            :data="filteredAvailableDishes"
            style="width: 100%"
            height="300"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="菜品名称"></el-table-column>
            <el-table-column prop="category" label="类别" width="120"></el-table-column>
            <el-table-column prop="price" label="价格" width="120"></el-table-column>
          </el-table>
        </div>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveWindowMenu" :loading="loading">
          保存菜单
        </el-button>
      </template>
    </el-dialog>

    <!-- 更新库存对话框 -->
    <el-dialog
      title="更新库存"
      v-model="stockDialogVisible"
      width="400px">
      <el-form :model="stockForm" label-width="80px">
        <el-form-item label="当前库存">
          <el-input-number
            v-model="stockForm.stock"
            :min="0"
            :max="999"
            controls-position="right">
          </el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="stockDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveStock" :loading="loading">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 添加平面图对话框 -->
    <el-dialog
      :title="`${currentCanteen?.name || ''} 平面图`"
      v-model="floorPlanVisible"
      width="80%"
      class="floor-plan-dialog">
      <div class="floor-plan-container">
        <!-- 楼层切换 -->
        <div v-if="currentCanteen?.floors > 1" class="floor-selector">
          <el-radio-group v-model="currentFloor">
            <el-radio-button 
              v-for="floor in currentCanteen.floors" 
              :key="floor" 
              :label="floor">
              {{ floor }}层
            </el-radio-button>
          </el-radio-group>
        </div>

        <!-- 平面图展示 -->
        <div class="floor-plan">
          <div class="floor-plan-wrapper">
            <img :src="getCurrentFloorPlan()" class="floor-plan-image" />
            
            <!-- 窗口标记 -->
            <div 
              v-for="window in getFloorWindows()" 
              :key="window.id"
              class="window-marker"
              :style="getMarkerStyle(window)"
              @mouseenter="showWindowInfo(window)"
              @mouseleave="hideWindowInfo">
              <el-tooltip
                :content="getWindowTooltip(window)"
                placement="top"
                :visible="hoveredWindow?.id === window.id">
                <div class="marker-dot"></div>
              </el-tooltip>
            </div>
          </div>

          <!-- 图例说明 -->
          <div class="floor-plan-legend">
            <div class="legend-item">
              <span class="legend-dot available"></span>
              <span>营业中</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot closed"></span>
              <span>已打烊</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 高峰时段管理对话框 -->
    <el-dialog
      title="就餐高峰时段管理"
      v-model="peakHoursDialogVisible"
      width="60%">
      <div class="peak-hours-container">
        <!-- 时段统计图表 -->
        <div class="chart-container">
          <div ref="peakHoursChart" class="peak-hours-chart"></div>
        </div>

        <!-- 高峰时段设置 -->
        <div class="peak-hours-settings">
          <div v-for="canteen in canteens" :key="canteen.id" class="canteen-peak-hours">
            <h4>{{ canteen.name }}</h4>
            <div class="peak-periods">
              <div class="period-group">
                <span class="period-label">午餐高峰：</span>
                <el-time-select
                  v-model="peakHours[canteen.name].lunch.start"
                  start="10:30"
                  step="00:15"
                  end="14:00"
                  placeholder="开始时间"
                  class="time-select"
                />
                <span>至</span>
                <el-time-select
                  v-model="peakHours[canteen.name].lunch.end"
                  start="10:30"
                  step="00:15"
                  end="14:00"
                  placeholder="结束时间"
                  class="time-select"
                />
              </div>
              <div class="period-group">
                <span class="period-label">晚餐高峰：</span>
                <el-time-select
                  v-model="peakHours[canteen.name].dinner.start"
                  start="16:30"
                  step="00:15"
                  end="20:00"
                  placeholder="开始时间"
                  class="time-select"
                />
                <span>至</span>
                <el-time-select
                  v-model="peakHours[canteen.name].dinner.end"
                  start="16:30"
                  step="00:15"
                  end="20:00"
                  placeholder="结束时间"
                  class="time-select"
                />
              </div>
              <div class="crowd-level">
                <span class="period-label">当前拥��度：</span>
                <el-tag :type="getCrowdLevelType(canteen.name)">
                  {{ getCrowdLevelText(canteen.name) }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>

        <!-- 实时提醒设置 -->
        <div class="notification-settings">
          <el-divider>实时提醒设置</el-divider>
          <el-form :model="notificationSettings" label-width="120px">
            <el-form-item label="拥挤度提醒">
              <el-switch v-model="notificationSettings.crowdAlert" />
            </el-form-item>
            <el-form-item label="提醒阈值">
              <el-slider
                v-model="notificationSettings.crowdThreshold"
                :min="0"
                :max="100"
                :step="10"
                :disabled="!notificationSettings.crowdAlert"
                show-stops
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #footer>
        <el-button @click="peakHoursDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePeakHours">保存设置</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Plus, 
  Edit, 
  Search,
  Delete,
  Location,
  Timer
} from '@element-plus/icons-vue'
import request from '../../utils/request'
import * as echarts from 'echarts'
import { useRouter } from 'vue-router'

export default {
  name: 'MenuManagement',
  components: {
    Plus,
    Edit,
    Search,
    Delete,
    Location,
    Timer
  },
  setup() {
  

    // ===== 模拟数据开始 =====
    // 菜品数据
    const mockDishes = [
      {
        id: 1,
        name: '红烧肉',
        category: '热菜',
        price: 15,
        image_url: 'https://example.com/dishes/hongshaorou.jpg',
        stock: 50,
        description: '经典红烧肉，肥而不腻'
      },
      {
        id: 2,
        name: '清炒时蔬',
        category: '素菜',
        price: 8,
        image_url: 'https://example.com/dishes/qingcao.jpg',
        stock: 100,
        description: '新鲜时令蔬菜'
      },
      {
        id: 3,
        name: '番茄蛋汤',
        category: '汤品',
        price: 6,
        image_url: 'https://example.com/dishes/fanqiedantang.jpg',
        stock: 80,
        description: '营养美味的番茄蛋汤'
      }
    ]

    // 餐厅数据
    const mockCanteens = [
      { id: 1, name: '中央食堂', floors: 3, location: '校园中心区' },
      { id: 2, name: '沁园餐厅', floors: 2, location: '学生宿舍区' },
      { id: 3, name: '馨园餐厅', floors: 1, location: '教学区' },
      { id: 4, name: '仲园餐厅', floors: 2, location: '图书馆附近' },
      { id: 5, name: '雅园餐厅', floors: 1, location: '体育馆附近' },
      { id: 6, name: '服务点', floors: 1, location: 'F区、A区' }
    ]

    // 窗口数据
    const mockWindows = [
      // 中央食堂窗口
      { 
        id: 101,
        name: '一楼-大荤窗口',
        location: '中央食堂一楼左',
        operatingHours: '10:30-13:30, 16:30-19:00',
        canteen: '中央食堂'
      },
      {
        id: 102,
        name: '一楼-特色炒菜',
        location: '中央食堂一楼右',
        operatingHours: '10:30-13:30, 16:30-19:00',
        canteen: '中央食堂'
      },
      // 沁园餐厅窗口
      {
        id: 201,
        name: '一楼-快餐窗口',
        location: '沁园餐厅一楼',
        operatingHours: '10:30-13:30, 16:30-19:00',
        canteen: '沁园餐厅'
      }
    ]

    // 菜单数据
    const mockMenus = [
      {
        id: 1,
        window_id: 101,
        date: '2024-03-17',
        dishes: [
          { id: 1, name: '红烧肉', price: 15, stock: 50 },
          { id: 2, name: '清炒时蔬', price: 8, stock: 100 }
        ]
      },
      {
        id: 2,
        window_id: 102,
        date: '2024-03-17',
        dishes: [
          { id: 3, name: '番茄蛋汤', price: 6, stock: 80 }
        ]
      }
    ]

    // 高峰时段数据
    const mockPeakHours = {
      '中���食堂': {
        lunch: { start: '11:30', end: '12:30' },
        dinner: { start: '17:30', end: '18:30' }
      },
      '沁园餐厅': {
        lunch: { start: '11:45', end: '12:45' },
        dinner: { start: '17:45', end: '18:45' }
      }
    }

    // 模拟实时客流数据
    const mockCrowdData = {
      '中央食堂': { current: 65, max: 100 },
      '沁园餐厅': { current: 45, max: 100 }
    }
    // ===== 模拟数据结束 =====

       // 状态定义
    // 基础数据
    const selectedDate = ref(new Date())
    const windowFilter = ref('')
    const activeWindows = ref([])
    const currentWindow = ref(null)
    const isPublished = ref(false)
    const loading = ref(false)
    const canteens = ref(mockCanteens)  // 只在这里定义一次
    // 菜单相关数据
    const menus = ref(mockMenus)        // 只在这里定义一次
    const windows = ref(mockWindows)     // 只在这里定义一次
    const dishes = ref(mockDishes)       // 只在这里定义一次
    const selectedDishes = ref([])
    const dialogVisible = ref(false)
    const stockDialogVisible = ref(false)

    // 搜索和筛选
    const dishSearchQuery = ref('')
    const dishCategoryFilter = ref('')
    const categories = [
      '主食', '大荤', '小荤', '素菜', 
      '汤品', '特色炒菜', '面食',
      '饮品', '水果', '小吃'
    ]

    // 表单数据
    const stockForm = reactive({
      stock: 0,
      dishId: null
    })

    // 计算属性
    const filteredWindows = computed(() => {
      let result = windows.value
      if (canteenFilter.value) {
        result = result.filter(w => w.canteen === canteenFilter.value)
      }
      if (windowFilter.value) {
        result = result.filter(w => w.id === windowFilter.value)
      }
      // 如果是已验证用户，只显示其管理的窗口的编辑按钮
      result = result.map(window => ({
        ...window,
        editable: hasPermission(window.id)
      }))
      return result
    })

    const filteredAvailableDishes = computed(() => {
      return dishes.value.filter(dish => {
        const nameMatch = dish.name.toLowerCase().includes(dishSearchQuery.value.toLowerCase())
        const categoryMatch = !dishCategoryFilter.value || dish.category === dishCategoryFilter.value
        return nameMatch && categoryMatch
      })
    })

    // 方法
    const handleDateChange = async (date) => {
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        menus.value = mockMenus
        isPublished.value = mockMenus.length > 0
      } catch (error) {
        ElMessage.error('获取菜单数据失败')
      }
    }

    const handleFilter = () => {
      // 窗口筛选逻辑已通过计算属性实现
    }

    const editWindowMenu = (window) => {
      if (!hasPermission(window.id)) {
        ElMessage.warning('您没有权限编辑此窗口的菜单')
        return
      }
      currentWindow.value = window
      selectedDishes.value = getWindowDishes(window.id)
      dialogVisible.value = true
    }

    const getWindowDishes = (windowId) => {
      const windowMenu = menus.value.find(m => m.window_id === windowId)
      return windowMenu ? windowMenu.dishes : []
    }

    const handleSelectionChange = (selection) => {
      // 处理多选
      const newDishes = selection.filter(dish => 
        !selectedDishes.value.some(d => d.id === dish.id)
      )
      selectedDishes.value.push(...newDishes)
    }

    const removeSelectedDish = (dish) => {
      const index = selectedDishes.value.findIndex(d => d.id === dish.id)
      if (index > -1) {
        selectedDishes.value.splice(index, 1)
      }
    }

    const updateStock = (dish) => {
      stockForm.dishId = dish.id
      stockForm.stock = dish.stock
      stockDialogVisible.value = true
    }

    const saveStock = async () => {
      try {
        loading.value = true
        // 使用模拟API
        await mockUpdateStock(stockForm.dishId, stockForm.stock)
        ElMessage.success('库存更新成功')
        stockDialogVisible.value = false
        await fetchMenus()
      } catch (error) {
        ElMessage.error('库存更新失败')
      } finally {
        loading.value = false
      }
    }

    const saveWindowMenu = async () => {
      try {
        loading.value = true
        // 使用模拟API
        await mockSaveMenu({
          window_id: currentWindow.value.id,
          date: selectedDate.value,
          dishes: selectedDishes.value.map(d => d.id)
        })
        ElMessage.success('菜单保存成功')
        dialogVisible.value = false
        await fetchMenus()
      } catch (error) {
        ElMessage.error('菜单保存失败')
      } finally {
        loading.value = false
      }
    }

    const removeDish = async (dish) => {
      try {
        await ElMessageBox.confirm(
          `确定要从菜单中移除 ${dish.name} 吗？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        await request.delete(`/admin/menus/${currentWindow.value.id}/dishes/${dish.id}`)
        ElMessage.success('移除成功')
        await fetchMenus()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('移除失败')
        }
      }
    }

    // 禁用过去的日期
    const disabledDate = (time) => {
      return time.getTime() < Date.now() - 8.64e7
    }

    // ===== 测试用的模拟API方法开始 =====
    const fetchWindows = async () => {
      // 模拟API调用
      return new Promise(resolve => {
        setTimeout(() => {
          windows.value = mockWindows
          resolve()
        }, 500)
      })
    }

    const fetchDishes = async () => {
      // 模拟API调用
      return new Promise(resolve => {
        setTimeout(() => {
          dishes.value = mockDishes
          resolve()
        }, 500)
      })
    }

    const fetchMenus = async () => {
      try {
        loading.value = true
        const response = await request.get('/admin/menus', {
          params: {
            date: selectedDate.value
          }
        })
        menus.value = response.data
      } catch (error) {
        console.error('获取菜单失败:', error)
        ElMessage.error('获取菜单数据失败，请稍后重试')
        menus.value = [] // 设置默认值
      } finally {
        loading.value = false
      }
    }

    // 模拟保存菜单
    const mockSaveMenu = async (data) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('保存的菜单数据:', data)
          resolve({ status: 'success' })
        }, 1000)
      })
    }

    // 模拟更新库存
    const mockUpdateStock = async (dishId, stock) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(`更新菜品${dishId}的库存为${stock}`)
          resolve({ status: 'success' })
        }, 500)
      })
    }
    // ===== 测试用的模拟API方法结束 =====

    // 初始化数据
    onMounted(() => {
      windows.value = mockWindows
      dishes.value = mockDishes
      menus.value = mockMenus
      handleDateChange(selectedDate.value)
    })

    // 添加 showAddDialog 方法
    const showAddDialog = () => {
      currentWindow.value = null
      selectedDishes.value = []
      dialogVisible.value = true
    }

    // 格式化日期
    const formatDate = (date) => {
      const d = new Date(date)
      const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${days[d.getDay()]}`
    }

    // 获取类别标签类型
    const getCategoryType = (category) => {
      const types = {
        '主食': '',
        '热菜': 'success',
        '凉菜': 'info',
        '汤品': 'warning',
        '饮品': 'danger'
      }
      return types[category] || 'info'
    }

    // 添加餐厅筛选
    const canteenFilter = ref('')

    // 平面图相关
    const floorPlanVisible = ref(false)
    const currentCanteen = ref(null)
    const currentFloor = ref(1)
    const hoveredWindow = ref(null)

    // 餐厅平面图数据
    const floorPlans = {
      '中央食堂': {
        1: '/floor-plans/central-1f.png',
        2: '/floor-plans/central-2f.png',
        3: '/floor-plans/central-3f.png'
      },
      '沁园餐厅': {
        1: '/floor-plans/qinyuan-1f.png',
        2: '/floor-plans/qinyuan-2f.png'
      },
      '仲园餐厅': {
        1: '/floor-plans/zhongyuan-1f.png',
        2: '/floor-plans/zhongyuan-2f.png'
      },
      '馨园餐厅': {
        1: '/floor-plans/xinyuan-1f.png'
      },
      '雅园餐厅': {
        1: '/floor-plans/yayuan-1f.png'
      }
    }

    // 窗口位置数据（示例）
    const windowPositions = {
      101: { x: 30, y: 40 },  // 中央食堂一楼大荤窗口
      102: { x: 60, y: 35 },  // 中央食堂一楼特色炒菜
      // ... 其他窗口位置
    }

    const showFloorPlan = (canteen) => {
      currentCanteen.value = canteen
      currentFloor.value = 1
      floorPlanVisible.value = true
    }

    const getCurrentFloorPlan = () => {
      if (!currentCanteen.value) return ''
      // 如果没有实图片，返回默认图片
      return floorPlans[currentCanteen.value.name]?.[currentFloor.value] || 'default-floor-plan.png'
    }

    const getFloorWindows = () => {
      if (!currentCanteen.value) return []
      return windows.value.filter(w => 
        w.canteen === currentCanteen.value.name && 
        getWindowFloor(w) === currentFloor.value
      )
    }

    const getWindowFloor = (window) => {
      // 从窗口名称或位置信息中提取楼层信息
      const match = window.location.match(/(\d+)楼/)
      return match ? parseInt(match[1]) : 1
    }

    const getMarkerStyle = (window) => {
      const pos = windowPositions[window.id] || { x: 0, y: 0 }
      return {
        left: `${pos.x}%`,
        top: `${pos.y}%`
      }
    }

    const showWindowInfo = (window) => {
      hoveredWindow.value = window
    }

    const hideWindowInfo = () => {
      hoveredWindow.value = null
    }

    const getWindowTooltip = (window) => {
      return `${window.name}
营业时间：${window.operatingHours}
当前状态：${isWindowOpen(window) ? '营业中' : '已打烊'}`
    }

    const isWindowOpen = (window) => {
      // 判断窗口是否在营业时间内
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const currentTime = hours * 60 + minutes

      const [lunch, dinner] = window.operatingHours.split(',').map(time => {
        const [start, end] = time.trim().split('-')
        return {
          start: parseInt(start.split(':')[0]) * 60 + parseInt(start.split(':')[1]),
          end: parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1])
        }
      })

      return (currentTime >= lunch.start && currentTime <= lunch.end) ||
             (currentTime >= dinner.start && currentTime <= dinner.end)
    }

    // 高峰时段相关
    const peakHoursDialogVisible = ref(false)
    const peakHoursChart = ref(null)
    let chart = null

    // 各餐厅高峰时段设置
    const peakHours = reactive({
      '中央食堂': {
        lunch: { start: '11:30', end: '12:30' },
        dinner: { start: '17:30', end: '18:30' }
      },
      '沁园餐厅': {
        lunch: { start: '11:45', end: '12:45' },
        dinner: { start: '17:45', end: '18:45' }
      },
      '馨园餐厅': {
        lunch: { start: '11:30', end: '12:30' },
        dinner: { start: '17:30', end: '18:30' }
      },
      '仲园餐厅': {
        lunch: { start: '11:30', end: '12:30' },
        dinner: { start: '17:30', end: '18:30' }
      },
      '雅园餐厅': {
        lunch: { start: '11:30', end: '12:30' },
        dinner: { start: '17:30', end: '18:30' }
      },
      '服务点': {
        lunch: { start: '11:30', end: '12:30' },
        dinner: { start: '17:30', end: '18:30' }
      }
    })

    // 通知设置
    const notificationSettings = reactive({
      crowdAlert: true,
      crowdThreshold: 80
    })

    // 模拟实时客流数据
    const crowdData = reactive({
      '中央食堂': { current: 65, max: 100 },
      '沁园餐厅': { current: 45, max: 100 },
      // ... 其他餐厅的数据
    })

    // 显示高峰时段对话框
    const showPeakHoursDialog = () => {
      peakHoursDialogVisible.value = true
      nextTick(() => {
        initChart()
      })
    }

    // 初始化图表
    const initChart = () => {
      if (!peakHoursChart.value) return
      
      chart = echarts.init(peakHoursChart.value)
      const option = {
        title: {
          text: '各餐厅就餐人数统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: Object.keys(crowdData),
          bottom: 0
        },
        xAxis: {
          type: 'category',
          data: ['10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30']
        },
        yAxis: {
          type: 'value',
          name: '就餐人数'
        },
        series: Object.entries(crowdData).map(([name, data]) => ({
          name,
          type: 'line',
          smooth: true,
          data: generateRandomData()
        }))
      }
      
      chart.setOption(option)
    }

    // 生成随机数据用于演示
    const generateRandomData = () => {
      return Array.from({ length: 7 }, () => 
        Math.floor(Math.random() * 100)
      )
    }

    // 获取拥挤度类型
    const getCrowdLevelType = (canteenName) => {
      const level = crowdData[canteenName].current
      if (level > 80) return 'danger'
      if (level > 60) return 'warning'
      return 'success'
    }

    // 获取拥挤度文本
    const getCrowdLevelText = (canteenName) => {
      const level = crowdData[canteenName].current
      if (level > 80) return '非常拥挤'
      if (level > 60) return '较为拥挤'
      return '空闲'
    }

    // 保存高峰时段设置
    const savePeakHours = () => {
      // 这里添加保存逻辑
      ElMessage.success('设置已保存')
      peakHoursDialogVisible.value = false
    }

    // 模拟实时数据更新
    let timer = null
    const startRealTimeUpdate = () => {
      timer = setInterval(() => {
        Object.keys(crowdData).forEach(canteen => {
          crowdData[canteen].current = Math.floor(Math.random() * 100)
        })
      }, 5000)
    }

    onMounted(() => {
      startRealTimeUpdate()
    })

    onUnmounted(() => {
      if (timer) clearInterval(timer)
      if (chart) chart.dispose()
    })

    const activeCanteen = ref('中央食堂')

    const router = useRouter()
    const goToDishManagement = () => {
      router.push('/admin/dishes')
    }

    // 获取用户验证信息
    const userVerification = computed(() => {
      const verifiedInfo = localStorage.getItem('verifiedInfo')
      return verifiedInfo ? JSON.parse(verifiedInfo) : null
    })

    // 判断是否有权限操作
    const hasPermission = (windowId) => {
      if (!userVerification.value) return false
      return userVerification.value.window.id === windowId
    }

    return {
      selectedDate,
      windowFilter,
      activeWindows,
      activeCanteen,
      currentWindow,
      isPublished,
      loading,
      menus,
      windows,
      dishes,
      selectedDishes,
      dialogVisible,
      stockDialogVisible,
      dishSearchQuery,
      dishCategoryFilter,
      categories,
      stockForm,
      filteredWindows,
      filteredAvailableDishes,
      handleDateChange,
      handleFilter,
      editWindowMenu,
      getWindowDishes,
      handleSelectionChange,
      removeSelectedDish,
      updateStock,
      saveStock,
      saveWindowMenu,
      removeDish,
      disabledDate,
      formatDate,
      getCategoryType,
      showAddDialog,
      canteens,
      canteenFilter,
      floorPlanVisible,
      currentCanteen,
      currentFloor,
      hoveredWindow,
      showFloorPlan,
      getCurrentFloorPlan,
      getFloorWindows,
      getMarkerStyle,
      showWindowInfo,
      hideWindowInfo,
      getWindowTooltip,
      peakHoursDialogVisible,
      peakHoursChart,
      peakHours,
      notificationSettings,
      showPeakHoursDialog,
      getCrowdLevelType,
      getCrowdLevelText,
      savePeakHours,
      goToDishManagement,
      hasPermission,
      userVerification
    }
  }
}
</script>

<style scoped>
.menu-management {
  padding: 20px;
}

.top-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.left {
  display: flex;
  gap: 10px;
}

.date-picker {
  width: 200px;
}

.menu-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 18px;
  font-weight: 500;
}

.window-menu {
  padding: 10px 0;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.menu-time {
  color: #666;
  font-size: 14px;
}

.dish-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dish-image {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
}

.price {
  color: #f56c6c;
  font-weight: 500;
}

.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.selected-dishes h4,
.dish-selector h4 {
  margin: 0 0 15px;
  color: #333;
}

.selector-filters {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.search-input {
  width: 200px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .top-actions {
    flex-direction: column;
    gap: 10px;
  }

  .left {
    flex-direction: column;
  }

  .date-picker {
    width: 100%;
  }

  .dialog-content {
    flex-direction: column;
  }
}

/* 动画效果 */
.el-collapse-item__header {
  transition: all 0.3s ease;
}

.el-collapse-item__header:hover {
  background: #f5f7fa;
}

.el-table {
  transition: all 0.3s ease;
}

.el-table:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

::-webkit-scrollbar-track {
  background: #f5f7fa;
}

.filter-item {
  margin-right: 10px;
  width: 160px;
}

.canteen-tabs {
  margin-bottom: 20px;
}

.canteen-tabs :deep(.el-tabs__header) {
  margin-bottom: 20px;
}

/* 添加平面图相关样式 */
.canteen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.floor-plan-container {
  position: relative;
  padding: 20px;
}

.floor-selector {
  margin-bottom: 20px;
  text-align: center;
}

.floor-plan {
  position: relative;
  width: 100%;
  background: #f5f7fa;
  border-radius: 8px;
  overflow: hidden;
}

.floor-plan-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 比例 */
}

.floor-plan-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.window-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
}

.marker-dot {
  width: 12px;
  height: 12px;
  background: #409EFF;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
}

.window-marker:hover .marker-dot {
  transform: scale(1.2);
}

.floor-plan-legend {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.legend-item {
  display: flex;
  align-items: center;
  margin: 5px 0;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
}

.legend-dot.available {
  background: #67C23A;
}

.legend-dot.closed {
  background: #909399;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .floor-plan-dialog {
    width: 95% !important;
  }
}

.peak-hours-container {
  padding: 20px;
}

.chart-container {
  margin-bottom: 30px;
}

.peak-hours-chart {
  width: 100%;
  height: 300px;
}

.canteen-peak-hours {
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 8px;
  background: #f5f7fa;
}

.canteen-peak-hours h4 {
  margin: 0 0 15px;
  color: #333;
}

.peak-periods {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.period-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.period-label {
  min-width: 100px;
}

.time-select {
  width: 120px;
}

.crowd-level {
  display: flex;
  align-items: center;
}

.notification-settings {
  margin-top: 30px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .period-group {
    flex-direction: column;
    align-items: flex-start;
  }

  .time-select {
    width: 100%;
  }
}
</style> 