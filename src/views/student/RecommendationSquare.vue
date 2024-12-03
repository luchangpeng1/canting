<template>
  <div class="recommendation-square">
    <back-header title="餐品推荐广场" />
    
    <!-- 发布按钮 -->
    <div class="post-action">
      <el-button type="primary" @click="showPostDialog">
        <el-icon><Edit /></el-icon>
        发布推荐/避雷
      </el-button>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-select v-model="filterType" placeholder="帖子类型" class="filter-item">
        <el-option label="全部" value="" />
        <el-option label="推荐" value="recommend" />
        <el-option label="避雷" value="warning" />
      </el-select>
      
      <el-select v-model="filterCanteen" placeholder="选择餐厅" class="filter-item">
        <el-option label="全部餐厅" value="" />
        <el-option
          v-for="canteen in canteens"
          :key="canteen.id"
          :label="canteen.name"
          :value="canteen.name"
        />
      </el-select>

      <el-select v-model="sortBy" placeholder="排序方式" class="filter-item">
        <el-option label="最新发布" value="latest" />
        <el-option label="最多点赞" value="mostLiked" />
        <el-option label="最多评论" value="mostComments" />
      </el-select>
    </div>

    <!-- 帖子列表 -->
    <div class="posts-list">
      <el-card v-for="post in filteredPosts" :key="post.id" class="post-card">
        <!-- 帖子头部 -->
        <div class="post-header">
          <div class="user-info">
            <el-avatar :size="40" :src="post.user.avatar">
              {{ post.user.name.charAt(0) }}
            </el-avatar>
            <div class="user-detail">
              <span class="username">{{ post.user.name }}</span>
              <span class="post-time">{{ post.createTime }}</span>
            </div>
          </div>
          <el-tag :type="post.type === 'recommend' ? 'success' : 'danger'">
            {{ post.type === 'recommend' ? '推荐' : '避雷' }}
          </el-tag>
        </div>

        <!-- 帖子内容 -->
        <div class="post-content">
          <h3 class="post-title">{{ post.title }}</h3>
          <div class="location-info">
            <el-tag size="small">{{ post.canteen }}</el-tag>
            <el-tag size="small" type="info">{{ post.window }}</el-tag>
            <el-tag size="small" type="warning">{{ post.dish }}</el-tag>
          </div>
          <p class="post-text">{{ post.content }}</p>
          <div v-if="post.images.length" class="post-images">
            <el-image 
              v-for="(img, index) in post.images"
              :key="index"
              :src="img"
              :preview-src-list="post.images"
              class="post-image"
            />
          </div>
        </div>

        <!-- 帖子操作 -->
        <div class="post-actions">
          <div class="action-item" @click="toggleLike(post)">
            <el-icon :class="{ active: post.isLiked }">
              <CaretTop />
            </el-icon>
            <span>{{ post.likes }}赞</span>
          </div>
          <div class="action-item" @click="showComments(post)">
            <el-icon><ChatDotRound /></el-icon>
            <span>{{ post.comments.length }}评论</span>
          </div>
          <div class="action-item">
            <el-icon><Share /></el-icon>
            <span>分享</span>
          </div>
        </div>

        <!-- 评论区 -->
        <div v-if="post.showComments" class="comments-section">
          <el-divider>评论区</el-divider>
          <div class="comments-list">
            <div v-for="comment in post.comments" :key="comment.id" class="comment-item">
              <el-avatar :size="32" :src="comment.user.avatar">
                {{ comment.user.name.charAt(0) }}
              </el-avatar>
              <div class="comment-content">
                <div class="comment-user">{{ comment.user.name }}</div>
                <div class="comment-text">{{ comment.content }}</div>
                <div class="comment-time">{{ comment.time }}</div>
              </div>
            </div>
          </div>
          <!-- 评论输入框 -->
          <div class="comment-input">
            <el-input
              v-model="commentText"
              placeholder="写下你的评论..."
              :rows="2"
              type="textarea"
            />
            <el-button type="primary" @click="submitComment(post)">发表评论</el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 发布对话框 -->
    <el-dialog
      title="发布推荐/避雷"
      v-model="postDialogVisible"
      width="90%"
      :close-on-click-modal="false"
      class="post-dialog">
      <el-form 
        :model="postForm" 
        :rules="postRules"
        ref="postFormRef"
        label-width="80px"
        @submit.prevent>
        <!-- 类型选择改为更直观的样式 -->
        <el-form-item label="类型" prop="type">
          <div class="post-type-selector">
            <div
              class="type-item"
              :class="{ active: postForm.type === 'recommend' }"
              @click="postForm.type = 'recommend'"
            >
              <el-icon><CircleCheckFilled /></el-icon>
              <span>推荐好物</span>
              <small>分享美食发现</small>
            </div>
            <div
              class="type-item"
              :class="{ active: postForm.type === 'warning' }"
              @click="postForm.type = 'warning'"
            >
              <el-icon><WarningFilled /></el-icon>
              <span>避雷提醒</span>
              <small>帮助他人避坑</small>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="标题" prop="title">
          <el-input 
            v-model="postForm.title" 
            placeholder="一句话描述你的体验（最多30字）"
            maxlength="30"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="餐厅" prop="canteen">
          <el-select 
            v-model="postForm.canteen" 
            placeholder="选择餐厅"
            filterable
            @change="handleCanteenChange">
            <el-option
              v-for="canteen in canteens"
              :key="canteen.id"
              :label="canteen.name"
              :value="canteen.name"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="窗口" prop="window">
          <el-select 
            v-model="postForm.window" 
            placeholder="选择窗口"
            filterable
            :disabled="!postForm.canteen">
            <el-option
              v-for="window in filteredWindows"
              :key="window.id"
              :label="window.name"
              :value="window.name"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="菜品" prop="dish">
          <el-input 
            v-model="postForm.dish" 
            placeholder="输入菜品名称"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="价格">
          <el-input-number 
            v-model="postForm.price" 
            :min="0"
            :precision="2"
            :step="0.5"
          />
        </el-form-item>

        <el-form-item label="评分">
          <el-rate
            v-model="postForm.rating"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
          />
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <el-input
            v-model="postForm.content"
            type="textarea"
            :rows="4"
            placeholder="详细描述你的体验..."
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="图片">
          <el-upload
            v-model:file-list="postForm.images"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-change="handleImageChange"
            :on-remove="handleImageRemove"
            :before-upload="beforeImageUpload"
            multiple>
            <template #default>
              <el-icon><Plus /></el-icon>
              <div class="upload-text">点击上传<br/>（最多4张）</div>
            </template>
            <template #file="{ file }">
              <img :src="file.url" class="upload-image" />
            </template>
          </el-upload>
        </el-form-item>

        <!-- 添加预览部分 -->
        <el-form-item label="预览">
          <div class="post-preview">
            <el-card>
              <div class="preview-header">预览效果</div>
              <div class="preview-content">
                <h3>{{ postForm.title || '标题待输入...' }}</h3>
                <div class="preview-tags">
                  <el-tag size="small">{{ postForm.canteen || '餐厅' }}</el-tag>
                  <el-tag size="small" type="info">{{ postForm.window || '窗口' }}</el-tag>
                  <el-tag size="small" type="warning">{{ postForm.dish || '菜品' }}</el-tag>
                </div>
                <p class="preview-text">{{ postForm.content || '内容待输入...' }}</p>
              </div>
            </el-card>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelPost">取消</el-button>
          <el-button type="primary" @click="submitPost" :loading="posting">
            发布
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, CaretTop, ChatDotRound, Share, Plus, CircleCheckFilled, WarningFilled } from '@element-plus/icons-vue'
import BackHeader from '@/components/BackHeader.vue'

