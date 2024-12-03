<template>
  <div class="dish-detail">
    <div class="back-button">
      <el-button 
        @click="goBack" 
        class="custom-back-btn"
        link>
        <div class="back-content">
          <el-icon class="back-icon"><ArrowLeft /></el-icon>
          <span class="back-text">返回上一页</span>
        </div>
      </el-button>
    </div>

    <el-card class="main-card" :body-style="{ padding: '0px' }">
      <div class="dish-banner">
        <el-image 
          :src="dish.image_url" 
          :alt="dish.name"
          fit="cover"
          class="banner-image">
          <template #error>
            <div class="image-placeholder">暂无图片</div>
          </template>
        </el-image>
        <div class="banner-overlay">
          <h1 class="dish-title">{{ dish.name }}</h1>
          <div class="tags">
            <el-tag effect="dark" class="tag-item">{{ dish.category }}</el-tag>
            <el-tag type="success" effect="dark" class="tag-item" v-if="dish.taste">
              {{ getTasteLabel(dish.taste) }}
            </el-tag>
          </div>
        </div>
      </div>

      <div class="info-section">
        <div class="price-section">
          <span class="price-symbol">¥</span>
          <span class="price-amount">{{ dish.price }}</span>
          <span class="stock-tag" :class="{ 'out-of-stock': dish.stock === 0 }">
            {{ dish.stock > 0 ? `库存: ${dish.stock}` : '已售罄' }}
          </span>
        </div>

        <div class="sales-grid">
          <div class="sales-item">
            <div class="sales-number">{{ dish.monthSales || 0 }}</div>
            <div class="sales-label">月销量</div>
          </div>
          <div class="sales-divider"></div>
          <div class="sales-item">
            <div class="sales-number">{{ dish.weekSales || 0 }}</div>
            <div class="sales-label">周销量</div>
          </div>
          <div class="sales-divider"></div>
          <div class="sales-item">
            <div class="sales-number">{{ dish.daySales || 0 }}</div>
            <div class="sales-label">日销量</div>
          </div>
        </div>

        <div class="description-box">
          <p class="description-text">{{ dish.description }}</p>
        </div>

        <div class="action-buttons">
          <el-button 
            type="primary" 
            class="order-btn"
            @click="showOrderDialog"
            :disabled="dish.stock === 0">
            <el-icon><ShoppingCart /></el-icon>
            立即预订
          </el-button>
          <el-button 
            type="success" 
            class="cart-btn"
            @click="addToCart"
            :disabled="dish.stock === 0">
            <el-icon><Plus /></el-icon>
            加入购物车
          </el-button>
        </div>
      </div>
    </el-card>

    <el-card class="reviews-card">
      <template #header>
        <div class="reviews-header">
          <h3 class="section-title">用户评价</h3>
          <div class="review-stats">
            <span class="rating">{{ averageRating }}</span>
            <el-rate
              v-model="ratingValue"
              disabled
              show-score
              text-color="#ff9900"
              score-template="">
            </el-rate>
            <span class="review-count">({{ reviews.length }}条评价)</span>
          </div>
        </div>
      </template>

      <div class="reviews-list">
        <el-empty 
          v-if="!reviews.length" 
          description="暂无评价"
          :image-size="200">
        </el-empty>
        <div v-else v-for="review in reviews" :key="review.id" class="review-item">
          <div class="review-header">
            <el-avatar 
              :size="50" 
              :src="review.userAvatar"
              class="user-avatar">
              {{ review.userName.charAt(0) }}
            </el-avatar>
            <div class="review-user-info">
              <span class="user-name">{{ review.userName }}</span>
              <el-rate
                v-model="review.rating"
                disabled
                show-score
                text-color="#ff9900">
              </el-rate>
              <span class="review-time">{{ review.createTime }}</span>
            </div>
          </div>
          <div class="review-content">{{ review.content }}</div>
          <div v-if="review.images?.length" class="review-images">
            <el-image
              v-for="(image, index) in review.images"
              :key="index"
              :src="image"
              :preview-src-list="review.images"
              fit="cover"
              class="review-image">
            </el-image>
          </div>
        </div>
      </div>
    </el-card>

    <el-dialog 
      title="预订菜品" 
      v-model="orderDialogVisible"
      width="30%">
      <el-form :model="orderForm" :rules="orderRules" ref="orderFormRef">
        <el-form-item label="就餐时间" prop="reservedTime">
          <el-time-select
            v-model="orderForm.reservedTime"
            :picker-options="{
              start: '10:30',
              step: '00:15',
              end: '20:00'
            }"
            placeholder="选择就餐时间">
          </el-time-select>
        </el-form-item>
        
        <el-form-item label="就餐方式" prop="mealType">
          <el-radio-group v-model="orderForm.mealType">
            <el-radio label="dine_in">堂食</el-radio>
            <el-radio label="take_out">打包</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="数量" prop="quantity">
          <el-input-number 
            v-model="orderForm.quantity" 
            :min="1" 
            :max="dish.stock"
            :step="1">
          </el-input-number>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="orderDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitOrder">确认预订</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, ShoppingCart, Plus } from '@element-plus/icons-vue'
