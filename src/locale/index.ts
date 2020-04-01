import Polyglot from 'node-polyglot';
import en from './en';
import zhCn from './zh-CN';

import { loadConfig } from '@/store/config';

export const translations = {
  en: en,
  'zh-CN': zhCn,
}

const polyglot = new Polyglot({
  phrases: translations.en
});

function matchLocale() {
  const { languages } = navigator;

  for (const code of languages) {
    if (code in translations) {
      return code as keyof typeof translations;
    }
  }

  return 'en'
}

export const defaultLocale = matchLocale()

function updateLocale() {
  let locale: keyof typeof translations | undefined | null = loadConfig()['locale'];

  if (!locale) {
    locale = defaultLocale;
  }

  if (locale === polyglot.locale()) {
    return;
  }

  polyglot.locale(locale);
  polyglot.extend(translations[locale]);
}

updateLocale();

export default polyglot;
export const tr = polyglot.t.bind(polyglot);
export { updateLocale };
