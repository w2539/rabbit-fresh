<template>
  <div class="index">
    <!-- MemberOrder -->
    <XtxTabs v-model="active" @tab-click="tabClick">
      <XtxTabsPanel v-for="item in orderStatus" :key="item.name" :label="item.label" :name="item.name"></XtxTabsPanel>
    </XtxTabs>

    <div class="order-list">
      <div v-if="!loading" class="loading"></div>
      <div class="none" v-if="loading && orderItem.items.length === 0">暂无数据</div>
      <OrderItem v-for="item in orderItem.items" :key="item.id" :order="item" />
    </div>

    <XtxPagination
      v-if="total > requestParams.pageSize"
      @current-change="changePagerFn"
      :total="total"
      :page-size="requestParams.pageSize"
      :current-page="requestParams.page"
    />
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue'
import { orderStatus } from '@/api/constants'
import XtxPagination from '@/components/library/xtx-pagination.vue'
import OrderItem from './components/order-item.vue'
import { findOrderList } from '@/api/order'
export default {
  name: ' MemberOrder',
  setup () {
    const active = ref(orderStatus[0].name)
    const requestParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0
    })
    const total = ref(0)
    const orderItem = ref([])
    const loading = ref(true)
    const getOrderList = () => {
      loading.value = false
      findOrderList(requestParams).then((data) => {
        orderItem.value = data.result
        total.value = data.result.counts
        loading.value = true
      })
    }

    // 完成tab切换加载

    const tabClick = ({ index }) => {
      requestParams.page = 1
      requestParams.orderState = index
    }

    watch(
      requestParams,
      () => {
        getOrderList()
      },
      { immediate: true }
    )
    //  完成加载中，无数据处理
    // 完成分页加载
    // 实现分页切换
    const changePagerFn = (newPage) => {
      requestParams.page = newPage
    }
    return { active, orderItem, tabClick, orderStatus, loading, total, requestParams, changePagerFn }
  },
  components: { XtxPagination, OrderItem }
}
</script>

<style scoped lang="less">
.order-list {
  background: #fff;
  padding: 20px;
}
.order-list {
  padding: 20px;
  position: relative;
  min-height: 400px;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.9) url(../../../assets/images/load.gif) no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>
