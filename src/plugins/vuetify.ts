import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import i18n from '@/locale';

Vue.use(Vuetify);

let locale = i18n.locale();
locale = locale === 'zh-CN' ? 'zh-Hans' : locale.split('-', 1)[0];

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
