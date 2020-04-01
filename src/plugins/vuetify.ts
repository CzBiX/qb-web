import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import i18n from '@/locale';
import { loadConfig } from '@/store/config';

Vue.use(Vuetify);

let locale = i18n.locale();
locale = locale === 'zh-CN' ? 'zh-Hans' : locale.split('-', 1)[0];

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { default: translation } = require('vuetify/src/locale/' + locale);
const darkMode = !!loadConfig()['darkMode'];

export default new Vuetify({
  lang: {
    locales: { [locale]: translation },
    current: locale,
  },
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    dark: darkMode,
  },
});
