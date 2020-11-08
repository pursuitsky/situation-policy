<template>
<div class="me-person">
    <div class="container">
        <div class="left">
            <div class="user">
                <el-avatar v-if="srcUrl" :size="120"  :src="srcUrl"></el-avatar>
                <el-avatar v-else-if="url" :size="120"  :src="url"></el-avatar>
                <el-avatar v-else :size="120"  :src="imageUrl"></el-avatar>
                <!-- <img  src="../../assets/logo.png"> -->
                <div class="nick">{{nickname}}</div>
                <div class="email">{{email}}</div>
            </div>
            <div>
                <el-button type="primary" round @click="dialogFormVisible = true" class="me-information-button">修 改 密 码</el-button>
            </div>
        </div>
        <div class="right">
            <div class="person">
                <i class="el-icon-date"></i> 个人信息
            </div>

            <div class="upload_picture">
                <input 
                  accept="image/*" 
                  name="img" 
                  id="upload_file" 
                  type="file" 
                  @change="update2"
                />
                <input 
                  class="file" 
                  name="file" 
                  type="file" 
                  id="me-file-input" 
                  accept="image/*" 
                  @change="update"
                />

                <el-form>
                    <el-form-item>
                        <el-row>
                            <el-col :span="4" class="form-left">头像上传</el-col>
                            <el-col :span="8" :offset="1">
                                <div class="avatar-uploader">
                                    <img v-if="srcUrl" :src="srcUrl" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon" @click="trigButton"></i>
                                </div>
                            </el-col>
                            <el-col :span="4" :offset="1" class="form-right">
                                <el-button v-if="srcUrl != ''" type="primary"  @click="trigButton" >重新上传</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </div>  

            <el-form :model="userForm" ref="userForm" :rules="userRules" size="medium" class="update-form">
                <el-form-item>
                    <el-row>
                        <el-col :span="4">昵称：</el-col>
                        <el-col :span="8">
                            <el-input
                                placeholder="输入昵称"
                                v-model="userForm.nickname"
                                autocomplete="off"
                                clearable
                            ></el-input>
                        </el-col>
                        <el-col :span="5">
                            <el-button type="primary" @click="submitNick">修 改</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>

                <el-form-item>
                    <el-row>
                        <el-col :span="4">邮箱：</el-col>
                        <el-col :span="8">
                            <el-input
                                placeholder="输入邮箱"
                                v-model="userForm.email"
                                autocomplete="off"
                                clearable
                            ></el-input>
                        </el-col>
                        <el-col :span="5">
                            <el-button type="primary" @click="submitEmail">修 改</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>

                <!-- <el-form-item>
                    <el-row>
                        <el-col :span="6" :offset="4">
                            <el-button type="primary" @click="submitEmail">提 交</el-button>
                        </el-col>
                    </el-row>
                </el-form-item> -->
            </el-form>
        </div>
    </div> 
    <div class="footer">
        <pre>华中农业大学信息学院沸点工作室    <a>联系方式：feidianstudio2010@163.com</a></pre>
    </div>  

    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="30%" class="me-dialog">
      <el-form :model="passwordForm" :rules="rules" size="medium">
        <el-form-item prop="password">
          <el-input
            placeholder="输入密码"
            v-model="passwordForm.password"
            autocomplete="off"
            show-password
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item prop="passwordSure">
          <el-input
            placeholder="确认密码"
            v-model="passwordForm.passwordSure"
            autocomplete="off"
            show-password
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="updatePassword">提 交</el-button>
          <el-button @click="resetForm">重 置</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
</div>
</template>

<script>
import axios from 'axios'
import { updatePassword, updateEmail, updateNick } from "../../api/student"
import Bus from '../../eventBus/eventBus'

