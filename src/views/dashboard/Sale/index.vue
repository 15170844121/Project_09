<template>
  <el-card class="box-card" style="margin:10px 0px ;">
    <div slot="header" class="clearfix">
      <!-- v-model="activeName" @tab-click="handleClick" -->
      <!-- 头部左侧内容 -->
      <el-tabs v-model="activeName" class="tab">
        <el-tab-pane label="销售额" name="sale" />
        <el-tab-pane label="访问量" name="visite" />
      </el-tabs>
      <!-- 头部右侧内容 -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <!-- v-model="value1" -->
        <el-date-picker
          v-model="date"
          class="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          value-format="yyyy-MM-d"
        />
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <div ref="charts" class="charts" />
        </el-col>
        <el-col :span="6">
          <h3>门店{{ title }}排名</h3>
          <ul>
            <li>
              <span class="rindex">1</span>
              <span class="rtext">肯德基</span>
              <span class="rvalue">323,234</span>
            </li>
            <li>
              <span class="rindex">2</span>
              <span class="rtext">麦当劳</span>
              <span class="rvalue">299,123</span>
            </li>
            <li>
              <span class="rindex">3</span>
              <span class="rtext">肯德基</span>
              <span class="rvalue">283,998</span>
            </li>
            <li>
              <span class="rtitle">4</span>
              <span class="rtext">海底捞</span>
              <span class="rvalue">266,223</span>
            </li>
            <li>
              <span class="rtitle">5</span>
              <span class="rtext">西贝筱面村</span>
              <span class="rvalue">223,445</span>
            </li>
            <li>
              <span class="rtitle">6</span>
              <span class="rtext">汉堡王</span>
              <span class="rvalue">219,663</span>
            </li>
            <li>
              <span class="rtitle">7</span>
              <span class="rtext">真功夫</span>
              <span class="rvalue">200,997</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
// 引入 echarts
import * as echarts from 'echarts'
import * as dayjs from 'dayjs'
import { mapState } from 'vuex'
export default {
  name: 'Sale',

  data() {
    return {
      activeName: 'sale',
      mycharts: null,
      // 收集日历的数据
      date: []
    }
  },
  computed: {
    // 计算属性- 标题
    title() {
      return this.activeName === 'sale' ? '销售额' : '访问量'
    },
    ...mapState({
      listState: state => state.home.list
    })
  },
  // 监听属性
  watch: {
    title() {
      this.mycharts.setOption({
        title: {
          text: this.title + '趋势'
        },
        xAxis: {
          data: this.title === '销售额' ? ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'] : ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        },
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: this.title === '销售额' ? [10, 50, 80, 20, 60, 40, 90, 60, 30, 40, 50, 60] : [50, 30, 20, 60, 50, 40, 80, 90, 70, 50, 40, 80],
            color: '#A6C9FF'
          }
        ]
      })
    },
    // 数据回来监听
    listState() {
      this.mycharts.setOption({
        title: {
          text: '销售额趋势'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.listState.orderFullYearAxis,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: this.listState.orderFullYear,
            color: '#A6C9FF'
          }
        ]
      })
    }
  },

  mounted() {
    // 初始化 echarts 实例
    this.mycharts = echarts.init(this.$refs.charts)
    this.mycharts.setOption({
      title: {
        text: '销售额趋势'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: [10, 50, 80, 20, 60, 40, 90, 60, 30, 40, 50, 60],
          color: '#A6C9FF'
        }
      ]
    })
  },
  methods: {
    // 本天
    setDay() {
      const day = dayjs().format('YYYY-MM-DD')
      this.date = [day, day]
    },
    setWeek() {
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [start, end]
    },
    setMonth() {
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [start, end]
    },
    setYear() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.date = [start, end]
    }
  }
}
</script>

<style scoped>
.clearfix{
  display: flex;
  justify-content: space-between;
  position: relative;
}
.tab{
  width: 100%;
}
.right{
  position: absolute;
  right: 0px;
}
.date{
  width: 220px;
  margin: 0px 20px ;
}
.right span{
  margin: 0px 10px;
}
.charts{
  width: 100%;
  height: 400px;
}
ul{
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0px;
}
ul li{
  height: 8%;
  margin: 10px 0;
}
.rindex{
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: black;
  color: white;
  text-align: center;
  line-height: 20px;
}
.rtext{
  float: left;
  padding: 0 20px;
}
.rvalue{
  float: right;
}
.rtitle{
  float: left;
  margin-left: 6px;
  margin-right:10px ;
}
</style>
