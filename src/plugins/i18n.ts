import Vue from 'vue';
import { tr } from '@/locale';

class I18n {
  static install() {
    Vue.prototype.$t = tr;
  }
}

Vue.use(I18n);
