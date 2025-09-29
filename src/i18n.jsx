import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import uzTranslation from "./localization/uz.json";
import enTranslation from "./localization/en.json";
import ruTranslation from "./localization/ru.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "ru",
    debug: false,
    resources: {
      uz: { translation: uzTranslation },
      en: { translation: enTranslation },
      ru: { translation: ruTranslation },
    },
    interpolation: {
      escapeValue: false, // React o‘zi xavfsizlikni ta’minlaydi
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;