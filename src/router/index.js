import { createRouter, createWebHistory } from 'vue-router'
import FloorDetail from '@/views/student/FloorDetail.vue'

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
        redirect: 'dishes'
      },
      {
        path: 'dishes',
        name: 'AdminDishes',
        component: () => import('../views/admin/DishManagement.vue')
      },
      {
        path: 'menus',
        name: 'AdminMenus',
        component: () => import('../views/admin/MenuManagement.vue')
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: () => import('../views/admin/OrderManagement.vue')
      },
      {
        path: 'windows',
        name: 'AdminWindows',
        component: () => import('../views/admin/WindowManagement.vue')
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/admin/Dashboard.vue')
      },
      {
        path: 'inventory',
        name: 'AdminInventory',
        component: () => import('../views/admin/Inventory.vue')
      },
      {
        path: 'statistics',
        name: 'AdminStatistics',
        component: () => import('../views/admin/Statistics.vue')
      },
      {
        path: 'staff',
        name: 'AdminStaff',
        component: () => import('../views/admin/Staff.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // 检查是否有登录信息
  const hasToken = localStorage.getItem('token')
  const hasUser = localStorage.getItem('user')

  // 如果没有登录信息，且访问需要登录的页面，重定向到登录页
  if (!hasToken || !hasUser) {
    if (to.meta.needLogin) {
      next('/login')
      return
    }
  }

  // 如果访问登录页
  if (to.path === '/login') {
    if (hasToken && hasUser) {
      try {
        const user = JSON.parse(hasUser)
        next(user.userType === 'admin' ? '/admin/dishes' : '/student/home')
      } catch {
        localStorage.clear()
        next()
      }
    } else {
      next()
    }
    return
  }

  // 其他情况正常放行
  next()
})

export default router 