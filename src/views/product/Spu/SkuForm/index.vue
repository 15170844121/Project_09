<template>
  <div>
    <el-form>
      <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
      <el-form-item label="SKU的名称">
        <el-input v-model="skuInfo.skuName" placeholder="SKU名称" />
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="skuInfo.price" placeholder="价格(元素)" type="number" />
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="重量(千克)" />
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input v-model="skuInfo.skuDesc" type="textarea" placeholder="规格描述" rows="4" />
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item v-for="(attr) in attrInfoList" :key="attr.id" :label="attr.attrName">
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
              <el-option v-for="(attrValue) in attr.attrValueList" :key="attrValue.id" :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item v-for="(saleAttr) in spuSaleAttrList" :key="saleAttr.id" :label="saleAttr.saleAttrName">
            <el-select v-model="saleAttr.attrIdAndValueId" placeholder="请选择" value="">
              <el-option v-for="(saleAttrValue) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id" :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table style="width:100%" border :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column prop="prop" width="80" type="selection" />
          <el-table-column label="图片" prop="prop" width="width">
            <template slot-scope="{row}">
              <img :src="row.imgUrl" style="width:100px;height:100px">
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName" width="width" />
          <el-table-column label="操作" prop="prop" width="width">
            <template slot-scope="{row}">
              <el-button v-if="row.isDefault == 0" type="primary" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',

  data() {
    return {
      // 存储图片的信息
      spuImageList: [],
      // 存储销售属性
      spuSaleAttrList: [],
      // 存储平台属性的数据
      attrInfoList: [],
      // 收集 sku 数据的字段
      skuInfo: {
        // 第一类收集的数据 父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 第二类数据 需要通过数据绑定收集
        price: 0,
        skuName: '',
        weight: '',
        skuDesc: '',
        // 第三类 需要自己书写代码的数据
        // 默认图片
        skuDefaultImg: '',
        // 收集图片的字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: 'string',
          //   imgUrl: 'string',
          //   isDefault: 'string',
          //   skuId: 0,
          //   spuImgId: 0
          // }
        ],
        // 收集平台属性
        skuAttrValueList: [
          {
            // attrId: 0,
            // valueId: 0
          }
        ],
        // 收集销售属性
        skuSaleAttrValueList: [
          // {
          //   'id': 0,
          //   'saleAttrId': 0,
          //   'saleAttrName': 'string',
          //   'saleAttrValueId': 0,
          //   'saleAttrValueName': 'string',
          //   'skuId': 0,
          //   'spuId': 0
          // }
        ]
      },
      spu: {},
      // 收集图片数据的字段 注目前收集的数据缺少 isDefault 不能作为发起请求的数据
      imageList: []
    }
  },

  mounted() {

  },

  methods: {
    // 获取 SkuForm数据
    async getData(category1Id, category2Id, spu) {
      this.spu = spu
      // 收集父组件给予的数据
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      // 获取图片的数据
      const result = await this.$API.spu.reqSpuImageLis(spu.id)
      if (result.code === 200) {
        const list = result.data
        list.forEach(item => {
          item.isDefault = 0
        })
        this.spuImageList = list
      }
      // 获取销售属性的数据
      const result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id)
      if (result1.code === 200) {
        this.spuSaleAttrList = result1.data
      }
      // 获取平台属性的数据
      const result2 = await this.$API.spu.reqAttrInfoList(category1Id, category2Id, spu.category3Id)
      if (result2.code === 200) {
        this.attrInfoList = result2.data
      }
    },
    // table 表格复选框的事件
    handleSelectionChange(params) {
      this.imageList = params
    },
    // 排他回调
    changeDefault(row) {
      this.spuImageList.forEach(item => {
        item.isDefault = 0
      })
      row.isDefault = 1
      // 收集图片默认的地址
      this.skuDefaultImg = row.imgUrl
    },
    // 取消按钮的回调
    cancel() {
      this.$emit('changeScenes', 0)
      // 清除数据
      //  Object.assign(this._data, this.$options.data()) 是 es6 新增加的语法 用于清除所有数据
      Object.assign(this._data, this.$options.data())
    },
    // 保存按钮的回调
    async save() {
      // 整理参数
      // 整理平台属性
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this
      // 新建数组  方案一
      const arr = []
      attrInfoList.forEach(item => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':')
          // 携带给服务器的参数应该是对象
          const obj = { attrId, valueId }
          arr.push(obj)
        }
      })
      skuInfo.skuAttrValueList = arr
      // 整理销售属性 方案二
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((preve, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':')
          preve.push({ saleAttrId, saleAttrValueId })
        }
        return preve
      }, [])
      console.log(skuInfo.skuSaleAttrValueList)
      // 整理图片的数据
      skuInfo.skuImageList = imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })
      console.log(skuInfo)
      // 发起请求  接口无用 不发起请求
      // const result = await this.$API.spu.reqAddSku(skuInfo)
      this.$message({ type: 'success', message: '添加信息成功' })
      this.$emit('changeScenes', 0)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
