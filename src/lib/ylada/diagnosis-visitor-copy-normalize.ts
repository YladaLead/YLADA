import type { DiagnosisDecisionOutput } from '@/lib/ylada/diagnosis-types'

import type { DiagnosisContentContext } from '@/lib/ylada/diagnosis-content-context'
import { areVerySimilarDiagnosisStrings } from '@/lib/ylada/diagnosis-text-similarity'

const STRING_KEYS: (keyof DiagnosisDecisionOutput)[] = [
  'profile_title',
  'profile_summary',
  'main_blocker',
  'consequence',
  'growth_potential',
  'cta_text',
  'whatsapp_prefill',
  'frase_identificacao',
  'causa_provavel',
  'preocupacoes',
  'espelho_comportamental',
  'dica_rapida',
]

/** Frases “consultoria” comuns em pacotes antigos — substituição conservadora (vendas / bem-estar). */
const WELLNESS_PLAIN_SUBSTITUTIONS: Array<{ re: RegExp; to: string }> = [
  {
    re: /descompasso entre esforço e resposta/gi,
    to: 'esforço grande e pouco resultado visível',
  },
  {
    re: /conversa guiada é prioridade/gi,
    to: 'vale conversar com calma com quem entende do assunto',
  },
  {
    re: /alto impacto emocional com corpo que não coopera no ritmo esperado/gi,
    to: 'muita carga emocional e sensação de que o corpo não acompanha o que você tenta fazer',
  },
  {
    re: /Adiar personalização prolonga sofrimento e risco de medidas desordenadas\.?/gi,
    to: 'Deixar para depois costuma aumentar o cansaço e bagunçar a rotina (sono, comida, horários).',
  },
  {
    re: /paciência estratégica vencem sprint sem base/gi,
    to: 'ir com calma, mas com direção, costuma funcionar melhor do que mudar tudo de uma vez',
  },
  {
    re: /direção e paciência estratégica vencem sprint sem base/gi,
    to: 'ir com calma, mas com direção, costuma funcionar melhor do que mudar tudo de uma vez',
  },
  {
    re: /critério profissional quando necessário/gi,
    to: 'acompanhamento profissional quando precisar',
  },
  {
    re: /plano por fases com acompanhamento profissional quando precisar/gi,
    to: 'plano em fases, com profissional quando precisar',
  },
  {
    re: /\bsprint\b/gi,
    to: 'mudança rápida sem base',
  },
  {
    re: /medidas desordenadas/gi,
    to: 'rotina desorganizada',
  },
  {
    re: /personalização prolonga/gi,
    to: 'adiar um plano feito pra você prolonga',
  },
  {
    re: /patamar onde personalizar hábitos costuma destravar/gi,
    to: 'fase em que organizar hábitos costuma ajudar bastante',
  },
  {
    re: /patamar leve com grande potencial de ganho/gi,
    to: 'fase leve, com boa margem para melhorar',
  },
  {
    re: /Neste patamar, /gi,
    to: 'Neste momento, ',
  },
]

function applyWellnessPlainPass(text: string): string {
  let out = text
  for (const { re, to } of WELLNESS_PLAIN_SUBSTITUTIONS) {
    out = out.replace(re, to)
  }
  return out
}

function dedupeConsequence(d: DiagnosisDecisionOutput): void {
  const cons = (d.consequence || '').trim()
  if (!cons) return
  const mb = (d.main_blocker || '').trim()
  const causa = (d.causa_provavel || '').trim()
  if (
    areVerySimilarDiagnosisStrings(cons, mb) ||
    areVerySimilarDiagnosisStrings(cons, causa) ||
    areVerySimilarDiagnosisStrings(cons, d.profile_summary)
  ) {
    const growth = (d.growth_potential || '').trim()
    const first = growth.split(/(?<=[.!?])\s+/)[0]?.trim()
    if (first && !areVerySimilarDiagnosisStrings(first, cons) && first.length > 24) {
      d.consequence = first.endsWith('.') ? first : `${first}.`
    } else {
      d.consequence =
        'Seguir sem apoio pode deixar o dia a dia mais difícil — vale conversar com quem te enviou o link.'
    }
  }
}

/**
 * Ajusta copy já montada (pacote/motor) antes de cache e métricas: tom simples em vendas wellness,
 * consequência não repete diagnóstico, substituições leves em textos antigos.
 */
export function normalizeDiagnosisDecisionForVisitor(
  diagnosis: DiagnosisDecisionOutput,
  ctx: DiagnosisContentContext
): DiagnosisDecisionOutput {
  const out: DiagnosisDecisionOutput = { ...diagnosis }
  const applyPlain = ctx.funnel === 'wellness_sales' && ctx.voice === 'pt_br_simple'
  const dedupe = ctx.voice === 'pt_br_simple' && (ctx.funnel === 'wellness_sales' || ctx.funnel === 'recruitment')

  if (applyPlain) {
    for (const k of STRING_KEYS) {
      const v = out[k]
      if (typeof v === 'string' && v.trim()) {
        ;(out as Record<string, unknown>)[k] = applyWellnessPlainPass(v)
      }
    }
    if (Array.isArray(out.specific_actions)) {
      out.specific_actions = out.specific_actions.map((s) =>
        typeof s === 'string' ? applyWellnessPlainPass(s) : s
      )
    }
  }

  if (dedupe) {
    dedupeConsequence(out)
  }

  return out
}
