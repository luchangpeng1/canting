<template>
  <div class="admin-layout" :class="{ 'mobile': isMobile }">
    <el-dialog
      title="管理员身份验证"
      v-model="verifyDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="500px">
      <el-form 
        :model="verifyForm"
        :rules="verifyRules"
        ref="verifyFormRef"
        label-width="100px">
        <el-form-item label="所属餐厅" prop="canteen">
          <el-select v-model="verifyForm.canteen" placeholder="请选择所属餐厅" class="full-width">
            <el-option
              v-for="canteen in canteens"
              :key="canteen.id"
              :label="canteen.name"
              :value="canteen.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属窗口" prop="window">
          <el-select 
            v-model="verifyForm.window" 
            placeholder="请选择所属窗口"
            :disabled="!verifyForm.canteen"
            class="full-width">
            <el-option
              v-for="window in availableWindows"
              :key="window.id"
              :label="window.name"
              :value="window.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleVerify" :loading="verifying">
          确认身份
        </el-button>
      </template>
    </el-dialog>

    <el-container>
      <el-aside :width="isMobile ? (isCollapse ? '64px' : '200px') : '240px'" class="aside">
        <div class="logo-container">
          <img src="https://ts1.cn.mm.bing.net/th/id/R-C.01105e6f89184c277c662f33cd977751?rik=yt%2btmFKbjD8EVg&riu=http%3a%2f%2ftqedu.net%2fUploadFiles%2f2020%2f12%2f202012101555445729.png&ehk=%2fViGN%2b4wOxRaLLnLMUSFsczf60lAW2Ycm8qzXmB7MWQ%3d&risl=&pid=ImgRaw&r=0" 
               alt="GUET" 
               class="logo">
          <h1 class="title">智慧食堂管理系统</h1>
        </div>
        
        <el-menu 
          router 
          :default-active="$route.path"
          class="menu"
          :background-color="settingsForm.navColor"
          text-color="#fff"
          active-text-color="#ffd04b">
          <!-- 基础菜单项 -->
          <el-menu-item index="/admin/dishes">
            <el-icon><Dish /></el-icon>
            <span>菜品管理</span>
          </el-menu-item>
          
          <el-menu-item index="/admin/menus">
            <el-icon><Calendar /></el-icon>
            <span>菜单管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/orders">
            <el-icon><List /></el-icon>
            <span>订单管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/windows">
            <el-icon><Shop /></el-icon>
            <span>窗口管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/dashboard">
            <el-icon><DataBoard /></el-icon>
            <span>数据看板</span>
          </el-menu-item>
          <el-menu-item index="/admin/inventory">
            <el-icon><Box /></el-icon>
            <span>库存管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/staff">
            <el-icon><User /></el-icon>
            <span>员工管理</span>
          </el-menu-item>

        </el-menu>
      </el-aside>

      <el-container>
        <el-header class="header" :class="{ 'mobile': isMobile }">
          <div class="header-left">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/admin/dishes' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{ getCurrentMenuTitle() }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <el-dropdown trigger="click" @command="handleCommand">
              <span class="user-info">
                <el-avatar 
                  :size="32" 
                  :src="profileForm.avatar" 
                  :icon="profileForm.avatar ? '' : 'UserFilled'" />
                <span class="username">{{ profileForm.username }}</span>
                <el-icon><CaretBottom /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">
                    <el-icon><User /></el-icon>
                    个人信息
                  </el-dropdown-item>
                  <el-dropdown-item command="password">
                    <el-icon><Lock /></el-icon>
                    修改密码
                  </el-dropdown-item>
                  <el-dropdown-item command="settings">
                    <el-icon><Setting /></el-icon>
                    系统设置
                  </el-dropdown-item>
                  <el-dropdown-item command="help">
                    <el-icon><QuestionFilled /></el-icon>
                    使用帮助
                  </el-dropdown-item>
                  <el-dropdown-item command="feedback">
                    <el-icon><ChatDotRound /></el-icon>
                    问题反馈
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon><SwitchButton /></el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <el-main class="main" :class="{ 'mobile': isMobile }">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
          <!-- 快捷操作面板 -->
          <el-card class="quick-panel" v-show="showQuickPanel">
            <template #header>
              <div class="quick-panel-header">
                <span>快捷操作</span>
                <el-button link @click="showQuickPanel = false">
                  <el-icon><Close /></el-icon>
                </el-button>
              </div>
            </template>
            <div class="quick-actions">
              <el-button type="primary" @click="quickAdd('dish')">
                <el-icon><Plus /></el-icon>添加菜品
              </el-button>
              <el-button type="success" @click="quickAdd('menu')">
                <el-icon><Plus /></el-icon>添加菜单
              </el-button>
              <el-button type="warning" @click="quickView('orders')">
                <el-icon><List /></el-icon>待处理订单
              </el-button>
              <el-button type="info" @click="quickView('stock')">
                <el-icon><Warning /></el-icon>库存预警
              </el-button>
            </div>
          </el-card>          
        </el-main>

        <el-footer class="footer">
          <p>Copyright © {{ new Date().getFullYear() }} 桂林电子科技大学</p>
        </el-footer>
      </el-container>
    </el-container>

    <!-- 个人信息对话框 -->
    <el-dialog
      title="个人信息"
      v-model="profileDialogVisible"
      width="600px">
      <div class="profile-container">
        <!-- 头像上传部分 -->
        <div class="profile-avatar-section">
          <h4>头像设置</h4>
          <div class="avatar-uploader">
            <input 
              type="file" 
              ref="fileInput"
              accept="image/*"
              style="display: none"
              @change="handleFileChange">
            <div 
              class="upload-area"
              @click="triggerFileInput">
              <img 
                v-if="profileForm.avatar" 
                :src="profileForm.avatar" 
                class="avatar-image"
                @click.stop="previewAvatar">
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </div>
          </div>
          <div class="avatar-tips">点击图片更换头像</div>
        </div>

        <!-- 基本信息部分 -->
        <div class="profile-section">
          <h4>基本信息</h4>
          <el-form :model="profileForm" label-width="100px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="工号">
                  <el-input v-model="profileForm.workId" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="姓名">
                  <el-input v-model="profileForm.name"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="所属餐厅">
                  <el-input v-model="profileForm.canteen" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="管理窗口">
                  <el-input v-model="profileForm.window" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>

        <!-- 联系方式 -->
        <div class="profile-section">
          <h4>联系方��</h4>
          <el-form :model="profileForm" label-width="100px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="手机码">
                  <el-input v-model="profileForm.phone" maxlength="11"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="电子邮箱">
                  <el-input v-model="profileForm.email" type="email"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="紧急联系人">
              <el-input v-model="profileForm.emergencyContact"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <!-- 工作信息 -->
        <div class="profile-section">
          <h4>工作信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="入职时间">{{ profileForm.joinDate }}</el-descriptions-item>
            <el-descriptions-item label="工作状态">
              <el-tag type="success">在职</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="工作时间">{{ profileForm.workHours }}</el-descriptions-item>
            <el-descriptions-item label="休息日">{{ profileForm.restDays }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <template #footer>
        <el-button @click="profileDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveProfile" :loading="saving">保存</el-button>
      </template>
    </el-dialog>

    <!-- 修改密码对话框 -->
    <el-dialog
      title="修改密码"
      v-model="passwordDialogVisible"
      width="500px">
      <el-form 
        :model="passwordForm"
        :rules="passwordRules"
        ref="passwordFormRef"
        label-width="100px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input 
            v-model="passwordForm.oldPassword" 
            type="password"
            placeholder="请输入原密码"
            show-password>
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input 
            v-model="passwordForm.newPassword" 
            type="password"
            placeholder="密码长度不少于6位"
            show-password>
          </el-input>
          <!-- 密码强度指示器 -->
          <div class="password-strength" v-if="passwordForm.newPassword">
            <div class="strength-label">密码强度</div>
            <div class="strength-bars">
              <div 
                v-for="n in 3" 
                :key="n"
                class="strength-bar"
                :class="{ active: passwordStrength >= n }">
              </div>
            </div>
            <span class="strength-text">{{ strengthText }}</span>
          </div>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input 
            v-model="passwordForm.confirmPassword" 
            type="password"
            placeholder="请次输入新密码"
            show-password>
          </el-input>
        </el-form-item>
        <div class="password-tips">
          <h4>密码要求：</h4>
          <ul>
            <li :class="{ valid: hasLength }">长度至少6位</li>
            <li :class="{ valid: hasNumber }">包含数字</li>
            <li :class="{ valid: hasLetter }">包含字母</li>
            <li :class="{ valid: hasSpecial }">包含特殊字符</li>
          </ul>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="changePassword" :loading="changing">
          确认修改
        </el-button>
      </template>
    </el-dialog>

    <!-- 系统设置对话框 -->
    <el-dialog
      title="系统设置"
      v-model="settingsDialogVisible"
      width="800px">
      <el-tabs v-model="activeSettingTab">
        <!-- 主题设置 -->
        <el-tab-pane label="主题设置" name="theme">
          <div class="settings-section">
            <div class="theme-preview">
              <div class="preview-aside" :style="{ background: `var(--nav-background)` }">
                <div class="preview-logo"></div>
                <div class="preview-menu"></div>
              </div>
              <div class="preview-main" :style="{ background: `var(--content-background)` }">
                <div class="preview-header"></div>
                <div class="preview-content">
                  <div class="preview-card"></div>
                  <div class="preview-card"></div>
                </div>
              </div>
            </div>
            
            <div class="theme-settings">
              <div class="color-section">
                <h5>导航栏颜色</h5>
                <div class="color-options">
                  <div
                    v-for="color in themeColors.nav"
                    :key="color.value"
                    class="color-option"
                    :class="{ active: settingsForm.navColor === color.value }"
                    @click="settingsForm.navColor = color.value">
                    <div 
                      class="color-block"
                      :style="{ 
                        background: `linear-gradient(to right, ${color.value}, ${adjustColor(color.value, 20)})` 
                      }">
                    </div>
                    <div class="color-info">
                      <span class="color-name">{{ color.label }}</span>
                      <span class="color-desc">{{ color.description }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="color-section">
                <h5>内容区域颜色</h5>
                <div class="color-options">
                  <div
                    v-for="color in themeColors.content"
                    :key="color.value"
                    class="color-option"
                    :class="{ 
                      active: settingsForm.contentColor === color.value,
                      recommended: getRecommendedContentColors.includes(color.value)
                    }"
                    @click="settingsForm.contentColor = color.value">
                    <div 
                      class="color-block"
                      :style="{ 
                        background: `linear-gradient(to bottom right, ${color.value}, ${adjustColor(color.value, -5)})` 
                      }">
                    </div>
                    <div class="color-info">
                      <span class="color-name">{{ color.label }}</span>
                      <span class="color-desc">{{ color.description }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 界面设置 -->
        <el-tab-pane label="界面设置" name="interface">
          <div class="settings-section">
            <el-form :model="settingsForm" label-width="120px">
              <h4>布局设置</h4>
              <el-form-item label="菜单展开方式">
                <el-radio-group v-model="settingsForm.menuMode">
                  <el-radio label="vertical">垂直展开</el-radio>
                  <el-radio label="horizontal">水平展开</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item label="菜单折叠">
                <el-switch v-model="settingsForm.menuCollapse" />
              </el-form-item>
              
              <el-form-item label="固定头部">
                <el-switch v-model="settingsForm.fixedHeader" />
              </el-form-item>
              
              <el-form-item label="显示面包屑">
                <el-switch v-model="settingsForm.showBreadcrumb" />
              </el-form-item>
              
              <el-form-item label="显示页脚">
                <el-switch v-model="settingsForm.showFooter" />
              </el-form-item>
              
              <el-divider />
              
              <h4>显示设置</h4>
              <el-form-item label="页面动画">
                <el-switch v-model="settingsForm.enableAnimation" />
              </el-form-item>
              
              <el-form-item label="字体大小">
                <el-slider
                  v-model="settingsForm.fontSize"
                  :min="12"
                  :max="18"
                  :step="1"
                  show-input>
                </el-slider>
              </el-form-item>
              
              <el-form-item label="紧凑模式">
                <el-switch v-model="settingsForm.compactMode" />
              </el-form-item>
              
              <el-form-item label="快捷操作">
                <el-switch v-model="settingsForm.showQuickActions" />
              </el-form-item>
              
              <el-form-item label="深色模式">
                <el-switch v-model="settingsForm.darkMode" />
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <!-- 数据管理 -->
        <el-tab-pane label="数据管理" name="data">
          <div class="settings-section">
            <h4>数据备份</h4>
            <div class="backup-settings">
              <el-form :model="settingsForm" label-width="120px">
                <el-form-item label="自动备份">
                  <el-switch v-model="settingsForm.autoBackup" />
                </el-form-item>
                <el-form-item label="备份周期">
                  <el-select
                    v-model="settingsForm.backupInterval"
                    :disabled="!settingsForm.autoBackup">
                    <el-option label="每天" value="daily" />
                    <el-option label="每周" value="weekly" />
                    <el-option label="每月" value="monthly" />
                  </el-select>
                </el-form-item>
                <el-form-item label="备份时间">
                  <el-time-picker
                    v-model="settingsForm.backupTime"
                    :disabled="!settingsForm.autoBackup"
                    format="HH:mm"
                    placeholder="选择时间">
                  </el-time-picker>
                </el-form-item>
              </el-form>
              <div class="backup-actions">
                <el-button type="primary" @click="backupData">
                  <el-icon><Download /></el-icon>立即备份
                </el-button>
                <el-button type="warning" @click="clearCache">
                  <el-icon><Delete /></el-icon>清除缓存
                </el-button>
              </div>
            </div>

            <el-divider />
            
            <h4>数据存储</h4>
            <el-progress :percentage="storageUsage" :format="formatStorage" />
            <div class="storage-info">
              <div class="storage-item">
                <span class="label">已用空间</span>
                <span class="value">{{ formatSize(usedStorage) }}</span>
              </div>
              <div class="storage-item">
                <span class="label">总空间</span>
                <span class="value">{{ formatSize(totalStorage) }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 隐私安全 -->
        <el-tab-pane label="隐私安全" name="security">
          <div class="settings-section">
            <el-form :model="settingsForm" label-width="120px">
              <h4>登录安全</h4>
              <el-form-item label="登录验证">
                <el-switch v-model="settingsForm.loginVerification" />
              </el-form-item>
              <el-form-item label="记住登录">
                <el-switch v-model="settingsForm.rememberLogin" />
              </el-form-item>
              <el-form-item label="自动锁屏">
                <el-select v-model="settingsForm.autoLockTime">
                  <el-option label="从不" value="0" />
                  <el-option label="5分钟" value="5" />
                  <el-option label="10分钟" value="10" />
                  <el-option label="30分钟" value="30" />
                </el-select>
              </el-form-item>
              
              <el-divider />
              
              <h4>操作安全</h4>
              <el-form-item label="操作确认">
                <el-switch v-model="settingsForm.operationConfirm" />
              </el-form-item>
              <el-form-item label="敏感操作验证">
                <el-switch v-model="settingsForm.sensitiveOperationVerify" />
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="resetSettings">恢复默认</el-button>
          <el-button @click="settingsDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="saveSettings" 
            :loading="saving">
            保存设置
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 系统日志对话框 -->
    <el-dialog
      title="系统日志"
      v-model="logDialogVisible"
      width="800px">
      <div class="log-filters">
        <el-select v-model="logType" placeholder="日志类型">
          <el-option label="全部" value="all" />
          <el-option label="操作日志" value="operation" />
          <el-option label="系统日志" value="system" />
          <el-option label="错误日志" value="error" />
        </el-select>
        <el-date-picker
          v-model="logDateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <el-table :data="systemLogs" height="400">
        <el-table-column prop="timestamp" label="时间" width="180" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="user" label="操作人" width="120" />
        <el-table-column prop="content" label="内容" />
      </el-table>
    </el-dialog>

    <!-- 数据分析对话框 -->
    <el-dialog
      title="数据分析"
      v-model="analysisDialogVisible"
      width="900px">
      <el-tabs v-model="activeAnalysis">
        <el-tab-pane label="销售趋势" name="sales">
          <div class="chart-container">
            <div ref="salesChart" style="height: 400px"></div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="菜品分析" name="dishes">
          <div class="chart-container">
            <div ref="dishesChart" style="height: 400px"></div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="客流分析" name="traffic">
          <div class="chart-container">
            <div ref="trafficChart" style="height: 400px"></div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 头像预览对话框 -->
    <el-dialog
      v-model="avatarPreviewVisible"
      title="头像预览"
      width="400px"
      align-center>
      <div class="avatar-preview-container">
        <img :src="profileForm.avatar" class="preview-image">
      </div>
      <div class="preview-actions">
        <el-button @click="avatarPreviewVisible = false">关闭</el-button>
        <el-button type="primary" @click="triggerFileInput">重新上传</el-button>
      </div>
    </el-dialog>

    <!-- 使用帮助对话框 -->
    <el-dialog
      title="使用帮助"
      v-model="helpDialogVisible"
      width="800px"
      class="help-dialog">
      <div class="help-container">
        <!-- 左侧导航 -->
        <div class="help-nav">
          <el-menu
            :default-active="activeHelpSection"
            @select="handleHelpSelect">
            <el-menu-item index="overview">
              <el-icon><Document /></el-icon>
              系统概览
            </el-menu-item>
            <el-menu-item index="dishes">
              <el-icon><Dish /></el-icon>
              菜品管理
            </el-menu-item>
            <el-menu-item index="menus">
              <el-icon><Calendar /></el-icon>
              菜单管理
            </el-menu-item>
            <el-menu-item index="orders">
              <el-icon><List /></el-icon>
              订单管理
            </el-menu-item>
            <el-menu-item index="inventory">
              <el-icon><Box /></el-icon>
              库存管理
            </el-menu-item>
            <el-menu-item index="settings">
              <el-icon><Setting /></el-icon>
              系统设置
            </el-menu-item>
            <el-menu-item index="faq">
              <el-icon><QuestionFilled /></el-icon>
              常见问题
            </el-menu-item>
          </el-menu>
        </div>

        <!-- 右侧内容 -->
        <div class="help-content">
          <!-- 在右侧内容区域完善各个功能的帮助内容 -->
          <div class="help-content">
            <!-- 系统概览 -->
            <div v-if="activeHelpSection === 'overview'" class="help-section">
              <h3>系统概览</h3>
              <el-divider />
              <div class="help-text">
                <h4>系统简介</h4>
                <p>智慧食堂管理系统是一个现代化的餐饮管理平台，致力于提供高效、便捷的食堂运营解决方案。</p>
                
                <h4>主要功能</h4>
                <ul>
                  <li>菜品管理：添加、编辑和管理菜品信息，包括价格、库存等</li>
                  <li>菜单管理：制定和发布每日菜单，灵活调整菜品组合</li>
                  <li>订单管理：实时处理和跟踪订单状态，提高服务效率</li>
                  <li>库存管理：监控和管理食材库存，及时补充物料</li>
                  <li>数据统计：查看销售和运营数据，辅助决策分析</li>
                </ul>

                <h4>快速入门</h4>
                <ol>
                  <li>登录系统：使用工号和密码登录</li>
                  <li>身份验证：选择所属餐厅和窗口</li>
                  <li>功能导航：使用左侧菜单访问各个功能模块</li>
                  <li>个人设置：右上角可进行个人信息设置</li>
                </ol>
              </div>
            </div>

            <!-- 菜品管理 -->
            <div v-if="activeHelpSection === 'dishes'" class="help-section">
              <h3>菜品管理</h3>
              <el-divider />
              <div class="help-text">
                <h4>添加菜品</h4>
                <ol>
                  <li>点击"添加菜品"按钮</li>
                  <li>填写菜品基本信息：
                    <ul>
                      <li>名称：输入菜品名称</li>
                      <li>价格：设置菜品价格</li>
                      <li>分类：选择所属分类</li>
                      <li>描述：添加菜品描述</li>
                    </ul>
                  </li>
                  <li>上传菜品图片：支持JPG、PNG格式</li>
                  <li>设置菜品状态：上架/下架</li>
                  <li>设置库存信息</li>
                </ol>

                <h4>编辑菜品</h4>
                <ol>
                  <li>在菜品列表中找到需要编辑的菜品</li>
                  <li>点击"编辑"按钮</li>
                  <li>修改相关信息</li>
                  <li>点击"保存"确认修改</li>
                </ol>

                <h4>菜品状态管理</h4>
                <ul>
                  <li>上架：菜品可供选购</li>
                  <li>下架：暂停销售</li>
                  <li>售罄：库存不足时自动显示</li>
                </ul>
              </div>
            </div>

            <!-- 菜单管理 -->
            <div v-if="activeHelpSection === 'menus'" class="help-section">
              <h3>菜单管理</h3>
              <el-divider />
              <div class="help-text">
                <h4>创建菜单</h4>
                <ol>
                  <li>选择菜单日期</li>
                  <li>添加菜品到菜单：
                    <ul>
                      <li>从菜品库中选择</li>
                      <li>设置供应时段</li>
                      <li>设置供应数量</li>
                    </ul>
                  </li>
                  <li>调整菜品顺序</li>
                  <li>发布菜单</li>
                </ol>

                <h4>菜单模板</h4>
                <p>可以将常用菜单保存为模板，方便快速创建：</p>
                <ul>
                  <li>保存当前菜单为模板</li>
                  <li>使用模板创建菜单</li>
                  <li>管理模板列表</li>
                </ul>

                <h4>注意事项</h4>
                <ul>
                  <li>菜单需提前一天发布</li>
                  <li>已发布菜单修改后需重新发布</li>
                  <li>注意检查菜品库存</li>
                </ul>
              </div>
            </div>

            <!-- 订单管理 -->
            <div v-if="activeHelpSection === 'orders'" class="help-section">
              <h3>订单管理</h3>
              <el-divider />
              <div class="help-text">
                <h4>订单处理流程</h4>
                <ol>
                  <li>接收新订单</li>
                  <li>确认订单：
                    <ul>
                      <li>检查订单内容</li>
                      <li>确认库存状态</li>
                      <li>查看备注信息</li>
                    </ul>
                  </li>
                  <li>开始制作</li>
                  <li>完成订单</li>
                </ol>

                <h4>订单状态说明</h4>
                <ul>
                  <li>待确认：新收到的订单</li>
                  <li>制作中：已确认正在制作</li>
                  <li>待取餐：制作完成等待取餐</li>
                  <li>已完成：订单已结束</li>
                  <li>已取消：订单被取消</li>
                </ul>

                <h4>特殊情况处理</h4>
                <ul>
                  <li>缺货处理：及时联系顾客变更订单</li>
                  <li>退款处理：按流程申请退款</li>
                  <li>投诉处理：认真记录并及时处理</li>
                </ul>
              </div>
            </div>

            <!-- 库存管理 -->
            <div v-if="activeHelpSection === 'inventory'" class="help-section">
              <h3>库存管理</h3>
              <el-divider />
              <div class="help-text">
                <h4>库存操作</h4>
                <ul>
                  <li>入库管理：
                    <ol>
                      <li>登记新入库食材</li>
                      <li>记录入库数量和单价</li>
                      <li>设置保质期信息</li>
                    </ol>
                  </li>
                  <li>出库管理：
                    <ol>
                      <li>记录日常消耗</li>
                      <li>处理损耗登记</li>
                      <li>盘点库存差异</li>
                    </ol>
                  </li>
                </ul>

                <h4>库存预警</h4>
                <ul>
                  <li>设置预警阈值</li>
                  <li>库存不足提醒</li>
                  <li>保质期预警</li>
                </ul>

                <h4>库存报表</h4>
                <ul>
                  <li>库存盘点表</li>
                  <li>进销存报表</li>
                  <li>库存分析报告</li>
                </ul>
              </div>
            </div>

            <!-- 系统设置 -->
            <div v-if="activeHelpSection === 'settings'" class="help-section">
              <h3>系统设置</h3>
              <el-divider />
              <div class="help-text">
                <h4>基本设置</h4>
                <ul>
                  <li>主题设置：
                    <ul>
                      <li>选择主题颜色</li>
                      <li>调整界面布局</li>
                      <li>深色模式切换</li>
                    </ul>
                  </li>
                  <li>通知设置：
                    <ul>
                      <li>订单通知</li>
                      <li>库存预警</li>
                      <li>系统消息</li>
                    </ul>
                  </li>
                </ul>

                <h4>安全设置</h4>
                <ul>
                  <li>修改密码</li>
                  <li>登录验证</li>
                  <li>操作确认</li>
                </ul>

                <h4>数据管理</h4>
                <ul>
                  <li>数据备份</li>
                  <li>清理缓存</li>
                  <li>导出报表</li>
                </ul>
              </div>
            </div>

            <!-- 常见问题 -->
            <div v-if="activeHelpSection === 'faq'" class="help-section">
              <h3>常见问题</h3>
              <el-divider />
              <div class="help-text">
                <el-collapse accordion>
                  <el-collapse-item title="1. 如何修改密码？" name="1">
                    <p>1. 点击右上角头像</p>
                    <p>2. 选择"修改密码"选项</p>
                    <p>3. 输入原密码和新密码</p>
                    <p>4. 确认新密码并保存</p>
                    <p>注意：密码长度不少于6位，需包含字母和数字</p>
                  </el-collapse-item>

                  <el-collapse-item title="2. 如何处理订单？" name="2">
                    <p>1. 进入订单管理页面</p>
                    <p>2. 查看待处理订单列表</p>
                    <p>3. 点击订单进入详情页</p>
                    <p>4. 按照订单状态进行相应操作</p>
                    <p>5. 完成订单处理</p>
                  </el-collapse-item>

                  <el-collapse-item title="3. 如何管理库存？" name="3">
                    <p>1. 进入库存管理模块</p>
                    <p>2. 查看当前库存状态</p>
                    <p>3. 进行入库/出库操作</p>
                    <p>4. 设置库存预警值</p>
                    <p>5. 定期盘点库存</p>
                  </el-collapse-item>

                  <el-collapse-item title="4. 系统无法登录怎么办？" name="4">
                    <p>1. 检查网络连接</p>
                    <p>2. 确认账号密码是否正确</p>
                    <p>3. 清除浏览器缓存</p>
                    <p>4. 联系系统管理员</p>
                  </el-collapse-item>

                  <el-collapse-item title="5. 如何导出数据报表？" name="5">
                    <p>1. 进入相应的功能模块</p>
                    <p>2. 选择要导出的数据范围</p>
                    <p>3. 点击"导出"按钮</p>
                    <p>4. 选择导出格式（Excel/PDF）</p>
                    <p>5. 确认导出</p>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="help-footer">
          <el-button @click="helpDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="downloadUserManual">
            <el-icon><Download /></el-icon>
            下载完整手册
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Dish, 
  Calendar, 
  List, 
  Shop, 
  UserFilled, 
  CaretBottom,
  Download,
  QuestionFilled,
  ChatDotRound,
  Delete,
  Plus,
  Close,
  Warning,
  ArrowUp,
  ArrowDown,
  Refresh,
  DataBoard,
  TrendCharts,
  Box,
  User,
  Setting,
  Lock,
  SwitchButton,
  VideoPlay,
  Document
} from '@element-plus/icons-vue'
import { ref, computed, onMounted, onUnmounted, reactive, watch } from 'vue'
import { checkPermission, isSuperAdmin as checkIsSuperAdmin } from '@/utils/permission'

export default {
  name: 'AdminLayout',
  components: {
    Dish,
    Calendar,
    List,
    Shop,
    UserFilled,
    CaretBottom,
    Download,
    QuestionFilled,
    ChatDotRound,
    Delete,
    Plus,
    Close,
    Warning,
    ArrowUp,
    ArrowDown,
    Refresh,
    DataBoard,
    TrendCharts,
    Box,
    User,
    Setting,
    Lock,
    SwitchButton,
    VideoPlay,
    Document
  },
  setup() {
    const router = useRouter()
    const isMobile = ref(false)
    const isCollapse = ref(false)
    const verifyDialogVisible = ref(false)
    const verifying = ref(false)
    const verifyFormRef = ref(null)
    
    // 添加缺��的变量定义
    const logDialogVisible = ref(false)
    const analysisDialogVisible = ref(false)
    const activeAnalysis = ref('sales')
    const logType = ref('all')
    const logDateRange = ref([])
    const systemLogs = ref([])

    // 检查是否为移动设备
    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768
    }

    // 用户信息
    const userInfo = ref(JSON.parse(localStorage.getItem('user')) || {
      username: '',
      canteen: null,
      window: null
    })

    // 获取当前菜单标题
    const getCurrentMenuTitle = () => {
      const path = router.currentRoute.value.path
      const titles = {
        '/admin/dishes': '菜品管理',
        '/admin/menus': '菜单管理',
        '/admin/orders': '订单管理',
        '/admin/windows': '窗口管理'
      }
      return titles[path] || '首页'
    }

    // 处理下拉菜单命令
    const handleCommand = (command) => {
      switch (command) {
        case 'profile':
          profileDialogVisible.value = true
          break
        case 'password':
          passwordDialogVisible.value = true
          break
        case 'settings':
          settingsDialogVisible.value = true
          break
        case 'logout':
          handleLogout()
          break
        case 'help':
          helpDialogVisible.value = true
          break
      }
    }

    // 处理登出
    const handleLogout = () => {
      ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('user')
        localStorage.removeItem('verifiedInfo')
        router.push('/login')
      })
    }

    // 仪表盘数据
    const dashboardStats = reactive({
      todayOrders: 0,
      orderTrend: 0,
      revenue: 0,
      revenueTrend: 0,
      topDishes: [],
      lowStockList: []
    })

    // 个人信���相关
    const profileDialogVisible = ref(false)
    const profileFormRef = ref(null)
    const saving = ref(false)

    const profileForm = reactive({
      // 基本信息
      workId: 'W2024001',
      username: userInfo.value?.username || '默认用户名',  // 添加默认值
      name: '张三',
      phone: '13800138000',
      email: 'zhangsan@example.com',
      canteen: userInfo.value?.canteen?.name || '',
      window: userInfo.value?.window?.name || '',
      
      // 工作信息
      department: '餐饮部',
      position: '窗口管理员',
      employeeId: 'EMP2024001',
      status: '在职',
      joinDate: '2024-01-01',
      workHours: '09:00-17:00',
      restDays: '周六、周日',
      
      // 紧急联��人
      emergencyContact: '',
      emergencyPhone: '',
      emergencyRelation: '',
      
      // 专业技能
      skills: ['收银', '食品安全', '客户服务'],
      certificates: ['健康证', '食��安全证'],
      
      // 绩效信息
      performance: {
        attendance: '98%',
        satisfaction: '4.8',
        completeRate: '96%'
      },
      avatar: '', // 添加头像字��
    })

    // 头像上传相关方法
    const uploadAvatarUrl = 'https://api.example.com/upload/avatar' // 替换为实际的上传地址
    
    const handleAvatarSuccess = (response) => {
      profileForm.avatar = response.url
      // 保存到本地存储,确保刷新页面后还能显示
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}')
      userInfo.avatar = response.url
      localStorage.setItem('user', JSON.stringify(userInfo))
      ElMessage.success('头像上传成功')
    }

    const beforeAvatarUpload = (file) => {
      const isImage = /^image\//.test(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        ElMessage.error('只能上传图片文件!')
      }
      if (!isLt2M) {
        ElMessage.error('图片大小不能超过 2MB!')
      }
      return isImage && isLt2M
    }

    // 获取仪表盘数据
    const fetchDashboardStats = async () => {
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 更新数据
        dashboardStats.todayOrders = 128
        dashboardStats.orderTrend = -5.2
        dashboardStats.revenue = 3256.50
        dashboardStats.revenueTrend = 12.5
        // ... 其他数据更新
      } catch (error) {
        console.error('获取统计数据失败:', error)
      }
    }

    // 在组件挂载时获取数据
    onMounted(() => {
      checkMobile()
      window.addEventListener('resize', checkMobile)
      fetchDashboardStats()  // 获取仪表盘数据
      fetchNotifications()
      fetchTodos()
      requestNotificationPermission()
      // 延迟加载音效，确保用户交互后再初始化 AudioContext
      const handleFirstInteraction = () => {
        loadPresetSounds()
        document.removeEventListener('click', handleFirstInteraction)
      }
      document.addEventListener('click', handleFirstInteraction)
    })

    // 在组件卸载时移除事件监
    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile)
      if (checkInterval) {
        clearInterval(checkInterval)
      }
    })

    // 在 setup() 函数中添加以下代码
    const verifyForm = ref({
      canteen: '',
      window: ''
    })

    const verifyRules = {
      canteen: [{ required: true, message: '请选择所属餐厅', trigger: 'change' }],
      window: [{ required: true, message: '请选择所属窗口', trigger: 'change' }]
    }

    // 定义餐厅数据
    const canteens = ref([
      {
        id: 1,
        name: '中央食堂',
        floors: [
          {
            floor: 1,
            sections: ['左区', '右区']
          },
          {
            floor: 2,
            sections: ['左区', '右区']
          },
          {
            floor: 3,
            sections: ['左区', '右区']
          }
        ]
      },
      {
        id: 2,
        name: '沁园餐厅',
        floors: [
          { floor: 1, sections: ['主区'] },
          { floor: 2, sections: ['主区'] }
        ]
      },
      {
        id: 3,
        name: '馨园餐厅',
        floors: [{ floor: 1, sections: ['主区'] }]
      },
      {
        id: 4,
        name: '仲园餐厅',
        floors: [
          { floor: 1, sections: ['主区'] },
          { floor: 2, sections: ['主区'] }
        ]
      },
      {
        id: 5,
        name: '雅园餐厅',
        floors: [{ floor: 1, sections: ['主区'] }]
      },
      {
        id: 6,
        name: 'F区服务���',
        floors: [{ floor: 1, sections: ['主区'] }]
      },
      {
        id: 7,
        name: 'A区服务点',
        floors: [{ floor: 1, sections: ['主区'] }]
      }
    ])

    // 根据选择的餐厅获取可用窗口
    const availableWindows = computed(() => {
      if (!verifyForm.value.canteen) return []
      
      const selectedCanteen = canteens.value.find(c => c.id === verifyForm.value.canteen)
      if (!selectedCanteen) return []

      const windows = []
      let windowId = 1

      selectedCanteen.floors.forEach(floor => {
        floor.sections.forEach(section => {
          // 为每个区域生成5个窗口
          for (let i = 1; i <= 5; i++) {
            windows.push({
              id: windowId++,
              name: `${floor.floor}楼${section}-${i}号窗口`
            })
          }
        })
      })

      return windows
    })

    // 处理身份验证
    const handleVerify = async () => {
      verifying.value = true
      try {
        await verifyFormRef.value.validate()
        
        const selectedCanteen = canteens.value.find(c => c.id === verifyForm.value.canteen)
        const selectedWindow = availableWindows.value.find(w => w.id === verifyForm.value.window)
        
        // 获取用户信息
        const userInfo = JSON.parse(localStorage.getItem('user') || '{}')
        
        // 检查验证信息是否与登录信息匹配
        if (userInfo.verifiedInfo) {
          if (userInfo.verifiedInfo.canteen.id !== selectedCanteen.id ||
              userInfo.verifiedInfo.window.id !== selectedWindow.id) {
            throw new Error('验证信息与登录信息不匹配')
          }
        }
        
        const verifiedInfo = {
          canteen: selectedCanteen,
          window: selectedWindow,
          verifiedAt: new Date().toISOString()
        }
        
        localStorage.setItem('verifiedInfo', JSON.stringify(verifiedInfo))
        verifyDialogVisible.value = false
        ElMessage.success('身份验证成功')
      } catch (error) {
        console.error('验证失败:', error)
        ElMessage.error(error.message || '请完成所有必填项')
      } finally {
        verifying.value = false
      }
    }

    // 检查身份验证状态
    const checkVerification = () => {
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}')
      const verifiedInfo = userInfo.verifiedInfo

      if (!verifiedInfo) {
        // 如果没有验证信息，显示验证对话框
        verifyDialogVisible.value = true
        return
      }

      // 如果有验证信息，检查是否与登录信息匹配
      const storedVerifiedInfo = localStorage.getItem('verifiedInfo')
      if (storedVerifiedInfo) {
        const currentVerifiedInfo = JSON.parse(storedVerifiedInfo)
        
        // 检查餐厅和窗口是否匹配
        // 添加空值检查以避免访问 undefined 的属性
        if (verifiedInfo.canteen?.id !== currentVerifiedInfo.canteen?.id ||
            verifiedInfo.window?.id !== currentVerifiedInfo.window?.id) {
          ElMessageBox.confirm(
            '检测到您的窗口验证信息与登录信息不一致，是否重新验证？',
            '验证提示',
            {
              confirmButtonText: '重新验证',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            verifyDialogVisible.value = true
          }).catch(() => {
            // 用户取消，使用登录时的验证信息
            localStorage.setItem('verifiedInfo', JSON.stringify(verifiedInfo))
          })
        }
      } else {
        // 如果没有本地验证信息，使用登录时的验证信息
        localStorage.setItem('verifiedInfo', JSON.stringify(verifiedInfo))
      }
    }

    // 监听窗口选择变化
    watch(() => verifyForm.value.canteen, () => {
      verifyForm.value.window = '' // 重置窗口选择
    })

    // 通知相关的类型定��
    const NOTIFICATION_TYPES = {
      ORDER: {
        type: 'order',
        label: '订单消息',  // 修复乱码
        icon: 'List',
        color: '#409EFF',
        tagType: 'primary'
      },
      STOCK: {
        type: 'stock',
        label: '库存提醒',
        icon: 'Warning',
        color: '#E6A23C',
        tagType: 'warning'  // 添加 tagType
      },
      SYSTEM: {
        type: 'system',
        label: '系统通知',
        icon: 'Bell',
        color: '#67C23A',
        tagType: 'success'  // 添加 tagType
      }
    }

    // 通知过滤相关
    const activeNotificationType = ref('all')
    const notificationTypes = [
      { value: 'all', label: '全部消息' },
      { value: 'order', label: '订单消息' },
      { value: 'stock', label: '库存提醒' },
      { value: 'system', label: '系统通知' }
    ]

    // 通知相关
    const notifications = ref([])
    const unreadCount = ref(0)
    const notificationsVisible = ref(false)

    // 获取通知列表
    const fetchNotifications = async () => {
      try {
        // 模拟API调用
        const mockNotifications = [
          {
            id: 1,
            type: 'order',
            title: '新订单提醒',
            content: '您有一个新的订单待处理',
            time: '2024-03-20 10:30',
            read: false,
            priority: 'high',
            link: '/admin/orders',
            data: { orderId: '2024032001' }
          },
          {
            id: 2, 
            type: 'stock',
            title: '库存预警',
            content: '土豆库存不足,请及时补充',
            time: '2024-03-20 09:15',
            read: false,
            priority: 'medium',
            link: '/admin/dishes',
            data: { dishId: 'D001' }
          },
          {
            id: 3,
            type: 'system',
            title: '系统维护通知',
            content: '系统将于今晚22:00进行例行维护',
            time: '2024-03-20 08:00',
            read: false,
            priority: 'low',
            link: null
          }
        ]
        notifications.value = mockNotifications
        updateUnreadCount()
        startNotificationCheck() // 开始定时检查新消息
      } catch (error) {
        console.error('获取通知��败:', error)
        ElMessage.error('获取通知失败')  // 修复乱码
      }
    }

    // 根据类型筛选消息
    const filteredNotifications = computed(() => {
      return activeNotificationType.value === 'all'
        ? notifications.value
        : notifications.value.filter(n => n.type === activeNotificationType.value)
    })

    // 处理消息点击
    const handleNotificationClick = (notification) => {
      if (!notification.read) {
        markAsRead(notification.id)
      }
      
      if (notification.link) {
        notificationsVisible.value = false
        router.push({
          path: notification.link,
          query: notification.data
        })
      }
    }

    // �����检查新消息
    let checkInterval
    const startNotificationCheck = () => {
      checkInterval = setInterval(async () => {
        await checkNewNotifications()
      }, 30000) // 每30秒检查一次
    }

    // 检查新消息
    const checkNewNotifications = async () => {
      try {
        // 模��API调用
        const hasNew = Math.random() > 0.7 // 30%概率有新消息
        if (hasNew) {
          const newNotification = {
            id: Date.now(),
            type: 'order',
            title: '新订单通知',
            content: `收到新的订单 #${Math.floor(Math.random() * 1000)}`,
            time: new Date().toLocaleString(),
            read: false,
            priority: 'high',
            link: '/admin/orders'
          }
          
          notifications.value.unshift(newNotification)
          updateUnreadCount()
          
          // 显示桌面通知
          if (Notification.permission === 'granted') {
            new Notification('新消���提醒', {
              body: newNotification.content,
              icon: '/favicon.ico'
            })
          }
          
          // 播放提示音
          playNotificationSound()
        }
      } catch (error) {
        console.error('检查新消息失败:', error)
      }
    }

    // 创建音频上下文
    const audioContext = ref(null)
    
    // 初始化音频上下文的方法
    const initAudioContext = () => {
      if (!audioContext.value) {
        try {
          audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
        } catch (error) {
          console.error('创建音频上下文失败:', error)
        }
      } else if (audioContext.value.state === 'suspended') {
        audioContext.value.resume()
      }
    }

 

    // 在用户第一次点击时初始化音频上下文
    const handleFirstInteraction = () => {
      initAudioContext()
      // 移除事件监听器
      document.removeEventListener('click', handleFirstInteraction)
    }

    // 添加事件监听器
    onMounted(() => {
      document.addEventListener('click', handleFirstInteraction)
    })

    // 清理事件监听器
    onUnmounted(() => {
      document.removeEventListener('click', handleFirstInteraction)
      if (audioContext.value) {
        audioContext.value.close()
      }
    })

    // 在收到新通知时调用
    const handleNewNotification = () => {
      // 更新未读消息数
      unreadCount.value++
      // 播放提示音
      playNotificationSound()
      // 显示通知图标动画
      notificationIconShaking.value = true
      setTimeout(() => {
        notificationIconShaking.value = false
      }, 1000)
    }

    // 请求桌面通知权限
    const requestNotificationPermission = async () => {
      if (Notification.permission === 'default') {
        await Notification.requestPermission()
      }
    }

    // 更新未读消息数量
    const updateUnreadCount = () => {
      unreadCount.value = notifications.value.filter(n => !n.read).length
    }

    // 标记消息已读
    const markAsRead = async (id) => {
      try {
        const notification = notifications.value.find(n => n.id === id)
        if (notification) {
          notification.read = true
          updateUnreadCount()
        }
      } catch (error) {
        console.error('标记已读失败:', error)
        ElMessage.error('操作失败')
      }
    }

    // 标记全部已读
    const markAllAsRead = async () => {
      try {
        notifications.value.forEach(n => n.read = true)
        updateUnreadCount()
        ElMessage.success('已全部标记为已读')
      } catch (error) {
        console.error('标记全部已读失败:', error)
        ElMessage.error('操作失败')
      }
    }

    // 清空消息
    const clearNotifications = async () => {
      try {
        await ElMessageBox.confirm('确定要清空所有消息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        notifications.value = []
        unreadCount.value = 0
        ElMessage.success('清空成功')
      } catch (error) {
        if (error !== 'cancel') {
          console.error('清空消息失败:', error)
          ElMessage.error('操作失败')
        }
      }
    }

    // 待办事相关
    const todos = ref([])
    const completedTodos = ref([])

    // 获取待办事项
    const fetchTodos = async () => {
      try {
        // 模拟API调用
        todos.value = [
          {
            id: 1,
            content: '处理待确认订单',
            deadline: '2024-03-20 12:00'
          },
          {
            id: 2,
            content: '更新明日菜单',
            deadline: '2024-03-20 18:00'
          }
        ]
      } catch (error) {
        console.error('获取待办事项失败:', error)
        ElMessage.error('获取待办事项失败')
      }
    }

    // 添加待办事项
    const addTodo = async () => {
      try {
        const { value: content } = await ElMessageBox.prompt('请输待事项内容', '添待办', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator: (value) => {
            if (!value) {
              return '内容不能为空'
            }
            return true
          }
        })
        
        if (content) {
          todos.value.push({
            id: Date.now(),
            content,
            deadline: new Date().toLocaleString()
          })
          ElMessage.success('添加成功')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('添加待办失败:', error)
          ElMessage.error('添加失败')
        }
      }
    }

    // 删除待办事项
    const deleteTodo = async (id) => {
      try {
        await ElMessageBox.confirm('确定要删除该待办事项吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        todos.value = todos.value.filter(todo => todo.id !== id)
        ElMessage.success('删除成功')
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除待办失败:', error)
          ElMessage.error('删除失败')
        }
      }
    }

    // 密码相关
    const passwordDialogVisible = ref(false)
    const passwordFormRef = ref(null)
    const changing = ref(false)

    const passwordForm = reactive({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    // 密强度校验
    const hasLength = computed(() => passwordForm.newPassword.length >= 6)
    const hasNumber = computed(() => /\d/.test(passwordForm.newPassword))
    const hasLetter = computed(() => /[a-zA-Z]/.test(passwordForm.newPassword))
    const hasSpecial = computed(() => /[^a-zA-Z0-9]/.test(passwordForm.newPassword))

    const passwordStrength = computed(() => {
      let strength = 0
      if (hasLength.value) strength++
      if (hasNumber.value) strength++
      if (hasLetter.value) strength++
      if (hasSpecial.value) strength++
      return Math.min(3, strength)
    })

    const strengthText = computed(() => {
      if (passwordStrength.value === 0) return '弱'
      if (passwordStrength.value === 1) return '中'
      if (passwordStrength.value === 2) return '强'
      return '非常强'
    })

    // 密码验证规则
    const passwordRules = {
      oldPassword: [
        { required: true, message: '请输入原密码', trigger: 'blur' }
      ],
      newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (value !== passwordForm.newPassword) {
              callback(new Error('两次输入的密码不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    }

    // 改密码
    const changePassword = async () => {
      if (!passwordFormRef.value) return
      
      try {
        await passwordFormRef.value.validate()
        changing.value = true
        
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        ElMessage.success('密码修改成功')
        passwordDialogVisible.value = false
        passwordForm.oldPassword = ''
        passwordForm.newPassword = ''
        passwordForm.confirmPassword = ''
      } catch (error) {
        console.error('修改密码失败:', error)
        ElMessage.error('修改密码失败')
      } finally {
        changing.value = false
      }
    }

    // 保存个人信息
    const saveProfile = async () => {
      try {
        saving.value = true
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        ElMessage.success('保存成功')
        profileDialogVisible.value = false
      } catch (error) {
        console.error('保存个人信息失败:', error)
        ElMessage.error('保存失败')
      } finally {
        saving.value = false
      }
    }

    // 通知图动画���态
    const notificationIconShaking = ref(false)

    // 显示通知抽屉
    const showNotifications = () => {
      notificationsVisible.value = true
      
      // 如果有未读消息，记为已读
      if (unreadCount.value > 0) {
        // 可以选择是否自动标记为已读
        // markAllAsRead()
      }
      
      // 停止图标抖动
      notificationIconShaking.value = false
    }

    // 当有新消息时抖动图标
    const shakeNotificationIcon = () => {
      notificationIconShaking.value = true
      setTimeout(() => {
        notificationIconShaking.value = false
      }, 1000)
    }

    // 在收到新消息时调用
    watch(unreadCount, (newCount, oldCount) => {
      if (newCount > oldCount) {
        shakeNotificationIcon()
      }
    })

    // 首先定义默认设置
    const defaultSettings = {
      navColor: '#1e3c72',
      contentColor: '#f5f7fa',
      refreshInterval: '60',
      orderNotification: true,
      stockAlert: true,
      soundEnabled: true,
      stockThreshold: 10,
      autoBackup: false,
      backupInterval: 'daily',
      menuMode: 'vertical',
      fixedHeader: true,
      showBreadcrumb: true,
      showFooter: true,
      enableAnimation: true,
      fontSize: 14,
      loginVerification: true,
      rememberLogin: true,
      autoLockTime: '30',
      operationConfirm: true,
      sensitiveOperationVerify: true,
      notificationSound: 'clear', // 默认使用清脆提示音
    }

    // 然后创建 settingsForm
    const settingsForm = reactive({
      ...defaultSettings
    })

    // 主题颜色选项
    const themeColors = {
      nav: [
        {
          label: '深邃蓝',
          value: '#1e3c72',
          description: '稳重大气的深蓝色调',
          matchColors: ['#f5f7fa', '#ffffff', '#f0f2f5']
        },
        {
          label: '科技蓝',
          value: '#2196F3',
          description: '现代感的科技蓝',
          matchColors: ['#ffffff', '#f5f7fa', '#f0f2f5']
        },
        {
          label: '海洋蓝',
          value: '#0277BD',
          description: '深邃的海洋蓝调',
          matchColors: ['#ffffff', '#f5f7fa', '#f0f2f5']
        },
        {
          label: '典雅紫',
          value: '#673AB7',
          description: '高贵典雅的紫色',
          matchColors: ['#ffffff', '#f5f7fa', '#f0f2f5']
        },
        {
          label: '深邃紫',
          value: '#4A148C',
          description: '神秘的深紫色调',
          matchColors: ['#ffffff', '#f5f7fa', '#f0f2f5']
        },
        {
          label: '翡翠绿',
          value: '#009688',
          description: '清新自然的翡翠绿',
          matchColors: ['#ffffff', '#f5f7fa', '#f0f2f5']
        },
        {
          label: '森林绿',
          value: '#2E7D32',
          description: '生机盎然的森林绿',
          matchColors: ['#ffffff', '#f5f7fa', '#f0f2f5']
        },
        {
          label: '暖棕色',
          value: '#795548',
          description: '温暖沉稳的棕色调',
          matchColors: ['#ffffff', '#f5f7fa', '#f0f2f5']
        },
        {
          label: '深红色',
          value: '#C62828',
          description: '热情奔放的深红色',
          matchColors: ['#ffffff', '#f5f7fa', '#f0f2f5']
        },
        {
          label: '石墨灰',
          value: '#455A64',
          description: '内敛优雅的深灰色',
          matchColors: ['#ffffff', '#f5f7fa', '#f0f2f5']
        },
        {
          label: '冷调灰',
          value: '#37474F',
          description: '沉稳大气的冷灰色',
          matchColors: ['#ffffff', '#f5f7fa', '#f0f2f5']
        },
        {
          label: '经典黑',
          value: '#263238',
          description: '永恒经典的深邃黑',
          matchColors: ['#ffffff', '#f5f7fa', '#f0f2f5']
        },
        {
          label: '午夜蓝',
          value: '#1A237E',
          description: '深邃的午夜蓝调',
          matchColors: ['#ffffff', '#f5f7fa', '#f0f2f5']
        }
      ],
      content: [
        {
          label: '清新白',
          value: '#ffffff',
          description: '简洁明亮的纯白色调'
        },
        {
          label: '��牙白',
          value: '#f5f7fa',
          description: '柔和舒适的象牙白'
        },
        {
          label: '淡雅灰',
          value: '#F5F5F5',
          description: '清爽淡雅的浅灰色'
        },
        {
          label: '米白色',
          value: '#FAFAFA',
          description: '��和自然的米白色'
        },
        {
          label: '珍珠白',
          value: '#F8F9FA',
          description: '细腻柔和的珍珠白'
        },
        {
          label: '浅蓝灰',
          value: '#EEF2F6',
          description: '清凉舒适的浅蓝灰'
        }
      ]
    }

    // 获取推荐的内容区域颜色
    const getRecommendedContentColors = computed(() => {
      const selectedNav = themeColors.nav.find(c => c.value === settingsForm.navColor)
      return selectedNav ? selectedNav.matchColors : themeColors.content.map(c => c.value)
    })

    // 应用主题方法
    const applyTheme = (preview = false) => {
      // 应用到导航栏
      const aside = document.querySelector('.aside')
      if (aside) {
        aside.style.background = settingsForm.navColor
        // 修改菜单的背景色
        const menu = aside.querySelector('.el-menu')
        if (menu) {
          menu.style.backgroundColor = settingsForm.navColor
        }
        // 修改所有菜单项的背景色
        const menuItems = aside.querySelectorAll('.el-menu-item')
        menuItems.forEach(item => {
          item.style.backgroundColor = settingsForm.navColor
        })
      }
      
      // 应用到预览区域
      if (preview) {
        const previewAside = document.querySelector('.preview-aside')
        if (previewAside) {
          previewAside.style.background = settingsForm.navColor
        }
      }
      
      // 应用到内容区域
      const main = document.querySelector('.main')
      if (main) {
        main.style.background = settingsForm.contentColor
      }
      
      // 保存到 CSS 变量
      document.documentElement.style.setProperty('--nav-background', settingsForm.navColor)
      document.documentElement.style.setProperty('--content-background', settingsForm.contentColor)
    }

    // 最后添加监听器
    watch(() => settingsForm.navColor, () => {
      if (!getRecommendedContentColors.value.includes(settingsForm.contentColor)) {
        settingsForm.contentColor = getRecommendedContentColors.value[0]
      }
      applyTheme(true)
    })

    watch(() => settingsForm.contentColor, () => {
      applyTheme(true)
    })

    // 设置相关
    const storageUsage = ref(45)
    const usedStorage = ref(450 * 1024 * 1024) // 450MB
    const totalStorage = ref(1024 * 1024 * 1024) // 1GB

    // 格式化存储大小
    const formatSize = (bytes) => {
      if (bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    // 格式化存储进度
    const formatStorage = (percentage) => {
      return `${percentage}%`
    }

    // 重置设置
    const resetSettings = async () => {
      try {
        await ElMessageBox.confirm('确定要恢复默认设置吗？', '提示', {
          type: 'warning'
        })
        Object.assign(settingsForm, defaultSettings)
        ElMessage.success('已恢复默认设置')
      } catch (error) {
        if (error !== 'cancel') {
          console.error('重置设置失败:', error)
          ElMessage.error('操作失败')
        }
      }
    }

    // 设置相关变量
    const settingsDialogVisible = ref(false)
    const settingsFormRef = ref(null)
    const activeSettingTab = ref('theme')
    const showQuickPanel = ref(false)

    // 头像相关变量
    const avatarPreviewVisible = ref(false)
    const fileInput = ref(null)

    // 头像预览和上传方法
    const previewAvatar = () => {
      if (profileForm.avatar) {
        avatarPreviewVisible.value = true
      }
    }

    const triggerFileInput = () => {
      fileInput.value.click()
    }

    const handleFileChange = (event) => {
      const file = event.target.files[0]
      if (file) {
        // 验证文件类型和大小
        const isImage = /^image\//.test(file.type)
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isImage) {
          ElMessage.error('只能上传图片文件!')
          return
        }
        if (!isLt2M) {
          ElMessage.error('图片大小不能超过 2MB!')
          return
        }

        // 使用 FileReader 读取文件
        const reader = new FileReader()
        reader.onload = (e) => {
          profileForm.avatar = e.target.result
          // 保存到本地存储
          const userInfo = JSON.parse(localStorage.getItem('user') || '{}')
          userInfo.avatar = e.target.result
          localStorage.setItem('user', JSON.stringify(userInfo))
          ElMessage.success('头像更新成功')
        }
        reader.readAsDataURL(file)
      }
      // 清空文件输入框,允许选择相同文件
      event.target.value = ''
    }

    // 颜色调整工具函数
    const adjustColor = (hex, percent) => {
      const num = parseInt(hex.replace('#', ''), 16)
      const amt = Math.round(2.55 * percent)
      const R = (num >> 16) + amt
      const G = (num >> 8 & 0x00FF) + amt
      const B = (num & 0x0000FF) + amt
      return `#${(1 << 24 | (R < 255 ? R < 1 ? 0 : R : 255) << 16 | (G < 255 ? G < 1 ? 0 : G : 255) << 8 | (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)}`
    }

    // 定义通知音效选项
    const notificationSounds = ref([
      { 
        label: '微信提示音', 
        value: 'wechat',
        audioPath: '/src/mp3/叮咚.mp3'
      },
      {
        label: '钉钉提示音',
        value: 'dingtalk', 
        audioPath: '/src/mp3/提示音效2.mp3'
      },
      {
        label: 'iOS提示音',
        value: 'ios',
        audioPath: '/src/mp3/提示音效3.mp3'
      }
    ])

    // 加载预设音效
    const loadPresetSounds = async () => {
      try {
        // 确保 AudioContext 已初始化
        if (!audioContext.value) {
          initAudioContext()
        }
        
        // 如果仍然无法初始化，则返回
        if (!audioContext.value) {
          console.error('无法初始化音频上下文')
          return
        }

        for (const sound of notificationSounds.value) {
          const response = await fetch(sound.audioPath)
          const arrayBuffer = await response.arrayBuffer()
          sound.audioBuffer = await audioContext.value.decodeAudioData(arrayBuffer)
        }
      } catch (error) {
        console.error('加载预设音效失败:', error)
      }
    }

    // 处理音频文件上传
    const handleSoundUpload = async (event) => {
      const file = event.target.files[0]
      if (!file) return
      
      if (!file.type.startsWith('audio/')) {
        ElMessage.error('请上传音频文件')
        return
      }
      
      if (file.size > 2 * 1024 * 1024) {
        ElMessage.error('音频文件不能超过2MB')
        return
      }
      
      try {
        const arrayBuffer = await file.arrayBuffer()
        const audioBuffer = await audioContext.value.decodeAudioData(arrayBuffer)
        
        const newSound = {
          label: file.name.split('.')[0],
          value: `custom_${Date.now()}`,
          audioBuffer
        }
        
        notificationSounds.value.push(newSound)
        ElMessage.success('音效添加成功')
      } catch (error) {
        console.error('音效加载失败:', error)
        ElMessage.error('音效加载失败')
      }
    }

    // 播放预览音效的方法
    const playPreviewSound = async (soundType) => {
      try {
        if (!audioContext.value) {
          initAudioContext()
        }

        if (audioContext.value && settingsForm.soundEnabled) {
          const sound = notificationSounds.value.find(s => s.value === soundType)
          if (sound) {
            const source = audioContext.value.createBufferSource()
            source.buffer = sound.audioBuffer
            const gainNode = audioContext.value.createGain()
            gainNode.gain.value = settingsForm.notificationVolume / 100
            source.connect(gainNode)
            gainNode.connect(audioContext.value.destination)
            source.start()
          }
        }
      } catch (error) {
        console.error('播放预览音效失败:', error)
      }
    }

    // 播放通知音效的方法
    const playNotificationSound = async () => {
      try {
        if (!audioContext.value) {
          initAudioContext()
        }

        if (settingsForm.soundEnabled && audioContext.value) {
          const sound = notificationSounds.value.find(s => s.value === settingsForm.notificationSound)
          if (sound) {
            const source = audioContext.value.createBufferSource()
            source.buffer = sound.audioBuffer
            const gainNode = audioContext.value.createGain()
            gainNode.gain.value = settingsForm.notificationVolume / 100
            source.connect(gainNode)
            gainNode.connect(audioContext.value.destination)
            source.start()
          }
        }
      } catch (error) {
        console.error('播放提示音失败:', error)
      }
    }

    // 删除自定义音效
    const deleteSound = (soundValue) => {
      const index = notificationSounds.value.findIndex(s => s.value === soundValue)
      if (index > 0) { // 不删除默认音效
        notificationSounds.value.splice(index, 1)
        if (settingsForm.notificationSound === soundValue) {
          settingsForm.notificationSound = 'default'
        }
        ElMessage.success('音效删除成功')
      }
    }

    // 应用界面设置
    const applyInterfaceSettings = () => {
      // 应用菜单展开方式
      if (settingsForm.menuMode === 'horizontal') {
        document.querySelector('.el-menu').classList.add('el-menu--horizontal')
      } else {
        document.querySelector('.el-menu').classList.remove('el-menu--horizontal')
      }

      // 应用固定头部
      const header = document.querySelector('.header')
      if (settingsForm.fixedHeader) {
        header.classList.add('fixed')
      } else {
        header.classList.remove('fixed')
      }

      // 应用面包屑显示
      const breadcrumb = document.querySelector('.el-breadcrumb')
      if (breadcrumb) {
        breadcrumb.style.display = settingsForm.showBreadcrumb ? 'flex' : 'none'
      }

      // 应用页脚显示
      const footer = document.querySelector('.footer')
      if (footer) {
        footer.style.display = settingsForm.showFooter ? 'block' : 'none'
      }

      // 应用页面动画
      if (settingsForm.enableAnimation) {
        document.body.classList.add('enable-animation')
      } else {
        document.body.classList.remove('enable-animation')
      }

      // 应用字体大小
      document.documentElement.style.fontSize = `${settingsForm.fontSize}px`

      // 应用紧凑模式
      if (settingsForm.compactMode) {
        document.body.classList.add('compact-mode')
      } else {
        document.body.classList.remove('compact-mode')
      }

      // 应用快捷操作显示
      showQuickPanel.value = settingsForm.showQuickActions

      // 应用菜单折叠
      isCollapse.value = settingsForm.menuCollapse

      // 应用深色模式
      if (settingsForm.darkMode) {
        document.documentElement.classList.add('dark-mode')
      } else {
        document.documentElement.classList.remove('dark-mode')
      }
    }

    // 修改保存设置方法
    const saveSettings = async () => {
      try {
        saving.value = true
        
        // 保存到本地存储
        localStorage.setItem('systemSettings', JSON.stringify(settingsForm))
        
        // 应用主题设置
        applyTheme()
        
        // 应用界面设置
        applyInterfaceSettings()
        
        ElMessage.success('设置保存成功')
        settingsDialogVisible.value = false
      } catch (error) {
        console.error('保存设置失败:', error)
        ElMessage.error('保存设置失败')
      } finally {
        saving.value = false
      }
    }

    // 修改为调用函数的计算属性
    const isSuperAdmin = computed(() => checkIsSuperAdmin())

    // 在 setup 中添加
    const helpDialogVisible = ref(false)
    const activeHelpSection = ref('overview')

    // 处理帮助菜单选择
    const handleHelpSelect = (index) => {
      activeHelpSection.value = index
    }

    // 下载用户手册
    const downloadUserManual = () => {
      // 这里可以实现下载功能
      ElMessage.success('用户手册下载中...')
    }

    return {
      isMobile,
      isCollapse,
      userInfo,
      profileForm,
      dashboardStats,
      getCurrentMenuTitle,
      handleCommand,
      verifyForm,
      verifyRules,
      verifyFormRef,
      canteens,
      availableWindows,
      handleVerify,
      verifyDialogVisible,
      verifying,
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      clearNotifications,
      todos,
      completedTodos,
      addTodo,
      deleteTodo,
      passwordDialogVisible,
      passwordFormRef,
      passwordForm,
      passwordRules,
      changing,
      changePassword,
      hasLength,
      hasNumber,
      hasLetter,
      hasSpecial,
      passwordStrength,
      strengthText,
      NOTIFICATION_TYPES,
      activeNotificationType,
      notificationTypes,
      filteredNotifications,
      handleNotificationClick,
      profileDialogVisible,
      profileFormRef,
      saving,
      saveProfile,
      showNotifications,
      notificationIconShaking,
      settingsDialogVisible,
      settingsForm,
      themeColors,
      applyTheme,
      adjustColor,
      getRecommendedContentColors,
      activeSettingTab,
      storageUsage,
      usedStorage,
      totalStorage,
      formatSize,
      formatStorage,
      resetSettings,
      settingsFormRef,
      logDialogVisible,
      analysisDialogVisible,
      activeAnalysis,
      logType,
      logDateRange,
      systemLogs,
      showQuickPanel,
      uploadAvatarUrl,
      handleAvatarSuccess,
      beforeAvatarUpload,
      avatarPreviewVisible,
      fileInput,
      previewAvatar,
      triggerFileInput,
      handleFileChange,
      playNotificationSound,
      handleNewNotification,
      audioContext,
      notificationSounds,
      playPreviewSound,
      handleSoundUpload,
      deleteSound,
      loadPresetSounds,
      saveSettings,
      isSuperAdmin,
      helpDialogVisible,
      activeHelpSection,
      handleHelpSelect,
      downloadUserManual
    }
  }
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
}

/* 侧边栏样式 */
.aside {
  background: #1e3c72;
  color: white;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
}

.logo-container {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  width: 60px;
  height: 60px;
  margin-bottom: 10px;
}

.title {
  font-size: 16px;
  color: white;
  margin: 0;
  font-weight: normal;
}

.menu {
  border: none;
}

/* 头部样式 */
.header {
  background: white;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  position: fixed;
  top: 0;
  left: 240px;
  right: 0;
  z-index: 999;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin: 0 8px;
  color: #333;
}

/* 主要内容区样式 */
.main {
  margin-left: 240px;
  margin-top: 60px;
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 120px);
}

/* 脚样式 */
.footer {
  margin-left: 240px;
  text-align: center;
  color: #666;
  padding: 20px;
  border-top: 1px solid #eee;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .aside {
    width: 64px !important;
  }

  .logo-container {
    padding: 10px;
  }

  .logo {
    width: 40px;
    height: 40px;
  }

  .title {
    display: none;
  }

  .header {
    left: 64px;
  }

  .main {
    margin-left: 64px;
  }

  .footer {
    margin-left: 64px;
  }
}

/* 移动端样���调整 */
.admin-layout.mobile .aside {
  position: fixed;
  height: 100vh;
  z-index: 1000;
  transition: width 0.3s;
}

.admin-layout.mobile .header {
  padding-left: 70px;
}

.admin-layout.mobile .main {
  margin-left: 64px;
  padding: 10px;
}

.collapse-btn {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 移动端菜单样式 */
.admin-layout.mobile .el-menu {
  border-right: none;
}

.admin-layout.mobile .el-menu-item,
.admin-layout.mobile .el-sub-menu__title {
  height: 50px;
  line-height: 50px;
}

/* 移动端过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.full-width {
  width: 100%;
}

.notification-badge {
  margin-left: 20px;
}

.header-right {
  display: flex;
  align-items: center;
}

/* 深色模式样式 */
:root.dark-mode {
  --el-bg-color: #242424;
  --el-text-color-primary: #e5e5e5;
  --el-border-color: #383838;
}

.dark-mode .el-dialog {
  background: #2a2a2a;
}

.dark-mode .el-input__inner {
  background: #323232;
  border-color: #404040;
  color: #e5e5e5;
}

.dark-mode .el-select-dropdown {
  background: #2a2a2a;
  border-color: #404040;
}

.dark-mode .el-select-dropdown__item {
  color: #e5e5e5;
}

.dark-mode .el-select-dropdown__item.hover,
.dark-mode .el-select-dropdown__item:hover {
  background: #363636;
}

/* 深色模式下的其他元素 */
.dark-mode .el-card {
  background: #2a2a2a;
  border-color: #404040;
}

.dark-mode .el-table {
  background: #2a2a2a;
  color: #e5e5e5;
}

.dark-mode .el-table th,
.dark-mode .el-table tr {
  background: #323232;
}

.dark-mode .el-table--striped .el-table__body tr.el-table__row--striped td {
  background: #2f2f2f;
}

.dark-mode .el-table td, 
.dark-mode .el-table th.is-leaf {
  border-color: #404040;
}

.dark-mode .el-pagination {
  background: #2a2a2a;
  color: #e5e5e5;
}

.dark-mode .el-pagination button:disabled {
  background: #323232;
}

.dark-mode .el-menu {
  background: #2a2a2a;
  border-color: #404040;
}

.dark-mode .el-menu-item {
  color: #e5e5e5;
}

.dark-mode .el-menu-item:hover {
  background: #363636;
}

.dark-mode .el-drawer {
  background: #2a2a2a;
}

.dark-mode .el-drawer__header {
  color: #e5e5e5;
}

.dark-mode .notification-item {
  border-color: #404040;
}

.dark-mode .notification-item.unread {
  background: #2f2f2f;
}

.dark-mode .notification-text {
  color: #b0b0b0;
}

.dark-mode .notification-time {
  color: #808080;
}

/* 主题设置样式 */
.theme-settings {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.theme-area {
  display: flex;
  align-items: center;
  gap: 15px;
}

.area-label {
  min-width: 70px;
  color: #666;
}

.color-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}

.color-block {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}

.color-info {
  flex: 1;
}

.color-name {
  display: block;
  font-size: 14px;
  color: #303133;
  margin-bottom: 4px;
}

.color-desc {
  display: block;
  font-size: 12px;
  color: #909399;
}

/* 下拉选项样式优化 */
.el-select-dropdown__item {
  padding: 0 12px;
}

.el-select-dropdown__item.selected .color-name {
  color: var(--el-color-primary);
  font-weight: bold;
}

/* 深色主题 */
.theme-dark {
  color: #e5e5e5;
}

.theme-dark .el-menu {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.1);
}

.theme-dark .el-menu-item {
  color: #e5e5e5;
}

/* 浅色主题 */
.theme-light {
  color: #333;
}

.theme-light .el-menu {
  background: transparent;
  border-color: rgba(0, 0, 0, 0.1);
}

.theme-light .el-menu-item {
  color: #333;
}

/* 快捷操作面板样式 */
.quick-actions-panel {
  margin-bottom: 20px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge {
  margin-left: 4px;
}

/* 数据统计面板样�� */
.stats-panel {
  margin-bottom: 20px;
}

.stat-card {
  height: 100%;
}

.stat-content {
  text-align: center;
  padding: 20px 0;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 10px;
}

.stat-trend {
  font-size: 14px;
  color: #F56C6C;
}

.stat-trend.up {
  color: #67C23A;
}

.stat-list {
  text-align: left;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #EBEEF5;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-item.warning {
  color: #E6A23C;
}

.avatar-uploader:hover .avatar-image {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.avatar-image {
  transition: all 0.3s;
}

/* 修改上传区域样式 */
.upload-area {
  width: 150px;  /* 增加宽度 */
  height: 150px; /* 增加高度 */
  border: 2px dashed var(--el-border-color);
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover {
  border-color: var(--el-color-primary);
  transform: scale(1.02);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s;
}

.avatar-image:hover {
  transform: scale(1.1);
}

/* 调整上传图标大小 */
.avatar-uploader-icon {
  font-size: 40px;  /* 增加图标大小 */
  color: #8c939d;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 调整预览图片大小 */
.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s;
}

/* 调整头像预览对话框中的图片大小 */
.preview-image {
  width: 300px;  /* 增加预览图片大小 */
  height: 300px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* 调整提示文字的位置 */
.avatar-tips {
  margin-top: 15px;  /* 增加与上传区域的间距 */
  font-size: 13px;   /* 稍微增加字体大小 */
  color: #909399;
}

/* 修改头像上传区域样式 */
.profile-avatar-section {
  text-align: center;
  margin-bottom: 30px;
}

.avatar-uploader {
  display: inline-block;
  width: 150px;
  height: 150px;
}

.upload-area {
  width: 100%;
  height: 100%;
  border: 2px dashed var(--el-border-color);
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
}

.avatar-uploader-icon {
  font-size: 40px;
  color: #8c939d;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 悬停效果 */
.upload-area:hover {
  border-color: var(--el-color-primary);
  transform: scale(1.02);
}

.upload-area:hover .avatar-image {
  transform: scale(1.05);
}

/* 提示文字样式 */
.avatar-tips {
  margin-top: 15px;
  font-size: 13px;
  color: #909399;
}

/* 在 style 部分添加以下样式 */
.sound-options {
  display: flex;
  gap: 15px;
}

.play-sound-btn {
  margin-left: 8px;
  font-size: 14px;
}

.play-sound-btn:hover {
  transform: scale(1.1);
}

.el-radio-button {
  display: flex;
  align-items: center;
}

.sound-settings {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.sound-options {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.upload-sound {
  margin-top: 10px;
}

.delete-sound-btn {
  margin-left: 4px;
}

/* 紧凑模式样式 */
.compact-mode .el-form-item {
  margin-bottom: 12px;
}

.compact-mode .el-card {
  margin-bottom: 12px;
}

.compact-mode .el-menu-item {
  height: 45px;
  line-height: 45px;
}

/* 固定头部样式 */
.header.fixed {
  position: fixed;
  top: 0;
  left: 240px;
  right: 0;
  z-index: 999;
}

/* 页面动画 */
.enable-animation .el-menu-item,
.enable-animation .el-button,
.enable-animation .el-card {
  transition: all 0.3s ease;
}

/* 帮助对话框样式 */
.help-dialog :deep(.el-dialog__body) {
  padding: 0;
  height: 600px;
}

.help-container {
  display: flex;
  height: 100%;
}

.help-nav {
  width: 200px;
  border-right: 1px solid var(--el-border-color-light);
  height: 100%;
}

.help-nav .el-menu {
  border-right: none;
}

.help-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.help-section h3 {
  margin: 0 0 20px;
  color: var(--el-text-color-primary);
}

.help-text {
  color: var(--el-text-color-regular);
  line-height: 1.8;
}

.help-text h4 {
  margin: 20px 0 10px;
  color: var(--el-text-color-primary);
}

.help-text ul {
  padding-left: 20px;
  margin: 10px 0;
}

.help-text li {
  margin-bottom: 8px;
}

.help-footer {
  padding: 10px 20px;
  text-align: right;
  border-top: 1px solid var(--el-border-color-light);
}

/* FAQ 折叠面板样式 */
.help-text :deep(.el-collapse) {
  border: none;
}

.help-text :deep(.el-collapse-item__header) {
  font-size: 16px;
  color: var(--el-text-color-primary);
}

.help-text :deep(.el-collapse-item__content) {
  padding: 10px 20px;
  color: var(--el-text-color-regular);
}

/* 适配深色模式 */
:root.dark-mode .help-dialog {
  background: var(--el-bg-color);
}

:root.dark-mode .help-nav {
  border-color: var(--el-border-color-darker);
}

:root.dark-mode .help-text {
  color: var(--el-text-color-primary);
}
</style> 