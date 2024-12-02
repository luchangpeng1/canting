<template>
  <div class="dish-management">
    <!-- 顶部操作栏 -->
    <div class="top-actions">
      <div class="left">
        <el-button 
          v-if="showAddButton"
          type="primary" 
          @click="showAddDialog">
          <el-icon><Plus /></el-icon>新增菜品
        </el-button>
        <el-button 
          v-if="showAddButton"
          type="success" 
          plain 
          @click="showBatchImport">
          <el-icon><Upload /></el-icon>批量导入
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
        <el-select 
          v-model="windowFilter" 
          placeholder="所属窗口" 
          clearable 
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
            </el-option>
          </el-option-group>
        </el-select>
      </div>
    </div>

    <!-- 菜品列表 -->
    <el-card class="dish-list">
      <el-table
        :data="filteredDishes"
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
        <el-table-column prop="window" label="所属窗口" width="180">
          <template #default="{ row }">
            <el-tag size="small" type="info" effect="plain">{{ row.window }}</el-tag>
          </template>
        </el-table-column>
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
              <el-button type="success" link @click="addToMenu(row)">
                添加到菜单
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

    <!-- 新增/编辑菜品对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '新增菜品' : dialogType === 'edit' ? '编辑菜品' : '查看菜品'"
      v-model="dialogVisible"
      width="50%">
      <el-form 
        ref="dishForm"
        :model="dishForm"
        :rules="rules"
        :disabled="dialogType === 'view'"
        label-width="100px">
        <el-form-item label="菜品名称" prop="name">
          <el-input v-model="dishForm.name" placeholder="请输入菜品名称"></el-input>
        </el-form-item>
        <el-form-item label="菜品图片" prop="image">
          <el-upload
            class="dish-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload">
            <img v-if="dishForm.image_url" :src="dishForm.image_url" class="uploaded-image">
            <el-icon v-else class="uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="菜品类别" prop="category">
          <el-select v-model="dishForm.category" placeholder="请选择类别">
            <el-option
              v-for="category in categories"
              :key="category"
              :label="category"
              :value="category">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number 
            v-model="dishForm.price"
            :precision="2"
            :step="0.1"
            :min="0">
          </el-input-number>
        </el-form-item>
        <el-form-item label="所属窗口" prop="window_id">
          <el-select 
            v-model="dishForm.window_id" 
            placeholder="请选择窗口"
            :disabled="dialogType === 'edit' || userVerification">
            <el-option
              v-for="window in availableWindows"
              :key="window.id"
              :label="window.name"
              :value="window.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="dishForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入菜品描述">
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveDish" :loading="loading">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 批量导入对话框 -->
    <el-dialog
      title="批量导入菜品"
      v-model="importDialogVisible"
      width="40%">
      <div class="import-container">
        <el-upload
          class="upload-excel"
          drag
          :action="importUrl"
          :on-success="handleImportSuccess"
          :before-upload="beforeImportUpload"
          accept=".xlsx, .xls">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              请上传 Excel 文件，且文件大小不超过 5MB
            </div>
          </template>
        </el-upload>
        <div class="template-download">
          <el-button type="primary" link @click="downloadTemplate">
            下载导入模板
          </el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 添加到菜单弹窗 -->
    <el-dialog
      title="添加到菜单"
      v-model="addToMenuVisible"
      width="500px">
      <el-form :model="menuForm" label-width="100px">
        <el-form-item label="选择日期">
          <el-date-picker
            v-model="menuForm.date"
            type="date"
            placeholder="选择日期"
            :disabled-date="disabledDate">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="选择窗口">
          <el-select v-model="menuForm.windowId" placeholder="请选择窗口">
            <el-option
              v-for="window in windows"
              :key="window.id"
              :label="window.name"
              :value="window.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="初始库存">
          <el-input-number 
            v-model="menuForm.stock"
            :min="0"
            :max="999">
          </el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addToMenuVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddToMenu">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Plus, 
  Search, 
  Picture, 
  Upload,
  UploadFilled
} from '@element-plus/icons-vue'
import request from '../../utils/request'
import { useRouter } from 'vue-router'

