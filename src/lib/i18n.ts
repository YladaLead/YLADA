export type Language = 'pt' | 'en' | 'es';

export const languages: Language[] = ['pt', 'en', 'es'];

/** Locales que têm página institucional + landings traduzidas (Wellness fica só PT) */
export const INSTITUTIONAL_LOCALES: Language[] = ['pt', 'en', 'es'];

/** Extrai locale da URL (ex: /en/nutri → 'en') */
export function getLocaleFromPathname(pathname: string): Language {
  const match = pathname.match(/^\/(pt|en|es)(\/|$)/)
  return (match?.[1] as Language) ?? 'pt'
}

export const languageNames = {
  pt: 'Português',
  en: 'English', 
  es: 'Español'
};

export const languageFlags = {
  pt: '🇧🇷',
  en: '🇺🇸',
  es: '🇪🇸'
};

// Estrutura base para traduções
export interface Translations {
  // Header
  header: {
    languages: string;
  };
  
  // Main page
  main: {
    badge: string;
    title: string;
    subtitle: string;
    cta: string;
    credibility: {
      professionals: string;
      global: string;
      quickStart: string;
    };
  };
  
  // Profile selection
  profile: {
    title: string;
    subtitle: string;
    nutri: {
      title: string;
      description: string;
    };
    sales: {
      title: string;
      description: string;
    };
    coach: {
      title: string;
      description: string;
    };
  };
  
  // Templates
  templates: {
    title: string;
    subtitle: string;
    filters: {
      profession: string;
      objective: string;
      search: string;
    };
    noResults: string;
    noResultsDescription: string;
    cta: string;
    objectives: {
      attractContacts: string;
      convertSales: string;
      engageClients: string;
      generateAuthority: string;
      all: string;
    };
    professions: {
      nutri: string;
      sales: string;
      coach: string;
      all: string;
    };
  };
  
  // Footer
  footer: {
    tagline: string;
    copyright: string;
  };
  
  // How it works
  howItWorks: {
    title: string;
    subtitle: string;
    steps: {
      step1: {
        title: string;
        description: string;
      };
      step2: {
        title: string;
        description: string;
      };
      step3: {
        title: string;
        description: string;
      };
    };
    cta: string;
  };

  // Página institucional (/pt) — mobile-first, i18n-ready
  institutional?: import('./translations/institutional-types').InstitutionalTranslations;

  // Página home institucional (hero, nav, seções)
  home?: import('./translations/home-types').HomeTranslations;
}