const RecommendationSquare = {
  name: 'RecommendationSquare',
  components: {
    Edit,
    CaretTop,
    ChatDotRound,
    Share,
    Plus,
    CircleCheckFilled,
    WarningFilled,
    BackHeader
  },
  setup() {
    // 基础状态
    const posts = ref([])
    const postDialogVisible = ref(false)
    const posting = ref(false)
    const commentText = ref('')
    const filterType = ref('')
    const filterCanteen = ref('')
    const sortBy = ref('latest')
    const showViewer = ref(false)
    const currentImageIndex = ref(0)
    const postFormRef = ref(null)

    // 发布表单
    const postForm = ref({
      type: 'recommend',
      title: '',
      canteen: '',
      window: '',
      dish: '',
      content: '',
      images: [],
      price: 0,
      rating: 0
    })

    // 表单验证规则
    const postRules = {
      type: [{ required: true, message: '请选择发布类型', trigger: 'change' }],
      title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
      canteen: [{ required: true, message: '请选择餐厅', trigger: 'change' }],
      window: [{ required: true, message: '请选择窗口', trigger: 'change' }],
      dish: [{ required: true, message: '请输入菜品名称', trigger: 'blur' }],
      content: [{ required: true, message: '请输入内容描述', trigger: 'blur' }]
    }

    // 模拟数据
    const mockPosts = [
      {
        id: 1,
        user: {
          name: '张三',
          avatar: ''
        },
        type: 'recommend',
        title: '中央食堂的红烧肉太好吃了！',
        canteen: '中央食堂',
        window: '特色炒菜',
        dish: '红烧肉',
        content: '今天中午去吃了红烧肉，肥而不腻，特别推荐！',
        images: [],
        createTime: '2024-03-20 12:30',
        likes: 15,
        isLiked: false,
        showComments: false,
        comments: [
          {
            id: 1,
            user: { name: '李四', avatar: '' },
            content: '同意，我也觉得很好吃',
            time: '2024-03-20 12:35'
          }
        ]
      }
    ]

    // 餐厅数据
    const canteens = ref([
      { 
        id: 1, 
        name: '中央食堂',
        windows: [
          { id: 1, name: '特色炒菜' },
          { id: 2, name: '面食档口' }
        ]
      },
      { 
        id: 2, 
        name: '沁园餐厅',
        windows: [
          { id: 3, name: '盖浇饭窗口' },
          { id: 4, name: '小炒窗口' }
        ]
      }
    ])

    // 计算属性
    const filteredWindows = computed(() => {
      if (!postForm.value.canteen) return []
      const selectedCanteen = canteens.value.find(c => c.name === postForm.value.canteen)
      return selectedCanteen ? selectedCanteen.windows : []
    })

    const filteredPosts = computed(() => {
      let result = [...posts.value]
      
      if (filterType.value) {
        result = result.filter(post => post.type === filterType.value)
      }
      
      if (filterCanteen.value) {
        result = result.filter(post => post.canteen === filterCanteen.value)
      }
      
      switch (sortBy.value) {
        case 'mostLiked':
          result.sort((a, b) => b.likes - a.likes)
          break
        case 'mostComments':
          result.sort((a, b) => b.comments.length - a.comments.length)
          break
        default:
          result.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
      }
      
      return result
    })

    // 显示发布对话框
    const showPostDialog = () => {
      postDialogVisible.value = true
    }

    // 处理图片上传
    const handleImageChange = (file) => {
      postForm.value.images.push(file)
    }

    // 提交帖子
    const submitPost = async () => {
      posting.value = true
      try {
        // 这里应该调用API发布帖子
        await new Promise(resolve => setTimeout(resolve, 1000))
        ElMessage.success('发布成功')
        postDialogVisible.value = false
        // 重置表单
        postForm.value = {
          type: 'recommend',
          title: '',
          canteen: '',
          window: '',
          dish: '',
          content: '',
          images: [],
          price: 0,
          rating: 0
        }
      } catch (error) {
        ElMessage.error('发布失败')
      } finally {
        posting.value = false
      }
    }

    // 点赞
    const toggleLike = (post) => {
      post.isLiked = !post.isLiked
      post.likes += post.isLiked ? 1 : -1
    }

    // 显示评论
    const showComments = (post) => {
      post.showComments = !post.showComments
    }

    // 提交评论
    const submitComment = async (post) => {
      if (!commentText.value.trim()) {
        ElMessage.warning('请输入评论内容')
        return
      }

      try {
        // 这里应该调用API提交评论
        const newComment = {
          id: Date.now(),
          user: { name: '当前用户', avatar: '' },
          content: commentText.value,
          time: new Date().toLocaleString()
        }
        post.comments.push(newComment)
        commentText.value = ''
        ElMessage.success('评论成功')
      } catch (error) {
        ElMessage.error('评论失败')
      }
    }

    // 添加图片预览方法
    const previewImage = (index, images) => {
      currentImageIndex.value = index
      showViewer.value = true
    }

    // 添加图片网格布局类名计算方法
    const getImageGridClass = (count) => {
      if (count === 1) return 'single-image'
      if (count === 2) return 'two-images'
      if (count === 3) return 'three-images'
      return 'four-images'
    }

    // 处理餐厅选择变化
    const handleCanteenChange = (value) => {
      postForm.value.window = '' // 清空窗口选择
    }

    // 图片上传前验证
    const beforeImageUpload = (file) => {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        ElMessage.error('只能上传 JPG 或 PNG 格式的图片!')
        return false
      }
      if (!isLt2M) {
        ElMessage.error('图片大小不能超过 2MB!')
        return false
      }
      
      if (postForm.value.images.length >= 4) {
        ElMessage.warning('最多只能上传4张图片')
        return false
      }
      return true
    }

    // 处理图片移除
    const handleImageRemove = (file) => {
      const index = postForm.value.images.indexOf(file)
      if (index !== -1) {
        postForm.value.images.splice(index, 1)
      }
    }

    // 取消发布
    const cancelPost = () => {
      ElMessageBox.confirm('确定要取消发布吗？已输入的内容将会丢失', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '继续编辑',
        type: 'warning'
      }).then(() => {
        postDialogVisible.value = false
        resetForm()
      }).catch(() => {})
    }

    // 重置表单
    const resetForm = () => {
      if (postFormRef.value) {
        postFormRef.value.resetFields()
      }
      postForm.value = {
        type: 'recommend',
        title: '',
        canteen: '',
        window: '',
        dish: '',
        content: '',
        images: [],
        price: 0,
        rating: 0
      }
    }

    onMounted(() => {
      // 初始化帖子数据
      posts.value = mockPosts
    })

    return {
      posts,
      postDialogVisible,
      posting,
      postForm,
      commentText,
      canteens,
      filteredWindows,
      filterType,
      filterCanteen,
      sortBy,
      showPostDialog,
      handleImageChange,
      submitPost,
      toggleLike,
      showComments,
      submitComment,
      previewImage,
      getImageGridClass,
      filteredPosts,
      handleCanteenChange,
      beforeImageUpload,
      handleImageRemove,
      cancelPost,
      resetForm,
      postFormRef,
      postRules
    }
  }
}

