import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '../router'

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api', // 从环境变量获取 API 地址
  timeout: 15000, // 请求超时时间
  withCredentials: true, // 跨域请求时发送 cookie
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 是否正在刷新token
let isRefreshing = false
// 重试队列
let requests = []

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    // 处理请求数据
    if (config.method === 'post' || config.method === 'put') {
      // 移除空值参数
      const data = { ...config.data }
      Object.keys(data).forEach(key => {
        if (data[key] === null || data[key] === undefined || data[key] === '') {
          delete data[key]
        }
      })
      config.data = data
    }

    return config
  },
  error => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data

    // 处理文件下载
    if (response.config.responseType === 'blob') {
      return response
    }

    // 成功状态处理
    if (res.code === 200 || res.status === 'success') {
      return res
    }

    // 处理特定错误码
    switch (res.code) {
      case 401: // 未登录或 token 过期
        handleUnauthorized(response.config)
        break
      case 403: // 权限不足
        ElMessage.error('权限不足')
        router.push('/403')
        break
      case 404: // 资源不存在
        ElMessage.error('请求的资源不存在')
        break
      case 500: // 服务器错误
        ElMessage.error('服务器错误，请稍后重试')
        break
      default:
        ElMessage.error(res.message || '请求失败')
    }

    return Promise.reject(new Error(res.message || '请求失败'))
  },
  error => {
    console.error('响应拦截器错误:', error)

    // 处理请求超时
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      ElMessage.error('请求超时，请重试')
      return Promise.reject(new Error('请求超时'))
    }

    // 处理网络错误
    if (!window.navigator.onLine) {
      ElMessage.error('网络连接已断开，请检查网络')
      return Promise.reject(new Error('网络连接已断开'))
    }

    // 处理取消请求
    if (axios.isCancel(error)) {
      return Promise.reject(new Error('请求已取消'))
    }

    // 其他错误处理
    ElMessage.error(error.message || '请求失败')
    return Promise.reject(error)
  }
)

// 处理未授权情况
const handleUnauthorized = async (failedRequest) => {
  if (isRefreshing) {
    // 将请求加入重试队列
    return new Promise(resolve => {
      requests.push(() => {
        resolve(service(failedRequest))
      })
    })
  }

  isRefreshing = true

  try {
    // 尝试刷新 token
    const response = await service.post('/auth/refresh-token', {
      refreshToken: localStorage.getItem('refreshToken')
    })

    if (response.code === 200) {
      // 更新 token
      const { token } = response.data
      localStorage.setItem('token', token)

      // 重试队列中的请求
      requests.forEach(callback => callback())
      requests = []

      // 重试失败的请求
      return service(failedRequest)
    } else {
      // token 刷新失败，需要重新登录
      handleLogout()
    }
  } catch (error) {
    handleLogout()
  } finally {
    isRefreshing = false
  }
}

// 处理登出
const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  
  ElMessageBox.confirm(
    '登录已过期，请重新登录',
    '提示',
    {
      confirmButtonText: '重新登录',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    router.push(`/login?redirect=${router.currentRoute.value.fullPath}`)
  })
}

// 请求方法封装
const http = {
  get(url, params, config = {}) {
    return service.get(url, { params, ...config })
  },

  post(url, data, config = {}) {
    return service.post(url, data, config)
  },

  put(url, data, config = {}) {
    return service.put(url, data, config)
  },

  delete(url, params, config = {}) {
    return service.delete(url, { params, ...config })
  },

  // 上传文件
  upload(url, file, onUploadProgress) {
    const formData = new FormData()
    formData.append('file', file)

    return service.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    })
  },

  // 下载文件
  download(url, params, fileName) {
    return service.get(url, {
      params,
      responseType: 'blob'
    }).then(response => {
      const blob = new Blob([response.data])
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileName || getFileNameFromResponse(response)
      link.click()
      window.URL.revokeObjectURL(link.href)
    })
  }
}

// 从响应头获取文件名
const getFileNameFromResponse = (response) => {
  const contentDisposition = response.headers['content-disposition']
  if (contentDisposition) {
    const matches = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
    if (matches && matches[1]) {
      return decodeURIComponent(matches[1].replace(/['"]/g, ''))
    }
  }
  return 'download'
}

export default http 