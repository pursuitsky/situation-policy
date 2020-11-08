import { request } from '@/request/index'

//学生界面通过学号查询cardme信息
export function getUserInformation(userId) {
    return request({
        url: `/user/information/${userId}`,
        method: 'get'
    })
}

//点击参与按钮报名
export function paticipate(userId, activity, name, time, score) {
    return request({
        url: `/user/paticipate`,
        method: 'post',
        data: {
            userId,
            activity,
            name,
            time,
            score
        }
    })
}

// 侦听活动剩余名额变化
export function activityRemain(activity, time, score) {
    return request({
        url: `/user/remains`,
        method: 'get',
        params: {
            activity,
            time,
            score
        }
    })
}

//学生界面获取所有可报名活动信息
export function getActivityInformation(id) {
    return request({
        url: '/user/activity/information',
        method: 'get',
        params: {
            id
        }
    })
}

//获取已加分信息
export function getUserAdded(userId) {
    return request({
        url: '/user/addScore',
        method: 'post',
        // data: userId  会导致后台数据为空
        data: {
            userId: userId
        }
    })
}

//获取学生自己提交的问题反馈
export function getUserQuestion(id) {
    return request({
        url: '/user/getquestion',
        method: 'get',
        params: {
            id
        }
    })
}

//学生修改密码
export function updatePassword(id, resure) {
    const data = {
        id,
        resure
    }
    return request({
        url: '/user/update/password',
        method: 'post',
        data
    })
}

//学生查看个人加分详情
export function userScoreDetail(userId) {
    return request({
        url: '/user/scoreDetail',
        method: 'post',
        data: {
            userId: userId
        }
    })
}

//提交疑问
export function Question(question, userId, name, cla) {
    const data = {
        question,
        userId,
        name,
        cla
    }
    return request({
        url: '/user/question',
        method: 'post',
        data
    })
}

//用户删除提交的问题
export function deleteQuestion(id, question) {
    return request({
        url: `/user/deletequestion`,
        method: 'post',
        data: {
            id,
            question
        }
    })
}

// 用户修改个人昵称
export function updateNick(nickname, id) {
    let data = {
        nickname,
        id
    }
    return request({
        url: '/user/updateNickname',
        method: 'post',
        data
    })
}

// 用户修改个人邮箱
export function updateEmail(email, id) {
    let data = {
        email,
        id
    }
    return request({
        url: '/user/updateEmail',
        method: 'post',
        data
    })
}

// 查询个人学生信息记录表
export function getInformation(id, name) {
    return request({
        url: `/user/getRecord/${id}`,
        method: 'get',
        params: {
            name
        }
    })
}

// 如果是初次登录，则创建学生信息记录表
export function InsertInformation(id, name) {
    return request({
        url: `/user/InsertRecord`,
        method: 'get',
        params: {
            name,
            id
        }
    })
}