<template>
<div ref="mycard">
  <el-card class="box-card">
    <div slot="header" class="clearfix me-card-header">
      <!-- <i class="el-icon-collection-tag me-i"></i> -->
      <!-- <span>卡片名称</span> -->
      <el-link type="primary" :underline="false">
        <i class="el-icon-star-on"></i>
        {{ activity }}
      </el-link>
      <!-- <el-button style="float: right; padding: 3px 0" type="text">取消活动</el-button> -->
      <el-tooltip effect="dark" content="活动已加分，是否删除活动" placement="top">
        <el-button style="float: right;" type="warning" icon="el-icon-delete" circle @click="DeleteActivity"></el-button>
      </el-tooltip>
    </div>
    <el-link type="success" :underline="false" class="text item">
      <i class="el-icon-time"></i>
      &nbsp;发布时间：{{ publishDate }}
    </el-link>
    <br />
    <el-link type="success" :underline="false" class="text item">
      <i class="el-icon-location"></i>
      &nbsp;活动地点：{{ location}}
    </el-link>
    <br />
    <el-link type="success" :underline="false" class="text item">
      <i class="el-icon-date"></i>
      &nbsp;活动时间：{{ startTime }}
    </el-link>
  </el-card>
</div>
</template>

<script>
import { deleteActivity } from '../../../api/admin'

export default {
  props:{
    activity: String,
    publishDate: String,
    location: String,
    startTime: String
  },
  methods: {
    DeleteActivity() {
      deleteActivity(this.activity, this.startTime, this.location)
      .then( res => {
        // console.log(res.data)
        let dom = this.$refs.mycard.style
        dom.display = 'none'
        this.$message({type: 'success', message: '该活动已经成功删除'})
      })
      .catch( err => {
        this.$message({type: 'error', message: '活动删除失败'})
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
  margin-bottom: 30px;
}
</style>