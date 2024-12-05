<template>
  <div class="mobile-admin-layout">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="window-info">
        <div class="location-info">
          <span class="canteen-name">{{ windowInfo.canteen.name }}</span>
          <el-divider direction="vertical" />
          <span class="floor-info">{{ windowInfo.floor }}层</span>
        </div>
        <div class="window-detail">
          <span class="window-name">{{ windowInfo.name }}</span>
          <span class="operation-time">{{ windowInfo.operatingHours }}</span>
        </div>
        <el-tag size="small" :type="windowInfo.status === 'open' ? 'success' : 'danger'">
          {{ windowInfo.status === 'open' ? '营业中' : '已打烊' }}
        </el-tag>
      </div>
      <div class="actions">
        <el-dropdown @command="handleCommand" trigger="click">
          <el-button size="small" type="primary" plain>
            <el-icon><Setting /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">
                <el-icon><SwitchButton /></el-icon>退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-switch
          v-model="windowStatus"
          active-text="营业"
          inactive-text="打烊"
          @change="handleStatusChange"
        />
      </div>
    </div>

    <!-- 页面内容区域 -->
    <div class="page-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <!-- 底部导航栏 -->
    <div class="tabbar">
      <div 
        v-for="tab in tabs" 
        :key="tab.path"
        class="tab-item"
        :class="{ active: isActive(tab.path) }"
        @click="handleTabClick(tab.path)">
        <el-icon><component :is="tab.icon" /></el-icon>
        <span>{{ tab.name }}</span>
        <el-badge 
          v-if="tab.path === '/m/admin/orders' && pendingOrders > 0"
          :value="pendingOrders" 
          class="order-badge" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, onActivated, onDeactivated } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Document, Menu as MenuIcon, TrendCharts, Setting, SwitchButton, Money } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 窗口信息
const windowInfo = ref({
  name: '大荤窗口',
  status: 'open',
  canteen: {
    id: 1,
    name: '中央食堂'
  },
  floor: 1,
  operatingHours: '10:30-13:30, 16:30-19:00',
  type: '大荤窗口'
})

const windowStatus = ref(windowInfo.value.status === 'open')

// 待处理订单数量
const pendingOrders = ref(0)

// 底部导航菜单
const tabs = [
  {
    name: '订单管理',
    path: '/m/admin/orders',
    icon: Document
  },
  {
    name: '菜单管理',
    path: '/m/admin/menu',
    icon: MenuIcon
  },
  {
    name: '营业统计',
    path: '/m/admin/stats',
    icon: TrendCharts
  },
  {
    name: '提现管理',
    path: '/m/admin/withdraw',
    icon: Money
  }
]

// 判断当前激活的标签
const isActive = (path) => {
  return route.path === path
}

// 处理标签点击
const handleTabClick = (path) => {
  router.push(path)
}

// 处理窗口营业状态切换
const handleStatusChange = async (value) => {
  try {
    await ElMessageBox.confirm(
      `确定要${value ? '开始营业' : '打烊'}吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: value ? 'success' : 'warning'
      }
    )
    
    // TODO: 调用API更新窗口状态
    windowInfo.value.status = value ? 'open' : 'closed'
    ElMessage.success(`已${value ? '开始营业' : '打烊'}`)
  } catch {
    // 取消操作，回滚状态
    windowStatus.value = !value
  }
}

// 获取窗口信息
const fetchWindowInfo = async () => {
  try {
    // TODO: 调用API获取窗口信息
    // const response = await api.getWindowInfo()
    // windowInfo.value = response.data
  } catch (error) {
    ElMessage.error('获取窗口信息失败')
  }
}

// 获取待处理订单数量
const fetchPendingOrders = async () => {
  try {
    // TODO: 调用API获取待处理订单数量
    // const response = await api.getPendingOrdersCount()
    // pendingOrders.value = response.data
  } catch (error) {
    console.error('获取待处理订单数量失败', error)
  }
}

// 定时更新待处理订单数量
let timer = null
onMounted(() => {
  fetchWindowInfo()
  fetchPendingOrders()
  
  // 每30秒更新一次待处理订单数量
  timer = setInterval(fetchPendingOrders, 30000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

// 处理下拉菜单命令
const handleCommand = async (command) => {
  if (command === 'logout') {
    try {
      await ElMessageBox.confirm(
        '确定要退出登录吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      // 清除登录信息
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // 跳转到登录页
      router.push('/login')
      ElMessage.success('已退出登录')
    } catch {
      // 用户取消退出
    }
  }
}

// 缓存页面状态
onActivated(() => {
  // 恢复页面状态
})

onDeactivated(() => {
  // 保存页面状态
})
</script>

<style scoped>
.mobile-admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  padding-top: 80px;
}

.header {
  height: auto;
  min-height: 60px;
  padding: 10px 15px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.window-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.location-info {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #909399;
}

.location-info .el-divider {
  margin: 0 8px;
  height: 12px;
}

.canteen-name {
  font-weight: 500;
}

.window-detail {
  display: flex;
  align-items: center;
  gap: 8px;
}

.window-name {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.operation-time {
  font-size: 12px;
  color: #909399;
  background: #f5f7fa;
  padding: 2px 6px;
  border-radius: 4px;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  padding-bottom: calc(70px + env(safe-area-inset-bottom, 0));
}

.tabbar {
  height: 50px;
  display: flex;
  background: #fff;
  box-shadow: 0 -1px 4px rgba(0,0,0,0.1);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #909399;
  cursor: pointer;
  position: relative;
}

.tab-item.active {
  color: #409EFF;
}

.tab-item .el-icon {
  font-size: 20px;
  margin-bottom: 2px;
}

.order-badge {
  position: absolute;
  top: 0;
  right: 20%;
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 适配 iPhone 底部安全区域 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .tabbar {
    height: calc(50px + env(safe-area-inset-bottom));
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  .page-content {
    padding-bottom: calc(70px + env(safe-area-inset-bottom));
  }
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.el-dropdown {
  margin-right: 8px;
}
</style> 