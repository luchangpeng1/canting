import { createRouter, createWebHistory } from 'vue-router'
import FloorDetail from '@/views/student/FloorDetail.vue'
import { isMobile } from '@/utils/device'

const routes = [
  {
    path: '/',
    redirect: '/login',
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/student',
    component: () => import('../views/student/Layout.vue'),
    meta: { requiresAuth: true, role: 'student', needLogin: true },
    children: [
      {
        path: '',
        redirect: 'home'
      },
      {
        path: 'home',
        name: 'StudentHome',
        component: () => import('../views/student/DishList.vue')
      },
      {
        path: 'orders',
        name: 'StudentOrders',
        component: () => import('../views/student/OrderList.vue')
      },
      {
        path: 'profile',
        name: 'StudentProfile',
        component: () => import('../views/student/UserProfile.vue')
      },
      {
        path: 'transactions',
        name: 'StudentTransactions',
        component: () => import('../views/student/个人主页相关页面/TransactionList.vue')
      },
      {
        path: 'favorites',
        name: 'StudentFavorites',
        component: () => import('../views/student/个人主页相关页面/FavoriteList.vue')
      },
      {
        path: 'reviews',
        name: 'StudentReviews',
        component: () => import('../views/student/个人主页相关页面/ReviewList.vue')
      },
      {
        path: 'notification-settings',
        name: 'StudentNotificationSettings',
        component: () => import('../views/student/个人主页相关页面/NotificationSettings.vue')
      },
      {
        path: 'preferences',
        name: 'StudentPreferences',
        component: () => import('../views/student/个人主页相关页面/Preferences.vue')
      },
      {
        path: 'feedback-list',
        name: 'StudentFeedbacks',
        component: () => import('../views/student/个人主页相关页面/FeedbackList.vue')
      },
      {
        path: 'wallet',
        name: 'StudentWallet',
        component: () => import('../views/student/个人主页相关页面/WalletPage.vue')
      },
      {
        path: 'recommendations',
        name: 'RecommendationSquare',
        component: () => import('@/views/student/RecommendationSquare.vue')
      },
      {
        path: '/student/canteen/:canteen/floor/:floor',
        name: 'FloorDetail',
        component: FloorDetail
      },
      {
        path: 'dishes/:id',
        name: 'DishDetail',
        component: () => import('../views/student/DishDetail.vue')
      },
      {
        path: 'order-history',
        name: 'OrderHistory',
        component: () => import('../views/student/OrderHistory.vue')
      },
      {
        path: 'orders/:id',
        name: 'OrderDetail',
        component: () => import('../views/student/OrderDetail.vue')
      },
      {
        path: 'cart',
        name: 'StudentCart',
        component: () => import('../views/student/CartPage.vue')
      },
      {
        path: 'points-history',
        name: 'PointsHistory',
        component: () => import('../views/student/个人主页相关页面/PointsHistory.vue'),
        meta: {
          title: '积分记录',
          requiresAuth: true
        }
      },
    ]
  },
  {
    path: '/admin',
    component: () => import('../views/admin/Layout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: '',
        redirect: 'dashboard'
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/admin/Dashboard.vue'),
        meta: { title: '数据看板' }
      },
      {
        path: 'dishes',
        name: 'AdminDishes',
        component: () => import('../views/admin/DishManagement.vue'),
        meta: { title: '菜品管理' }
      },
      {
        path: 'menus',
        name: 'AdminMenus',
        component: () => import('../views/admin/MenuManagement.vue'),
        meta: { title: '菜单管理' }
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: () => import('../views/admin/OrderManagement.vue'),
        meta: { title: '订单管理' }
      },
      {
        path: 'windows',
        name: 'AdminWindows',
        component: () => import('../views/admin/WindowManagement.vue'),
        meta: { title: '窗口管理' }
      },
      {
        path: 'inventory',
        name: 'AdminInventory',
        component: () => import('../views/admin/Inventory.vue'),
        meta: { title: '库存管理' }
      },
      {
        path: 'statistics',
        name: 'AdminStatistics',
        component: () => import('../views/admin/Statistics.vue'),
        meta: { title: '营业统计' }
      },
      {
        path: 'staff',
        name: 'AdminStaff',
        component: () => import('../views/admin/Staff.vue'),
        meta: { title: '员工管理' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  },
  {
    path: '/m/admin',
    component: () => import('../views/mobile/admin/Layout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: '',
        redirect: 'orders'
      },
      {
        path: 'orders',
        name: 'MobileAdminOrders',
        component: () => import(/* webpackChunkName: "admin-orders" */ '@/views/mobile/admin/Orders.vue'),
        meta: { keepAlive: true }
      },
      {
        path: 'menu',
        name: 'MobileAdminMenu',
        component: () => import(/* webpackChunkName: "admin-menu" */ '@/views/mobile/admin/Menu.vue'),
        meta: { keepAlive: true }
      },
      {
        path: 'stats',
        name: 'MobileAdminStats',
        component: () => import(/* webpackChunkName: "admin-stats" */ '@/views/mobile/admin/Stats.vue'),
        meta: { keepAlive: true }
      },
      {
        path: 'withdraw',
        name: 'AdminWithdraw',
        component: () => import(/* webpackChunkName: "admin-withdraw" */ '@/views/mobile/admin/Withdraw.vue'),
        meta: { keepAlive: true }
      },
      {
        path: 'withdraw/history',
        name: 'AdminWithdrawHistory',
        component: () => import('../views/mobile/admin/WithdrawHistory.vue')
      }
    ]
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // 获取登录状态
  const token = localStorage.getItem('token')
  const userInfo = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  const userRole = userInfo?.verifiedInfo?.role

  // 先处理移动端重定向
  if (isMobile()) {
    // 如果已经是移动端路径，不需要重定向
    if (!to.path.startsWith('/m/')) {
      if (to.path.startsWith('/admin')) {
        next('/m/admin' + to.path.slice(6))
        return
      }
      if (to.path.startsWith('/student')) {
        next('/m/student' + to.path.slice(8))
        return
      }
    }
  }

  // 处理根路径
  if (to.path === '/') {
    next('/login')
    return
  }

  // 如果已登录且访问登录页，重定向到对应的首页
  if (to.path === '/login' && token && userInfo) {
    console.log('当前用户角色:', userRole)
    
    switch(userRole) {
      case 'superadmin':
        next('/admin/dishes')
        return
      case 'window_admin':
        next('/m/admin/orders')
        return
      case 'student':
        next('/student/home')
        return
      default:
        next()
        return
    }
  }

  // 需要登录的页面
  if (to.meta.requiresAuth) {
    if (!token || !userInfo) {
      next('/login')
      return
    }

    // 检查角色权限
    if (to.meta.role === 'admin') {
      if (userRole === 'superadmin') {
        if (to.path.startsWith('/m/')) {
          next('/admin/dishes')
          return
        }
      } else if (userRole === 'window_admin') {
        if (!to.path.startsWith('/m/')) {
          next('/m/admin/orders')
          return
        }
      } else {
        next('/login')
        return
      }
    }
  }

  // 如果没有特殊情况，正常放行
  next()
})

export default router 