<template>
  <el-card>
    <div slot="header" class="header">
      <div class="search-header">
        <span>线上热门搜索</span>

        <el-dropdown>
          <span>
            <i class="el-icon-more" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="12">
          <lineCharts />
        </el-col>
        <el-col :span="12">
          <lineCharts />
        </el-col>
      </el-row>
    </div>
    <!-- table 表格 -->
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column label="排名" width="180" />
      <el-table-column label="搜索关键字" width="180" />
      <el-table-column label="用户数" sortable :formatter="formatter" />
      <el-table-column label="周涨幅" sortable :formatter="formatter" />
    </el-table>
    <!-- 分页器 -->
    <el-pagination layout="prev, pager, next" :total="100" class="pagination" />
  </el-card>
</template>

<script>
import lineCharts from './lineCharts'
export default {
  name: 'Search',
  components: {
    lineCharts
  },

  data() {
    return {
      tableData: [{}]
    }
  },

  mounted() {

  },

  methods: {

  }
}
</script>

<style scoped>
.header{
  border-bottom: 1px solid #eee;
  padding: 10px 0px;
}
.search-header{
  display: flex;
  justify-content: space-between;
}
.pagination{
  float: right;
}
</style>
