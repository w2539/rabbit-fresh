<template>
  <div class="sub-category">
    <div class="container">
      <!-- 面包屑 -->
      <subBrand></subBrand>
      <!-- 筛选区 -->
      <SubFilter @filter-change="filterChange" />
      <div class="goods-list">
        <!-- 排序 -->
        <SubSort @sort-change="sortChange" />
        <!-- 列表 -->
        <ul>
          <li v-for="goods in goodsList" :key="goods.id">
            <GoodItems :goods="goods"></GoodItems>
          </li>
        </ul>
        <!-- 无限加载组件 -->
        <XtxInfiniteLoading :loading="loading" :finished="finished" @infinite="getData"></XtxInfiniteLoading>
      </div>
    </div>
  </div>
</template>

<script>
import SubBrand from '@/views/category/components/sub-brand.vue'
import SubFilter from './components/sub-filter.vue'
import SubSort from '@/views/category/components/sub-sort.vue'
import GoodItems from './components/good-items.vue'
import XtxInfiniteLoading from '@/components/xtx-infinite-loading.vue'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findSubCategoryGoods } from '@/api/category'
export default {
  name: 'SubCategory',
  components: {
    SubBrand,
    SubFilter,
    SubSort,
    GoodItems,
    XtxInfiniteLoading
  },
  setup () {
    // 1. 基础布局
    // 2. 无限加载组件
    // 3. 动态加载数据且渲染
    // 4. 任何筛选条件变化需要更新列表
    const route = useRoute()

    const loading = ref(false)
    const finished = ref(false)
    const goodsList = ref([])
    // 查询参数
    let reqParams = {
      page: 1,
      pageSize: 20,
      categoryId: route.params.id
    }
    // 获取数据函数
    const getData = () => {
      loading.value = true
      reqParams.categoryId = route.params.id
      findSubCategoryGoods(reqParams).then(({ result }) => {
        if (result.items.length) {
          goodsList.value.push(...result.items)
          reqParams.page++
        } else {
          // 加载完毕
          finished.value = true
        }
        // 请求结束
        loading.value = false
      })
    }

    // 切换二级分类重新加载
    watch(
      () => route.params.id,
      (newVal) => {
        if (newVal && route.path === '/category/sub/' + newVal) {
          goodsList.value = []
          reqParams = {
            page: 1,
            pageSize: 20
          }
          finished.value = false
        }
      }
    )
    // 监听排序改变
    const changeSort = (sortParams) => {
      reqParams = { ...reqParams, ...sortParams }
      reqParams.page = 1
      goodsList.value = []
      finished.value = false
    }
    // 2. 更改筛选组件的筛选数据，重新请求
    const filterChange = (filterParams) => {
      finished.value = false
      // 合并请求参数，保留之前参数
      reqParams = { ...reqParams, ...filterParams }
      reqParams.page = 1
      goodsList.value = []
    }
    return { loading, finished, goodsList, getData, changeSort, filterChange }
  }
}
</script>
<style scoped lang="less">
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
