<template>
  <div class="page-home">
    <div class="home-entry">
      <div class="container">
        <!-- 左侧分类 -->
        <HomeCategory />
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/styles/common.less'
import HomeCategory from '@/views/home/components/home-category.vue'
export default {
  name: 'xtx-home-page',
  components: {
    HomeCategory
  }
}
</script>

<style lang="less" scoped>
.xtx-home-page {
  .hoverShadow ();
  color: @xtxColor;
}
</style>
