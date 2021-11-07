<template>
  <div class="home-panel">
    <div class="container">
      <div class="head">
        <!-- 左上角标题 -->
        <h3>
          {{ title }}<small>{{ subTitle }}</small>
        </h3>
        <!-- 右上角 -->
        <slot name="right"></slot>
      </div>
      <!-- 具体内容 -->
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'home-panel',
  props: {
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 副标题
    subTitle: {
      type: String,
      default: ''
    }
  },
  setup () {
    return {}
  }
})
</script>

<style scoped lang="less">
.home-panel {
  background-color: #fff;
  .head {
    padding: 40px 0;
    display: flex;
    align-items: flex-end;
    h3 {
      flex: 1;
      font-size: 32px;
      font-weight: normal;
      margin-left: 6px;
      height: 35px;
      line-height: 35px;
      small {
        font-size: 16px;
        color: #999;
        margin-left: 20px;
      }
    }
  }
}
</style>
