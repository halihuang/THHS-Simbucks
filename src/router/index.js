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
      requiresAuth: true
    }
  },
  {
    path: '/Donate',
    name: 'Donate',
    component: () => import(/* webpackChunkName: "history" */ '../views/voters/Donate.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/seniors',
    name: 'Seniors',
    component: () => import(/* webpackChunkName: "admin" */ '../views/admin/seniors.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/voters',
    name: 'Voters',
    component: () => import(/* webpackChunkName: "admin" */ '../views/admin/voters.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admins',
    name: 'Admin',
    component: () => import(/* webpackChunkName: "admin" */ '../views/admin/Admin.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/advertising',
    name: 'Advertising',
    component: () => import(/* webpackChunkName: "admin" */ '../views/seniors/Advertising.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/campaign-funds',
    name: 'Funds',
    component: () => import(/* webpackChunkName: "admin" */ '../views/seniors/Funds.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/fundraise',
    name: 'Fundraise',
    component: () => import(/* webpackChunkName: "admin" */ '../views/seniors/Fundraise.vue'),
    meta: {
      requiresAuth: true
    }
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)

  if (requiresAuth && !auth.currentUser) {
    next('/login')
  } else {
    if(to.name != "Login"){
      store.dispatch('allowNav')
    }
    next()
  }
})


export default router
