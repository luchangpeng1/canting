<template>
  <div class="dish-detail">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>{{ dish.name }}</h2>
          <el-tag>{{ dish.category }}</el-tag>
        </div>
      </template>
      <div class="dish-content">
        <div class="dish-image">
          <img :src="dish.image_url" :alt="dish.name">
        </div>
        <div class="dish-info">
          <p class="price">¥{{ dish.price }}</p>
          <p class="description">{{ dish.description }}</p>
          <div class="actions">
            <el-button type="primary" @click="showOrderDialog">立即预订</el-button>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 预订对话框 -->
    <el-dialog title="预订菜品" v-model="orderDialogVisible">
      <el-form :model="orderForm">
        <el-form-item label="就餐时间">
          <el-time-select v-model="orderForm.reservedTime"></el-time-select>
        </el-form-item>
        <el-form-item label="就餐方式">
          <el-radio-group v-model="orderForm.mealType">
            <el-radio label="dine_in">堂食</el-radio>
            <el-radio label="take_out">打包</el-radio>
          </el-radio-group>
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
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import request from '../../utils/request'

export default {
  name: 'DishDetail',
  setup() {
    const route = useRoute()
    const dish = ref({})
    const orderDialogVisible = ref(false)
    const orderForm = reactive({
      reservedTime: '',
      mealType: 'dine_in'
    })

    // 获取菜品详情
    const fetchDishDetail = async () => {
      try {
        const response = await request.get(`/student/dishes/${route.params.id}`)
        dish.value = response.data
      } catch (error) {
        console.error('获取菜品详情失败:', error)
      }
    }

    // 提交预订
    const submitOrder = async () => {
      try {
        await request.post('/student/reserve', {
          ...orderForm,
          dish_id: dish.value.id
        })
        orderDialogVisible.value = false
      } catch (error) {
        console.error('预订失败:', error)
      }
    }

    onMounted(() => {
      fetchDishDetail()
    })

    return {
      dish,
      orderDialogVisible,
      orderForm,
      showOrderDialog: () => {
        orderDialogVisible.value = true
      },
      submitOrder
    }
  }
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dish-content {
  display: flex;
  gap: 20px;
}

.dish-image img {
  width: 300px;
  height: 300px;
  object-fit: cover;
}

.dish-info {
  flex: 1;
}

.price {
  font-size: 24px;
  color: #f56c6c;
  margin-bottom: 20px;
}

.description {
  margin-bottom: 20px;
  line-height: 1.6;
}
</style> 