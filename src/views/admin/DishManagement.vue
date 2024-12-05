<template>
  <div class="dish-management">
    <!-- 餐厅卡片列表 -->
    <div class="canteen-cards" v-if="!selectedCanteen">
      <el-row :gutter="20">
        <el-col :span="24/7" v-for="canteen in canteens" :key="canteen.id">
          <el-card 
            class="canteen-card" 
            :body-style="{ padding: '0px' }"
            @click="selectCanteen(canteen)">
            <div class="canteen-icon">
              <el-icon :size="40"><Bowl /></el-icon>
            </div>
            <div class="canteen-info">
              <h3>{{ canteen.name }}</h3>
              <p>{{ getWindowCount(canteen.id) }} 个窗口</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 窗口列表 -->
    <template v-else>
      <div class="window-header">
        <el-button @click="backToCanteens" text>
          <el-icon><Back /></el-icon> 返回餐厅列表
        </el-button>
        <h2>{{ selectedCanteenName }} - 窗口列表</h2>
      </div>
      
      <el-row :gutter="20" class="window-cards">
        <el-col 
          :span="6" 
          v-for="window in currentWindows" 
          :key="window.id">
          <el-card 
            class="window-card"
            @click="selectWindow(window)">
            <div class="window-icon">
              <el-icon :size="30"><Shop /></el-icon>
            </div>
            <div class="window-info">
              <h3>{{ window.name }}</h3>
              <p>{{ getDishCount(window.id) }} 个菜品</p>
              <p class="location">{{ window.location }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </template>

    <!-- 原有的顶部操作栏和菜品列表，当选择了窗口时显示 -->
    <template v-if="windowFilter">
      <div class="top-actions">
        <div class="left">
          <el-button 
            v-if="showAddButton"
            type="primary" 
            @click="showAddDialog">
            <el-icon><Plus /></el-icon>新增菜品
          </el-button>
          <el-button 
            type="danger" 
            @click="batchDelete" 
            :disabled="!selectedDishes.length">
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
          <el-button 
            type="success" 
            @click="exportDishes">
            <el-icon><Download /></el-icon>导出菜品
          </el-button>
        </div>
        <div class="right">
          <el-input
            v-model="searchQuery"
            placeholder="搜索菜品"
            clearable
            class="search-input">
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select 
            v-model="categoryFilter" 
            placeholder="菜品类别" 
            clearable 
            class="filter-item">
            <el-option
              v-for="category in categories"
              :key="category"
              :label="category"
              :value="category">
            </el-option>
          </el-select>
          <el-button 
            type="info" 
            plain
            @click="resetFilters">
            <el-icon><RefreshRight /></el-icon>重置筛选
          </el-button>
        </div>
      </div>
      <div class="statistics-cards" v-if="windowFilter">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card class="statistics-card">
              <template #header>
                <div class="card-header">
                  <span>总菜品数</span>
                </div>
              </template>
              <div class="statistics-value">
                <span class="number">{{ totalDishes }}</span>
                <span class="label">个</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="statistics-card">
              <template #header>
                <div class="card-header">
                  <span>已上架菜品</span>
                </div>
              </template>
              <div class="statistics-value">
                <span class="number">{{ activeDishes }}</span>
                <span class="label">个</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="statistics-card">
              <template #header>
                <div class="card-header">
                  <span>平均价格</span>
                </div>
              </template>
              <div class="statistics-value">
                <span class="number">¥{{ averagePrice }}</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="statistics-card">
              <template #header>
                <div class="card-header">
                  <span>类别数量</span>
                </div>
              </template>
              <div class="statistics-value">
                <span class="number">{{ categoryCount }}</span>
                <span class="label">个</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <el-card class="dish-list">
        <el-table
          :data="paginatedDishes"
          @selection-change="handleSelectionChange"
          style="width: 100%"
          :header-cell-style="{ background: '#f5f7fa' }">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="菜品名称">
            <template #default="{ row }">
              <div class="dish-info">
                <el-image 
                  :src="row.image_url" 
                  :preview-src-list="[row.image_url]"
                  class="dish-image">
                  <template #error>
                    <div class="image-placeholder">
                      <el-icon><Picture /></el-icon>
                    </div>
                  </template>
                </el-image>
                <span>{{ row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="category" label="类别" width="120">
            <template #default="{ row }">
              <el-tag :type="getCategoryType(row.category)" size="small">
                {{ row.category }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格" width="120">
            <template #default="{ row }">
              <span class="price">¥{{ row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-switch
                v-model="row.status"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange(row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250" fixed="right">
            <template #default="{ row }">
              <template v-if="hasPermission(row.window_id)">
                <el-button type="primary" link @click="editDish(row)">
                  编辑
                </el-button>
                <el-button type="danger" link @click="deleteDish(row)">
                  删除
                </el-button>
              </template>
              <template v-else>
                <el-button type="info" link @click="viewDish(row)">
                  查看
                </el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="total"
            layout="total, sizes, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange">
          </el-pagination>
        </div>
      </el-card>
    </template>
  </div>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Plus, 
  Search, 
  Picture, 
  Upload,
  Bowl,
  Shop,
  Back,
  Delete,
  Download,
  RefreshRight
} from '@element-plus/icons-vue'
import request from '../../utils/request'
import { useRouter, useRoute } from 'vue-router'
import { checkPermission, isSuperAdmin } from '@/utils/permission'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

export default {
  name: 'DishManagement',
  components: {
    Plus,
    Search,
    Picture,
    Upload,
    Bowl,
    Shop,
    Back,
    Delete,
    Download,
    RefreshRight
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    
    // 获取用户验证信息
    const userVerification = computed(() => {
      const verifiedInfo = localStorage.getItem('verifiedInfo')
      return verifiedInfo ? JSON.parse(verifiedInfo) : null
    })

    // 判断是否有权限操作
    const hasPermission = (windowId) => {
      return checkPermission() === true || checkPermission() === windowId
    }

    // 修改顶部操作按钮的显示逻辑
    const showAddButton = computed(() => {
      return userVerification.value !== null
    })

    // 修改表单相关方法
    const showAddDialog = () => {
      if (!userVerification.value) {
        ElMessage.warning('请先完成身份验证')
        return
      }
      dialogType.value = 'add'
      Object.assign(dishForm, {
        name: '',
        category: '',
        price: 0,
        window_id: userVerification.value.window.id, // 默认设置为用户的窗口
        image_url: '',
        description: '',
        status: 1
      })
      dialogVisible.value = true
    }

    // 修改窗口选择器
    const availableWindows = computed(() => {
      if (!userVerification.value) return windows.value
      return windows.value.filter(w => w.id === userVerification.value.window.id)
    })

    // 模拟数据
    const mockCanteens = [
      { id: 1, name: '中央食堂' },
      { id: 2, name: '沁园餐厅' },
      { id: 3, name: '馨园餐厅' },
      { id: 4, name: '荷园餐厅' },
      { id: 5, name: '竹园餐厅' },
      { id: 6, name: '梅园餐厅' },
      { id: 7, name: '兰园餐厅' }
    ]

    const mockWindows = [
      // 中央食堂窗口
      { id: 101, name: '特色炒菜', canteen: '中央食堂', location: '一楼' },
      { id: 102, name: '面食窗口', canteen: '中央食堂', location: '一楼' },
      { id: 103, name: '快餐窗口', canteen: '中央食堂', location: '二楼' },
      // 沁园餐厅窗口
      { id: 201, name: '川湘菜', canteen: '沁园餐厅', location: '一楼' },
      { id: 202, name: '粤式炒菜', canteen: '沁园餐厅', location: '一楼' },
      { id: 203, name: '东北菜', canteen: '沁园餐厅', location: '二楼' },
      // 馨园餐厅窗口
      { id: 301, name: '清真窗口', canteen: '馨园餐厅', location: '一楼' },
      { id: 302, name: '江浙菜', canteen: '馨园餐厅', location: '一楼' },
      { id: 303, name: '火锅窗口', canteen: '馨园餐厅', location: '二楼' },
      // 荷园餐厅窗口
      { id: 401, name: '湘菜窗口', canteen: '荷园餐厅', location: '一楼' },
      { id: 402, name: '面点窗口', canteen: '荷园餐厅', location: '一楼' },
      { id: 403, name: '盖浇饭', canteen: '荷园餐厅', location: '二楼' },
      // 竹园餐厅窗口
      { id: 501, name: '日式料理', canteen: '竹园餐厅', location: '一楼' },
      { id: 502, name: '韩式料理', canteen: '竹园餐厅', location: '一楼' },
      { id: 503, name: '西式快餐', canteen: '竹园餐厅', location: '二楼' },
      // 梅园餐厅窗口
      { id: 601, name: '粥品窗口', canteen: '梅园餐厅', location: '一楼' },
      { id: 602, name: '小炒窗口', canteen: '梅园餐厅', location: '一楼' },
      { id: 603, name: '蒸菜窗口', canteen: '梅园餐厅', location: '二楼' },
      // 兰园餐厅窗口
      { id: 701, name: '早餐窗口', canteen: '兰园餐厅', location: '一楼' },
      { id: 702, name: '米线窗口', canteen: '兰园餐厅', location: '一楼' },
      { id: 703, name: '饺子馄饨', canteen: '兰园餐厅', location: '二楼' }
    ]

    const dishesData = ref([
      // 中央食堂 - 特色炒菜窗口
      { id: 1, name: '宫保鸡丁', category: '特色炒菜', price: 15.00, window: '特色炒菜', window_id: 101, status: 1, image_url: 'https://example.com/dishes/1.jpg', description: '经典川菜' },
      { id: 2, name: '鱼香肉丝', category: '特色炒菜', price: 14.00, window: '特色炒菜', window_id: 101, status: 1, image_url: 'https://example.com/dishes/2.jpg', description: '开胃下饭' },
      { id: 3, name: '麻婆豆腐', category: '特色炒菜', price: 12.00, window: '特色炒菜', window_id: 101, status: 1, image_url: 'https://example.com/dishes/3.jpg', description: '川味足' },
      
      // 沁园餐厅 - 川湘菜窗口
      { id: 4, name: '水煮鱼', category: '川菜', price: 28.00, window: '川湘菜', window_id: 201, status: 1, image_url: 'https://example.com/dishes/4.jpg', description: '麻辣鲜香' },
      { id: 5, name: '剁椒鱼头', category: '湘菜', price: 32.00, window: '川湘菜', window_id: 201, status: 1, image_url: 'https://example.com/dishes/5.jpg', description: '湘味十足' },
      
      // 馨园餐厅 - 清真窗口
      { id: 6, name: '清真牛肉面', category: '面食', price: 16.00, window: '清真窗口', window_id: 301, status: 1, image_url: 'https://example.com/dishes/6.jpg', description: '汤鲜肉嫩' },
      { id: 7, name: '羊肉泡馍', category: '主食', price: 18.00, window: '清真窗口', window_id: 301, status: 1, image_url: 'https://example.com/dishes/7.jpg', description: '传统美味' },
      
      // 荷园餐厅 - 湘菜窗口
      { id: 8, name: '农家小炒肉', category: '湘菜', price: 16.00, window: '湘菜窗口', window_id: 401, status: 1, image_url: 'https://example.com/dishes/8.jpg', description: '农家风味' },
      { id: 9, name: '外婆菜', category: '素菜', price: 8.00, window: '湘菜窗口', window_id: 401, status: 1, image_url: 'https://example.com/dishes/9.jpg', description: '开胃爽口' },
      
      // 竹园餐厅 - 日式料理
      { id: 10, name: '寿司拼盘', category: '日料', price: 22.00, window: '日式料理', window_id: 501, status: 1, image_url: 'https://example.com/dishes/10.jpg', description: '精致美味' },
      { id: 11, name: '天妇罗', category: '日料', price: 18.00, window: '日式料理', window_id: 501, status: 1, image_url: 'https://example.com/dishes/11.jpg', description: '外酥内嫩' },
      
      // 梅园餐厅 - 粥品窗口
      { id: 12, name: '皮蛋瘦肉粥', category: '粥品', price: 8.00, window: '粥品窗口', window_id: 601, status: 1, image_url: 'https://example.com/dishes/12.jpg', description: '暖胃养生' },
      { id: 13, name: '海鲜粥', category: '粥品', price: 12.00, window: '粥品窗口', window_id: 601, status: 1, image_url: 'https://example.com/dishes/13.jpg', description: '鲜美可口' },
      
      // 兰园餐厅 - 早餐窗口
      { id: 14, name: '豆浆油条', category: '早餐', price: 5.00, window: '早餐窗口', window_id: 701, status: 1, image_url: 'https://example.com/dishes/14.jpg', description: '传统早点' },
      { id: 15, name: '肉包子', category: '早餐', price: 2.50, window: '早餐窗口', window_id: 701, status: 1, image_url: 'https://example.com/dishes/15.jpg', description: '现蒸现卖' }
    ])

    // 响应式状态
    const searchQuery = ref('')
    const categoryFilter = ref('')
    const windowFilter = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const loading = ref(false)
    const dialogVisible = ref(false)
    const dialogType = ref('add')

    // 表单相关
    const dishForm = reactive({
      name: '',
      category: '',
      price: 0,
      window_id: '',
      image_url: '',
      description: '',
      status: 1
    })

    const rules = {
      name: [
        { required: true, message: '请输入菜品名称', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
      ],
      category: [
        { required: true, message: '请选择菜品类别', trigger: 'change' }
      ],
      price: [
        { required: true, message: '请输入价格', trigger: 'blur' }
      ],
      window_id: [
        { required: true, message: '请选择所属窗口', trigger: 'change' }
      ]
    }

    // 计算属性
    const categories = [
      '主食', '大荤', '小荤', '素菜', 
      '汤品', '特色炒菜', '面食',
      '饮品', '水果', '小吃'
    ]

    const canteens = ref(mockCanteens)
    const windows = ref(mockWindows)
   

    // 获取路由参数
    const routeCanteenId = computed(() => route.query.canteenId)
    const routeWindowId = computed(() => route.query.windowId)

    // 改 filteredDishes 计算属性
    const filteredDishes = computed(() => {
      return dishesData.value.filter(dish => {
        const nameMatch = dish.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        const categoryMatch = !categoryFilter.value || dish.category === categoryFilter.value
        const windowMatch = !windowFilter.value || dish.window_id === windowFilter.value
        
        // 如果有路由参数，优先使用路由参数进行过滤
        if (routeWindowId.value) {
          return nameMatch && categoryMatch && dish.window_id === parseInt(routeWindowId.value)
        }
        
        if (routeCanteenId.value) {
          const windowsInCanteen = windows.value
            .filter(w => w.canteen === canteens.value.find(c => c.id === parseInt(routeCanteenId.value))?.name)
            .map(w => w.id)
          return nameMatch && categoryMatch && windowsInCanteen.includes(dish.window_id)
        }
        
        // 超级管理员可以看到所有窗口的菜品
        if (isSuperAdmin()) {
          return nameMatch && categoryMatch && windowMatch
        }
        
        // 普通管理员只能看到自己窗口的菜品
        return nameMatch && categoryMatch && checkPermission() === dish.window_id
      })
    })

    // 添加面包屑导航组件
    const breadcrumbItems = computed(() => {
      const items = [{ text: '菜品管理', link: '/admin/dishes' }]
      
      if (routeCanteenId.value) {
        const canteen = canteens.value.find(c => c.id === parseInt(routeCanteenId.value))
        if (canteen) {
          items.push({ text: canteen.name, link: `/admin/dishes?canteenId=${canteen.id}` })
        }
      }
      
      if (routeWindowId.value) {
        const window = windows.value.find(w => w.id === parseInt(routeWindowId.value))
        if (window) {
          items.push({ text: window.name })
        }
      }
      
      return items
    })

    // 方法
    const viewDish = (dish) => {
      // 查看菜品详情
      dialogType.value = 'view'
      Object.assign(dishForm, dish)
      dialogVisible.value = true
    }

    const editDish = (dish) => {
      dialogType.value = 'edit'
      Object.assign(dishForm, dish)
      dialogVisible.value = true
    }

    const saveDish = async () => {
      loading.value = true
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (dialogType.value === 'add') {
          const newDish = {
            id: dishesData.value.length + 1,
            ...dishForm,
            window: windows.value.find(w => w.id === dishForm.window_id)?.name
          }
          dishesData.value.push(newDish)
          ElMessage.success('添加成功')
        } else {
          const index = dishesData.value.findIndex(d => d.id === dishForm.id)
          if (index > -1) {
            dishesData.value[index] = {
              ...dishesData.value[index],
              ...dishForm,
              window: windows.value.find(w => w.id === dishForm.window_id)?.name
            }
          }
          ElMessage.success('更新成功')
        }
        dialogVisible.value = false
      } catch (error) {
        ElMessage.error('操作失败')
      } finally {
        loading.value = false
      }
    }

    const deleteDish = async (dish) => {
      try {
        await ElMessageBox.confirm(
          `确定要删除 ${dish.name} 吗？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500))
        const index = dishesData.value.findIndex(d => d.id === dish.id)
        if (index > -1) {
          dishesData.value.splice(index, 1)
        }
        ElMessage.success('删除成功')
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除失败')
        }
      }
    }

    const handleStatusChange = async (dish) => {
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 300))
        ElMessage.success(`${dish.name} 状态已更新`)
      } catch (error) {
        ElMessage.error('状态更新失败')
        dish.status = dish.status === 1 ? 0 : 1 // 回滚状态
      }
    }

    const getCategoryType = (category) => {
      const types = {
        '主食': 'info',
        '大荤': 'danger',
        '小荤': 'warning',
        '素菜': 'success',
        '汤品': 'info',
        '特色炒菜': 'primary',
        '面食': 'info',
        '饮品': 'info',
        '水果': 'success',
        '小吃': 'warning'
      }
      return types[category] || 'info'
    }

    // 分页方法
    const handleSizeChange = (val) => {
      pageSize.value = val
      currentPage.value = 1
      const maxPage = Math.ceil(total.value / pageSize.value)
      if (currentPage.value > maxPage) {
        currentPage.value = maxPage || 1
      }
    }

    const handleCurrentChange = (val) => {
      currentPage.value = val
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    // 上传相关
    const uploadUrl = 'https://api.example.com/upload'
    const handleUploadSuccess = (response) => {
      dishForm.image_url = response.url
      ElMessage.success('图片上传成功')
    }

    const beforeUpload = (file) => {
      const isImage = /^image\//.test(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        ElMessage.error('只能上传图片文件!')
      }
      if (!isLt2M) {
        ElMessage.error('图片大小不能超过 2MB!')
      }
      return isImage && isLt2M
    }

    const selectedCanteen = ref(routeCanteenId.value || '')

    // 根据选中的餐厅过滤窗口列表
    const filteredWindows = computed(() => {
      if (!selectedCanteen.value) return []
      const canteen = canteens.value.find(c => c.id === selectedCanteen.value)
      return windows.value.filter(w => w.canteen === canteen?.name)
    })

    // 处理餐厅选择变化
    const handleCanteenChange = (value) => {
      windowFilter.value = ''
      if (value) {
        router.push({ 
          query: { 
            ...route.query,
            canteenId: value,
            windowId: undefined 
          }
        })
      } else {
        router.push({ 
          query: { 
            ...route.query,
            canteenId: undefined,
            windowId: undefined 
          }
        })
      }
    }

    // 监听窗口选择变化
    watch(windowFilter, (value) => {
      if (value) {
        router.push({ 
          query: { 
            ...route.query,
            windowId: value 
          }
        })
      } else {
        router.push({ 
          query: { 
            ...route.query,
            windowId: undefined 
          }
        })
      }
    })

    // 添加分页后的数据计算属性
    const paginatedDishes = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return filteredDishes.value.slice(start, end)
    })

    // 计算总数
    const total = computed(() => filteredDishes.value.length)

    // 监听筛选条件变化
    watch([searchQuery, categoryFilter, windowFilter], () => {
      currentPage.value = 1  // 重置到第一页
    })

    // 添加新的���算属性和方法
    const selectedCanteenName = computed(() => {
      const canteen = canteens.value.find(c => c.id === selectedCanteen.value)
      return canteen?.name
    })

    const currentWindows = computed(() => {
      if (!selectedCanteen.value) return []
      return windows.value.filter(w => {
        const canteen = canteens.value.find(c => c.id === selectedCanteen.value)
        return w.canteen === canteen?.name
      })
    })

    const getWindowCount = (canteenId) => {
      const canteen = canteens.value.find(c => c.id === canteenId)
      return windows.value.filter(w => w.canteen === canteen?.name).length
    }

    const getDishCount = (windowId) => {
      return dishesData.value.filter(d => d.window_id === windowId).length
    }

    const selectCanteen = (canteen) => {
      selectedCanteen.value = canteen.id
      windowFilter.value = ''
    }

    const selectWindow = (window) => {
      windowFilter.value = window.id
    }

    const backToCanteens = () => {
      selectedCanteen.value = ''
      windowFilter.value = ''
    }

    const selectedDishes = ref([])

    // 处理表格多选
    const handleSelectionChange = (selection) => {
      selectedDishes.value = selection
    }

    // 批量删除
    const batchDelete = async () => {
      if (!selectedDishes.value.length) return
      
      try {
        await ElMessageBox.confirm(
          `确定要删除选中的 ${selectedDishes.value.length} 个菜品吗？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        selectedDishes.value.forEach(dish => {
          const index = dishesData.value.findIndex(d => d.id === dish.id)
          if (index > -1) {
            dishesData.value.splice(index, 1)
          }
        })
        
        ElMessage.success('批量删除成功')
        selectedDishes.value = []
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('批量删除失败')
        }
      }
    }

    // 导出菜品数据
    const exportDishes = () => {
      const exportData = filteredDishes.value.map(dish => ({
        '菜品名称': dish.name,
        '类别': dish.category,
        '价格': dish.price,
        '描述': dish.description,
        '状态': dish.status === 1 ? '上架' : '下架',
        '所属窗口': windows.value.find(w => w.id === dish.window_id)?.name || ''
      }))
      
      const worksheet = XLSX.utils.json_to_sheet(exportData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, '菜品列表')
      
      // 生成二进制文件
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([wbout], { type: 'application/octet-stream' })
      
      // 下载文件
      saveAs(blob, `菜品列表_${new Date().toLocaleDateString()}.xlsx`)
      
      ElMessage.success('导出成功')
    }

    // 添加统计数据的计算属性
    const totalDishes = computed(() => filteredDishes.value.length)

    const activeDishes = computed(() => 
      filteredDishes.value.filter(dish => dish.status === 1).length
    )

    const averagePrice = computed(() => {
      if (!filteredDishes.value.length) return '0.00'
      const total = filteredDishes.value.reduce((sum, dish) => sum + dish.price, 0)
      return (total / filteredDishes.value.length).toFixed(2)
    })

    const categoryCount = computed(() => 
      new Set(filteredDishes.value.map(dish => dish.category)).size
    )

    // 添加重置筛选方法
    const resetFilters = () => {
      searchQuery.value = ''
      categoryFilter.value = ''
      currentPage.value = 1
      ElMessage.success('筛选条件已重置')
    }

    return {
      // 数据
      searchQuery,
      categoryFilter,
      windowFilter,
      currentPage,
      pageSize,
      total,
      loading,
      dialogVisible,
      dialogType,
      dishForm,
      rules,
      categories,
      canteens,
      windows,
      filteredDishes,
      uploadUrl,

      // 方法
      showAddDialog,
      editDish,
      saveDish,
      deleteDish,
      handleStatusChange,
      getCategoryType,
      handleSizeChange,
      handleCurrentChange,
      handleUploadSuccess,
      beforeUpload,
      hasPermission,
      showAddButton,
      availableWindows,
      userVerification,
      breadcrumbItems,
      selectedCanteen,
      filteredWindows,
      handleCanteenChange,
      paginatedDishes,
      selectedCanteenName,
      currentWindows,
      getWindowCount,
      getDishCount,
      selectCanteen,
      selectWindow,
      backToCanteens,
      selectedDishes,
      handleSelectionChange,
      batchDelete,
      exportDishes,
      totalDishes,
      activeDishes,
      averagePrice,
      categoryCount,
      resetFilters
    }
  }
}
</script>

<style scoped>
.dish-management {
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

.right {
  display: flex;
  gap: 10px;
}

.search-input {
  width: 200px;
}

.filter-item {
  width: 160px;
}

.dish-list {
  margin-top: 20px;
}

.dish-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dish-image {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  object-fit: cover;
}

.image-placeholder {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border-radius: 4px;
}

.price {
  color: #f56c6c;
  font-weight: 500;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dish-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}

.dish-uploader:hover {
  border-color: #409eff;
}

.uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.uploaded-image {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}

.import-container {
  padding: 20px;
}

.upload-excel {
  width: 100%;
}

.template-download {
  margin-top: 15px;
  text-align: center;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .top-actions {
    flex-direction: column;
    gap: 10px;
  }

  .right {
    flex-direction: column;
  }

  .search-input,
  .filter-item {
    width: 100%;
  }
}

.breadcrumb-nav {
  margin-bottom: 20px;
  padding: 8px 0;
}

.canteen-cards {
  margin-bottom: 30px;
}

.canteen-card {
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
  padding: 20px;
}

.canteen-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

.canteen-icon {
  color: #409EFF;
  margin-bottom: 10px;
}

.canteen-info h3 {
  margin: 10px 0;
  font-size: 16px;
}

.canteen-info p {
  color: #909399;
  font-size: 14px;
  margin: 5px 0;
}

.window-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
}

.window-header h2 {
  margin: 0;
}

.window-cards {
  margin-bottom: 30px;
}

.window-card {
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 20px;
  padding: 20px;
}

.window-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

.window-icon {
  color: #67C23A;
  margin-bottom: 10px;
}

.window-info h3 {
  margin: 10px 0;
  font-size: 16px;
}

.window-info p {
  color: #909399;
  font-size: 14px;
  margin: 5px 0;
}

.window-info .location {
  color: #E6A23C;
}

/* 响应式布局调整 */
@media (max-width: 1200px) {
  .el-col {
    width: 33.33% !important;
  }
}

@media (max-width: 768px) {
  .el-col {
    width: 50% !important;
  }
}

@media (max-width: 480px) {
  .el-col {
    width: 100% !important;
  }
}

.statistics-cards {
  margin-bottom: 20px;
}

.statistics-card {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistics-value {
  text-align: center;
  padding: 10px 0;
}

.statistics-value .number {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.statistics-value .label {
  margin-left: 4px;
  font-size: 14px;
  color: #909399;
}
</style>
