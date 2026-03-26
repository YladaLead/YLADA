/**
 * Primeira visita à home após concluir onboarding YLADA (segmentos matriz).
 * Flag em sessionStorage — ver OnboardingPageContent.
 *
 * Copy enxuta: ativação = ação, não leitura longa.
 *
 * Banner: full (1ª visita pós-onboarding) → some quando há links ou modo off. Compacto só se já estava salvo antes.
 */
export const YLADA_POS_ONBOARDING_STORAGE_KEY = 'ylada_pos_onboarding_v1'

/** Valores: `compact` | `off` (omitido = nunca dispensou o full). */
export const YLADA_HOME_ACTIVATION_BANNER_KEY = 'ylada_home_activation_banner_v1'

/** Noel na home: após abrir uma vez, permanece expandido nas próximas visitas. */
export const YLADA_NOEL_HOME_EXPANDED_KEY = 'ylada_noel_home_expanded_once_v1'

export function markHomeActivationComplete(): void {
  try {
    localStorage.setItem(YLADA_HOME_ACTIVATION_BANNER_KEY, 'off')
  } catch {
    /* storage indisponível */
  }
}

export const yladaPosOnboardingCopy = {
  headline: 'Pronto. Agora você não precisa mais perder tempo explicando tudo.',
  sub: 'Aqui você cria um link que entende sua cliente antes e faz ela chegar muito mais pronta pra falar com você.',
  ctaPrimary: 'Criar meu link agora',
} as const

export const yladaHomeActivationCompactCopy = {
  line: 'Quer criar um novo link?',
  cta: 'Criar meu link',
  dismiss: 'Dispensar',
} as const

/** Barra colapsada do Noel (abaixo do CTA principal na home). */
export const yladaNoelHomeCollapsedCopy = {
  question: 'Quer que eu monte com você agora?',
  cta: 'Criar comigo (Noel)',
} as const
