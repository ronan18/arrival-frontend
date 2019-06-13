import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import '@/assets/css/tailwind.scss'
import '@/assets/css/app.scss'
import io from '../node_modules/socket.io-client/dist/socket.io.js'

Vue.prototype.$io =  io('localhost:3000');
Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
