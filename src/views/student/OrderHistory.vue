<template>
  <div class="order-history">
    <!-- 返回按钮 -->
    <div class="back-button">
      <el-button 
        @click="goBack" 
        class="custom-back-btn"
        link>
        <div class="back-content">
          <el-icon class="back-icon"><ArrowLeft /></el-icon>
          <span class="back-text">返回上一页</span>
        </div>
      </el-button>
    </div>

    <!-- 订单筛选 -->
    <div class="filter-section">
      <el-radio-group v-model="filterStatus" @change="handleFilterChange">
        <el-radio-button value="all">全部订单</el-radio-button>
        <el-radio-button value="pending">待处理</el-radio-button>
        <el-radio-button value="processing">处理中</el-radio-button>
        <el-radio-button value="completed">已完成</el-radio-button>
        <el-radio-button value="cancelled">已取消</el-radio-button>
      </el-radio-group>

      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="handleDateChange"
        :shortcuts="dateShortcuts"
        class="date-picker">
      </el-date-picker>
    </div>

    <!-- 订单列表 -->
    <div class="orders-list" v-loading="loading">
      <el-empty v-if="!filteredOrders.length" description="暂无订单记录"></el-empty>
      
      <el-card v-for="order in filteredOrders" :key="order.id" class="order-card">
        <div class="order-header">
          <div class="order-info">
            <span class="order-number">订单号：{{ order.orderNumber }}</span>
            <span class="order-time">{{ order.createTime }}</span>
          </div>
          <el-tag :type="getStatusType(order.status)" class="status-tag">
            {{ getStatusLabel(order.status) }}
          </el-tag>
        </div>

        <div class="order-content">
          <div class="dish-list">
            <div v-for="dish in order.dishes" :key="dish.id" class="dish-item">
              <el-image 
                :src="dish.image_url" 
                :alt="dish.name"
                class="dish-image"
                @click="viewDishDetail(dish.id)">
                <template #error>
                  <div class="image-placeholder">暂无图片</div>
                </template>
              </el-image>
              <div class="dish-info">
                <h4 class="dish-name">{{ dish.name }}</h4>
                <p class="dish-price">
                  <span>¥{{ dish.price }}</span>
                  <span>×</span>
                  <span>{{ dish.quantity }}</span>
                </p>
              </div>
            </div>
          </div>

          <div class="order-footer">
            <div class="order-total">
              <span class="total-label">总计：</span>
              <span class="total-amount">¥{{ order.totalAmount }}</span>
            </div>
            
            <div class="order-actions">
              <el-button 
                v-if="order.status === 'completed'"
                type="primary" 
                link
                @click="writeReview(order)">
                写评价
              </el-button>
              <el-button 
                v-if="order.status === 'pending'"
                type="danger" 
                link
                @click="cancelOrder(order)">
                取消订单
              </el-button>
              <el-button 
                type="primary"
                link
                @click="viewOrderDetail(order)">
                查看详情
              </el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>

    <!-- 评价对话框 -->
    <el-dialog
      v-model="reviewDialogVisible"
      title="写评价"
      width="50%">
      <el-form :model="reviewForm" :rules="reviewRules" ref="reviewFormRef">
        <el-form-item label="评分" prop="rating">
          <el-rate
            v-model="reviewForm.rating"
            show-score>
          </el-rate>
        </el-form-item>
        <el-form-item label="评价内容" prop="content">
          <el-input
            type="textarea"
            v-model="reviewForm.content"
            :rows="4"
            placeholder="请分享您的用餐体验...">
          </el-input>
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-change="handleImageChange"
            :on-remove="handleImageRemove">
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReview">提交评价</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Plus } from '@element-plus/icons-vue'
import request from '@/utils/request'

