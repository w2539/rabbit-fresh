<template>
  <div class="xtx-goods-page" v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[1].id}`">
          {{ goods.categories[0].name }}
        </XtxBreadItem>
        <XtxBreadItem :to="`/category/sub/${goods.categories[0].id}`">
          {{ goods.categories[1].name }}
        </XtxBreadItem>
        <Xtx2BreadItem>{{ goods.name }}</Xtx2BreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <!-- 左侧 -->
        <div class="media">
          <!-- 放大镜 -->
          <GoodsImage :images="goods.mainPictures"></GoodsImage>
          <!-- 底部商品促销 -->
          <GoodsSales></GoodsSales>
        </div>
        <!-- 右侧 -->
        <div class="spec">
          <!-- 城市组件 -->
          <GoodsName :goods="goods"></GoodsName>
          <!-- 商品选取 -->
          <!-- skuId="1369155865461919746" -->
          <GoodsSku :goods="goods" skuId="1369155865461919746" @change="changeSku"></GoodsSku>
          <!-- 数量组件 -->
          <XtxNumbox label="数量" v-model="coust" :max="goods.inventory" :goods="goods" />
          <!-- 按钮组件 -->
          <XtxButton type="primary" style="margin-top: 20px">加入购物车</XtxButton>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant :goodsId="goods.id" />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabs :goods="goods"></GoodsTabs>
          <!-- 注意事项 -->
          <GoodsWarn></GoodsWarn>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot type="1"></GoodsHot>
          <GoodsHot type="2"></GoodsHot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsRelevant from './components/goods-relevant.vue'
import { provide, ref, watch } from 'vue'
import { findGoods } from '@/api/product'
import { useRoute } from 'vue-router'
import GoodsImage from './components/goods-image.vue'
import GoodsSales from './components/goods-sales.vue'
import GoodsName from './components/goods-name.vue'
import GoodsSku from './components/goods-sku.vue'
import GoodsTabs from './components/goods-tabs.vue'
import GoodsHot from './components/goods-hot.vue'
import GoodsWarn from './components/goods-warn.vue'
export default {
  name: 'XtxGoodsPage',
  components: {
    GoodsRelevant,
    GoodsImage,
    GoodsSales,
    GoodsName,
    GoodsSku,
    GoodsTabs,
    GoodsHot,
    GoodsWarn
  },
  setup () {
    const goods = useGoods()
    provide('goods', goods)
    const coust = ref(1)

    const changeSku = (sku) => {
      console.log(sku)
      // 修改商品的现价原价库存信息
      if (sku.skuId) {
        goods.value.price = 145
        // goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
      }
      goods.value.price = sku.price * coust.value
    }
    // 商品数量
    watch(coust, () => {})

    return { goods, changeSku, coust }
  }
}
// 获取商品详情
const useGoods = () => {
  // 出现路由地址商品ID发生变化，但是不会重新初始化组件
  const goods = ref(null)
  const route = useRoute()
  // 监听路由变化重新获取数据
  watch(
    () => route.params.id,
    (newVal) => {
      if (newVal && `/product/${newVal}` === route.path) {
        findGoods(route.params.id).then((data) => {
          // 让商品数据为null让后使用v-if的组件可以重新销毁和创建
          console.log(data.result)
          goods.value = data.result
        })
      }
    },
    { immediate: true }
  )
  return goods
}
</script>

<style scoped lang="less">
.goods-info {
  // 两个大盒子一个左边一个右边
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}

.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
