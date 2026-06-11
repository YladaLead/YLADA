export interface FunnelOption {
  id: string
  label: string
}

export interface FunnelQuestion {
  id: string
  text: string
  options: FunnelOption[]
}

export interface FunnelProfile {
  id: string
  title: string
  subtitle: string
  body: string
  cta: string
}

export interface BookFunnelConfig {
  /** Slug impresso no livro: 'conviccao', 'conviction' */
  slug: string
  lang: 'pt' | 'en'

  hero: {
    bookTitle: string
    bookSubtitle: string
    headline: string
    subheadline: string
    ctaLabel: string
  }

  questions: FunnelQuestion[]

  /** Mapeia combinações de respostas para um perfil.
   *  Chave = IDs das opções selecionadas, ordenados e unidos por '-'
   *  Fallback: perfil padrão quando nenhuma chave bate */
  profileMap: Record<string, string>
  defaultProfileId: string

  profiles: FunnelProfile[]

  form: {
    namePlaceholder: string
    whatsappPlaceholder: string
    submitLabel: string
  }

  confirmation: {
    headline: string
    body: string
  }
}
