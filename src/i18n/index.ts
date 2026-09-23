import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import tr from './locales/tr.json';
import en from './locales/en.json';
import { useUiStore } from '../store/uiStore';

void i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: { tr: { translation: tr }, en: { translation: en } },
        fallbackLng: 'tr',
        supportedLngs: ['tr', 'en'],
        interpolation: { escapeValue: false },
        detection: {
            order: ['localStorage', 'navigator'],
            lookupLocalStorage: 'edesign-locale',
            caches: ['localStorage'],
        },
    });

// Sync uiStore.locale into i18next after rehydration.
const syncFromStore = () => {
    const locale = useUiStore.getState().locale;
    if (locale && i18n.language !== locale) {
        void i18n.changeLanguage(locale);
    }
};
syncFromStore();
useUiStore.subscribe((state) => {
    if (state.locale && i18n.language !== state.locale) {
        void i18n.changeLanguage(state.locale);
    }
});

// Reverse sync: if i18next detects a different language, push it into the store.
i18n.on('languageChanged', (lng) => {
    const current = useUiStore.getState().locale;
    if (current !== lng) {
        useUiStore.getState().setLocale(lng as 'tr' | 'en');
    }
});

export default i18n;