export default {
  name: 'DishManagement',
  components: {
    Plus,
    Search,
    Picture,
    Upload,
    UploadFilled
  },
  setup() {
    const router = useRouter()
    
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
      { id: 3, name: '馨园餐厅' }
    ]

    const mockWindows = [
      { id: 101, name: '大荤窗口', canteen: '中央食堂', location: '一楼' },
      { id: 102, name: '特色炒菜', canteen: '中央食堂', location: '一楼' },
      { id: 201, name: '面食窗口', canteen: '沁园餐厅', location: '二楼' },
      { id: 301, name: '快餐窗口', canteen: '馨园餐厅', location: '一楼' }
    ]

    const mockDishes = [
      {
        id: 1,
        name: '红烧肉',
        category: '大荤',
        price: 15.00,
        window: '大荤窗口',
        window_id: 101,
        status: 1,
        image_url: 'https://example.com/dishes/hongshaorou.jpg',
        description: '经典红烧肉，肥而不腻'
      },
      {
        id: 2,
        name: '清炒时蔬',
        category: '素菜',
        price: 8.00,
        window: '特色炒菜',
        window_id: 102,
        status: 1,
        image_url: 'https://example.com/dishes/qingcao.jpg',
        description: '新鲜时令蔬菜'
      },
      {
        id: 3,
        name: '牛肉面',
        category: '面食',
        price: 16.00,
        window: '面食窗口',
        window_id: 201,
        status: 0,
        image_url: 'https://example.com/dishes/noodles.jpg',
        description: '清汤牛肉面'
      }
    ]

    // 响应式状态
    const searchQuery = ref('')
    const categoryFilter = ref('')
    const windowFilter = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(mockDishes.length)
    const loading = ref(false)
    const dialogVisible = ref(false)
    const importDialogVisible = ref(false)
    const dialogType = ref('add')
    const addToMenuVisible = ref(false)

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

    const menuForm = reactive({
      date: '',
      windowId: '',
      stock: 0
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
    const dishes = ref(mockDishes)

    const filteredDishes = computed(() => {
      return dishes.value.filter(dish => {
        const nameMatch = dish.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        const categoryMatch = !categoryFilter.value || dish.category === categoryFilter.value
        const windowMatch = !windowFilter.value || dish.window_id === windowFilter.value
        return nameMatch && categoryMatch && windowMatch
      })
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
            id: dishes.value.length + 1,
            ...dishForm,
            window: windows.value.find(w => w.id === dishForm.window_id)?.name
          }
          dishes.value.push(newDish)
          ElMessage.success('添加成功')
        } else {
          const index = dishes.value.findIndex(d => d.id === dishForm.id)
          if (index > -1) {
            dishes.value[index] = {
              ...dishes.value[index],
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
        const index = dishes.value.findIndex(d => d.id === dish.id)
        if (index > -1) {
          dishes.value.splice(index, 1)
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

    const showBatchImport = () => {
      importDialogVisible.value = true
    }

    const handleImportSuccess = (response) => {
      ElMessage.success('导入成功')
      importDialogVisible.value = false
    }

    const beforeImportUpload = (file) => {
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                     file.type === 'application/vnd.ms-excel'
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!isExcel) {
        ElMessage.error('只能上传 Excel 文件!')
      }
      if (!isLt5M) {
        ElMessage.error('文件大小不能超过 5MB!')
      }
      return isExcel && isLt5M
    }

    const downloadTemplate = () => {
      // 模拟下载模板
      ElMessage.success('模板下载中...')
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
    }

    const handleCurrentChange = (val) => {
      currentPage.value = val
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

    const addToMenu = (dish) => {
      addToMenuVisible.value = true
      Object.assign(menuForm, {
        date: '',
        windowId: dish.window_id,
        stock: 0
      })
    }

    const confirmAddToMenu = async () => {
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        const index = dishes.value.findIndex(d => d.id === menuForm.windowId)
        if (index > -1) {
          dishes.value[index].stock = menuForm.stock
        }
        ElMessage.success('添加成功')
        addToMenuVisible.value = false
      } catch (error) {
        ElMessage.error('添加失败')
      }
    }

    const disabledDate = (date) => {
      return date.getTime() < Date.now()
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
      importDialogVisible,
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
      showBatchImport,
      handleImportSuccess,
      beforeImportUpload,
      downloadTemplate,
      getCategoryType,
      handleSizeChange,
      handleCurrentChange,
      handleUploadSuccess,
      beforeUpload,
      addToMenu,
      addToMenuVisible,
      menuForm,
      disabledDate,
      hasPermission,
      showAddButton,
      availableWindows,
      userVerification
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
</style>
