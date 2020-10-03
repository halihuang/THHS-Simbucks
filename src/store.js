import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from './firebase'
import router from './router/index'

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
      nav: [],
      user: {},
      userDoc: {}
  }, 
  mutations: {
    setNav: (state, nav) => {
        state.nav = nav
    },
    setUser: (state, user) => {
        state.user = user
    },
    setUserDoc: (state, doc) => {
      state.userDoc = doc
    },
    subtractSimbucks:(state, amount) => {
      state.user.simbucks = state.user.simbucks - amount
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
      async logout({commit}){
        await fb.auth.signOut()
        commit('setNav', [])
        commit('setUser', {})
        localStorage.removeItem('collection')
        router.push('/login')
    },
      async fetchUserData({commit, dispatch}, data){
        var doc = await fb.getUserDoc(data)
        if(doc){
          commit('setUser', doc.data())
        }
        dispatch("allowNav")
        if(router.history.current.path == "/login"){
          router.push('/')
        }
      },
      allowNav({commit}){
        
        var collection = localStorage.getItem('collection')
        var routes
        if(collection == 'voters'){
            routes = [
              { text: 'Marketplace', icon: 'mdi-storefront', route: 'market'},
              { text: 'Donate', icon: 'mdi-currency-usd-circle', route: 'donate'},
              { text: 'Purchase History', icon: 'mdi-history', route: 'history' },
          ];
        }
        else if(collection == "seniors"){
          routes= [
            { text: 'Marketplace', icon: 'mdi-storefront', route: 'market'},
            { text: 'Advertising', icon:'mdi-youtube-tv', route: 'advertising'},
            { text: 'Funds', icon:'mdi-cash-refund', route: 'campaign-funds'}
          ]
        }
        else{
            routes= [
            { text: 'Manage Participants', icon:'mdi-account-box-multiple', route: 'seniors'},
            { text: 'Manage Voters', icon:'mdi-account-box-multiple', route: 'voters'},
            { text: 'Admins', icon:'mdi-security', route: 'admins'}
          ]
        }
        routes.push( { text: 'About', icon:'mdi-information', route: 'about'} )
        commit('setNav', routes)
      },
      async buyItem({commit, state}, amount){
        var doc = await fb.getUserDoc(fb.getUserMeta())
        commit('subtractSimbucks', amount)
        doc.ref.set(state.user)
      }
  }
})


