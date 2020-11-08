<template>
  <div v-title data-title="单独加分 - 形势与政策">
    <el-container class="me-container">
      <el-aside width="300px">
        <Remind></Remind>
        <Info v-show="display"></Info>
        <el-card class="me-button">
          <Button type="success" long @click="studentToAddActivity">点 击 加 分</Button>
        </el-card>
      </el-aside>

      <el-main>

        <Search
          v-on:TableData="getTableData"
          v-on:ShowIn="ShowInformation"
          v-on:cancel="cancelInformation"
        ></Search>

        <el-table
          :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)"
          style="width: 100%"
          class="me-table"
          @selection-change="changeSelection"
          border
        >
          <el-table-column type="selection" width="80"></el-table-column>
          <el-table-column prop="班级" label="班级" width="150"></el-table-column>
          <el-table-column prop="姓名" label="姓名" width="150"></el-table-column>
          <el-table-column prop="学号" label="学号" show-overflow-tooltip></el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, tableData)"
                type="text"
                size="small">
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="pagesize"
          layout="prev, pager, next"
          :total="this.tableData.length"
        ></el-pagination>

      </el-main>
    </el-container>
  </div>
</template>

<script>
import Search from "../adminCard/score/search"
import Remind from "../adminCard/score/remind"
import Info from "../adminCard/score/info"
import { PersonActivtityAdd } from '../../api/admin'

export default {
  data() {
    return {
      tableData: [],
      // 用来存储多选选中后的数据
      data: [],
      //分页
      pagesize: 5,
      currpage: 1,

      //用来存储search.vue组件传过来的学生学号和姓名,就是tableData的数据
      student: [],
      //添加活动信息后，左侧显示活动信息
      display: false,
      //用来存储search.vue组件传过来的将要添加的活动信息
      information: {},
      set: []
    };
  },
  methods: { 
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    changeSelection(val) {
      // console.log(val);
      this.data = val;
    },
    handleSizeChange(psize) {
      this.pagesize = psize;
    },
    handleCurrentChange(cpage) {
      this.currpage = cpage;
    },
    getTableData(data) {
      // console.log(data)
      
      //对json数组去重，如果存在同样学号就不把后台查询到的数据插入其中
      let c = [...data, ...this.set]
      let d = []
      let hash = {}
      d = c.reduce((item, next) => {
        hash[next['学号']] ? '' : hash[next['学号']] = true && item.push(next)
        return item
      }, [])
      // console.log(d)
      this.set = d

      // data.forEach(item => {
      //   this.student.push(item)
      // })
      // this.tableData = this.student
      

      this.tableData = this.set
    },
    ShowInformation(data) {
      this.display = data.display;
      this.information = data;
    },
    cancelInformation(data) {
      this.display = data.display;
      this.information = data;
      // console.log(this.information);
    },
    studentToAddActivity() {
      let InformationData = this.data
      let information = this.information
      if (!information.score) {
        alert('请先输入需要加分的活动相关信息')
      }
      if (!InformationData.length) {
        alert('请先查询并勾选要进行加分的学生信息')
      }
      if (!!information.score && InformationData.length) {
        let data = []
        let Mydate = information.date
        let year = Mydate.getFullYear().toString()
        let month = Mydate.getMonth() + 1
        let day = Mydate.getDate().toString()
        if (month < 10) {
          month = '0' + month
        } 
        if (day < 10) {
          day = '0' + day
        }
        let {time, date, display, ...newObj} = information
        let activtiyDate = year + month + day
        newObj.date = activtiyDate
        // console.log('new:', newObj)
        InformationData.forEach(element => {
          // element = JSON.parse((JSON.stringify(element) + JSON.stringify(information)).replace(/}{/, ','))
          let ab = {...element, ...newObj}
          data.push(ab)
        })

        if (information.score != '') {
          PersonActivtityAdd(data)
          .then( res => {
            console.log(res.data)
            this.$message({type: 'success', message: '加分成功！'})
          })
          .catch( err => {
            console.log(err)
            this.$message({type: 'error', message: '请求失败，活动未成功添加进去'})
          })
        }
      }
    }
  },
  components: {
    Search,
    Remind,
    Info
  }
};
</script>

<style scoped>
.me-container {
  margin: 30px auto 50px;
  width: 92%;
}
.me-table {
  margin-top: 30px;
}
.me-button {
  margin-top: 30px;
  width: 90%;
}
</style>