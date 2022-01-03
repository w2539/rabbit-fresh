<template>
  <Form ref="formCom" :validation-schema="mySchema" v-slot="{ errors }" autocomplete="off" class="xtx-form">
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi，{{ nickname }} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field name="mobile" :class="{ err: errors.mobile }" v-model="form.mobile" class="input" type="text" placeholder="绑定的手机号" />
      </div>
      <div v-if="errors.mobile" class="error">{{ errors.mobile }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field name="code" :class="{ err: errors.code }" v-model="form.code" class="input" type="text" placeholder="短信验证码" />
        <span class="code" @click="send()">
          {{ time === 0 ? '发送验证码' : `${time}秒后发送` }}
        </span>
      </div>
      <div v-if="errors.code" class="error">{{ errors.code }}</div>
    </div>
    <a href="javascript:;" class="submit" @click="login()">立即绑定</a>
  </Form>
</template>

<script>
import QC from 'qc'
import { onUnmounted, reactive, ref } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utlis/vee-validate-schema.js'
import { useIntervalFn } from '@vueuse/core'
import { userQQBindCode, userQQBindLogin } from '@/api/user'
import Message from '@/components/library/Message'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
  name: 'CallbackBind',
  components: { Form, Field },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    // 1. 准备下信息：unionId(openId) qq头像 昵称
    // 2. 完成表单校验
    // 3. 发送验证吗（校验，定义api，调用，完成倒计时）
    // 4. 进行绑定（绑定成功就是登录成功）

    // 获取名字
    const nickname = ref('null')
    // 获取图片图标
    const avatar = ref('null')
    // 如果登陆
    if (QC.Login.check()) {
      // 获取信息
      QC.api('get_user_info').success((res) => {
        avatar.value = res.data.figureurl_1
        nickname.value = res.data.nickname
      })
    }
    const formCom = ref(null)
    const form = reactive({
      mobile: null,
      code: null
    })
    const mySchema = {
      // 校验函数规则：返回true就是校验成功，返回一个字符串就是失败，字符串就是错误提示
      mobile: schema.mobile,
      code: schema.code
    }
    // pause 暂停 resume 开始
    // useIntervalFn(回调函数,执行间隔,是否立即开启)
    const time = ref(0)
    const { pause, resume } = useIntervalFn(
      () => {
        time.value--
        if (time.value <= 0) {
          pause()
        }
      },
      1000,
      false
    )
    onUnmounted(() => {
      pause()
    })

    // 发送验证码
    const send = async () => {
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        // 通过
        if (time.value === 0) {
          // 没有倒计时才可以发送
          await userQQBindCode(form.mobile)
          Message({ type: 'success', text: '发送成功' })
          time.value = 60
          resume()
        }
      } else {
        // 失败，使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
        formCom.value.setFieldError('mobile', valid)
      }
    }
    const store = useStore()
    const router = useRoute()
    const login = () => {
      const valid = formCom.value.validate()
      if (valid) {
        userQQBindLogin({ unionId: props.unionId, ...form })
          .then((data) => {
            // 实现和之前登录一样的逻辑
            // 1. 存储用户信息
            const { id, account, avatar, mobile, nickname, token } = data.result
            store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
            // 2. 跳转到来源页或者首页
            router.push(store.state.user.redirectUrl)
            // 3. 成功提示
            Message({ type: 'success', text: 'QQ绑定成功' })
          })
          .catch((e) => {
            Message({ type: 'error', text: '绑定失败' })
          })
      }
    }
    return { nickname, avatar, form, mySchema, send, time, login, formCom }
  }
}
</script>

<style scoped lang="less">
.user-info {
  width: 320px;
  height: 70px;
  margin: 0 auto;
  display: flex;
  background: #f2f2f2;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 25px;
  img {
    background: #f2f2f2;
    width: 50px;
    height: 50px;
  }
  p {
    padding-left: 10px;
  }
}
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
