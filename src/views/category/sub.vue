<template>
  <div class="sub-category">
    <div class="container">
      <!-- 面包屑 -->
      <subBrand></subBrand>
      <!-- 筛选区 -->
      <SubFilter></SubFilter>
    </div>
  </div>
</template>

<script>
import SubBrand from '@/views/category/components/sub-brand.vue'
import SubFilter from './components/sub-filter.vue'
export default {
  name: 'SubCategory',
  components: {
    SubBrand,
    SubFilter
  }
}
</script>
<style scoped lang="less"></style>
