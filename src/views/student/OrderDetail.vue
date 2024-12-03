<template>
  <div class="order-detail">
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

    <div class="detail-content" v-loading="loading">
      <!-- 订单状态卡片 -->
      <el-card class="status-card">
        <div class="status-header">
          <div class="order-info">
            <h2 class="order-number">订单号：{{ order.orderNumber }}</h2>
            <el-tag :type="getStatusType(order.status)" class="status-tag" size="large">
              {{ getStatusLabel(order.status) }}
            </el-tag>
          </div>
          <div class="order-time">
            <div class="time-item">
              <span class="label">下单时间：</span>
              <span class="value">{{ order.createTime }}</span>
            </div>
            <div class="time-item" v-if="order.completedTime">
              <span class="label">完成时间：</span>
              <span class="value">{{ order.completedTime }}</span>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 菜品详情卡片 -->
      <el-card class="dishes-card">
        <template #header>
          <div class="card-header">
            <h3>菜品详情</h3>
            <span class="window-name">{{ order.windowName }}</span>
          </div>
        </template>
        
        <div class="dishes-list">
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
              <div class="dish-meta">
                <span class="dish-price">¥{{ dish.price }}</span>
                <span class="dish-quantity">× {{ dish.quantity }}</span>
              </div>
            </div>
            
            <div class="dish-subtotal">
              ¥{{ (dish.price * dish.quantity).toFixed(2) }}
            </div>
          </div>
        </div>

        <div class="price-summary">
          <div class="price-item">
            <span>商品总额</span>
            <span>¥{{ order.totalAmount }}</span>
          </div>
          <div class="price-item">
            <span>优惠金额</span>
            <span class="discount">-¥{{ order.discount || 0 }}</span>
          </div>
          <div class="price-item total">
            <span>实付金额</span>
            <span class="final-price">¥{{ (order.totalAmount - (order.discount || 0)).toFixed(2) }}</span>
          </div>
        </div>
      </el-card>

      <!-- 订单信息卡片 -->
      <el-card class="order-info-card">
        <template #header>
          <h3>订单信息</h3>
        </template>
        
        <div class="info-list">
          <div class="info-item">
            <span class="label">就餐方式：</span>
            <span class="value">{{ getMealTypeLabel(order.mealType) }}</span>
          </div>
          <div class="info-item">
            <span class="label">预定时间：</span>
            <span class="value">{{ order.reservedTime }}</span>
          </div>
          <div class="info-item">
            <span class="label">支付方式：</span>
            <span class="value">{{ getPaymentMethodLabel(order.paymentMethod) }}</span>
          </div>
          <div class="info-item" v-if="order.remark">
            <span class="label">备注：</span>
            <span class="value">{{ order.remark }}</span>
          </div>
        </div>
      </el-card>

      <!-- 底部操作按钮 -->
      <div class="action-buttons">
        <el-button 
          v-if="order.status === 'pending'"
          type="danger"
          @click="cancelOrder">
          取消订单
        </el-button>
        <el-button 
          v-if="order.status === 'completed'"
          type="primary"
          plain
          @click="reorder">
          再来一单
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import request from '@/utils/request'

