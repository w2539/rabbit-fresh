<template>
  <ul class="appHandercc">
    <li class="home">
      <RouterLink to="/">首页</RouterLink>
    </li>
    <li v-for="items in list" :key="items.id" @mousemove="show(items)" @mouseleave="hide(items)">
      <RouterLink :to="`/category/${items.id}`" @click="hide(items)">{{ items.name }}</RouterLink>
      <div class="layer" :class="{ open: items.open }">
        <ul>
          <li v-for="sub in items.children" :key="sub.id">
            <RouterLink :to="`/category/sub/${sub.id}`" @click="hide(items)">
              <img :src="sub.picture" alt />
              <p>{{ sub.name }}</p>
            </RouterLink>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
export default {
  name: 'appHandercc',
  setup () {
    const store = useStore()
    const list = computed(() => {
      return store.state.category.list
    })
    const show = (items) => {
      store.commit('category/show', items)
    }
    const hide = (items) => {
      store.commit('category/hide', items)
    }
    return { list, show, hide }
  }
}
</script>

<style scoped lang="less">
.appHandercc {
  width: 820px;
  display: flex;
  justify-content: space-around;
  padding-left: 40px;
  position: relative;
  z-index: 998;
  > li {
    margin-right: 40px;
    width: 38px;
    text-align: center;
    > a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }
    &:hover {
      > a {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }
      // > .layer {
      //   height: 132px;
      //   opacity: 1;
      // }
    }
  }
}
.layer {
  &.open {
    height: 132px;
    opacity: 1;
  }
  width: 1240px;
  background-color: #fff;
  position: absolute;
  left: -200px;
  top: 56px;
  height: 0;
  overflow: hidden;
  opacity: 0;
  box-shadow: 0 0 5px #ccc;
  transition: all 0.2s 0.1s;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 70px;
    align-items: center;
    height: 132px;
    li {
      width: 110px;
      text-align: center;
      img {
        width: 60px;
        height: 60px;
      }
      p {
        padding-top: 10px;
      }
      &:hover {
        p {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>
