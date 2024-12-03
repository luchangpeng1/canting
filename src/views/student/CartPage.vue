<template>
  <div class="cart-page">
    <div class="cart-header">
      <div class="header-left">
        <el-button 
          @click="goBack" 
          icon="ArrowLeft"
          text
          class="back-button">
          返回
        </el-button>
        <h2>购物车</h2>
      </div>
      <div class="header-right">
        <el-checkbox 
          v-if="hasCartItems"
          v-model="selectAll"
          @change="handleSelectAllChange"
          class="select-all">
          全选
        </el-checkbox>
        <el-button 
          type="danger" 
          plain 
          size="small" 
          @click="clearCart" 
          v-if="Object.keys(cartData).length > 0">
          清空购物车
        </el-button>
      </div>
    </div>

    <div class="cart-content">
      <template v-if="hasCartItems">
        <!-- 按窗口分组显示购物车商品 -->
        <div v-for="(items, windowId) in groupedCartItems" 
             :key="windowId" 
             class="cart-window-group">
          <div class="cart-window-header">
            <div class="window-header-left">
              <el-checkbox 
                v-model="windowSelected[windowId]"
                @change="(val) => handleWindowSelectChange(val, windowId)"
                class="window-checkbox">
              </el-checkbox>
              <el-tag size="small">{{ getWindowName(windowId) }}</el-tag>
            </div>
            <el-button 
              type="danger" 
              plain 
              size="small" 
              @click="clearWindowCart(windowId)">
              清空
            </el-button>
          </div>
          
          <div class="cart-items-list">
            <div v-for="item in items" 
                 :key="item.id" 
                 class="cart-item">
              <el-checkbox 
                v-model="item.selected"
                @change="() => handleItemSelectChange(item, windowId)"
                class="item-checkbox">
              </el-checkbox>
              <el-image 
                :src="item.image_url" 
                class="cart-item-image"
                fit="cover">
                <template #error>
                  <div class="image-placeholder">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
              
              <div class="cart-item-info">
                <div class="cart-item-name">{{ item.name }}</div>
                <div class="cart-item-price">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
              </div>
              
              <div class="cart-item-actions">
                <el-input-number 
                  v-model="item.quantity" 
                  :min="0" 
                  :max="item.stock"
                  size="small"
                  @change="handleQuantityChange(item, windowId)"
                  controls-position="right">
                </el-input-number>
              </div>
            </div>
            <!-- 每个窗口的小计和结算按钮 -->
            <div class="window-cart-footer">
              <div class="window-total-info">
                <span class="total-label">小计:</span>
                <span class="total-price">¥{{ getWindowTotal(items).toFixed(2) }}</span>
              </div>
              <el-button 
                type="primary" 
                size="small"
                @click="goToCheckout(windowId)">
                结算 ({{ getWindowCount(items) }}件)
              </el-button>
            </div>
          </div>
        </div>
      </template>
      
      <div v-else class="empty-cart">
        <el-empty description="购物车是空的">
          <template #image>
            <el-icon :size="60" class="empty-cart-icon"><ShoppingCart /></el-icon>
          </template>
          <template #default>
            <el-button type="primary" @click="goBack">返回点餐</el-button>
          </template>
        </el-empty>
      </div>
    </div>

    <!-- 底部结算栏 -->
    <div class="cart-footer" v-if="hasCartItems">
      <div class="footer-left">
        <el-checkbox 
          v-model="selectAll"
          @change="handleSelectAllChange">
          全选
        </el-checkbox>
        <div class="total-info">
          <span>合计:</span>
          <span class="total-price">¥{{ totalSelectedPrice.toFixed(2) }}</span>
        </div>
      </div>
      <el-button 
        type="primary" 
        :disabled="!hasSelectedItems"
        @click="batchCheckout">
        结算({{ selectedItemsCount }}件)
      </el-button>
    </div>

    <!-- 结算确认对话框 -->
    <el-dialog
      v-model="checkoutDialogVisible"
      title="确认订单"
      width="400px">
      <div class="checkout-content">
        <div class="checkout-items">
          <div v-for="item in selectedItemsForCheckout" 
               :key="item.id" 
               class="checkout-item">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-quantity">x{{ item.quantity }}</span>
            <span class="item-price">¥{{ item.price * item.quantity }}</span>
          </div>
        </div>
        
        <el-divider></el-divider>
        
        <div class="checkout-form">
          <el-form :model="checkoutForm" :rules="checkoutRules" ref="checkoutFormRef">
            <el-form-item label="就餐时间" prop="diningTime">
              <el-time-select
                v-model="checkoutForm.diningTime"
                :picker-options="{
                  start: '10:30',
                  step: '00:15',
                  end: '20:00'
                }"
                placeholder="选择就餐时间">
              </el-time-select>
            </el-form-item>
            
            <el-form-item label="就餐方式" prop="diningType">
              <el-radio-group v-model="checkoutForm.diningType">
                <el-radio label="dine_in">堂食</el-radio>
                <el-radio label="take_out">打包</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="checkoutForm.remark"
                type="textarea"
                placeholder="请输入备注信息">
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="checkoutDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitOrder">提交订单</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Picture, ShoppingCart, ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 从 localStorage 或 Vuex 获取购物车数据
const cartData = ref(JSON.parse(localStorage.getItem('cartData') || '{}'))

