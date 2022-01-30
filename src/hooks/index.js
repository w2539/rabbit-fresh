// hooks 封装逻辑，提供响应式数据。
import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'
/**
 * 数据懒加载函数
 * @param {Element} target - Dom对象
 * @param {Function} apiFn - API函数
 */

// 数据懒加载函数
export const useLazyData = (apiFn) => {
  const result = ref([])
  const target = ref(null)
  // stop 停止观察
  const { stop } = useIntersectionObserver(
    // 监听的目标元素
    target,
    ([{ isIntersecting }], observerElement) => {
      // isIntersecting 是否进入可视区
      if (isIntersecting) {
        stop()
        // 调用API函数获取数据
        apiFn().then((data) => {
          result.value = data.result
        })
      }
    },
    // 配置选项，相交的比例大于0就触发
    {
      threshold: 0
    }
  )
  return { result, target }
}

export const usePayTime = () => {
  const time = ref(0)
  const textTime = ref('')
  const { pause, resume } = useIntervalFn(
    () => {
      time.value--
      // console.log(time.value)
      textTime.value = dayjs.unix(time.value).format('mm分ss秒')
      if (time.value <= 0) {
        pause()
      }
    },
    1000,
    false
  )
  // 组件销毁停止计时
  onMounted(() => {
    pause()
  })
  // 开启定时器 countdown 倒计时时间
  const start = (countdown) => {
    time.value = countdown
    textTime.value = dayjs.unix(time.value).format('mm分ss秒')
    resume()
  }
  return {
    start,
    textTime
  }
}
