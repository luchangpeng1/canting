<template>
  <div class="dish-detail">
    <el-skeleton :loading="loading" animated>
      <template #template>
        <div class="skeleton-content">
          <el-skeleton-item variant="image" style="width: 100%; height: 400px"/>
          <div style="padding: 20px">
            <el-skeleton-item variant="h1" style="width: 50%"/>
            <el-skeleton-item variant="text" style="margin-top: 16px"/>
            <el-skeleton-item variant="text" style="width: 80%"/>
          </div>
        </div>
      </template>
      
      <template #default>
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
              :preview-src-list="[dish.image_url]"
              :initial-index="0"
              class="banner-image"
              loading="lazy">
              <template #placeholder>
                <div class="image-placeholder">
                  <el-icon class="is-loading"><Loading /></el-icon>
                </div>
              </template>
              <template #error>
                <div class="image-placeholder">
                  <el-icon><Picture /></el-icon>
                  <span>暂无图片</span>
                </div>
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
              <div class="primary-actions">
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
              <div class="secondary-actions">
                <el-button 
                  :type="isFavorite ? 'danger' : 'default'"
                  circle
                  @click="toggleFavorite">
                  <el-icon><Star /></el-icon>
                </el-button>
                <el-button 
                  type="primary" 
                  circle
                  @click="showShareMenu">
                  <el-icon><Share /></el-icon>
                </el-button>
              </div>
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

        <el-dialog
          title="分享菜品"
          v-model="shareDialogVisible"
          width="300px">
          <div class="share-options">
            <div class="share-item" @click="shareToWeChat">
              <el-icon><ChatDotRound /></el-icon>
              <span>微信</span>
            </div>
            <div class="share-item" @click="shareToWeibo">
              <el-icon><Promotion /></el-icon>
              <span>微博</span>
            </div>
            <div class="share-item" @click="copyLink">
              <el-icon><Link /></el-icon>
              <span>复制链接</span>
            </div>
          </div>
        </el-dialog>
      </template>
    </el-skeleton>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, ShoppingCart, Plus, Loading, Picture, Star, Share, ChatDotRound, Promotion, Link } from '@element-plus/icons-vue'
import request from '@/utils/request'

