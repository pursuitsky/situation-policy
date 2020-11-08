<template>
  <div id="me-detail">
    <div>
      <h3 id="title">加分细则</h3>
    </div>
    <el-table :data="AllInformation" stripe style="width: 70%">
      <el-table-column prop="日期" label="日期" width="180" class="me-table"></el-table-column>
      <el-table-column prop="活动" label="活动名称" width="180"></el-table-column>
      <el-table-column prop="分数" label="分数"></el-table-column>
    </el-table>
    <div class="question">
      <p class="me-question">如果有疑问？点击这里向我们反映</p>
      <el-button type="primary" class="me-question-button" @click="dialogFormVisible = true">我有疑问</el-button>
    </div>

    <el-dialog title="提交你的疑问" :visible.sync="dialogFormVisible" width="30%" class="me-dialog">
      <el-form :model="question" :label-position="labelPositoon">
        <el-form-item label="你的疑问" :label-width="formLabelWidth" prop="question">
          <el-input 
            type="textarea" 
            v-model="question.question" 
            autocomplete="off" 
            maxlength="100"  
            show-word-limit 
            rows="6"
            >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmit">取 消</el-button>
        <el-button type="primary" @click="submitQuestion()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { userScoreDetail, Question } from "../../api/student";
import { Message } from "element-ui";

export default {
  data() {
    return {
      AllInformation: [],
      dialogFormVisible: false,
      labelPositoon: "top",
      question: {
        question: ""
      },
      formLabelWidth: "120px"
    };
  },
  created() {
    this.getUserScore();
  },
  beforeRouteEnter (to, from, next) {
    if (from.path != '/welcome/information') {
        next('/login')
    } else {
        next()
    }
  },
  methods: {
    getUserScore() {
      userScoreDetail(this.$route.query.userId)
        .then(res => {
          let data = res.data.data;
          // this.AllInformation = this.AllInformation.concat(data)
          this.AllInformation = res.data.data
          // console.log(data);
        })
        .catch(error => {
          Message({ type: "warning", message: "个人形政分详细数据请求失败" });
        });
    },
    submitQuestion() {
      let _this = this
      Question(_this.question.question, localStorage.account, localStorage.name, localStorage.class)
        .then(res => {
          this.dialogFormVisible = false;
          // console.log(res.data)
          _this.question.question = ''
          Message({
            type: "success",
            message: "你的问题已成功提交，等待管理员审核"
          });
        })
        .catch(error => {
          this.dialogFormVisible = false;
          _this.question.question = ''
          Message({ type: "warning", message: "问题提交失败" });
        });
    },
    cancelSubmit() {
      this.dialogFormVisible = false
      this.question.question = ''
    }
  }
};
</script>

<style scoped>
h3 {
  margin-bottom: 0.5rem;
  font-weight: 500;
  line-height: 1.2;
  font-size: 2rem;
}
#me-detail {
  margin-top: -20px;
  padding-bottom: 50px;
}
.me-table {
  margin-left: 100px;
}
.el-table {
  margin: 0 auto;
}
#title {
  margin: 0 auto 20px;
}
.question {
  padding-top: 30px;
  line-height: 1.7;
  letter-spacing: 2px;
  font-size: 14px;
  padding-bottom: 10px;
  text-align: center;
}
.me-question {
  color: #e6a23c;
  font-weight: 200;
  margin-bottom: 15px;
}
.me-question-button {
  padding: 10px 17px;
  font-size: 14px;
}
.me-dialog {
  text-align: justify;
}
/* .el-input{
   resize:none
} */
</style>