<template>
  <div class="page-home">
    <div class="home-entry">
      <div class="container">
        <!-- 左侧分类 -->
        <HomeCategory />
        <!-- 轮播图 -->
        <HomeBanner></HomeBanner>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/styles/common.less'
import HomeCategory from '@/views/home/components/home-category.vue'
import HomeBanner from '@/components/home-banner.vue'
export default {
  name: 'xtx-home-page',
  components: {
    HomeCategory,
    HomeBanner
  }
}
</script>

<style lang="less" scoped>
.xtx-home-page {
  .hoverShadow ();
  color: @xtxColor;
}
</style>
