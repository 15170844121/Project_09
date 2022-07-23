<template>
  <div>
    <el-card style="margin:20px 0px ;">
      <CategorySelect :show="scene != 0" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <div v-show="scene == 0">
        <!-- 展示 spu 列表的结构 -->
        <el-button type="primary" icon="rl-icon-plus" :disabled="!category3Id" @click="addSpu">添加spu</el-button>
        <el-table style="width:100%;" border :data="records">
          <el-table-column label="序号" type="index" width="80" align="center" />
          <el-table-column label="spu名称" prop="spuName" width="width" />
          <el-table-column label="spu描述" prop="description" width="width" />
          <el-table-column label="操作" prop="prop" width="width">
            <template slot-scope="{row}">
              <!-- 这里的按钮将来用 hintButton 替换 -->
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)" />
              <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)" />
              <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu所有类的实例" @click="handle(row)" />
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <hint-button slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除spu" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- @size-change="handleSizeChange"
          @current-change="handleCurrentChange" -->
        <el-pagination
          style="margin-top:20px; text-align:center;"
          :current-page="page"
          :total="total"
          :page-size="limit"
          :page-sizes="[3,5,10]"
          layout="prev,pager,next,jumper, ->,sizes,total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        />
      </div>
      <SpuForm v-show="scene == 1" ref="spu" @changeScene="changeScene" />
      <SkuForm v-show="scene == 2" ref="sku" @changeScenes="changeScenes" />
    </el-card>
    <el-dialog :title="`${spu.spuName}的sku的列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <el-table v-loading="loading" :data="skuList" style="width:100%" border>
        <el-table-column label="名称" prop="skuName" width="width" />
        <el-table-column label="价格" prop="price" width="width" />
        <el-table-column label="重量" prop="weight" width="width" />
        <el-table-column label="默认图片" prop="" width="width">
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" style="width:100px; height: 100px;">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
//  引入子组件
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
  name: 'Spu',
  components: {
    SpuForm,
    SkuForm
  },
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      page: 1, // 表示分页器当前第几页
      limit: 3, // 每一页需要展示多少数据
      total: 0, // 分页器一共需要展示数据的条数
      records: [], // spu 列表数据
      scene: 0, // 切换组件
      // 控制对话框的显示与隐藏
      dialogTableVisible: false,
      spu: {},
      // 储存 sku 列表的数据
      skuList: [],
      loading: true
    }
  },
  methods: {
    // 点击分页器 第几页按钮的回调
    // handleCurrentChange(page) {
    //   this.page = page
    //   this.getSpuList()
    // },
    //  三级联动的自定义事件 可以把子组件相应的 id 传给父组件
    getCategoryId({ categroyId, level }) {
      // categroyId： 获取到一 二 三级分类的 id level 为了区分是几级id
      if (level === 1) {
        this.category1Id = categroyId
        // 清除 2 3 级分类的 id
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categroyId
        // 清除 3 级 id
        this.category3Id = ''
      } else {
        this.category3Id = categroyId
        // 获取 spu 列表数据
        this.getSpuList()
      }
    },
    // 获取 spu 列表数据
    async getSpuList(pages = 1) {
      // 结构出相应的数据
      this.page = pages
      const { page, limit, category3Id } = this
      const result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      this.total = result.data.total
      this.records = result.data.records
    },
    // 当分页器某一页数据发生变化的时候
    handleSizeChange(limit) {
      this.limit = limit
      this.getSpuList()
    },
    // 添加 spu 按钮
    addSpu() {
      this.scene = 1
      // 通知子组件发请求
      this.$refs.spu.addSpuData(this.category3Id)
    },
    // 修改 某一个 Spu
    updateSpu(row) {
      this.scene = 1
      //  获取子组件 spuForm
      this.$refs.spu.initSpuData(row)
    },
    // 自定义事件的回调
    changeScene(data) {
      // flag 这个是区分是保存按钮还是添加
      this.scene = data.scene
      if (data.flag === '修改') {
        this.getSpuList(this.page)
      } else {
        this.getSpuList()
      }
      this.getSpuList()
    },
    // 删除 SPU 按钮的回调
    async deleteSpu(row) {
      const result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result.code === 200) {
        this.$message({ type: 'success', message: '删除成功' })
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
      }
    },
    // 添加 sku
    addSku(row) {
      // 切场景为 2
      this.scene = 2
      // 调用子组件获取数据的方法
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
    },
    // sku 通知父组件切换场景的回调
    changeScenes(scene) {
      this.scene = scene
    },
    // 查看Sku 按钮的回调
    async handle(spu) {
      this.spu = spu
      this.dialogTableVisible = true
      // 获取 sku 列表的数据进行展示
      const result = await this.$API.spu.reqSkuList(spu.id)
      if (result.code === 200) {
        this.skuList = result.data
        // loading 效果隐藏
        this.loading = false
      }
    },
    // 关闭对话框的回调
    close(done) {
      // loading 变为真
      this.loading = true
      // 清除 sky 列表的数据
      this.skuList = []
      // 关闭对话框
      done()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
