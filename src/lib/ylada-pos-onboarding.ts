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
  headline: 'O YLADA só funciona quando você usa — e o primeiro passo leva poucos minutos.',
  sub: 'Crie um link de diagnóstico. Depois você coloca na frente das pessoas e responde quem chegar no WhatsApp. Sem esse ciclo, a ferramenta não entrega resultado — e não é culpa sua; é falta de rotina.',
  ctaPrimary: 'Criar meu link agora',
} as const

export const yladaHomeActivationCompactCopy = {
  line: 'Bora colocar um diagnóstico no ar? Em dois minutos você já pode enviar para alguém.',
  cta: 'Criar link',
  dismiss: 'Agora não',
} as const

/** Barra colapsada do Noel (abaixo do CTA principal na home). */
export const yladaNoelHomeCollapsedCopy = {
  question:
    'Sou o Noel: te ajudo a montar diagnósticos e textos para mandar com o link — Direct, status ou WhatsApp.',
  cta: 'Abrir o Noel',
} as const
