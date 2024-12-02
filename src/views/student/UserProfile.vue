<template>
  <div class="user-profile">
    <!-- 用户基本信息卡片 -->
    <div class="user-info-card">
      <div class="user-info">
        <el-avatar :size="64" :src="userInfo.avatar">
          {{ userInfo.name.charAt(0) }}
        </el-avatar>
        <div class="info-content">
          <div class="name-wrapper">
            <h3>{{ userInfo.name }}</h3>
            <el-button 
              class="edit-btn" 
              type="primary" 
              link 
              @click="showEditProfile"
              :title="'编辑个人信息'"
            >
              <el-icon><Edit /></el-icon>
              <span class="edit-text">编辑资料</span>
            </el-button>
          </div>
          <p>{{ userInfo.studentId }}</p>
        </div>
      </div>
      <div class="balance-info">
        <div class="balance-item">
          <span class="amount">¥{{ userInfo.balance }}</span>
          <span class="label">余额</span>
        </div>
        <div class="balance-item">
          <span class="amount">{{ userInfo.points }}</span>
          <span class="label">积分</span>
        </div>
      </div>
    </div>

    <!-- 功能菜单列表 -->
    <div class="menu-list">
      <el-card class="menu-card">
        <!-- 钱包相关 -->
        <div class="menu-item" @click="showRecharge">
          <div class="menu-icon">
            <el-icon><WalletFilled /></el-icon>
          </div>
          <div class="menu-content">
            <span>我的钱包</span>
            <span class="menu-value">¥{{ userInfo.balance }}</span>
          </div>
        </div>
        <div class="menu-item" @click="navigateToPage('/transactions')">
          <div class="menu-icon">
            <el-icon><List /></el-icon>
          </div>
          <div class="menu-content">
            <span>消费记录</span>
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
        
        <!-- 订餐相关 -->
        <div class="menu-item" @click="handleMenuClick('favorites')">
          <div class="menu-icon">
            <el-icon><StarFilled /></el-icon>
          </div>
          <div class="menu-content">
            <span>我的收藏</span>
            <span class="menu-value">{{ userInfo.favorites }}个菜品</span>
          </div>
        </div>
        <div class="menu-item" @click="handleMenuClick('reviews')">
          <div class="menu-icon">
            <el-icon><ChatDotSquare /></el-icon>
          </div>
          <div class="menu-content">
            <span>历史评价</span>
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
        
        <!-- 反馈相关 -->
        <div class="menu-item" @click="showFeedbackDialog">
          <div class="menu-icon">
            <el-icon><EditPen /></el-icon>
          </div>
          <div class="menu-content">
            <span>提交建议</span>
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
        <div class="menu-item" @click="handleMenuClick('my-feedbacks')">
          <div class="menu-icon">
            <el-icon><Message /></el-icon>
          </div>
          <div class="menu-content">
            <span>我的建议</span>
            <span class="menu-value">{{ userInfo.feedbacks }}条</span>
          </div>
        </div>

        <!-- 设置相关 -->
        <div class="menu-item" @click="handleMenuClick('notification-settings')">
          <div class="menu-icon">
            <el-icon><Bell /></el-icon>
          </div>
          <div class="menu-content">
            <span>通知设置</span>
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
        <div class="menu-item" @click="handleMenuClick('preferences')">
          <div class="menu-icon">
            <el-icon><Setting /></el-icon>
          </div>
          <div class="menu-content">
            <span>偏好设置</span>
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
        <div class="menu-item" @click="showAbout">
          <div class="menu-icon">
            <el-icon><InfoFilled /></el-icon>
          </div>
          <div class="menu-content">
            <span>关于我们</span>
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </el-card>

      <!-- 退出登录按钮 -->
      <div class="logout-button">
        <el-button type="danger" plain @click="handleLogout">退出登录</el-button>
      </div>
    </div>

    <!-- 充值对话框 -->
    <el-dialog v-model="rechargeVisible" title="余额充值" width="90%">
      <div class="recharge-options">
        <div 
          v-for="amount in [20, 50, 100, 200]" 
          :key="amount"
          class="recharge-option"
          :class="{ active: rechargeForm.amount === amount }"
          @click="rechargeForm.amount = amount"
        >
          ¥{{ amount }}
        </div>
      </div>
      <el-form :model="rechargeForm" label-width="80px">
        <el-form-item label="其他金额">
          <el-input-number v-model="rechargeForm.amount" :min="0" :step="10" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rechargeVisible = false">取消</el-button>
        <el-button type="primary" @click="handleRecharge">确认充值</el-button>
      </template>
    </el-dialog>

    <!-- 反馈对话框 -->
    <el-dialog v-model="feedbackVisible" title="提交建议" width="90%">
      <el-form :model="feedbackForm" label-width="80px">
        <el-form-item label="食堂">
          <el-select v-model="feedbackForm.canteen" placeholder="请选择食堂">
            <el-option
              v-for="canteen in canteens"
              :key="canteen.id"
              :label="canteen.name"
              :value="canteen.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="窗口" v-if="feedbackForm.canteen">
          <el-select v-model="feedbackForm.window" placeholder="请选择窗口">
            <el-option
              v-for="window in getWindows(feedbackForm.canteen)"
              :key="window.id"
              :label="window.name"
              :value="window.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="建议类型">
          <el-select v-model="feedbackForm.type" placeholder="请选择建议类型">
            <el-option label="菜品建议" value="dish" />
            <el-option label="服务建议" value="service" />
            <el-option label="环境建议" value="environment" />
            <el-option label="其他建议" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="建议内容">
          <el-input
            v-model="feedbackForm.content"
            type="textarea"
            :rows="4"
            placeholder="请详细描述您的建议..."
          />
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-change="handleImageChange"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="feedbackVisible = false">取消</el-button>
        <el-button type="primary" @click="submitFeedback">提交建议</el-button>
      </template>
    </el-dialog>

    <!-- 个人信息编辑对话框 -->
    <el-dialog v-model="profileEditVisible" title="编辑个人信息" width="90%">
      <el-form :model="profileForm" label-width="80px">
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleAvatarChange"
          >
            <img v-if="profileForm.avatar" :src="profileForm.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="profileForm.name" />
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="profileForm.phone" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="profileForm.email" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="profileEditVisible = false">取消</el-button>
        <el-button type="primary" @click="updateProfile">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  WalletFilled,
  List,
  StarFilled,
  ChatDotSquare,
  EditPen,
  Message,
  Bell,
  Setting,
  InfoFilled,
  Plus,
  ArrowRight,
  ChatSquare,
  Edit
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'UserProfile',
  components: {
    WalletFilled,
    List,
    StarFilled,
    ChatDotSquare,
    EditPen,
    Message,
    Bell,
    Setting,
    InfoFilled,
    Plus,
    ArrowRight,
    ChatSquare,
    Edit
  },
  setup() {
    const router = useRouter()
    const userInfo = ref({
      name: '张三',
      studentId: '2021001001',
      avatar: '',
      balance: 99.50,
      points: 280,
      favorites: 12,
      feedbacks: 3
    })

    // 充值相关
    const rechargeVisible = ref(false)
    const rechargeForm = ref({
      amount: 50
    })

    // 反馈相关
    const feedbackVisible = ref(false)
    const feedbackForm = ref({
      canteen: '',
      window: '',
      type: '',
      content: '',
      images: []
    })

    // 测试数据
    const canteens = [
      { id: 1, name: '中央食堂' },
      { id: 2, name: '沁园餐厅' },
      // ... 其他食堂
    ]

    const getWindows = (canteenId) => {
      // 模拟根据食堂获取窗口列表
      return [
        { id: 1, name: '特色炒菜' },
        { id: 2, name: '面食档口' },
        // ... 其他窗口
      ]
    }

    const showRecharge = () => {
      rechargeVisible.value = true
    }

    const handleRecharge = () => {
      if (!rechargeForm.value.amount || rechargeForm.value.amount <= 0) {
        ElMessage.warning('请输入有效的充值金额')
        return
      }
      
      ElMessage.success(`成功充值 ${rechargeForm.value.amount} 元`)
      userInfo.value.balance += rechargeForm.value.amount
      rechargeVisible.value = false
    }

    const showFeedbackDialog = () => {
      feedbackVisible.value = true
    }

    const handleImageChange = (file) => {
      // 处理图片上传
      feedbackForm.value.images.push(file)
    }

    const submitFeedback = () => {
      // 添加表单验证
      if (!feedbackForm.value.type) {
        ElMessage.warning('请选择建议类型')
        return
      }
      if (!feedbackForm.value.content || feedbackForm.value.content.trim() === '') {
        ElMessage.warning('请填写建议内容')
        return
      }
      
      ElMessage.success('感谢您的建议，我们会认真考虑')
      feedbackVisible.value = false
      feedbackForm.value = {
        canteen: '',
        window: '',
        type: '',
        content: '',
        images: []
      }
    }

    const showAbout = () => {
      ElMessage({
        message: '校园食堂点餐系统 v1.0.0',
        type: 'info'
      })
    }

    const handleLogout = () => {
      localStorage.removeItem('user')
      ElMessage.success('已退出登录')
      router.push('/login')
    }

    const navigateToPage = (path) => {
      // 确保路径以 /student 开头
      if (!path.startsWith('/student/')) {
        path = '/student' + path
      }
      router.push(path)
    }

    const handleMenuClick = (command) => {
      switch (command) {
        case 'transactions':
          navigateToPage('/transactions')
          break
        case 'favorites':
          navigateToPage('/favorites')
          break
        case 'reviews':
          navigateToPage('/reviews')
          break
        case 'notification-settings':
          navigateToPage('/notification-settings')
          break
        case 'preferences':
          navigateToPage('/preferences')
          break
        case 'my-feedbacks':
          navigateToPage('/my-feedbacks')
          break
        default:
          console.warn(`未处理的菜单命令: ${command}`)
          break
      }
    }

    const profileEditVisible = ref(false)
    const profileForm = ref({
      avatar: '',
      name: '',
      phone: '',
      email: ''
    })

    const showEditProfile = () => {
      profileForm.value = {
        avatar: userInfo.value.avatar,
        name: userInfo.value.name,
        phone: userInfo.value.phone || '',
        email: userInfo.value.email || ''
      }
      profileEditVisible.value = true
    }

    const handleAvatarChange = (file) => {
      // 这里应该处理头像上传
      profileForm.value.avatar = URL.createObjectURL(file.raw)
    }

    const updateProfile = () => {
      // 这里应该调用API更新用户信息
      userInfo.value = {
        ...userInfo.value,
        avatar: profileForm.value.avatar,
        name: profileForm.value.name,
        phone: profileForm.value.phone,
        email: profileForm.value.email
      }
      ElMessage.success('个人信息更新成功')
      profileEditVisible.value = false
    }

    return {
      userInfo,
      rechargeVisible,
      rechargeForm,
      feedbackVisible,
      feedbackForm,
      canteens,
      showRecharge,
      handleRecharge,
      showFeedbackDialog,
      handleImageChange,
      submitFeedback,
      showAbout,
      handleLogout,
      getWindows,
      navigateToPage,
      handleMenuClick,
      profileEditVisible,
      profileForm,
      showEditProfile,
      handleAvatarChange,
      updateProfile
    }
  }
}
</script>