export default {
  name: 'DishDetail',
  components: {
    ArrowLeft,
    ShoppingCart,
    Plus,
    Loading,
    Picture,
    Star,
    Share,
    ChatDotRound,
    Promotion,
    Link
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const dish = ref({})
    const orderDialogVisible = ref(false)
    const orderFormRef = ref(null)
    const reviews = ref([])
    const averageRating = ref(0)
    const loading = ref(true)
    const isFavorite = ref(false)
    const shareDialogVisible = ref(false)

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

    const ratingValue = ref(0)

    // 监听 averageRating 的变化
    watch(averageRating, (newValue) => {
      ratingValue.value = Number(newValue)
    })

    // 获取菜品详情
    const fetchDishDetail = async () => {
      try {
        await Promise.all([
          fetchDishData(),
          fetchReviews()
        ])
      } catch (error) {
        ElMessage.error('加载数据失败')
      } finally {
        loading.value = false
      }
    }

    // 获取菜品数据
    const fetchDishData = async () => {
      try {
        // 在实际开发中替换为真实的API调用
        // const response = await request.get(`/student/dishes/${route.params.id}`)
        // dish.value = response.data
        
        // 使用测试数据
        const testDish = {
          id: route.params.id,
          name: '麻婆豆腐',
          price: 15.8,
          description: '使用特级郫县豆瓣酱，搭配嫩滑豆腐，口感麻辣鲜香。选用上等猪肉末，配以青葱点缀，是一道经典的川菜。',
          category: '川菜',
          taste: 'spicy',
          image_url: 'https://images.unsplash.com/photo-1582476693547-81b4bd1af22e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          stock: 28,
          monthSales: 342,
          weekSales: 89,
          daySales: 12,
          rating: 4.8,
          ingredients: [
            '嫩豆腐',
            '猪肉末',
            '郫县豆瓣酱',
            '青葱',
            '花椒',
            '干辣椒'
          ],
          nutritionFacts: {
            calories: 287,
            protein: '15g',
            carbohydrates: '8.5g',
            fat: '22g'
          },
          cookingTime: '15分钟',
          spicyLevel: 3, // 1-5级辣度
          isSignatureDish: true,
          tags: ['热销', '招牌菜', '川菜经典']
        }
        dish.value = testDish
      } catch (error) {
        console.error('获取菜品数据失败:', error)
        ElMessage.error('获取菜品数据失败')
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
            userAvatar: 'https://avatars.githubusercontent.com/u/1?v=4',
            rating: 5,
            content: '这道麻婆豆腐真的太好吃了！麻辣鲜香，豆腐嫩滑，肉末的咸香和辣椒的麻辣完美融合。特别喜欢这个口味，以后还会经常点！',
            createTime: '2024-03-15 12:30',
            images: [
              'https://images.unsplash.com/photo-1582476693547-81b4bd1af22e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
              'https://images.unsplash.com/photo-1582476693547-81b4bd1af22e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            ]
          },
          {
            id: 2,
            userName: '李四',
            userAvatar: 'https://avatars.githubusercontent.com/u/2?v=4',
            rating: 4,
            content: '味道不错，就是有点辣。豆腐很嫩，肉末也很新鲜。建议可以让顾客选择辣度。',
            createTime: '2024-03-14 18:45'
          },
          {
            id: 3,
            userName: '小王',
            userAvatar: 'https://avatars.githubusercontent.com/u/3?v=4',
            rating: 5,
            content: '学校食堂的麻婆豆腐竟然这么正宗！价格也很实惠，份量足够。特别喜欢这个咸鲜味，下饭神器！',
            createTime: '2024-03-14 12:15',
            images: [
              'https://images.unsplash.com/photo-1582476693547-81b4bd1af22e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            ]
          },
          {
            id: 4,
            userName: '美食达人',
            userAvatar: 'https://avatars.githubusercontent.com/u/4?v=4',
            rating: 4,
            content: '整体来说是不错的，豆腐的口感很好，不过感觉辣度可以再重一点。期待下次能有更多惊喜！',
            createTime: '2024-03-13 19:20'
          },
          {
            id: 5,
            userName: '校园吃货',
            userAvatar: 'https://avatars.githubusercontent.com/u/5?v=4',
            rating: 5,
            content: '这道麻婆豆腐绝对是食堂的招牌！每次来都必点，从来没有失望过。豆腐很新鲜，酱料的比例也刚刚好。',
            createTime: '2024-03-13 13:40',
            images: [
              'https://images.unsplash.com/photo-1582476693547-81b4bd1af22e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
              'https://images.unsplash.com/photo-1582476693547-81b4bd1af22e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
              'https://images.unsplash.com/photo-1582476693547-81b4bd1af22e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            ]
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

    const toggleFavorite = async () => {
      try {
        // 调用收藏API
        isFavorite.value = !isFavorite.value
        ElMessage.success(isFavorite.value ? '收藏成功' : '已取消收藏')
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
    
    const copyLink = () => {
      // 实现复制链接功能
      const url = window.location.href
      navigator.clipboard.writeText(url)
      ElMessage.success('链接已复制')
      shareDialogVisible.value = false
    }

    const showShareMenu = () => {
      shareDialogVisible.value = true
    }

    const shareToWeChat = () => {
      ElMessage.success('已打开微信分享')
      shareDialogVisible.value = false
    }
    
    const shareToWeibo = () => {
      ElMessage.success('已打开微博分享')
      shareDialogVisible.value = false
    }

    onMounted(() => {
      fetchDishDetail()
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
      ratingValue,
      loading,
      isFavorite,
      shareDialogVisible,
      toggleFavorite,
      copyLink,
      showShareMenu,
      shareToWeChat,
      shareToWeibo
    }
  }
}
</script>

<style scoped>
.dish-detail {
  padding: 8px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.main-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
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
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
}

.primary-actions {
  display: flex;
  gap: 16px;
  flex: 1;
}

.order-btn,
.cart-btn {
  min-width: 120px;
  flex: 1;
  height: 48px;
  font-size: 16px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.secondary-actions {
  display: flex;
  gap: 8px;
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
  margin-bottom: 12px;
  padding: 0 8px;
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
    flex-direction: row;
    flex-wrap: wrap;
    align-items: stretch;
    gap: 12px;
  }

  .primary-actions {
    flex-direction: row;
    gap: 12px;
    flex: 1;
    min-width: 0;
  }

  .order-btn,
  .cart-btn {
    padding: 0 16px;
    font-size: 14px;
    height: 40px;
  }

  .secondary-actions {
    margin-top: 0;
    gap: 12px;
  }

  .review-images {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }

  @media (max-width: 360px) {
    .action-buttons {
      flex-direction: column;
    }
    
    .secondary-actions {
      margin-top: 12px;
    }
  }

  .order-btn .el-icon,
  .cart-btn .el-icon {
    font-size: 16px;
    margin-right: 4px;
  }
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
  color: #909399;
}

.image-placeholder .el-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.secondary-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.share-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 16px;
}

.share-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.3s;
}

.share-item:hover {
  background-color: #f5f7fa;
}

.rating-distribution {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.star-label {
  width: 40px;
  text-align: right;
}

.percentage {
  width: 40px;
}

.review-filters {
  margin-bottom: 20px;
}
</style> 