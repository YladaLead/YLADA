/**
 * Estrutura do resultado de Diagnóstico Vivo (tela em 5 blocos para conversão).
 * Ver: docs/DIAGNOSTICO-VIVO-E-TELA-RESULTADO.md
 *
 * Objetivo: fazer o resultado parecer analisado, contextual e interpretado (não só "quiz").
 * Ordem: Resultado → Interpretação Noel → Insight → Próximo passo → CTA.
 */

export interface IndicadorDiagnostico {
  label: string
  valor: string
}

export interface DiagnosticoVivoResult {
  /** 1) Resultado: perfil/situação identificada */
  perfilIdentificado: string
  /** Indicadores visuais (ex.: Clareza: média, Energia: baixa) */
  indicadores?: IndicadorDiagnostico[]

  /** 2) Interpretação do Noel (opcional; gera confiança) */
  interpretacaoNoel?: string

  /** 3) Insight principal */
  insightPrincipal: string

  /** 4) Próximo passo sugerido */
  proximoPassoSugerido: string

  /** 5) CTA */
  ctaTexto?: string
  ctaUrl?: string

  /** Inteligência coletiva (ex.: "63% também relatam dificuldade em começar") */
  insightColetivo?: string
}

/** Textos da sequência "Analisando..." antes de mostrar o resultado (2–3 s). */
export const DIAGNOSTICO_LOADING_STEPS = [
  'Analisando suas respostas…',
  'Identificando padrões...',
  'Gerando diagnóstico...',
] as const
