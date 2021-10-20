<template>
  <navbar></navbar>
  <header>头部</header>
  <main>
    <!-- 二级路由 -->
    <router-view></router-view>
  </main>
  <footer>底部</footer>
</template>
<script>
import navbar from '@/components/app-navbar.vue'
export default {
  name: 'Layout',
  components: {
    navbar
  }
}
</script>
<style lang="less" scoped>
</style>
