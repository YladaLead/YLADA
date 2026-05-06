/**
 * Converte fluxos do Wellness (perguntas + diagnóstico estático) para config_json
 * do link público YLADA (/l/[slug]) — mesmo padrão de meta/form/result usado em PublicLinkView.
 */
import type { FluxoCliente } from '@/types/wellness-system'
import { FLOW_IDS } from '@/config/ylada-flow-catalog'
import { isHypeCalculadoraPresetFluxoId } from '@/lib/pro-lideres/pro-lideres-hype-calculadora-preset-fluxos'
import { isWellnessCalculadoraBasicaPresetFluxoId } from '@/lib/pro-lideres/pro-lideres-wellness-calculadoras-basicas-preset-fluxos'

const DIAGNOSTICO_TEMPLATE_ID = 'a0000001-0001-4000-8000-000000000001' as const
export { DIAGNOSTICO_TEMPLATE_ID }

/** Texto neutro no link público (visitante): sem marca operador. */
export const PRO_LIDERES_PUBLIC_VISITOR_CONTEXTO_VENDAS =
  'O próximo passo é conversar com quem te enviou este link — hábitos, nutrição e bem-estar.'

/** Recrutamento: mesmo princípio — linguagem genérica para quem preenche. */
const PRO_LIDERES_PUBLIC_VISITOR_CONTEXTO_RECRUTAMENTO =
  'O próximo passo é continuar no WhatsApp com quem te enviou este link.'

function perguntaToFormField(p: FluxoCliente['perguntas'][number]) {
  switch (p.tipo) {
    case 'sim_nao':
      return { id: p.id, label: p.texto, type: 'single' as const, options: ['Sim', 'Não'] }
    case 'escala': {
      const min = p.escalaMin ?? 0
      const max = p.escalaMax ?? 10
      const options: string[] = []
      for (let i = min; i <= max; i++) options.push(String(i))
      return { id: p.id, label: p.texto, type: 'single' as const, options }
    }
    case 'multipla_escolha':
      return {
        id: p.id,
        label: p.texto,
        type: 'single' as const,
        options: p.opcoes?.length ? [...p.opcoes] : ['Opção 1', 'Opção 2'],
        obrigatoria: p.opcional ? false : true,
      }
    case 'texto': {
      const rows = typeof p.linhas === 'number' && p.linhas >= 2 ? p.linhas : undefined
      return {
        id: p.id,
        label: p.texto,
        type: (rows ? 'textarea' : 'text') as const,
        placeholder: p.placeholder,
        rows,
        maxLength: p.maxLength,
        obrigatoria: p.opcional ? false : true,
        options: undefined,
      }
    }
    case 'numero':
      return {
        id: p.id,
        label: p.texto,
        type: 'number' as const,
        placeholder: p.placeholder,
        min: p.min,
        max: p.max,
        step: p.step,
        obrigatoria: p.opcional ? false : true,
        options: undefined,
      }
    default:
      return {
        id: p.id,
        label: (p as { texto: string }).texto,
        type: 'single' as const,
        options: ['Sim', 'Não', 'Às vezes', 'Não tenho certeza'],
      }
  }
}

/** 4 campos numéricos q1–q4 — só calorias/proteína (água usa dados pessoais p1–p3 + RISK, ver `resolveProLideresPresetCalculadoraProjection`). */
function wellnessCalculadoraBasicaProjectionFields(
  fluxoId: string
): Array<{ id: string; label: string; type: 'number'; obrigatoria: true }> {
  switch (fluxoId) {
    case 'calc-calorias':
      return [
        { id: 'q1', label: 'Ingestão calórica atual estimada (kcal por dia)', type: 'number', obrigatoria: true },
        { id: 'q2', label: 'Meta calórica (kcal por dia)', type: 'number', obrigatoria: true },
        { id: 'q3', label: 'Prazo (dias)', type: 'number', obrigatoria: true },
        { id: 'q4', label: 'Consistência esperada (1 a 10)', type: 'number', obrigatoria: true },
      ]
    case 'calc-proteina':
      return [
        { id: 'q1', label: 'Proteína atual estimada (gramas por dia)', type: 'number', obrigatoria: true },
        { id: 'q2', label: 'Meta de proteína (gramas por dia)', type: 'number', obrigatoria: true },
        { id: 'q3', label: 'Prazo (dias)', type: 'number', obrigatoria: true },
        { id: 'q4', label: 'Consistência esperada (1 a 10)', type: 'number', obrigatoria: true },
      ]
    default:
      return []
  }
}

