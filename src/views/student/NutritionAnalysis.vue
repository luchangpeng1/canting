<template>
  <div class="nutrition-analysis">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>营养摄入分析</h3>
        </div>
      </template>
      <div class="analysis-content">
        <div class="nutrition-stats">
          <div class="stat-item">
            <h4>热量</h4>
            <p>{{ nutritionData.calories }} 千卡</p>
          </div>
          <div class="stat-item">
            <h4>蛋白质</h4>
            <p>{{ nutritionData.protein }} 克</p>
          </div>
          <div class="stat-item">
            <h4>脂肪</h4>
            <p>{{ nutritionData.fat }} 克</p>
          </div>
          <div class="stat-item">
            <h4>碳水化合物</h4>
            <p>{{ nutritionData.carbs }} 克</p>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import request from '../../utils/request'

export default {
  name: 'NutritionAnalysis',
  setup() {
    const nutritionData = ref({
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0
    })

    const fetchNutritionData = async () => {
      try {
        const response = await request.get('/student/nutritional_analysis/1') // 1 是示例用户ID
        nutritionData.value = response.data
      } catch (error) {
        console.error('获取营养分析数据失败:', error)
      }
    }

    onMounted(() => {
      fetchNutritionData()
    })

    return {
      nutritionData
    }
  }
}
</script>

<style scoped>
.nutrition-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.stat-item h4 {
  margin-bottom: 10px;
  color: #666;
}

.stat-item p {
  font-size: 24px;
  color: #409EFF;
}
</style> 