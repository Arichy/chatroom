import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 设置拦截器后的axios
import axios from '@/assets/http/http';
Vue.prototype.$http = axios;

import _ from 'lodash';
Vue.prototype._ = _;

import '@/assets/preset/preset.js';

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
