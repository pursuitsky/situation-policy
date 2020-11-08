<template>
  <div class="me-publish">
    <h1>理学部 信息发布</h1>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入活动名称"></el-input>
      </el-form-item>
      <el-form-item label="地点" prop="region">
        <el-input v-model="form.region" placeholder="请选择活动区域"></el-input>
      </el-form-item>
      <el-form-item label="时间">
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="分数" prop="score">
        <el-input v-model="form.score" placeholder="请输入活动应加形式与政策分数"></el-input>
      </el-form-item>
      <el-form-item label="名额" prop="num">
        <el-input v-model="form.num" placeholder="请输入活动要求报名人员数量"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="desc">
        <el-input type="textarea" v-model="form.desc" placeholder="请输入活动的相关信息、具体内容"></el-input>
      </el-form-item>
      <el-form-item class="me-form-button">
        <el-button type="primary" @click="publishActivityInformation">立 即 发 布</el-button>
        <el-button @click="resetForm('form')">重 置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { publishInformation } from '../../../api/admin'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        desc: "",
        score: '',
        num: '',
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { max: 25, message: "不能大于25个字符", trigger: "blur" }
        ],
        region: [
          { required: true, message: "请输入活动地点", trigger: "blur" }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        score: [
          { required: true, message: "请输入分数", trigger: "blur" },
          { min: 1, max: 2, message: "分数不能超过两位数", trigger: "blur" }
        ],
        num: [
          { required: true, message: "请输入活动名额", trigger: "blur" },
          { min: 1, max: 3, message: "不能超过三位数", trigger: "blur" }
        ],
        desc: [
          { required: true, message: "请输入活动相关信息", trigger: "blur" }
        ]
      }
    }
  },
  methods: {
    publishActivityInformation() {
      //验证是否为数字
      let patrn = /^(-)?\d+(\.\d+)?$/
      // console.log(patrn.exec(this.form.score))
      if (patrn.exec(this.form.score) == null) {
        alert('分数只能输入数字')
      }
      if (patrn.exec(this.form.num) == null) {
        alert('名额只能输入数字')
      }
      if (this.form.name != '') {
        if (this.form.region != '') {
          if (this.form.date1 != '') {
            if (this.form.date2 != '') {
              if (this.form.score != '' && patrn.exec(this.form.score) != null) {
                if (this.form.num != '' && patrn.exec(this.form.num) != null) {
                  // if (this.form.desc) {}
                  let data = {
                    name: this.form.name,
                    region: this.form.region,
                    date1: this.form.date1,
                    date2: this.form.date2,
                    score: this.form.score,
                    num: this.form.num,
                    desc: this.form.desc
                  }
                  this.$confirm('将发布一条活动, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    //为啥这里数据必须是json数组，才能发送过去
                    // let list = []
                    // list.push(data)
                    // console.log(list)
                    // console.log(data)
                    publishInformation(data)
                    .then( res => {
                      // console.log(res)
                      // alert('aaa')
                      Message({type: 'success', message: '活动信息发布成功'})
                    })
                    .catch( err => {
                      Message({type: 'error', message: '活动发布失败'})
                    })
                  }).catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消发布'
                    })          
                  })
                }
              }
            }
          }
        }
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
.me-publish{
    width: 60%;
    margin: 70px auto 50px;
    text-align: justify;
    border-radius: 10px;
    box-shadow: 0px 0px 1px 1px rgba(161, 159, 159, 0.1);
    padding: 20px 50px 20px 20px;
}
.line{
    text-align: center;
}
h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  vertical-align: middle;
  margin-left: 10%;
  letter-spacing: 2px;
  color: #e6a23c;
  font-weight: 200px;
}
.me-form-button {
  margin-left: 30%;
}
</style>