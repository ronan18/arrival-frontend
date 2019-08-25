import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Settings from './views/settings.vue'
import Search from './views/search.vue'
import Loading from './views/loading.vue'
import welcome from './views/onboarding1.vue'
import featureDestination from './views/onboarding2.vue'
import featureSchedule from './views/onboarding3.vue'
import featureLowData from './views/onboarding4.vue'
import featureAnonymous from './views/onboarding5.vue'
import login from './views/login.vue'
import createNew from './views/createNew.vue'
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
      path: '/to',
      name: 'to',
      component: Search
    },
    {
      path: '/from',
      name: 'from',
      component: Search
    },
    {
      path: '/loading',
      name: 'loading',
      component: Loading
    },
    {
      path: '/welcome',
      name: 'welcome',
      component: welcome
    },
    {
      path: '/featureDestination',
      name: 'featureDestination',
      component: featureDestination
    },
    {
      path: '/featureSchedule',
      name: 'featureSchedule',
      component: featureSchedule
    },
    {
      path: '/featureLowData',
      name: 'featureLowData',
      component: featureLowData
    },
    {
      path: '/featureAnonymous',
      name: 'featureAnonymous',
      component: featureAnonymous
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/createNew',
      name: 'createNew',
      component: createNew
    }
  ]
})
