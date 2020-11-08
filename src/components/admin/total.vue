<template>
  <div v-title data-title="统一加分 - 形势与政策">
    <el-container class="me-container">
      <el-aside>
        <total-remind></total-remind>
        <el-card class="me-input">
          <Input search enter-button placeholder="输入活动名称" v-model="value" @on-search="handleSearch"/>
        </el-card>
        <el-card class="me-button">
            <Button type="success" long @click="ActivtityAdd">一 键 加 分</Button>
        </el-card>
      </el-aside>
      <el-main>
          <total-table class="me-table" :list="data" v-on:getTableData="getData"></total-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import TotalRemind from "../adminCard/score/totalremind"
import TotalTable from '../adminCard/score/totaltable'
import { getAllActivity, getAllActivityByName, TotalActivityAdd } from '../../api/admin'
import Bus from '../../eventBus/eventBus'

export default {
  data() {
    return {
      value: "",
      data: [],
      InformationList:[] 
    }
  },
  created (){
    this.getInformation()
  },
  components: {
    TotalRemind,
    TotalTable
  },
  methods: {
    handleSearch() {
      setTimeout(() =>{
          this.value = ''
      }, 1500)
      getAllActivityByName(this.value).then( res => {
        let data = res.data
        this.data = data.data
        // console.log(data)
        if (data.data.length == 0) {
          this.$message({type: 'info', message: `${data.msg}`})
        }
      }).catch( err => {
        this.$message({type: 'error', message: '请求失败，学生活动信息加载失败'})
      })
      // this.data = this.data.filter(data => !value || data['activity'].toLowerCase().includes(search.toLowerCase()))
    },
    getInformation() {
      getAllActivity().then(res => {
        this.data = res.data.data
        // console.log(this.data)
        // Bus.$emit('updateData', res.data.data)
        // this.$message({type: 'success', message: '请求成功'})
      }).catch(err => {
        this.$message({type: 'error', message: '请求失败，学生活动信息查询失败'})
      })
    },
    ActivtityAdd() {
      TotalActivityAdd(this.InformationList).then( res => {
        // console.log(res.data)
        // 请求失败也执行此处操作可能与发送给后台的data类型有关
        this.$message({type: 'success', message: '活动信息添加成功'})
        this.getInformation()
      }).catch( err => {
        this.$message({type: 'error', message: '一键添加活动失败'})
      })
    },
    getData(data) {
      // console.log(data)
      this.InformationList = data
      // console.log(this.InformationList)
    }
  }
};
</script>

<style scoped>
.me-container {
  margin: 30px auto 50px;
  width: 92%;
}
.me-input {
  width: 90%;
  margin-top: 30px;
  padding: 0 10px;
}
/* .me-table {
  margin-top: 10px;
} */
.me-button{
    width: 90%;
    margin-top: 30px;
    padding: 0 10px;
}
</style>