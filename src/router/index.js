import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/student',
    component: () => import('../views/student/Layout.vue'),
    meta: { requiresAuth: true, role: 'student' },
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
        component: () => import('../views/student/TransactionList.vue')
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
        path: 'my-feedbacks',
        name: 'StudentFeedbacks',
        component: () => import('../views/student/个人主页相关页面/FeedbackList.vue')
      },
      {
        path: 'recommendations',
        name: 'StudentRecommendations',
        component: () => import('../views/student/RecommendationSquare.vue')
      }
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
  history: createWebHistory('/canting/'),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    const userStr = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (userStr && token) {
      try {
        const user = JSON.parse(userStr)
        next(user.userType === 'admin' ? '/admin/dishes' : '/student/home')
        return
      } catch (error) {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    next()
    return
  }

  const userStr = localStorage.getItem('user')
  const token = localStorage.getItem('token')
  if (!userStr || !token) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }

  try {
    const user = JSON.parse(userStr)
    if (to.matched.some(record => record.meta.role)) {
      const requiredRole = to.matched.find(record => record.meta.role).meta.role
      if (user.userType !== requiredRole) {
        next(user.userType === 'admin' ? '/admin/dishes' : '/student/home')
        return
      }
    }
    next()
  } catch (error) {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    next('/login')
  }
})

export default router 