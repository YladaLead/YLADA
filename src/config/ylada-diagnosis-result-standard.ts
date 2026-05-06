/**
 * Padrão oficial YLADA — narrativa do resultado de links inteligentes (diagnóstico).
 * Objetivo: reflexão + tensão + desejo de mudança + convite à conversa com quem enviou o link
 * (ou profissional, nas verticais estética).
 *
 * Uso:
 * - Copy em `diagnosis-vertical-variants.ts`, migrações `ylada_flow_diagnosis_outcomes`, e Noel.
 * - Novos modelos da biblioteca: cada `content_json` deve cobrir este arco (ver checklist).
 *
 * @packageDocumentation
 */

import type { DiagnosisVertical } from '@/lib/ylada/diagnosis-types'

/** Versão do padrão (incrementar quando a filosofia mudar de forma compatível com conteúdo legado). */
export const YLADA_DIAGNOSIS_RESULT_STANDARD_VERSION = 1 as const

/**
 * Arco narrativo obrigatório na entrega (por ordem de leitura na UI expandida).
 * Não confundir com campos técnicos 1:1 — vários blocos da UI podem compor um mesmo passo.
 */
export const YLADA_DIAGNOSIS_NARRATIVE_ARC = [
  'espelho',
  'tensao',
  'consequencia',
  'possibilidade',
  'convite',
] as const

export type YladaDiagnosisNarrativeStep = (typeof YLADA_DIAGNOSIS_NARRATIVE_ARC)[number]

/**
 * Mapeamento conceitual → campos do `DiagnosisDecisionOutput` (motor / arquétipos).
 * Quem escreve pacotes SQL ou JSON deve preencher estes campos de forma coerente com o arco.
 */
export const YLADA_DIAGNOSIS_OUTPUT_FIELD_GUIDE: Record<
  YladaDiagnosisNarrativeStep,
  readonly string[]
> = {
  espelho: ['profile_summary', 'frase_identificacao', 'espelho_comportamental'],
  tensao: ['main_blocker', 'causa_provavel', 'preocupacoes'],
  consequencia: ['consequence'],
  possibilidade: ['growth_potential', 'specific_actions', 'dica_rapida'],
  convite: ['cta_text', 'whatsapp_prefill'],
}

/** Regras de convite por vertical (tom do último passo). */
export const YLADA_DIAGNOSIS_INVITATION_BY_VERTICAL: Record<
  DiagnosisVertical,
  {
    /** Deve aparecer no convite (WhatsApp ou CTA). */
    mustReferenceSender: boolean
    /** Palavras-chave desejadas (orientação de copy, não validação automática). */
    invitationKeywords: string[]
  }
> = {
  pro_lideres: {
    mustReferenceSender: true,
    invitationKeywords: ['quem te enviou', 'enviou este link', 'líder', 'conversa', 'WhatsApp'],
  },
  capilar: {
    mustReferenceSender: true,
    invitationKeywords: ['avaliação', 'cabelo', 'couro cabeludo', 'protocolo', 'conversar'],
  },
  corporal: {
    mustReferenceSender: true,
    invitationKeywords: ['avaliação', 'protocolo', 'corpo', 'orientação', 'conversar'],
  },
}

/**
 * Na vertical Pro Líderes, evitar blocos que pareçam nutrição/clínica genérica sem tema.
 * Útil para revisão humana ou lint futuro.
 */
export const YLADA_DIAGNOSIS_PRO_LIDERES_AVOID_TERMS_IN_THEME_AGNOSTIC_FLOWS: readonly string[] = [
  'refeição por dia',
  'horário fixo para pelo menos uma refeição',
  'proteção solar',
  'protetor solar',
  'skincare',
]

/**
 * Checklist para autor de `content_json` (pacotes DB) ou revisão de template.
 */
export const YLADA_DIAGNOSIS_PACK_CHECKLIST: readonly string[] = [
  'O espelho identifica o leitor (“muitas pessoas…” / “se você se identificou…”) sem diagnóstico médico.',
  'A tensão explica o custo de continuar igual (sem alarmismo ilegal).',
  'A possibilidade oferece caminho simples, não solução completa.',
  'O convite direciona a falar com quem enviou (Pro Líderes) ou profissional (estética).',
  'CTA e whatsapp_prefill não contradizem o tema do quiz (sono ≠ refeição).',
]

/**
 * Links de **saúde e bem-estar** (conscientização): o objetivo é a pessoa **reconhecer o padrão**,
 * **sentir que melhorar é possível** e **querer dar o próximo passo** (conversa com quem enviou o link),
 * sem tom de aula longa nem promessa de cura/ganho.
 *
 * Use com `content_json` em `ylada_flow_diagnosis_outcomes` (ex.: fluxos energia/cansaço do catálogo).
 */
export const YLADA_DIAGNOSIS_WELLNESS_CONSCIENTIZATION_CHECKLIST: readonly string[] = [
  'Primeiro impacto: validação + curiosidade (“você já percebeu…”) — não culpa nem rótulo patológico.',
  'Tensão (`main_blocker`, `causa_provavel`, `preocupacoes`): linguagem de corpo e rotina, sem diagnóstico médico nem garantia de resultado.',
  'Possibilidade (`growth_potential`, `dica_rapida`, `specific_actions`): micro-passos factíveis + convite à conversa; “melhorar” > “revolucionar”.',
  '`whatsapp_prefill` menciona explicitamente **querer melhorar** e pede **primeiro passo simples** alinhado ao tema do quiz.',
  'Evitar duplicar a mesma ideia em `preocupacoes` e `consequence` quando possível — cada bloco avança um degrau na reflexão.',
]
