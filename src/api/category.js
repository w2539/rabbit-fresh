// 定义首页需要的接口函数
import request from '@/utlis/request.js'

/**
 * 获取首页头部分类数据
 */
// 调用封装的 axios 接口
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}
