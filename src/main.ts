import Vue from 'vue';
import vuetify from './plugins/vuetify';
import './plugins/composition-api';
import store from './store';
// import router from './router';
import './filters';
import './directives';
import App from './App.vue';

import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.config.productionTip = false;

new Vue({
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
