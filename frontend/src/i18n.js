import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEn from './locales/en/translation.json';
import translationKo from './locales/ko/translation.json';

const resources = {
    ko: {
        translation: translationKo,
    },
    en: {
        translation: translationEn,
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'ko', 
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
