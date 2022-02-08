<script>
import { useVModel } from '@vueuse/core'
import { provide } from 'vue'

export default {
  name: 'XtxTabs',
  setup (props, { emit }) {
    const activeName = useVModel(props, 'modelValue', emit)
    const tabClick = (name, index) => {
      activeName.value = name
      emit('tab-click', { name, index })
    }
    provide('activeName', activeName)
    return { tabClick, activeName }
  },
  props: {
    modelValue: {
      type: [Number, String],
      default: ''
    }
  },
  render () {
    // Panels 为插槽对象的所有内容
    const panels = this.$slots.default()
    // console.log(panels)
    const dynamicPanels = []
    panels.forEach((items) => {
      // 静态
      if (items.type.name === 'XtxTabsPanel') {
        dynamicPanels.push(items)
      } else {
        // v-for 渲染处来的
        items.children.forEach((item) => {
          dynamicPanels.push(item)
        })
      }
    })
    const nav = (
      <nav>
        {dynamicPanels.map((items, i) => {
          return (
            <a
              href="javascript:;"
              class={{ active: items.props.name === this.activeName }}
              onClick={() => this.tabClick(items.props.name, i)}
            >
              {items.props.label}
            </a>
          )
        })}
      </nav>
    )

    return <div class="xtx-tabs">{[nav, dynamicPanels]}</div>
  }
}
</script>

<style scoped lang="less">
.xtx-tabs {
  background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>
