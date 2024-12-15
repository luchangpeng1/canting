<template>
  <div class="login-container">
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <div class="login-box">
      <div class="school-info">
        <div class="top-section">
          <img src="https://ts1.cn.mm.bing.net/th/id/R-C.01105e6f89184c277c662f33cd977751?rik=yt%2btmFKbjD8EVg&riu=http%3a%2f%2ftqedu.net%2fUploadFiles%2f2020%2f12%2f202012101555445729.png&ehk=%2fViGN%2b4wOxRaLLnLMUSFsczf60lAW2Ycm8qzXmB7MWQ%3d&risl=&pid=ImgRaw&r=0" alt="桂林电子科技大学" class="school-logo">
          <h1 class="school-name">桂林电子科技大学</h1>
          <h2 class="system-name">智慧食堂管理系统</h2>
        </div>
        
        <div class="mobile-login">
          <el-card class="login-card">
            <div class="login-header">
              <h2>{{ isLogin ? '账号登录' : '注册新用户' }}</h2>
              <p class="subtitle">{{ isLogin ? 'GUET智慧食堂' : '欢迎加入智慧食堂' }}</p>
            </div>
            
            <el-form 
              :model="form" 
              label-position="top" 
              class="login-form"
              :rules="rules"
              ref="formRef">
              <el-form-item 
                v-if="isLogin" 
                label="登录身份" 
                prop="userType">
                <el-select 
                  v-model="form.userType" 
                  placeholder="请选择登录身份"
                  class="user-type-select">
                  <el-option 
                    label="学生" 
                    value="student">
                    <div class="select-option">
                      <el-icon><User /></el-icon>
                      <span>学生</span>
                    </div>
                  </el-option>
                  <el-option 
                    label="系统管理员" 
                    value="admin">
                    <div class="select-option">
                      <el-icon><Setting /></el-icon>
                      <span>系统管理员</span>
                    </div>
                  </el-option>
                  <el-option 
                    label="窗口管理员" 
                    value="window_admin">
                    <div class="select-option">
                      <el-icon><Shop /></el-icon>
                      <span>窗口管理员</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
              
              <el-form-item 
                v-if="!isLogin" 
                label="选择身份" 
                prop="userType">
                <el-select 
                  v-model="form.userType" 
                  placeholder="请选择您的身份"
                  class="user-type-select">
                  <el-option 
                    label="学生" 
                    value="student">
                    <div class="select-option">
                      <el-icon><User /></el-icon>
                      <span>学生</span>
                    </div>
                  </el-option>
                  <el-option 
                    label="系统管理员" 
                    value="admin">
                    <div class="select-option">
                      <el-icon><Setting /></el-icon>
                      <span>系统管理员</span>
                    </div>
                  </el-option>
                  <el-option 
                    label="窗口管理员" 
                    value="window_admin">
                    <div class="select-option">
                      <el-icon><Shop /></el-icon>
                      <span>窗口管理员</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
              
              <el-form-item 
                :label="isLogin ? '学号/工号' : '请输入学号/工号'" 
                prop="username">
                <el-input 
                  v-model="form.username" 
                  :placeholder="isLogin ? '请输入学号/工号' : '学号为10位数字，工号为5位数字'"
                  prefix-icon="User">
                </el-input>
              </el-form-item>
              
              <el-form-item 
                :label="isLogin ? '密码' : '设置密码'" 
                prop="password">
                <el-input 
                  v-model="form.password" 
                  type="password" 
                  :placeholder="isLogin ? '请输入密码' : '密码长度不少于6位'"
                  prefix-icon="Lock"
                  show-password>
                </el-input>
              </el-form-item>

              <el-form-item 
                v-if="!isLogin" 
                label="确认密码" 
                prop="confirmPassword">
                <el-input 
                  v-model="form.confirmPassword" 
                  type="password" 
                  placeholder="请再次输入密码"
                  prefix-icon="Lock"
                  show-password>
                </el-input>
              </el-form-item>

              <div class="form-actions">
                <el-button 
                  type="primary" 
                  @click="handleSubmit"
                  :loading="loading"
                  class="submit-btn">
                  {{ isLogin ? '登 录' : '注 册' }}
                </el-button>
                
                <div class="toggle-mode">
                  <el-button 
                    link
                    @click="toggleMode"
                    class="toggle-btn">
                    {{ isLogin ? '没有账号？去注册' : '已有账号？去登录' }}
                  </el-button>
                </div>
              </div>
            </el-form>

            <div v-if="isLogin" class="qr-login">
              <div class="divider">
                <span>或</span>
              </div>
              <el-button 
                class="qr-btn"
                plain
                @click="showQRCode">
                <el-icon><Promotion /></el-icon>
                扫码登录
              </el-button>
            </div>
          </el-card>
        </div>
        
        <div class="bottom-section">
          <div class="school-features">
            <div class="feature-item">
              <el-icon><Monitor /></el-icon>
              <span>信息化管理</span>
            </div>
            <div class="feature-item">
              <el-icon><DataLine /></el-icon>
              <span>智能分析</span>
            </div>
            <div class="feature-item">
              <el-icon><Service /></el-icon>
              <span>便捷服务</span>
            </div>
          </div>
          <div class="guet-features">
            <div class="feature-card">
              <el-icon><Location /></el-icon>
              <span>金鸡岭校区</span>
              <small>桂林市七星区金鸡路1号</small>
            </div>
            <div class="feature-card">
              <el-icon><School /></el-icon>
              <span>花江校区</span>
              <small>灵川县</small>
            </div>
            <div class="feature-card">
              <el-icon><Trophy /></el-icon>
              <span>双一流建设高校</span>
              <small>电子信息特色鲜明</small>
            </div>
          </div>
          <div class="school-motto">
            <h3>厚德、博学、求是、创新</h3>
          </div>
          <div class="slogan-container">
            <transition name="fade" mode="out-in">
              <p :key="currentSlogan" class="slogan">{{ currentSlogan }}</p>
            </transition>
          </div>
        </div>
      </div>

      <el-card class="login-card">
        <div class="login-header">
          <h2>{{ isLogin ? '账号登录' : '注册新用户' }}</h2>
          <p class="subtitle">{{ isLogin ? 'GUET智慧食堂' : '欢迎加入智慧食堂' }}</p>
        </div>
        
        <el-form 
          :model="form" 
          label-position="top" 
          class="login-form"
          :rules="rules"
          ref="formRef">
          <el-form-item 
            v-if="isLogin" 
            label="登录身份" 
            prop="userType">
            <el-select 
              v-model="form.userType" 
              placeholder="请选择登录身份"
              class="user-type-select">
              <el-option 
                label="学生" 
                value="student">
                <div class="select-option">
                  <el-icon><User /></el-icon>
                  <span>学生</span>
                </div>
              </el-option>
              <el-option 
                label="系统管理员" 
                value="admin">
                <div class="select-option">
                  <el-icon><Setting /></el-icon>
                  <span>系统管理员</span>
                </div>
              </el-option>
              <el-option 
                label="窗口管理员" 
                value="window_admin">
                <div class="select-option">
                  <el-icon><Shop /></el-icon>
                  <span>窗口管理员</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item 
            v-if="!isLogin" 
            label="选择身份" 
            prop="userType">
            <el-select 
              v-model="form.userType" 
              placeholder="请选择您的身份"
              class="user-type-select">
              <el-option 
                label="学生" 
                value="student">
                <div class="select-option">
                  <el-icon><User /></el-icon>
                  <span>学生</span>
                </div>
              </el-option>
              <el-option 
                label="系统管理员" 
                value="admin">
                <div class="select-option">
                  <el-icon><Setting /></el-icon>
                  <span>系统管理员</span>
                </div>
              </el-option>
              <el-option 
                label="窗口管理员" 
                value="window_admin">
                <div class="select-option">
                  <el-icon><Shop /></el-icon>
                  <span>窗口管理员</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item 
            :label="isLogin ? '学号/工号' : '请输入学号/工号'" 
            prop="username">
            <el-input 
              v-model="form.username" 
              :placeholder="isLogin ? '请输入学号/工号' : '学号为10位数字，工号为5位数字'"
              prefix-icon="User">
            </el-input>
          </el-form-item>
          
          <el-form-item 
            :label="isLogin ? '密码' : '设置密码'" 
            prop="password">
            <el-input 
              v-model="form.password" 
              type="password" 
              :placeholder="isLogin ? '请输入密码' : '密码长度不少于6位'"
              prefix-icon="Lock"
              show-password>
            </el-input>
          </el-form-item>

          <el-form-item 
            v-if="!isLogin" 
            label="确认密码" 
            prop="confirmPassword">
            <el-input 
              v-model="form.confirmPassword" 
              type="password" 
              placeholder="请再次输入密码"
              prefix-icon="Lock"
              show-password>
            </el-input>
          </el-form-item>

          <div class="form-actions">
            <el-button 
              type="primary" 
              @click="handleSubmit"
              :loading="loading"
              class="submit-btn">
              {{ isLogin ? '登 录' : '注 册' }}
            </el-button>
            
            <div class="toggle-mode">
              <el-button 
                link
                @click="toggleMode"
                class="toggle-btn">
                {{ isLogin ? '没有账号？去注册' : '已有账号？去登录' }}
              </el-button>
            </div>
          </div>
        </el-form>

        <div v-if="isLogin" class="qr-login">
          <div class="divider">
            <span>或</span>
          </div>
          <el-button 
            class="qr-btn"
            plain
            @click="showQRCode">
            <el-icon><Promotion /></el-icon>
            扫码登录
          </el-button>
        </div>
      </el-card>
    </div>

    <div class="footer">
      <div class="footer-content">
        <p>Copyright © {{ new Date().getFullYear() }} 桂林电子科技大学</p>
        <p>地址:桂林市七星区金鸡路1号</p>
      </div>
    </div>

    <el-dialog
      v-model="qrDialogVisible"
      title="微信扫码登录"
      width="400px"
      align-center
      :show-close="true"
      class="qr-dialog"
      :close-on-click-modal="false">
      <div class="qr-container">
        <div class="qr-wrapper">
          <img :src="qrCodeUrl" alt="微信扫码登录" class="qr-image">
          <div class="qr-overlay">
            <el-icon class="refresh-icon" @click="refreshQRCode"><Refresh /></el-icon>
            <span>点击刷新二维码</span>
          </div>
        </div>
        <p class="qr-tip">请使用微信扫一扫登录</p>
        <p class="qr-status">{{ qrStatus }}</p>
        <div class="qr-help">
          <el-icon><InfoFilled /></el-icon>
          <span>首次使用需要绑定微信账号</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { isMobile } from '@/utils/device'
