// 实现使用函数调用xtx-confirm组件的逻辑

import { createVNode, render } from 'vue'
import XtxConfirm from './xtx-confirm.vue'

// 准备容器

const div = document.createElement('div')

div.setAttribute('class', 'xtx-confirm-container')

document.body.appendChild(div)

export default ({ title, text }) => {
  return new Promise((resolve, reject) => {
    const submitCallback = () => {
      // 销毁组件
      render(null, div)
      resolve()
    }
    const cancelCallback = () => {
      render(null, div)
      reject(new Error('点击取消'))
    }
    // 注：vue方法把vue组件转化为虚拟节点
    const vn = createVNode(XtxConfirm, { title, text, cancelCallback, submitCallback })
    render(vn, div)
  })
}
