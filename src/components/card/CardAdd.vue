<template>
  <el-card class="me-card-add" :body-style="{ padding: '16px' }">
    <div class="information-add">
      <el-row :gutter="40">
        <el-col :span="8" class="me-activity"><span ref="act">{{activity}}</span></el-col>
        <el-col :span="8">
          <el-link type="success" :underline="false">
            <i class="el-icon-time"></i> {{time}}
          </el-link>
        </el-col>
        <el-col :span="8">
          <el-link type="info" :underline="false">
            <i class="el-icon-thumb"></i> {{place}}
          </el-link>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="8">
          <el-link :underline="false">
            <i class="el-icon-star-on"></i> 加形政分：{{add}} 分
          </el-link>
        </el-col>
        <el-col :span="8">
          <el-link type="warning" :underline="false">
            <i class="el-icon-message-solid"></i> 剩余名额：{{remain}}
          </el-link>
        </el-col>
        <el-col :span="8">
          <el-link type="info" :underline="false">
            <i class="el-icon-right"></i>
            <i>&nbsp;</i>
            <el-button type="primary" :disabled="participate" @click="Apply">{{joinActivity}}</el-button>
          </el-link>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import { paticipate, activityRemain } from '../../api/student'
import { Message } from 'element-ui'

export default {
  props:{
    value: Object,
    activity : String,
    time: String,
    place: String,
    add: String,
    surplus: String,
    year: String,
    part: String
    // 啊啊: String
  },
  data () {
    return {
      participate: false,
      joinActivity: '报名',
      remain: ''
    }
  },
  mounted(){
    // console.log(this.value)
    // console.log(this.remain)
    // console.log(this.啊啊)
    // 侦听剩余名额变化
    // this.WatchSurplus()
    if (this.part == '0') {
      this.joinActivity = '报名'
    } 
    if (this.part == '1') {
      this.joinActivity = '已报名'
      this.participate = true
    }
    this.remain = this.surplus
  },
  watch: {
    // 子组件监听父组件传来的props，进行渲染样式
    'part': {
      // immediate如果为true 代表如果在 wacth 里声明了之后，就会立即先去执行里面的handler方法
      immediate: true,
      handler(val) {
        if (val == '0') {
          this.joinActivity = '报名'
        }
        if (val == '1') {
          this.joinActivity = '已报名'
          this.participate = true
        }
      }
    },
    'surplus': {
      handler(val) {
        let date = this.year.slice(0,4) + '-' + this.time.slice(0,2) + '-' + this.time.slice(3,5)
        activityRemain(this.activity, date, this.add)
        .then(res => {
            console.log(res.data.surplus)
            this.remain = res.data.surplus
        }).catch(err => {
            console.log(err)
        })

        // this.WatchSurplus() 
        // console.log(val)
      }
    },
    // 数据单向性，无法修改父组件传过来的值surplus
    'remain': {
      handler(val) {
        this.WatchSurplus()
        // console.log(val)
      }
    }
  },
  methods: {
    Apply () {
      this.joinActivity = '已报名'
      this.participate = true
      // alert('报名成功')
      // 或者传入localStorage.account
      let activity = this.$refs.act.innerText
      // console.log(activity) 
      let date = this.year.slice(0,4) + '-' + this.time.slice(0,2) + '-' + this.time.slice(3,5)
      // console.log(date)
      let _this = this
      paticipate(this.$route.query.userId, activity, localStorage.name, date, this.add).then(res => {
        // console.log(res.data)
        if (res.data.statue == 'success') {
          _this.joinActivity = '已报名'
          _this.participate = true
          _this.remain = res.data.surplus
          // console.log(res.data.surplus)
          _this.$message({type: 'success', message: '报名成功'})
        }
      }).catch(error => {
        // this.participate = false
        Message({type: 'warning', message: '请求发送失败'})
      })
    },
    WatchSurplus() {
      var schedule = require('node-schedule')
      let date = this.year.slice(0,4) + '-' + this.time.slice(0,2) + '-' + this.time.slice(3,5)
      schedule.scheduleJob('30 * * * * *', () => {
        activityRemain(this.activity, date, this.add)
          .then(res => {
              // console.log(res)
            // console.log(res.data.surplus)
            this.remain = res.data.surplus
          }).catch(err => {
            console.log(err)
          })
      })
    }
  }
};
</script>

<style scoped>
.me-card-add {
  width: 80%;
  margin-bottom: 20px;
}
.information-add {
  font-size: 30px;
  text-align: justify;
  margin-top: -10px;
}
.me-activity {
  font-size: 20px;
  color: #333;
  /* font-weight: 500; */
  letter-spacing: 2px;
  padding-top: 7px;
  font-family: "楷体";
}
label {
  font-size: 16px;
  color: #333;
}
.el-link {
  font-size: 16px;
}
</style>