import { 
  User, 
  Setting, 
  Monitor, 
  DataLine, 
  Service, 
  Shop,
  Promotion,
  Location,
  School,
  Trophy,
  InfoFilled,
  Refresh,
  Message,
  Lock
} from '@element-plus/icons-vue'
import http from '@/utils/request'
import Result from '@/utils/result'
import Validator from '@/utils/validator'

// 静态测试账号
const testAccounts = [
  {
    username: '2200000001',  // 学生测试账号
    password: '123456',
    userType: 'student',
    realName: '测试学生',
    verifiedInfo: {
      role: 'student'
    }
  },
  {
    username: '00001',    // PC端系统管理员
    password: '123456', 
    userType: 'admin',
    realName: '系统管理员',
    verifiedInfo: {
      role: 'admin',
      permissions: ['all']
    }
  },
  {
    username: '123456',   // 移动端窗口管理员
    password: '123456',
    userType: 'window_admin',
    realName: '窗口管理员',
    verifiedInfo: {
      role: 'window_admin',
      canteen: { 
        id: 1, 
        name: '中央食堂'
      },
      window: { 
        id: 101, 
        name: '大荤窗口',
        floor: 1,
        type: '大荤窗口',
        operatingHours: '10:30-13:30, 16:30-19:00'
      }
    }
  }
]

