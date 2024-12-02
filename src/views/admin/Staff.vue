<template>
  <div class="staff-container">
    <!-- 搜索和操作栏 -->
    <el-card class="filter-card">
      <template #header>
        <div class="header-content">
          <div class="left">
            <h3>员工管理</h3>
          </div>
          <div class="right">
            <el-button type="primary" @click="handleAdd">
              <el-icon><Plus /></el-icon>添加员工
            </el-button>
            <el-button type="success" @click="handleImport">
              <el-icon><Upload /></el-icon>批量导入
            </el-button>
            <el-button @click="handleExport">
              <el-icon><Download /></el-icon>导出数据
            </el-button>
          </div>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="员工姓名">
          <el-input v-model="searchForm.name" placeholder="请输入员工姓名" />
        </el-form-item>
        <el-form-item label="所属窗口">
          <el-select v-model="searchForm.window" placeholder="请选择窗口">
            <el-option label="全部窗口" value="" />
            <el-option
              v-for="window in windows"
              :key="window.value"
              :label="window.label"
              :value="window.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="工作状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="全部状态" value="" />
            <el-option label="在职" value="active" />
            <el-option label="休假" value="vacation" />
            <el-option label="离职" value="resigned" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 员工列表 -->
    <el-card class="staff-table">
      <el-table :data="staffList" stripe style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="工号" width="100" />
        <el-table-column label="员工信息">
          <template #default="{ row }">
            <div class="staff-info">
              <el-avatar :size="32" :src="row.avatar" />
              <div class="info-detail">
                <div class="name">{{ row.name }}</div>
                <div class="contact">{{ row.phone }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="window" label="所属窗口" />
        <el-table-column prop="position" label="职位" width="120" />
        <el-table-column prop="joinDate" label="入职日期" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="success" link @click="handleSchedule(row)">
              排班
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑员工对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '添加员工' : '编辑员工'"
      v-model="dialogVisible"
      width="600px"
    >
      <el-form :model="staffForm" label-width="100px">
        <el-form-item label="员工姓名">
          <el-input v-model="staffForm.name" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="staffForm.phone" />
        </el-form-item>
        <el-form-item label="所属窗口">
          <el-select v-model="staffForm.window" style="width: 100%">
            <el-option
              v-for="window in windows"
              :key="window.value"
              :label="window.label"
              :value="window.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="职位">
          <el-select v-model="staffForm.position" style="width: 100%">
            <el-option label="窗口经理" value="manager" />
            <el-option label="厨师" value="chef" />
            <el-option label="服务员" value="waiter" />
            <el-option label="收银员" value="cashier" />
          </el-select>
        </el-form-item>
        <el-form-item label="入职日期">
          <el-date-picker
            v-model="staffForm.joinDate"
            type="date"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="工作状态">
          <el-select v-model="staffForm.status" style="width: 100%">
            <el-option label="在职" value="active" />
            <el-option label="休假" value="vacation" />
            <el-option label="离职" value="resigned" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus, Upload, Download } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索表单
const searchForm = ref({
  name: '',
  window: '',
  status: ''
})

// 窗口选项
const windows = [
  { label: '1号窗口', value: 'window1' },
  { label: '2号窗口', value: 'window2' },
  { label: '3号窗口', value: 'window3' }
]

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 员工列表数据
const staffList = ref([
  {
    id: 'EMP001',
    name: '张三',
    avatar: 'https://example.com/avatar1.jpg',
    phone: '13800138001',
    window: '1号窗口',
    position: '窗口经理',
    joinDate: '2024-01-01',
    status: '在职'
  },
  {
    id: 'EMP002',
    name: '李四',
    avatar: 'https://example.com/avatar2.jpg',
    phone: '13800138002',
    window: '2号窗口',
    position: '厨师',
    joinDate: '2024-02-01',
    status: '休假'
  }
])

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const staffForm = ref({
  name: '',
  phone: '',
  window: '',
  position: '',
  joinDate: '',
  status: 'active'
})

// 获取状态对应的标签类型
const getStatusType = (status) => {
  const types = {
    '在职': 'success',
    '休假': 'warning',
    '离职': 'info'
  }
  return types[status] || 'info'
}

// 处理搜索
const handleSearch = () => {
  console.log('搜索条件：', searchForm.value)
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    name: '',
    window: '',
    status: ''
  }
}

// 处理添加
const handleAdd = () => {
  dialogType.value = 'add'
  staffForm.value = {
    name: '',
    phone: '',
    window: '',
    position: '',
    joinDate: '',
    status: 'active'
  }
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row) => {
  dialogType.value = 'edit'
  staffForm.value = { ...row }
  dialogVisible.value = true
}

// 处理排班
const handleSchedule = (row) => {
  console.log('排班：', row)
}

// 处理删除
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除员工 ${row.name} 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

// 处理保存
const handleSave = () => {
  console.log('保存员工信息：', staffForm.value)
  dialogVisible.value = false
  ElMessage.success(dialogType.value === 'add' ? '添加成功' : '修改成功')
}

// 处理导入
const handleImport = () => {
  console.log('导入员工数据')
}

// 处理导出
const handleExport = () => {
  console.log('导出员工数据')
}

// 处理分页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val
  // 重新加载数据
}

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  // 重新加载数据
}
</script>

<style scoped>
.staff-container {
  padding: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h3 {
  margin: 0;
}

.search-form {
  margin-top: 20px;
}

.staff-table {
  margin-bottom: 20px;
}

.staff-info {
  display: flex;
  align-items: center;
}

.info-detail {
  margin-left: 10px;
}

.name {
  font-weight: bold;
}

.contact {
  font-size: 12px;
  color: #909399;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 