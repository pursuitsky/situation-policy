<template>
  <div id="login" v-title data-title="登录 - 形势与政策">

    <div class="me-login-box me-login-box-radius" width="2000" height="400">
      <h1>ForFun 登录</h1>
      <!-- <h1>登 录</h1> -->

      <el-form ref="userForm" :model="userForm" :rules="rules" size="medium">
        <el-form-item prop="account">
          <el-input placeholder="用户名" v-model="userForm.account"></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            placeholder="密码"
            type="password"
            v-model="userForm.password"
            @keyup.enter.native="handelLogin(userForm)"
          ></el-input>
        </el-form-item>

        <el-form-item size="small" class="me-login-button">
          <el-button
            type="primary"
            @click.native.prevent="handelLogin('userForm')"
            class="el-button--primary"
          >登录</el-button>
        </el-form-item>
      </el-form>

      <div class="me-login-design">
        <p>
          Designed by
          <strong>
            <router-link to="/" class="me-login-design-color">fairy</router-link>
          </strong>
        </p>
      </div>
      <!-- 这里已经实现了xss拦截,v-html会当作v-text处理 -->
      <!-- <p v-html="$xss(test)"></p> -->
      <!-- <p v-text="test"></p> -->
    </div>
  </div>
</template>

<script>
// import ElementUI from 'element-ui'
import "element-ui/lib/theme-chalk/index.css";

import { login } from "../api/api";
//base64加密
import { Base64 } from "js-base64";
//sha256加密
import { sha256 } from "js-sha256";
//crypto加密算法
import crypto from "crypto";
//md5加密算法
import md5 from "js-md5";
//rsa加密,非对称加密解密
import rsa from "node-rsa";
//xss防御
import xss from "xss";

