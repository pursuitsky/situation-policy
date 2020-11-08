<template>
  <el-card class="me-activity-added">
    <div class="activity-added">
      <el-row>
        <el-button type="success" circle icon="el-icon-message" class="me-icon"></el-button>
        <el-link type="info" :underline="false" class="me-activity">&nbsp;&nbsp;&nbsp;{{time}} {{activity}}</el-link>
        <el-link type="success" :underline="false" class="me-activity">已加分</el-link>
      </el-row>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    activity: String,
    time: String
  }
}
</script>
<style scoped>
.me-activity-added {
  width: 80%;
  margin-bottom: 20px;
}
.activity-added {
  font-size: 30px;
  text-align: justify;
}
.me-icon {
  margin-top: -10px;
}
.me-activity {
  font-size: 20px;
  padding-top: 7px;
}
</style>