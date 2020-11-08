<template>
  <el-card class="box-card" shadow="hover">
    <div slot="header" class="clearfix me-card-header">
      <el-link type="primary" :underline="false">
        <i class="el-icon-star-on"></i>
        {{ myClass }}{{ name }}：
      </el-link>
    </div>
    <div class="me-question">
      <div>
        &nbsp;&nbsp;&nbsp;&nbsp;{{ question }}
      </div>
      <div v-show="false">
        {{id}}
      </div>
        <!-- <div :class="{active:isActive}" class="me-deadline">
          {{day}}天 {{hour}}：{{min}}：{{second}}
        </div> -->
    </div>
    <div class="me-solution">
      <el-button type="primary" round @click="InformFeedback">{{but}}</el-button>
    </div>
  </el-card>
</template>
<script>
import { deleteQuestion, feedback } from '../../../api/admin'
export default {
  props: {
    myClass: String,
    name: String,
    question: String,
    id: String,
    time: String
  },
  data () {
    return {
      but: '解 决',
      isActive: true,
      // deadline: '1245',
      // curStartTime: '2020-05-09',
      // day: '0',
      // hour: '00',
      // min: '00',
      // second: '00'
    }
  },
  methods: {
    // 倒计时
    countTime () {
      let data = {}
      deleteQuestion(data).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
      // 获取当前时间
      let date = new Date()
      let now = date.getTime()
      // console.log(now)
      // 设置截止时间
      let endDate = new Date(this.curStartTime) // this.curStartTime需要倒计时的日期
      let end = endDate.getTime()
      // 时间差
      let leftTime = end - now
      // 定义变量 d,h,m,s保存倒计时的时间
      if (leftTime >= 0) {
        // 天
        this.day = Math.floor(leftTime / 1000 / 60 / 60 / 24)
        // 时
        let h = Math.floor(leftTime / 1000 / 60 / 60 % 24)
        this.hour = h < 10 ? '0' + h : h
        // 分
        let m = Math.floor(leftTime / 1000 / 60 % 60)
        this.min = m < 10 ? '0' + m : m
        // 秒
        let s = Math.floor(leftTime / 1000 % 60)
        this.second = s < 10 ? '0' + s : s
      } else {
        this.day = 0
        this.hour = '00'
        this.min = '00'
        this.second = '00'
      }
      console.log(this.day)
      // 等于0的时候不调用
      // if (Number(this.hour) === 0 && Number(this.day) === 0 && Number(this.min) === 0 && Number(this.second) === 0) {
      //   return
      // } else {
      // // 递归每秒调用countTime方法，显示动态时间效果,
      //   setTimeout(this.countTime, 1000)
      // }
    },　
    
    InformFeedback() {
      setTimeout(() => {
        this.but = '已 解 决'
      }, 1000)
      let id = this.id
      let question = this.question
      // console.log(question)
      // console.log(id)
      feedback(id, question).then(res => {
        console.log(res.data)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style>
.text {
  font-size: 15px;
}
.me-card-header {
  text-align: justify;
}
.item {
  margin-bottom: 10px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.box-card {
  width: 350px;
  text-align: justify;
}
.me-question {
  line-height: 1.5rem;
  /* text-indent: 2em; */
  letter-spacing: 2px;
  height: 200px;
  /* padding-bottom: 10px; */
}
.me-solution {
  float: right;
  margin-right: 5px;
  padding-bottom: 10px;
}
.me-deadline {
  /* margin-bottom: 10px; */
  float: right;
  margin-right: 10px;
  /* padding-bottom: 10px; */
}
.active {
  color:blueviolet;
  /* display: none; */
}
</style>