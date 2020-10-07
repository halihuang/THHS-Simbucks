import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from './firebase'
import router from './router/index'


Vue.use(Vuex)


export default new Vuex.Store({
  state: {
      nav: [],
      user: {},
      userDoc: {},
      permission: ""
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
    },
    setPermission: (state, permission) => {
      state.permission = permission
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
        if(router.history.current.path != "/login"){
          router.push('/login')
        }
    },
      async fetchUserData({commit}, data){
        var doc = await fb.getUserDoc(data)
        if(doc){
          commit('setUser', doc.data())
        }
      },
      allowNav({commit}){
        
        var collection = localStorage.getItem('collection')
        var routes
        if(collection == 'voters'){
            routes = [
              { text: 'Marketplace', icon: 'mdi-storefront', route: '/'},
              { text: 'Donate', icon: 'mdi-currency-usd-circle', route: 'donate'},
              { text: 'Purchase History', icon: 'mdi-history', route: 'history' },
          ];
        }
        else if(collection == "seniors"){
          routes= [
            { text: 'Marketplace', icon: 'mdi-storefront', route: '/'},
            { text: 'Advertising', icon:'mdi-youtube-tv', route: 'advertising'},
            { text: 'Fundraise', icon:'mdi-currency-usd', route: 'fundraise'},
            { text: 'Manage Funds', icon:'mdi-cash-refund', route: 'campaign-funds'}
          ]
        }
        else{
            routes= [
            { text: 'Marketplace', icon: 'mdi-storefront', route: '/'},
            { text: 'Manage Candidates/Interest Groups', icon:'mdi-account-box-multiple', route: 'seniors'},
            { text: 'Manage Voters', icon:'mdi-account-box-multiple', route: 'voters'},
            { text: 'Admins', icon:'mdi-security', route: 'admins'}
          ]
        }
        routes.push( { text: 'About', icon:'mdi-information', route: 'about'} )
        commit('setNav', routes)
      },
      async spendSimbucks({commit, state}, amount){
        var doc = await fb.getUserDoc(fb.getUserMeta())
        commit('subtractSimbucks', amount)
        doc.ref.set(state.user)
      },
      async buyItem({dispatch}, item){
        await fb.transactions.add(item)
        await dispatch('spendSimbucks', item.simbucks)
        if(item.item != "Donation"){
          var marketDoc = await fb.market.doc(item.id).get()
          var marketData = marketDoc.data()
          marketData.stock -= 1
          await marketDoc.ref.set(marketData)
        }
        var sellerDoc = await fb.seniors.doc(item.seller).get()
        var sellerData = sellerDoc.data()
        sellerData.simbucks = parseInt(item.simbucks) + parseInt(sellerData.simbucks)
        await sellerDoc.ref.set(sellerData)
      }
  }
})


