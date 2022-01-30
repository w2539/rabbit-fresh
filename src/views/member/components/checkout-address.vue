<template>
  <div class="checkout-address">
    <div class="text">
      <div v-if="!showAddress" class="none">您需要先添加收货地址才可提交订单。</div>

      <ul v-if="showAddress">
        <li>
          <span>收<i />货<i />人：</span>{{ showAddress.receiver }}
        </li>
        <li><span>联系方式：</span>{{ showAddress.contact.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') }}</li>
        <li><span>收货地址：</span>{{ showAddress.fullLocation }} {{ showAddress.address }}</li>
      </ul>
      <a @click="openAddressEdit(showAddress)" href="javascript:;">修改地址</a>
      <a @click="outAddressEdit(showAddress)" href="javascript:;">删除地址</a>
    </div>
    <div class="action">
      <XtxButton @click="openDialog" class="btn">切换地址</XtxButton>
      <XtxButton @click="openAddressEdit({})" class="btn">添加地址</XtxButton>
    </div>
    <!-- v-model:visible="dialogVisible" 决定组件显示的属性 -->
    <XtxDialog title="切换收货地址" v-model:visible="dialogVisible">
      <div
        class="text item"
        :class="{ active: selectedAddress && item.id === selectedAddress.id }"
        @click="selectedAddress = item"
        v-for="item in list"
        :key="item.id"
      >
        <ul>
          <li>
            <span>收<i />货<i />人：</span>{{ item.receiver }}
          </li>
          <li><span>联系方式：</span>{{ item.contact }}</li>
          <li><span>收货地址：</span>{{ item.fullLocation.replace(/ /g, '') + item.address }}</li>
        </ul>
      </div>
      <template #footer>
        <XtxButton @click="dialogVisible = false" type="gray" style="margin-right: 20px">取消</XtxButton>
        <XtxButton @click="confirmAddressFn()" type="primary">确认</XtxButton>
      </template>
    </XtxDialog>
    <AddressEdit ref="addressEdit" @on-success="successHandler"></AddressEdit>
  </div>
</template>
<script>
import { ref } from 'vue'
import XtxDialog from '@/components/library/xtx-dialog.vue'
import AddressEdit from './address-edit.vue'
import { outAddress } from '@/api/order'
import Message from '@/components/library/Message'

export default {
  name: 'CheckoutAddress',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  setup (props, { emit }) {
    // 对话框显示隐藏
    const dialogVisible = ref(false)
    // 默认地址的内容
    const showAddress = ref(null)
    if (props.list.length) {
      // 列表里面有 defaultAddress 代表有默认地址
      // 寻找到 第一个为 1 的
      const defaultAddress = props.list.find((item) => item.isDefault === 1)
      if (defaultAddress) {
        showAddress.value = defaultAddress
      } else {
        // 双向绑定的值经过修改之后会修改props里面的值
        // 不被规则允许 但其实是可行的
        // eslint-disable-next-line vue/no-setup-props-destructure
        showAddress.value = props.list[0]
      }
      emit('change', showAddress.value?.id)
    }

    // 大致步骤：

    // 1. 组件初始化的时候需要得到一个默认的地址ID通知给结算组件
    // 2. 对话框中渲染一个地址列表
    // 3. 实现可以选中的效果，点击确认后变更显示地址，通知结算组件地址ID

    // 打开对话框
    const openDialog = () => {
      dialogVisible.value = true
      selectedAddress.value = null
    }
    // 默认通知父组件一个收货地址ID
    emit('change', showAddress.value && showAddress.value.id)

    // 记录当前你选中的地址ID
    const selectedAddress = ref(null)
    const confirmAddressFn = () => {
      // 显示的地址换成呢选中的地址
      showAddress.value = selectedAddress.value
      // 把选中的地址ID通知结算组件
      emit('change', selectedAddress.value?.id)
      // 关闭对话框
      dialogVisible.value = false
    }

    // 通过控制ref来显示打开
    const addressEdit = ref(null)
    const openAddressEdit = (showAddress) => {
      // 调用子组件里面方法open()  或者是有值或者是空对象
      addressEdit.value.open(showAddress)
    }

    // 添加自定义事件
    const successHandler = (formData) => {
      // 根据formData中的ID去当前地址列表中查找，有就是修改，否则是添加
      const address = props.list.find((item) => item.id === formData.id)
      if (address) {
        for (const key in address) {
          address[key] = formData[key]
        }
      } else {
        // 如果是添加：往list中追加一条
        // 当你在修改formData的时候，数组中的数据也会更新，因为是同一引用地址。
        // 啥时候修改formData，当你打开对话框需要清空之前的输入信息
        // 克隆formData数据
        // 我们可以使用 JSON.stringify() 方法将 JavaScript 对象转换为字符串。
        const jsonStr = JSON.stringify(formData)
        // eslint-disable-next-line vue/no-mutating-props
        props.list.unshift(JSON.parse(jsonStr))
      }
    }
    const outAddressEdit = (from) => {
      outAddress({ id: from.id }).then((data) => {
        const address = props.list.find((item) => item.id === from.id)
        if (address) {
          // eslint-disable-next-line vue/no-mutating-props
          props.list.splice(address, 1)
        }
        Message({ type: 'success', text: '删除成功' })
      })
    }
    return {
      showAddress,
      dialogVisible,
      openDialog,
      confirmAddressFn,
      selectedAddress,
      openAddressEdit,
      addressEdit,
      successHandler,
      outAddressEdit
    }
  },
  components: { XtxDialog, AddressEdit }
}
</script>
<style scoped lang="less">
.checkout-address {
  .xtx-dialog {
    .text {
      flex: 1;
      min-height: 90px;
      display: flex;
      align-items: center;
      &.item {
        border: 1px solid #f5f5f5;
        margin-bottom: 10px;
        cursor: pointer;
        &.active,
        &:hover {
          border-color: @xtxColor;
          background: lighten(@xtxColor, 50%);
        }
        > ul {
          padding: 10px;
          font-size: 14px;
          line-height: 30px;
        }
      }
    }
  }
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>
