import { request } from '@/request/index'

export function login(account, password) {
    const data = {
        account,
        password
    }
    return request({
        url: '/user/login',
        method: 'post',
        data
    })
}

export function logout(){
    return request({
        url: '/user/logout',
        method: 'get'
    })
}
