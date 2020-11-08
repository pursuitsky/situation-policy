<template>
  <div v-title data-title="活动发布 - 形势与政策">
    <el-container>
      <el-main>
        <add-activity></add-activity>
      </el-main>

      <!-- <el-aside width="500px">
        <div class="me-card">
          <h1>正在进行的活动</h1>
          <el-card v-if="publishedList.length == 0" class="me-publish-info">
            最近无新的活动发布
          </el-card>
          <delete-activity v-for="item in publishedList" :key="item" v-bind="item"></delete-activity>
        </div>
        <div class="me-card">
          <h1>已经结束报名的活动</h1>
          <el-card v-if="publishedList.length == 0" class="me-publish-info">
            最近无已经结束的活动
          </el-card>
          <delete-activity v-for="item in publishedList" :key="item" v-bind="item"></delete-activity>
        </div>
      </el-aside> -->
      
    </el-container>
  </div>
</template>

<script>
import AddActivity from '../adminCard/activity/addActivity'
// import { getAllPublishedActivity } from '../../api/admin'
export default {
  data() {
    return {}
  },
  components: {
    AddActivity
  },
  created() {
    // this.getPublishedAactivity()
  },
  // watch: {
  //   'publishedList'(newvalue, oldvalue){
  //     console.log(newvalue, oldvalue)
  //     if (newvalue) {
  //       this.getPublishedAactivity()
  //     }
  //   }
  // },
  // methods: {
  //   getPublishedAactivity() {
  //     getAllPublishedActivity().then( res => {
  //       // this.publishedList = res.data
  //       console.log(res.data)
  //       console.log(res)
  //     }).catch( err => {
  //       console.log(err)
  //       this.$message({type: 'error', message: '发布的活动信息获取失败'})
  //     })
  //   }
  // }
};
</script>

<style scoped>
.me-card{
  /* margin: 90px auto 50px; */
  margin-top: 90px;
}
h1{
  text-align: justify;
  padding-bottom: 30px;
  font-size: 24px;
  /* margin-top: 20px; */
  /* vertical-align: middle; */
  letter-spacing: 2px;
  color: #e6a23c;
  font-weight: 400px;
}
.me-publish-info{
  width: 350px;
  text-align: justify;
  margin-bottom: 30px;
}
</style>