export default {
    data(){
        return {
            srcUrl: '',
            url: '',
            imageUrl: 'http://localhost:9090/api/static/logo.png',
            nickname: '',
            email: '',
            dialogFormVisible: false,
            passwordForm: {
                password: "",
                passwordSure: ""
            },
            userForm:{
                nickname: '',
                email: ''
            },
            userRules: {
                email: [
                    { required: true, message: "请输入邮箱", trigger: "blur" },
                    { max: 25, message: "不能大于25个字符", trigger: "blur" }
                ]
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
        }
    },
    mounted(){
        this.url = sessionStorage.getItem('avatar')
        this.nickname = sessionStorage.getItem('nickname')
        this.email = sessionStorage.getItem('email')
    },
    watch: {
        'srcUrl': function(newVal, oldVal) {
            sessionStorage.setItem('avatar', newVal)
            return newVal
            // this.srcUrl = this.srcUrl + '?' + Math.random()
        },
        'nickname': function(newVal, oldVal) {
            sessionStorage.setItem('nickname', newVal)
        },
        'email': function(newVal, oldVal) {
            sessionStorage.setItem('email', newVal)
        }
    },
    beforeRouteEnter (to, from, next) {
        if (from.path != '/welcome/information') {
            next('/login')
        } else {
            next()
        }
        // alert(from.path)
    },
    // computed: {
    //    'srcUrl': function(newVal) {
    //         console.log(newVal)
    //     } 
    // },
    methods: {
        //点击触发文件上传
        trigButton(){
            let ie = navigator.appName=="Microsoft Internet Explorer" ? true : false; 
            if(ie){ 
                // me-file-input
                // document.getElementById("upload_file").click(); 
                document.getElementById("me-file-input").click(); 
            }else{
            　　let a = document.createEvent("MouseEvents");//FF的处理 
            　　a.initEvent("click", true, true);  
            // 　　document.getElementById("upload_file").dispatchEvent(a); 
                document.getElementById("me-file-input").dispatchEvent(a); 
            } 
        },
        // 通过formdata向后台发送文件，后台直接接收文件并存入到目录里
        //项目中我采用的是这种方法发送的文件，下面的方法没有采用
        update(e) {
            let file = e.target.files[0]
            console.log(file.name)
            // 可以设置一个form表单，一次提交所有表单数据，包括文件
            let form = new FormData()
            form.append('file', file)
            form.append('name', file.name)
            form.append('id', localStorage.account)
            form.append('username', localStorage.name)
            console.log(form.get('file'))
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            axios.post('http://localhost:9090/api/image', form, config).then(res => {
                console.log(res.data)
                console.log(res.data.path)
                // 由于后台返回的url不变，导致连续修改图片，存在浏览器的缓存，第二次修改就显示的还是原来的图片
                // url后面添加一个随机数清理浏览器缓存
                this.srcUrl = res.data.path + '?' + Math.random()
            }).catch(err => {
                console.log(err)
            })
        },
        // 前台读取文件转为base64格式，发送给后台，后台将base64流再转为文件存入文件夹
        update2(e) {
            let file = e.target.files[0]
            console.log(file)
            console.log(file.name)
            let name = file.name
            let id = localStorage.account
            let username = localStorage.name
            // 本地预览
            let r = new FileReader()
            // 这里无法读取this,这里的this，指向的是这个function()函数，不是全局的？？？this指向问题，需要认真研究
            // r.onload = function() {
            r.onload = () => {
                //图片的base64, 发送的是base64格式文件信息
                // console.log(r.result)
                axios.post('http://localhost:9090/api/upimage', 
                  { 
                      data: r.result, 
                      name: name, 
                      id: id, 
                      username: username
                  }).then(res => {
                    // console.log(res)
                    // 接收的是文件的base64格式，然后转换成对应文件
                    let base64path = res.data.path

                    console.log(res.data.url)
                    // 这里直接使用后台发送的服务器端的图片地址来显示
                    this.srcUrl = res.data.url

                    // let image = base64path.replace(/^data:image\/\w+;base64,/, "")
                    let image = base64path.replace(/\. +/g, '').replace(/[\r\n]/g, '')
                    // console.log(image)
                    console.log(this.srcUrl)
                    // 这里使用的后台发送的base64流格式图片直接显示
                    // this.srcUrl = base64path
                    // this.srcUrl = image

                    // 接收的是文件的二进制流，然后转换成对应文件
                    let twoBufferdata = res.data.apath.data
                    let type = res.data.apath.type
                    let name = res.data.apath.name
                    // console.log(twoBufferdata)
                    console.log(type)
                    // 创建Buffer对象,这一步不能省略
                    let buf = new Buffer(twoBufferdata, 'binary')
                    // console.log(buf)
                    buf.toString('utf-8')
                    // 创建Blob对象,转成文件
                    let blob = new Blob([buf], {type: type})
                    let url = window.URL.createObjectURL(blob)
                    // console.log(url)
                    // 这里是将后台发送的二进制流转换成文件然后再显示到页面,这个url用浏览器直接打开是乱码 
                    // this.srcUrl = url

                    // 下载文件
                    // var a = document.createElement('a')
                    // a.href = url
                    // a.download = `${name}.${type}`
                    // document.body.appendChild(a)
                    // a.click()
                    // document.body.removeChild(a)
                }).catch(err => {
                    console.log(err)
                })
            }
            // base64
            r.readAsDataURL(file)
            // r.readAsArrayBuffer(file)
            console.log(r)

            //   引入模块
            // const fs = require('fs');
            // const request = require('request');
            // // 本地图片路径
            // const filePath1 = "/tmp/"+ time+".png";
            // // 通过request发起post请求上传文件到服务器
            // // 获取图片的base64 
            // // var imageData = fs.readFileSync(filePath1); // 例：fileUrl="D:\\test\\test.bmp"
            // // var imageBase64 = imageData.toString("base64");
            // var url = '后端接口地址'
            // var formData = {
            //     // 将图片以流的方式向后端进行传递
            //     file: fs.createReadStream(filePath1),
            // };
            // request.post({url:url, formData: formData }, function (error, response, body) {  
            // //  获取到上传返回的url
            //     console.log(body);
            // })
        },
        updatePassword() {
            let _this = this;
            _this.dialogFormVisible = false;
            if (
                _this.passwordForm.password == "" ||
                _this.passwordForm.passwordSure == ""
            ) {
                _this.dialogFormVisible = true;
                _this.$message({
                type: "warning",
                message: "修改密码和确认密码不能为空"
                });
            } else if (
                _this.passwordForm.password != _this.passwordForm.passwordSure
            ) {
                _this.dialogFormVisible = true;
                _this.$message({
                type: "warning",
                message: "密码不一致，请重新输入密码"
                });
            } else {
                updatePassword(
                localStorage.account,
                _this.passwordForm.passwordSure
                )
                .then(res => {
                    if (res.data) {
                    _this.$message({ type: "success", message: "密码修改成功" });
                    } else {
                    _this.$message({ type: "warning", message: "密码修改失败" });
                    }
                })
                .catch(error => {
                    _this.$message({ type: "error", message: "密码修改失败" });
                });
            }
        },
        resetForm() {
            this.passwordForm.password = "";
            this.passwordForm.passwordSure = "";
        },
        submitEmail() {
            let email = this.userForm.email
            let id = localStorage.account
            setTimeout(() => {
                this.userForm.email = ''
            }, 1000 * 5)
            let regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if (!regEmail.test(email)) {
                this.$message({type:'info', message: '邮箱格式不正确'})
            }
            if (email.length > 26) {
                this.$message({type: 'info', message: '邮箱长度不能长于26个字符'})
            }
            if (email.length <= 26) {
                if (regEmail.test(email)) {
                    updateEmail(email, id).then(res => {
                        console.log(res.data)
                        this.email = email
                    }).catch(err => {
                        this.$message({type:'error', message:'提交失败'})
                        console.log(err)
                    })
                }
            }
        },
        submitNick() {
            let nickname = this.userForm.nickname
            let id = localStorage.account
            setTimeout(() => {
                this.userForm.nickname = ''
            }, 1000 * 5)
            //修改昵称的同时，全局修改welcome组件中用到的昵称
            this.resetSetItem('nickname',nickname)
            //通过Bus来实现组件传值
            Bus.$emit('SetNickEvent', nickname)

            updateNick(nickname, id).then(res => {
                // console.log(res.data)
                this.nickname = nickname
            }).catch(err => {
                this.$message({type:'error', message:'提交失败'})
                console.log(err)
            })
        }
    }
}
</script>
<style scoped>
.me-person{
    background-color: #ffffff;
}
.container{
    width: 80%;
    height: 450px;
    /* border: 1px solid #eee; */
    margin: 50px auto 0;
    font-size: 14px;
    line-height: 180%;
    margin-bottom: 30px;
}
.left{
    float: left;
    width: 200px;
    margin-left: 4%;
    border: 1px solid #eee;
}
.user{
    text-align: center;
    margin: 20px auto;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
}
.email {
    margin-top: 10px;
    color: #ffa000; 
}
.nick{
    color: #666;
    margin-top: 10px;
}
.right{
    width: 70%;
    /* height: 600px; */
    margin-left: 20px;
    border: 1px solid #eee;
    float: left;
}
.person{
   width: 97.3%;
   height: 25px;
   font-size: 17px;
   text-align: justify;
   background-color: #eee;
   border-top-left-radius: 3px;
   border-top-right-radius: 3px;
   padding-top: 8px;
   padding-left: 20px;
   padding-bottom: 5px;
}
.upload_picture{
   width: 90%;
   padding-bottom: 15px;
   margin-left: 5%;
   border-bottom: 1px solid #eee;
}
.footer{
    color: #b6b6b6;
    background: #333;
    padding-top: 20px;
    padding-bottom: 10px;
    font-size: 14px;
    text-align: center;
    line-height: 20px;
    font-weight: 500;
    float:right;
    width: 100%;
}
.footer a{
    color: #ffa000;
    text-decoration: none;
}
.footer a:hover{
    text-decoration: underline;
}
.avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    /* width: 60%; */
    width: 180px;
    margin-top: 20px;
}
.avatar-uploader:hover {
    border-color: #409EFF;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 180px;
    height: 180px;
    display: block;
}
#me-file-input{
    float: left;
    position:absolute;
    opacity: 0;
	display: none;
    overflow: hidden;
    cursor: pointer;
    z-index: 99;
}
#upload_file{
    float: left;
    position:absolute;
    opacity: 0;
	display: none;
    overflow: hidden;
    cursor: pointer;
    z-index: 99;
}
.form-left{
    padding-top: 80px;
}
.form-right{
    padding-top: 170px;
}
.me-information-button {
  margin-bottom: 10px;
}
.me-dialog {
  text-align: justify;
}
.update-form{
    margin-top: 20px;
    padding-bottom: 20px;
}
</style>