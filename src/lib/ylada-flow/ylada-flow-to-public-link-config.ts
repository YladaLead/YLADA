/**
 * Leitor YladaFlow → config_json consumido por PublicLinkView (/l/[slug]).
 * Substitui gradualmente wellness-fluxo-to-ylada-config.ts.
 */
import type { YladaFlow } from '@/types/ylada-flow'
import type { FluxoCliente } from '@/types/ylada-flow-legacy'
import {
  buildHidratacaoCalculatorFormulaExpression,
  HIDRATACAO_ATIVIDADE_ML,
  HIDRATACAO_CLIMA_ML,
} from '@/lib/ylada-flow/bibliotecas/formulas'
import { buildYladaFlowCalculatorDevolutivaConfig } from '@/lib/ylada-flow/ylada-flow-calculator-runtime'
import { buildProLideresPresetOgDescription } from '@/lib/pro-lideres/pro-lideres-preset-og-description'
import { getRecruitmentFluxoPublicIntro } from '@/lib/recruitment-fluxo-public-intro'
import { PRO_LIDERES_PUBLIC_VISITOR_CONTEXTO_VENDAS } from '@/lib/pro-lideres/wellness-fluxo-to-ylada-config'

function perguntaYladaToFormField(p: YladaFlow['perguntas'][number]) {
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
      }
    default:
      return {
        id: p.id,
        label: (p as { texto: string }).texto,
        type: 'single' as const,
        options: ['Sim', 'Não'],
      }
  }
}

function recruitmentPageSubtitle(flow: YladaFlow): string {
  return getRecruitmentFluxoPublicIntro(flow.id, {
    nome: flow.nome,
    fallbackObjetivo: flow.objetivo,
  })
}

function summaryBulletsFromDevolutiva(flow: YladaFlow): string[] {
  const pronto = flow.devolutiva.porPerfil.pronto
  const curioso = flow.devolutiva.porPerfil.curioso
  const bullets = [pronto.primeiroPasso, curioso.primeiroPasso, pronto.causa, curioso.causa].filter(Boolean)
  return [...new Set(bullets)].slice(0, 8)
}

function selectValuesForPergunta(perguntaId: string, formulaId: string): readonly number[] | null {
  if (formulaId === 'hidratacao-35ml-kg-v1') {
    if (perguntaId === 'p2' || perguntaId === 'atividade') return HIDRATACAO_ATIVIDADE_ML
    if (perguntaId === 'p3' || perguntaId === 'clima') return HIDRATACAO_CLIMA_ML
  }
  return null
}

function perguntaYladaToCalculatorField(p: YladaFlow['perguntas'][number], formulaId: string) {
  if (p.tipo === 'numero') {
    return {
      id: p.id,
      label: p.texto,
      type: 'number' as const,
      min: p.min,
      max: p.max,
      step: p.step,
    }
  }
  if (p.tipo === 'multipla_escolha' && p.opcoes?.length) {
    const mappedValues = selectValuesForPergunta(p.id, formulaId)
    return {
      id: p.id,
      label: p.texto,
      type: 'select' as const,
      options: p.opcoes.map((label, idx) => ({
        value: mappedValues ? (mappedValues[idx] ?? idx) : idx,
        label,
      })),
    }
  }
  return perguntaYladaToFormField(p)
}

function calculatorResultLabel(formulaId: string): string {
  switch (formulaId) {
    case 'hidratacao-35ml-kg-v1':
      return 'Sua necessidade diária de água:'
    case 'proteina-gkg-v1':
      return 'Sua meta de proteína:'
    case 'imc-oms-v1':
      return 'Seu IMC:'
    case 'calorias-mifflin-v1':
      return 'Sua meta calórica:'
    default:
      return 'Resultado:'
  }
}

function buildCalculatorFormulaExpression(flow: YladaFlow): string {
  const calc = flow.calculadora
  if (!calc) return ''
  if (calc.formulaId === 'hidratacao-35ml-kg-v1') {
    return buildHidratacaoCalculatorFormulaExpression(calc.faixaSegura)
  }
  return '__ylada_native_runtime__'
}

