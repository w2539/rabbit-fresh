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
    },
    // 无效商品列表  与有效商品取反
    invalidList (state) {
      return state.list.filter(goods => !goods.stock > 0 && !goods.isEffective)
    },
    // 选中商品列表
    selectedList (state) {
      return state.list.filter(goods => goods.selected)
    },
    // 选中商品件数
    selectedTotal (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 选中商品总金额
    selectedAmount (state, getters) {
      return getters.selectedList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count, 0) / 100
    },
    // 是否全选  有效列表的长度是否和选中列表的长度一致 或者等于零
    isCheckAll (state, getters) {
      return getters.validList.length === getters.selectedList.length && getters.selectedList.length !== 0
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
      // 根据 id 找到商品
      const index = state.list.findIndex(item => item.skuId === skuId)
      // 删除
      state.list.splice(index, 1)
    }
  },
  actions: {
    // 修改sku规格
    updateCartSku (ctx, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        // vuex 方法 rootStata 获取其他文件数据
        if (ctx.rootState.user.token) {
          // 已登录 TODO
        } else {
          // 未登录
          // 1. 找出旧的商品信息
          // 2. 删除旧商品数据
          // 3. 根据新的sku信息和旧的商品信息，合并成一条新的购物车商品数据
          // 4. 添加新的商品
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          ctx.commit('deleteCart', oldSkuId)
          const { skuId, price: nowPrice, specsText: attrsText, inventory: stock } = newSku
          const newGoods = { ...oldGoods, skuId, nowPrice, attrsText, stock }
          ctx.commit('insertCart', newGoods)
          resolve()
        }
      })
    },
    // 批量刪除
    batchDeleteCart (ctx, isClear) {
      return new Promise((resolve, reject) => {
        // vuex 方法 rootStata 获取其他文件数据
        if (ctx.rootState.user.token) {
          // 已登录 TODO
        } else {
          // 未登录
          // 将全选按钮的状态用循环给 每一个商品
          // 如果参数存在 循环无效效列表  参数不存在循环有效列表
          ctx.getters[isClear ? ' invalidList' : 'selectedList'].forEach(items => {
            ctx.commit('deleteCart', items.skuId)
          })
          // 返回结果 代表执行成功
          resolve()
        }
      })
    },
    // 全选
    checkAllCart (ctx, selected) {
      return new Promise((resolve, reject) => {
        // vuex 方法 rootStata 获取其他文件数据
        if (ctx.rootState.user.token) {
          // 已登录 TODO
        } else {
          // 未登录
          // 将全选按钮的状态用循环给 每一个商品
          ctx.getters.validList.forEach(items => {
            ctx.commit('updateCart', { skuId: items.skuId, selected })
          })
          // 返回结果 代表执行成功
          resolve()
        }
      })
    },
    // 修改商品
    updateCart (ctx, goods) {
      return new Promise((resolve, reject) => {
        // vuex 方法 rootStata 获取其他文件数据
        if (ctx.rootState.user.token) {
          // 已登录 TODO
        } else {
          // 未登录
          ctx.commit('updateCart', goods)
          // 返回结果 代表执行成功
          resolve()
        }
      })
    },
    // 添加商品
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
