<template>
  <div class="window-management" :class="{ 'mobile': isMobile }">
    <!-- 顶部操作栏 -->
    <div class="toolbar" style="margin-bottom: 20px;">
      <div class="left">
        <el-button type="primary" @click="showAddDialog">
          <el-icon><Plus /></el-icon>添加窗口
        </el-button>
        <el-button type="success" @click="handleBatchImport">
          <el-icon><Upload /></el-icon>批量导入
        </el-button>
        <el-button 
          :type="showStatistics ? 'info' : 'default'" 
          @click="toggleStatistics">
          <el-icon><component :is="showStatistics ? 'Hide' : 'View'" /></el-icon>
          {{ showStatistics ? '隐藏统计' : '显示统计' }}
        </el-button>
        <el-button 
          :type="showWindowList ? 'info' : 'default'" 
          @click="toggleWindowList">
          <el-icon><component :is="showWindowList ? 'Hide' : 'View'" /></el-icon>
          {{ showWindowList ? '隐藏列表' : '显示列表' }}
        </el-button>
        <div class="batch-actions" v-if="selectedWindows.length > 0">
          <el-divider direction="vertical" />
          <el-dropdown @command="handleBatchCommand">
            <el-button type="primary">
              批量操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="status-open">设为营业中</el-dropdown-item>
                <el-dropdown-item command="status-closed">设为已打烊</el-dropdown-item>
                <el-dropdown-item command="export">导出数据</el-dropdown-item>
                <el-dropdown-item command="delete" divided>
                  <span style="color: #f56c6c">批量删除</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span class="selected-count">已选择 {{ selectedWindows.length }} 项</span>
        </div>
      </div>
      <div class="right">
        <el-select 
          v-model="canteenFilter" 
          placeholder="选择餐厅" 
          class="filter-select"
          :popper-class="'canteen-select-dropdown'"
          style="width: 160px">
          <el-option
            v-for="canteen in canteens"
            :key="canteen.id"
            :label="canteen.name"
            :value="canteen.id">
            <template v-if="canteen.id === 0">
              <el-icon><Grid /></el-icon>
              <span>{{ canteen.name }}</span>
            </template>
            <template v-else>
              <el-icon><Shop /></el-icon>
              <span>{{ canteen.name }}</span>
            </template>
          </el-option>
        </el-select>
        <el-select 
          v-model="statusFilter" 
          placeholder="营业状态" 
          class="filter-select"
          :popper-class="'status-select-dropdown'"
          style="width: 120px">
          <el-option label="营业中" value="open">
            <el-icon color="#67C23A"><CircleCheck /></el-icon>
            <span>营业中</span>
          </el-option>
          <el-option label="已打烊" value="closed">
            <el-icon color="#F56C6C"><CircleClose /></el-icon>
            <span>已打烊</span>
          </el-option>
        </el-select>
      </div>
    </div>

    <!-- 窗口列表 -->
    <div class="table-container" :class="{ 'hidden': !showWindowList }">
      <el-table
        :data="filteredWindows"
        style="width: 100%"
        border
        stripe
        v-loading="loading"
        @selection-change="handleSelectionChange">
        <el-table-column 
          type="selection" 
          width="55"
          :selectable="(row) => !row.isProtected" />
        <el-table-column prop="name" label="窗口名称" min-width="150" />
        <el-table-column prop="canteen" label="所属餐厅" width="120" />
        <el-table-column prop="floor" label="楼层" width="80">
          <template #default="{ row }">
            {{ row.floor }}层
          </template>
        </el-table-column>
        <el-table-column prop="type" label="窗口类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.type)">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="营业时间" width="220">
          <template #default="{ row }">
            <div class="operation-time">
              <div>午餐：{{ row.lunch_time }}</div>
              <div>晚餐：{{ row.dinner_time }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="'open'"
              :inactive-value="'closed'"
              @change="(val) => handleStatusChange(row, val)"
              :loading="row.statusLoading">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button 
              link 
              type="primary" 
              @click="editWindow(row)">
              编辑
            </el-button>
            <el-button 
              link 
              type="success" 
              @click="manageMenu(row)">
              管理菜单
            </el-button>
            <el-button 
              link 
              type="danger" 
              @click="deleteWindow(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 统计卡片和图表 -->
    <div class="statistics-section" v-show="showStatistics">
      <!-- 统计卡片 -->
      <el-row :gutter="20" class="stat-cards">
        <el-col :span="6" v-for="stat in statistics" :key="stat.title">
          <el-card class="stat-card" :class="stat.type">
            <div class="stat-content">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-title">{{ stat.title }}</div>
              <div class="stat-sub-title">{{ stat.subTitle }}</div>
            </div>
            <el-icon class="stat-icon"><component :is="stat.icon" /></el-icon>
          </el-card>
        </el-col>
      </el-row>

      <!-- 图表区域 -->
      <el-row :gutter="20" class="chart-row">
        <!-- 营业额趋势图 -->
        <el-col :span="16">
          <el-card class="chart-card">
            <template #header>
              <div class="chart-header">
                <span>营业额趋势</span>
                <el-radio-group v-model="revenueTimeRange" size="small">
                  <el-radio-button value="week">本周</el-radio-button>
                  <el-radio-button value="month">本月</el-radio-button>
                  <el-radio-button value="year">全年</el-radio-button>
                </el-radio-group>
              </div>
            </template>
            <div ref="revenueChart" class="chart"></div>
          </el-card>
        </el-col>

        <!-- 窗口类型分布 -->
        <el-col :span="8">
          <el-card class="chart-card">
            <template #header>
              <div class="chart-header">
                <span>窗口类型分布</span>
              </div>
            </template>
            <div ref="typeChart" class="chart"></div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 餐厅数据对比 -->
      <el-row :gutter="20" class="chart-row">
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <div class="chart-header">
                <span>各餐厅窗口数量</span>
              </div>
            </template>
            <div ref="canteenChart" class="chart"></div>
          </el-card>
        </el-col>

        <!-- 高峰时段分析 -->
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <div class="chart-header">
                <span>客流高峰时段</span>
                <el-select v-model="peakCanteen" size="small" placeholder="选择餐厅">
                  <el-option
                    v-for="canteen in canteens"
                    :key="canteen.id"
                    :label="canteen.name"
                    :value="canteen.id">
                  </el-option>
                </el-select>
              </div>
            </template>
            <div ref="peakHoursChart" class="chart"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 添加/编辑窗口对话框 -->
    <el-dialog
      :title="isEdit ? '编辑窗口' : '添加窗口'"
      v-model="dialogVisible"
      width="500px">
      <el-form 
        :model="windowForm" 
        :rules="rules"
        ref="windowFormRef"
        label-width="100px">
        <el-form-item label="窗口名称" prop="name">
          <el-input v-model="windowForm.name" placeholder="请输入窗口名称" />
        </el-form-item>
        <el-form-item label="所属餐厅" prop="canteen_id">
          <el-select v-model="windowForm.canteen_id" placeholder="请选择餐厅">
            <el-option
              v-for="canteen in canteens"
              :key="canteen.id"
              :label="canteen.name"
              :value="canteen.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在楼层" prop="floor">
          <el-input-number 
            v-model="windowForm.floor" 
            :min="1" 
            :max="5"
            controls-position="right" />
        </el-form-item>
        <el-form-item label="窗口类型" prop="type">
          <el-select v-model="windowForm.type" placeholder="请选择类型">
            <el-option label="大荤窗口" value="大荤窗口" />
            <el-option label="小炒窗口" value="小炒窗口" />
            <el-option label="面食窗口" value="面食窗口" />
            <el-option label="特色窗口" value="特色窗口" />
            <el-option label="清真窗口" value="清真窗口" />
            <el-option label="饮品窗口" value="饮品窗口" />
          </el-select>
        </el-form-item>
        <el-form-item label="午餐时间" prop="lunch_time">
          <el-time-picker
            v-model="windowForm.lunch_time"
            is-range
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="HH:mm"
          />
        </el-form-item>
        <el-form-item label="晚餐时间" prop="dinner_time">
          <el-time-picker
            v-model="windowForm.dinner_time"
            is-range
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="HH:mm"
          />
        </el-form-item>
        <el-form-item label="窗口描述" prop="description">
          <el-input
            v-model="windowForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入窗口描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveWindow" :loading="loading">
          {{ isEdit ? '保存修改' : '添加窗口' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 批量导入对话框 -->
    <el-dialog
      title="批量导入窗口"
      v-model="importDialogVisible"
      width="400px">
      <el-upload
        class="upload-demo"
        drag
        action="/api/admin/windows/import"
        accept=".xlsx,.xls"
        :on-success="handleImportSuccess"
        :before-upload="beforeImportUpload">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            只能上传 xlsx/xls 文件，且文件大小不超过 2MB
          </div>
        </template>
      </el-upload>
    </el-dialog>

    <!-- 批量操作确认对话框 -->
    <el-dialog
      v-model="batchDialogVisible"
      :title="batchDialogTitle"
      width="400px">
      <div class="batch-dialog-content">
        <p>{{ batchDialogMessage }}</p>
        <div class="selected-items">
          <el-scrollbar max-height="200px">
            <ul>
              <li v-for="window in selectedWindows" :key="window.id">
                {{ window.name }}
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
      <template #footer>
        <el-button @click="batchDialogVisible = false">取消</el-button>
        <el-button 
          type="primary" 
          :loading="batchLoading"
          @click="confirmBatchOperation">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Plus, 
  Upload, 
  UploadFilled, 
  Shop, 
  Histogram, 
  Money, 
  User, 
  ArrowDown, 
  Grid, 
  CircleCheck, 
  CircleClose, 
  Hide, 
  View
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import * as XLSX from 'xlsx'

export default {
  name: 'WindowManagement',
  components: {
    Plus,
    Upload,
    UploadFilled,
    Shop,
    Histogram,
    Money,
    User,
    ArrowDown,
    Grid,
    CircleCheck,
    CircleClose,
    Hide,
    View
  },
  setup() {
    // 基础数据
    const loading = ref(false)
    const dialogVisible = ref(false)
    const importDialogVisible = ref(false)
    const isEdit = ref(false)
    const windowFormRef = ref(null)
    const canteenFilter = ref('')
    const statusFilter = ref('')

    // 表单数据
    const windowForm = reactive({
      name: '',
      canteen_id: '',
      floor: 1,
      type: '',
      lunch_time: [],
      dinner_time: [],
      description: '',
      status: 'open'
    })

    // 表单验证规则
    const rules = {
      name: [
        { required: true, message: '请输入窗口名称', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
      ],
      canteen_id: [
        { required: true, message: '请选择所属餐厅', trigger: 'change' }
      ],
      type: [
        { required: true, message: '请选择窗口类型', trigger: 'change' }
      ],
      lunch_time: [
        { required: true, message: '请设置午餐时间', trigger: 'change' }
      ],
      dinner_time: [
        { required: true, message: '请设置晚餐时间', trigger: 'change' }
      ]
    }

    // 获取类型标签样式
    const getTypeTag = (type) => {
      const types = {
        '大荤窗口': 'danger',
        '小炒窗口': 'warning',
        '面食窗口': 'success',
        '特色窗口': 'primary',
        '清真���口': 'info',
        '饮品窗口': 'info'
      }
      return types[type] || 'info'
    }

    // 统计数据
    const statistics = ref([
      { title: '总窗口数', value: 45, type: 'primary', icon: 'Shop' },
      { title: '营业中', value: 32, type: 'success', icon: 'Histogram' },
      { title: '今日营业额', value: '¥28,930', type: 'warning', icon: 'Money' },
      { title: '今日客流', value: '3,241', type: 'info', icon: 'User' }
    ])

    // 图表相关
    const revenueChart = ref(null)
    const typeChart = ref(null)
    const canteenChart = ref(null)
    const peakHoursChart = ref(null)
    const revenueTimeRange = ref('week')
    const peakCanteen = ref('')
    let charts = []

    // 初始化营业额趋势图
    const initRevenueChart = () => {
      const chart = echarts.init(revenueChart.value)
      charts.push(chart)
      
      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            const value = params[0].value
            return `${params[0].name}<br/>${params[0].seriesName}: ¥${value.toLocaleString()}`
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          axisLabel: {
            interval: 0,
            rotate: 30,
            fontSize: 12
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: (value) => `¥${value.toLocaleString()}`
          }
        },
        series: [
          {
            name: '营业额',
            type: 'line',
            smooth: true,
            data: [12000, 13200, 15100, 14300, 19200, 21500, 23200],
            areaStyle: {
              opacity: 0.1
            },
            lineStyle: {
              width: 3
            },
            markPoint: {
              data: [
                { type: 'max', name: '最高值' },
                { type: 'min', name: '最低值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          }
        ]
      }
      
      chart.setOption(option)
    }

    // 监听时间范围变化
    watch(revenueTimeRange, () => {
      nextTick(() => {
        initRevenueChart()
      })
    })

    // 初始化窗口类型分布图
    const initTypeChart = () => {
      const chart = echarts.init(typeChart.value)
      charts.push(chart)
      
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'middle',
          fontSize: 12
        },
        series: [
          {
            name: '窗口类型',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              formatter: '{b}\n{d}%',
              fontSize: 12
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold'
              }
            },
            data: [
              { name: '大荤窗口', value: 15, percentage: 33.3 },
              { name: '小炒窗口', value: 10, percentage: 22.2 },
              { name: '面食窗口', value: 10, percentage: 22.2 },
              { name: '特色窗口', value: 5, percentage: 11.1 },
              { name: '清真窗口', value: 5, percentage: 11.1 },
              { name: '饮品窗口', value: 5, percentage: 11.1 }
            ]
          }
        ]
      }
      
      chart.setOption(option)
    }

    // 初始化餐厅窗口数量图
    const initCanteenChart = () => {
      const chart = echarts.init(canteenChart.value)
      charts.push(chart)
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['营业中', '已打烊'],
          top: '2%'  // 将图例移到顶部
        },
        grid: {
          left: '20%',      // 增加左侧空间，给餐厅名称留出足够位置
          right: '5%',
          bottom: '8%',     // 增加底部空间
          top: '15%',       // 增加顶部空间，为图例腾出位置
          containLabel: true
        },
        xAxis: {
          type: 'value',
          axisLabel: {
            fontSize: 12
          }
        },
        yAxis: {
          type: 'category',
          data: ['中央食堂', '沁园餐厅', '馨园餐厅', '仲园餐厅', '雅园餐厅', 'A区服务点', 'F区服务点'],
          axisLabel: {
            fontSize: 12,
            interval: 0,     // 显示所有标签
            margin: 16,      // 增加标签与轴的距离
            width: 80,       // 设置标签宽度
            overflow: 'break'  // 文字过长时换行显示
          }
        },
        series: [
          {
            name: '营业中',
            type: 'bar',
            stack: 'total',
            label: {
              show: true,
              position: 'inside',  // 将数字标签放在柱子内部
              fontSize: 12
            },
            emphasis: {
              focus: 'series'
            },
            data: [10, 20, 30, 20, 15, 10, 5],
            itemStyle: {
              color: '#67C23A'
            }
          },
          {
            name: '已打烊',
            type: 'bar',
            stack: 'total',
            label: {
              show: true,
              position: 'inside',  // 将数字标签放在柱子内部
              fontSize: 12
            },
            emphasis: {
              focus: 'series'
            },
            data: [5, 10, 10, 10, 5, 5, 5],
            itemStyle: {
              color: '#F56C6C'
            }
          }
        ]
      }
      
      chart.setOption(option)
    }

    // 初始化高峰时段分析图
    const initPeakHoursChart = () => {
      const chart = echarts.init(peakHoursChart.value)
      charts.push(chart)
      
      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            return `${params[0].name}<br/>${params[0].seriesName}: ${params[0].value}人`
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', 
                 '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
          axisLabel: {
            interval: 0,
            rotate: 45,
            fontSize: 12,
            margin: 15
          }
        },
        yAxis: {
          type: 'value',
          name: '客流量',
          axisLabel: {
            formatter: '{value}人'
          }
        },
        series: [
          {
            name: '客流量',
            type: 'line',
            smooth: true,
            data: [30, 80, 120, 160, 450, 650, 420, 160, 100, 150, 380, 520, 320, 80],
            markArea: {
              data: [
                [{ 
                  xAxis: '11:00',
                  itemStyle: { color: 'rgba(255, 173, 177, 0.2)' }
                }, {
                  xAxis: '13:00'
                }],
                [{ 
                  xAxis: '17:00',
                  itemStyle: { color: 'rgba(255, 173, 177, 0.2)' }
                }, {
                  xAxis: '19:00'
                }]
              ],
              label: {
                show: true,
                formatter: '用餐高峰'
              }
            },
            markPoint: {
              data: [
                { type: 'max', name: '最高值' },
                { type: 'min', name: '最低值' }
              ]
            }
          }
        ]
      }
      
      chart.setOption(option)
    }

    // 监听餐厅选择变化
    watch(peakCanteen, () => {
      nextTick(() => {
        initPeakHoursChart()
      })
    })

    // 监听窗口大小变化
    const handleResize = () => {
      charts.forEach(chart => chart.resize())
    }

    onMounted(() => {
      initRevenueChart()
      initTypeChart()
      initCanteenChart()
      initPeakHoursChart()
      window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
      charts.forEach(chart => chart.dispose())
    })

    const isMobile = ref(window.innerWidth <= 768)

    // 批量操作相关
    const selectedWindows = ref([])
    const batchDialogVisible = ref(false)
    const batchDialogTitle = ref('')
    const batchDialogMessage = ref('')
    const batchLoading = ref(false)
    const currentBatchOperation = ref(null)

    // 处理表格选择变化
    const handleSelectionChange = (selection) => {
      selectedWindows.value = selection
    }

    // 处理批量操作命令
    const handleBatchCommand = (command) => {
      currentBatchOperation.value = command
      switch (command) {
        case 'status-open':
          showBatchDialog(
            '批量设置营业状态',
            '确定将选中的窗口设置为营业中吗？'
          )
          break
        case 'status-closed':
          showBatchDialog(
            '批量设置营业状态',
            '确定将选中的窗口设为已打烊吗？'
          )
          break
        case 'delete':
          showBatchDialog(
            '批量删除窗口',
            '确定要删除选中的窗口？此操作不可恢复！',
          )
          break
        case 'export':
          exportSelectedWindows()
          break
      }
    }

    // 显示批量操作对话框
    const showBatchDialog = (title, message) => {
      batchDialogTitle.value = title
      batchDialogMessage.value = message
      batchDialogVisible.value = true
    }

    // 确批量操作
    const confirmBatchOperation = async () => {
      try {
        batchLoading.value = true
        const ids = selectedWindows.value.map(w => w.id)

        switch (currentBatchOperation.value) {
          case 'status-open':
          case 'status-closed':
            await updateBatchStatus(ids, currentBatchOperation.value === 'status-open' ? 'open' : 'closed')
            break
          case 'delete':
            await deleteBatchWindows(ids)
            break
        }

        ElMessage.success('批量操作成功')
        batchDialogVisible.value = false
        // 刷新数据
        await fetchWindows()
      } catch (error) {
        ElMessage.error('批量作失败：' + error.message)
      } finally {
        batchLoading.value = false
      }
    }

    // 批量更新状态
    const updateBatchStatus = async (ids, status) => {
      await request.post('/admin/windows/batch-status', {
        ids,
        status
      })
    }

    // 批量删除窗口
    const deleteBatchWindows = async (ids) => {
      await request.post('/admin/windows/batch-delete', {
        ids
      })
    }

    // 导出中窗口数据
    const exportSelectedWindows = () => {
      const data = selectedWindows.value.map(window => ({
        名称: window.name,
        餐厅: window.canteen,
        楼层: window.floor + '层',
        类型: window.type,
        午餐时间: window.lunch_time,
        晚餐时间: window.dinner_time,
        状态: window.status === 'open' ? '营业中' : '已打烊'
      }))

      // 创建工作簿
      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, '窗口数据')

      // 导出文件
      XLSX.writeFile(wb, '窗口数据.xlsx')
      ElMessage.success('导出成功')
    }

    // 餐厅数据
    const canteens = ref([
      { id: 0, name: '全部窗口' },
      { id: 1, name: '中央食堂' },
      { id: 2, name: '沁园餐厅' },
      { id: 3, name: '馨园餐厅' },
      { id: 4, name: '仲园餐厅' },
      { id: 5, name: '雅园餐厅' },
      { id: 6, name: 'A区服务点' },
      { id: 7, name: 'F区服务点' }
    ])

    // 窗口数据
    const windows = ref([
      // 中央食堂
      {
        id: 1,
        name: '川湘风味',
        canteen: '中央食堂',
        floor: 1,
        type: '大荤窗口',
        lunch_time: '10:30-13:30',
        dinner_time: '16:30-19:30',
        status: 'open',
        description: '提供各类川菜湘菜',
        isProtected: false
      },
      {
        id: 2,
        name: '粤式炒饭',
        canteen: '中央食堂',
        floor: 1,
        type: '小炒窗口',
        lunch_time: '10:30-13:30',
        dinner_time: '16:30-19:30',
        status: 'open',
        description: '各类炒饭炒面',
        isProtected: false
      },
      {
        id: 3,
        name: '面点王',
        canteen: '中央食堂',
        floor: 1,
        type: '面食窗口',
        lunch_time: '10:00-14:00',
        dinner_time: '16:00-20:00',
        status: 'open',
        description: '各类面食',
        isProtected: false
      },
      // 沁园餐厅
      {
        id: 4,
        name: '东北菜',
        canteen: '沁园餐厅',
        floor: 1,
        type: '大荤窗口',
        lunch_time: '10:30-13:30',
        dinner_time: '16:30-19:30',
        status: 'open',
        description: '正宗东北菜',
        isProtected: false
      },
      {
        id: 5,
        name: '快餐部',
        canteen: '沁园餐厅',
        floor: 1,
        type: '小炒窗口',
        lunch_time: '10:30-13:30',
        dinner_time: '16:30-19:30',
        status: 'closed',
        description: '快餐套餐',
        isProtected: false
      },
      {
        id: 6,
        name: '奶茶店',
        canteen: '沁园餐厅',
        floor: 1,
        type: '饮品窗口',
        lunch_time: '09:30-20:00',
        dinner_time: '09:30-20:00',
        status: 'open',
        description: '各类饮品',
        isProtected: false
      },
      // 馨园餐厅
      {
        id: 7,
        name: '兰州拉面',
        canteen: '馨园餐厅',
        floor: 1,
        type: '面食窗口',
        lunch_time: '10:00-14:00',
        dinner_time: '16:00-20:00',
        status: 'closed',
        description: '正宗兰州拉面',
        isProtected: true
      },
      {
        id: 8,
        name: '特色小炒',
        canteen: '馨园餐厅',
        floor: 1,
        type: '小炒窗口',
        lunch_time: '10:30-13:30',
        dinner_time: '16:30-19:30',
        status: 'open',
        description: '各类特色小炒',
        isProtected: false
      },
      {
        id: 9,
        name: '水饺馆',
        canteen: '馨园餐厅',
        floor: 1,
        type: '面食窗口',
        lunch_time: '10:00-14:00',
        dinner_time: '16:00-20:00',
        status: 'open',
        description: '各类饺子',
        isProtected: false
      },
      // 仲园餐厅
      {
        id: 10,
        name: '清真餐厅',
        canteen: '仲园餐厅',
        floor: 1,
        type: '清真窗口',
        lunch_time: '10:30-13:30',
        dinner_time: '16:30-19:30',
        status: 'open',
        description: '提供清真美食',
        isProtected: false
      },
      {
        id: 11,
        name: '盖浇饭',
        canteen: '仲园餐厅',
        floor: 1,
        type: '大荤窗口',
        lunch_time: '10:30-13:30',
        dinner_time: '16:30-19:30',
        status: 'open',
        description: '各类盖浇饭',
        isProtected: false
      },
      {
        id: 12,
        name: '水吧',
        canteen: '仲园餐厅',
        floor: 1,
        type: '饮品窗口',
        lunch_time: '09:30-20:00',
        dinner_time: '09:30-20:00',
        status: 'open',
        description: '饮品果汁',
        isProtected: false
      },
      // 雅园餐厅
      {
        id: 13,
        name: '特色小吃',
        canteen: '雅园餐厅',
        floor: 1,
        type: '特色窗口',
        lunch_time: '09:30-19:30',
        dinner_time: '16:30-19:30',
        status: 'open',
        description: '各地特色小吃',
        isProtected: false
      },
      {
        id: 14,
        name: '火锅窗口',
        canteen: '雅园餐厅',
        floor: 1,
        type: '特色窗口',
        lunch_time: '10:30-13:30',
        dinner_time: '16:30-19:30',
        status: 'open',
        description: '麻辣香锅',
        isProtected: false
      },
      {
        id: 15,
        name: '早餐店',
        canteen: '雅园餐厅',
        floor: 1,
        type: '面食窗口',
        lunch_time: '07:00-10:00',
        dinner_time: '07:00-10:00',
        status: 'closed',
        description: '各类早点',
        isProtected: false
      },
      // A区服务点窗口
      {
        id: 16,
        name: '简餐套餐',
        canteen: 'A区服务点',
        floor: 1,
        type: '小炒窗口',
        lunch_time: '11:00-13:30',
        dinner_time: '17:00-19:00',
        status: 'open',
        description: '提供经济实惠的套餐',
        isProtected: false
      },
      {
        id: 17,
        name: 'A区饮品店',
        canteen: 'A区服务点',
        floor: 1,
        type: '饮品窗口',
        lunch_time: '08:00-20:00',
        dinner_time: '08:00-20:00',
        status: 'open',
        description: '奶茶咖啡汁',
        isProtected: false
      },
      {
        id: 18,
        name: '面食快餐',
        canteen: 'A区服务点',
        floor: 1,
        type: '面食窗口',
        lunch_time: '10:30-13:30',
        dinner_time: '16:30-19:00',
        status: 'closed',
        description: '各面食快餐',
        isProtected: false
      },
      // F区服务点窗口
      {
        id: 19,
        name: '盖浇快餐',
        canteen: 'F区服务点',
        floor: 1,
        type: '大荤窗口',
        lunch_time: '10:30-13:30',
        dinner_time: '16:30-19:00',
        status: 'open',
        description: '各类盖浇饭',
        isProtected: false
      },
      {
        id: 20,
        name: '特色小吃',
        canteen: 'F区服务点',
        floor: 1,
        type: '特色窗口',
        lunch_time: '09:30-19:30',
        dinner_time: '09:30-19:30',
        status: 'open',
        description: '各类特色小吃',
        isProtected: false
      },
      {
        id: 21,
        name: 'F区饮品',
        canteen: 'F区服务点',
        floor: 1,
        type: '饮品窗口',
        lunch_time: '08:00-20:00',
        dinner_time: '08:00-20:00',
        status: 'open',
        description: '饮品果汁',
        isProtected: false
      }
    ])

    // 过滤后的窗口数据
    const filteredWindows = computed(() => {
      return windows.value.filter(window => {
        // 餐厅筛选条件
        const matchCanteen = !canteenFilter.value || // 未选择餐厅
                            canteenFilter.value === 0 || // 选择了"全部窗口"
                            window.canteen === canteens.value.find(c => c.id === canteenFilter.value)?.name // 匹配特定餐厅
        
        // 状态筛选条件
        const matchStatus = !statusFilter.value || window.status === statusFilter.value
        
        return matchCanteen && matchStatus
      })
    })

    // 修改统计数据的计算逻辑
    const calculateStatistics = () => {
      const totalWindows = windows.value.length
      const openWindows = windows.value.filter(w => w.status === 'open').length
      const openPercentage = Math.round((openWindows / totalWindows) * 100)
      
      statistics.value = [
        { 
          title: '总窗口数', 
          value: totalWindows, 
          type: 'primary', 
          icon: 'Shop',
          subTitle: '所有餐厅窗口总数'
        },
        { 
          title: '营业中', 
          value: openWindows, 
          type: 'success', 
          icon: 'Histogram',
          subTitle: `占比 ${openPercentage}%`
        },
        { 
          title: '今日营业额', 
          value: '¥28,930', 
          type: 'warning', 
          icon: 'Money',
          subTitle: '较昨日 +12.5%'
        },
        { 
          title: '今日客流', 
          value: '3,241', 
          type: 'info', 
          icon: 'User',
          subTitle: '较昨日 +5.8%'
        }
      ]
    }

    // 添加一些方法实现
    const showAddDialog = () => {
      isEdit.value = false
      windowForm.name = ''
      windowForm.canteen_id = ''
      windowForm.floor = 1
      windowForm.type = ''
      windowForm.lunch_time = []
      windowForm.dinner_time = []
      windowForm.description = ''
      dialogVisible.value = true
    }

    const editWindow = (row) => {
      isEdit.value = true
      Object.assign(windowForm, row)
      dialogVisible.value = true
    }

    const deleteWindow = (row) => {
      ElMessageBox.confirm(
        '确定要删除该窗口吗？此操作不可恢复！',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const index = windows.value.findIndex(w => w.id === row.id)
        windows.value.splice(index, 1)
        ElMessage.success('删除成功')
      }).catch(() => {})
    }

    const handleStatusChange = (row, value) => {
      row.statusLoading = true
      setTimeout(() => {
        row.status = value
        row.statusLoading = false
        ElMessage.success(`状态已更新为${value === 'open' ? '营业中' : '已打烊'}`)
      }, 500)
    }

    const saveWindow = () => {
      windowFormRef.value.validate((valid) => {
        if (valid) {
          loading.value = true
          setTimeout(() => {
            if (isEdit.value) {
              const index = windows.value.findIndex(w => w.id === windowForm.id)
              windows.value[index] = { ...windowForm }
              ElMessage.success('修改成功')
            } else {
              const newWindow = {
                id: windows.value.length + 1,
                ...windowForm,
                canteen: canteens.value.find(c => c.id === windowForm.canteen_id)?.name
              }
              windows.value.push(newWindow)
              ElMessage.success('添加成功')
            }
            dialogVisible.value = false
            loading.value = false
          }, 500)
        }
      })
    }

    // 添加控制统计显示的状态
    const showStatistics = ref(true)

    // 添加切换显示/隐藏的方法
    const toggleStatistics = () => {
      showStatistics.value = !showStatistics.value
      // 当显示统计时，需要重新初始化图表
      if (showStatistics.value) {
        nextTick(() => {
          initRevenueChart()
          initTypeChart()
          initCanteenChart()
          initPeakHoursChart()
        })
      }
    }

    // 修改控制窗口列表显示的状态和方法
    const showWindowList = ref(true)

    const toggleWindowList = () => {
      showWindowList.value = !showWindowList.value
      // 可以添加一些过渡效果
      if (showWindowList.value) {
        nextTick(() => {
          // 如果需要，可以在这里添加一些显示时的逻辑
        })
      }
    }

    // 在 setup() 函数中添加 handleBatchImport 方法
    const handleBatchImport = () => {
      importDialogVisible.value = true
    }

    return {
      loading,
      dialogVisible,
      importDialogVisible,
      isEdit,
      windowFormRef,
      windowForm,
      canteenFilter,
      statusFilter,
      rules,
      getTypeTag,
      statistics,
      revenueChart,
      typeChart,
      canteenChart,
      peakHoursChart,
      revenueTimeRange,
      peakCanteen,
      isMobile,
      selectedWindows,
      batchDialogVisible,
      batchDialogTitle,
      batchDialogMessage,
      batchLoading,
      handleSelectionChange,
      handleBatchCommand,
      confirmBatchOperation,
      canteens,
      windows,
      filteredWindows,
      showAddDialog,
      editWindow,
      deleteWindow,
      handleStatusChange,
      saveWindow,
      showStatistics,
      toggleStatistics,
      showWindowList,
      toggleWindowList,
      handleBatchImport
    }
  }
}
</script>

