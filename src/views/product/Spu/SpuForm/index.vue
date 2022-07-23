<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称 ">
        <el-input v-model="spu.spuName" placeholder="SPU名称" />
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option v-for="(tm) in tradeMarkList" :key="tm.id" :label="tm.tmName" value="tm.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input v-model="spu.description" type="textarea" placeholder="SPU描述" rows="4" />
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片: action 图片上传的地址  list-type: 文件列表的类型 on-preview: 图片预览的时候会触发 on-remove:当删除图片的时候会触发
      file-list 照片墙需要展示的数据 数组：师叔祖里面的元素务必要有name url 属性
      on-preview 图片的预览功能
      on-remove 删除图片的时候触发
      :on-success 用户成功上传时候触发的函数
      -->
        <el-upload action="/dev-api/admin/product/fileUpload" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-success="handleSuccess" :on-remove="handleRemove" :file-list="spuImageList">
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="attrIDAndAttrName" value="" :placeholder="`还有${unSelectSaleAttr.length}未选择`" style="margin: 0px 3px 3px 0px;">
          <el-option v-for="(unselect) in unSelectSaleAttr" :key="unselect.id" :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" />
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIDAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
        <el-table style="width:100%;" border :data="spu.spuSaleAttrList">
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column label="属性名" width="width" prop="saleAttrName" />
          <el-table-column label="属性名称列表" width="width" prop="prop">
            <template slot-scope="{row}">
              <!-- @close="handleClose(tag)" -->
              <el-tag v-for="(tag,index) in row.spuSaleAttrValueList" :key="tag.id" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index,1)"> {{ tag.saleAttrValueName }} </el-tag>
              <!-- @keyup.enter.native="handleInputConfirm"  @blur="handleInputConfirm" -->
              <el-input v-if="row.inputVisible" ref="saveTagInput" v-model="row.inputValue" class="input-new-tag" size="small" @blur="handleInputConfirm(row)" />
              <!-- @click="showInput"  -->
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width" prop="prop">
            <template slot-scope="{$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',

  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      // 存储 SPU 信息属性
      spu: {
        // 三级分类的 ID
        category3Id: 0,
        // 描述
        description: '',
        // Spu 的名称
        spuName: '',
        // 品牌的 ID
        tmID: '',
        // 收集图片的信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: 'string',
          //   imgUrl: 'string',
          //   spuId: 0
          // }
        ],
        // 平台属性与属性值的收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: 'string',
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: 'string',
          //       saleAttrName: 'string',
          //       saleAttrValueName: 'string',
          //       spuId: 0
          //     }
          //   ]
          // }
        ]
      },
      // 储存品牌信息
      tradeMarkList: [],
      // 存储 SPU 图片的数据
      spuImageList: [],
      // 销售属性的数据
      saleAttrList: [],
      // 收集未选择的销售属性的id
      attrIDAndAttrName: ''
    }
  },
  computed: {
    // 计算出还未选择的销售属性
    unSelectSaleAttr() {
      // 整个平台的销售属性一共三个：尺寸、颜色、版本 ----saleAttrList
      // 当前SPU拥有的属于自己的销售属性SPU.spuSaleAttrList  ----颜色
      // 数组的过滤方法，可以从已有的数组当中过滤出用户需要的元素，并未返回一个新的数据
      const result = this.saleAttrList.filter((item) => {
        // every数组的方法，会返回一个布尔值【真，假的】
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name !== item1.saleAttrName
        })
      })
      return result
    }
  },
  // 数据挂载完毕之后
  mounted() {

  },

  methods: {
    // 照片墙删除某一个图片的时候会触发
    handleRemove(file, fileList) {
      // file参数：代表的是删除的那张图
      //  fileList参数:代表的是剩余的图片
      // console.log(file, fileList)
      // 收集照片墙图片的数据
      this.spuImageList = fileList
    },
    // 照片墙图片预览的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 照片墙图片成功上传时候的回调
    handleSuccess(response, file, fileList) {
      console.log(fileList)
      this.spuImageList = fileList
    },
    // 初始化 SpuForm 方法
    async initSpuData(spu) {
      // 获取 SPU 信息的数据
      const spuResult = await this.$API.spu.reqSpu(spu.id)
      if (spuResult.code === 200) {
        this.spu = spuResult.data
      }
      //  获取品牌的信息
      const tradeMarkReault = await this.$API.spu.reqTardeMarkList()
      this.tradeMarkList = tradeMarkReault.data
      // 获取图片的数据
      const spuImageResult = await this.$API.spu.reqSpuImageList(spu.id)
      const listArr = spuImageResult.data
      //  由于照片墙显示图片的数据需要数组 数组里面的元素需要有 name 与 url 字段
      //  需要把服务器返回的数据进行修改
      listArr.forEach(item => {
        item.name = item.imgName
        item.url = item.imgUrl
      })
      // 把整理好的数据赋值给
      this.spuImageList = listArr
      // 获取平台全部的销售属性
      const saleReault = await this.$API.spu.reqBaseSaleAttrList()
      this.saleAttrList = saleReault.data
    },
    // 添加新的销售属性
    addSaleAttr() {
      // 把收集到的销售属性数据进行分割
      const [baseSaleAttrId, saleAttrName] = this.attrIDAndAttrName.split(':')
      //  向 SPU 对象的 spuSaleAttrList 属性里面添加新的销售属性
      const newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] }
      // 添加新的销售属性
      this.spu.spuSaleAttrList.push(newSaleAttr)
      // 清空数据
      this.attrIDAndAttrName = ''
    },
    // 添加按钮的回调
    addSaleAttrValue(row) {
      // 点击销售属性值当中添加按钮的时候 需要有 button 变为 input 通过当前销售属性的 inputVisible 控制
      // $set 把这个数据变为响应式数据
      // 挂载在销售属性身上的响应式数据 inputVisible 控制 button 与  input 切换
      this.$set(row, 'inputVisible', true)
      // 通过响应式数据 inputValue 字段 收集新增的销售属性值
      this.$set(row, 'inputValue', '')
    },
    //  el-input 失去焦点的事件
    handleInputConfirm(row) {
      // 解构出销售属性值
      const { baseSaleAttrId, inputValue } = row
      // 新增的销售属性值的名称不能为空
      if (inputValue.trim() === '') {
        // this.$message('属性值不能为空')
        return
      }
      // 新增的属性值不能重复
      const result = row.spuSaleAttrValueList.every(item => item.saleAttrValueName !== inputValue)
      if (!result) return
      // 新增的销售属性值
      const newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue }
      // 新增
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      row.inputVisible = false
    },
    // 保存按钮的回调
    async addOrUpdateSpu() {
      // 整理参数 需要整理的是照片墙的数据
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imageName: item.name,
          imageUrl: (item.response && item.response.data) || item.url
        }
      })
      // 发请求
      const result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      console.log(result)
      // 提示
      if (result.code === 200) {
        this.$message({ type: 'success', message: '保存成功' })
        // 通知父组件回到场景
        this.$emit('changeScene', { scene: 0, flag: this.spu.id ? '修改' : '添加' })
      }
      // 清除数据
      Object.assign(this._data, this.$options.data())
    },
    // 点击添加 SPU 按钮的时候 发请求的函数
    async addSpuData(category3Id) {
      // 添加 SPU 的时候收集三级分类的 id
      this.spu.category3Id = category3Id
      const tradeMarkReault = await this.$API.spu.reqTardeMarkList()
      this.tradeMarkList = tradeMarkReault.data
      // 获取平台全部的销售属性
      const saleReault = await this.$API.spu.reqBaseSaleAttrList()
      this.saleAttrList = saleReault.data
    },
    // 点击取消按钮
    cancel() {
      this.$emit('changeScene', { scene: 0, flag: '' })
      // 清理数据
      Object.assign(this._data, this.$options.data())
    }
  }
}
</script>

<style>
 .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