// 计算属性和方法
const hasCartItems = computed(() => {
  return Object.values(cartData.value).some(items => items.length > 0)
})

const groupedCartItems = computed(() => {
  return cartData.value
})

const checkoutDialogVisible = ref(false)
const checkoutFormRef = ref(null)
const currentWindowId = ref(null)
const currentWindowItems = computed(() => cartData.value[currentWindowId.value] || [])

const checkoutForm = reactive({
  diningTime: '',
  diningType: 'dine_in',
  remark: ''
})

const checkoutRules = {
  diningTime: [
    { required: true, message: '请选择就餐时间', trigger: 'change' }
  ],
  diningType: [
    { required: true, message: '请选择就餐方式', trigger: 'change' }
  ]
}

// 添加新的响应式数据
const selectAll = ref(false)
const windowSelected = ref({})
const selectedItemsForCheckout = ref([])

// 新增计算属性
const totalSelectedPrice = computed(() => {
  let total = 0
  Object.entries(cartData.value).forEach(([windowId, items]) => {
    items.forEach(item => {
      if (item.selected) {
        total += item.price * item.quantity
      }
    })
  })
  return total
})

const selectedItemsCount = computed(() => {
  let count = 0
  Object.values(cartData.value).forEach(items => {
    items.forEach(item => {
      if (item.selected) {
        count += item.quantity
      }
    })
  })
  return count
})

const hasSelectedItems = computed(() => selectedItemsCount.value > 0)

// 方法
const getWindowName = (windowId) => {
  // 这里需要根据实际情况获取窗口名称
  return `窗口 ${windowId}`
}

const getWindowTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0)
}

const getWindowCount = (items) => {
  return items.reduce((total, item) => total + item.quantity, 0)
}

const handleQuantityChange = (item, windowId) => {
  if (item.quantity === 0) {
    cartData.value[windowId] = cartData.value[windowId].filter(i => i.id !== item.id)
    if (cartData.value[windowId].length === 0) {
      delete cartData.value[windowId]
    }
  }
  saveCartData()
}

const clearWindowCart = (windowId) => {
  delete cartData.value[windowId]
  saveCartData()
  ElMessage.success('已清空该窗口购物车')
}

const clearCart = () => {
  cartData.value = {}
  saveCartData()
  ElMessage.success('购物车已清空')
}

const goToCheckout = (windowId) => {
  currentWindowId.value = windowId
  checkoutDialogVisible.value = true
}

const submitOrder = async () => {
  if (!checkoutFormRef.value) return
  
  try {
    await checkoutFormRef.value.validate()
    
    const orderData = {
      items: selectedItemsForCheckout.value,
      ...checkoutForm
    }
    
    // await request.post('/student/orders', orderData)
    
    ElMessage.success('下单成功')
    checkoutDialogVisible.value = false
    
    // 从购物车中移除已结算的商品
    selectedItemsForCheckout.value.forEach(item => {
      const windowId = item.windowId
      cartData.value[windowId] = cartData.value[windowId].filter(i => !i.selected)
      if (cartData.value[windowId].length === 0) {
        delete cartData.value[windowId]
      }
    })
    
    saveCartData()
    router.push('/student/orders')
  } catch (error) {
    console.error('下单失败:', error)
    ElMessage.error('下单失败')
  }
}

const saveCartData = () => {
  localStorage.setItem('cartData', JSON.stringify(cartData.value))
}

const goBack = () => {
  router.back()
}

// 修改初始化购物车数据的逻辑，添加选中状态
const initCartData = () => {
  const savedCart = JSON.parse(localStorage.getItem('cartData') || '{}')
  Object.entries(savedCart).forEach(([windowId, items]) => {
    savedCart[windowId] = items.map(item => ({
      ...item,
      selected: false
    }))
  })
  cartData.value = savedCart
}

// 在组件挂载时初始化数据
onMounted(() => {
  initCartData()
})

// 添加新的方法
const handleSelectAllChange = (val) => {
  Object.keys(cartData.value).forEach(windowId => {
    windowSelected.value[windowId] = val
    cartData.value[windowId].forEach(item => {
      item.selected = val
    })
  })
}

const handleWindowSelectChange = (val, windowId) => {
  cartData.value[windowId].forEach(item => {
    item.selected = val
  })
  updateSelectAllStatus()
}

const handleItemSelectChange = (item, windowId) => {
  const allSelected = cartData.value[windowId].every(item => item.selected)
  windowSelected.value[windowId] = allSelected
  updateSelectAllStatus()
}

