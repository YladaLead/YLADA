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
  // Inicializar com o idioma padrão ou do localStorage (apenas no cliente)
  // Usando lazy initialization para evitar problemas durante SSR
  const getInitialLang = (): Language => {
    if (typeof window === 'undefined') return lang;
    try {
      const saved = localStorage.getItem('ylada-language') as Language;
      return saved && ['pt', 'en', 'es'].includes(saved) ? saved : lang;
    } catch {
      return lang;
    }
  };

  const [currentLang, setCurrentLang] = useState<Language>(() => getInitialLang());
  const [t, setT] = useState<Translations>(() => translations[getInitialLang()]);

  useEffect(() => {
    setT(translations[currentLang]);
    // Salvar preferência no localStorage (apenas no cliente)
    if (typeof window !== 'undefined') {
      localStorage.setItem('ylada-language', currentLang);
    }
  }, [currentLang]);

  const changeLanguage = (newLang: Language) => {
    setCurrentLang(newLang);
    // Salvar preferência no localStorage (apenas no cliente)
    if (typeof window !== 'undefined') {
      localStorage.setItem('ylada-language', newLang);
    }
  };

  return {
    t,
    currentLang,
    changeLanguage
  };
}
