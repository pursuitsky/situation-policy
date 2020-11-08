<template>
  <div>
    <!-- <Table
      ref="selection"
      :columns="columns"
      :data="pageData"
      @on-select="handleSelect"
      @on-select-cancel="handleCancel"
      @on-select-all="handleSelectAll"
      @on-select-all-cancel="handleSelectAll"
    ></Table> -->
    <!-- @on-selection-change="handleSelectAllCancel" -->
    <!-- @on-selection-change="handleRowChange -->
    <!-- userData.slice((pageNumber - 1) * pageSize, pageNumber * pageSize) -->
    <!-- <span>总计:{{userData.length}}条 已勾选：{{selectedSum}}条</span> -->
    <!-- <Page
      :total="userData.length"
      @on-change="changepage"
      @on-page-size-change="pages"
      show-total
      show-sizer
      show-elevator
      size="small"
      :page-size="pageSize"
      :current="pageNumber"
    ></Page> -->
    <!--   -->

    <!-- <Button @click="handleSelectAllPage(true)">全选</Button>
    <Button @click="handleSelectAllPage(false)">取消全选</Button> -->

    <Table
      ref="demodate"
      :columns="columns"
      :data="userData.slice((currpage - 1) * pagesize, currpage * pagesize)"
      @on-selection-change="handleRowChange"
      @on-select="handleSelectEL"
      @on-select-cancel="handleCancelEL"
      @on-select-all="handleSelectAllEL"
      @on-select-all-cancel="handleSelectAllELCancel"
    >
      <template slot-scope="{ index }" slot="action">
        <Button type="info"  @click="remove(index)">移除</Button>
      </template>
    </Table>

    <el-pagination
      @prev-click="Checked"
      @next-click="Checked"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[3, 6, 9, 12]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="this.userData.length"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  props:{
    list: {
      type: Array,
      default: []
    }
    // list: Object
    // list: Array
  },
  watch:{
    'list': {
      immediate: true,
      handler(val) {
        // console.log(val)
        this.userData = this.list
      }
    }
  },
  data() {
    return {
      columns: [
        {
          type: "selection",
          width: 60,
          title: "全选",
          align: "center"
        },
        {
          title: "姓名",
          key: "name"
        },
        {
          title: "学号",
          key: "userId",
          width: 180
        },
        {
          title: "活动",
          key: "activity"
        },
        {
          title: "时间",
          key: "time"
        },
        {
          title: "分数",
          key: "score"
        },
        {
          title: '操作',
          slot: 'action',
          width: 100,
          align: 'center'
        }
      ],
      //table表格中的数据 
      userData: [],
      //分页中每页数据
      pageData: [],
      dataCount: 0, //数据总数
      total: 0,
      pageNumber: 1,

      pageSize: 9,
      selectedIds: new Set(), //选中的合并项的id
      selectedSum: 0, //选中的总数量
      importAll: false,

      pagesize: 9,
      currpage: 1,
      Ids: new Set()
    };
  },
  created() {
    this.dataCount = this.userData.length;
    this.pageData = this.userData.slice(0, this.pageSize);
  },
  mounted() {
    // console.log(this.list)
    this.userData = this.list
    // console.log(typeof (this.list))
    // this.setChecked()
    // let data = this.$refs.demodate.data;
    // console.log(data);
    // for (let index in data) {
    //   console.log(data[index].userId);
    //   if (this.Ids.has(data[index].userId)) {
    //     console.log("have Ids mounted");
    //     data[index]._checked = true;
    //     console.log(data[index]._checked);
    //     console.log(this.Ids[index]);
    //   }
    // }
  },
  methods: {
    remove (index) {
      this.userData.splice(index, 1);
    },
    //2触发@on-selection-change
    handleRowChange(Row) {
      // console.log(Row);
      this.$emit('getTableData', Row)
      // alert(Row[0].name);
    },
    //1先触发@on-select
    handleSelectEL(selection, row) {
      this.Ids.add(row.userId);
      row._checked = true;
      // console.log(row);
      // console.log(this.Ids);
    },
    handleCancelEL(selection, row) {
      // alert("el-page-cancel");
      // console.log(selection);
      // alert(row.userId);
      this.Ids.delete(row.userId);
      row._checked = false;
      // console.log(row);
      // console.log(this.Ids);
    },
    handleSelectAllEL(selection) {
      // alert("el-page-all");
      // console.log(selection);
      // console.log(this.$refs.demodate.data);
      selection.forEach(item => {
        this.Ids.add(item.userId);
      });
      // console.log(this.Ids);
      let data = this.$refs.demodate.data;
      let objData = this.$refs.demodate.objData
      //取消全选删除保存在Ids里和当前table数据的userId一致的数据
      // console.log(objData)
      // console.log(data);
      // for (let index in data) { 
      //   console.log(data[index].userId);
      //   if (this.Ids.has(data[index].userId)) {
      //     console.log("have Ids");
      //     data[index]._checked = true;
      //     console.log(data[index]._checked);
      //     console.log(this.Ids[index]);
      //   }
      // }
      for (let i in objData) {
        if (this.Ids.has(objData[i].userId)) {
          objData[i]._isChecked = true
        }
      }
      // console.log(data);
    },
    handleSelectAllELCancel(selection) {
      // alert("el-page-all-cancel");
      // console.log(selection);
      // console.log(this.$refs.demodate.data);
      //取消全选删除保存在Ids里和当前table数据的userId一致的数据
      //当前页的table数据
      let data = this.$refs.demodate.data
      let objData = this.$refs.demodate.objData
      // console.log(data),
      // console.log(selection)
      // console.log(objData)
      //这个地方有问题，item.userId没有被取消
      selection.forEach(item => {
        if (this.Ids.has(item.userId)) {
          this.Ids.delete(item.userId);
        }
      });
      // console.log(this.Ids);
    },
    Checked(selection) {
      let data = this.$refs.demodate.objData;
      // console.log(data);
      // alert('prev-check')
      for (let index in data) {
        // console.log(data[index].userId);
        data[index]._checked = true;
      }
    },

    pages(num) {
      debugger;
      this.pageSize = num;
      this.changepage(1);
    },
    changepage(pageIndex) {
      let start = (pageIndex - 1) * this.pageSize;
      let end = pageIndex * this.pageSize;
      this.pageData = this.userData.slice(start, end);
      this.pageNumber = pageIndex;
      // alert(this.pageNumber);
      var _this = this;
      // setTimeout( function() {
      //   var objData = this.$refs.selection.data
      //   console.log(objData)
      //   // var objData = _this.$refs.selection.$refs.tobody.objData
      //   for (let key in objData) {
      //     if (_this.selectedIds.has(objData[key].userId)) {
      //       objData[key]._isChecked = true
      //     }
      //   }
      // },0)
      this.setChecked();
      //操作完成后清除勾选框
      // this.$refs.userData.clearSelection()
    },

    handleSizeChange(psize) {
      this.pagesize = psize;
      let data = this.$refs.demodate.data;
      // console.log(data);
      for (let index in data) {
        // console.log(data[index].userId);
        if (this.Ids.has(data[index].userId)) {
          // console.log("have Ids mounted");
          data[index]._checked = true;
          // console.log(data[index]._checked);
          // console.log(this.Ids[index]);
        }
      } 
    },
    handleCurrentChange(cpage) {
      this.currpage = cpage;
      let objData = this.$refs.demodate.objData
      for (let i in objData) {
        if (this.Ids.has(objData[i].userId)) {
          objData[i]._isChecked = true
        }
      }
    },
    handleSelectAllPage(status) {
      this.importAll = status;
      this.$refs.selection.selectAll(status);
    },
    handleSelectAll(selection) {
      // console.log(selection);
      //全选
      // console.log(this.$refs.selection.data);
      //取消全选数组为空
      if (selection.length == 0) {
        let data = this.$refs.selection.data;
        data.forEach(item => {
          if (this.selectedIds.has(item.userId)) {
            this.selectedIds.delete(item.userId);
          }
        });
      } else {
        // alert("ee");
        // console.log(this.$refs.selection.data);
        // console.log(selection);
        selection.forEach(item => {
          // this.$refs.selection.data._checked = true;
          this.selectedIds.add(item.userId);
          // console.log(item.userId);
        });
      }
      // if (this.importAll) {
      //   this.selectedSum = this.total;
      // } else {
      this.selectedSum = this.selectedIds.size;
      // }
    },
    // handleSelectAllCancel(selection) {
    //   alert('11')
    //   selection.forEach(item => {
    //     this.$refs.selection.data._checked = true ;
    //     this.selectedIds.delete(item.userId);
    //     console.log(this.$refs.selection.data._checked);
    //     console.log('22')
    //   });
    // },
    handleSelect(selection, row) {
      // row._checked = true
      // alert("b");
      this.selectedIds.add(row.userId);
      this.selectedSum++;
    },
    handleCancel(selection, row) {
      // alert("bb");
      this.selectedIds.delete(row.userId);
      this.selectedSum--;
    },
    setChecked() {
      if (!this.$refs.selection || !this.$refs.selection.data) {
        return null;
      }
      let objData = this.$refs.selection.data;
      // alert(this.importAll);
      // if (!this.importAll) {
      // alert("hh");
      // alert(objData);
      // console.log(objData);
      for (let index in objData) {
        // console.log(this.selectedIds.has(objData[index].userId));
        if (!this.selectedIds.has(objData[index].userId)) {
          objData[index]._isChecked = true;
          // console.log(index);
        }
      }
      // }
    }
  }
};
</script>

<style scoped>
.el-pagination{
  margin-top: 30px;
}
</style>