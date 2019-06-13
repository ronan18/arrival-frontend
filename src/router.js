import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Settings from './views/settings.vue'
import Search from './views/search.vue'
import Loading from './views/loading.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/loading',
      name: 'loading',
      component: Loading
    }
  ]
})
