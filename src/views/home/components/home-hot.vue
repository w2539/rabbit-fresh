<template>
  <HomePanel title="人气推荐" sub-title="人气爆款 不容错过">
    <ul class="goods-list">
      <li v-for="items in list" :key="items.id">
        <RouterLink to="/">
          <img :src="items.picture" alt="" />
          <p class="name">{{ items.title }}</p>
          <p class="desc">{{ items.alt }}</p>
        </RouterLink>
      </li>
    </ul>
  </HomePanel>
</template>

<script>
import { defineComponent } from 'vue'
import HomePanel from './home-panel.vue'
import { ref } from '@vue/reactivity'
import { findHot } from '@/api/home'
export default defineComponent({
  name: 'home-hot',
  setup () {
    const list = ref([])
    findHot().then((data) => {
      list.value = data.result
    })

    return { list }
  },
  components: { HomePanel }
})
</script>

<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;
  li {
    width: 306px;
    height: 406px;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }
    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
