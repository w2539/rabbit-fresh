<template>
  <div class="home-category" @mouseleave="categoryId = null">
    <ul class="menu">
      <li v-for="items in menuList" :key="items.id" @mouseenter="categoryId = items.id" :class="{ active: categoryId === items.id }">
        <RouterLink to="/">{{ items.name }}</RouterLink>
        <template v-if="items.children">
          <RouterLink v-for="sub in items.children" :key="sub.id" to="/">{{ sub.name }}</RouterLink>
        </template>
        <template v-else>
          <XtxSkeleton width="60px" height="18px" style="margin-right: 5px" bg="rgba(255,255,255,0.2)" />
          <XtxSkeleton width="50px" height="18px" bg="rgba(255,255,255,0.2)" />
        </template>
      </li>
    </ul>
    <!-- 弹层 -->
    <div class="layer">
      <h4 v-if="currCategory">{{ currCategory.id === 'brand' ? '品牌' : '分类' }}推荐 <small>根据您的购买或浏览记录推荐</small></h4>

      <ul v-if="currCategory && currCategory.goods && currCategory.goods.length">
        <li v-for="brand in currCategory.goods" :key="brand.id">
          <RouterLink to="/">
            <img :src="brand.picture" alt="" />
            <div class="info">
              <p class="name ellipsis-2">{{ brand.name }}</p>
              <p class="desc ellipsis">{{ brand.desc }}</p>
              <p class="price"><i>¥</i>{{ brand.price }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>

      <ul v-if="currCategory && currCategory.brands">
        <li class="brand" v-for="brand in currCategory.brands" :key="brand.id">
          <RouterLink to="/">
            <img :src="brand.picture" alt="" />
            <div class="info">
              <p class="place"><i class="iconfont icon-dingwei"></i>{{ brand.place }}</p>
              <p class="name ellipsis">{{ brand.name }}</p>
              <p class="desc ellipsis-2">{{ brand.desc }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { useStore } from 'vuex'
import { reactive, computed, ref } from 'vue'
import { findBrand } from '@/api/home'
export default {
  name: 'HomeCategory',
  components: {},
  setup () {
    const store = useStore()
    // 最终使用的数据 = 九个分类 + 1个品牌

    // 自己定义第九个分类
    const brand = reactive({
      id: 'brand',
      name: '品牌',
      children: [{ id: 'brand-chilren', name: '品牌推荐' }],
      brands: []
    })

    // 前九个数据
    const menuList = computed(() => {
      // 在 store中有获取过头部数据 所以可以获取到
      // 对获取的到的数据进行筛选 并返回成固定格式
      const list = store.state.category.list.map((items) => {
        return {
          id: items.id,
          name: items.name,
          // 防止初始化没有children的时候调用slice函数报错
          // 调用 slice 选取下标 0 到 2 的数据
          children: items.children && items.children.slice(0, 2),
          goods: items.goods
        }
      })
      // 将自己写的内容加入到 从接口请求到的数据中
      list.push(brand)
      return list
    })

    const categoryId = ref(null)
    const currCategory = computed(() => {
      // 根据id 获取到第一个 id值相同的
      return menuList.value.find((items) => items.id === categoryId.value)
    })
    // async setup () {}  这样写会把整个setup 函数变为异步函数
    // 因为在vue3.x中setup函数在模板生成之前加载完成 所以组件不能生效
    findBrand().then((data) => {
      // 将brands 的值等于请求过来的参数
      brand.brands = data.result
    })

    return { menuList, categoryId, currCategory }
  }
}
</script>

<style lang="less" scoped>
.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 99;
  .menu {
    li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;
      &:hover,
      &.active {
        background: @xtxColor;
      }
      a {
        margin-right: 4px;
        color: #fff;
        // 将第一个 a 的大小放大
        &:first-child {
          font-size: 16px;
        }
      }
    }
  }
  .layer {
    width: 990px;
    height: 500px;
    background: rgba(255, 255, 255, 0.8);
    position: absolute;
    left: 250px;
    top: 0;
    display: none;
    padding: 0 15px;
    h4 {
      font-size: 20px;
      font-weight: normal;
      line-height: 80px;
      small {
        font-size: 16px;
        color: #666;
      }
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 310px;
        height: 120px;
        margin-right: 15px;
        margin-bottom: 15px;
        border: 1px solid #eee;
        border-radius: 4px;
        background: #fff;
        // 品牌的样式
        &.brand {
          height: 180px;
          a {
            align-items: flex-start;
            img {
              width: 120px;
              height: 160px;
            }
            .info {
              p {
                margin-top: 8px;
              }
              .place {
                color: #999;
              }
            }
          }
        }

        &:nth-child(3n) {
          margin-right: 0;
        }
        a {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          padding: 10px;
          &:hover {
            background: #e3f9f4;
          }
          img {
            width: 95px;
            height: 95px;
          }
          .info {
            padding-left: 10px;
            line-height: 24px;
            width: 190px;
            .name {
              font-size: 16px;
              color: #666;
            }
            .desc {
              color: #999;
            }
            .price {
              font-size: 22px;
              color: @priceColor;
              i {
                font-size: 16px;
              }
            }
          }
        }
      }
    }
  }
  &:hover {
    .layer {
      display: block;
    }
  }
  .xtx-skeleton {
    animation: fade 1s linear infinite alternate;
  }
  @keyframes fade {
    from {
      opacity: 0.2;
    }
    to {
      opacity: 1;
    }
  }
}
</style>
