<template>
  <div class="xtx-carousel" @mouseenter="stop()" @mouseleave="start()">
    <!-- 图片容器 -->
    <ul class="carousel-body">
      <!-- 显示的图片 -->
      <!-- fade显示隐藏 -->
      <li class="carousel-item" v-for="(items, i) in sliders" :key="i" :class="{ fade: index === i }">
        <RouterLink to="/">
          <img :src="items.imgUrl" alt="" />
        </RouterLink>
      </li>
    </ul>
    <!-- 上一张 -->
    <a @click="toggle(-1)" href="javascript:;" class="carousel-btn prev"><i class="iconfont icon-angle-left"></i></a>
    <!-- 下一张 -->
    <a @click="toggle(+1)" href="javascript:;" class="carousel-btn next"><i class="iconfont icon-angle-right"></i></a>
    <!-- 小圆点 -->
    <div class="carousel-indicator">
      <span @click="index = i" v-for="(items, i) in sliders" :key="i" :class="{ active: index == i }"></span>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { onUnmounted } from '@vue/runtime-core'

export default {
  name: 'XtxCarousel',
  // 要传入的参数
  props: {
    sliders: {
      type: Array,
      default: () => []
    },
    // 传入的时间
    duration: {
      type: Number,
      // 默认时间
      default: 3000
    },
    // 是否自动轮播
    autoPlay: {
      type: Boolean,
      // 默认开启轮播
      default: true
    }
  },
  setup (props) {
    // 控制图片索引
    // 将index等于 循环的 id 进行联系
    const index = ref(0)
    let time = null
    const autoPlayFn = () => {
      clearInterval(time)
      // 每隔一定时间切换索引
      time = setInterval(() => {
        index.value++
        if (index.value >= props.sliders.length) {
          index.value = 0
        }
      }, props.duration)
    }
    // 监听sliders的变化 判断如果有数据 并且 autoPlay的值是true
    watch(
      () => props.sliders,
      (newVal) => {
        // 有数据&开启自动播放，才调用自动播放函数
        if (newVal.length && props.autoPlay) {
          index.value = 0
          autoPlayFn()
        }
      },
      { immediate: true } // 表示立即执行
    )
    // 鼠标停留
    const stop = () => {
      // 清除轮播图
      clearInterval(time)
    }
    // 鼠标移开 开启轮播图
    const start = () => {
      if (props.sliders.length && props.autoPlay) {
        autoPlayFn()
      }
    }

    const toggle = (step) => {
      const newindex = index.value + step
      // 超过最大图片数量 移动到第一张
      if (newindex > props.sliders.length - 1) {
        index.value = 0
        // 表示结束循环
        return
      }
      // 图片下标小于0 移动到最后一张
      if (newindex < 0) {
        index.value = props.sliders.length - 1
        // 表示结束循环
        return false
      }
      // 正常情况
      index.value = newindex
    }
    // 组件消耗，清理定时器
    onUnmounted(() => {
      clearInterval(time)
    })

    return { index, stop, start, toggle }
  }
}
</script>
<style scoped lang="less">
.xtx-carousel {
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel {
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background: #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev {
        left: 20px;
      }
      &.next {
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
</style>