export default {
  name: 'OrderHistory',
  components: {
    ArrowLeft,
    Plus
  },
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const filterStatus = ref('all')
    const dateRange = ref(null)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const orders = ref([])
    const reviewDialogVisible = ref(false)
    const reviewFormRef = ref(null)
    const currentOrder = ref(null)

    const reviewForm = ref({
      rating: 0,
      content: '',
      images: []
    })

    const reviewRules = {
      rating: [
        { required: true, message: '请给出评分', trigger: 'change' }
      ],
      content: [
        { required: true, message: '请填写评价内容', trigger: 'blur' },
        { min: 10, message: '评价内容至少10字', trigger: 'blur' }
      ]
    }

    // 日期快捷选项
    const dateShortcuts = [
      {
        text: '最近一周',
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          return [start, end]
        }
      },
      {
        text: '最近一个月',
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          return [start, end]
        }
      },
      {
        text: '最近三个月',
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          return [start, end]
        }
      }
    ]

    // 根据筛选条件过滤订单
    const filteredOrders = computed(() => {
      let result = [...orders.value]
      
      // 状态筛选
      if (filterStatus.value !== 'all') {
        result = result.filter(order => order.status === filterStatus.value)
      }
      
      // 日期筛选
      if (dateRange.value) {
        const [start, end] = dateRange.value
        result = result.filter(order => {
          const orderDate = new Date(order.createTime)
          return orderDate >= start && orderDate <= end
        })
      }
      
      return result
    })

    // 获取订单列表
    const fetchOrders = async () => {
      loading.value = true
      try {
        // 在实际开发中替换为真实的API调用
        // const response = await request.get('/student/orders', {
        //   params: {
        //     page: currentPage.value,
        //     pageSize: pageSize.value,
        //     status: filterStatus.value,
        //     startDate: dateRange.value?.[0],
        //     endDate: dateRange.value?.[1]
        //   }
        // })
        // orders.value = response.data.orders
        // total.value = response.data.total

        // 测试数据
        orders.value = [
          {
            id: 1,
            orderNumber: 'ORD202403150001',
            createTime: '2024-03-15 12:30:00',
            status: 'completed',
            totalAmount: 45.00,
            dishes: [
              {
                id: 1,
                name: '宫保鸡丁',
                price: 15.00,
                quantity: 2,
                image_url: 'https://example.com/dish1.jpg'
              },
              {
                id: 2,
                name: '麻婆豆腐',
                price: 15.00,
                quantity: 1,
                image_url: 'https://example.com/dish2.jpg'
              }
            ]
          },
          {
            id: 2,
            orderNumber: 'ORD202403150002',
            createTime: '2024-03-15 18:45:00',
            status: 'pending',
            totalAmount: 32.00,
            dishes: [
              {
                id: 3,
                name: '青椒肉丝',
                price: 16.00,
                quantity: 2,
                image_url: 'https://example.com/dish3.jpg'
              }
            ]
          }
        ]
        total.value = 2
      } catch (error) {
        console.error('获取订单列表失败:', error)
        ElMessage.error('获取订单列表失败')
      } finally {
        loading.value = false
      }
    }

    // 获取状态标签
    const getStatusLabel = (status) => {
      const statusMap = {
        'pending': '待处理',
        'processing': '处理中',
        'completed': '已完成',
        'cancelled': '已取消'
      }
      return statusMap[status] || status
    }

    // 获取状态标签类型
    const getStatusType = (status) => {
      const typeMap = {
        'pending': 'warning',
        'processing': 'primary',
        'completed': 'success',
        'cancelled': 'info'
      }
      return typeMap[status] || ''
    }

    // 处理筛选变化
    const handleFilterChange = () => {
      currentPage.value = 1
      fetchOrders()
    }

    // 处理日期变化
    const handleDateChange = () => {
      currentPage.value = 1
      fetchOrders()
    }

    // 处理页码变化
    const handleCurrentChange = (page) => {
      currentPage.value = page
      fetchOrders()
    }

    // 处理每页条数变化
    const handleSizeChange = (size) => {
      pageSize.value = size
      currentPage.value = 1
      fetchOrders()
    }

    // 查看订单详情
    const viewOrderDetail = (order) => {
      router.push(`/student/orders/${order.id}`)
    }

    // 查看菜品详情
    const viewDishDetail = (dishId) => {
      router.push(`/student/dishes/${dishId}`)
    }

    // 取消订单
    const cancelOrder = async (order) => {
      try {
        await ElMessageBox.confirm(
          '确定要取消这个订单吗？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )

        // 在实际开发中替换为真实的API调用
        // await request.post(`/student/orders/${order.id}/cancel`)
        
        ElMessage.success('订单已取消')
        fetchOrders()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('取消订单失败:', error)
          ElMessage.error('取消订单失败')
        }
      }
    }

    // 写评价
    const writeReview = (order) => {
      currentOrder.value = order
      reviewForm.value = {
        rating: 0,
        content: '',
        images: []
      }
      reviewDialogVisible.value = true
    }

    // 处理图片变化
    const handleImageChange = (file) => {
      reviewForm.value.images.push(file.raw)
    }

    // 处理图片移除
    const handleImageRemove = (file) => {
      const index = reviewForm.value.images.indexOf(file.raw)
      if (index > -1) {
        reviewForm.value.images.splice(index, 1)
      }
    }

    // 提交评价
    const submitReview = async () => {
      if (!reviewFormRef.value) return
      
      try {
        await reviewFormRef.value.validate()
        
        // 在实际开发中替换为真实的API调用
        // const formData = new FormData()
        // formData.append('orderId', currentOrder.value.id)
        // formData.append('rating', reviewForm.value.rating)
        // formData.append('content', reviewForm.value.content)
        // reviewForm.value.images.forEach(image => {
        //   formData.append('images[]', image)
        // })
        // await request.post('/student/reviews', formData)
        
        ElMessage.success('评价提交成功')
        reviewDialogVisible.value = false
        fetchOrders()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('提交评价失败:', error)
          ElMessage.error('提交评价失败')
        }
      }
    }

    // 返回上一页
    const goBack = () => {
      router.back()
    }

    onMounted(() => {
      fetchOrders()
    })

    return {
      loading,
      filterStatus,
      dateRange,
      dateShortcuts,
      currentPage,
      pageSize,
      total,
      filteredOrders,
      reviewDialogVisible,
      reviewForm,
      reviewFormRef,
      reviewRules,
      handleFilterChange,
      handleDateChange,
      handleCurrentChange,
      handleSizeChange,
      getStatusLabel,
      getStatusType,
      viewOrderDetail,
      viewDishDetail,
      cancelOrder,
      writeReview,
      handleImageChange,
      handleImageRemove,
      submitReview,
      goBack
    }
  }
}
</script>

