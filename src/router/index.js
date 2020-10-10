import Vue from 'vue'
import VueRouter from 'vue-router'
import { auth } from '../firebase'
import store from '../store.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Market',
    component: () => import(/* webpackChunkName: "market" */ '../views/Market.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/login",
    name: "Login",
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/history',
    name: 'History',
    component: () => import(/* webpackChunkName: "history" */ '../views/voters/History.vue'),
    meta: {
      requiresAuth: true,
      collection: "voters"
    }
  },
  {
    path: '/Donate',
    name: 'Donate',
    component: () => import(/* webpackChunkName: "history" */ '../views/voters/Donate.vue'),
    meta: {
      requiresAuth: true,
      collection: "voters"
    }
  },
  {
    path: '/seniors',
    name: 'Seniors',
    component: () => import(/* webpackChunkName: "admin" */ '../views/admin/seniors.vue'),
    meta: {
      requiresAuth: true,
      collection: "admins"
    }
  },
  {
    path: '/voters',
    name: 'Voters',
    component: () => import(/* webpackChunkName: "admin" */ '../views/admin/voters.vue'),
    meta: {
      requiresAuth: true,
      collection: "admins"
    }
  },
  {
    path: '/admins',
    name: 'Admin',
    component: () => import(/* webpackChunkName: "admin" */ '../views/admin/Admin.vue'),
    meta: {
      requiresAuth: true,
      collection: "admins"
    }
  },
  {
    path: '/advertising',
    name: 'Advertising',
    component: () => import(/* webpackChunkName: "admin" */ '../views/seniors/Advertising.vue'),
    meta: {
      requiresAuth: true,
      collection: "seniors"
    }
  },
  {
    path: '/campaign-funds',
    name: 'Funds',
    component: () => import(/* webpackChunkName: "admin" */ '../views/seniors/Funds.vue'),
    meta: {
      requiresAuth: true,
      collection: "seniors"
    }
  },
  {
    path: '/fundraise',
    name: 'Fundraise',
    component: () => import(/* webpackChunkName: "admin" */ '../views/seniors/Fundraise.vue'),
    meta: {
      requiresAuth: true,
      collection: "seniors"
    }
  },
  {
    path: '/transfer',
    name: 'Transfer',
    component: () => import(/* webpackChunkName: "admin" */ '../views/seniors/Transfer.vue'),
    meta: {
      requiresAuth: true,
      collection: "seniors"
    }
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const collection = to.meta.collection
  if (requiresAuth && !auth.currentUser) {
    next('/login')
  } else {
    if(to.name != "Login"){
      store.dispatch('allowNav')
    }
    if(collection){
      if(localStorage.getItem('collection') == collection){
        next()
      }
    }
    else{
      next()
    }
  }
})


export default router