const updateSelectAllStatus = () => {
  selectAll.value = Object.values(cartData.value).every(items => 
    items.every(item => item.selected)
  )
}

const batchCheckout = () => {
  selectedItemsForCheckout.value = []
  Object.entries(cartData.value).forEach(([windowId, items]) => {
    const selectedItems = items.filter(item => item.selected)
    if (selectedItems.length > 0) {
      selectedItemsForCheckout.value.push(...selectedItems)
    }
  })
  checkoutDialogVisible.value = true
}
</script>

<style scoped>
.cart-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: #fff;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-button {
  font-size: 16px;
  padding: 0;
  height: auto;
  transition: all 0.3s ease;
}

.back-button:hover {
  color: var(--el-color-primary);
  transform: translateX(-2px);
}

.cart-header h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
  font-weight: 600;
}

.cart-window-group {
  background: #fff;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #ebeef5;
}

.cart-window-group:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.cart-window-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
  background: linear-gradient(to right, #f8f9fb, #fff);
}

.cart-items-list {
  padding: 0 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #f2f2f2;
  transition: all 0.3s ease;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item-image {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  margin-right: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.cart-item-image:hover {
  transform: scale(1.05);
}

.cart-item-info {
  flex: 1;
  padding: 0 10px;
}

.cart-item-name {
  font-size: 16px;
  margin-bottom: 8px;
  color: #303133;
  font-weight: 500;
}

.cart-item-price {
  color: #f56c6c;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: baseline;
}

.cart-item-price::before {
  content: '¥';
  font-size: 12px;
  margin-right: 2px;
}

.window-cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px;
  border-top: 1px dashed #ebeef5;
  background: #f8f9fb;
  border-radius: 0 0 12px 12px;
}

.window-total-info {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.total-price {
  color: #f56c6c;
  font-size: 18px;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(245, 108, 108, 0.1);
}

.empty-cart {
  padding: 60px 20px;
  text-align: center;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.empty-cart-icon {
  font-size: 48px;
  color: #909399;
  margin-bottom: 20px;
  opacity: 0.8;
}

.cart-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 20px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.total-info {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.total-price {
  color: #f56c6c;
  font-size: 20px;
  font-weight: 500;
}

/* 调整内容区域，为底部结算栏留出空间 */
.cart-content {
  padding-bottom: 80px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .cart-page {
    padding: 10px;
  }
  
  .cart-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 15px;
  }
  
  .cart-item-image {
    margin-bottom: 15px;
    width: 100%;
    height: 160px;
    object-fit: cover;
  }
  
  .cart-item-actions {
    margin-top: 15px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  .cart-footer {
    padding: 12px 15px;
  }
  
  .footer-left {
    gap: 12px;
  }
}

/* 自定义复选框样式 */
:deep(.el-checkbox__inner) {
  border-radius: 999px;
  width: 24px;
  height: 24px;
  border: 2px solid #dcdfe6;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.el-checkbox__inner::after) {
  height: 10px;
  left: 8px;
  top: 4px;
  width: 4px;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  transform: scale(1.05);
}

:deep(.el-checkbox) {
  --el-checkbox-font-size: 15px;
  height: 24px;
  margin-right: 8px;
}

:deep(.el-checkbox__label) {
  padding-left: 10px;
  line-height: 24px;
}

/* 自定义按钮样式 */
:deep(.el-button--primary) {
  background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-light-3));
  border: none;
  padding: 10px 24px;
  transition: all 0.3s ease;
}

:deep(.el-button--primary:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

:deep(.el-button--danger.is-plain) {
  background: #fff;
  border-color: #f56c6c;
  color: #f56c6c;
}

:deep(.el-button--danger.is-plain:hover) {
  background: #fef0f0;
  color: #f56c6c;
}

/* 自定义输入框样式 */
:deep(.el-input-number) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-input-number .el-input__inner) {
  text-align: center;
}

/* 自定义标签样式 */
:deep(.el-tag) {
  border-radius: 6px;
  padding: 0 12px;
  height: 24px;
  line-height: 24px;
  font-weight: 500;
}

/* 添加暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .cart-page {
    background-color: #1a1a1a;
  }
  
  .cart-window-group,
  .cart-header,
  .empty-cart {
    background: #2b2b2b;
    border-color: #3a3a3a;
  }
  
  .cart-item-name {
    color: #e5e5e5;
  }
  
  .cart-window-header {
    background: linear-gradient(to right, #2b2b2b, #333);
  }
  
  .cart-footer {
    background: rgba(43, 43, 43, 0.95);
  }
}

/* 调整复选框容器样式 */
.header-right .select-all {
  margin-right: 16px;
}

.window-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 8px;
}

.cart-item {
  position: relative;
  padding-left: 48px;
}

.item-checkbox {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
}

/* 底部结算栏的复选框样式调整 */
.cart-footer .el-checkbox {
  margin-left: 12px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .cart-item {
    padding-left: 40px;
  }
  
  .item-checkbox {
    left: 8px;
  }
}
</style> 