export default {
  name: 'OrderDetail',
  components: {
    ArrowLeft
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(false)
    const order = ref({})

    // 获取订单详情
    const fetchOrderDetail = async () => {
      loading.value = true
      try {
        // 在实际开发中替换为真实的API调用
        // const response = await request.get(`/student/orders/${route.params.id}`)
        // order.value = response.data

        // 测试数据
        order.value = {
          id: route.params.id,
          orderNumber: 'ORD202403150001',
          status: 'completed',
          createTime: '2024-03-15 12:30:00',
          completedTime: '2024-03-15 13:00:00',
          windowName: '特色炒菜',
          totalAmount: 45.00,
          discount: 5.00,
          mealType: 'dine_in',
          reservedTime: '2024-03-15 12:45:00',
          paymentMethod: 'balance',
          remark: '不要太辣',
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
        }
      } catch (error) {
        console.error('获取订单详情失败:', error)
        ElMessage.error('获取订单详情失败')
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

    // 获取就餐方式标签
    const getMealTypeLabel = (type) => {
      const typeMap = {
        'dine_in': '堂食',
        'take_out': '打包'
      }
      return typeMap[type] || type
    }

    // 获取支付方式标签
    const getPaymentMethodLabel = (method) => {
      const methodMap = {
        'balance': '余额支付',
        'wechat': '微信支付',
        'alipay': '支付宝'
      }
      return methodMap[method] || method
    }

    // 查看菜品详情
    const viewDishDetail = (dishId) => {
      router.push(`/student/dishes/${dishId}`)
    }

    // 取消订单
    const cancelOrder = async () => {
      try {
        await ElMessageBox.confirm(
          '确��要取消这个订单吗？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )

        // 在实际开发中替换为真实的API调用
        // await request.post(`/student/orders/${order.value.id}/cancel`)
        
        ElMessage.success('订单已取消')
        router.back()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('取消订单失败:', error)
          ElMessage.error('取消订单失败')
        }
      }
    }

    // 再来一单
    const reorder = async () => {
      try {
        // 确认对话框
        await ElMessageBox.confirm(
          '是否将订单中的菜品重新加入购物车？',
          '再来一单',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }
        )

        // 显示加载状态
        loading.value = true

        // 在实际开发中替换为真实的API调用
        // 将订单中的所有菜品添加到购物车
        // const promises = order.value.dishes.map(dish => {
        //   return request.post('/student/cart', {
        //     dishId: dish.id,
        //     quantity: dish.quantity
        //   })
        // })
        // await Promise.all(promises)

        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 500))

        ElMessage.success({
          message: '已将菜品添加到购物车',
          duration: 2000
        })

        // 询问是否立即前往购物车
        const goToCart = await ElMessageBox.confirm(
          '菜品已添加到购物车，是否立即前往购物车？',
          '提示',
          {
            confirmButtonText: '前往购物车',
            cancelButtonText: '继续浏览',
            type: 'success'
          }
        ).catch(() => false)

        if (goToCart) {
          // 跳转到购物车页面
          router.push('/student/cart')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('再来一单失败:', error)
          ElMessage.error('操作失败，请重试')
        }
      } finally {
        loading.value = false
      }
    }

    // 返回上一页
    const goBack = () => {
      router.back()
    }

    onMounted(() => {
      fetchOrderDetail()
    })

    return {
      order,
      loading,
      getStatusLabel,
      getStatusType,
      getMealTypeLabel,
      getPaymentMethodLabel,
      viewDishDetail,
      cancelOrder,
      reorder,
      goBack
    }
  }
}
</script>

<style scoped>
.order-detail {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.back-button {
  margin-bottom: 24px;
  padding: 0 20px;
}

.custom-back-btn {
  height: auto;
  padding: 8px 0;
  transition: all 0.3s ease;
}

.back-content {
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #606266;
}

.back-icon {
  margin-right: 8px;
  font-size: 16px;
  transition: transform 0.3s ease;
}

.back-text {
  position: relative;
  font-weight: 500;
}

.back-text::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #409EFF;
  transition: width 0.3s ease;
}

.custom-back-btn:hover .back-content {
  color: #409EFF;
}

.custom-back-btn:hover .back-icon {
  transform: translateX(-4px);
}

.custom-back-btn:hover .back-text::after {
  width: 100%;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.status-card, .dishes-card, .order-info-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
}

.status-header {
  padding: 20px;
}

.order-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.order-number {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.status-tag {
  font-size: 14px;
  padding: 0 16px;
  height: 32px;
  line-height: 30px;
  border-radius: 16px;
}

.order-time {
  color: #909399;
  font-size: 14px;
}

.time-item {
  margin-bottom: 8px;
}

.time-item:last-child {
  margin-bottom: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.window-name {
  color: #909399;
  font-size: 14px;
}

.dishes-list {
  margin-bottom: 24px;
}

.dish-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
}

.dish-item:last-child {
  border-bottom: none;
}

.dish-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  margin-right: 16px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.dish-image:hover {
  transform: scale(1.05);
}

.dish-info {
  flex: 1;
}

.dish-name {
  margin: 0 0 8px;
  font-size: 16px;
  color: #303133;
}

.dish-meta {
  color: #606266;
}

.dish-price {
  color: #f56c6c;
  margin-right: 12px;
}

.dish-subtotal {
  font-size: 16px;
  color: #f56c6c;
  font-weight: bold;
}

.price-summary {
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
}

.price-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: #606266;
}

.price-item.total {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
  color: #303133;
  font-weight: bold;
}

.discount {
  color: #67c23a;
}

.final-price {
  color: #f56c6c;
  font-size: 20px;
}

.info-list {
  padding: 20px;
}

.info-item {
  margin-bottom: 16px;
  display: flex;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  color: #909399;
  width: 100px;
}

.value {
  color: #303133;
  flex: 1;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .order-detail {
    padding: 12px;
  }

  .order-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .dish-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .dish-image {
    margin-bottom: 12px;
  }

  .dish-subtotal {
    margin-top: 12px;
  }

  .action-buttons {
    flex-direction: column;
  }
}

/* 添加按钮动画效果 */
.action-buttons .el-button {
  transition: all 0.3s ease;
}

.action-buttons .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}
</style> 