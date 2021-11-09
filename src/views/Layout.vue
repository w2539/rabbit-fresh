<template>
  <navbar></navbar>
  <headerbar></headerbar>
  <handerSticly></handerSticly>
  <main>
    <!-- 二级路由 -->
    <router-view></router-view>
  </main>
  <AppFooter class="app-body" />
</template>

<script>
import navbar from '@/components/app-navbar.vue'
import headerbar from '@/components/app-handerbar.vue'
import handerSticly from '@/components/app-header-sticky.vue'
import AppFooter from '@/components/app-footer.vue'
import { useStore } from 'vuex'
export default {
  name: 'Layout',
  components: {
    navbar,
    headerbar,
    handerSticly,
    AppFooter
  },
  setup () {
    const store = useStore()
    store.dispatch('category/getList')
  }
}
</script>

<style lang="less" scoped>
.app-body {
  min-height: 600px;
  margin-top: 200px;
}
</style>
