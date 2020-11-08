// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import cookie from 'vue-cookie'
import VueCookies from 'vue-cookies'
import axios from 'axios'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// import '../theme/index.css'
// import '@/assets/theme/index.css'

// 不应该全局引入ViewUI，导致与element-ui的样式产生影响
import ViewUI from 'view-design'
import xss from 'xss'
// import 'view-design/dist/styles/iview.css'

// import CanvasPoster from 'vue-canvas-poster'

// axios.defaults.withCredentials = true


Vue.use(ElementUI, { size: 'small', zIndex: 3000})
Vue.use(ViewUI)
// Vue.use(CanvasPoster)

Vue.use(VueCookies)
// this.$cookies.config(expireTimes[])

Vue.prototype.$cookie = cookie

Vue.config.productionTip = false

Vue.directive('title',  function (el, binding) {
  document.title = el.dataset.title
})

Object.defineProperty(Vue.prototype, '$xss', {
  value: xss
})

//用来侦听昵称的变化
// 给Vue.protorype注册一个全局方法,侦听session值变化
Vue.prototype.resetSetItem = (key, newVal) => {
  if (key == 'nickname') {
    // 创建一个StorageEvent事件
    var newStorageEvent = document.createEvent('StorageEvent')
    const storage = {
      setItem: function(k, val) {
        sessionStorage.setItem(k, val)
        // 初始化创建的事件
        newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null)
        // 派发对象
        window.dispatchEvent(newStorageEvent)
      }
    }
    return storage.setItem(key, newVal)
  }
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
