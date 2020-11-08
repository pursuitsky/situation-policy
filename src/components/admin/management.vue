<template>
    <div v-title data-title="活动展示 - 形势与政策">
        <div class="box">
            <div class="me-card">
                <h1>正在进行的活动</h1>
                <el-card v-if="publishedList.length == 0" class="me-publish-info">
                    最 近 无 新 的 活 动 发 布
                </el-card>
                <delete-activity v-for="(item, index) in publishedList" :key="index" v-bind="item"></delete-activity>
            </div>
            <div class="me-card-right">
                <h1>已经结束报名的活动</h1>
                <el-card v-if="accomplishList.length == 0" class="me-publish-info">
                    最 近 无 已 经 结 束 的 活 动
                </el-card>
                <clear-activity v-for="(item, index) in accomplishList" :key="index" v-bind="item"></clear-activity>
            </div>
        </div>
    </div>
</template>

<script>
import DeleteActivity from '../adminCard/activity/deadlineActivity'
import ClearActivity from '../adminCard/activity/closeActivity'
import { getAllPublishedActivity, getAccomplishActivity } from '../../api/admin'
import Bus from '../../eventBus/eventBus'

export default {
    data(){
        return {
            publishedList: [],
            accomplishList: []
        }
    },
    components: {
        DeleteActivity,
        ClearActivity
    },
    created() {
        Bus.$on('ReloadDeadline', (data) => {
            // console.log(data)
            setTimeout(() => {
                this.getPublishedActivity()
                this.getAccomplishedActivity()
            }, 2000)
        })
    },
    mounted() {
        this.getPublishedActivity()
        this.getAccomplishedActivity()
    },
    watch: {
        // 'publishedList'(newvalue, oldvalue){
        //     console.log(newvalue, oldvalue)
        //     if (newvalue) {
        //         this.getPublishedAactivity()
        //     }
        // }
    },
    methods: {
        getPublishedActivity() {
            getAllPublishedActivity().then( res => {
                this.publishedList = res.data.data
                // console.log(res.data)
            }).catch( err => {
                console.log(err)
                this.$message({type: 'error', message: '发布的活动信息获取失败'})
            })
        },
        getAccomplishedActivity() {
            getAccomplishActivity().then( res => {
                this.accomplishList = res.data.data
                // console.log(res.data)
            }).catch( err => {
                console.log(err)
                this.$message({type: 'error', message: '发布的活动信息获取失败'})
            })
        }
    }
}
</script>

<style scoped>
.box {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
}
.me-card{
  /* margin: 90px auto 50px; */
  margin-top: 90px;
  margin-left: 15%;
}
.me-card-right {
    margin-top: 90px;
    margin-left: 13%;
}
h1{
  text-align: justify;
  padding-bottom: 30px;
  font-size: 24px;
  /* margin-top: 20px; */
  /* vertical-align: middle; */
  letter-spacing: 2px;
  color: #e6a23c;
  font-weight: 400px;
}
.me-publish-info{
  width: 350px;
  text-align: justify;
  margin-bottom: 30px;
}
</style>