export default {
  name: 'Login',
  components: {
    User,
    Setting,
    Monitor,
    DataLine,
    Service,
    Shop,
    Promotion,
    Location,
    School,
    Trophy,
    InfoFilled,
    Refresh,
    Message,
    Lock
  },
  setup() {
    const router = useRouter()
    const formRef = ref(null)
    const isLogin = ref(true)
    const loading = ref(false)
    
    const form = reactive({
      username: '',
      password: '',
      confirmPassword: '',
      userType: ''
    })

    // 修改验证规则部分
    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { 
          validator: (rule, value, callback) => {
            if (!value) {
              callback();
              return;
            }
            
            if (form.userType === 'student') {
              if (!/^\d{10}$/.test(value)) {
                callback(new Error('学号必须是10位数字'));
                return;
              }
            } else if (form.userType === 'admin' || form.userType === 'window_admin') {
              if (!/^\d{5}$/.test(value)) {
                callback(new Error('工号必须是5位数字'));
                return;
              }
            }
            callback();
          },
          trigger: ['blur', 'change']
        }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (!value) {
              callback();
              return;
            }
            
            // 登录模式下不验证密码复杂度
            if (isLogin.value) {
              callback();
              return;
            }
            
            // 注册模式下验证密码复杂度
            const hasNumber = /\d/.test(value);
            const hasLetter = /[a-zA-Z]/.test(value);
            
            if (!hasNumber || !hasLetter) {
              callback(new Error('密码必须包含数字和字母'));
              return;
            }
            
            callback();
          },
          trigger: ['blur', 'change']
        }
      ],
      confirmPassword: [
        { 
          validator: (rule, value, callback) => {
            if (!isLogin.value && !value) {
              callback(new Error('请确认密码'));
              return;
            }
            if (value !== form.password) {
              callback(new Error('两次输入的密码不一致'));
              return;
            }
            callback();
          },
          trigger: ['blur', 'change']
        }
      ],
      userType: [
        { required: true, message: '请选择登录身份', trigger: 'change' }
      ]
    }

    // 切换登录/注册模式
    const toggleMode = () => {
      isLogin.value = !isLogin.value
      form.username = ''
      form.password = ''
      form.confirmPassword = ''
      if (formRef.value) {
        formRef.value.clearValidate()
      }
    }

    // 处理登录
    const handleLogin = async (loginData) => {
      try {
        loading.value = true

        // 真实后端登录请求
        const response = await http.post('/auth/login', {
          username: loginData.username,
          password: loginData.password, 
          userType: loginData.userType
        })

        console.log('登录响应数据:', response)

        if (response.code === Result.CODE.SUCCESS) {
          // 构造标准格式的用户信息对象
          const userInfo = {
            username: loginData.username,
            userType: loginData.userType,
            verifiedInfo: {
              role: loginData.userType === 'admin' ? 'superadmin' : 
                    loginData.userType === 'window_admin' ? 'window_admin' : 'student'
            },
            ...response.data
          }
          
          console.log('存储的用户信息:', userInfo)
          
          localStorage.setItem('user', JSON.stringify(userInfo))
          localStorage.setItem('token', response.data.token)
          
          ElMessage.success('登录成功')

          // 移除设备类型限制,直接根据角色跳转
          switch(userInfo.verifiedInfo.role) {
            case 'superadmin':
              await router.push('/admin/dishes')
              break
            
            case 'window_admin':
              await router.push('/m/admin/orders')
              break
              
            case 'student':
              await router.push('/student/home')
              break
              
            default:
              console.error('未知的用户类型:', userInfo.verifiedInfo.role)
              ElMessage.error('用户类型错误')
              return
          }

          return Result.success(response.data)
        } else {
          ElMessage.error(response.message || '登录失败')
          return Result.error(response.message || '登录失败')
        }
      } catch (error) {
        console.error('登录失败:', error)
        return Result.serviceError(error.message)
      } finally {
        loading.value = false
      }
    }

    // 处理注册
    const handleRegister = async (registerData) => {
      try {
        loading.value = true

        // 验证用户名
        if (registerData.userType === 'student') {
          if (!/^\d{10}$/.test(registerData.username)) {
            ElMessage.error('请输入10位数字学号')
            return Result.paramError('请输入10位数字学号')
          }
        } else if (registerData.userType === 'admin' || registerData.userType === 'window_admin') {  // 添加窗口管理员验证
          if (!/^\d{5}$/.test(registerData.username)) {
            ElMessage.error('请输入5位数字工号')
            return Result.paramError('请输入5位数字工号')
          }
        }

        // 验证密码
        const passwordValidation = Validator.validatePassword(registerData.password)
        if (!passwordValidation.valid) {
          ElMessage.error(passwordValidation.message)
          return Result.paramError(passwordValidation.message)
        }

        // 真实后端注册请求
        try {
          const response = await http.post('/auth/register', {
            username: registerData.username,
            password: registerData.password,
            userType: registerData.userType
          })
          
          if (response.code === Result.CODE.SUCCESS) {
            ElMessage.success('注册成功，请登录')
            isLogin.value = true
            // 清空表单
            form.username = ''
            form.password = ''
            form.confirmPassword = ''
            form.userType = ''
            return Result.success()
          }
        } catch (error) {
          console.error('注册请求错误:', error.response?.data)
          if (error.response?.status === 409) {
            ElMessage.error('该账号已被注册')
          } else if (error.response?.status === 500) {
            ElMessage.error('服务器错误: ' + (error.response.data?.message || '注册失败'))
          } else {
            ElMessage.error(error.response?.data?.message || '注册失败，请重试')
          }
          return Result.serviceError(error.message)
        }
      } catch (error) {
        console.error('注册失败:', error)
        ElMessage.error('注册失败，请重试')
        return Result.serviceError(error.message)
      } finally {
        loading.value = false
      }
    }

    // 处理提交
    const handleSubmit = async () => {
      if (!formRef.value) return
      
      try {
        await formRef.value.validate()
        
        const submitData = {
          username: form.username,
          password: form.password,
          userType: form.userType  // 确保这里正确获取了userType
        }

        console.log('提交数据:', submitData) // 添加调试日志

        const result = isLogin.value ? 
          await handleLogin(submitData) : 
          await handleRegister(submitData)

        if (!result.success) {
          ElMessage.error(result.message)
        }
      } catch (error) {
        console.error('表单验证失败:', error)
        return Result.paramError(error.message)
      }
    }

    // 添加动态标语
    const slogans = [
      "智慧校园，美食相伴",
      "科技创新，服务师生",
      "便捷订餐，品质生活"
    ]
    const currentSlogan = ref(slogans[0])
    
    // 定时切换标语
    onMounted(() => {
      let index = 0
      setInterval(() => {
        index = (index + 1) % slogans.length
        currentSlogan.value = slogans[index]
      }, 3000)
    })

    // 微信扫码登录相关
    const qrDialogVisible = ref(false)
    const qrCodeUrl = ref('')
    const qrStatus = ref('等待扫码')
    let scanTimer = null

    // 获取微信登录二维码
    const getWechatQRCode = async () => {
      try {
        const response = await http.get('/auth/wechat/qrcode')
        if (response.code === 200) {
          qrCodeUrl.value = response.data.qrCode
          return response.data.sceneId
        } else {
          ElMessage.error(response.message || '获取二维码失败')
        }
      } catch (error) {
        console.error('获取二维码失败:', error)
        ElMessage.error('获取二维码失败，请重试')
        return null
      }
    }

    // 轮询扫码状态
    const pollScanStatus = async (sceneId) => {
      try {
        const response = await http.get('/auth/wechat/scan/status', {
          params: { sceneId }
        })
        
        if (response.code === 200) {
          const statusMessages = [
            '等待扫码',
            '已扫码，请在手机上确认',
            '登录成功',
            '已取消',
            '已过期'
          ]
          qrStatus.value = statusMessages[response.data.status]
          
          if (response.data.status === 2) { // 登录成功
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('refreshToken', response.data.refreshToken)
            localStorage.setItem('user', JSON.stringify(response.data.userInfo))
            ElMessage.success('登录成功')
            qrDialogVisible.value = false
            clearInterval(scanTimer)
            
            // 根据用户类型跳转
            const userInfo = response.data.userInfo
            const redirect = router.currentRoute.value.query.redirect || 
              (userInfo.userType === 'admin' ? '/admin/dishes' : '/student/home')
            router.push(redirect)
          } else if (response.data.status === 3 || response.data.status === 4) {
            clearInterval(scanTimer)
          }
        }
      } catch (error) {
        console.error('查询状态失败:', error)
        clearInterval(scanTimer)
        ElMessage.error('查询状态失败，请重试')
      }
    }

    // 显示二维码对话框
    const showQRCode = async () => {
      qrDialogVisible.value = true
      qrStatus.value = '等待扫码'
      
      try {
        const sceneId = await getWechatQRCode()
        if (sceneId) {
          // 开始轮询扫码状态
          scanTimer = setInterval(() => pollScanStatus(sceneId), 2000)
        }
      } catch (error) {
        console.error('显示二维码失败:', error)
        ElMessage.error('显示二维码失败，请重试')
      }
    }

    // 刷新二维码
    const refreshQRCode = async () => {
      if (scanTimer) {
        clearInterval(scanTimer)
      }
      qrStatus.value = '等待扫码'
      await showQRCode()
    }

    // 在组件卸载时清理定时器
    onUnmounted(() => {
      if (scanTimer) {
        clearInterval(scanTimer)
      }
    })

    return {
      formRef,
      isLogin,
      form,
      rules,
      loading,
      toggleMode,
      handleSubmit,
      currentSlogan,
      qrDialogVisible,
      qrCodeUrl,
      qrStatus,
      showQRCode,
      refreshQRCode
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  padding: 40px 20px 20px;
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('https://ts1.cn.mm.bing.net/th/id/R-C.a6ef5726d7f4ffb84e4de15b51efb532?rik=oHaq9K%2fPPHVl7g&riu=http%3a%2f%2fzhaopin.91boshi.net%2fhtml%2fglietedu%2ftop.jpg&ehk=k3Hoczlqs7TgmmXtHlkKkFsUKPkiXWkYNi%2bU4wdLtRo%3d&risl=&pid=ImgRaw&r=0');
  background-size: cover;
  background-position: center;
  opacity: 0.1;
  z-index: 0;
}

