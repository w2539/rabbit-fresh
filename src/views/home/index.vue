<template>
  <!--  版心部分 -->
  <!-- 通栏 -->
  <div class="page-home">
    <!-- 通栏 -->
    <div class="home-entry">
      <div class="container">
        <!-- 左侧分类 -->
        <HomeCategory />
        <!-- 轮播图 -->8
        <HomeBanner></HomeBanner>
      </div>
    </div>
  </div>
  <!-- 新鲜好物 -->
  <HomeNew></HomeNew>
  <!-- 人气推荐 -->
  <HomeHot></HomeHot>
</template>

<script>
import '@/assets/styles/common.less'
import HomeCategory from '@/views/home/components/home-category.vue'
import HomeBanner from '@/components/home-banner.vue'
import HomeNew from '@/views/home/components/home-new.vue'
import HomeHot from '@/views/home/components/home-hot'
export default {
  name: 'xtx-home-page',
  components: {
    HomeCategory,
    HomeBanner,
    HomeNew,
    HomeHot
  }
}
</script>

<style lang="less" scoped>
.xtx-home-page {
  .hoverShadow ();
  color: @xtxColor;
}
</style>
