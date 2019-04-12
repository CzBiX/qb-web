import Vue from 'vue';
import './plugins/vuetify';
import store from './store';
import './filters';
import './directives';
import App from './App.vue';
// import './registerServiceWorker';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
