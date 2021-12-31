<template>
  <nav class="app-topnav">
    <div class="container">
      <ul>
        <template v-if="profile.token">
          <li>
            <a href="javascript:;">
              <i class="iconfont icon-user"></i>
              {{ profile.account }}
            </a>
          </li>
          <li>
            <a href="javascript:;" @click="quit">退出登录</a>
          </li>
        </template>
        <template v-else>
          <li>
            <router-link to="/login">登陆</router-link>
          </li>
          <li>
            <a href="javascript:;">免费注册</a>
          </li>
        </template>
        <li>
          <a href="javascript:;">我的订单</a>
        </li>
        <li>
          <a href="javascript:;">会员中心</a>
        </li>
        <li>
          <a href="javascript:;">帮助中心</a>
        </li>
        <li>
          <a href="javascript:;">关于我们</a>
        </li>
        <li>
          <a href="javascript:;">
            <i class="iconfont icon-phone"></i>
            手机版
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
// 在项目里直接使用 vuex里面的方法
import { useStore } from 'vuex'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
export default {
  name: 'AppTopnav',
  setup () {
    const store = useStore()
    const profile = computed(() => {
      // 直接按需导入不是响应式数据 这样导入可以保证是响应式数据
      // 原理是vuex的特性
      return store.state.user.profile
    })

    const router = useRouter()
    const quit = () => {
      store.commit('user/setUser', {})
      router.push('/login')
    }
    return { profile, quit }
  }
}
</script>

<style scoped lang="less">
.app-topnav {
  background: #333;

  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;

    li {
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;

        i {
          font-size: 14px;
          margin-right: 2px;
        }

        &:hover {
          color: @xtxColor;
        }
      }

      ~ li {
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}
</style>
