import { request } from '@/request/index'

//单独加分：通过学号或者姓名搜索到学生信息
export function getInformationByUserNameOrId(obj) {
    return request({
        url: '/admin/individual/getByNameOrId',
        method: 'post',
        data: obj
    })
}

//单独加分：点击加分给学生添加活动
export function PersonActivtityAdd(data) {
    return request({
        url: '/admin/individual/addScore',
        method: 'post',
        data: data
    })
}

//统一加分：获取学生界面所有学生报名参加活动的学生信息
export function getAllActivity() {
    return request({
        url: '/admin/all/totalInformation',
        method: 'get'
    })
}


//统一加分：通过活动名称搜索该活动参加的学生信息
export function getAllActivityByName(name) {
    return request({
        url: `/admin/all/totalInformationByName/${name}`,
        // url: '/admin/all/totalInformationByName',
        method: 'get',
        params: {
            name: name
        }
    })
}

//统一加分：点击一键加分添加所有信息
export function TotalActivityAdd(data) {
    return request({
        url: '/admin/all/addScore',
        method: 'post',
        data: data
    })
}

//活动管理：发布活动信息
export function publishInformation(data) {
    return request({
        url: '/admin/publish/add',
        method: 'post',
        data
    })
}

//活动管理：点击删除按钮，删除已发布的活动信息
export function deleteActivity(name, time, location) {
    const data = {
        time,
        name,
        location
    }
    return request({
        url: '/admin/publish/delete',
        method: 'post',
        data
    })
}

//活动管理：点击截止按钮，截止报名
export function setDeadlineActivity(name, time, location) {
    const data = {
        time,
        name,
        location
    }
    return request({
        url: '/admin/publish/deadline',
        method: 'post',
        data
    })
}

//活动管理：获取所有已发布的正在进行的活动信息
export function getAllPublishedActivity() {
    return request({
        url: '/admin/publish/published',
        method: 'get'
    })
}

//活动管理：获取所有已发布的且已结束报名的活动信息
export function getAccomplishActivity() {
    return request({
        url: '/admin/publish/accomplish',
        method: 'get'
    })
}

//问题统计：获取学生的所有问题 
export function getStudentQuestion() {
    return request({
        url: '/admin/question/user',
        method: 'post'
    })
}

//及时清除学生问题
export function deleteQuestion(data) {
    return request({
        url: '/test/deleteevent',
        method: 'post',
        data
    })
}

// 发送邮箱
export function feedback(id, question) {
    return request({
        url: `/test/feedback`,
        method: 'post',
        data: {
            id,
            question
        }
    })
}