/**
 * Gera cartões de insight a partir de totais do funil e valuation (regras simples).
 */
import type { ValuationApiData } from '@/lib/admin/ylada-valuation-queries'
import type { FreemiumConversionStats } from '@/lib/freemium-inteligencia-aggregate'
import type { FreemiumConversionKind } from '@/config/freemium-limits'

export type InsightCard = {
  id: string
  variant: 'warning' | 'success' | 'info' | 'neutral'
  emoji: string
  title: string
  detail: string
  suggestion: string
}

const SEG_LABEL: Record<string, string> = {
  nutri: 'Nutrição',
  estetica: 'Estética',
  coach: 'Coach',
  med: 'Médicos',
  fitness: 'Fitness',
  joias: 'Joias e bijuterias',
  perfumaria: 'Perfumaria',
  nutra: 'Nutra',
  seller: 'Vendas',
  psi: 'Psicologia',
  psicanalise: 'Psicanálise',
  odonto: 'Odontologia',
}

export function buildInteligenciaInsights(
  totals: Record<string, number>,
  bySegment: Record<string, Partial<Record<string, number>>>,
  nichoBySegment: Record<string, Record<string, number>>,
  conversionCadastroPct: number | null,
  valuation: Pick<ValuationApiData, 'intentConversion' | 'intentTop' | 'answersTotal'>
): { cards: InsightCard[]; maiorPerda: string | null; acoesSugeridas: string[] } {
  const cards: InsightCard[] = []
  const acoesSugeridas: string[] = []

  const landing = totals['funnel_landing_pt_view'] ?? 0
  const cadView = totals['funnel_cadastro_view'] ?? 0
  const contas = totals['user_created'] ?? 0

  let maiorPerda: string | null = null

  // 1) Vazamento cadastro
  if (cadView >= 5 && contas < cadView) {
    const pct = Math.round((1 - contas / cadView) * 100)
    if (pct >= 40) {
      maiorPerda = 'cadastro'
      cards.push({
        id: 'vazamento-cadastro',
        variant: 'warning',
        emoji: '⚠️',
        title: `Cerca de ${pct}% das pessoas que abrem o cadastro não criam conta`,
        detail: `No período: ${cadView.toLocaleString('pt-BR')} abriram a página de cadastro e ${contas.toLocaleString('pt-BR')} criaram conta.`,
        suggestion: 'Revise se o formulário está claro, curto e se o valor aparece antes do cadastro.',
      })
      acoesSugeridas.push('Testar título e campos do cadastro; reduzir fricção.')
    }
  }

  // 2) Landing → conta
  if (landing >= 10 && contas >= 0) {
    const taxa = landing > 0 ? (contas / landing) * 100 : 0
    if (taxa < 2 && contas < landing * 0.05) {
      cards.push({
        id: 'landing-conta',
        variant: 'warning',
        emoji: '📉',
        title: 'Poucas contas em relação às visitas na página inicial',
        detail: `${landing.toLocaleString('pt-BR')} visualizações em /pt e ${contas.toLocaleString('pt-BR')} contas criadas (aprox.).`,
        suggestion: 'Reforce o CTA “Comece agora”, prova social ou oferta na primeira tela.',
      })
      if (!maiorPerda) maiorPerda = 'landing'
      acoesSugeridas.push('Melhorar primeira impressão e motivação para seguir o funil.')
    }
  }

  // 3) Segmento com melhor taxa contas / sinal de interesse (hub + cadastro)
  const rates: { seg: string; rate: number; contas: number; sinal: number }[] = []
  for (const [seg, b] of Object.entries(bySegment)) {
    const sinal = (b.funnel_hub_segmento_clicado ?? 0) + (b.funnel_cadastro_area_selected ?? 0)
    const c = b.user_created ?? 0
    if (sinal >= 3) {
      rates.push({ seg, rate: c / sinal, contas: c, sinal })
    }
  }
  rates.sort((a, b) => b.rate - a.rate)
  if (rates.length >= 2 && rates[0].rate > 0 && rates[0].rate >= rates[rates.length - 1].rate * 1.5) {
    const best = rates[0]
    const worst = rates[rates.length - 1]
    const labelB = SEG_LABEL[best.seg] || best.seg
    const labelW = SEG_LABEL[worst.seg] || worst.seg
    cards.push({
      id: 'segmento-compara',
      variant: 'success',
      emoji: '🚀',
      title: `${labelB} está com taxa de conta mais forte que ${labelW} neste período`,
      detail: `Taxa aproximada (contas ÷ cliques/escolhas): ${(best.rate * 100).toFixed(0)}% vs ${(worst.rate * 100).toFixed(0)}%.`,
      suggestion: `Direcione conteúdo ou mídia para reforçar ${labelB}; investigue fricção em ${labelW}.`,
    })
    acoesSugeridas.push(`Priorizar narrativa e campanhas em ${labelB}.`)
  } else if (rates.length === 1 && rates[0].contas >= 2) {
    const best = rates[0]
    cards.push({
      id: 'segmento-lider',
      variant: 'info',
      emoji: '🎯',
      title: `${SEG_LABEL[best.seg] || best.seg} concentra o sinal de interesse neste período`,
      detail: `${best.contas.toLocaleString('pt-BR')} contas com interação registrada no segmento.`,
      suggestion: 'Mantenha ofertas e páginas alinhadas a esse público.',
    })
  }

  // 4) Nicho mais frequente (entrada matriz)
  const nichoFlat: Record<string, number> = {}
  for (const niches of Object.values(nichoBySegment)) {
    for (const [nic, n] of Object.entries(niches)) {
      nichoFlat[nic] = (nichoFlat[nic] ?? 0) + n
    }
  }
  const topNicho = Object.entries(nichoFlat).sort((a, b) => b[1] - a[1])[0]
  if (topNicho && topNicho[1] >= 3) {
    cards.push({
      id: 'nicho-forte',
      variant: 'success',
      emoji: '🔥',
      title: `O nicho “${topNicho[0]}” lidera escolhas na entrada matriz`,
      detail: `${topNicho[1].toLocaleString('pt-BR')} escolhas registradas.`,
      suggestion: 'Priorize diagnósticos, anúncios e mensagens com essa dor.',
    })
    acoesSugeridas.push(`Criar mais conteúdo e fluxos para “${topNicho[0]}”.`)
  }

  // 5) Valuation: conversão WhatsApp por resposta
  const conv = valuation.intentConversion?.[0]
  if (conv && conv.diagnoses >= 10 && conv.conversion_pct > 0) {
    cards.push({
      id: 'whatsapp-resposta',
      variant: 'info',
      emoji: '💬',
      title: `Respostas como “${truncate(conv.answer_display, 48)}” ligam bem a ação`,
      detail: `Cerca de ${conv.conversion_pct.toFixed(0)}% geram clique no WhatsApp (${conv.diagnoses.toLocaleString('pt-BR')} diagnósticos analisados).`,
      suggestion: 'Use essa mensagem como referência em novos fluxos e páginas.',
    })
  }

  // 6) Volume de diagnóstico
  if ((valuation.answersTotal ?? 0) >= 20 && cards.length < 5) {
    cards.push({
      id: 'diagnosticos-volume',
      variant: 'neutral',
      emoji: '🧠',
      title: 'Há volume de respostas nos diagnósticos para refinar intenção',
      detail: `${(valuation.answersTotal ?? 0).toLocaleString('pt-BR')} respostas registradas.`,
      suggestion: 'Veja o painel de intenção para dores e objetivos mais citados.',
    })
  }

  // Fallback
  if (cards.length === 0) {
    cards.push({
      id: 'aguardando-dados',
      variant: 'neutral',
      emoji: '📊',
      title: 'Ainda poucos dados para insights automáticos neste período',
      detail: 'Quando o funil e os diagnósticos acumularem volume, os alertas aparecem aqui.',
      suggestion: 'Garanta as migrations do funil e divulgue a página inicial para gerar tráfego.',
    })
  }

  if (conversionCadastroPct != null && conversionCadastroPct < 15 && !acoesSugeridas.some((a) => a.includes('cadastro'))) {
    acoesSugeridas.push('Revisar taxa entre “escolheu área” e “conta criada”.')
  }

  return {
    cards: cards.slice(0, 5),
    maiorPerda,
    acoesSugeridas: [...new Set(acoesSugeridas)].slice(0, 6),
  }
}

