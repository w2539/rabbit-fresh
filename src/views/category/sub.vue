<template>
  <div class="sub-category">
    <div class="container">
      <!-- 面包屑 -->
      <subBrand></subBrand>
      <!-- 筛选区 -->
      <SubFilter></SubFilter>
      <div class="goods-list">
        <!-- 排序 -->
        <SubSort />
        <!-- 列表 -->
      </div>
    </div>
  </div>
</template>

<script>
import SubBrand from '@/views/category/components/sub-brand.vue'
import SubFilter from './components/sub-filter.vue'
import SubSort from '@/views/category/components/sub-sort.vue'
export default {
  name: 'SubCategory',
  components: {
    SubBrand,
    SubFilter,
    SubSort
  },
  setup () {}
}
</script>
<style scoped lang="less">
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
}
</style>
