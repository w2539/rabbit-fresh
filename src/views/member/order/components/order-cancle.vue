<template>
  <XtxDialog title="取消订单" v-model:visible="visibleDialog">
    <!-- 取消原因列表 -->
    <div class="cancel-info">
      <p>取消订单后，本单享有的优惠可能会一并取消，是否继续？</p>
      <p class="tip">请选择取消订单的原因（必选）：</p>
      <div class="btn">
        <a @click="curText = item" v-for="item in cancelReason" :key="item" href="javascript:;" :class="{ active: curText === item }">
          {{ item }}
        </a>
      </div>
    </div>
    <template #footer>
      <XtxButton type="gray" @click="visibleDialog = false" style="margin-right: 20px; margin-top: 0px">取消</XtxButton>
      <XtxButton type="primary" @click="submit" style="margin-top: 0px">确认</XtxButton>
    </template>
  </XtxDialog>
</template>

<script>
import { findOrderCancel } from '@/api/order'
import Message from '@/components/library/Message'
import { ref } from 'vue'
export default {
  name: 'order-cancle',
  props: {
    cancelReason: {
      type: Object,
      default: () => ({})
    }
  },
  setup () {
    const curText = ref('')
    const currOrder = ref(null)
    const open = (order) => {
      visibleDialog.value = true
      currOrder.value = order
    }
    const submit = () => {
      if (!curText.value) return Message({ text: '请选择订单原因' })
      findOrderCancel({
        orderId: currOrder.value.id,
        cancelReason: curText.value
      }).then((data) => {
        Message({ type: 'success', text: '取消订单成功' })
        // 更新订单状态
        currOrder.value.orderState = 6
        // 关闭对话框
        visibleDialog.value = false
      })
    }
    const visibleDialog = ref(false)
    return { visibleDialog, open, submit, curText }
  }
}
</script>

<style scoped lang="less">
.xtx-dialog :deep(.wrapper) {
  position: flex;
  left: 50%;
  top: 50%;
  width: 620px;
  height: 464px;
}

.cancel-info {
  p {
    font-size: 16px;
    line-height: 35px;
    &.tip {
      color: #999;
    }
  }
  .btn {
    padding-top: 11px;
    display: flex;
    flex-wrap: wrap;
    a {
      width: 256px;
      height: 45px;
      line-height: 45px;
      text-align: center;
      background-color: #ffffff;
      border: 1px solid #e4e4e4;
      margin-right: 20px;
      margin-bottom: 20px;
      color: #666;
      &:nth-child(2n) {
        margin-right: 0;
      }
      &:hover,
      &.active {
        background-color: #e3f9f4;
        border-color: @xtxColor;
      }
    }
  }
}
</style>
