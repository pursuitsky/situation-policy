<template>
  <el-card shadow="never">
    <!-- <el-form :inline="true" :model="formInline" class="demo-form-inline me-search">
      <el-form-item label="姓名">
        <el-input v-model="formInline.user" placeholder="姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="学号">
        <el-input v-model="formInline.userId" placeholder="学号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getStudentPersonal">查 询</el-button>
      </el-form-item>
    </el-form> -->
    <el-form class="demo-form-inline me-search" :inline="true">
      <el-form-item>
        <el-select v-model="value" placeholder="请选择查询方式" clearable>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="input" :placeholder='info'></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getStudentPersonal">查 询</el-button>
      </el-form-item>
    </el-form>
    <el-form ref="form" :model="form" label-width="80px" class="add-activity">
      <el-form-item label="活动">
        <el-col :span="11">
          <el-input v-model="form.name" placeholder="输入活动名称" clearable></el-input>
        </el-col>
        <el-col :span="2" class="line">.</el-col>
        <el-col :span="11">
          <el-input v-model="form.score" placeholder="输入活动分数" clearable></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="时间">
        <el-col :span="11">
          <el-date-picker v-model="form.date" placeholder="选择日期" style="width:100%"></el-date-picker>
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-time-picker v-model="form.time" placeholder="选择时间" style="width:100%"></el-time-picker>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="setInformation">确 认</el-button>
        <el-button @click="cancelInformation">取 消</el-button>
        <!-- <el-button type="primary" @click="onSubmit" class="me-button">添 加 分 数</el-button> -->
      </el-form-item>
    </el-form>
    <!-- <el-alert
      v-if='this.form.name == ""'
      title="自定义 close-text"
      type="info"
      close-text="知道了">
    </el-alert> -->
  </el-card>
</template>

<script>
import { getInformationByUserNameOrId } from '../../../api/admin'
import { Message } from 'element-ui'
import Bus from '../../../eventBus/eventBus'

export default {
  data() {
    return {
      formInline: {
        user: "",
        userId: ""
      },
      form: {
        name: "",
        score: "",
        time: "",
        date: ""
      },
      input3: '',
      select: '',
      options: [{
        value: '姓名',
        label: '姓名'
      }, {
        value: '学号',
        label: '学号'
      }],
      value: '',
      input: '',
      info: '请输入内容'
    };
  },
  // mounted() {
  //   if (this.value == '学号') {
  //     this.info = '请输入学号'
  //   } else if (this.value == '姓名') {
  //     this.info = '请输入姓名'
  //   }
  // },
  watch: {
    'value': {
      handler: function(val, oldval) {
        var that = this
        if (that.value == '学号') {
          that.info = '请输入学号'
        } else if (that.value == '姓名') {
          that.info = '请输入姓名'
        } else {
          that.info = '请输入内容'
        }
      }
    }
  },
  methods: {
      getStudentPersonal() {
          let key = this.value
          let val = this.input
          if (key == '') {
            alert('请选择是学号还是姓名查询方式')
          }
          let data = []
          setTimeout( () => {
            this.input = ''
            this.value = ''
          }, 2500)
          let obj = {}
          obj[key] = val
          if (key != '') {
            getInformationByUserNameOrId(obj).then(res => {
              data = res.data.data
              // 提交给父级组件individual，改变table中数据
              this.$emit('TableData', data)
            }).catch(err => {
              Message({type: 'warning', message: '学生信息查询失败'})
            })
          }
      },
      setInformation() {
        if (this.form.name == '') {
          this.$alert('活动名称不能为空哦', {confirmButtonText: '知道了'})
        } else if (this.form.score == '') {
          this.$alert('活动的形势与政策分不能为空哦', {confirmButtonText: '知道了'})
        } else if (this.form.date == ''){
          this.$alert('活动的时间不能为空哦', {confirmButtonText: '知道了'})
        }
        if (this.form.name != '' && this.form.score != '' && this.form.date != ''){
          let information = {
            ActivityName: this.form.name,
            score: this.form.score,
            time: this.form.time,
            date: this.form.date,
            display: true
          }
          setTimeout( () => {
            this.form.name = ''
            this.form.score = ''
            this.form.time = ''
            this.form.date = ''
          }, 2500)

          // 创建同级活动提醒组件发送数据给Info
          Bus.$emit('activtiyEvent', information)
          
          // 提交给父级组件individual
          this.$emit('ShowIn', information)
        }
      },
      cancelInformation() {
        let information = {
          ActivityName: '',
          score: '',
          time: '',
          date: '',
          display: false
        }
        // Bus.$emit('cancelEvent', information)
        this.$emit('cancel', information)
      }
  }
};
</script>

<style scoped>
.add-activity{
    text-align: justify;
    padding-top: 15px;
}
.me-search{
    border-bottom: 1px dashed #dcdfe6;
}
.line{
    text-align: center;
}
.me-button{
    float: right;
}
.el-select .el-input {
    width: 200px;
}
.input-with-select .el-input-group__prepend {
    background-color: #fff;
}
</style>