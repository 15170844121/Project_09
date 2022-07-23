<template>
  <!-- 容器 -->
  <div ref="charts" class="charts" />
</template>

<script>
// 引入 echarts
import * as echarts from 'echarts'
export default {
  name: '',
  data() {
    return {

    }
  },
  mounted() {
    // 初始化 echarts 实例
    const lineCharts = echarts.init(this.$refs.charts)
    // 配置数据
    lineCharts.setOption({
      xAxis: {
        // 隐藏 x 轴
        show: false,
        // 均分
        type: 'category'
      },
      yAxis: {
        // 隐藏 y 轴
        show: false
      },
      // 系列
      series: [
        {
          // 图标的形式
          type: 'bar',
          data: [10, 5, 14, 8, 9, 8, 10, 12, 9, 10, 15, 6]
        }
      ],
      // 布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
    })
  },
  methods: {

  }
}
</script>

<style scoped>
.charts{
  width: 100%;
  height: 100%;
}
</style>
