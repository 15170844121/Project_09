<template>
  <div>
    <el-card style="margin:20px 0px ;">
      <CategorySelect :show="!isShowTable" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!categroy3Id" @click="addAttr">添加属性</el-button>
        <!-- 表格 展示平台属性 -->
        <el-table style="width:100%;" border :data="attrList">
          <el-table-column label="序号" type="index" width="80" align="center" />
          <el-table-column label="属性名称" prop="attrName" width="150" />
          <el-table-column label="属性值列表" prop="prop" width="width">
            <template slot-scope="{row}">
              <el-tag v-for="(attrValue) in row.attrValueList" :key="attrValue.id" type="success" style="margin:0px 20px;">{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="prop" width="150">
            <template slot-scope="{row}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)" />
              <el-button type="danger" icon="el-icon-delete" size="mini" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性 | 修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form ref="form" :inline="true" label-width="80" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input v-model="attrInfo.attrName" placeholder="请输入属性名" />
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowTable= true">取消</el-button>
        <el-table style="margin:20px 0px ;" border :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column label="属性值名称" width="width">
            <template slot-scope="{row,$index}">
              <el-input v-if="row.flag" :ref="$index" v-model="row.valueName" placeholder="请输入属性值名称" size="mini" @blur="toLook(row)" @keyup.native.enter="toLook(row)" />
              <span v-else style="display:block" @click="toEdit(row,$index)">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{row,$index}">
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`确定删除${row.value}?`" @onConfirm="deleteAttrValue($index)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="attrInfo.attrValueList.length < 1" @click="addOrUpdateAttr">保存</el-button>
        <el-button @click="isShowTable= true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入 loadsh 当中的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data() {
    return {
      // 接受平台属性的字段
      categroy1Id: '',
      categroy2Id: '',
      categroy3Id: '',
      attrList: [],
      // 这个属性控制 table 表格显示与隐藏
      isShowTable: true,
      // 收集新属性 | 修改属性
      attrInfo: {
        attrName: '', // 属性名
        // 属性值 因为属性值可以有多个 因此用数组 每一个属性值都是一个对象 需要 attrId valueName
        attrValueList: [],
        categoryId: 0, // 三级分类的 id
        categoryLevel: 0 // 因为服务器也需要区分 几级id
      }
    }
  },
  methods: {
    // 自定义事件的回调
    getCategoryId({ categroyId, level }) {
      // 区分三级分类相应的 id
      if (level === 1) {
        this.categroy1Id = categroyId
        this.categroy2Id = ''
        this.categroy3Id = ''
      } else if (level === 2) {
        this.categroy2Id = categroyId
        this.categroy3Id = ''
      } else {
        //  代表三级分类的 id 有了
        this.categroy3Id = categroyId
        // 发起请求获取数据
        this.AttrList()
      }
    },
    // 获取平台属性的数据
    async AttrList() {
      const { categroy1Id, categroy2Id, categroy3Id } = this
      const result = await this.$API.attr.reqAttrList(categroy1Id, categroy2Id, categroy3Id)
      if (result.code === 200) {
        this.attrList = result.data
      }
    },
    // 添加属性值回调
    addAttrValue() {
      //  向属性值的数组里面添加元素
      //  attrId 是相应属性的 id
      //  valueName 相应属性值的名称
      this.attrInfo.attrValueList.push({
        //  对于 修改某一个属性的时候 可以在已有的属性值基础之上 新增新的属性 （新增新的属性的时候 需要把已有的 id 传递过去）
        attrId: this.attrInfo.id,
        valueName: '',
        flag: true
      })
      // flag 属性 给每一个属性值添加一个标记 flag 用户切换查看模式与编辑模式 好处 每一个属性值可以控制自己的模式切换
      //  当前 flag 属性 响应式数据 （数据变化 试图跟着变化）
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    // 添加属性按钮的回调
    addAttr() {
      // 切换显示隐藏
      this.isShowTable = false
      // 清除数据
      this.attrInfo = {
        attrName: '', // 属性名
        // 属性值 因为属性值可以有多个 因此用数组 每一个属性值都是一个对象 需要 attrId valueName
        attrValueList: [],
        categoryId: this.categroy3Id, // 三级分类的 id
        categoryLevel: 3 // 因为服务器也需要区分 几级id
      }
    },
    // 修改某一个属性
    updateAttr(row) {
      this.isShowTable = false
      // 将选中属性值赋值给 attrInfo
      // 由于数据结构当中存在对象里面套数组 数组里卖弄有套对象 因此需要使用深拷贝结局这类问题
      this.attrInfo = cloneDeep(row)
      //  在修改摸一个属性的时候 将相应的属性值元素添加上 flag 这个表格
      this.attrInfo.attrValueList.forEach(item => {
        // item.flag = false  不能这样书写 因为这样书写 flag 不是响应式的数据
        //  向响应式对象中添加一个 property，并确保这个新 property 同样是响应式的，且触发视图更新。它必须用于向响应式对象上添加新 property
        // 因为 Vue 无法探测普通的新增 property
        //  第一个参数：对象  第二个参数：添加新的响应式属性  第三个参数 新的属性的属性值
        this.$set(item, 'flag', false)
      })
    },
    // 失去焦点的回调 切换为查看模式 展示 span
    toLook(row) {
      // row 形参是当前用户添加的最新的属性值
      //  如果属性值为空 不能作为新的属性种子 需要给用户提示 让他输入一个其他的值
      if (row.valueName.trim() === '') {
        this.$message('请你输入一个正常的属性值')
        return
      }
      // 新增的属性不能与已有的属性值重复
      const isRept = this.attrInfo.attrValueList.some(item => {
        // 需要将 row 从数组里面判断的时候去除
        //  row 最新新增的属性值 【数组的最后一项元素】
        //  判断的时候 需要把已有的数组当中新增的这个属性值去除
        if (row !== item) {
          return row.valueName === item.valueName
        }
      })
      if (isRept) return
      row.flag = false
    },
    //  点击 span 的回调 变为编辑模式
    toEdit(row, index) {
      row.flag = true
      //  获取 input 节点 实现自动聚焦
      // 需要注意 点击 span 切换为1input 变为编辑模式 但是需要注意 对于浏览器而言 页面重绘与重拍耗时间
      //  点击span 的时候 重绘 input 他是需耗费事件 因此我们不可能一点击 span 立马获取到 input
      // $nextClick  当节点渲染完毕了 会执行一次
      this.$nextTick(() => {
        // 获取相应的 input 表单元素 实现聚焦
        console.log(this.$refs[index].focus())
      })
    },
    // 气泡确认框按钮的回调
    deleteAttrValue(index) {
      // 当前删除属性值的操作是不需要发请求的
      // this.attrInfo.attrValueList.splice(index, 1)
    },
    async addOrUpdateAttr() {
      // 整理参数 如果用户添加很多属性值 且属性值为空的不应该提交给服务器
      // 提交给服务器数据当中不应该出现 flag 字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        //  过滤掉属性值不是空的
        if (item.valueName !== '') {
          // 删除 flag 属性
          delete item.flag
          return true
        }
      })
      try {
        // 发请求
        await this.$API.attr.reqAttrOrUpdateAttr(this.attrInfo)
        this.isShowTable = true
        this.$message({ type: 'success', message: '保存成功' })
        this.AttrList()
      } catch (error) {
        this.$message('请求失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
