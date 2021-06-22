import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import i18n from '@/locale';

Vue.use(Vuetify);

let locale = i18n.locale();
switch (locale) {
  case 'zh-CN':
    locale = 'zh-Hans';
    break;
  case 'zh-TW':
    locale = 'zh-Hans';
    break;
  default:
    locale = locale.split('-', 1)[0];
    break;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { default: translation } = require('vuetify/src/locale/' + locale);

export default new Vuetify({
  lang: {
    locales: { [locale]: translation },
    current: locale,
  },
  icons: {
    iconfont: 'mdi',
  },
});