function defaultProjectionUnitForWellnessCalculadora(fluxoId: string): string {
  switch (fluxoId) {
    case 'calc-calorias':
      return 'kcal'
    case 'calc-proteina':
      return 'g'
    default:
      return ''
  }
}

/** Calculadoras HYPE (Pro Líderes): mesmo contrato q1–q4 que o motor PROJECTION. */
function hypeCalculadoraProjectionFields(
  fluxoId: string
): Array<{ id: string; label: string; type: 'number'; obrigatoria: true }> {
  switch (fluxoId) {
    case 'consumo-cafeina':
      return [
        { id: 'q1', label: 'Xícaras de café por dia (hoje)', type: 'number', obrigatoria: true },
        { id: 'q2', label: 'Meta de xícaras por dia (objetivo)', type: 'number', obrigatoria: true },
        { id: 'q3', label: 'Prazo para ajustar o hábito (dias)', type: 'number', obrigatoria: true },
        { id: 'q4', label: 'Consistência esperada (1 a 10)', type: 'number', obrigatoria: true },
      ]
    case 'custo-energia':
      return [
        { id: 'q1', label: 'Horas improdutivas por cansaço (por dia)', type: 'number', obrigatoria: true },
        { id: 'q2', label: 'Meta de horas improdutivas (por dia)', type: 'number', obrigatoria: true },
        { id: 'q3', label: 'Prazo para melhorar (dias)', type: 'number', obrigatoria: true },
        { id: 'q4', label: 'Consistência esperada (1 a 10)', type: 'number', obrigatoria: true },
      ]
    default:
      return []
  }
}

function defaultProjectionUnitForHypeCalculadora(fluxoId: string): string {
  switch (fluxoId) {
    case 'consumo-cafeina':
      return 'xícaras'
    case 'custo-energia':
      return 'h'
    default:
      return ''
  }
}

function resolveProLideresPresetCalculadoraProjection(fluxoId: string): {
  fields: Array<{ id: string; label: string; type: 'number'; obrigatoria: true }>
  unit: string
} | null {
  // Água / hidratação: peso + atividade + clima (dados pessoais) e diagnóstico RISK sem vertical Pro Líderes.
  if (fluxoId === 'agua' || fluxoId === 'calc-hidratacao') return null
  if (isWellnessCalculadoraBasicaPresetFluxoId(fluxoId)) {
    const fields = wellnessCalculadoraBasicaProjectionFields(fluxoId)
    if (fields.length !== 4) return null
    return { fields, unit: defaultProjectionUnitForWellnessCalculadora(fluxoId) }
  }
  if (isHypeCalculadoraPresetFluxoId(fluxoId)) {
    const fields = hypeCalculadoraProjectionFields(fluxoId)
    if (fields.length !== 4) return null
    return { fields, unit: defaultProjectionUnitForHypeCalculadora(fluxoId) }
  }
  return null
}

/**
 * @param kind — vendas vs recrutamento (coluna category do link + meta)
 */
