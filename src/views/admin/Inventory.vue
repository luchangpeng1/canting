<template>
  <div class="inventory-container">
    <el-card class="inventory-header">
      <template #header>
        <div class="header-content">
          <div class="left">
            <h3>库存管理</h3>
          </div>
          <div class="right">
            <el-button type="primary" @click="handleAdd">
              <el-icon><Plus /></el-icon>添加物料
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
      
      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="物料名称">
          <el-input v-model="searchForm.name" placeholder="请输入物料名称" />
        </el-form-item>
        <el-form-item label="物料类型">
          <el-select v-model="searchForm.type" placeholder="请选择物料类型">
            <el-option label="蔬菜" value="vegetable" />
            <el-option label="肉类" value="meat" />
            <el-option label="调味料" value="seasoning" />
            <el-option label="主食" value="staple" />
          </el-select>
        </el-form-item>
        <el-form-item label="库存状态">
          <el-select v-model="searchForm.status" placeholder="请选择库存状态">
            <el-option label="充足" value="sufficient" />
            <el-option label="正常" value="normal" />
            <el-option label="预警" value="warning" />
            <el-option label="不足" value="insufficient" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 库存列表 -->
    <el-card class="inventory-table">
      <el-table :data="inventoryList" stripe style="width: 100%">
        <el-table-column prop="name" label="物料名称" />
        <el-table-column prop="type" label="物料类型">
          <template #default="{ row }">
            <el-tag>{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="当前库存" />
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="threshold" label="预警阈值" width="100" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.stock, row.threshold)">
              {{ getStatusText(row.stock, row.threshold) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="最后更新时间" width="160" />
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="success" link @click="handleRestock(row)">
              补货
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus, Upload, Download } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索表单
const searchForm = ref({
  name: '',
  type: '',
  status: ''
})

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 库存列表数据
const inventoryList = ref([
  {
    id: 1,
    name: '土豆',
    type: '蔬菜',
    stock: 50,
    unit: '斤',
    threshold: 100,
    updateTime: '2024-03-20 10:30:00'
  },
  {
    id: 2,
    name: '猪肉',
    type: '肉类',
    stock: 30,
    unit: '斤',
    threshold: 50,
    updateTime: '2024-03-20 09:15:00'
  },
  // 更多数据...
])

// 获取状态类型
const getStatusType = (stock, threshold) => {
  if (stock <= threshold * 0.3) return 'danger'
  if (stock <= threshold * 0.7) return 'warning'
  return 'success'
}

// 获取状态文本
const getStatusText = (stock, threshold) => {
  if (stock <= threshold * 0.3) return '不足'
  if (stock <= threshold * 0.7) return '预警'
  return '充足'
}

// 处理搜索
const handleSearch = () => {
  // 实现搜索逻辑
  console.log('搜索条件：', searchForm.value)
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    name: '',
    type: '',
    status: ''
  }
}

// 处理添加
const handleAdd = () => {
  // 实现添加逻辑
}

// 处理导入
const handleImport = () => {
  // 实现导入逻辑
}

// 处理导出
const handleExport = () => {
  // 实现导出逻辑
}

// 处理编辑
const handleEdit = (row) => {
  // 实现编辑逻辑
  console.log('编辑：', row)
}

// 处理补货
const handleRestock = (row) => {
  // 实现补货逻辑
  console.log('补货：', row)
}

// 处理删除
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除 ${row.name} 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      // 实现删除逻辑
      ElMessage.success('删除成功')
    })
    .catch(() => {
      // 取消删除
    })
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
.inventory-container {
  padding: 20px;
}

.inventory-header {
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

.inventory-table {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}


</style> 