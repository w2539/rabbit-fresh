import { createRouter, createWebHashHistory } from 'vue-router'

// const Layout = () => import('@/views/Layout')
// const Home = () => import('@/views/home')
import Layout from '@/views/Layout'
import Home from '@/views/home'
import TopCategory from '@/views/category/index.vue'
import SubCategory from '@/views/category/sub.vue'

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
      { path: '/category/sub/:id', component: SubCategory }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
