import defaultGlobal from '@/globals'

const { isRefresh } = defaultGlobal

const state = {
  // 提供402错误使用判断是否客户通过浏览器Refresh按钮刷页面
  isRefresh: isRefresh
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

