import { getNewCartGoods } from '@/api/cart'

// 购物车状态
export default {
  namespaced: true,
  state: () => {
    return {
      list: []
    }
  },
  getters: {
    // 有效商品列表
    validList (state) {
      // 有效商品：库存大于0  stock  商品有效标识为  true  isEffective
      console.log(state)
      return state.list.filter(goods => goods.stock > 0 && goods.isEffective)
    },
    // 有效商品总件数
    validTotal (state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品总金额
    validAmount (state, getters) {
      // return (getters.validList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100).toFixed(2)
      return getters.validList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count, 0) / 100
    }
  },
  mutations: {
    insertCart (state, payload) {
      // 约定加入购物车字段必须和后端保持一致 payload对象 的字段
      // 它们是：id skuId name attrsText picture price nowPrice selected stock count isEffective
      // 插入数据规则：
      // 1. 先找下是否有相同商品
      // 2. 如果有相同的商品，查询它的数量，累加到payload上，再保存最新位置，原来商品需要删除
      // 3. 如果没有相同商品，保存在最新位置即可
      const sameIndex = state.list.findIndex((goods) => goods.skuId === payload.skuId)
      if (sameIndex > -1) {
        const count = state.list[sameIndex].count
        payload.count += count
        // 删除原来
        state.list.splice(sameIndex, 1)
      }
      // 追加新的
      state.list.unshift(payload)
    },
    // 修改购物车商品
    updateCart (state, goods) {
      // goods 商品信息：nowPrice stock isEffective
      // goods 商品对象的字段不固定，对象中有哪些字段就改哪些字段，字段的值合理才改
      // goods 商品对象 必需有SKUID
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      for (const key in goods) {
        if (goods[key] !== undefined && goods[key] !== null && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    },

    // 删除购物车商品
    deleteCart (state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    }
  },
  actions: {
    insertCart (ctx, goods) {
      return new Promise((resolve, reject) => {
        // vuex 方法 rootStata 获取其他文件数据
        if (ctx.rootState.user.token) {
          // 已登录 TODO
        } else {
          // 未登录
          ctx.commit('insertCart', goods)
          // 返回结果 代表执行成功
          resolve()
        }
      })
    },
    // 获取商品列表
    findCart (ctx) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {

        } else {
          // 未登录
          // 同时发送请求（有几个商品发几个请求）等所有请求成功，一并去修改本地数据。
          // Promise.all(promise数组).then((dataList)=>{})  同时发请求，所有请求成功，得到所有成功结果
          // Promise.resolve() Promise.reject() new Promise()
          // Promise.race(promise数组).then((data)=>{}) 同时发请求，最快的请求成功，得到成功结果
          const promiseArr = ctx.state.list.map(goods => {
            return getNewCartGoods(goods.skuId)
          })
          // dataList成功结果的集合，数据顺序和promiseArr顺序一致，它又是根据state.list而来
          Promise.all(promiseArr).then(dataList => {
            // 更新本地购物车
            dataList.forEach((data, i) => {
              ctx.commit('updateCart', { skuId: ctx.state.list[i].skuId, ...data.result })
            })
            // 调用resolve代表操作成功
            resolve()
          })
        }
      })
    },
    // 删除购物车
    deleteCart (ctx, payload) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {

        } else {
          // 未登录
          // 单条删除 payload 现在  就是skuId
          ctx.commit('deleteCart', payload)
          resolve()
        }
      })
    }
  }
}