<style scoped>
.user-profile {
  padding: 16px;
}

.user-info-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.info-content {
  margin-left: 16px;
}

.info-content h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  display: inline-block;
}

.info-content p {
  margin: 6px 0 0;
  color: #666;
  font-size: 14px;
}

.balance-info {
  display: flex;
  justify-content: space-around;
  padding-top: 16px;
  border-top: 1px solid #f5f5f5;
}

.balance-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.balance-item .amount {
  font-size: 20px;
  font-weight: 600;
  color: var(--el-color-primary);
}

.balance-item .label {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.menu-list {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.logout-button {
  padding: 20px;
  text-align: center;
}

.recharge-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.recharge-option {
  padding: 12px;
  text-align: center;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.recharge-option.active {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

:deep(.el-upload--picture-card) {
  width: 100px;
  height: 100px;
  line-height: 100px;
}

.menu-card {
  margin-bottom: 16px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.menu-item:hover {
  background-color: #f5f7fa;
}

.menu-item:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}

.menu-icon {
  width: 24px;
  height: 24px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #409EFF;
}


.menu-value {
  color: #909399;
  font-size: 14px;
}

.edit-btn {
  margin-left: auto;
}

.avatar-uploader {
  text-align: center;
}

.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
}

.avatar-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.name-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-btn {
  padding: 4px 8px;
  height: 28px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  border-radius: 4px;
  transition: all 0.3s;
}

.edit-btn:hover {
  background-color: var(--el-color-primary-light-9);
}

.edit-btn .el-icon {
  font-size: 14px;
}

.edit-text {
  margin-left: 2px;
}
</style> 