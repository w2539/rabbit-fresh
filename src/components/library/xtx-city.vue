<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggle" :class="{ active: visible }">
      <!-- 没有登陆所以默认值 -->
      <span class="placeholder" v-if="!fullLocation">{{ placeholder }}</span>
      <span v-else class="value">{{ fullLocation }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="visible">
      <div v-if="loading" class="loading"></div>
      <span @click="changeItem(item)" class="ellipsis" v-for="item in currList" :key="item.code">{{ item.name }}</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { ref, computed, reactive } from 'vue'
import { onClickOutside } from '@vueuse/core'
export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择配送地区'
    }
  },
  setup (props, { emit }) {
    const visible = ref(false)
    const cityData = ref([])
    // 用来判断数据是否加载完成 无限加载图片
    const loading = ref(false)
    // 打开函数
    const open = () => {
      visible.value = true
      // 获取数据
      getCityData().then((data) => {
        cityData.value = data
        loading.value = false
      })
      // 清空之前选择
      for (const key in changeResult) {
        changeResult[key] = ''
      }
    }
    // 关闭函数
    const close = () => {
      visible.value = false
    }
    const toggle = () => {
      // 默认为真 顺序不能换
      visible.value ? close() : open()
    }

    // 定义ref
    const target = ref(null)
    // 点击其他地方关闭
    onClickOutside(target, () => {
      close()
    })

    // 定义计算属性
    const currList = computed(() => {
      let currList = cityData.value
      // TODO 根据点击的省份城市获取对应的列表
      // areaList 是所有 一个省级市级单位的综合
      if (changeResult.provinceCode) {
        currList = currList.find((p) => p.code === changeResult.provinceCode).areaList
      }
      if (changeResult.cityCode) {
        currList = currList.find((c) => c.code === changeResult.cityCode).areaList
      }
      return currList
    })

    const changeResult = reactive({
      // 省级的编号
      provinceCode: '',
      // 省级的名字
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: ''
    })
    const changeItem = (item) => {
      // 省
      if (item.level === 0) {
        changeResult.provinceCode = item.code
        changeResult.provinceName = item.name
      }
      // 市
      if (item.level === 1) {
        changeResult.cityCode = item.code
        changeResult.cityName = item.name
      }
      // 地区
      if (item.level === 2) {
        changeResult.countyCode = item.code
        changeResult.countyName = item.name
        // 把 三个名字组合字符串发给后端
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
        // 选择到最后一项时关闭
        close()
        emit('change', changeResult)
      }
    }
    return { visible, toggle, target, currList, changeItem }
  }
}
// 获取城市数据
// 1. 数据在哪里？https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
// 2. 何时获取？打开城市列表的时候，做个内存中缓存
// 3. 怎么使用数据？定义计算属性，根据点击的省份城市展示
const getCityData = () => {
  // 这个位置可能有异常操作，封装成promise
  return new Promise((resolve, reject) => {
    if (window.cityData) {
      // 有缓存
      resolve(window.cityData)
    } else {
      // 无缓存
      const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
      axios.get(url).then((res) => {
        window.cityData = res.data
        resolve(window.cityData)
      })
    }
  })
}
</script>

<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/load.gif) no-repeat center;
    }
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>
