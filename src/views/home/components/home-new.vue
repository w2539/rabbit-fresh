<template>
  <div class="home-new">
    <HomePanel title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
      <template>
        <XtxMore path="/"></XtxMore>
      </template>
      <ul class="goods-list">
        <li v-for="item in list" :key="item.id">
          <RouterLink :to="`/product/${item.id}`">
            <img :src="item.picture" alt="" />
            <p class="name ellipsis">{{ item.name }}</p>
            <p class="price">&yen;{{ item.price }}</p>
          </RouterLink>
        </li>
      </ul>
    </HomePanel>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { findNew } from '@/api/home'
import { ref } from '@vue/reactivity'
import HomePanel from './home-panel.vue'
import XtxMore from '@/components/library/xtx-more.vue'
export default defineComponent({
  name: 'home-new',
  setup () {
    const list = ref([])
    findNew().then((data) => {
      list.value = data.result
    })
    return { list }
  },
  components: { HomePanel, XtxMore }
})
</script>

<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
