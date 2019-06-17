import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'echarts';
// @ts-ignore
import VCharts from 'vue-echarts'
import PowerScrollbar from './components/power-scrollbar.vue'

Vue.component('v-chart', VCharts)
Vue.component('power-scrollbar', PowerScrollbar)
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
