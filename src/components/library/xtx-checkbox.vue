<template>
  <div class="xtx-checkbox" @click="changeChecked">
    <i v-if="checked" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <!-- $slots是一个插槽用来预留位置， -->
    <!-- 得到插槽的所有内容 -->
    <!-- 如果有数据再显示 -->
    <span v-if="$slots.default"><slot /></span>
  </div>
</template>

<script>
// import { ref } from '@vue/reactivity'
// import { watch } from '@vue/runtime-core'
import { useVModel } from '@vueuse/core'
// v-model ====> :modelValue + @update:modelValue
export default {
  name: 'XtxCheckbox',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    // 使用useVModel实现双向数据绑定v-model指令
    // 1. 使用props接收modelValue
    // 2. 使用useVModel来包装props中的modelValue属性数据
    // 3. 在使用checked.value就是使用父组件数据
    // 4. 在使用checked.value = '数据' 赋值，触发emit('update:modelvalue', '数据')
    const checked = useVModel(props, 'modelValue', emit)
    const changeChecked = () => {
      const newVal = !checked.value
      // 通知父组件
      checked.value = newVal
      // 让组件支持change事件
      emit('change', newVal)
    }
    return { checked, changeChecked }
  }
  // setup (props, { emit }) {
  //   const checked = ref(false)
  //   const changeChecked = () => {
  //     checked.value = !checked.value
  //     // 使用emit通知父组件数据的改变
  //     emit('update:modelValue', checked.value)
  //   }
  //   watch(
  //     () => prpos.modelValue,
  //     () => {
  //       checked.value = props.modelValue
  //     }
  //   ),
  //   { immediate: true }

  //   return { checked, changeChecked }
  // }
}
</script>

<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
