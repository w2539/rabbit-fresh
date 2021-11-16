<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem to="/category/1005000">电器</XtxBreadItem>
        <XtxBreadItem>空调</XtxBreadItem>
      </XtxBread>
      <!-- 轮播图 -->
    </div>
  </div>
</template>
<script>
// import XtxBreadItem from '@/components/library/xtx-bread-item.vue'
export default {
  name: 'TopCategory',
  components: {
    // XtxBreadItem
  }
}
</script>
<style scoped lang="less"></style>
