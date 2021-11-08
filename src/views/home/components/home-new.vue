<template>
  <div class="home-new">
    <HomePanel title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
      <template>
        <XtxMore path="/"></XtxMore>
      </template>
      <div ref="target" style="position: relative; height: 426px">
        <transition name="fade">
          <ul class="goods-list" v-if="list.length">
            <li v-for="item in list" :key="item.id">
              <RouterLink :to="`/product/${item.id}`">
                <img :src="item.picture" alt="" />
                <p class="name ellipsis">{{ item.name }}</p>
                <p class="price">&yen;{{ item.price }}</p>
              </RouterLink>
            </li>
          </ul>
          <HomeSkeleton v-else></HomeSkeleton>
        </transition>
      </div>
    </HomePanel>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { findNew } from '@/api/home'
import { ref } from '@vue/reactivity'
import HomePanel from './home-panel.vue'
import XtxMore from '@/components/library/xtx-more.vue'
import HomeSkeleton from './home-skeleton.vue'
import { useLazyData } from '@/hooks'
export default defineComponent({
  name: 'home-new',
  setup () {
    const list = ref([])
    findNew().then((data) => {
      list.value = data.result
    })
    const { target, result } = useLazyData(findNew)
    return { target, list: result }
  },
  components: { HomePanel, XtxMore, HomeSkeleton }
})
</script>

<style scoped lang="less">
.fade {
  &-leave {
    &-active {
      position: absolute;
      width: 100%;
      transition: opacity 0.5s 0.2s;
      z-index: 1;
    }
    &-to {
      opacity: 0;
    }
  }
}

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
