import Vue from 'vue'
import Router from 'vue-router'
import favorite from '@/pages/favorite'
import room from '@/pages/room'
import user from '@/pages/user'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'favorite',
      component: favorite
    },
    {
      path: '/favorite',
      name: 'favorite',
      component: favorite
    },
    {
      path: '/room',
      name: 'room',
      component: room
    },
    {
      path: '/user',
      name: 'user',
      component: user
    }
  ]
})
