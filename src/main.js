import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import {auth, getUserMeta} from './firebase'
import store from './store.js'

Vue.config.productionTip = false

let app
auth.onAuthStateChanged((user) => {
  if(user){
    var data = getUserMeta()
    // if(collection == 'seniors'){

    // }
    // else if(collection == 'admins'){

    // }
    store.dispatch('fetchUserData', data)
  }
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
})