<template>
  <div>
  <el-card shadow="hover" class="me-card">
    <!-- <el-form :model="formInline">
    <el-form-item> -->
    <div>
      <input
        type="file"
        ref="inputer"
        id="me-file-input"
        @change="selectFile($refs.inputer.files[0])"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      />
      <el-button size="small" type="primary" @click="trigbutton">点击上传</el-button>
    </div>
    <!-- </el-form-item> -->
      <!-- 导出table中的数据 -->
    <!-- <el-button type="success" v-on:click="ExportExcel">导 出</el-button> -->
    <br>
    <!-- <el-form-item> -->
    <div>
      <el-select v-model="value" clearable placeholder="请选择班级">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.value"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button type="warning" v-on:click="expExcel">导 出</el-button>
    </div>
    <!-- </el-form-item> -->
    <br>
    <!-- <el-form-item> -->
    <div>
      <el-select v-model="valuetable" clearable placeholder="请选择年级">
        <el-option
          v-for="item in optionstable"
          :key="item.value"
          :label="item.value"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button type="danger"  v-on:click="deleteTableByGrade">删 除</el-button>
    </div>
    <!-- </el-form-item>
    <el-form> -->
  </el-card>
  </div>
</template>

<script>
import XLSX from "xlsx"
import FileSaver from "file-saver"
import { 
  ImportExcelData, 
  ExportExcelData, 
  getStudentTable, 
  DeleteStudentTableByGrade 
} from '../../../api/superadmin'

