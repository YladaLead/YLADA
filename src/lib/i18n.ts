export type Language = 'pt' | 'en' | 'es';

export const languages: Language[] = ['pt', 'en', 'es'];

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
      captureLeads: string;
      increaseSales: string;
      engageClients: string;
      educateAudience: string;
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
}
