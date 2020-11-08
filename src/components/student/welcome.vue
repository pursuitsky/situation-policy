<template>
    <div id="welcome" v-title data-title="欢迎 - 形势与政策">
        <div class="jumbotron" style="padding-top: 0px" id="top"> 
            <div class="welcome-content">
                <h1 id="welcome-title">WELCOME!</h1>
            </div>
            <div class="welcome_p_wrapper">
                <p>欢迎 {{nickname}} 进入信息学院形式与政策分管理系统</p>
            </div>
        </div>
        
        <router-view class="me-container"></router-view>
    </div>
</template>

<script>
// import $ from 'jquery'
import { getInformation, InsertInformation } from '../../api/student'
import Bus from '../../eventBus/eventBus'

export default {
    name: 'welcome',
    data(){
        return {
            nickname: '',
            // avatar: 'http://localhost:9090/api/public/2.jpg',
            avatar: '',
            email: ''
        }
    },
    watch: {
        'nickname': function(new_val, old_val) {
            // console.log(new_val)
            // this.nickname = sessionStorage.getItem('nickname')
        }
    },
    //对路由进行拦截，如果路由不是通过登录进入的，跳到登录界面，
    //存在一个问题：刷新界面也会跳到登录界面
    // beforeRouteEnter (to, from, next) {
    //     if (from.path != '/login') {
    //         next('/login')
    //     } else {
    //         next()
    //     }
    // },
    beforeCreate() {
        // 在需要监听sessionStorage的组件中的create生命周期中，进行监听
        window.addEventListener('setItem', () => {
            var val = sessionStorage.getItem('nickname')
            console.log(val)
            this.nickname = val
        })

        // 通过bus来实现，修改nickname，创造的事件会一直存在，不是说只是在创造组件的一瞬间存在
        Bus.$on('SetNickEvent', (newNickname) => {
            console.log(newNickname)
        })
    },
    created(){
        //创建学生信息记录，用来存储用户昵称，邮箱等信息
        InsertInformation(localStorage.account, localStorage.name)
        .then(res => {
            // console.log(res.data)
        }).catch(err => {
            console.log(err)
        })
    },
    mounted () {
        //实现APP的高度占满全屏
        // $('#welcome').height($(window).height())
        // $('#welcome').width($(window).width())

        //查询信息记录表，获取昵称信息
        let id = localStorage.account
        let name = localStorage.name
        getInformation(id, name).then(res => {
            // console.log(res.data)
            if (res.data.data.length != 0) {
                let nick = res.data.data[0].nickname
                if (nick == '' || nick == null) {
                    this.nickname = localStorage.name
                } else {
                    this.nickname = nick
                }
            } else {
                this.nickname = localStorage.name
            }
        }).catch(err => {
            console.log(err)
        })
    }
}
</script>
<style scoped>
#welcome{
    /* background-image: url(../assets/china-flag-painted-brick-wall2.jpg); */
    background-color: rgb(245, 245, 245);
    position: relative;
    background-repeat: repeat-y repeat-x;
    /* width: 100%;  */
    background-size: cover;
    /* background-size: 100% 80%; */
    -webkit-background-size: cover;
    -o-background-size: cover;
    background-position: center 0;
}
h1,h2,h3,h4,h5,h6 {
    margin-bottom: .5rem;
    font-weight: 500;
    line-height: 1.2;
}
p{   
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
}
#top{
    /* background-color: rgba(0,0,0,0); */
    background-color: #fff;
    padding-left:20px;
    height:30%;
    padding: 1rem 1rem;
}
.welcome-content{
    padding-top: 20px;
}
#welcome-title{
    font-size: 63px;
    color: #333;
    text-align: justify;
}
.welcome_p_wrapper{
    width: 70%;
    /* border-bottom: solid 3px rgb(247, 246, 246); */
    border-bottom: solid 3px #E6A23C;
}
.welcome_p_wrapper p{
    font-size: 21px;
    font-weight: 200;
    margin-bottom: 15px;
    color: #333;
    text-align: justify;
}
.me-container{
    margin: 20px auto 0;
    padding-top: 30px;
}
</style>