export function wellnessFluxoToYladaConfigJson(
  fluxo: FluxoCliente,
  kind: 'sales' | 'recruitment'
): Record<string, unknown> {
  const calculadoraProjection = resolveProLideresPresetCalculadoraProjection(fluxo.id)
  if (calculadoraProjection) {
    const { fields: projectionFields, unit } = calculadoraProjection
    const d = fluxo.diagnostico
    const objetivoBase = fluxo.objetivo.trim()
    const pageObjetivo =
      kind === 'sales'
        ? `${objetivoBase}\n\n${PRO_LIDERES_PUBLIC_VISITOR_CONTEXTO_VENDAS}`
        : `${objetivoBase}\n\n${PRO_LIDERES_PUBLIC_VISITOR_CONTEXTO_RECRUTAMENTO}`
    const summary_bullets: string[] = [
      ...d.sintomas.slice(0, 5),
      ...d.beneficios.slice(0, 5),
    ]
    if (d.mensagemPositiva?.trim()) {
      summary_bullets.push(d.mensagemPositiva.trim())
    }
    return {
      title: fluxo.nome,
      ctaText: fluxo.cta,
      page: {
        subtitle: pageObjetivo,
        when_to_use: pageObjetivo,
      },
      meta: {
        architecture: 'PROJECTION_CALCULATOR',
        flow_id: FLOW_IDS.calculadora_projecao,
        theme_raw: fluxo.nome,
        theme_display: fluxo.nome,
        objective: kind === 'recruitment' ? 'propagar' : 'educar',
        area_profissional: 'wellness',
        pro_lideres_preset: true,
        pro_lideres_fluxo_id: fluxo.id,
        pro_lideres_kind: kind,
        ...(unit ? { default_projection_unit: unit } : {}),
      },
      form: {
        fields: projectionFields,
        submit_label: 'Ver minha projeção',
      },
      result: {
        headline: d.titulo,
        description: d.descricao,
        summary_bullets,
        cta: { text: fluxo.cta },
      },
    }
  }

  const fields = fluxo.perguntas.map(perguntaToFormField)
  const d = fluxo.diagnostico
  const objetivoBase = fluxo.objetivo.trim()
  const pageObjetivo =
    kind === 'sales'
      ? `${objetivoBase}\n\n${PRO_LIDERES_PUBLIC_VISITOR_CONTEXTO_VENDAS}`
      : `${objetivoBase}\n\n${PRO_LIDERES_PUBLIC_VISITOR_CONTEXTO_RECRUTAMENTO}`
  // Sem "•" no texto: `<ul class="list-disc">` já desenha o marcador (evita duas bolinhas).
  const summary_bullets: string[] = [
    ...d.sintomas.slice(0, 5),
    ...d.beneficios.slice(0, 5),
  ]
  if (d.mensagemPositiva?.trim()) {
    summary_bullets.push(d.mensagemPositiva.trim())
  }

  /**
   * Recrutamento Pro Líderes: questionário unificado (MCQ Ganhos) — mesmo modelo do Wellness `ganhos/page.tsx`;
   * índices invertidos no normalize para mapear arquétipo RISK (ver `diagnosis-normalize`).
   */
  const invertRecruitmentMcq = kind === 'recruitment'
  /** Quiz Perfil Metabólico: no Wellness a 1ª opção soma mais “peso” no resultado (matriz [3,2,1,0]); no YLADA isso equivale a inverter o índice da MCQ. */
  const invertSalesPerfilMetabolico =
    kind === 'sales' && fluxo.id === 'avaliacao-perfil-metabolico'

  const invertRiskMcqScore = invertRecruitmentMcq || invertSalesPerfilMetabolico

  const isAguaCalculadoraPreset = fluxo.id === 'agua' || fluxo.id === 'calc-hidratacao'
  const themeParaDiagnostico = isAguaCalculadoraPreset ? 'Hidratação' : fluxo.nome

  return {
    title: fluxo.nome,
    ctaText: fluxo.cta,
    page: {
      subtitle: pageObjetivo,
      when_to_use: pageObjetivo,
    },
    meta: {
      // Vendas e recrutamento: RISK_DIAGNOSIS + pacotes em ylada_flow_diagnosis_outcomes (tom negócio/convite, não clínico).
      architecture: 'RISK_DIAGNOSIS',
      theme_raw: themeParaDiagnostico,
      theme_display: themeParaDiagnostico,
      objective: kind === 'recruitment' ? 'propagar' : 'educar',
      area_profissional: 'wellness',
      pro_lideres_preset: true,
      pro_lideres_fluxo_id: fluxo.id,
      pro_lideres_kind: kind,
      // Hidratação: sem vertical pro_lideres — evita copy de “líder/negócio”; usa variantes RISK genéricas + tema do link.
      ...(isAguaCalculadoraPreset ? {} : { diagnosis_vertical: 'pro_lideres' }),
      ...(invertRiskMcqScore ? { invert_risk_mcq_score: true } : {}),
    },
    form: {
      fields,
      submit_label: kind === 'recruitment' ? 'Ver minha avaliação' : 'Ver meu diagnóstico',
    },
    result: {
      headline: d.titulo,
      description: d.descricao,
      summary_bullets,
      cta: { text: fluxo.cta },
    },
  }
}

/** Slug global único: inclui trecho do user_id do líder para não colidir com outros utilizadores. */
export function proLideresPresetSlug(ownerUserId: string, kind: 'sales' | 'recruitment', fluxoId: string): string {
  const compact = ownerUserId.replace(/-/g, '').slice(0, 12)
  const prefix = kind === 'sales' ? 'v' : 'r'
  return `pl-${compact}-${prefix}-${fluxoId}`.slice(0, 200)
}

/** True se o slug corresponde à biblioteca base criada por `ensureProLideresPresetYladaLinks` (não a um link criado manualmente). */
export function isProLideresPresetLink(ownerUserId: string, slug: string): boolean {
  const compact = ownerUserId.replace(/-/g, '').slice(0, 12)
  if (!slug || compact.length < 4) return false
  return slug.startsWith(`pl-${compact}-v-`) || slug.startsWith(`pl-${compact}-r-`)
}
