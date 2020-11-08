<template>
  <el-table :data="tableData" @expand-change="rowExpand" class="me-table">
    <!-- 展开行 是另一个表格 begin -->

    <el-table-column type="expand" prop>
      <template>
        <el-table :data="tableData2">
          <el-table-column type="selection"></el-table-column>

          <el-table-column prop="id" v-if="showTableId" label="任务ID"></el-table-column>

          <el-table-column prop label="任务时间" width="190px;">
            <template
              slot-scope="scope"
            >{{scope.row.taskStartDate|formatDate}}-{{scope.row.taskEndDate|formatDate}}</template>
          </el-table-column>

          <el-table-column prop="taskName" label="任务名称"></el-table-column>

          <el-table-column prop="taskFlag" label="任务状态" :formatter="formatStatus"></el-table-column>
        </el-table>
      </template>
    </el-table-column>

    <el-table-column prop="id" v-if="showTableId" label="任务ID"></el-table-column>

    <el-table-column prop label="任务时间">
      <template
        slot-scope="scope"
      >{{scope.row.taskStartDate|formatDate}}-{{scope.row.taskEndDate|formatDate}}</template>
    </el-table-column>

    <!-- 展开行 是另一个表格 end -->

    <el-table-column prop="taskName" label="任务名称"></el-table-column>

    <el-table-column prop="taskFlag" :formatter="formatType" label="任务状态"></el-table-column>
  </el-table>
</template>

<script>
export default {
    data() {
        return {
            tableData: [
                {
                    id: 12,
                    taskStartDate: '223',
                    taskEndDate: '344',
                    taskName: 'hh',
                    taskFlag: '在线'
                }
            ],
            tableData2: [
                {
                    id: 12,
                    taskStartDate: '223',
                    taskEndDate: '344',
                    taskName: 'hh',
                    taskFlag: '在线'
                }
            ],
            showTableId: true
        }
    },
    methods: {
        rowExpand(row, expandedRows) {
            alert(row)
            alert(expandedRows) 
        }
    }
}
</script>

<style scoped>
.me-table{
    margin-top: 100px;
}
</style>