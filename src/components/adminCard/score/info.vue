<template>
  <el-card class="me-remind">你将要添加的活动是{{ ActivityName }}，活动分数为{{ score }}分，活动时间是{{ date }}</el-card>
</template>

<script>
import Bus from '../../../eventBus/eventBus'

export default {
  data() {
    return {
      ActivityName: '',
      score: '',
      time: '',
      date: ''
    }
  },
  mounted() {
    let _this = this
    Bus.$on('activtiyEvent', function(information) {
      _this.ActivityName = information.ActivityName
      _this.score = information.score
      _this.time = information.time
      _this.date = information.date.toLocaleDateString()
      // console.log('info:',information)
    })
  }
};
</script>
<style scoped>
.me-remind {
  margin-top: 20px;
  text-align: justify;
  line-height: 1.5rem;
  text-indent: 2em;
  letter-spacing: 2px;
  width: 90%;
}
</style>