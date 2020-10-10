import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import {auth, getUserMeta, seniors, admins} from './firebase'
import store from './store.js'


Vue.config.productionTip = false

async function authenticated(user, collection){
  if(collection == "seniors"){
      var campaigns = await seniors.get()
      for(let doc of campaigns.docs){
          var data = doc.data()
          for(let email of data.emails){
              if(user.email === email){
                  console.log("exists")
                  return true
              }
          }
      }
      return false
  }
  else if(collection == "admins"){
      var admin = await admins.doc(user.email).get()
      return admin.exists
  }
  return true
}

function updateLoop(data){
  var interval = 5 //minutes
  interval *= 1000 * 60
  setTimeout(() => {
    store.dispatch('fetchUserData', data)
    updateLoop(data)
  }, interval)
}



let app
auth.onAuthStateChanged(async (user) => {
  if(user){
    var data = getUserMeta()
    if(await authenticated(user, data.collection)){
      store.commit('setPermission', "")
      store.dispatch('fetchUserData', data)
      if(router.history.current.path == "/login"){
        router.push("/")
      }
      updateLoop(data)
    }
    else{
      store.dispatch('logout')
      store.commit('setPermission', "You are not authorized to access this type of account.")
    }
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