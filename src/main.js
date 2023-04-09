// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios' // api: https://github.com/axios/axios



// axios.get('https://www.runoob.com/try/ajax/json_demo.json')
//   .then(response => (this.info = response.data.sites))
//   .catch(function (error) { // 请求失败处理
//     console.log(error);
//   });
// axios.post('/user', {
//   firstName: 'Fred',
//   lastName: 'Flintstone'
// }).then(function (response) {
//   console.log(response);
// }).catch(function (error) {
//   console.log(error);
// });


Vue.use(ElementUI);

Vue.config.productionTip = false

Vue.prototype.$http = axios


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
