<template>
  <navbar></navbar>
  <headerbar></headerbar>
  <main>
    <!-- 二级路由 -->
    <router-view></router-view>
  </main>
  <footer>底部</footer>
</template>
<script>
import navbar from '@/components/app-navbar.vue'
import headerbar from '@/components/app-handerbar.vue'
export default {
  name: 'Layout',
  components: {
    navbar,
    headerbar
  }
}
</script>
<style lang="less" scoped>
</style>
