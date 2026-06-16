/**
 * Leitor YladaFlow → config_json consumido por PublicLinkView (/l/[slug]).
 * Substitui gradualmente wellness-fluxo-to-ylada-config.ts.
 */
import type { YladaFlow } from '@/types/ylada-flow'
import type { FluxoCliente } from '@/types/ylada-flow-legacy'
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
