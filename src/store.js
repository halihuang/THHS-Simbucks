import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from './firebase'
import * as firebase from 'firebase/app'
import router from './router/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      nav: [],
      user: {},
      collection: ""
  }, 
  mutations: {
    setNav: (state, nav) => {
        state.nav = nav
    },
    setUser: (state, user) => {
        state.user = user
    },
    setCollection: (state, collection) => {
        state.collection = collection
    }
  },
  getters: {
    getNav(state){
        return state.nav
    }
    // getUser(state){
    //     return state.user
    // }
  },
  actions: {
      async login({dispatch}, collection){
          const provider = new firebase.auth.GoogleAuthProvider()
          const user = await firebase.auth().signInWithPopup(provider)
          var data = {user: user.user, collection: collection}
          dispatch('fetchUserData', data)
      },
      async logout({commit}){
        await fb.auth.signOut()
        commit('setNav', [])
        commit('setUser', {})
        commit('setCollection', "")
        router.push('/login')
    },
      async fetchUserData({commit, dispatch}, data){
        const userData = await fb.db.collection(data.collection).doc(data.user.uid).get()
        commit('setUser', userData)
        commit('setCollection', data.collection)
        dispatch("allowNav")
        router.push('/')
      },
      allowNav({commit, state}){
        var routes = [
            { text: 'Marketplace', icon: 'mdi-storefront', route: 'market'},
            { text: 'Purchase History', icon: 'mdi-history', route: 'history' },
            { text: 'About', icon:'mdi-information', route: 'about'}
        ];
        if(state.collection == "admins"){
            routes[1] = { text: 'Manage Funds', icon:'mdi-supervised_user_circle', route: 'admin'}
        }
        commit('setNav', routes)
      }
  }
})


