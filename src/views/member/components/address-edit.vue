<template>
  <XtxDialog :title="`${formData.id ? '修改' : '添加'}收货地址`" v-model:visible="dialogVisible">
    <div class="address-edit">
      <div class="xtx-form">
        <div class="xtx-form-item">
          <div class="label">收货人：</div>
          <div class="field">
            <input v-model="formData.receiver" class="input" placeholder="请输入收货人" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">手机号：</div>
          <div class="field">
            <input v-model="formData.contact" class="input" placeholder="请输入手机号" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地区：</div>
          <div class="field">
            <XtxCity placeholder="请选择所在地区" :fullLocation="formData.fullLocation" @change="changeCity" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">详细地址：</div>
          <div class="field">
            <input v-model="formData.address" class="input" placeholder="请输入详细地址" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">邮政编码：</div>
          <div class="field">
            <input v-model="formData.postalCode" class="input" placeholder="请输入邮政编码" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地址标签：</div>
          <div class="field">
            <input v-model="formData.addressTags" class="input" placeholder="请输入地址标签，逗号分隔" />
          </div>
        </div>
      </div>
    </div>
    <template v-slot:footer>
      <XtxButton @click="dialogVisible = false" type="gray" style="margin-right: 20px">取消</XtxButton>
      <XtxButton @click="submit()" type="primary">确认</XtxButton>
    </template>
  </XtxDialog>
</template>
<script>
import { addAddress, editAddress } from '@/api/order'

import Message from '@/components/library/Message'
import { reactive, ref } from 'vue'
export default {
  name: 'AddressEdit',
  setup (props, { emit }) {
    const dialogVisible = ref(false)
    // 打开函数
    const open = (form) => {
      dialogVisible.value = true
      // 传人{}的时候就是清空，否则就是赋值
      if (form.id) {
        for (const key in formData) {
          formData[key] = form[key]
        }
      } else {
        for (const key in formData) {
          if (key === 'isDefault') {
            formData[key] = 1
          } else {
            formData[key] = null
          }
        }
      }
    }
    const confirmAddressFn = () => {
      dialogVisible.value = false
    }

    // 定义表单绑定的数据
    const formData = reactive({
      // 收获人姓名
      receiver: '',
      // 联系方式
      contact: '',
      // 所在省份编码
      provinceCode: '',
      // 所在城市编码
      cityCode: '',
      // 所在区/县编码
      countyCode: '',
      // 详细地址
      address: '',
      // 邮政编码
      postalCode: '',
      // 地址标签,以英文逗号分割
      addressTags: '',
      // 是否为默认，0为是，1为否
      isDefault: 0,
      fullLocation: ''
    })
    const changeCity = (result) => {
      formData.provinceCode = result.provinceCode
      formData.cityCode = result.cityCode
      formData.countyCode = result.countyCode
      formData.fullLocation = result.fullLocation
    }
    // 点击确认
    const submit = () => {
      if (formData.id) {
        // 修改请求
        editAddress(formData).then((data) => {
          // 提示
          Message({ type: 'success', text: '修改收货地址成功' })
          // 关闭
          dialogVisible.value = false
          // 触发自定义事件
          emit('on-success', formData)
        }).catch((e) => {
          Message({ type: 'error', text: '添加失败' })
        })
      } else {
        // 添加请求  表单验证不错接口不会报错
        addAddress(formData)
          .then((data) => {
            // 需要设置ID
            formData.id = data.result.id
            // 提示
            Message({ type: 'success', text: '添加收货地址成功' })
            // 关闭
            dialogVisible.value = false
            // 触发自定义事件
            emit('on-success', formData)
          })
          .catch((e) => {
            Message({ type: 'error', text: '添加失败' })
          })
      }
    }
    return { dialogVisible, open, confirmAddressFn, changeCity, formData, submit }
  }
}
</script>
<style scoped lang="less">
.address-edit {
  .xtx-dialog {
    :deep(.wrapper) {
      width: 780px;
      .body {
        font-size: 14px;
      }
    }
  }
  .xtx-form {
    padding: 0;
    input {
      outline: none;
      &::placeholder {
        color: #ccc;
      }
    }
  }
  .xtx-city {
    width: 320px;
    :deep(.select) {
      height: 50px;
      line-height: 48px;
      display: flex;
      padding: 0 10px;
      justify-content: space-between;
      .placeholder {
        color: #ccc;
      }
      i {
        color: #ccc;
        font-size: 18px;
      }
      .value {
        font-size: 14px;
      }
    }
    :deep(.option) {
      top: 49px;
    }
  }
}
</style>
