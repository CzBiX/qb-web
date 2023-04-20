import Polyglot from 'node-polyglot';
import langEn from './en';
import langRu from './ru';
import langTr from './tr';
import langZhCn from './zh-CN';
import langZhTw from './zh-TW';
import langNl from './nl';

import { loadConfig } from '@/store/config';

export const translations = {
  en: langEn,
  'ru': langRu,
  'tr': langTr,
  'zh-CN': langZhCn,
  'zh-TW': langZhTw,
  'nl': langNl,
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