<style scoped>
.window-management {
  padding: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.left {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.left .el-button {
  min-width: 110px;
}

.right {
  display: flex;
  gap: 12px;
}

.operation-time {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

.statistics-section {
  margin-bottom: 30px;
}

.stat-cards {
  margin-bottom: 20px;
}

.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  height: 420px;
  margin-bottom: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart {
  height: 360px;
}

/* 统计卡片样式 */
.stat-card {
  position: relative;
  overflow: hidden;
}

.stat-content {
  position: relative;
  z-index: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-title {
  color: #666;
}

.stat-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 48px;
  opacity: 0.2;
}

.stat-card.primary {
  background: linear-gradient(135deg, #1890ff 0%, #36a3f7 100%);
  color: white;
}

.stat-card.primary .stat-title {
  color: rgba(255, 255, 255, 0.8);
}

.stat-card.success {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  color: white;
}

.stat-card.success .stat-title {
  color: rgba(255, 255, 255, 0.8);
}

.stat-card.warning {
  background: linear-gradient(135deg, #faad14 0%, #ffc53d 100%);
  color: white;
}

.stat-card.warning .stat-title {
  color: rgba(255, 255, 255, 0.8);
}

.stat-card.info {
  background: linear-gradient(135deg, #13c2c2 0%, #36cfc9 100%);
  color: white;
}

.stat-card.info .stat-title {
  color: rgba(255, 255, 255, 0.8);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    gap: 10px;
  }

  .right {
    flex-direction: column;
  }

  .right > * {
    width: 100%;
  }

  .stat-cards .el-col {
    margin-bottom: 10px;
  }

  .chart-row .el-col {
    margin-bottom: 20px;
  }
}

@media (max-width: 1200px) {
  .chart-card {
    height: 360px;
  }

  .chart {
    height: 300px;
  }
}

@media (max-width: 768px) {
  .chart-card {
    height: 320px;
  }

  .chart {
    height: 260px;
  }
}

/* 移动端样式调整 */
.window-management.mobile .statistics-section {
  margin-bottom: 20px;
}

.window-management.mobile .chart-card {
  height: 300px;
}

.window-management.mobile .chart {
  height: 250px;
}

.window-management.mobile .toolbar {
  flex-direction: column;
  gap: 10px;
}

.window-management.mobile .toolbar .right {
  flex-direction: column;
  width: 100%;
}

.window-management.mobile .el-select {
  width: 100%;
}

/* 移动端表格调整 */
.window-management.mobile .el-table {
  font-size: 12px;
}

.window-management.mobile .operation-time {
  font-size: 12px;
}

/* 移动端统计卡片调整 */
.window-management.mobile .stat-cards .el-col {
  width: 100%;
  margin-bottom: 10px;
}

.window-management.mobile .stat-value {
  font-size: 20px;
}

/* 移动端图表区域调整 */
.window-management.mobile .chart-row .el-col {
  width: 100%;
  margin-bottom: 15px;
}

/* 移动端单调整 */
.window-management.mobile .el-form-item {
  margin-bottom: 15px;
}

.window-management.mobile .el-form-item__label {
  float: none;
  display: block;
  text-align: left;
  padding: 0 0 8px;
}

.window-management.mobile .el-form-item__content {
  margin-left: 0 !important;
}

.batch-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.selected-count {
  font-size: 14px;
  color: #666;
}

.batch-dialog-content {
  padding: 10px 0;
}

.selected-items {
  margin-top: 15px;
  background: #f5f7fa;
  border-radius: 4px;
  padding: 10px;
}

.selected-items ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.selected-items li {
  padding: 5px 10px;
  border-bottom: 1px solid #eee;
}

.selected-items li:last-child {
  border-bottom: none;
}

/* 移动端适配 */
.window-management.mobile .batch-actions {
  margin-top: 10px;
  flex-wrap: wrap;
}

.window-management.mobile .selected-count {
  width: 100%;
  text-align: right;
}

.el-table {
  margin-bottom: 20px;
}

.filter-select {
  background: #f5f7fa;
  border-radius: 4px;
}

.filter-select :deep(.el-input__wrapper) {
  background-color: transparent;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

.filter-select :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset;
}

/* 下拉选项样式 */
:deep(.el-select-dropdown__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
}

:deep(.el-select-dropdown__item .el-icon) {
  margin-right: 4px;
  font-size: 16px;
}

/* 添加按钮过渡效果 */
.statistics-section {
  transition: all 0.3s ease;
}

/* 优化工具栏按钮样式 */
.toolbar .el-button {
  display: flex;
  align-items: center;
  gap: 4px;
}

.toolbar .el-button .el-icon {
  margin-right: 2px;
}

/* 添加表格的过渡效果 */
.el-table {
  transition: all 0.3s ease-in-out;
  opacity: 1;
  transform: translateY(0);
}

.el-table[style*="display: none"] {
  opacity: 0;
  transform: translateY(-20px);
}

.table-container {
  transition: all 0.3s ease-in-out;
  margin-bottom: 20px;
  opacity: 1;
  transform: translateY(0);
  max-height: 2000px;
}

.table-container.hidden {
  opacity: 0;
  transform: translateY(-20px);
  max-height: 0;
  margin: 0;
  overflow: hidden;
}
</style> 