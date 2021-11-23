<template>
  <div class="sub-brand">
    <XtxBread>
      <XtxBreadItem to="">首页</XtxBreadItem>
      <XtxBreadItem v-if="category.top" :to="`/category ${category.top.id}`">{{ category.top.name }}</XtxBreadItem>
      <Transition name="fade-right" mode="out-in">
        <XtxBreadItem v-if="category.sub" :key="category.sub.id">{{ category.sub.name }}</XtxBreadItem>
      </Transition>
    </XtxBread>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
export default defineComponent({
  name: 'sub-brand',
  setup () {
    const router = useRoute()
    const store = useStore()

    const category = computed(() => {
      const cate = {}
      store.state.category.list.forEach((top) => {
        // 如果存在
        if (top.children) {
          // 查找到与二级类目相同的并返回
          const sub = top.children.find((sub) => sub.id === router.params.id)
          if (sub) {
            cate.top = { id: top.id, name: top.name }
            cate.sub = { id: sub.id, name: sub.name }
          }
        }
      })
      return cate
    })

    return { category }
  },
  components: {}
})
</script>

<style scoped lang="less"></style>
