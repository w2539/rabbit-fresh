<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem>{{ topCategory.name }}</XtxBreadItem>
      </XtxBread>
      <!-- 轮播图 -->
      <XtxCarousel :sliders="sliders" style="height: 500px" />
      <!-- 所有二级分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="items in topCategory.children" :key="items.id">
            <a href="javascript:;">
              <img :src="items.picture" />
              <p>{{ items.name }}</p>
            </a>
          </li>
        </ul>
      </div>
      <!-- 不同分类商品 -->
    </div>
  </div>
</template>
<script>
import { findBanner } from '@/api/home'
import { ref } from '@vue/reactivity'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { computed } from 'vue'
export default {
  name: 'TopCategory',
  components: {
    // XtxBreadItem
  },
  setup () {
    const sliders = ref([])
    findBanner().then((data) => {
      sliders.value = data.result
    })

    const store = useStore()
    const route = useRoute()
    const topCategory = computed(() => {
      let core = {}
      const items = store.state.category.list.find((items) => {
        return items.id === route.params.id
      })
      // 防止为空数据
      if (items) {
        core = items
      }
      return core
    })

    return { sliders, topCategory }
  }
}
</script>
<style scoped lang="less">
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
}
</style>
