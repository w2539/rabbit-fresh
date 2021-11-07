// 首页的接口数据
import request from '@/utlis/request'
/*
  作用：获取品牌
  @pram {Interger:类型整形 } limit 品牌个数
  @returns:返回类型 Promise
 */
export const findBrand = (limit = 6) => {
  return request('/home/brand', 'get', { limit })
}
// 轮播图
export const findBanner = () => {
  return request('/home/banner', 'get')
}
// 新鲜好物
export const findNew = () => {
  return request('home/new', 'get')
}

// 人气推荐
export const findHot = () => {
  return request('home/hot', 'get')
}