function yladaFlowToNativeCalculatorConfig(
  flow: YladaFlow,
  kind: 'sales' | 'recruitment',
  ctaText: string,
  pageObjetivo: string,
  ogDescription: string
): Record<string, unknown> {
  const calc = flow.calculadora!
  const fields = flow.perguntas.map((p) => perguntaYladaToCalculatorField(p, calc.formulaId))
  const devolutivaYladaFlow = buildYladaFlowCalculatorDevolutivaConfig(flow)
  const suffixRaw = (calc.sufixoSaida ?? '').trim()
  const resultSuffix = suffixRaw ? (suffixRaw.startsWith(' ') ? suffixRaw : ` ${suffixRaw}`) : ''

  return {
    title: flow.nome,
    ctaText,
    fields,
    formula: buildCalculatorFormulaExpression(flow),
    resultLabel: calculatorResultLabel(calc.formulaId),
    resultPrefix: '',
    resultSuffix,
    resultIntro: 'Com base no que você informou:',
    introTitle: flow.abertura.gancho,
    introSubtitle: flow.abertura.baixaFriccao,
    introMicro: flow.abertura.autoridadeSutil ?? '',
    ctaDefault: ctaText,
    devolutivaYladaFlow,
    page: {
      title: flow.nome,
      subtitle: pageObjetivo,
      when_to_use: pageObjetivo,
      og_description: ogDescription,
      introTitle: flow.abertura.gancho,
      introSubtitle: flow.abertura.baixaFriccao,
      introMicro: flow.abertura.autoridadeSutil ?? '',
    },
    meta: {
      theme_raw: flow.nome,
      theme_display: flow.nome,
      objective: kind === 'recruitment' ? 'propagar' : 'educar',
      area_profissional: 'wellness',
      pro_lideres_preset: true,
      pro_lideres_fluxo_id: flow.id,
      pro_lideres_kind: kind,
      flow_id: flow.id,
      handle: flow.handle ?? flow.id,
      use_ylada_flow_native: true,
      ylada_flow_handoff: flow.handoff,
      ylada_flow_calculator: {
        formulaId: calc.formulaId,
        casasDecimais: calc.casasDecimais,
        unidadeSaida: calc.unidadeSaida,
      },
    },
    result: {
      cta: { text: ctaText },
    },
  }
}

export function yladaFlowToPublicLinkConfig(
  flow: YladaFlow,
  kind: 'sales' | 'recruitment',
  legacyFluxo?: FluxoCliente
): Record<string, unknown> {
  const ctaText =
    flow.devolutiva.porPerfil.pronto.ctaWhatsApp ||
    flow.devolutiva.porPerfil.curioso.ctaWhatsApp ||
    'Falar no WhatsApp'

  const objetivoBase = flow.objetivo.trim()
  const pageObjetivo =
    kind === 'sales'
      ? `${objetivoBase}\n\n${PRO_LIDERES_PUBLIC_VISITOR_CONTEXTO_VENDAS}`
      : recruitmentPageSubtitle(flow)

  const ogDescription = buildProLideresPresetOgDescription({
    fluxoId: flow.id,
    kind,
    nome: flow.nome,
  })

  if (flow.dimensoes.tipo === 'calculadora' && flow.calculadora) {
    return yladaFlowToNativeCalculatorConfig(flow, kind, ctaText, pageObjetivo, ogDescription)
  }

  const fields = flow.perguntas.map(perguntaYladaToFormField)
  const summary_bullets = legacyFluxo
    ? [
        ...legacyFluxo.diagnostico.sintomas.slice(0, 5),
        ...legacyFluxo.diagnostico.beneficios.slice(0, 5),
        ...(legacyFluxo.diagnostico.mensagemPositiva?.trim()
          ? [legacyFluxo.diagnostico.mensagemPositiva.trim()]
          : []),
      ]
    : summaryBulletsFromDevolutiva(flow)

  const isAguaCalculadora = flow.id === 'agua' || flow.id === 'calc-hidratacao'
  const themeParaDiagnostico = isAguaCalculadora ? 'Hidratação' : flow.nome

  const headline =
    legacyFluxo?.diagnostico.titulo ?? flow.devolutiva.porPerfil.pronto.espelho.slice(0, 120)
  const description =
    legacyFluxo?.diagnostico.descricao ?? flow.devolutiva.porPerfil.pronto.espelho

  return {
    title: flow.nome,
    ctaText,
    page: {
      title: flow.nome,
      subtitle: pageObjetivo,
      when_to_use: pageObjetivo,
      og_description: ogDescription,
      introTitle: flow.abertura.gancho,
      introSubtitle: flow.abertura.baixaFriccao,
      introMicro: flow.abertura.autoridadeSutil ?? '',
    },
    meta: {
      architecture: 'RISK_DIAGNOSIS',
      theme_raw: themeParaDiagnostico,
      theme_display: themeParaDiagnostico,
      objective: kind === 'recruitment' ? 'propagar' : 'educar',
      area_profissional: 'wellness',
      pro_lideres_preset: true,
      pro_lideres_fluxo_id: flow.id,
      pro_lideres_kind: kind,
      flow_id: flow.id,
      handle: flow.handle ?? flow.id,
      use_ylada_flow_native: true,
      ylada_flow_handoff: flow.handoff,
      ...(isAguaCalculadora ? {} : { diagnosis_vertical: 'pro_lideres' }),
    },
    form: {
      fields,
      submit_label: kind === 'recruitment' ? 'Ver minha avaliação' : 'Ver meu diagnóstico',
    },
    result: {
      headline,
      description,
      summary_bullets,
      cta: { text: ctaText },
    },
  }
}
