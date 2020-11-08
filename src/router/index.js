import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
     {
       path: '/',
       redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/components/login')
    },
    {
      path: '/welcome',
      name: 'welcome',
      meta: {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      children:[
        {
          path: 'information',
          name: 'information',
          meta: {
            requireAuth: true
          },
          component: () => import('@/components/student/Information')   
        },
        {
          path: 'details',
          name: 'details',
          meta: {
            requireAuth: true
          },
          component: () => import('@/components/student/details')
        },
        {
          path: 'person',
          name: 'Person',
          meta: {
            requireAuth: true
          },
          component: () => import('@/components/student/person')
        }
      ],
      component: () => import('@/components/student/welcome')
    },
    {
      path: '/welcome/:userId',
      name: 'Welcome',
      meta: {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: () => import('@/components/student/welcome')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/components/admin/index'),
      children: [
        {
          path: 'individual',
          name: 'Individual',
          component: () => import('@/components/admin/Individual')
        },
        {
          path: 'total',
          name: 'Total',
          component: () => import('@/components/admin/total')
        },
        {
          path: 'publish',
          name: 'Publish',
          component: () => import('@/components/admin/publish')
        },
        {
          path: 'management',
          name: 'Managenment',
          component: () => import('@/components/admin/management')
        },
        {
          path: 'user',
          name: 'User',
          component: () => import('@/components/admin/user')
        },
        {
          path: 'back',
          name: 'Back',
          component: () => import('@/components/admin/back')
        },
      ]
    },
    {
      path: '/counter',
      name: 'Counter',
      component: () => import('@/components/adminCard/question/page/countertime')
    },
    {
      path: '/canvas',
      name: 'Canvas',
      component: () => import('@/components/adminCard/canvas/MeCanvas')
    }
  ]
})

// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location) {  
//     return originalPush.call(this, location).catch(err => err)
// }


router.beforeEach((to, from, next) => {
    // 可以设置页面标题
    // window.document.title = to.meta.title
    if (to.path === '/login') {
        // sessionStorage.clear()
        next()
    } else {
        //判断是否登录
        if (to.meta.requireAuth) {//判断该路由是否需要登录权限
            if (store.state.token) {
                //已登录
                //如果url有参数传入，判断参数是否满足 
                if (to.query.userId || to.params.userId) {
                    if (localStorage.account == to.query.userId || localStorage.account == to.params.userId) {
                        // router.push('/')
                        next()
                    } else {
                        // alert(location.href)
                        history.pushState(null, null, location.href)  //清除当前url的history记录,直接跳转到登录页面后只能重新登录
                        next({path: '/login', replace: true})
                    }
                } else {
                    next()
                }
            } else {
                //未登录 
                // sessionStorage.clear()
                next({
                    path: '/login',
                    query: {redirect: to.fullPath},
                    replace: true  // 将跳转的路由path作为参数，登录成功后跳转到该路由
                })
            }
        } else {
            next()
        }
    }
})

export default router

// router.afterEach((to,from,next) => {
//   window.screenTo = (0, 0)
//   if (from.path === '/login') {
//     console.log(sessionStorage)
//   }
// })

// 1.命名路由搭配params，刷新页面参数会丢失
// 2.查询参数搭配query，刷新页面数据不会丢失
// 3.接受参数使用this.$router后面就是搭配路由的名称就能获取到参数的值
// 4.name配对的是params，和path配对的是query