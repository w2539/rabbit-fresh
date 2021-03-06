// 分类模块
import { topCategory } from '@/api/constants'
import { findAllCategory } from '@/api/category'
export default {
  namespaced: true,
  state () {
    return {
      // 分类信息集合，依赖topCategory重新设置，保证初始化就要数据，不至于白屏
      // map() 方法返回一个新数组，数组中的元素为 原始数组 元素调用函数处理后的值。
      // 将分类的名字单独提取出来
      list: topCategory.map((item) => ({ name: item }))
    }
  },
  // 加载数据成功后需要修改list所以需要mutations函数
  mutations: {
    // payload 所有的分类集合
    setList (state, payload) {
      state.list = payload
    },
    // 修改当前一级分类下的open数据为true
    show (state, item) {
      //  find() 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。
      const category = state.list.find((category) => category.id === item.id)
      category.open = true
    },
    // 修改当前一级分类下的open数据为false
    hide (state, item) {
      const category = state.list.find((category) => category.id === item.id)
      category.open = false
    }
  },
  // 需要向后台加 载数据，所以需要actions函数获取数据
  actions: {
    async getList ({ commit }) {
      // 获取分类数据
      const data = await findAllCategory()
      // 给每个分类加上控制二级分类显示隐藏的数据
      data.result.forEach((item) => {
        item.open = false
      })
      // 修改分类数据
      commit('setList', data.result)
    }
  }
}
