const state = {
  userInfo: {
    name: '张三',
    studentId: '2021001001',
    avatar: '',
    balance: 99.50,
    points: 0,
    favorites: 12,
    feedbacks: 0,
    pointsHistory: []
  }
}

const getters = {
  userInfo: state => state.userInfo,
  userBalance: state => state.userInfo.balance
}

const mutations = {
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
  },
  UPDATE_BALANCE(state, balance) {
    state.userInfo.balance = balance
  },
  UPDATE_POINTS(state, points) {
    state.userInfo.points = points
  },
  ADD_POINTS_HISTORY(state, record) {
    state.userInfo.pointsHistory.unshift(record)
  },
  UPDATE_USER_INFO(state, payload) {
    state.userInfo = {
      ...state.userInfo,
      ...payload
    }
  },
  UPDATE_FEEDBACKS_COUNT(state, count) {
    state.userInfo.feedbacks = count
  }
}

const actions = {
  updateUserInfo({ commit }, userInfo) {
    commit('SET_USER_INFO', userInfo)
  },
  updateBalance({ commit }, balance) {
    commit('UPDATE_BALANCE', balance)
    // 这里可以添加与后端的同步逻辑
  },
  async exchangePoints({ commit, state }, { itemId, points }) {
    try {
      // 这里应该调用后端 API
      // const response = await request.post('/api/points/exchange', { itemId, points })
      
      // 模拟API调用
      if (state.userInfo.points < points) {
        throw new Error('积分不足')
      }
      
      // 更新积分
      const newPoints = state.userInfo.points - points
      commit('UPDATE_POINTS', newPoints)
      
      // 添加兑换记录
      commit('ADD_POINTS_HISTORY', {
        id: Date.now(),
        type: 'exchange',
        points: -points,
        description: '积分兑换',
        createTime: new Date().toISOString()
      })
      
      return true
    } catch (error) {
      throw error
    }
  },
  async getPointsHistory({ commit }) {
    try {
      // 这里应该调用后端 API
      // const response = await request.get('/api/points/history')
      
      // 模拟API调用
      const mockHistory = [
        {
          id: 1,
          type: 'earn',
          points: 2,
          description: '完成订单',
          createTime: '2024-03-20T10:00:00Z'
        },
        {
          id: 2,
          type: 'earn',
          points: 3,
          description: '评价订单',
          createTime: '2024-03-19T15:30:00Z'
        },
        {
          id: 3,
          type: 'exchange',
          points: -500,
          description: '兑换5元代金券',
          createTime: '2024-03-18T09:15:00Z'
        }
      ]
      
      return mockHistory
    } catch (error) {
      throw error
    }
  },
  updateFeedbacksCount({ commit }, count) {
    commit('UPDATE_FEEDBACKS_COUNT', count)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
} 