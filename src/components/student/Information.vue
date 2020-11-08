<template>
  <div>
    <el-container>
      <el-aside>
        <CardMe></CardMe>
        <br>
        <!-- key值是必须唯一的，如果重复就会报错 -->
        <!-- <card-question v-for="(item, index) in question" :key="index" v-bind="item"></card-question> -->
      </el-aside>

      <el-main>
        <h2 class="activity-participate">活动报名</h2>
        <div v-if="activity.length == 0">
          <el-card class="mycard">
            最 近 无 加 分 活 动 发 布
          </el-card>
        </div>
        <!-- 子组件中获取value对象或者数组，然后value.activity -->
        <!-- <CardAdd v-for="(item, index) in activity" :key="'add'+index" v-bind:value="item"></CardAdd> -->
        <!-- 子组件中直接获取{}中的属性 -->
        <CardAdd v-for="(item, index) in activity" :key="'add'+index" v-bind="item"></CardAdd>

        <h2 class="activity-add">已加分</h2>
        <div v-if="accomplish.length == 0">
          <el-card class="mycard">
            最 近 没 有 报 名 已 加 分 活 动
          </el-card>
        </div>
        <!-- 一个template中有两个一样的v-for v-for 中的key值都为 index -->
        <CardAdded v-for="(item, index) in accomplish" :key="'added'+index" v-bind="item"></CardAdded>

        <h2 class="activity-add">问题反馈</h2>
        <div v-if="question.length == 0">
          <el-card class="mycard">
            没 有 提 交 任 何 问 题，暂 无 问 题 反 馈
          </el-card>
        </div>
        <card-question v-for="(item, index) in question" :key="index" v-bind="item"></card-question>

      </el-main>
    </el-container>
  </div>
</template>

<script>
import CardMe from "../card/CardMe"
import CardAdd from "../card/CardAdd"
import CardAdded from "../card/CardAdded"
import CardQuestion from '../card/CardQuestion'

import { getActivityInformation, getUserAdded, getUserQuestion } from '../../api/student'
import { Message } from 'element-ui'

export default {
  data() {
    return {
      activity: [],
      accomplish: {},
      question: []
    };
  },
  components: {
    CardMe,
    CardAdd,
    CardAdded,
    CardQuestion
  },
  created () {
    this.getActivity(),
    this.getUserActivity(),
    this.getQuestion()
  },
  methods: {
    getActivity() {
      getActivityInformation(localStorage.account).then(res => {
        let data = res.data.data
        this.activity = data
        // console.log(res)
        // console.log(data)
      }).catch(error => {
        Message({type: 'warning', message: '活动信息请求失败'})
      })
    },
    getUserActivity() {
      getUserAdded(localStorage.account).then(res => {
        let data = res.data.data
        this.accomplish = data
        // console.log(data)
      }).catch(error => {
        Message({type: 'warning', message: '已加分活动信息请求失败'})
      })
    },
    getQuestion() {
      getUserQuestion(localStorage.account).then(res => {
        // console.log(res.data)
        this.question = res.data.data
      }).catch( err => {
        Message({type: 'warning', message: '问题反馈信息请求失败'})
      })
    }
  }
};
</script>
<style scoped>
.activity-participate {
  font-weight: 500;
  text-align: justify;
  color: #333;
  margin-top: -8px;
  margin-bottom: 10px;
  font-size: 2rem;
  line-height: 1.2;
}
.activity-add {
  font-weight: 500;
  text-align: justify;
  color: #333;
  margin-bottom: 10px;
  margin-top: 20px;
  font-size: 2rem;
  line-height: 1.2;
}
.me-activity {
  width: 80%;
  margin-top: -20px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.el-card {
  background-color: rgba(256, 256, 256, 0.1);
  border-radius: 0;
}
/* 换成百分比 */
.el-aside {
  /* width: 260px;
  height: 600px;
  margin-left: 140px; */
  /* width: 40%; */
  /* height: 600px; */
  margin-left: 10%;
}
.el-main {
  margin-left: 40px;
}
.mycard {
  width: 80%;
}
</style>