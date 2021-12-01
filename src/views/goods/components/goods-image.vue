<template>
  <div class="goods-image">
    <!-- 二倍图 -->
    <div v-show="show" class="large" :style="[{ backgroundImage: `url(${images[currIndex]})` }, largePosition]"></div>
    <!-- 以此为中心 -->
    <div class="middle" ref="target">
      <img :src="images[currIndex]" alt="" />
      <!--  -->
      <div v-show="show" class="layer" :style="layerPosition"></div>
    </div>
    <ul class="small">
      <!-- 便利的时候带上 -->
      <li v-for="(img, i) in images" :key="img" :class="{ active: i === currIndex }">
        <img @mouseenter="currIndex = i" :src="img" alt="" />
      </li>
    </ul>
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue'
import { useMouseInElement } from '@vueuse/core'
export default {
  name: 'GoodsImage',
  props: {
    images: {
      type: Array,
      default: () => []
    }
  },
  setup (props) {
    // 当前预览图的索引
    const currIndex = ref(0)

    // 1. 是否显示遮罩和大图
    const show = ref(false)
    // 2. 遮罩的坐标(样式)
    const layerPosition = reactive({
      left: 0,
      top: 0
    })
    // 3. 大图背景定位(样式)
    const largePosition = reactive({
      backgroundPositionX: 0,
      backgroundPositionY: 0
    })
    // 4. 使用useMouseInElement得到基于元素左上角的坐标和是否离开元素数据
    const target = ref(null)
    const { elementX, elementY, isOutside } = useMouseInElement(target)
    watch([elementX, elementY, isOutside], () => {
      // 相对于 主盒子的坐标
      // console.log(elementX.value)
      // console.log(elementY.value)
      // console.log(isOutside.value)

      // 5. 根据得到数据设置样式数据和是否显示数据
      show.value = !isOutside.value
      // 将positions传回
      const positions = { x: 0, y: 0 }

      if (elementX.value < 100) positions.x = 0
      // 向右移动的距离大于300,盒子直接与右边对齐
      else if (elementX.value > 300) positions.x = 200
      else positions.x = elementX.value - 100

      if (elementY.value < 100) positions.y = 0
      // 鼠标向右移动的距离大于300,盒子直接与右边对齐
      else if (elementY.value > 300) positions.y = 200
      // 鼠标在遮罩盒子的中间所以减100
      else positions.y = elementY.value - 100

      layerPosition.left = positions.x + 'px'
      layerPosition.top = positions.y + 'px'
      largePosition.backgroundPositionX = -2 * positions.x + 'px'
      largePosition.backgroundPositionY = -2 * positions.y + 'px'
    })

    return { currIndex, show, layerPosition, largePosition, target }
  }
}
</script>

<style scoped lang="less">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  z-index: 500;
  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
    background-color: #f8f8f8;
  }
  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    position: relative;
    cursor: move;
    .layer {
      width: 200px;
      height: 200px;
      background: rgba(0, 0, 0, 0.2);
      left: 0;
      top: 0;
      position: absolute;
    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,
      &.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>
