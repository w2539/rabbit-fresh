<template>
  <div class="app-header-sticky" :class="{ show: y >= 78 }">
    <div class="container" v-show="y >= 78">
      <RouterLink class="logo" to="/" />
      <appHandercc></appHandercc>
      <div class="right">
        <RouterLink to="/">品牌</RouterLink>
        <RouterLink to="/">专题</RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import appHandercc from '@/components/app-handercc.vue'
// import { ref } from '@vue/reactivity'
// import { onMounted } from '@vue/runtime-core'
import { useWindowScroll } from '@vueuse/core'
export default {
  name: 'AppHeaderSticky',
  components: { appHandercc },
  setup () {
    // 定义响应数据，方便模板使用
    // const y = ref(0)
    // 在dom树完全加载完后 使用vue3 生命周期函数
    // onMounted(() => {
    // 添加页面滚动事件
    // window.addEventListener('scroll', () => {
    // 在documentElement中可以获取 滚动与顶部的距离
    // const scrollTop = document.documentElement.scrollTop
    // y.value = scrollTop
    // })
    // })

    // 组合API
    const { y } = useWindowScroll()

    return { y }
  }
}
</script>

<style scoped lang="less">
.app-header-sticky {
  width: 100%;
  height: 80px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  background-color: #fff;
  border-bottom: 1px solid #e4e4e4;
  // display: none;
  // 放在页面外部
  transform: translateY(-100%);
  &.show {
    // 动画时间三秒
    transition: all 0.3s linear;
    // 完全显示
    opacity: 1;
    // 允许开启3d转换
    transform: none;
  }
  .container {
    display: flex;
    align-items: center;
  }
  .logo {
    width: 200px;
    height: 80px;
    background: url(../assets/images/logo.png) no-repeat right 2px;
    background-size: 160px auto;
  }
  .right {
    width: 220px;
    display: flex;
    text-align: center;
    padding-left: 40px;
    border-left: 2px solid @xtxColor;
    a {
      width: 38px;
      margin-right: 40px;
      font-size: 16px;
      line-height: 1;
      &:hover {
        color: @xtxColor;
      }
    }
  }
}
</style>
