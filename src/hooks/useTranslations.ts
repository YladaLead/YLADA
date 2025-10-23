'use client';

import { useState, useEffect } from 'react';
import { Language, Translations } from '../lib/i18n';
import { ptTranslations } from '../lib/translations/pt';
import { enTranslations } from '../lib/translations/en';
import { esTranslations } from '../lib/translations/es';

const translations = {
  pt: ptTranslations,
  en: enTranslations,
  es: esTranslations
};

export function useTranslations(lang: Language = 'pt') {
  const [currentLang, setCurrentLang] = useState<Language>(lang);
  const [t, setT] = useState<Translations>(translations[lang]);

  useEffect(() => {
    setT(translations[currentLang]);
  }, [currentLang]);

  const changeLanguage = (newLang: Language) => {
    setCurrentLang(newLang);
    // Salvar preferência no localStorage
    localStorage.setItem('ylada-language', newLang);
  };

  return {
    t,
    currentLang,
    changeLanguage
  };
}
