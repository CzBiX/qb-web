import Polyglot from 'node-polyglot';
import en from './en';
import ru from './ru';
import zhCn from './zh-CN';
import tr from './tr';

import { loadConfig } from '@/store/config';

export const translations = {
  en: en,
  'zh-CN': zhCn,
  'ru': ru,
  'tr': tr,
}

export type LocaleKey = keyof typeof translations | null;

const polyglot = new Polyglot({
  phrases: translations.en,
});

function matchLocale() {
  const { languages } = navigator;

  for (const code of languages) {
    if (code in translations) {
      return (code as LocaleKey)!;
    }
  }

  return 'en'
}

export const defaultLocale = matchLocale()

function updateLocale() {
  let locale = loadConfig()['locale'] as LocaleKey;

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