export default {
  data() {
    return {
      formInline: {
          user: '',
          region: ''
        },
      dataList: [],
      options: [{
          value: '计科1601'
        },{
          value: '计科1602'
        },{
          value: '计科1603'
        },{
          value: '计科1604'
        },{
          value: '生信1601'
        },{
          value: '生信1602'
        },{
          value: '计科1701'
        },{
          value: '计科1702'
        },{
          value: '计科1703'
        },{
          value: '计科1704'
        },{
          value: '生信1701'
        },{
          value: '生信1702'
        },{
          value: '计科1801'
        },{
          value: '计科1802'
        },{
          value: '计科1803'
        },{
          value: '计科1804'
        },{
          value: '生信1801'
        },{
          value: '生信1802'
        },{
          value: '大数据1801'
        },{
          value: '大数据1802'
        },{
          value: '计科1901'
        },{
          value: '计科1902'
        },{
          value: '计科1903'
        },{
          value: '计科1904'
        },{
          value: '生信1901'
        },{
          value: '生信1902'
        },{
          value: '大数据1901'
        },{
          value: '大数据1902'
      }],
      value: '',
      optionstable: [],
      valuetable: ''
    }
  },
  mounted(){
    getStudentTable().then(res =>{
      let data = res.data.data
      // console.log(data)
      let list = []
      for (let i of data) {
        let obj = {}
        obj.value = i
        list.push(obj)
      }
      this.optionstable = list
      // console.log(list)
    })
  },
  methods: {
    /*
        FileReader共有4种读取方法：
        1.readAsArrayBuffer(file)：将文件读取为ArrayBuffer。
        2.readAsBinaryString(file)：将文件读取为二进制字符串
        3.readAsDataURL(file)：将文件读取为Data URL
        4.readAsText(file, [encoding])：将文件读取为文本，encoding缺省值为'UTF-8'
    */
    importf(obj) {
      let _this = this;
      let inputDOM = this.$refs.inputer; // 通过DOM取文件数据
      this.file = event.currentTarget.files[0] || event.target.files[0];
      var rABS = false; //是否将文件读取为二进制字符串
      var f = this.file;
      var reader = new FileReader();
      //if (!FileReader.prototype.readAsBinaryString) {

      FileReader.prototype.readAsBinaryString = function(f) {
        var binary = "";
        var rABS = false; //是否将文件读取为二进制字符串
        var pt = this;
        var wb; //读取完成的数据
        var outdata;
        var reader = new FileReader();
        reader.onload = function(e) {
          var bytes = new Uint8Array(reader.result);

          var length = bytes.byteLength;

          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          //   var XLSX = require("xlsx");

          if (rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), {
              //手动转化

              type: "base64"
            });
          } else {
            wb = XLSX.read(binary, {
              type: "binary"
            });
          }
          // outdata就是你想要的东西 excel导入的数据
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
          // excel 数据再处理
          let arr = [];
          outdata.map(v => {
            let obj = {};
            obj.account = v.account;
            obj.name = v.name;
            obj.department = v.department;
            obj.secondDepartment = v.secondDepartment;
            obj.status = v.status;
            obj.id = v.id;
            arr.push(obj);
          });

          _this.accountList = [...arr];
          console.log(_this.accountList);
          //   _this.reload();
        };
        reader.readAsArrayBuffer(f);
      };
      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    },

    //采用这种方法上传的excel文件
    selectFile(file) {
      this.per = 100;
      console.log(file);
      // console.log("文件名称：",file.name)
      var reader = new FileReader();
      reader.onload = e => {
        let data = new Uint8Array(e.target.result);
        var xlsxData = XLSX.read(data, { type: "array" });
        // console.log(xlsxData);
        let sheetNames = xlsxData.SheetNames;
        let sheet = xlsxData.Sheets[sheetNames[0]];
        data = XLSX.utils.sheet_to_json(sheet);
        let tdName = "__EMPTY_5";
        let tdNameOfKind = "__EMPTY";
        let changedArr = data.map(item => {
          if (tdName in item && typeof item[tdName] == "number") {
            item[tdName] = new Date(1900, 0, item[tdName] - 1).toLocaleString();
            item[tdName] = item[tdName].replace(
              /(\d+)\/(\d+)\/(\d+)\s[\u4e00-\u9fa5]+(\d{2}:){2}\d{2}/,
              "$1/$2/$3"
            );
          }
          if (tdNameOfKind in item && /^[\w]+$/.test(item[tdNameOfKind])) {
            item.kindCode = item[tdNameOfKind].slice(0, 4);
            item.engineCode = item[tdNameOfKind].slice(4, 6);
            item.gear = item[tdNameOfKind].slice(6, 7);
            item.colorCode = item[tdNameOfKind].slice(7, 9);
          }

          return item;
        });
        let dataList = changedArr.slice(0);
        // console.log(dataList);
        let obj = {}
        obj.dataList = dataList
        obj.name = file.name
        // console.log(obj)
         ImportExcelData(obj).then( res => {
          let data = res.data
          console.log(res)
        }).catch( err => {
          console.log(err)
        })
      };
      reader.readAsArrayBuffer(file);
    },

    //Iview框架自带的excel文件导出
    ExportExcel() {
      let wb = XLSX.utils.table_to_book(document.querySelector("#myTable"));
      let wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
        // type: 'base64'
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          "data.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") {
          console.log(e, wbout); 
        }
      }
      return wbout;
    },

    //导出的方法
    expExcel() {
      this.$confirm(
        `"此操作将从后台数据库导出${this.value}学生信息表, 是否继续?"`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
          require.ensure([], () => {
          const { export_json_to_excel } = require("../../../excel/Export2Excel");
          // const tHeader = ["用户名", "操作类型", "操作时间", '操作内容'];
          // // 上面设置Excel的表格第一行的标题
          // const filterVal = ["operationName", "operationType", "operationDate",'operationMsg'];
          // // 上面的index、nickName、name是tableData里对象的属性
          // // const list = this.tableData; //把data里的tableData存到list
          // const list = [{"operationName":1, "operationType":2, "operationDate":3,'operationMsg':4}]
          const tHeader = []
          const filterVal = []
          let information = this.value
          let list = []
          ExportExcelData(information).then( res => {
            list = res.data.data
            // console.log(list)
            for (let [key, value] of Object.entries(list[0])) {
              tHeader.push(key)
              filterVal.push(key)
            }
            const data = this.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, `${this.value}班形式与政策分统计表`);
          }).catch( err => {
            console.log(err)
          })
          // console.log(list)
          // tHeader = tHeader.filter(item => tHeader.includes(item) ? '' : tHeader.push(item))
          // filterVal = filterVal.filter(item => filterVal.includes(item) ? '' : filterVal.push(item))
        });
      })
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    trigbutton(){
      this.$confirm(
        "此操作将永久向后台数据库插入学生信息表请慎重操作, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          var ie=navigator.appName=="Microsoft Internet Explorer" ? true : false; 
          if(ie){ 
          　　document.getElementById("me-file-input").click(); 
          }else{
          　　var a=document.createEvent("MouseEvents");//FF的处理 
          　　a.initEvent("click", true, true);  
          　　document.getElementById("me-file-input").dispatchEvent(a); 
          } 
        })
    },

    deleteTableByGrade() {
      let value = this.valuetable
      this.$confirm(
        `"此操作将从后台数据库删除${value}, 一旦删除将无法恢复, 一定请谨慎操作, 是否继续?"`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        DeleteStudentTableByGrade(value).then( res => {
          // console.log(res.data.msg)
          this.$message({type:'success', message: res.data.msg})
        }).catch( err => {
          console.log(err)
        })
      })
    }
  }
};
</script>

<style scoped>
#me-file-input{
    float: left;
    position:absolute;
    opacity: 0;
	  display: none;
    overflow: hidden;
    cursor: pointer;
    z-index: 99;
}
.me-card {
  margin-top: 30px;
}
</style>