import request from '@/utils/request'

export default {
  name: 'DishDetail',
  components: {
    ArrowLeft,
    ShoppingCart,
    Plus
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const dish = ref({})
    const orderDialogVisible = ref(false)
    const orderFormRef = ref(null)
    const reviews = ref([])
    const averageRating = ref(0)

    const orderForm = reactive({
      reservedTime: '',
      mealType: 'dine_in',
      quantity: 1
    })

    const orderRules = {
      reservedTime: [
        { required: true, message: '请选择就餐时间', trigger: 'change' }
      ],
      mealType: [
        { required: true, message: '请选择就餐方式', trigger: 'change' }
      ],
      quantity: [
        { required: true, message: '请选择数量', trigger: 'change' }
      ]
    }

    const ratingValue = computed(() => Number(averageRating.value))

    // 获取菜品详情
    const fetchDishDetail = async () => {
      try {
        // 在实际开发中替换为真实的API调用
        // const response = await request.get(`/student/dishes/${route.params.id}`)
        // dish.value = response.data
        
        // 使用���试数据
        const testDish = {
          id: route.params.id,
          name: '测试菜品',
          price: 15,
          description: '这是一道美味的测试菜品',
          category: '测试分类',
          taste: 'spicy',
          image_url: 'https://example.com/test.jpg',
          stock: 10
        }
        dish.value = testDish
      } catch (error) {
        console.error('获取菜品详情失败:', error)
        ElMessage.error('获取菜品详情失败')
      }
    }

    // 获取菜品评价
    const fetchReviews = async () => {
      try {
        // 在实际开发中替换为真实的API调用
        // const response = await request.get(`/student/dishes/${route.params.id}/reviews`)
        // reviews.value = response.data.reviews
        
        // 测试数据
        reviews.value = [
          {
            id: 1,
            userName: '张三',
            userAvatar: 'https://example.com/avatar1.jpg',
            rating: 5,
            content: '这道菜非常美味，下次还会再来！食材新鲜，配料搭配得当，特别是那个酱料，绝了！',
            createTime: '2024-03-15 12:30',
            images: [
              'https://example.com/review1-1.jpg',
              'https://example.com/review1-2.jpg'
            ]
          },
          {
            id: 2,
            userName: '李四',
            userAvatar: 'https://example.com/avatar2.jpg',
            rating: 4,
            content: '味道不错，就是份量稍微少了点。服务态度很好，上菜速度快。',
            createTime: '2024-03-14 18:45'
          },
          {
            id: 3,
            userName: '小王',
            userAvatar: 'https://example.com/avatar3.jpg',
            rating: 5,
            content: '学校食堂能有这样的水准真是太棒了！价格实惠，味道地道，特别推荐！',
            createTime: '2024-03-14 12:15',
            images: [
              'https://example.com/review3.jpg'
            ]
          },
          {
            id: 4,
            userName: '美食达人',
            userAvatar: 'https://example.com/avatar4.jpg',
            rating: 3,
            content: '整体来说还可以，不过感觉调味可以再改进一下，稍微有点咸。希望厨师能够根据建议改进。',
            createTime: '2024-03-13 19:20'
          },
          {
            id: 5,
            userName: '校园吃货',
            userAvatar: 'https://example.com/avatar5.jpg',
            rating: 5,
            content: '这道菜绝对是食堂的招牌！每次来都必点，从来没有失望过。食材的搭配很用心，摆盘也很精致。',
            createTime: '2024-03-13 13:40',
            images: [
              'https://example.com/review5-1.jpg',
              'https://example.com/review5-2.jpg',
              'https://example.com/review5-3.jpg'
            ]
          },
          {
            id: 6,
            userName: '小林',
            userAvatar: 'https://example.com/avatar6.jpg',
            rating: 4,
            content: '作为学校食堂的菜品来说已经很不错了，性价比很高。建议可以考虑推出套餐搭配。',
            createTime: '2024-03-12 17:55'
          },
          {
            id: 7,
            userName: '美食评论家',
            userAvatar: 'https://example.com/avatar7.jpg',
            rating: 5,
            content: '这道菜的口感层次非常丰富，能吃出厨师的用心。特别是酱料的调配很有特色，为整道菜增色不少。强烈推荐大家尝试！',
            createTime: '2024-03-12 12:10',
            images: [
              'https://example.com/review7-1.jpg',
              'https://example.com/review7-2.jpg'
            ]
          },
          {
            id: 8,
            userName: '老顾客',
            userAvatar: 'https://example.com/avatar8.jpg',
            rating: 4,
            content: '连续点了好多次了，味道一直保持得很稳定。希望能保持这个水准，继续做下去！',
            createTime: '2024-03-11 18:30'
          }
        ]
        
        // 计算平均评分
        const totalRating = reviews.value.reduce((sum, review) => sum + review.rating, 0)
        averageRating.value = (totalRating / reviews.value.length).toFixed(1)
      } catch (error) {
        console.error('获取评价失败:', error)
        ElMessage.error('获取评价失败')
      }
    }

    // 提交预订
    const submitOrder = async () => {
      if (!orderFormRef.value) return
      
      try {
        await orderFormRef.value.validate()
        
        // 在实际开发中替换为真实的API调用
        // await request.post('/student/orders', {
        //   dishId: dish.value.id,
        //   ...orderForm
        // })
        
        ElMessage.success('预订成功')
        orderDialogVisible.value = false
        router.push('/student/orders')
      } catch (error) {
        console.error('预订失败:', error)
        ElMessage.error('预订失败')
      }
    }

    // 添加到购物车
    const addToCart = async () => {
      try {
        // 在实际开发中替换为真实的API调用
        // await request.post('/student/cart', {
        //   dishId: dish.value.id,
        //   quantity: 1
        // })
        
        ElMessage.success('已添加到购物车')
      } catch (error) {
        console.error('添加购物车失败:', error)
        ElMessage.error('添加购物车失败')
      }
    }

    // 获取口味标签
    const getTasteLabel = (taste) => {
      const tasteMap = {
        'spicy': '麻辣',
        'light': '清淡',
        'sweet': '甜味',
        'savory': '咸鲜'
      }
      return tasteMap[taste] || taste
    }

    // 添加路由离开钩子
    onBeforeRouteLeave((to, from, next) => {
      // 如果是返回到菜品列表页面
      if (to.name === 'DishList') {
        // 标记这是一个返回操作
        localStorage.setItem('isReturningFromDetail', 'true')
      }
      next()
    })

    // 修改返回函数
    const goBack = () => {
      localStorage.setItem('isReturningFromDetail', 'true')
      router.back()
    }

    onMounted(() => {
      fetchDishDetail()
      fetchReviews()
    })

    return {
      dish,
      orderDialogVisible,
      orderForm,
      orderFormRef,
      orderRules,
      showOrderDialog: () => {
        orderDialogVisible.value = true
      },
      submitOrder,
      addToCart,
      getTasteLabel,
      goBack,
      reviews,
      averageRating,
      ratingValue
    }
  }
}
</script>

