import { request } from '@/request/index'

//用户管理：通过姓名搜索学生信息
export function getInformationByName(name) {
    return request({
        url: `/super/superadmin/ByName/${name}`,
        method: 'get'
    })
}

//用户管理：通过学号搜索学生信息
export function getInformationById(userId) {
    return request({
        url: `/super/superadmin/ByuserId/${userId}`,
        method: 'get'
    })
}

//用户管理：通过班级搜索学生信息
export function getInformationByClass(StudentClass) {
    return request({
        url: `/super/superadmin/ByClass/${StudentClass}`,
        method: 'get'
    })
}

//用户管理：通过年级搜索学生信息
export function getInformationByGrade(grade) {
    return request({
        url: `/super/superadmin/ByGrade/${grade}`,
        method: 'get'
    })
} 

//用户管理：点击删除按钮删除，删除某个学生的所有信息
export function deleteStudentAllInformation(userId) {
    return request({
        url: `/super/superadmin/deleteStudent`,
        method: 'get',
        params: {
            id: userId
        }
    })
}

//用户管理：编辑修改学生的信息
export function updateStudentInformation(data) {
    return request({
        url: '/super/superadmin/update',
        method: 'post',
        data: data
    })
}

//用户管理：删除某一学生的单个活动
export function deleteSingleActivity(data) {
    return request({
        url: '/super/superadmin/deleteSingle',
        method: 'post',
        data
    }) 
}

//用户管理：子table中的学生个人所有信息
export function obtainInformationById(userId) {
    return request({
        url: `/super/superadmin/obtainById`,
        method: 'get',
        params: {
            id: userId
        }
    })
}

//用户管理：点击查看查询学生的所有活动加分细则
export function obtainActivityById(userId) {
    return request({
        url: `/super/superadmin/getPersonActivity/${userId}`,
        method: 'get'
        // params: {
        //     id: userId
        // }
    })
}

//用户管理：点击上传excel文件
export function ImportExcelData(data) {
    return request({
        url:'/super/superadmin/excelData',
        method: 'post',
        data
    })
}

//用户管理：点击导出excel
export function ExportExcelData(information) {
    return request({
        url: '/super/superadmin/getExcelData',
        method: 'get',
        params: {
            information: information
        }
    })
}

//用户管理：获取数据库中学生表名称
export function getStudentTable() {
    return request({
        url: '/super/superadmin/getStudentTable',
        method: 'get'
    })
}

//用户管理：删除某一年级学生信息表
export function DeleteStudentTableByGrade(grade) {
    return request({
        url:`/super/superadmin/deleteGrade/${grade}`,
        method: 'get'
    })
}