<template>
  <div id="admin" v-title data-title="管理员 - 形势与政策">
    <Menu mode="horizontal" :theme="theme1" active-name="1">
      <Submenu name="1" class="add-score">
        <template slot="title">
          <Icon type="ios-add-circle" />加分管理
        </template>
        <MenuGroup title="加分">
          <MenuItem name="1-1" to="/admin/Individual" replace>单独加分</MenuItem>
          <MenuItem name="1-2" to="/admin/total">统一加分</MenuItem>
        </MenuGroup>
      </Submenu>
      <Submenu name="2" class="publish-activity">
        <template slot="title">
          <Icon type="ios-paper" />活动管理
        </template>
        <MenuGroup title="管理">
          <MenuItem name="2-1" to="/admin/publish" replace>活动发布</MenuItem>
          <MenuItem name="2-2" to="/admin/management">活动处理</MenuItem>
        </MenuGroup>
      </Submenu>
      <!-- <MenuItem name="2" to="/admin/publish">
        <Icon type="ios-paper" />活动管理
      </MenuItem> -->
      <MenuItem name="3" v-bind:class="{ active: isActive }" to="/admin/user">
        <Icon type="ios-people" />用户管理
      </MenuItem>
      <MenuItem name="4" to="/admin/back">
        <Icon type="ios-stats" />问题统计
      </MenuItem>
      <!-- <MenuItem name="4" to="/admin/canvas">
        <Icon type="ios-aperture" />
      </MenuItem> -->

      <RadioGroup v-model="theme1">
        <Radio label="light"></Radio>
        <Radio label="dark"></Radio>
        <Radio label="primary"></Radio>
      </RadioGroup>
      <el-link class="me-identify" type="info" :underline='false'>{{userName}}，你的身份是{{identity}}</el-link>

      <Tooltip content="退出登录" placement="bottom">
        <span @click="Logout"><Avatar style="background-color:#87d068" class="me-logout" icon="ios-cafe">
        </Avatar></span>
      </Tooltip>
    </Menu>
  </div>
</template>

<script>
import "view-design/dist/styles/iview.css";

export default {
  name: "admin",
  data() {
    return {
      theme1: "light",
      userName: '理学君',
      identity: '管理员',
      isActive: true
    };
  },
  mounted() {
    if (localStorage.account == '理学兔') {
      this.isActive = false
      this.userName = localStorage.account
      this.identity = '超级管理员'
    } else if (localStorage.account == '理学君') {
      this.isActive = true
      this.userName = localStorage.account
      this.identity = '管理员'
    }
  },
  methods: {
    Logout() {
      this.$store 
      .dispatch("logout")
      .then(() => {
        console.log('logout OK')
        this.$router.push({path: '/'})
        history.pushState(null, null, document.URL)
      }).catch(err => {
        console.log(err)
      })
    }
  }
};
</script>

<style scoped>
.add-score{
    margin-left: 25px;
}
.publish-activity{
  margin-left: 12px;
}
.me-identify{
    margin-left: 160px;
    font-size: 18px;
    font-weight: 500;
    letter-spacing: 1px;
    /* color: #ff9900; */
}
.me-logout{
    background-color:#87d068;
    cursor: pointer;
    margin-left: 10px;
}
.active{
    display: none;
}
</style>