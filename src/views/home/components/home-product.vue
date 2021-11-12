<template>
  <div class="home-product" ref="target">
    <!-- 标题 -->
    <HomePanel :title="items.name" v-for="items in list" :key="items.id">
      <!-- 右上侧字 -->
      <template v-slot:right>
        <div class="sub">
          <RouterLink v-for="sub in items.children" :key="sub.id" :to="`/category/sub/${sub.id}`">{{ sub.name }}</RouterLink>
        </div>
        <!-- 查看全部 -->
        <XtxMore :path="`/category/${items.id}`" />
      </template>
      <!-- 标题底下的所有图片 -->
      <div class="box">
        <RouterLink class="cover" to="/">
          <img v-lazy="items.picture" alt="" />
          <strong class="label">
            <span>{{ items.name }}</span>
            <span>{{ items.saleInfo }}</span>
          </strong>
        </RouterLink>
        <ul class="goods-list">
          <li v-for="items in items.goods" :key="items.id">
            <HomeGoods :goods="items" />
          </li>
        </ul>
      </div>
    </HomePanel>
  </div>
</template>

<script>
import HomePanel from './home-panel'
import HomeGoods from './home-goods'
import { findGoods } from '@/api/home'
import { useLazyData } from '@/hooks/index'
export default {
  name: 'HomeProduct',
  components: { HomePanel, HomeGoods },
  setup () {
    // const list = ref([])
    // findGoods().then((data) => {
    //   list.value = data.result
    // })
    // 懒加载
    const { target, result } = useLazyData(findGoods)
    return { list: result, target }
  }
}
</script>

<style scoped lang="less">
.home-product {
  background: #fff;
  height: 2900px;
  .sub {
    margin-bottom: 2px;
    a {
      padding: 2px 12px;
      font-size: 16px;
      border-radius: 4px;
      &:hover {
        background: @xtxColor;
        color: #fff;
      }
      &:last-child {
        margin-right: 80px;
      }
    }
  }
  .box {
    display: flex;
    .cover {
      width: 240px;
      height: 610px;
      margin-right: 10px;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .label {
        width: 188px;
        height: 66px;
        display: flex;
        font-size: 18px;
        color: #fff;
        line-height: 66px;
        font-weight: normal;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate3d(0, -50%, 0);
        span {
          text-align: center;
          &:first-child {
            width: 76px;
            background: rgba(0, 0, 0, 0.9);
          }
          &:last-child {
            flex: 1;
            background: rgba(0, 0, 0, 0.7);
          }
        }
      }
    }
    .goods-list {
      width: 990px;
      display: flex;
      flex-wrap: wrap;
      li {
        width: 240px;
        height: 300px;
        margin-right: 10px;
        margin-bottom: 10px;
        &:nth-last-child(-n + 4) {
          margin-bottom: 0;
        }
        &:nth-child(4n) {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
