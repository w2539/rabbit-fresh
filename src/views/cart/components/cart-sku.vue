<template>
  <div class="cart-sku" ref="target">
    <div class="attrs" @click="toggle()">
      <span class="ellipsis">{{ attrsText }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="layer" v-if="visible">
      <div v-if="loading" class="loading"></div>
      <GoodsSku @change="changeSku" :skuId="skuId" v-else :goods="goods" />
      <XtxButton @click="submit" v-if="!loading" type="primary" size="mini" style="margin-left: 60px">确认</XtxButton>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { getSpecsAndSkus } from '@/api/cart'
import GoodsSku from '@/views/goods/components/goods-sku.vue'
import XtxButton from '@/components/library/xtx-button.vue'

export default {
  name: 'CartSku',
  props: {
    skuId: {
      type: String,
      default: ''
    },
    attrsText: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    // 默认隐藏
    const visible = ref(false)
    const loading = ref(false)

    // 切换
    const toggle = () => {
      visible.value ? close() : open()
    }
    // 打开
    const goods = ref(null)
    const open = () => {
      visible.value = true
      // 点击还没获取到数据时 转圈
      loading.value = true
      getSpecsAndSkus(props.skuId).then((data) => {
        goods.value = data.result
        // 加载到数据 显示数据
        loading.value = false
      })
    }
    // 关闭
    const close = () => {
      visible.value = false
    }
    // 监听sku改变的函数，记录sku信息
    const currSku = ref(null)
    const changeSku = (sku) => {
      currSku.value = sku
    }
    const submit = () => {
      // 给购物车组件数据的前提：有sku信息，sku信息完整，sku中的skuId不能现有props.skuId一样
      if (currSku.value && currSku.value.skuId !== props.skuId && currSku.value.skuId) {
        emit('change', currSku.value)
        close()
      }
    }
    const target = ref(null)
    // 侦听点击盒子以外的点击事件
    onClickOutside(target, () => {
      close()
    })
    return {
      visible,
      toggle,
      target,
      loading,
      changeSku,
      goods,
      submit
    }
  },
  components: { GoodsSku, XtxButton }
}
</script>
<style scoped lang="less">
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display: inline-block;
  .attrs {
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor, 50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    &::before {
      content: '';
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(0.8, 1) rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url('../../../assets/images/load.gif') no-repeat center;
    }
  }
}
</style>
