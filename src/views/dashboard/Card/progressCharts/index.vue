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
        min: 0,
        max: 100
      },
      yAxis: {
        // 隐藏 y 轴
        show: false,
        // 均分
        type: 'category'
      },
      // 系列
      series: [
        {
          // 图标的形式
          type: 'bar',
          data: [78],
          color: 'yellowgreen',
          // 柱状体宽度的设置
          barWidth: 10,
          // 背景颜色的设置
          showBackground: true,
          // 设置背景的颜色
          backgroundStyle: {
            color: '#eee'
          },
          // 文本标签
          label: {
            show: true,
            // 改变文本标签的内容
            formatter: '|',
            // 文本标签位置调试
            position: 'right'
          }
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
