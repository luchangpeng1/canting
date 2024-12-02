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

    <!-- 帖子列表 -->
    <div class="posts-list">
      <el-card v-for="post in posts" :key="post.id" class="post-card">
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
      width="90%">
      <el-form :model="postForm" label-width="80px">
        <el-form-item label="类型">
          <el-radio-group v-model="postForm.type">
            <el-radio label="recommend">推荐</el-radio>
            <el-radio label="warning">避雷</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="postForm.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="餐厅">
          <el-select v-model="postForm.canteen" placeholder="选择餐厅">
            <el-option
              v-for="canteen in canteens"
              :key="canteen.id"
              :label="canteen.name"
              :value="canteen.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="窗口">
          <el-select v-model="postForm.window" placeholder="选择窗口">
            <el-option
              v-for="window in windows"
              :key="window.id"
              :label="window.name"
              :value="window.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="菜品">
          <el-input v-model="postForm.dish" placeholder="输入菜品名称" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="postForm.content"
            type="textarea"
            :rows="4"
            placeholder="详细描述你的体验..."
          />
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-change="handleImageChange">
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="postDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPost" :loading="posting">
          发布
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Edit, CaretTop, ChatDotRound, Share, Plus } from '@element-plus/icons-vue'


export default {
  name: 'RecommendationSquare',
  components: {
    Edit,
    CaretTop,
    ChatDotRound,
    Share,
    Plus
  },
  setup() {
    const posts = ref([])
    const postDialogVisible = ref(false)
    const posting = ref(false)
    const commentText = ref('')

    // 发布表单
    const postForm = ref({
      type: 'recommend',
      title: '',
      canteen: '',
      window: '',
      dish: '',
      content: '',
      images: []
    })

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

    // 餐厅和窗口数据
    const canteens = ref([
      { id: 1, name: '中央食堂' },
      { id: 2, name: '沁园餐厅' }
    ])

    const windows = ref([
      { id: 1, name: '特色炒菜' },
      { id: 2, name: '面食档口' }
    ])

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
          images: []
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

    onMounted(() => {
      posts.value = mockPosts
    })

    return {
      posts,
      postDialogVisible,
      posting,
      postForm,
      commentText,
      canteens,
      windows,
      showPostDialog,
      handleImageChange,
      submitPost,
      toggleLike,
      showComments,
      submitComment
    }
  }
}
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
</style> 