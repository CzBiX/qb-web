import Polyglot from 'node-polyglot';
import en from './en';

import { loadConfig } from '@/store/config';

const polyglot = new Polyglot({
  phrases: en,
});

export const locales: {[key: string]: string} = {
  en: 'English',
  'zh-CN': '中文',
};

function updateLocale() {
  let locale: string | undefined = loadConfig()['locale'];
  if (!locale) {
    const { languages } = navigator;

    for (const code of languages) {
      if (code in locales) {
        locale = code;
        break;
      }
    }
  }

  if (!locale || locale === 'en') {
    return;
  }

  polyglot.locale(locale);

  const { default: translation } = require('./' + locale);
  polyglot.extend(translation);
}

updateLocale();

export default polyglot;
export const tr = polyglot.t.bind(polyglot);
export { updateLocale };
