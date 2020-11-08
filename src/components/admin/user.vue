<template>
  <div v-title data-title="用户管理 - 形势与政策">
    <el-container class="me-container">
      <el-aside width="350px">
        <sup-remind></sup-remind>
        <sup-search></sup-search>
        <Excel></Excel>
      </el-aside>
      <el-main class="me-main">
          <sup-manage></sup-manage>
          <!-- <sup-table class="me-table"></sup-table> -->
          <!-- <expend></expend> -->
          <!-- <Excel></Excel> -->
      </el-main>
    </el-container>
  </div>
</template>

<script>
import SupRemind from '../adminCard/superadmin/supRemind'
import SupSearch from '../adminCard/superadmin/supSeach'
import SupManage from '../adminCard/superadmin/supManage'
import SupTable from '../adminCard/superadmin/table/table'
import expend from '../adminCard/superadmin/table/expend'
import Excel from '../adminCard/superadmin/excel'
export default {
    components: {
        SupRemind,
        SupSearch,
        SupManage,
        SupTable,
        expend,
        Excel
    }
}
</script>
<style scoped>
.me-container {
  margin: 30px auto 50px;
  width: 86%;
}
.me-main{
    margin-left: 30px;
}
.me-table{
    margin-top: 100px;
}
</style>