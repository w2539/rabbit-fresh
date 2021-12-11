<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img
            :class="{ selected: val.selected, disabled: val.disabled }"
            @click="changeSku(item, val)"
            v-if="val.picture"
            :src="val.picture"
            :title="val.name"
          />
          <span :class="{ selected: val.selected, disabled: val.disabled }" @click="changeSku(item, val)" v-else>{{ val.name }}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import powerSet from '@/vueter/power-set'
const spliter = '★'
// pathMap
// 0: []
// 1: ['黑色']
// 2: ['20cm']
// 3: (2) ['黑色', '20cm']
// 4: ['中国']
// 5: (2) ['黑色', '中国']
// 6: (2) ['20cm', '中国']
// 7: (3) ['黑色', '20cm', '中国']
// 得到一个路径字典对象
const getPathMap = (skus) => {
  // 1. 得到所有的sku集合  props.goods.skus
  // 2. 从所有的sku中筛选出有效的sku
  // 3. 根据有效的sku使用power-set算法得到子集
  // 4. 根据子集往路径字典对象中存储 key-value
  const pathMap = {}
  skus.forEach((sku) => {
    if (sku.inventory > 0) {
      // 计算当前有库存的sku的子集
      // 例如：[1,2,3] ==> [[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]
      // 可选值数组 得出所有的名字
      const valueArr = sku.specs.map((val) => val.valueName)
      // 可选值数组 子集
      const valueArrPowerSet = powerSet(valueArr)

      // 遍历子集，往pathMap插入数据
      valueArrPowerSet.forEach((arr) => {
        // 根据arr得到字符串的key，约定key是：['蓝色','美国'] ===> '蓝色★美国'
        const key = arr.join(spliter)
        // 给pathMap设置数据
        if (pathMap[key]) {
          pathMap[key].push(sku.id)
        } else {
          pathMap[key] = [sku.id]
        }
      })
    }
  })

  return pathMap
}
// 获取已选中的值数组  得出数组 中间件不直接使用
// 得出 [xxx,undefined,undefined]
const getSelectedValues = (specs) => {
  const arr = []
  specs.forEach((item) => {
    // 选中的按钮对象
    const seletedVal = item.values.find((val) => val.selected)
    arr.push(seletedVal ? seletedVal.name : undefined)
  })
  return arr
}

// 更新按钮禁用状态  给disabled加上布尔值
const updateDisabledStatus = (specs, pathMap) => {
  // 1. 约定每一个按钮的状态由本身的disabled数据来控制
  specs.forEach((item, i) => {
    const selectedValues = getSelectedValues(specs)
    item.values.forEach((val) => {
      // 2. 判断当前是否选中，是选中不用判断
      if (val.selected) return
      // 3. 拿当前的值按照顺序套入选中的值数组
      selectedValues[i] = val.name
      // 4. 剔除undefined数据，按照分隔符拼接key
      const key = selectedValues.filter((value) => value).join(spliter)
      // 5. 拿着key去路径字典中查找是否有数据，有可以点击，没有就禁用（true）
      val.disabled = !pathMap[key]
    })
  })
}

const initSelectedStatus = (goods, skuId) => {
  // 筛选出来与要选中Id一致的组合
  const sku = goods.skus.find((sku) => sku.id === skuId)
  // 如果存在
  if (sku) {
    console.log(1)
    // 在goods.specs中寻找与sku中名字相同的值
    goods.specs.forEach((specs, i) => {
      // specs 是所有种类
      const value = sku.specs[i].valueName
      specs.values.forEach((val) => {
        // 如果名字相同就更改类名的布尔值
        val.selected = val.name === value
      })
    })
  }
}

export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => ({})
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const pathMap = getPathMap(props.goods.skus)

    // ☆组件初始化：更新按钮禁用状态 (开始直接禁用)
    updateDisabledStatus(props.goods.specs, pathMap)

    // 如果props.skuId存在的话

    // 默认点击
    initSelectedStatus(props.goods, props.skuId)

    // 1. 选中与取消选中，约定在每一个按钮都拥有自己的选中状态数据：selected
    // 1.1 点击的是已选中，只需要取消当前的选中
    // 1.2 点击的是未选中，把同一个规格的按钮改成未选中，当前点击的改成选中
    const changeSku = (item, val) => {
      // 当按钮是禁用的阻止程序运行
      if (val.disabled) return
      // 如果不是禁用正常运行
      if (val.selected) {
        val.selected = false
      } else {
        item.values.forEach((valItem) => {
          valItem.selected = false
        })
        val.selected = true
      }
      // ☆点击按钮时：更新按钮禁用状态
      updateDisabledStatus(props.goods.specs, pathMap)
      // 得到 [xxx,undefined,undefined] 并把多余的  undefined 去掉
      const selectedArr = getSelectedValues(props.goods.specs).filter((v) => v)
      // 如果得出的长度 等于 原本类型的全部 就算全部点击
      if (selectedArr.length === props.goods.specs.length) {
        // 完整
        const skuIds = pathMap[selectedArr.join(spliter)]
        const sku = props.goods.skus.find((sku) => sku.id === skuIds[0])
        // 条件符合 传出父组件需要的内容
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          // 属性名：属性值 属性名1：属性值1 ... 这样的字符串
          specsText: sku.specs.reduce((p, c) => `${p} ${c.name}：${c.valueName}`, '').trim()
        })
      } else {
        // 不完整
        // 父组件需要判断是否规格选择完整，不完整不能加购物车。
        emit('change', {})
      }
    }
    return { changeSku }
  }
}
</script>

<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        // 添加绿框效果
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
