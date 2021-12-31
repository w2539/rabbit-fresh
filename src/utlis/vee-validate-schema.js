export default {
  // 用户名校验
  account (value) {
    if (!value) return '请输入用户名'
    // 规则：字母开头6-20字符之间
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20个字符'
    return true
  },
  password (value) {
    if (!value) return '请输入密码'
    if (!/^\w{6,16}$/.test(value)) return '6到16位字符串'
    return true
  },
  mobile (value) {
    if (!value) return '请输入手机号'
    if (!/^1[1-9]\d{9}$/.test(value)) return '手机号格式错误'
    return true
  },
  code (value) {
    if (!value) return '请输入验证码'
    if (!/^\d{6}$/.test(value)) return '短信验证码6个数字'
    return true
  },
  isAgree (value) {
    if (!value) return '请勾选用户协议'
    return true
  }
}
