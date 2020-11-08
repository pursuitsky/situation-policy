import Vuex from 'vuex'
import Vue from 'vue'
import Axios from 'axios'
import { login, logout } from '../api/api'

Vue.use(Vuex)

const SET_ACCOUNT = 'SET_ACCOUNT'
const SET_TOKEN = 'SET_TOKEN'

export default new Vuex.Store({
    state: {
        account: '',
        token: localStorage.getItem('token') || '',
        name: '',
        // refresh_token: localStorage.getItem('refresh_token') || ''
    },
    mutations: {
        // [SET_TOKEN] (state, token) {
        //     state.token = token
        // }
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_ACCOUNT: (state, account) => {
            state.account = account
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        // SET_REFRESH_TOKEN: (state, refresh_token) => {
        //     state.refresh_token = refresh_token
        // }
    },
    actions: {
        login({commit}, user) {
            return new Promise((resolve, reject) => {
                login(user.account, user.password)
                .then(res => {
                    const token = res.data.token
                    const account = res.data.account
                    const name = res.data.name
                    // const refresh_token = res.data.refresh_token

                    // 前端设置cookie
                    // this.$cookie.set('token', token, 1)
                    // document.cookie = res.data.account
                    localStorage.setItem('token', token)
                    localStorage.setItem('account', account)
                    localStorage.setItem('name', name)
                    // localStorage.setItem('refresh_token', refresh_token)

                    // 每次请求接口时，需要在headers添加对应的Token验证
                    // Axios.defaults.headers.common['Authorization'] = token
                    commit('SET_TOKEN', token)
                    // commit('SET_REFRESH_TOKEN', token)
                    commit('SET_ACCOUNT', account)
                    commit('SET_NAME', name)
                    // console.log(res)
                    resolve(res)
                }).catch( err => {
                    localStorage.removeItem('token')
                    localStorage.removeItem('account')
                    localStorage.removeItem('name')
                    // localStorage.removeItem('refresh_token')
                    reject(err)
                })
            })
        },
        logout({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout().then(res => {
                    // console.log(res)
                    commit('SET_TOKEN', '')
                    commit('SET_ACCOUNT', '')
                    localStorage.removeItem('token')
                    localStorage.removeItem('account')
                    localStorage.removeItem('name')
                    // localStorage.removeItem('refresh_token')
                     // 移除之前在axios头部设置的token,现在将无法执行需要token的事务
                    // delete Axios.defaults.headers.common['Authorization']
                    resolve()
                }).catch( err => {
                    reject(err)
                })
            })
        },
        //前端登出
        FLogOut({commit}) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                commit('SET_ACCOUNT', '')
                localStorage.removeItem('token')
                localStorage.removeItem('account')
                localStorage.removeItem('name')
                // localStorage.removeItem('refresh_token')
                resolve()
            }).catch( err => {
                reject(err)
            })
        }
    },
    getters: {
        account: state => state.account,
        token: state => state.token,
        name: state => state.name,
        refresh_token: state => state.refresh_token
    }
})