.login-box {
  position: relative;
  width: 100%;
  max-width: 1000px;
  display: flex;
  gap: 40px;
  z-index: 1;
  animation: fadeIn 0.5s ease-out;
  margin: 0 auto;
  flex: 1;
  min-height: 600px;
}

.school-info {
  flex: 1;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.school-logo {
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
}

.school-name {
  font-size: 32px;
  margin-bottom: 16px;
  font-weight: 500;
  letter-spacing: 2px;
}

.system-name {
  font-size: 24px;
  opacity: 0.9;
  font-weight: 400;
}

.login-card {
  flex: 1;
  max-width: 460px;
  height: fit-content;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  align-self: center;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
  padding-top: 20px;
}

.login-header h2 {
  font-size: 28px;
  color: #1e3c72;
  margin: 0 0 8px;
  font-weight: 500;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
  letter-spacing: 1px;
}

.login-form {
  padding: 0 40px 10px;
}

.el-form-item {
  margin-bottom: 24px;
}

:deep(.el-input__wrapper) {
  box-shadow: none !important;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  transition: all 0.3s;
  padding: 12px;
  background: rgba(255, 255, 255, 0.8);
}

:deep(.el-input__wrapper:hover) {
  border-color: #1e3c72;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #1e3c72;
  box-shadow: 0 0 0 2px rgba(30, 60, 114, 0.1) !important;
}

.user-type-select {
  width: 100%;
}

:deep(.el-select .el-input__wrapper) {
  box-shadow: none !important;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  transition: all 0.3s;
}

:deep(.el-select .el-input__wrapper:hover) {
  border-color: #1e3c72;
}

:deep(.el-select .el-input__wrapper.is-focus) {
  border-color: #1e3c72;
  box-shadow: 0 0 0 2px rgba(30, 60, 114, 0.1) !important;
}

:deep(.el-select-dropdown__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-select-dropdown__item .el-icon) {
  margin-right: 8px;
  font-size: 16px;
}

.form-actions {
  margin-top: 32px;
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 18px;
  border-radius: 8px;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  border: none;
  transition: all 0.3s;
  letter-spacing: 2px;
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(30, 60, 114, 0.3);
}

.toggle-mode {
  text-align: center;
  margin-top: 16px;
}

.toggle-btn {
  font-size: 14px;
  color: #1e3c72;
  padding: 0;
}

.toggle-btn:hover {
  color: #2a5298;
}

.footer {
  position: relative;
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  padding: 15px 0;
  z-index: 10;
  margin-top: 20px;
}

.footer-content {
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
}

.footer-content p {
  margin: 5px 0;
  line-height: 1.5;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .login-container {
    padding: 20px;
  }

  .login-box {
    flex-direction: column;
    align-items: center;
    max-width: 460px;
    gap: 20px;
    min-height: auto;
  }

  .school-info {
    padding: 10px;
  }

  .school-name {
    font-size: 24px;
  }

  .system-name {
    font-size: 18px;
  }

  .school-features {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .feature-item {
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 10px;
  }

  .login-box {
    margin: 0 10px;
  }

  .login-header h2 {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
  }

  .login-form {
    padding: 0 20px 20px;
  }

  .school-logo {
    width: 80px;
    height: 80px;
  }

  .school-features {
    grid-template-columns: repeat(1, 1fr);
    gap: 10px;
  }

  .footer {
    padding: 10px 0;
  }

  .footer-content {
    font-size: 12px;
  }
}

.bg-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(30, 60, 114, 0.2), rgba(42, 82, 152, 0.2));
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  left: -100px;
}

