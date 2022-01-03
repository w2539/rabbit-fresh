// 用户状态
export default {
  namespaced: true,
  state: () => ({
    profile: {
      id: '',
      nickname: '',
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
