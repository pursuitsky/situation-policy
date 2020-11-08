<template>
  <div v-title data-title="问题反馈 - 形势与政策">
    <div class="me-question">

      <!-- <div v-for="item in data.slice((currpage - 1) * pagesize, currpage * pagesize)" :key="item"> -->
      <div class="me-card">
        <user-card 
          class="me-card-question" 
          v-for="(item,index) in data.slice((currpage - 1) * pagesize, currpage * pagesize)" 
          :key="index"
          v-bind="item">
        </user-card>
      </div>
     
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="pagesize"
        layout="prev, pager, next"
        :total="this.data.length"
      ></el-pagination>
    </div>
    <!-- <div class="me-page-question">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="pagesize"
        layout="prev, pager, next"
        :total="this.data.length"
      ></el-pagination>
    </div> -->

  </div>
</template>

<script>
import UserCard from "../adminCard/question/userCard"
import page from "../adminCard/question/page"
// import MePage from "../adminCard/question/page/mePage"
import { getStudentQuestion } from '../../api/admin'

export default {
  components: {
    UserCard,
    page
  },
  // 后台传来的数据
  data() {
    return {
      data: [],
      // 所有页面的数据
      totalPage: [],
      // 每页显示的数量
      pageSize: 3,
      //共几页
      pageNum: 1,
      //当前显示的数据
      dataShow: [],
      //默认当前显示第一页
      currentPage: 2,
      pagesize: 6,
      currpage: 1
    }
  },
  created() {
    //   this.pagePart()
    this.studentQuestion()
  },
  methods: {
    pagePart() {
      // alert(this.data.length);
      //根据数据的条数和每页显示数量算出一共几页，得0时设为1
      this.pageNum = Math.ceil(this.data.length / this.pageSize) || 1;
      // alert(this.pageNum);
      //根据页数对数组分组，并存进每一页
      for (let i = 0; i < this.pageNum; i++) {
        //每一页都是一个数组，形如[[第一页数据]]、[[第二页数据]]...
        //根据每页显示的数量，将后台的数据分割到每一页，假设pageSize为6，则第一页是1-6(slice操作则是0-6),第二页是7-12
        this.totalPage[i] = this.data.slice(
          this.pageSize * i,
          this.pageSize * (i + 1)
        );
        console.log(this.totalPage[i]);
      }
      //设置默认显示页，上一页下一个，只需要切换当前页面的索引值
      //当前显示的内容
      //   this.dataShow = this.totalPage[this.currentPage++]
      //   console.log(this.dataShow)
      //   this.dataShow = this.totalPage[this.currentPage--]
      //   console.log(this.dataShow)
    },
    nextPage() {
      //   alert(this.currentPage++)
      if (this.currentPage == this.pageNum - 1) return;
      this.dataShow = this.totalPage[this.currentPage++];
      // alert(this.currentPage);
      console.log(this.dataShow);
    },
    prePage() {
      //   alert(this.currentPage--)
      if (this.currentPage == 0) return;
      this.dataShow = this.totalPage[this.currentPage--];
      // alert(this.currentPage);
      console.log(this.dataShow);
    },
    // handleSizeChange(val) {
    //   alert(`每页 ${val} 条`);
    // },
    // handleCurrentChange(val) {
    //   alert(`当前页: ${val}`);
    // },

    handleSizeChange(psize) {
      this.pagesize = psize;
      // alert(`每页 ${psize} 条`);
    },

    handleCurrentChange(cpage) {
      this.currpage = cpage;
      // alert(`当前页: ${cpage}`);
    },
    
    studentQuestion() {
      getStudentQuestion().then( res => {
        // console.log(res.data)
        this.data = res.data.data
        // this.$message({type: 'success', message: '问题已经加载完成'})
      }).catch(err => {
        this.$message({type: 'success', message: '学生反映的问题加载失败'})
      })
    }
  }
};
</script>

<style scoped>
.me-question {
  width: 80%;
  margin: 60px auto 60px;
  /* float: left; */
}
.me-page-question {
  width: 80%;
  float: left;
}
.me-card {
  width: 100%;
}
.me-card-question {
  float: left;
  width: 300px;
  margin-left: 30px;
  margin-top: 20px;
}
.me-page {
  float: left;
  /* margin: 20px auto 30px; */
  margin-left: 12%;
  margin-top: 30px;
  /* text-align: center; */
}
.mypage {
  float: left;
  margin-top: 30px;
}
.el-pagination {
  float: left;
  margin-left: 40%;
  margin-top: 30px;
  padding-bottom: 30px;
}
</style>