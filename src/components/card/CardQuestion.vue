<template>
  <div ref="delete">
  <el-card class="box-card">
    <div slot="header" class="clearfix me-card-header">
      <el-link type="success" :underline="false" class="me-back">
        <i class="el-icon-magic-stick"></i>
        {{status}} 
      </el-link>
      <!-- <el-link type="warning" :underline="false" class="me-back">未解决</el-link> -->
      <el-button type="primary" class="me-delete"><i class="el-icon-delete el-icon--left" @click="delQuestion"> 删除</i></el-button>
    </div>
    <div class="me-question">
        &nbsp;&nbsp;&nbsp;&nbsp;{{question}}
    </div>
  </el-card>
  </div>
</template>

<script>
import { deleteQuestion } from '../../api/student'

export default {
    data() {
        return {
            status: ''
        }
    },
    props: {
        question: String,
        solve: String
    },
    mounted() {
        if (this.solve == '是') {
            this.status = '已解决'
        } else if (this.solve == '否') {
            this.status = '未解决'
        }
    },
    methods: {
        delQuestion() {
            this.$refs['delete'].style.display = 'none'
            // console.log(this.$refs['delete'])
            // console.log(this.$refs['delete'].style.display)
            // console.log(this.question)
            // console.log(this.solve)
            deleteQuestion(localStorage.account, this.question).then(res => {
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
  height: 20px;
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
  text-align: justify;
  /* margin-bottom: 10px; */
  width: 80%;
  margin-bottom: 20px;
}
.me-question {
  line-height: 1.5rem;
  letter-spacing: 2px;
}
.me-back {
  font-size: 18px;
  padding-top: 2px;
}
.me-delete {
    float:right;
    margin-right: 10px;
}
.el-card {
  background-color: rgba(256, 256, 256, 0.1);
  border-radius: 0;
}
</style>