//  这个模块主要的获取的是 品牌管理的数据列表
import request from '@/utils/request'
// 获取品牌列表接口
// /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

//  处理添加品牌
//  新增品牌 /admin/product/baseTrademark/save  post 携带两个参数 品牌名称 品牌logo
//  切记 对于新增的品牌 给服务器传递数据 不需要传递 ID ID是由服务器生成

// 修改品牌的
// 修改品牌  /admin/product/baseTrademark/update put 携带三个参数 id 品牌名称 品牌logo
// 切记 对于修改某一个品牌的操作 前端携带的参数需要带上 ID 你需要告诉服务器修改的是哪一个品牌

export const reqAddOrUpdateTradeMake = (tradeMake) => {
  //  带个服务器数据携带 ID ---修改
  if (tradeMake.id) {
    return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: tradeMake })
  } else {
    return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMake })
  }
}

//  删除品牌
// /admin/product/baseTrademark/remove/{id}  delete
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })
