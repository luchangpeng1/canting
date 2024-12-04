<template>
  <div class="wallet-page">
    <!-- 顶部导航栏 -->
    <div class="page-header">
      <el-button class="back-btn" link @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <h2 class="page-title">我的钱包</h2>
    </div>

    <!-- 余额卡片 -->
    <div class="balance-card">
      <div class="balance-header">
        <span class="label">当前余额</span>
        <el-button type="primary" link @click="showRechargeDialog">
          <el-icon><Plus /></el-icon>
          充值
        </el-button>
      </div>
      <div class="balance-amount">¥{{ userBalance.toFixed(2) }}</div>
      <div class="balance-tips">
        <el-icon><InfoFilled /></el-icon>
        <span>余额不足{{ lowBalanceThreshold }}元时将收到提醒</span>
      </div>
    </div>

    <!-- 快捷功能 -->
    <div class="quick-actions">
      <el-row :gutter="16">
        <el-col :span="8" v-for="action in quickActions" :key="action.name">
          <div class="action-item" @click="action.handler">
            <el-icon><component :is="action.icon" /></el-icon>
            <span>{{ action.name }}</span>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 充值卡片 -->
    <div class="recharge-section">
      <h3>快捷充值</h3>
      <div class="recharge-options">
        <div 
          v-for="amount in rechargeOptions" 
          :key="amount"
          class="recharge-option"
          :class="{ active: selectedAmount === amount }"
          @click="handleAmountSelect(amount)"
        >
          <span class="amount">¥{{ amount }}</span>
          <span v-if="amount >= 100" class="bonus">送{{ calculateBonus(amount) }}元</span>
        </div>
      </div>
      
      <!-- 添加充值按钮 -->
      <el-button 
        type="primary" 
        class="recharge-button"
        size="large" 
        :disabled="!selectedAmount"
        @click="showRechargeDialog"
      >
        立即充值 ¥{{ selectedAmount }}
      </el-button>
    </div>

    <!-- 充值说明 -->
    <div class="recharge-notice">
      <h3>充值说明</h3>
      <ul>
        <li v-for="(notice, index) in rechargeNotices" :key="index">{{ notice }}</li>
      </ul>
    </div>

    <!-- 充值对话框 -->
    <el-dialog v-model="rechargeVisible" title="余额充值" width="90%" :show-close="false">
      <div class="recharge-dialog-content">
        <div class="amount-display">
          <span class="currency">¥</span>
          <span class="amount">{{ selectedAmount.toFixed(2) }}</span>
        </div>
        <div class="bonus-info" v-if="selectedAmount >= 100">
          <el-icon><Money /></el-icon>
          赠送{{ calculateBonus(selectedAmount) }}元
        </div>
        <div class="payment-methods">
          <div 
            v-for="method in paymentMethods" 
            :key="method.id"
            class="method-item"
            :class="{ active: selectedPaymentMethod === method.id }"
            :data-method="method.id"
            @click="selectPaymentMethod(method.id)"
          >
            <el-icon class="payment-icon" :style="{ color: method.color }">
              <component :is="method.icon" />
            </el-icon>
            <span>{{ method.name }}</span>
            <el-icon v-if="selectedPaymentMethod === method.id"><Select /></el-icon>
          </div>
          
          <div v-if="paymentStatus.error" class="payment-error">
            {{ paymentStatus.error }}
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="closeRechargeDialog">取消</el-button>
        <el-button type="primary" @click="handleRecharge" :loading="recharging">
          确认支付
        </el-button>
      </template>
    </el-dialog>

    <!-- 自动充值设置对话框 -->
    <el-dialog v-model="autoRechargeVisible" title="自动充值设置" width="90%">
      <el-form :model="autoRechargeForm" label-width="120px">
        <el-form-item label="开启自动充值">
          <el-switch v-model="autoRechargeForm.enabled" />
        </el-form-item>
        <template v-if="autoRechargeForm.enabled">
          <el-form-item label="触发余额">
            <el-input-number 
              v-model="autoRechargeForm.threshold" 
              :min="10" 
              :max="100"
              :step="10"
            >
              <template #prefix>低于</template>
              <template #suffix>元时</template>
            </el-input-number>
          </el-form-item>
          <el-form-item label="自动充值金额">
            <el-input-number 
              v-model="autoRechargeForm.amount" 
              :min="50" 
              :step="50"
            >
              <template #suffix>元</template>
            </el-input-number>
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <el-button @click="closeAutoRechargeDialog">取消</el-button>
        <el-button type="primary" @click="saveAutoRechargeSettings">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ArrowLeft, 
  Plus, 
  InfoFilled, 
  List, 
  SetUp, 
  Bell,
  Select,
  Money,
  ChatDotSquare
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'WalletPage',
  
  components: {
    ArrowLeft,
    Plus,
    InfoFilled,
    List,
    SetUp,
    Bell,
    Select,
    Money,
    ChatDotSquare
  },

  setup() {
    const store = useStore()
    const userBalance = computed(() => store.getters['user/userBalance'])
    
    return {
      userBalance
    }
  },

  data() {
    return {
      lowBalanceThreshold: 20,
      rechargeVisible: false,
      autoRechargeVisible: false,
      selectedAmount: 50,
      recharging: false,
      selectedPaymentMethod: 'alipay',

      // 快捷功能配置
      quickActions: [
        { name: '交易记录', icon: 'List', handler: () => this.navigateTo('/transactions') },
        { name: '自动充值', icon: 'SetUp', handler: this.showAutoRechargeSettings },
        { name: '余额提醒', icon: 'Bell', handler: this.showBalanceAlert }
      ],

      // 充值金额选项
      rechargeOptions: [20, 50, 100, 200, 300, 500],

      // 支付方式
      paymentMethods: [
        { 
          id: 'alipay', 
          name: '支付宝支付', 
          icon: 'Money',
          color: '#1677FF'
        },
        { 
          id: 'wechat', 
          name: '微信支付', 
          icon: 'ChatDotSquare',
          color: '#07C160'
        }
      ],

      // 充值说明
      rechargeNotices: [
        '单次充值金额不低于10元',
        '充值满100元赠送5元',
        '赠送金额将在充值成功后立即到账',
        '充值金额实时到账，可用于校园内消费'
      ],

      // 自动充值表单
      autoRechargeForm: {
        enabled: false,
        threshold: 20,
        amount: 50
      },

      // 支付状态
      paymentStatus: {
        loading: false,
        error: null
      }
    }
  },

  methods: {
    handleBack() {
      this.$router.back()
    },

    showRechargeDialog() {
      this.rechargeVisible = true
    },

    closeRechargeDialog() {
      this.rechargeVisible = false
      this.selectedAmount = 50
    },

    handleAmountSelect(amount) {
      this.selectedAmount = amount
    },

    calculateBonus(amount) {
      return Math.floor(amount/100) * 5
    },

    selectPaymentMethod(methodId) {
      this.selectedPaymentMethod = methodId
    },

    async handleRecharge() {
      if (this.selectedAmount < 10) {
        ElMessage.warning('充值金额不能低于10元')
        return
      }

      this.recharging = true
      this.paymentStatus.error = null

      try {
        // 根据不同支付方式调用对应的支付接口
        const paymentResult = await this.processPayment()
        
        if (paymentResult.success) {
          // 支付成功后更新余额
          await this.updateBalance()
          ElMessage.success('充值成功')
          this.closeRechargeDialog()
        } else {
          throw new Error(paymentResult.message || '支付失败')
        }
      } catch (error) {
        this.paymentStatus.error = error.message
        ElMessage.error(error.message || '充值失败，请重试')
      } finally {
        this.recharging = false
      }
    },

    async processPayment() {
      // 模拟调用支付接口
      const paymentData = {
        amount: this.selectedAmount,
        paymentMethod: this.selectedPaymentMethod,
        timestamp: Date.now(),
        orderId: `RECHARGE_${Date.now()}`
      }

      // 这里应该调用真实的支付接口
      await new Promise(resolve => setTimeout(resolve, 1500))

      // 模拟支付结果
      return {
        success: true,
        message: '支付成功',
        data: paymentData
      }
    },

    async updateBalance() {
      // 计算新的余额
      let newBalance = this.userBalance + this.selectedAmount
      
      // 处理赠送金额
      if (this.selectedAmount >= 100) {
        const bonus = this.calculateBonus(this.selectedAmount)
        newBalance += bonus
      }

      // 使用 Vuex 更新余额
      await this.$store.dispatch('user/updateBalance', newBalance)

      // 这里可以添加调用后端 API 的逻辑
      ElMessage.success(`充值成功，当前余额 ¥${newBalance.toFixed(2)}`)
    },

    showAutoRechargeSettings() {
      this.autoRechargeVisible = true
    },

    closeAutoRechargeDialog() {
      this.autoRechargeVisible = false
    },

    saveAutoRechargeSettings() {
      ElMessage.success('设置已保存')
      this.closeAutoRechargeDialog()
    },

    showBalanceAlert() {
      ElMessage.success('余额提醒已开启')
    },

    navigateTo(path) {
      if (!path.startsWith('/student/')) {
        path = '/student' + path
      }
      this.$router.push(path)
    }
  }
}
</script>