.circle-2 {
  width: 500px;
  height: 500px;
  bottom: -200px;
  right: -200px;
}

.circle-3 {
  width: 200px;
  height: 200px;
  top: 40%;
  left: 30%;
}

.school-features {
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgba(255, 255, 255, 0.9);
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(5px);
  transition: transform 0.3s;
}

.feature-item:hover {
  transform: translateY(-5px);
}

.feature-item .el-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.qr-login {
  margin-top: 20px;
  text-align: center;
}

.divider {
  display: flex;
  align-items: center;
  margin: 20px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #dcdfe6;
}

.divider span {
  padding: 0 15px;
  color: #909399;
  font-size: 14px;
}

.qr-btn {
  width: 100%;
  height: 40px;
  border: 1px dashed #dcdfe6;
  color: #606266;
  transition: all 0.3s;
  background: transparent;
}

.qr-btn:hover {
  border-color: #1e3c72;
  color: #1e3c72;
}

.qr-btn .el-icon {
  margin-right: 8px;
}

/* 波浪动画 */
.wave-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  overflow: hidden;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: url('path-to-wave.svg') repeat-x;
  animation: wave 10s linear infinite;
}

.wave1 { opacity: 0.3; }
.wave2 { 
  animation-delay: -5s;
  opacity: 0.2;
}
.wave3 { 
  animation-delay: -2s;
  opacity: 0.1;
}