<style scoped>
.dish-detail {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.main-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.dish-banner {
  position: relative;
  height: 400px;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  color: white;
}

.dish-title {
  font-size: 32px;
  margin: 0;
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.tag-item {
  margin-right: 10px;
  border: none;
}

.info-section {
  padding: 24px;
}

.price-section {
  display: flex;
  align-items: baseline;
  margin-bottom: 24px;
}

.price-symbol {
  font-size: 20px;
  color: #f56c6c;
  margin-right: 4px;
}

.price-amount {
  font-size: 36px;
  font-weight: bold;
  color: #f56c6c;
}

.stock-tag {
  margin-left: 16px;
  padding: 4px 12px;
  border-radius: 16px;
  background-color: #e1f3d8;
  color: #67c23a;
  font-size: 14px;
}

.out-of-stock {
  background-color: #fef0f0;
  color: #f56c6c;
}

.sales-grid {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 24px;
  background: #fafafa;
  border-radius: 12px;
  margin-bottom: 24px;
}

.sales-divider {
  width: 1px;
  height: 40px;
  background-color: #dcdfe6;
}

.sales-item {
  text-align: center;
}

.sales-number {
  font-size: 28px;
  color: #409EFF;
  font-weight: bold;
  margin-bottom: 8px;
}

.sales-label {
  font-size: 14px;
  color: #909399;
}

.description-box {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid #ebeef5;
}

.description-text {
  font-size: 16px;
  line-height: 1.8;
  color: #606266;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.order-btn, .cart-btn {
  flex: 1;
  height: 48px;
  font-size: 16px;
  border-radius: 24px;
}

.reviews-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 24px;
  margin: 0;
  color: #303133;
}

.review-stats {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rating {
  font-size: 32px;
  font-weight: bold;
  color: #ff9900;
}

.review-count {
  color: #909399;
  font-size: 14px;
}

.review-item {
  padding: 24px 0;
  border-bottom: 1px solid #ebeef5;
}

.user-avatar {
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.review-user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.review-time {
  font-size: 12px;
  color: #909399;
}

.review-content {
  padding: 16px 0;
  font-size: 15px;
  line-height: 1.8;
  color: #606266;
}

.review-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.review-image {
  width: 100%;
  height: 120px;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.review-image:hover {
  transform: scale(1.05);
}

.back-button {
  margin-bottom: 24px;
  padding: 0 20px;
}

.custom-back-btn {
  height: auto;
  padding: 8px 0;
  transition: all 0.3s ease;
  position: relative;
  overflow: visible;
}

.back-content {
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #606266;
}

.back-icon {
  margin-right: 8px;
  font-size: 16px;
  transition: transform 0.3s ease;
}

.back-text {
  position: relative;
  font-weight: 500;
}

.back-text::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #409EFF;
  transition: width 0.3s ease;
}

.custom-back-btn:hover .back-content {
  color: #409EFF;
}

.custom-back-btn:hover .back-icon {
  transform: translateX(-4px);
}

.custom-back-btn:hover .back-text::after {
  width: 100%;
}

@media (max-width: 768px) {
  .dish-detail {
    padding: 12px;
  }

  .dish-banner {
    height: 250px;
  }

  .dish-title {
    font-size: 24px;
  }

  .price-amount {
    font-size: 28px;
  }

  .sales-grid {
    padding: 16px;
  }

  .sales-number {
    font-size: 24px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .review-images {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style> 