<template>
  <div>
    <!--  inline 代表的是行内表单  代表一行上可放多个表单元素 -->
    <el-form :inline="true" class="demo-form-inline" :mode="cForm">
      <el-form-item label="一级分类">
        <el-select v-model="cForm.category1Id" placeholder="请选择" :disabled="show" @change="handle1">
          <el-option v-for="(c1) in list1" :key="c1.id" :label="c1.name" :value="c1.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="cForm.category2Id" placeholder="请选择" :disabled="show" @change="handle2">
          <el-option v-for="(c2) in list2" :key="c2.id" :label="c2.name" :value="c2.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="cForm.category3Id" placeholder="请选择" :disabled="show" @change="handle3">
          <el-option v-for="(c3) in list3" :key="c3.id" :label="c3.name" :value="c3.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: ['show'],
  data() {
    return {
      //  存储一级分类的数据
      list1: [],
      //  存储二级分类的数据
      list2: [],
      //  存储三级分类的数据
      list3: [],
      // 分别收集 一级 二级 三级 分类的 id
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  //  组件挂载完毕 向服务器请求一级分类的数据
  mounted() {
    this.getCategory1List()
  },

  methods: {
    async getCategory1List() {
      const result = await this.$API.attr.reqCategory1List()
      // console.log(result)
      if (result.code === 200) {
        this.list1 = result.data
      }
    },
    //  一级分类的 select 事件回调 （当一级分类的 option 发生变化的时候 获取相应的二级分类的数据）
    async handle1() {
      // 清除数据
      this.list2 = []
      this.list3 = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      this.$emit('getCategoryId', { categroyId: this.cForm.category1Id, level: 1 })
      const result = await this.$API.attr.reqCategory2List(this.cForm.category1Id)
      if (result.code === 200) {
        this.list2 = result.data
      }
    },
    //  一级分类的 select 事件回调 （当二级分类的 option 发生变化的时候 获取相应的三级分类的数据）
    async handle2() {
      this.list3 = []
      this.cForm.category3Id = ''
      this.$emit('getCategoryId', { categroyId: this.cForm.category2Id, level: 2 })
      const result = await this.$API.attr.reqCategory3List(this.cForm.category2Id)
      if (result.code === 200) {
        this.list3 = result.data
      }
    },
    handle3() {
      this.$emit('getCategoryId', { categroyId: this.cForm.category3Id, level: 3 })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