function truncate(s: string, max: number): string {
  const t = s.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max)}…`
}

const FREEMIUM_KIND_LABEL: Record<FreemiumConversionKind, string> = {
  noel: 'Noel',
  whatsapp: 'WhatsApp',
  active_link: 'Diagnóstico ativo',
}

/**
 * Insights a partir dos eventos freemium (limite, paywall, clique Pro).
 */
export function buildFreemiumInsightCards(stats: FreemiumConversionStats): InsightCard[] {
  const cards: InsightCard[] = []
  const { totals, byKind } = stats
  const any =
    totals.freemium_limit_hit + totals.freemium_paywall_view + totals.freemium_upgrade_cta_click > 0
  if (!any) return []

  let best: { kind: FreemiumConversionKind; rate: number; limitHit: number; upgradeCta: number } | null = null
  const kinds: FreemiumConversionKind[] = ['whatsapp', 'noel', 'active_link']
  for (const kind of kinds) {
    const b = byKind[kind]
    if (b.limitHit < 2) continue
    const rate = b.upgradeCta / b.limitHit
    if (!best || rate > best.rate) best = { kind, rate, limitHit: b.limitHit, upgradeCta: b.upgradeCta }
  }

  if (best && best.upgradeCta > 0) {
    const label = FREEMIUM_KIND_LABEL[best.kind]
    const pct = Math.round(best.rate * 1000) / 10
    cards.push({
      id: 'freemium-cta-vs-limite',
      variant: 'info',
      emoji: '💰',
      title: `Após limite, mais cliques em “Pro” no gatilho ${label}`,
      detail: `Neste período: ${best.limitHit.toLocaleString('pt-BR')} limites atingidos e ${best.upgradeCta.toLocaleString('pt-BR')} cliques em upgrade (≈ ${pct}% em relação ao limite, neste gatilho).`,
      suggestion:
        'Compare com os outros gatilhos na tabela abaixo. Reforce copy e oferta onde a intenção de upgrade é maior.',
    })
  } else if (totals.freemium_limit_hit >= 5 && totals.freemium_upgrade_cta_click === 0) {
    cards.push({
      id: 'freemium-sem-cta',
      variant: 'warning',
      emoji: '⚠️',
      title: 'Muitos limites atingidos, poucos cliques em “Pro” registrados',
      detail: `${totals.freemium_limit_hit.toLocaleString('pt-BR')} bloqueios de limite e ${totals.freemium_upgrade_cta_click.toLocaleString('pt-BR')} cliques em upgrade no período.`,
      suggestion: 'Revise o texto do paywall e o destaque do plano Pro (Noel, WhatsApp e links).',
    })
  }

  return cards.slice(0, 2)
}