@keyframes wave {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* 粒子效果 */
.particles {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: float 20s linear infinite;
}

@keyframes float {
  0% { transform: translateY(0) translateX(0); }
  100% { transform: translateY(-100vh) translateX(100vw); }
}

/* 标动画 */
.slogan-container {
  margin-top: 20px;
  height: 30px;
}

.slogan {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 优化输入框焦点效果 */
:deep(.el-input__wrapper) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.el-input__wrapper.is-focus) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 60, 114, 0.15) !important;
}

/* 添加登录按钮呼吸效果 */
.submit-btn {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(30, 60, 114, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(30, 60, 114, 0); }
  100% { box-shadow: 0 0 0 0 rgba(30, 60, 114, 0); }
}

/* 优化特性卡片 */
.feature-item {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-item:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* 添加加载动画 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1e3c72;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.select-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.select-option .el-icon {
  font-size: 16px;
}

.select-option span {
  font-size: 14px;
}

.guet-features {
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  width: 100%;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
}

.feature-card .el-icon {
  font-size: 24px;
  color: #fff;
  margin-bottom: 8px;
}

.feature-card span {
  display: block;
  font-size: 16px;
  color: #fff;
  margin-bottom: 4px;
}

.feature-card small {
  display: block;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.school-motto {
  margin-top: 30px;
  text-align: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(5px);
}

.school-motto h3 {
  color: #fff;
  font-size: 20px;
  font-weight: normal;
  letter-spacing: 2px;
  margin: 0;
}

/* 添加背景水印 */
.login-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('path-to-guet-logo.png'); /* 需要添加学校logo图片 */
  background-repeat: repeat;
  background-size: 200px;
  opacity: 0.03;
  pointer-events: none;
  z-index: 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .login-box {
    flex-direction: column;
  }

  .school-info {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .mobile-login {
    display: block;
    order: 2;
    margin: 20px 0;
  }

  /* 隐藏原来的登录卡片 */
  .login-box > .login-card {
    display: none;
  }

  .top-section {
    order: 1;
  }

  .bottom-section {
    order: 3;
  }

  .school-features {
    margin-top: 20px;
  }

  .guet-features {
    grid-template-columns: 1fr;
  }

  .school-motto h3 {
    font-size: 16px;
  }
}

.mobile-login {
  display: none;
}

.login-card {
  flex: 1;
  max-width: 460px;
  height: fit-content;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  align-self: center;
}

@media (max-width: 768px) {
  .login-box {
    flex-direction: column;
  }

  .school-info {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .mobile-login {
    display: block;
    order: 2;
    margin: 20px 0;
  }

  /* 隐藏原来的登录卡片 */
  .login-box > .login-card {
    display: none;
  }

  .top-section {
    order: 1;
  }

  .bottom-section {
    order: 3;
  }

  .school-features {
    margin-top: 20px;
  }

  .guet-features {
    grid-template-columns: 1fr;
  }

  .school-motto h3 {
    font-size: 16px;
  }
}

.qr-dialog :deep(.el-dialog__header) {
  padding: 20px 20px 15px;
  margin-right: 0;
  border-bottom: 1px solid #eee;
}

.qr-dialog :deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
}

.qr-dialog :deep(.el-dialog__headerbtn) {
  top: 20px;
}

.qr-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
}

.qr-wrapper {
  width: 240px;
  height: 240px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  position: relative;
  transition: all 0.3s;
}

.qr-wrapper:hover .qr-overlay {
  opacity: 1;
}

.qr-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: pointer;
  border-radius: 12px;
}

.refresh-icon {
  font-size: 24px;
  color: #409EFF;
  margin-bottom: 8px;
}

.qr-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.qr-tip {
  margin: 20px 0 8px;
  font-size: 16px;
  color: #606266;
}

.qr-status {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.qr-help {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #909399;
  font-size: 13px;
}

.qr-help .el-icon {
  font-size: 14px;
  color: #909399;
}

/* 添加移动端适配 */
@media (max-width: 768px) {
  .qr-dialog :deep(.el-dialog) {
    width: 90% !important;
    margin: 0 auto;
  }

  .qr-wrapper {
    width: 200px;
    height: 200px;
    padding: 12px;
  }

  .qr-tip {
    font-size: 15px;
  }
}
</style> 