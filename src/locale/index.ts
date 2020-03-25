import { isString } from 'lodash';
import Polyglot from 'node-polyglot';
import en from './en';

const polyglot = new Polyglot({
  phrases: en,
});

const locales: any = {
  en: 'English',
  'zh-CN': '中文',
};

function updateLocale() {
  const { languages } = navigator;

  let locale;
  for (const code of languages) {
    if (code in locales) {
      locale = code;
      break;
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
