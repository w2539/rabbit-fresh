// 实现使用函数调用xtx-message组件的逻辑
import { createVNode, render } from 'vue'
import XtxMessage from './xtx-message.vue'

// 准备dom容器
const div = document.createElement('div')
// 更改类名
div.setAttribute('class', 'xtx-message-container')
// 添加到 body 的子集中
document.body.appendChild(div)
// 定义定时器标识
let timer = null

export default ({ type, text }) => {
  // 实现：根据xtx-message.vue渲染消息提示
  // 1.导入组件
  // 2.根据组件创建虚拟节点
  // 注：vue方法把vue组件转化为虚拟节点
  const vnode = createVNode(XtxMessage, { type, text })
  // 3.准备一个DOM 容器 因为不是原生js所以不能直接使用
  render(vnode, div)
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, 3000)
}