<style scoped>
.order-history {
  padding: 8px 6px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.back-button {
  margin-bottom: 12px;
  padding: 0 6px;
}

.custom-back-btn {
  height: 32px;
  padding: 6px 0;
}

.back-content {
  font-size: 13px;
}

.back-icon {
  margin-right: 4px;
  font-size: 14px;
}

.filter-section {
  margin-bottom: 12px;
  gap: 8px;
  padding: 0 4px;
}

.filter-section :deep(.el-radio-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.filter-section :deep(.el-radio-button) {
  margin-right: 0;
}

.filter-section :deep(.el-radio-button__inner) {
  padding: 4px 8px;
  font-size: 12px;
  height: 28px;
  border-radius: 4px;
}

.date-picker {
  width: 100%;
  height: 32px;
}

.date-picker :deep(.el-input__inner) {
  font-size: 12px;
  height: 32px;
}

.orders-list {
  gap: 8px;
}

.order-card {
  border-radius: 6px;
  margin: 0;
}

.order-card:hover {
  transform: none;
}

.order-header {
  margin-bottom: 10px;
  padding-bottom: 10px;
}

.order-info {
  gap: 12px;
}

.order-number {
  font-size: 13px;
}

.order-time {
  font-size: 12px;
}

.status-tag {
  font-size: 12px;
  padding: 0 8px;
  height: 24px;
  line-height: 22px;
  border-radius: 12px;
}

.dish-list {
  gap: 8px;
}

.dish-item {
  display: flex;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  background: #f8f9fa;
  align-items: flex-start;
}

.dish-image {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  flex-shrink: 0;
  overflow: hidden;
}

.dish-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dish-name {
  margin: 0;
  font-size: 13px;
  color: #333;
  font-weight: normal;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dish-price {
  margin: 0;
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
}

.order-footer {
  margin-top: 10px;
  padding-top: 10px;
}

.total-label {
  font-size: 12px;
}

.total-amount {
  font-size: 16px;
  margin-left: 4px;
}

.order-actions {
  gap: 8px;
}

.order-actions :deep(.el-button) {
  font-size: 12px;
  padding: 4px 8px;
}

.pagination-container {
  margin-top: 16px;
  padding: 0 4px;
}

.pagination-container :deep(.el-pagination) {
  font-size: 12px;
}

@media screen and (max-width: 393px) {
  .order-history {
    padding: 6px 4px;
  }
  
  .back-button {
    margin-bottom: 8px;
  }
  
  .filter-section {
    margin-bottom: 8px;
    gap: 6px;
  }
  
  .orders-list {
    gap: 6px;
  }
  
  .dish-item {
    padding: 6px;
    gap: 6px;
  }
  
  .dish-image {
    width: 50px;
    height: 50px;
  }
  
  .dish-name {
    font-size: 12px;
  }
  
  .dish-price {
    font-size: 11px;
  }
  
  .total-amount {
    font-size: 14px;
  }
  
  .order-actions :deep(.el-button) {
    padding: 3px 6px;
    font-size: 11px;
  }
}

.order-history {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

.order-card,
.dish-item {
  transition: none;
}

.order-card:hover,
.dish-item:hover {
  transform: none;
  background: #f8f9fa;
}
</style>