export default RecommendationSquare 
</script>

<style scoped>
.recommendation-square {
  padding: 16px;
}

.post-action {
  margin-bottom: 20px;
  text-align: right;
}

.post-card {
  margin-bottom: 20px;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-detail {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: 500;
}

.post-time {
  font-size: 12px;
  color: #909399;
}

.post-content {
  margin-bottom: 16px;
}

.post-title {
  margin: 0 0 12px;
  font-size: 18px;
}

.location-info {
  margin-bottom: 12px;
  display: flex;
  gap: 8px;
}

.post-text {
  margin: 0 0 12px;
  line-height: 1.6;
}

.post-images {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.post-image {
  width: 100px;
  height: 100px;
  border-radius: 4px;
}

.post-actions {
  display: flex;
  justify-content: space-around;
  padding: 12px 0;
  border-top: 1px solid #eee;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: #606266;
}

.action-item:hover {
  color: #409EFF;
}

.action-item .active {
  color: #409EFF;
}

.comments-section {
  margin-top: 16px;
}

.comment-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.comment-content {
  flex: 1;
}

.comment-user {
  font-weight: 500;
  margin-bottom: 4px;
}

.comment-time {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.comment-input {
  margin-top: 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.comment-input .el-input {
  flex: 1;
}

/* 添加新的样式 */
.filter-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-item {
  min-width: 120px;
}

.image-grid {
  display: grid;
  gap: 4px;
  margin-top: 12px;
}

.image-grid.single-image {
  grid-template-columns: 1fr;
}

.image-grid.two-images {
  grid-template-columns: repeat(2, 1fr);
}

.image-grid.three-images {
  grid-template-columns: repeat(3, 1fr);
}

.image-grid.four-images {
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
}

.image-item {
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
}

.image-item .el-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.image-item:hover .el-image {
  transform: scale(1.05);
}

.post-tags {
  margin-bottom: 12px;
  display: flex;
  gap: 8px;
}

/* 美化帖子卡片 */
.post-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* 优化评论区样式 */
.comments-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
}

.comment-item {
  background: white;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
}

/* 添加动画效果 */
.post-actions .action-item {
  transition: all 0.3s;
}

.post-actions .action-item:hover {
  transform: scale(1.1);
}

/* 发布对话框样式 */
.post-type-selector {
  display: flex;
  gap: 16px;
}

.type-item {
  flex: 1;
  padding: 16px;
  border: 2px solid #dcdfe6;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s;
}

.type-item.active {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.type-item .el-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.type-item span {
  display: block;
  font-size: 16px;
  margin-bottom: 4px;
}

.type-item small {
  display: block;
  font-size: 12px;
  color: #909399;
}

.upload-text {
  font-size: 12px;
  color: #909399;
  text-align: center;
  margin-top: 8px;
}

.post-preview {
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  padding: 16px;
}

.preview-header {
  font-size: 14px;
  color: #909399;
  margin-bottom: 16px;
}

.preview-tags {
  margin: 12px 0;
  display: flex;
  gap: 8px;
}

.preview-text {
  color: #606266;
  line-height: 1.6;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style> 