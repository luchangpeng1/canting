<template>
  <div class="notification-settings">
    <back-header title="通知设置" />
    <el-card>
      <template #header>
        <div class="card-header">
          <span>通知设置</span>
        </div>
      </template>
      
      <el-form :model="settings" label-width="120px">
        <h4>订单通知</h4>
        <el-form-item label="订单状态变更">
          <el-switch v-model="settings.orderStatus" />
        </el-form-item>
        <el-form-item label="订单催促">
          <el-switch v-model="settings.orderReminder" />
        </el-form-item>
        
        <el-divider />
        
        <h4>优惠活动</h4>
        <el-form-item label="新品上架">
          <el-switch v-model="settings.newDish" />
        </el-form-item>
        <el-form-item label="优惠活动">
          <el-switch v-model="settings.promotion" />
        </el-form-item>
        
        <el-divider />
        
        <h4>提醒方式</h4>
        <el-form-item label="声音提醒">
          <el-switch v-model="settings.sound" />
        </el-form-item>
        <el-form-item label="振动提醒">
          <el-switch v-model="settings.vibration" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="saveSettings" :loading="saving">
            保存设置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import BackHeader from '../components/BackHeader.vue'

export default {
  name: 'NotificationSettings',
  components: { BackHeader },
  setup() {
    const settings = reactive({
      orderStatus: true,
      orderReminder: true,
      newDish: true,
      promotion: true,
      sound: true,
      vibration: true
    })
    
    const saving = ref(false)
    
    const saveSettings = async () => {
      saving.value = true
      try {
        // 这里应该调用API保存设置
        await new Promise(resolve => setTimeout(resolve, 1000))
        ElMessage.success('设置已保存')
      } catch (error) {
        ElMessage.error('保存失败')
      } finally {
        saving.value = false
      }
    }
    
    return {
      settings,
      saving,
      saveSettings
    }
  }
}
</script>

<style scoped>
.notification-settings {
  padding: 16px;
}

h4 {
  margin: 0 0 20px;
  color: #606266;
}

.el-divider {
  margin: 24px 0;
}
</style> 