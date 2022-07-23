<template>
  <div>
    <el-table style="width:100%;" border :data="records">
      <el-table-column label="序号" type="index" width="80" prop="prop" />
      <el-table-column label="名称" width="width" prop="skuName" />
      <el-table-column label="描述" width="width" prop="skuDesc" />
      <el-table-column label="默认图片" width="110" prop="prop">
        <template slot-scope="{row}">
          <img :src="row.skuDefaultImg" alt="" style="width:80px;height:80px;">
        </template>
      </el-table-column>
      <el-table-column label="重量" width="80" prop="weight" />
      <el-table-column label="价格" width="80" prop="price" />
      <el-table-column label="操作" width="width" prop="prop">
        <template slot-scope="{row}">
          <el-button v-if="row.isSale==0" type="success" icon="el-icon-bottom" size="mini" @click="sale(row)" />
          <el-button v-else type="info" icon="el-icon-top" size="mini" @click="cancel(row)" />
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit" />
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)" />
          <el-button type="danger" icon="el-icon-delete" size="mini" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器  @size-change="handleSizeChange":每一页条数发生变化的时候触发  @current-change="handleCurrentChange"：点击某一页触发  -->
    <el-pagination
      style="text-align: center;"
      :current-page="page"
      :page-sizes="[3,5,10]"
      :page-size="limit"
      layout=" prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getSkuList"
      @size-change="handleSizeChange"
    />
    <!-- 抽屉效果 -->
    <el-drawer :visible.sync="show" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag v-for="(attr) in skuInfo.skuAttrValueList" :key="attr.id" type="success">{{ attr.attrId }}-{{ attr.valueId }}</el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  // 组件挂载完毕后触发
  data() {
    return {
      // 代表当前第几页
      page: 1,
      // 代表当前页有几条数据
      limit: 10,
      // 存储 SKU 列表的数据
      records: [],
      // 存储分页器一共展示的数据
      total: 0,
      // 存储 sku 信息
      skuInfo: {},
      // 控制抽屉的显示与隐藏
      show: false
    }
  },
  mounted() {
    // 获取 SKu 列表的方法
    this.getSkuList()
  },
  methods: {
    async getSkuList(pages = 1) {
      this.page = pages
      // 解构出默认的参数
      const { page, limit } = this
      const result = await this.$API.sku.reqSkuList(page, limit)
      if (result.code === 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    handleSizeChange(limit) {
      // 修改参数
      this.limit = limit
      this.getSkuList()
    },
    // 上架
    async sale(row) {
      const result = await this.$API.sku.reqSale(row.id)
      if (result.code === 200) {
        row.isSale = 1
        this.$message({ type: 'success', message: '上架成功' })
      }
    },
    // 下架
    async cancel(row) {
      const result = await this.$API.sku.reqCancel(row.id)
      if (result.code === 200) {
        row.isSale = 0
        this.$message({ type: 'success', message: '下架成功' })
      }
    },
    edit() {
      this.$message('正在开发中')
    },
    // 获取 SKU 详情的方法
    async getSkuInfo(sku) {
      // 展示抽屉
      this.show = true
      const result = await this.$API.sku.reqSkuById(sku.id)
      if (result.code === 200) {
        this.skuInfo = result.data
      }
    }
  }
}
</script>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }
  .el-carousel{
    height: 500px;
    width: 100%;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #FFFFFF;
  }

  .el-carousel__item:nth-child(2n+1) {
     background-color: #FFFFFF;
  }
  .el-carousel__item img{
    width: 100%;
    height: 100%;
  }

</style>

<!--
  深度选择器
  >>> 原生CSS
  /deep/   less
  ::v-deep  Scss

 -->

<style scoped>
 .el-row .el-col-5{
   font-size: 20px;
   font-weight: 800;
   text-align: right;
}
.el-col{
  margin: 10px 10px;
}
/* 深度选择器 */
>>>.el-carousel__button{
    width: 10px;
    height: 10px;
    background: red;
    border-radius: 50%;
  }
</style>
