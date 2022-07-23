<template>
  <div>
    <div class="header">
      <span class="search-header">搜索用户</span>
      <svg t="1658279502437" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1332" width="22" height="22"><path d="M509.92 795.84c157.904 0 285.92-128.016 285.92-285.92C795.84 352 667.808 224 509.92 224 352 224 224 352 224 509.92c0 157.904 128 285.92 285.92 285.92z m0 48C325.504 843.84 176 694.32 176 509.92 176 325.504 325.504 176 509.92 176c184.416 0 333.92 149.504 333.92 333.92 0 184.416-149.504 333.92-333.92 333.92z m-2.448-400.704h16a16 16 0 0 1 16 16v201.728a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V459.136a16 16 0 0 1 16-16z m0-100.176h16a16 16 0 0 1 16 16v23.648a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16v-23.648a16 16 0 0 1 16-16z" p-id="1333" fill="#bfbfbf" /></svg>
    </div>
    <div class="main">
      <span class="main-title">12321</span>
      <span class="main-content">17.1</span>
      <svg t="1658280651948" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3447" width="16" height="16"><path d="M529.143158 7.436293l347.212925 397.874796a21.748783 21.748783 0 0 1-16.375554 36.077393h-170.66398a21.492915 21.492915 0 0 0-21.492915 18.678367c-12.793402 92.624229-90.065549 502.268955-455.95684 562.909679a21.748783 21.748783 0 0 1-17.654895-38.380206c62.687669-49.126663 144.56544-144.309572 167.593564-313.694212a1571.285609 1571.285609 0 0 0 12.793402-207.508977 22.260519 22.260519 0 0 0-21.748783-22.260519H165.298811a21.748783 21.748783 0 0 1-16.375554-36.077393L496.39205 7.436293a21.748783 21.748783 0 0 1 32.751108 0z" p-id="3448" fill="#1afa29" /></svg>
      <svg t="1658280689673" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4600" width="16" height="16"><path d="M507.649902 1015.81158L160.153845 618.161453a21.75049 21.75049 0 0 1 16.376839-36.080224h187.565987a22.262266 22.262266 0 0 0 21.750489-22.262266 1630.774944 1630.774944 0 0 0-12.538517-207.525259C350.022825 182.895773 268.138628 87.705395 204.934264 38.574877A21.75049 21.75049 0 0 1 223.102321 0.447548C588.766434 60.837143 665.532868 470.514012 679.350826 563.401397a21.238713 21.238713 0 0 0 21.494601 18.679832h170.677372a21.75049 21.75049 0 0 1 16.120951 36.080224L540.403581 1015.81158a21.75049 21.75049 0 0 1-32.753679 0z" p-id="4601" fill="#d81e06" /></svg>
    </div>
    <div class="footer">
      <div ref="charts" class="charts" />
    </div>
  </div>
</template>

<script>
// 引入 echarts
import * as echarts from 'echarts'
export default {
  name: 'LineCharts',

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
          data: [4, 2, 6, 5, 5.5, 3, 7],
          // 拐点的样式的设置
          itemStyle: {
            opacity: 0
          },
          // 线条的样式
          lineStyle: '#4699FF',
          // 填充颜色
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#4699FF' // 0% 处的颜色
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

<style  scoped>
.header{
  display: flex;
  align-items: center;
}
.search-header{
  margin-right: 20px;
}
.main{
  margin: 10px 0px;
}
.main-title{
  margin-right: 30px;
  font-size: 28px;
}
.main-content{
  margin-right: 10px;
}
.charts{
  width: 100%;
  height: 50px;
}
</style>
