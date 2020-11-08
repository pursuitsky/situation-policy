<template>
  <el-card class="my-card">
    <el-avatar  shape="square" :size="120" :src="url"></el-avatar>
    <!-- <el-avatar v-else shape="square" :size="120" :src="avatar"></el-avatar> -->
    <br>
    <br>
    <!-- <h4>
      <span>{{user.class}}</span>
    </h4> -->
    <h2>
      <span>{{user.name}}</span>
    </h2>
    <h5>
      <span>{{user.class}}</span>
    </h5>
    <h5>
      <span>{{user.userid}}</span>
    </h5>
    <p class="my-score">
      <span>你的形式与政策总分是</span>
    </p>
    <p class="score">
      <span>{{user.score}}</span>
    </p>
    <!-- <button type="button" class="btn btn-link" @click="LearnMore">点击了解我的加分信息</button> -->
    <p>
      <el-link @click="LearnMore" class="me-link" :underline="false">点击了解我的加分信息</el-link>
    </p>
    <!-- <br>
    <p>
      <el-link @click="LearnMore" class="me-link" :underline="false">点我查看修改个人信息</el-link>
    </p> -->

    <el-button type="primary" round @click="PersonInformation" class="me-information-button">个 人 信 息</el-button>
    <!-- <el-button type="primary" round @click="dialogFormVisible = true">修改密码</el-button> -->

  </el-card>
</template>

<script>
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.min.js";
import { getUserInformation, updatePassword, getInformation } from "../../api/student";
export default {
  name: "MyScoreInformation",
  created() {
    this.getInformation()
  },
  data() {
    return {
      dialogFormVisible: false,
      url: '',
      avatar: 'http://localhost:9090/api/static/logo.png',
      passwordForm: {
        password: "",
        passwordSure: ""
      },
      rules: {
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { max: 20, message: "不能大于20个字符", trigger: "blur" }
        ],
        passwordSure: [
          { required: true, message: "请确认密码", trigger: "blur" },
          { max: 20, message: "不能大于20个字符", trigger: "blur" }
        ]
      },
      user: {}
    };
  },
  mounted(){ 
    // 这里有个问题第一次登录后创造该组件的时候，sessionStorage如果是1，退出后再登录显示的是1，刷新后是2,组件间生命周期问题
    // console.log(sessionStorage)
    // if (sessionStorage.getItem('avatar') != '') {
      // this.url = sessionStorage.getItem('avatar')
      // location. reload()
    // } else {
    //   this.url = 'http://localhost:9090/api/static/logo.png'
    // }
    // this.$parent.$data
    // console.log(this.$parent.$data)
    // console.log(!sessionStorage)
    // console.log(sessionStorage.length)

    //在welcome视图创造生成学生记录之后执行
    //主要是判断用户第一次登录时，图像显示为默认还是显示成自己提交的图像
    if (sessionStorage.length == 0) {
        let id = localStorage.account
        let name = localStorage.name
        getInformation(id, name).then(res => {
          // console.log(res.data)
          if (res.data.data.length != 0) {
              this.nickname = res.data.data[0].nickname
              this.url = res.data.data[0].avatar
              this.email = res.data.data[0].email
              sessionStorage.setItem('nickname', this.nickname)
              sessionStorage.setItem('avatar', this.url)
              sessionStorage.setItem('email', this.email)
              // console.log(sessionStorage)
              if (this.url == '' || this.url == null) {
                this.url = this.avatar
                sessionStorage.setItem('avatar', this.avatar)
              } 
              if (this.nickname == null) {
                sessionStorage.setItem('nickname', '')
              } 
              if (this.email == null) {
                sessionStorage.setItem('email', '')
              }
          } else {
              sessionStorage.setItem('nickname', '')
              sessionStorage.setItem('avatar', this.avatar)
              sessionStorage.setItem('email', '')
              // console.log(sessionStorage)
              this.url = this.avatar
          }
      })
      .catch(err => {
            console.log(err)
      })
    } else {
      this.url = sessionStorage.getItem('avatar') != '' ? sessionStorage.getItem('avatar'): this.avatar
    }
  },
  methods: {
    LearnMore() {
      this.$router.push({
        path: "/welcome/details",
        query: { 
          userId: this.$route.query.userId
        }
      });
    },
    PersonInformation(){
      this.$router.push({
        path: "/welcome/person",
        query: { 
          userId: this.$route.query.userId
        }
      })
    },
    getInformation() {
      let _this = this;
      // console.log(localStorage.account)
      getUserInformation(localStorage.account)
        .then(res => {
          // _this.user = res.data.data;
          // console.log(res.data.data)
          _this.user = res.data.data[0]
          localStorage.setItem('class', _this.user.class)

        })
        .catch(error => {
          _this.$message({ type: "error", message: "数据请求失败" });
        });
    },
  }
};
</script>
<style scoped>
.el-avatar {
  margin-top: 20px;
}
.my-card {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  line-height: 1.7;
  letter-spacing: 2px;
  margin-top: 15px;
}
h2 {
  font-size: 35px;
  letter-spacing: 6px;
  margin-bottom: 0.5rem;
  font-weight: 500;
  line-height: 1.2;
}
h4 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  line-height: 1.2;
  /* margin-block-start: 1.33em;
  margin-block-end: 1.33em;
  margin-inline-start: 0px;
  margin-inline-end: 0px; */
}
h5 {
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
  font-weight: 500;
  line-height: 1.2;
  font-size: 1.25rem;
}
h1,h2,h3,h4,h5,h6 {
    margin-bottom: .5rem;
    font-weight: 500;
    line-height: 1.2;
}
/* p{   
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
} */
.my-score {
  margin-top: 40px;
  font-size: 20px;
  color: rgb(8, 8, 5);
}
.score {
  font-size: 60px;
  margin-bottom: 20px;
}
.btn-link {
  color: #337ab7;
}
.me-link {
  color: #337ab7;
  /* padding: 0.375rem 0.75rem; */
  font-size: 1rem;
  letter-spacing: 0;
  line-height: 0.5;
  background-color: #130e0e00;
  margin-bottom: 15px;
  padding-left: 5px;
}
.me-dialog {
  text-align: justify;
}
.me-link:hover {
  color: #0056b3;
  text-decoration: underline;
}
.me-information-button {
  margin-top: 10px;
}
/* -blue: #007bff;
--indigo: #6610f2;
--purple: #6f42c1;
--pink: #e83e8c;
--red: #dc3545;
--orange: #fd7e14;
--yellow: #ffc107;
--green: #28a745;
--teal: #20c997;
--cyan: #17a2b8;
--white: #fff;
--gray: #6c757d;
--gray-dark: #343a40;
--primary: #007bff;
--secondary: #6c757d;
--success: #28a745;
--info: #17a2b8;
--warning: #ffc107;
--danger: #dc3545;
--light: #f8f9fa;
--dark: #343a40; */
</style>