<style scoped>
.wallet-page {
  padding: 4px;
  padding-bottom: env(safe-area-inset-bottom, 4px);
  max-width: 100%;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  position: relative;
}

.back-btn {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #606266;
  position: absolute;
  left: 0;
}

.back-btn .el-icon {
  margin-right: 4px;
}

.page-title {
  flex: 1;
  text-align: center;
  margin: 0;
  font-size: 15px;
  font-weight: 500;
}

.balance-card {
  background: linear-gradient(135deg, #409EFF, #2e89ff);
  border-radius: 4px;
  padding: 8px;
  color: white;
  margin-bottom: 4px;
}

.balance-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.balance-header .label {
  font-size: 14px;
  opacity: 0.9;
}

.balance-amount {
  font-size: 24px;
  font-weight: 600;
  margin: 4px 0;
}

.balance-tips {
  display: flex;
  align-items: center;
  font-size: 12px;
  opacity: 0.8;
  margin-top: 4px;
}

.balance-tips .el-icon {
  margin-right: 4px;
}

.quick-actions {
  background: white;
  border-radius: 4px;
  padding: 4px;
  margin: 4px 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 4px;
  cursor: pointer;
}

.action-item .el-icon {
  font-size: 18px;
  color: #409EFF;
}

.action-item span {
  font-size: 14px;
  color: #606266;
}

.recharge-section {
  background: white;
  border-radius: 4px;
  padding: 4px;
  margin-bottom: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.recharge-section h3 {
  margin: 0 0 8px;
  font-size: 15px;
  color: #303133;
}

.recharge-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  padding: 0;
  margin: 4px 0;
}

.recharge-option {
  position: relative;
  border: 1px solid #DCDFE6;
  border-radius: 3px;
  padding: 6px 4px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.recharge-option.active {
  border-color: #409EFF;
  background-color: #ecf5ff;
}

.recharge-option .amount {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.recharge-option .bonus {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #F56C6C;
  color: white;
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 6px;
}

.recharge-notice {
  background: white;
  border-radius: 4px;
  padding: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  margin-top: 4px;
}

.recharge-notice h3 {
  margin: 0 0 6px;
  font-size: 15px;
  color: #303133;
}

.recharge-notice ul {
  margin: 0;
  padding-left: 16px;
  color: #606266;
  font-size: 14px;
}

.recharge-notice li {
  margin-bottom: 2px;
}

.recharge-dialog-content {
  text-align: center;
}

.amount-display {
  font-size: 28px;
  padding: 16px 0;
}

.amount-display .currency {
  font-size: 24px;
  margin-right: 4px;
}

.bonus-info {
  color: #F56C6C;
  font-size: 14px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.payment-methods {
  border-top: 1px solid #EBEEF5;
  padding-top: 12px;
}

.method-item {
  display: flex;
  align-items: center;
  padding: 8px;
  margin-bottom: 4px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.method-item.active {
  border-color: var(--payment-color, #409EFF);
  background-color: var(--payment-bg-color, #ecf5ff);
}

.payment-icon {
  font-size: 24px;
  margin-right: 12px;
}

.method-item.active[data-method="alipay"] {
  --payment-color: #1677FF;
  --payment-bg-color: rgba(22, 119, 255, 0.1);
}

.method-item.active[data-method="wechat"] {
  --payment-color: #07C160;
  --payment-bg-color: rgba(7, 193, 96, 0.1);
}

.payment-error {
  color: #F56C6C;
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
}

.recharge-button {
  width: 100%;
  margin-top: 8px;
  height: 34px;
  font-size: 16px;
  border-radius: 4px;
}

/* 优化对话框样式 */
:deep(.el-dialog) {
  margin: 0 !important;
  width: 100% !important;
  border-radius: 0;
}

/* 减小对话框内部间距 */
:deep(.el-dialog__body) {
  padding: 8px;
}

:deep(.el-dialog__header) {
  padding: 8px;
}

:deep(.el-dialog__footer) {
  padding: 4px 8px 8px;
}
</style> 