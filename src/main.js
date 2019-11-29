import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import firebase from 'firebase/app'
import 'firebase/remote-config'
import 'firebase/performance'

import swal from 'sweetalert';
import moment from 'moment'

const firebaseConfig = {
  apiKey: "AIzaSyANR-1NZ4V-KLLUX4JPEhcWsOkH_pFwOQ4",
  authDomain: "arrival-bart.firebaseapp.com",
  databaseURL: "https://arrival-bart.firebaseio.com",
  projectId: "arrival-bart",
  storageBucket: "arrival-bart.appspot.com",
  messagingSenderId: "145284042800",
  appId: "1:145284042800:web:600f3d8d20f8aca3bfddf5"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
Vue.prototype.$perf = firebase.performance();
Vue.prototype.$firebase = firebase

Vue.prototype.$swal = swal
Vue.prototype.$moment = moment


/*
remoteConfig.defaultConfig = ({
  'apiurl': 'https://api.arrival.city',
  'latestversion': require('../package.json').version,
});

 */
//Vue.prototype.$remoteConfig = remoteConfig


import io from '../node_modules/socket.io-client/dist/socket.io.js'

//Vue.prototype.$io =  io('https://api.arrival.city');
//Vue.prototype.$io =  io('http://localhost:3000');
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