export default {
  name: "Login",
  data() {
    return {
      userForm: {
        account: "",
        password: "",
      },
      rules: {
        account: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { max: 20, message: "不能大于20个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { max: 20, message: "不能大于20个字符", trigger: "blur" },
        ],
      },
      test: `<a onclick='alert("xss攻击")链接</a>`,
    };
  },
  mounted() {
    // this.Base64Encryption()
    sessionStorage.clear();
    // Base64Encryption(),
    // Sha256Encryption(),
    // SetMd5(),
    // SetRSA()
  },
  methods: {
    handelLogin(formName) {
      let that = this;
      if (that.userForm.account == "") {
        this.$message({ type: "warning", message: "账号不能为空" });
      }
      if (that.userForm.password == "") {
        this.$message({ type: "warning", message: "密码不能为空" });
      }
      if (that.userForm.account != "" && that.userForm.password != "") {
        this.$store
          .dispatch("login", that.userForm)
          .then((res) => {
            // that.$router.push({name: 'Welcome', params: { userId: this.userForm.account }})


             //如果localStorage中没有refresh_token就把后端返回的refresh_token存入，如果有就不修改
            let refresh_token = res.data.refresh_token

            if (!localStorage.getItem('refresh_token')) {
              localStorage.setItem('refresh_token', refresh_token)
            }

            if (res.data.identity === "student") {
              that.$router.push({
                path: "/welcome/information",
                query: { userId: this.userForm.account },
              });
            } else if (res.data.identity === "superadmin") {
              that.$router.push({
                path: "/admin/user",
              });
            } else if (res.data.identity === "admin") {
              that.$router.push({
                path: "/admin/Individual",
              });
            } else {
              this.$message({ type: "success", message: res.data.msg });
            }


            // console.log(this.$router);
            // console.log(this.$route);
            // this.$cookies.set('name', 'aa')
            // console.log(this.$cookies.get('name'))
            // console.log(this.$cookies.keys())

          })
          .catch((error) => {
            if (error != "error") {
              that.$message({ message: error, type: "error", showClose: true });
            }
          });
      }
    },
    Base64Encryption() {
      //加盐
      let salting = "admin-authority";
      let name = this.userForm.account;
      //加密
      let encname = "";
      const encryptString = (name) => {
        encname = Base64.encode(name + salting);
        return Base64.encode(name + salting);
      };
      //解密
      const decodeString = (name) => {
        let decodeName = Base64.decode(name) || "";
        if (
          decodeName &&
          decodeName.split &&
          decodeName.split(salting) &&
          decodeName.split(salting)[0]
        ) {
          return decodeName.split(salting)[0];
        } else {
          return "";
        }
      };
      console.log(encryptString(name));
      console.log(decodeString(encname));
    },
    Sha256Encryption() {
      let name = this.userForm.account;
      let ShaName = "";
      ShaName = sha256.sha256(name);
      console.log(ShaName);
    },
    SetMd5() {
      let name = this.userForm.account;

      //md5加密
      let aa = md5(name);
      console.log(aa);

      //crypto模块加密aes
      const crypto = require("crypto");
      let Encrypt = (data, key) => {
        const cipher = crypto.createCipher("aes-128-cbc", key);
        let encrypted = cipher.update(data, "utf8", "hex");
        encrypted += cipher.final("hex");
        return encrypted;
      };
      let Decrypt = (encrypted, key) => {
        const decipher = crypto.createDecipher("aes-128-cbc", key);
        //utf8方式加密
        let decrypted = decipher.update(encrypted, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
      };

      let Random = (Min, Max) => {
        let Range = Max - Min;
        let Rand = Math.random();
        if (Math.round(Rand * Range) == 0) {
          return Min + 1;
        }
        let num = Min + Math.round(Rand * Range);
        return num;
      };
      let RandomNum = Random(1000, 9999);
      let key = RandomNum.toString();
      let encrypted = Encrypt(name, key);
      let decrypted = Decrypt(encrypted, key);
      console.log(encrypted);
      console.log(decrypted);

      //得到md5加密同样结果
      //update()方法默认字符串编码为UTF-8，也可以传入Buffer。如果要计算SHA1，只需要把'md5'改成'sha1'，就可以得到SHA1的结果
      //还可以使用更安全的sha256和sha512
      const hash = crypto.createHash("md5");
      hash.update(name);
      console.log(hash.digest("hex"));

      //Hmac算法也是一种哈希算法，它可以利用MD5或SHA1等哈希算法
      const hmac = crypto.createHmac("sha256", "secret-key");
      hmac.update(name);
      console.log(hmac.digest("hex"));

      //DH算法是一种密钥交换协议，它可以让双方在不泄漏密钥的情况下协商出一个密钥来
      //导致npm run dev启动缓慢刷新很慢
      // let ming = crypto.createDiffieHellman(512)
      // let ming_keys = ming.generateKeys()
      // let prime = ming.getPrime()
      // let generator = ming.getGenerator()
      // console.log('Prime:'+prime.toString('hex'))
      // console.log('Generator:'+generator.toString('hex'))
      // let hong = crypto.createDiffieHellman(prime, generator)
      // let hong_keys = hong.generateKeys()
      // let ming_secret = ming.computeSecret(hong_keys)
      // let hong_secret = hong.computeSecret(ming_keys)
      // console.log(ming_secret.toString('hex'))
      // console.log(hong_secret.toString('hex'))
    },
    SetRSA() {
      let key = new rsa({ b: 512 }); //生成新的512位长度密钥
      let text = this.userForm.account; // 加密前数据
      let encrypted = key.encrypt(text, "base64"); // 加密后数据
      console.log("encrypted: ", encrypted);
      let decrypted = key.decrypt(encrypted, "utf8"); // 解密后数据
      console.log("decrypted: ", decrypted);
      // 使用私钥进行加密
      let encryData = key.encryptPrivate(text, "base64", "utf8");
      console.log("加密后的数据", encryData);
      // 使用公钥解密
      let decryptData = key.decryptPublic(encryData, "utf8");
      console.log("解密后的数据", decryptData);
      //导入导出密钥
      let publicDer = key.exportKey("public");
      let privateDer = key.exportKey("private");
      console.log("公钥:", publicDer);
      console.log("私钥:", privateDer);
      console.log(key.importKey(privateDer, "private"));
    },
  },
};
</script>

<style scoped>
#login {
  min-width: 100%;
  min-height: 100%;
}
.me-background {
  width: 100%;
  height: 300px;
  /* background-image: url(../assets/7804.jpg); */
  background-size: 99.99% 100%;
}
.me-video-player {
  background-color: transparent;
  width: 100%;
  height: 100%;
  object-fit: fill;
  display: block;
  position: absolute;
  left: 0;
  z-index: 0;
  top: 0;
}
.me-login-box {
  position: absolute;
  width: 300px;
  height: 260px;
  background-color: white;
  margin-top: 150px;
  margin-left: -180px;
  left: 50%;
  padding: 30px;
}
.me-login-box-radius {
  border-radius: 10px;
  box-shadow: 0px 0px 1px 1px rgba(161, 159, 159, 0.1);
}
.me-login-box h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  vertical-align: middle;
}
.me-login-design {
  text-align: center;
  font-family: "Open Sans", sans-serif;
  font-size: 18px;
}
.me-login-design-color {
  color: #5fb878 !important;
}
.me-login-button {
  text-align: center;
}
.me-login-button button {
  width: 100%;
}
.el-button--primary {
  color: #fff;
  background-color: #5fb878;
  border-color: #5fb878;
}
</style>
