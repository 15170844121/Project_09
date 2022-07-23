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
        type: 'category'
      },
      yAxis: {
        // 隐藏 y 轴
        show: false
      },
      // 系列
      series: [
        {
          type: 'line',
          data: [10, 5, 14, 8, 9, 8, 10, 12, 9, 10],
          // 拐点的样式的设置
          itemStyle: {
            opacity: 0
          },
          // 线条的样式
          lineStyle: '#c896c8',
          // 填充颜色
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#c896c8' // 0% 处的颜色
              }, {
                offset: 1, color: '#fff' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          },
          // 弧度设置
          smooth: true
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
