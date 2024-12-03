<template>
  <div class="order-list">
    <div class="page-header">
      <h2 class="page-title">我的订单</h2>
      <el-button 
        type="primary" 
        class="history-btn"
        @click="goToHistory">
        <el-icon><Calendar /></el-icon>
        历史订单
      </el-button>
    </div>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="进行中" name="ongoing">
        <el-empty v-if="ongoingOrders.length === 0" description="暂无进行中的订单" />
        <el-card v-for="order in ongoingOrders" :key="order.id" class="order-card">
          <div class="order-header">
            <span class="window-name">{{ order.windowName }}</span>
            <el-tag :type="getStatusType(order.status)">{{ getStatusText(order.status) }}</el-tag>
          </div>
          <div class="order-content">
            <div class="dish-list">
              <div v-for="dish in order.dishes" :key="dish.id" class="dish-item">
                <span>{{ dish.name }}</span>
                <span>x{{ dish.quantity }}</span>
                <span>¥{{ dish.price }}</span>
              </div>
            </div>
            <div class="order-footer">
              <span class="total-price">合计：¥{{ order.totalPrice }}</span>
              <div class="actions">
                <el-button type="primary" size="small" @click="cancelOrder(order)" v-if="order.status === 'pending'">
                  取消订单
                </el-button>
                <el-button type="success" size="small" @click="confirmReceived(order)" v-if="order.status === 'ready'">
                  确认取餐
                </el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="已完成" name="completed">
        <el-empty v-if="completedOrders.length === 0" description="暂无已完成订单" />
        <el-card v-for="order in completedOrders" :key="order.id" class="order-card">
          <!-- 已完成订单的展示内容类似 -->
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Calendar } from '@element-plus/icons-vue'

export default {
  name: 'OrderList',
  components: {
    Calendar
  },
  setup() {
    const router = useRouter()
    const activeTab = ref('ongoing')
    const ongoingOrders = ref([])
    const completedOrders = ref([])

    // 测试数据
    const mockOrders = [
      {
        id: 1,
        windowName: '特色炒菜',
        status: 'pending',
        dishes: [
          { id: 1, name: '宫保鸡丁', quantity: 1, price: 15 },
          { id: 2, name: '青椒肉丝', quantity: 1, price: 12 }
        ],
        totalPrice: 27,
        createTime: '2024-01-20 12:30:00'
      },
      // 添加更多测试数据...
    ]

    const getStatusType = (status) => {
      const types = {
        pending: 'warning',
        preparing: 'primary',
        ready: 'success',
        completed: 'info',
        cancelled: 'danger'
      }
      return types[status] || 'info'
    }

    const getStatusText = (status) => {
      const texts = {
        pending: '待接单',
        preparing: '制作中',
        ready: '待取餐',
        completed: '已完成',
        cancelled: '已取消'
      }
      return texts[status] || '未知状态'
    }

    const goToHistory = () => {
      router.push('/student/order-history')
    }

    onMounted(() => {
      // 模拟加载数据
      ongoingOrders.value = mockOrders.filter(order => 
        ['pending', 'preparing', 'ready'].includes(order.status)
      )
      completedOrders.value = mockOrders.filter(order => 
        ['completed', 'cancelled'].includes(order.status)
      )
    })

    return {
      activeTab,
      ongoingOrders,
      completedOrders,
      getStatusType,
      getStatusText,
      goToHistory
    }
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 10px;
}

.page-title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #303133;
}

.history-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.history-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.order-list {
  padding: 20px;
}

.order-card {
  margin-bottom: 15px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.window-name {
  font-weight: bold;
}

.dish-list {
  margin: 10px 0;
}

.dish-item {
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
  color: #666;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.total-price {
  font-weight: bold;
  color: #f56c6c;
}

.actions {
  display: flex;
  gap: 10px;
}
</style> 