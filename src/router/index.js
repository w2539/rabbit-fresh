import { createRouter, createWebHashHistory } from 'vue-router'

// const Layout = () => import('@/views/Layout')
// const Home = () => import('@/views/home')
import Layout from '@/views/Layout'
import Home from '@/views/home'
import TopCategory from '@/views/category/index.vue'
import SubCategory from '@/views/category/sub.vue'
const Goods = () => import('@/views/goods/index')

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        component: Home
      },
      { path: '/category/:id', component: TopCategory },
      { path: '/category/sub/:id', component: SubCategory },
      { path: '/product/:id', component: Goods }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior () {
    // return 期望滚动到哪个的位置
    return { top: 0, left: 0 }
  }
})

export default router
