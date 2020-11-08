<template>
  <div>
    <el-table
      :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize).filter(data => !search || data['姓名'].toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%"
      border
      @expand-change="expandChange"
      id="myTable"
    >
      <el-table-column type="expand">
        <!-- 方法一 -->
        <!-- <template slot-scope="slot" class="me-form">

          <el-form
            label-position="left"
            class="demo-table-expand"
            size="medium"
            label-width="100px"
          >
          <div 
            v-for="(value, key) of data" 
            :key="key" 
            :ref="`list${key}`"
          >
            <el-form-item  :label="key" class="me-el-form-item">
              <div style="display:none">{{ slot.row }}</div>
                <el-row>
                  <el-col :span="8" :offset="5"><div :ref="key">{{ value }}</div></el-col>
                  <el-col :span="8" :offset="3" v-if="Judge_two(key)">
                    <el-button 
                      type="warning" 
                      size="mini" 
                      @click="HandleEdit(key, value)"
                    >编辑</el-button>
                  </el-col>
                  <el-col :span="8" :offset="3" v-if="Judge_one(key)">
                    <el-button 
                      type="info" 
                      size="mini" 
                      @click="Del(key, value)"
                    >删除</el-button>
                  </el-col>
                </el-row>
            </el-form-item>
          </div>

          </el-form>

        </template> -->

        <!-- 方法二 -->
        <template slot-scope="props" class="me-form">
          <el-form
            label-position="left"
            class="demo-table-expand"
            size="medium"
            label-width="100px"
          >

            <div v-for="(item, index) of props.row" :key="item+index" :ref="`list${index}`">
              <el-form-item 
                :label="index" 
                v-show="isActive" 
              >
                <el-row>
                  <el-col :span="8" :offset="5">{{ item }}</el-col>
                  <el-col :span="8" :offset="3" v-if="Judge_two(index)">
                    <el-button 
                      type="warning" 
                      size="mini" 
                      @click="HandleFormEdit(index, item, props.row['学号'])"
                    >编辑</el-button>
                  </el-col>
                  <el-col :span="8" :offset="3" v-if="Judge_one(index)">
                    <el-button 
                      type="info" 
                      size="mini" 
                      @click="HandleDelete(index, item, props.row['学号'], props.row)"
                    >删除</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </div>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column label="姓名" prop="姓名" width="150"></el-table-column>
      <el-table-column label="班级" prop="班级" width="150"></el-table-column>
      <el-table-column label="学号" prop="学号" width="150"></el-table-column>
      <!-- <el-table-column label="总分" prop="总分" width="150"></el-table-column> -->
      <!-- <el-table-column align="right" fixed="right" width="150px"> -->
      <el-table-column align="right">
        <template slot="header">
          <el-input v-model="search" size="mini" placeholder="输入姓名关键字搜索" />
        </template>
        <template slot-scope="scope" align="left">
          <el-button size="mini" type="text" @click="handleFind(scope.$index, scope.row)">查看</el-button>
          <el-button
            @click.native.prevent="deleteRow(scope.$index, scope.row, tableData)"
            type="danger"
            size="small"
            class="me-button"
          >移除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      small
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-size="pagesize"
      layout="prev, pager, next"
      :total="this.tableData.length"
    ></el-pagination>
    
    <!-- 对话框 -->
    <el-dialog :title="Title" :visible.sync="dialogTableVisible" class="me-dialog">
      <el-table :data="dateList" stripe border>
        <el-table-column property="日期" label="日期" width="150"></el-table-column>
        <el-table-column property="活动" label="活动" width="200"></el-table-column>
        <el-table-column property="分数" label="分数"></el-table-column>
      </el-table>
    </el-dialog>

     <el-dialog :title="EditTitle" :visible.sync="dialogFormVisible" width="30%" class="me-dialog">
      <!-- <el-form :model="form"  size="medium">
        <label style="display:none" :ref="`id${user}`">{{ EditLabel }}</label>
        <span style="display:none" :ref="`userId${usertag}`">{{ tagId }}</span>
        <el-form-item prop="value_one" class="me-form-item">
          <el-input
            placeholder="修改前信息"
            v-model="form.value_one"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item prop="value_two" class="me-form-item">
          <el-input
            placeholder="输入将要修改的信息"
            v-model="form.value_two"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item class="me-form me-form-item">
          <el-button type="primary" @click="updateInformation">提 交</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </el-form-item>
      </el-form> -->
      <Edit :editList="EditList" v-on:Dialog="setDialog"></Edit>
    </el-dialog>
    <!-- <Excel></Excel> -->
    <!-- <el-button @click="console.log(data)" type="success">点 击</el-button> -->
  </div>
</template>

<script>
import Bus from '../../../eventBus/eventBus'
import { 
  deleteStudentAllInformation, 
  updateStudentInformation, 
  deleteSingleActivity,
  obtainInformationById,
  obtainActivityById } from '../../../api/superadmin'
import { Message } from 'element-ui'
import Edit from './edit'
import Excel from './excel'

export default {
  components:{
    Edit,
    Excel
  },
  data() {
    return { 
      tableData: [],
      search: "",
      data:{},
      dateList: [],
      pagesize: 4,
      currpage: 1,
      //内嵌table的数据
      keyList: [],
      valueList: [],
      isActive: true,
      Title: '',
      EditTitle: '',
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        value_one: '',
        value_two: ''
      },
      user: '',
      EditLabel: '',
      usertag: '',
      tagId: '',
      EditList: []
    };
  },
  // created(){
  //   console.log(this.data)
  //   alert(this.data)
  //   this.data = this.tableData.slice((currpage - 1) * pagesize, currpage * pagesize)
  // },
  watch: {
    'tableData': {
      handler: function(newval, oldval) {
        // console.log(newval)
        // console.log(oldval)
      }
    }
  },
  mounted() {
    let _this = this
    Bus.$on('searchByValue', function(data) {
      //this.tableData数据为undefined,为什么直接使用this不行，而是let _this = this后用_this.tableData可以访问到数据
      // console.log(this.tableData)

      _this.tableData = data
      //访问的到外面的tableData
      // console.log(_this.data)

      //这里可以在内部得到tableData的值，但是无法得到外部的，是undefined
      // this.tableData = data
      // console.log(this.tableData)
    })
  },
  methods: {
    expandChange(row, expandRow) {
      let userId = expandRow[0]['学号']
      obtainInformationById(userId).then( res => {
        let data = res.data
        this.data = data
      }).catch( err => {
        Message({type: 'error', message: '数据加载失败'})
      })
    },

    //判断按钮是编辑还是删除
    Judge_one(index) {
      let flag = false
      if (index != '学号' && index != '姓名' && index != '密码' && index !='班级' && index != '总分') {
        let flag = true
        return flag
      } else {
        return flag
      }
    },
    Judge_two(index) {
      let flag = false
      if (index == '姓名' || index == '密码' || index == '班级' || index == '总分') {
        let flag = true
        return flag
      } else {
        return flag
      }
    },

    handleFind(index, row) {
      let id = row['学号']
      let name = row['姓名']
      let Class = row['班级']
      let data = []
      this.dateList = data
      this.Title = Class + name + '的加分细则：'
      this.dialogTableVisible = true
      obtainActivityById(id).then( res => {
        let data = res.data.data
        this.dateList = data
      }).catch( err => {
        console.log(err)
        Message({type: 'error', message: '加载信息失败'})
      })
    },

    deleteRow(index, rows, tableData) {
      let id = rows['学号']
      this.$confirm(
        "此操作将永久删除该同学的所有信息请慎重操作, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          //为啥req失败也执行.then()
          deleteStudentAllInformation(id)
          .then( res => {
            // console.log(res)
            this.$message({
              type: "success",
              message: "删除成功!"
            })
            tableData.splice(index, 1)
          })
          .catch( err => {
            Message({
              type: 'error',
              message: '信息删除失败'
            })
          })
          // tableData.splice(index, 1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 方法一的编辑方法
    HandleEdit(key, value) {
      //添加属性
      // let data = {
      //   userId: userId
      // }
      // data[key] = value
      // console.log(data)
      let index = this.$refs['学号'][0].innerText
      console.log(this.$refs['学号'])
      this.EditTitle = '修改' + key
      this.EditLabel = key
      this.user = index
      this.usertag = index
      this.tagId = index
      let obj = {}
      obj['学号'] = index
      obj[key] = value
      console.log(obj)
      let list = []
      list.push(obj)
      this.EditList = list
      console.log(this.EditList)
      console.log(index)
      this.form.value_one = value
      this.dialogFormVisible = true
    },

    //方法二的编辑方法
    HandleFormEdit(key, value, id) {
      this.EditTitle = '修改' + key
      let obj = {}
      obj['学号'] = id
      obj[key] = value
      let list = []
      list.push(obj)
      this.EditList = list
      this.dialogFormVisible = true
    },

    //编辑弹窗里面的操作方法
    updateInformation(){
      // let 
      let key_name = this.$refs[`id${user}`][0].innerText
      let user_id = this.$refs[`userId${usertag}`][0].innerText
    },

    //方法一中的删除操作
    Del(key, value) {
      // this.$refs[key][0].style.display = 'none'
      let index = this.$refs[`list${key}`]
      let id = this.$refs['学号'][0].innerText
      this.$refs[`list${key}`][0].style.display = 'none'
      // console.log(index)
      let data = {}
      data[key] = value
      data['学号'] = id
      this.$confirm(
        `"此操作将从后台数据库删除该同学的此项活动, 是否继续?"`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
      .then(() => {
        deleteSingleActivity(data).then( res => {
          console.log(res)
          this.$message({type: 'success', message: `该同学${key}活动已经删除`})
        }).catch( err => {
          this.$message({type: 'error', message: `该同学的${key}活动删除失败`})
        })
      })
    },

    //方法二中的删除操作
    HandleDelete(key, value, userId, row) {
      //删除将要删除的活动情况的DOM
      let index = this.$refs[`list${key}`][0]
      this.$refs[`list${key}`][0].style.display = 'none'

      let data = {
        userId: userId
      }
      data[key] = value
      // console.log(data)
      // console.log(row)
      // console.log(this.tableData)
      delete row[key]
      // console.log(row)
      // for (let [key, value] of Object.entries(row)) {
      //   console.log(key + ' : ' + value)
      // }
      // this.$message({type: 'success', message: `该同学${key}活动已经删除`})
      this.$confirm(
        `"此操作将从后台数据库删除该同学的此项活动, 是否继续?"`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
      .then(() => {
        deleteSingleActivity(data).then( res => {
          // console.log(res)
          this.$message({type: 'success', message: `该同学${key}活动已经删除`})
        }).catch( err => {
          this.$message({type: 'error', message: `该同学的${key}活动删除失败`})
        }) 
      })
    },
    
    //table表格上的过滤按钮
    MySearch(date) {
      let find;
      find =
        !this.search ||
        data.name.toLowerCase().includes(this.search.toLowerCase()) ||
        data["班级"].toLowerCase().includes(this.search.toLowerCase()); 
    },

    //分页操作
    handleSizeChange(psize) {
      this.pagesize = psize;
      // alert(`每页 ${psize} 条`);
    },
    handleCurrentChange(cpage) {
      this.currpage = cpage;
      // alert(`当前页: ${cpage}`);
    },

    setDialog(dialog) {
      // console.log(dialog)
      this.dialogFormVisible  = dialog
    },

    //没有用到，后来写在单独组件里面了
    ObjectValueAndKey() {
      let list = this.tableData
      let KeyList = []
      let ValueList = []
      console.log(list)
      list.forEach(item => {
        for (let [key, value] of Object.entries(item)) {
          console.log(key, value)
          KeyList.push(key)
          ValueList.push(value)
          // console.log(value)
        }
      })
      //数组去重
      // //先将数组转化为Set数据类型，然后再转回数组类型
      // let dedupeArr = Array.from(new Set(arr1));
      let newArr = []
      let newVal = []
      newArr = KeyList.filter(item => newArr.includes(item) ? '' : newArr.push(item))
      this.keyList = newArr
      newVal = ValueList.filter(item => newVal.includes(item) ? '' : newVal.push(item))
      this.valueList = newVal
      console.log(this.keyList)
      console.log(this.valueList)
      let obj = {
        班级: '计科1704',
        学号: 123456,
        name: 'wym'
      }
      for (let i in obj) {
        console.log('键：', i)
        console.log('值：', obj[i])
      }
    }
  }
};
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
}
.el-form-item {
  border-bottom: 1px dashed #dcdfe6;
}
.me-form-item {
  border-bottom: none;
}
span {
  margin-left: 120px;
  min-width: 200px;
}
.me-form {
  width: 200px;
  /* text-align: center; */
  margin-left: 100px;
}
.me-button {
  margin-right: 40px;
}
.el-pagination{
  margin-top: 30px;
}
.active{
  display: none;
}
.me-dialog {
  text-align: justify;
}
</style>