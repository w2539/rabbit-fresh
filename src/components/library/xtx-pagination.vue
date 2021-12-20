<template>
  <div class="xtx-pagination">
    <a @click="changePager(myCurrentPage - 1)" v-if="myCurrentPage > 1" href="javascript:;">上一页</a>
    <a v-else href="javascript:;" class="disabled">上一页</a>
    <span v-if="pager.start > 1">...</span>
    <a @click="changePager(i)" href="javascript:;" v-for="i in pager.btnArr" :key="i" :class="{ active: i === myCurrentPage }">{{ i }}</a>
    <span v-if="pager.end < pager.pageCount">...</span>
    <a @click="changePager(myCurrentPage + 1)" v-if="myCurrentPage < pager.pageCount" href="javascript:;">下一页</a>
    <a v-else href="javascript:;" class="disabled">下一页</a>
  </div>
</template>
<script>
import { computed, ref } from 'vue'

export default {
  name: 'XtxPagination',
  props: {},
  setup () {
    // 总条数
    const myToal = ref(100)
    // 每页数量
    const myPageSize = ref(10)
    // 当前第几页
    const myCurrentPage = ref(1)
    // 按钮个数
    const btnCount = 5
    // 重点：根据上述数据得到（总页数，起始页码，结束页码，按钮数组）
    const pager = computed(() => {
      // 计算总页数 (总条数 / 每页数量) 向上去整
      const pageCount = Math.ceil(myToal.value / myPageSize.value)

      // 开始页码 当前第几页-( 按钮个数 / 2 )
      let start = myCurrentPage.value - Math.floor(btnCount / 2)
      let end = start + btnCount - 1
      // 页码数不能为负数
      if (start < 1) {
        // 重新等于1
        start = 1
        // 判断总页数比较少的情况
        end = start + btnCount - 1 > pageCount ? pageCount : start + btnCount - 1
      }
      // 不能大于总页数
      if (end > pageCount) {
        end = pageCount
        start = end - btnCount + 1 < 1 ? 1 : end - btnCount + 1
      }
      const btnArr = []
      for (let i = start; i <= end; i++) {
        btnArr.push(i)
      }
      return {
        pageCount,
        end,
        start,
        btnArr
      }
    })
    // 改变页码
    const changePager = (newPage) => {
      myCurrentPage.value = newPage
    }
    return {
      pager,
      myCurrentPage,
      changePager
    }
  }
}
</script>
<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333;
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
