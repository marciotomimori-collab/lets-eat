import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import ptBR from './locales/pt-BR.json';
import en from './locales/en.json';

const resources = {
  'pt-BR': { translation: ptBR },
  en: { translation: en },
};

const deviceLocale = Localization.getLocales()[0]?.languageTag || 'pt-BR';
const initialLanguage = deviceLocale.startsWith('pt') ? 'pt-BR' : 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
});

export default i18n;
