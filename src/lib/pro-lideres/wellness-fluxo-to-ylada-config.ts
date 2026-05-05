/**
 * Converte fluxos do Wellness (perguntas + diagnóstico estático) para config_json
 * do link público YLADA (/l/[slug]) — mesmo padrão de meta/form/result usado em PublicLinkView.
 */
import type { FluxoCliente } from '@/types/wellness-system'

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
      }
    default:
      return {
        id: p.id,
        label: p.texto,
        type: 'single' as const,
        options: ['Sim', 'Não', 'Às vezes', 'Não tenho certeza'],
      }
  }
}

/**
 * @param kind — vendas vs recrutamento (coluna category do link + meta)
 */
export function wellnessFluxoToYladaConfigJson(
  fluxo: FluxoCliente,
  kind: 'sales' | 'recruitment'
): Record<string, unknown> {
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
      theme_raw: fluxo.nome,
      theme_display: fluxo.nome,
      objective: kind === 'recruitment' ? 'propagar' : 'educar',
      area_profissional: 'wellness',
      pro_lideres_preset: true,
      pro_lideres_fluxo_id: fluxo.id,
      pro_lideres_kind: kind,
      diagnosis_vertical: 'pro_lideres',
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
