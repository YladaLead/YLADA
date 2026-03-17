/** Traduções da página institucional home (hero, nav, seções principais) */
export interface HomeTranslations {
  nav: {
    doDiagnosis: string
    philosophy: string
    about: string
    professionals: string
    howItWorks: string
    pricing: string
    login: string
    discoverProfile: string
    startFree?: string
  }
  loading: string
  redirecting: string
  hero: {
    title: string
    tagline: string
    subtitle: string
    ctaCuriososPreparados?: string
    ctaPrimary?: string
    ctaSecondary?: string
    flowStep1?: string
    flowStep2?: string
    flowStep3?: string
    flowStep4?: string
    yladaIntro: string
    questionLabel: string
    question1: string
    question2: string
    question3: string
    question4: string
    cta: string
    progress: string
    quickInfo: string
    proof: string
  }
  preEngagement?: {
    diagnosticBadge?: string
    beforeStart: string
    questionPreEngage: string
    optCurious: string
    optStuck: string
    optPrepared: string
    optNotSure: string
    discoverProfileMinute: string
    ctaFreeDiagnosis: string
    ctaFreeDiagnosisDisabled?: string
    ctaCreateDiagnosis: string
  }
  whyDiagnosticsBlock?: {
    title: string
    subtitle: string
    autoDiagnosis: string
    commitment: string
    identity: string
    autoDesc: string
    commitmentDesc: string
    identityDesc: string
    result: string
  }
  duolingo: {
    title: string
    explainNot: string
    tagline: string
    intro: string
    traditional: string
    ylada: string
    explain: string
    convince: string
    insist: string
    ask: string
    diagnose: string
    converse: string
    resultCurious: string
    resultPrepared: string
    diagram: string
    question: string
    diagnosis: string
    conversation: string
    client: string
  }
  areas: {
    title: string
    subtitle: string
    seeAll: string
  }
  cta: {
    verify: string
    discover: string
  }
  problem?: {
    title: string
    list1: string
    list2: string
    list3: string
    list4: string
    conclusion1: string
    conclusion2: string
    footnote: string
  }
  viradaTagline?: string
  video?: {
    title: string
    placeholderTitle: string
    placeholderDesc: string
  }
  howItWorks?: {
    title: string
    linkText: string
    steps: Array<{ title: string; desc: string }>
  }
  whatHappens?: {
    title: string
    intro: string
    step1: string
    step2: string
    step3: string
    step4: string
    step5: string
    closing: string
  }
  examples?: {
    title: string
    subtitle: string
    testLink: string
  }
  examplesTitles?: [string, string, string, string]
  benefits?: {
    title: string
    item1: string
    item2: string
    item3: string
    item4: string
  }
  freeTrial?: {
    title: string
    subtitle: string
    item1: string
    item2: string
    item3: string
    cta: string
  }
  ctaFinal?: {
    headline: string
    subheadline: string
    button: string
  }
  footer: {
    doDiagnosis: string
    library: string
    philosophy: string
    about: string
    professionals: string
    howItWorks: string
    pricing: string
    login: string
    createDiagnosis: string
  }
}
