<template>
<div>
    <!-- <vue-canvas-poster 
        :widthPixels="1000"  
        @success="success" 
        :painting="painting"
        :background="background"
        :width="width"
        :heigth="heigth"
        @fail="fail"
    >
    </vue-canvas-poster> -->
    <div ref="imageWrapper">
      <div class="success">
        <div class="img">
          <!-- <img class="img-icon" src="./assets/logo.png"/> -->
          <p style="font-weight: 600; font-size: 18px">支付成功</p>
        </div>
      </div>
      <div class="success-detail">
        <el-row style="margin-top: 10px;">
          <el-col :span="5" class="col-left-suc">收款商家</el-col>
          <el-col :span="16" class="col-right">{{merchant}}</el-col>
        </el-row>
        <el-row style="margin-top: 10px;">
          <el-col :span="5" class="col-left-suc">费用名称</el-col>
          <el-col :span="16" class="col-right">{{contName}}</el-col>
        </el-row>
        <el-row style="margin-top: 10px;">
          <el-col :span="5" class="col-left-suc">缴费金额</el-col>
          <el-col :span="16" class="col-right">{{chargePrice}}元</el-col>
        </el-row>
      </div>
    </div>
    <div class="button">
      <el-button style="width: 70%;" type="success" size="small" @click="toImage">生成截图</el-button>
    </div>
    <div ref="chart_one" id="main" style="width: 600px;height:400px;">

    </div>
</div>
</template>

<script>
// import { vueCanvasPoster } from 'vue-canvas-poster'
import html2canvas from 'html2canvas'
import echarts from 'echarts'

export default {
    // components: {
    //     vueCanvasPoster
    // },
    data() {
        return {
            width: '550px',
            height: '876px',
            background: '#f4f5f7',
            views: [
                {
                    type: 'text',
                    text: '乖摸摸头的小店,我设置了maxLines为1',
                    css: {
                        top: '48px',
                        left: '136px',
                        width: '360px',
                        maxLines: 1,
                        fontSize: '26px',
                    },
                },
                {
                    type: 'rect',
                    css: {
                        top: '120px',
                        left: '12px',
                        color: '#fff',
                        width: '526px',
                        height: '540px',
                        borderRadius: '10px',
                    },
                }
            ],
            merchant:  '王依民',
            contName: '小费',
            chargePrice: 100
        }
    },
    mounted() {
      this.meChart()
    },
    methods: {
        success(src) {
            this.src = src
        },
        fail(err) {
            console.log('fail', err)
        },
        toImage() {
	        html2canvas(this.$refs.imageWrapper).then(canvas => {
              let dataURL = canvas.toDataURL("image/png");
              console.log(dataURL)
	        //   this.imgUrl = dataURL;
	        //   if (this.imgUrl !== "") {
	        //     this.dialogTableVisible = true;
            //   }
              let a = document.createElement('a')
              a.href = dataURL
              a.download = 'image'
              a.click()
	        })
        },
        // jquery获取截图方法
        // $('#target').qrcode({
        //     text: "message",
        //     width: 85,
        //     height: 85
        // });
        // // 将canvas生成的二维码保存为图片
        // saveImg() {
        //         var canvasData = $('#target').children('canvas');
        //         var a = document.createElement("a");
        //         a.href = canvasData[0].toDataURL();;
        //         a.download = "drcQrcode";
        //         a.click();
        // },
        meChart() {
          // var echarts = require('echarts')
          var myChart = echarts.init(document.getElementById('main'))
          // let dom = this.$refs.chart_one
          // console.log(dom)
          // var myChart = echarts.init(dom)
          var option = { 
            title: {
              text: 'ECharts 入门示例',
            },
            tooltip: {},
            legend: {
              data: ['销量']
            },
            xAxis: {
              data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
              name: '销量',
              type: 'bar',
              data: [5, 20, 36, 10, 10, 20]
            }]
          }
          myChart.setOption(Option)
          window.addEventListener("resize", function() {
              myChart.resize()
          })
        }
    }
}
</script>