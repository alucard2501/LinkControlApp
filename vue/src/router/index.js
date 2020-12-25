import Vue from 'vue'
import Router from 'vue-router'
import favorite from '@/pages/favorite'
import room from '@/pages/room'
import user from '@/pages/user'
import about from '@/pages/about'
import message from '@/pages/message'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'room',
      component: room
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
    },
    {
      path: '/about',
      name: 'about',
      component: about
    },
    {
      path: '/message',
      name: 'message',
      component: message
    }
  ]
})
