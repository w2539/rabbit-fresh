// 用户状态
export default {
  namespaced: true,
  state: () => ({
    profile: {
      id: '',
      nickname: '',
      account: '',
      // 头像
      avatar: '',
      token: '',
      mobile: ''
    },
    redirectUrl: '/'
  }),
  mutations: {
    setUser (state, payload) {
      state.profile = payload
    },
    setRedirectUrl (state, url) {
      state.redirectUrl = url
    }
  }
}
