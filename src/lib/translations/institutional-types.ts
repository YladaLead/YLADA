/** Chaves de áreas para a página institucional (pt/en/es) */
export interface InstitutionalAreaTranslation {
  title: string
  description: string
}

export interface InstitutionalAreas {
  nutri: InstitutionalAreaTranslation
  coach: InstitutionalAreaTranslation
  med: InstitutionalAreaTranslation
  estetica: InstitutionalAreaTranslation
  fitness: InstitutionalAreaTranslation
  perfumaria: InstitutionalAreaTranslation
  joias: InstitutionalAreaTranslation
  nutra: InstitutionalAreaTranslation
  'profissional-liberal': InstitutionalAreaTranslation
  'vendedores-geral': InstitutionalAreaTranslation
  psi: InstitutionalAreaTranslation
  psicanalise: InstitutionalAreaTranslation
  odonto: InstitutionalAreaTranslation
}

export interface InstitutionalTranslations {
  hero: {
    title: string
    subtitle: string
    subtitle2: string
    cta: string
  }
  whoWeAre: {
    title: string
    p1: string
    p2: string
    p3: string
  }
  howItWorks: {
    title: string
    item1: { title: string; description: string }
    item2: { title: string; description: string }
    item3: { title: string; description: string }
    item4: { title: string; description: string }
  }
  differential: {
    title: string
    subtitle: string
    intro: string
    list: string[]
    outro: string
    tagline: string
  }
  areas: {
    title: string
    subtitle: string
    list: InstitutionalAreas
  }
  badges: {
    ready: string
    comingSoon: string
  }
  areaCta: {
    explore: string
    request: string
  }
  philosophy: {
    title: string
    p1: string
    p2: string
    p3: string
  }
  contact: {
    title: string
    subtitle: string
    labelName: string
    labelProfession: string
    labelCountry: string
    labelEmail: string
    labelPhone: string
    phoneHint: string
    submit: string
    submitting: string
    successTitle: string
    successMessage: string
    successButton: string
  }
  construction: {
    title: string
    message: string
    back: string
  }
  areaRequest: {
    /** Título quando o fluxo vem de “não encontrei minha área” (area=profissional-liberal) */
    headingMinhaArea: string
    title: string
    subtitle: string
    labelName: string
    labelProfession: string
    labelCountry: string
    labelEmail: string
    labelWhatsApp: string
    submit: string
    submitting: string
    successTitle: string
    successMessage: string
    successButton: string
  }
  footer: {
    tagline: string
    privacy: string
    terms: string
    cookies: string
    refund: string
    languages: string
    copyright: string
  }
}
