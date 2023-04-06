import Vue from 'vue'
import Router from 'vue-router'
import Mytable from '@/components/Mytable'
import hello from '@/components/hello';
import addQA from '@/components/addQA';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'addQA',
      component: addQA
    },
    {
      path: '/hello',
      name: '',
      component: hello
    }
  ]
})
