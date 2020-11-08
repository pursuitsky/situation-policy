import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import qs from 'qs'
import router from '../router'

// // 创建axios实例
// const instance = axios.create({
//     baseURL: 'http://127.0.0.1:9090',
//     timeout: 5000,
//     withCredentials: true,   //允许带cookie
//     headers: {
//         "Content-Type": 'appliction/x-www-form-urlencoded;charset=utf-8'
//     }
// })

export function request(config) {
    const instance = axios.create({
        baseURL: 'http://127.0.0.1:9090',
        timeout: 5000,
        withCredentials: true,   //允许带cookie
        // headers: {
        //     "Content-Type": 'appliction/x-www-form-urlencoded;charset=utf-8'
        // }
    })

    //刷新token
    const refreshToken = () => {
        return instance.post('/user/refreshtoken')
    }

    // function refreshTokenReq () {
    //     // instance是当前request.js中已创建的axios实例
    //     return instance.post('/user/refreshtokenReq').then(res => res.data)
    // }

    let isRefreshing = false // 标记是否正在刷新 token
    let requests = [] // 存储待重发请求的数组

    //request拦截器
    instance.interceptors.request.use(config => {
        if (store.state.token) {
            // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.authorization =  localStorage.token

        }
        if (localStorage.refresh_token) {
            config.headers.refreshtoken = localStorage.refresh_token
        }
        //在请求拦截器里面刷新access_token，需要返回过期时间expiresIn
        // if (access_token && expiresIn) {
        //     const now = Date.now()
        //     if (now >= expiresIn) {
        //         // 当前时间大于过期时间，说明已经过期了，返回一个Promise，执行refreshToken后再return当前的config
        //         return refreshTokenReq().then(res => {
        //             const { token, tokenExprieIn } = res.data
        //             const tokenExpireTime = now + tokenExprieIn * 1000
        //             instance.setToken({ token, tokenExpireTime }) // 存token到localStorage
        //             console.log('刷新成功, return config即是恢复当前请求')
        //             config.headers['X-Token'] = token // 将最新的token放到请求头
        //             return config
        //         }).catch(res => {
        //             console.error('refresh token error: ', res)
        //         })
        //     }
        // }
        return config
    }, error => {
        return Promise.reject(error)
    })

    //response拦截器
    instance.interceptors.response.use(response => {
        return response
    }, error => {
        if (!error.response) {
            return Promise.reject(error)
        }
        // 服务器状态码不是2开头的情况
        // 这里可以跟协商好统一的错误状态码
        // 拦截axios请求处理token过期问题
        if (error.response) {
            // console.log(error.response.status)
            // console.log(error.config.url)
            // Message({type: 'error', message: '连接超时'})
            if (error.response.status) {
                switch (error.response.status) {
                    //401：access_token过期
                    //access_token过期，重新刷新获得access_token
                    case 401:
                        if (!error.config.url.includes('/user/refreshtoken')) {
                            const { config } = error
                            if (!isRefreshing) {
                                isRefreshing = true

                                return refreshToken().then(res => {
                                    console.log(res.data)
                                    let token = res.data
                                    localStorage.setItem('token', token)
                                    config.headers.authorization = token
                                    //token刷新后将数组的方法重新执行
                                    requests.forEach(item => item(token))
                                    requests = [] //重新请求完清空
                                    return instance(config)
                                }).catch( err => {
                                    Message({
                                        message: '登录状态失效，请重新登录！',
                                        type: 'info'
                                    })
                                }).finally(() => {
                                    isRefreshing = false
                                })
                            } else {
                                //返回未执行resolve的promise
                                return new Promise(resolve => {
                                    //用函数形式将resolve存入，等待刷新后再执行
                                    requests.push(token => {
                                        config.headers.authorization = token
                                        resolve(instance(config))
                                    })
                                })
                            }
                        }
                        break;
                    //402: 未登录
                    // 未登录则跳转登录页面，并携带当前页面的路径
                    // 在登录成功后返回当前页面，这一步需要在登录页操作。
                    case 402:
                        localStorage.removeItem('refresh_token')
                        localStorage.removeItem('token')
                        router.replace({
                            path: '/login',
                            query: {
                                redirect: router.currentRoute.fullPath
                            }
                        })
                        break
                    // 403 refresh_token过期
                    // 登录过期对用户进行提示
                    // 清除本地token
                    // 跳转登录页面
                    case 403:
                        Message({
                            message: '登录过期，请重新登录',
                            duration: 1000,
                            forbidClick: true
                        })
                        localStorage.removeItem('refresh_token')
                        localStorage.removeItem('token')
                        // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
                        setTimeout(() => {
                            router.replace({
                                path: '/login',
                                query: {
                                    redirect: router.currentRoute.fullPath
                                }
                            })
                        }, 1000)
                        break
                    // 404请求不存在
                    case 404:
                        Message({
                            message: '网络请求不存在',
                            duration: 1500,
                            forbidClick: true
                        })
                        break
                    // 其他错误，直接抛出错误提示
                    default:
                        Message({
                            message: error.respone.data.message,
                            duration: 1500,
                            forbidClick: true
                        })
                }
            }
            return Promise.reject(error)
        }
    })

    return instance(config)
}