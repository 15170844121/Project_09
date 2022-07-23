import request from '@/utils/request.js'

//  获取 spu 列表数据的接口
//  /admin/product/{page}/{limit} get   page  limit cetegory3Id
export const reqSpuList = (page, limit, category3Id) => request({
  url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id }
})

//  获取某一个 spu 信息
// /admin/product/getSpuById/{spuId}  get  spuId
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })

// 获取品牌的信息
//   /admin/product/baseTrademark/getTrademarkList   get
export const reqTardeMarkList = () => request({ url: `/admin/product/baseTrademark/getTrademarkList`, method: 'get' })

// 获取 spu 图片
//  /admin/product/spuImageList/{spuId}   get spuId
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

//  获取平台全部的销售属性  一共三个
//  /admin/product/baseSaleAttrList  get
export const reqBaseSaleAttrList = () => request({ url: `/admin/product/baseSaleAttrList`, method: 'get' })

// 修改 SPU || 添加 SPU 对于修改或者提娜佳 携带给服务器的参数大致一样的 唯一的区别就是携带的参数是否戴 id
export const reqAddOrUpdateSpu = (spuInfo) => {
  // 携带的参数有id
  if (spuInfo.id) {
    return request({ url: '/admin/product/updateSpuInfo', method: 'post', data: spuInfo })
  } else {
    // 携带不带有参数的id
    return request({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo })
  }
}

// 删除 SPU
//   /admin/product/deleteSpu/{spuId}   delete
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })

// 获取图片的数据
//  /admin/product/spuImageList/{spuId}
export const reqSpuImageLis = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 获取销售属性的数据
//  /admin/product/spuSaleAttrList/{spuId}
export const reqSpuSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })

// 获取平台属性的数据
//  /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}   get
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

// 添加 sku
//   /admin/product/saveSkuInfo post
export const reqAddSku = (skuInfo) => request({ url: '/admin/product/saveSkuInfo', method: 'post', data: skuInfo })

// 获取 sku 数据列表的接口
//  /admin/product/findBySpuId/{spuId}  get
export const reqSkuList = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' })

