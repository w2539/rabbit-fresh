<template>
  <div class="home-category">
    <ul class="menu">
      <li v-for="items in menuList" :key="items.id">
        <RouterLink to="/">{{ items.name }}</RouterLink>
        <template v-if="items.children">
          <RouterLink v-for="sub in items.children" :key="sub.id" to="/">
            {{ sub.name }}
          </RouterLink>
        </template>
      </li>
    </ul>
  </div>
</template>
<script>
import { useStore } from 'vuex'
import { reactive, computed } from 'vue'
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
      children: [{ id: 'brand-chilren', name: '品牌推荐' }]
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
          children: items.children && items.children.slice(0, 2)
        }
      })
      // 将自己写的内容加入到 从接口请求到的数据中
      list.push(brand)
      return list
    })
    return { menuList }
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
      &:hover {
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
}
</style>
