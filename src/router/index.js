import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
import { h } from 'vue'

// const Layout = () => import('@/views/Layout')
// const Home = () => import('@/views/home')
import Layout from '@/views/Layout'
import Home from '@/views/home'
import TopCategory from '@/views/category/index.vue'
import SubCategory from '@/views/category/sub.vue'
const Goods = () => import('@/views/goods/index')
const Login = () => import('@/views/login/index')
const Callback = () => import('@/views/login/callback.vue')
const Cart = () => import('@/views/cart/index.vue')
const PayCheckout = () => import('@/views/member/pay/checkout')
const PayIndex = () => import('@/views/member/pay/index.vue')
const PayResult = () => import('@/views/member/pay/result')
const MemberLayout = () => import('@/views/member/Layout')
const MemberHome = () => import('@/views/member/home')
const MemberOrder = () => import('@/views/member/order')
const MemberOrderDetail = () => import('@/views/member/order/detail')

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
      { path: '/product/:id', component: Goods },
      {
        path: '/cart',
        component: Cart
      },
      { path: '/member/checkout', component: PayCheckout },
      { path: '/member/pay', component: PayIndex },
      { path: '/pay/callback', component: PayResult },
      {
        path: '/member',
        component: MemberLayout,
        children: [
          { path: '/member', component: MemberHome },
          {
            path: '/member/order/',
            // vue3.0 需要有嵌套关系才能模糊匹配
            component: { render: () => h(<RouterView/>) },
            children: [
              { path: '', component: MemberOrder },
              { path: ':id', component: MemberOrderDetail }
            ]
          }
        ]
      }
    ]
  },
  { path: '/login', component: Login },
  { path: '/login/callback', component: Callback }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior () {
    // return 期望滚动到哪个的位置
    return { top: 0, left: 0 }
  }
})

// 前置导航守卫
router.beforeEach((to, from, next) => {
  // 用户信息
  const { token } = store.state.user.profile
  // 跳转去member开头的地址却没有登录
  if (to.path.startsWith('/member') && !token) {
    // login 登陆加上来源页  encodeURIComponent 解析地址防止报错
    return next('/login?redirectUrl=' + encodeURIComponent(to.fullPath))
  }
  next()
})

export default router
