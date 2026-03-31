/**
 * Orientação operacional no admin: rotina, checklist e próximo passo (regras sobre dados da Inteligência).
 */
import type { InsightCard } from '@/lib/inteligencia-ylada-insights'

export interface InteligenciaApiData {
  period: { from: string; to: string; label: string }
  funnel: {
    totals: Record<string, number>
    truncated: boolean
    conversionCadastroContaPct: number | null
  }
  valuation: {
    answersTotal: number
    intentTop: {
      segment: string
      intent_category: string
      answer_display: string
      cnt: number
      rank: number
      question_id?: string
      diagnosis_count?: number
    }[]
    intentConversion: {
      segment: string
      answer_display: string
      diagnoses: number
      diagnoses_clicked: number
      conversion_pct: number
    }[]
  }
  whatsappClicks: number
  /** Eventos freemium (Fase 1): limite, paywall, clique Pro — mesmo período. */
  freemiumConversion: {
    totals: {
      freemium_limit_hit: number
      freemium_paywall_view: number
      freemium_upgrade_cta_click: number
    }
    byKind: Record<
      'noel' | 'whatsapp' | 'active_link',
      { limitHit: number; paywallView: number; upgradeCta: number }
    >
    truncated: boolean
  }
  insights: InsightCard[]
  maiorPerda: string | null
  acoesSugeridas: string[]
}

export type OrientacaoLink = { href: string; label: string }

/** Próximo passo sugerido a partir dos dados (regras fixas — não é chat com IA). */
export function orientacaoProximoPasso(d: InteligenciaApiData): {
  titulo: string
  texto: string
  links: OrientacaoLink[]
} {
  const hasId = (id: string) => d.insights.some((i) => i.id === id)

  if (d.maiorPerda === 'cadastro' || hasId('vazamento-cadastro')) {
    return {
      titulo: 'O que fazer agora (sugestão do sistema)',
      texto:
        'O gargalo parece estar no cadastro. Abra o Tracking no mesmo período, veja cadastro vs conta, e no Valuation alinhe a promessa ao que o cliente mais pede.',
      links: [
        { href: '/admin/tracking', label: 'Abrir Tracking' },
        { href: '/admin/ylada/valuation', label: 'Abrir Valuation' },
      ],
    }
  }
  if (d.maiorPerda === 'landing' || hasId('landing-conta')) {
    return {
      titulo: 'O que fazer agora (sugestão do sistema)',
      texto:
        'Poucas contas em relação às visitas na página inicial. No Tracking, veja em qual etapa a queda é maior (antes ou depois de “Comece agora”). Ajuste uma coisa por vez na página inicial.',
      links: [{ href: '/admin/tracking', label: 'Abrir Tracking' }],
    }
  }
  if (hasId('segmento-compara') || hasId('segmento-lider')) {
    return {
      titulo: 'O que fazer agora (sugestão do sistema)',
      texto:
        'Há diferença entre segmentos. No Tracking, use o filtro por segmento e compare com a semana anterior. Coloque mais esforço no que converte melhor.',
      links: [{ href: '/admin/tracking', label: 'Tracking com filtro' }],
    }
  }
  if (hasId('nicho-forte')) {
    return {
      titulo: 'O que fazer agora (sugestão do sistema)',
      texto:
        'Um nicho está em destaque. Reforce mensagem e conteúdo para ele; confira no Valuation se as dores combinam com o que você comunica.',
      links: [
        { href: '/admin/tracking', label: 'Ver nichos' },
        { href: '/admin/ylada/valuation', label: 'Ver intenção' },
      ],
    }
  }
  if (hasId('whatsapp-resposta')) {
    return {
      titulo: 'O que fazer agora (sugestão do sistema)',
      texto:
        'Há respostas que ligam bem a clique no WhatsApp. Use essa linha como referência em páginas e no fluxo do diagnóstico.',
      links: [{ href: '/admin/ylada/valuation', label: 'Ver Valuation completo' }],
    }
  }
  if (hasId('freemium-sem-cta')) {
    return {
      titulo: 'O que fazer agora (sugestão do sistema)',
      texto:
        'Há volume de bloqueios de limite Free; os cliques em Pro ainda estão baixos. Reforce mensagem de valor no paywall e no botão de upgrade.',
      links: [{ href: '/admin/ylada/behavioral-data', label: 'Ver eventos comportamentais' }],
    }
  }
  if (hasId('freemium-cta-vs-limite')) {
    return {
      titulo: 'O que fazer agora (sugestão do sistema)',
      texto:
        'Um dos gatilhos (Noel, WhatsApp ou diagnóstico) está gerando mais intenção de upgrade. Compare na tabela e alinhe copy e oferta.',
      links: [
        { href: '/admin/ylada/behavioral-data', label: 'Eventos detalhados' },
        { href: '/admin/tracking', label: 'Funil visitante' },
      ],
    }
  }
  const primeiraAcao = d.acoesSugeridas[0]
  return {
    titulo: 'O que fazer agora (sugestão do sistema)',
    texto: primeiraAcao
      ? `Comece por: ${primeiraAcao} Depois confira o Tracking se precisar de números por etapa.`
      : 'Leia os alertas na Inteligência, escolha só uma mudança para testar esta semana e volte na próxima para ver se o número mudou.',
    links: [
      { href: '/admin/tracking', label: 'Tracking' },
      { href: '/admin/ylada/valuation', label: 'Valuation' },
    ],
  }
}

/** Tarefas fixas para otimização (checklist semanal). */
export const CHECKLIST_TAREFAS_OTIMIZACAO: {
  id: string
  titulo: string
  detalhe: string
  href?: string
  linkLabel?: string
}[] = [
  {
    id: 'inteligencia',
    titulo: 'Abrir Inteligência YLADA',
    detalhe: 'Ver alertas e números rápidos (últimos 7 dias).',
    href: '/admin/inteligencia-ylada',
    linkLabel: 'Abrir Inteligência',
  },
  {
    id: 'tracking',
    titulo: 'Conferir o Tracking (se o alerta pedir detalhe)',
    detalhe: 'Datas, segmento e nicho — achar em qual etapa cai.',
    href: '/admin/tracking',
    linkLabel: 'Abrir Tracking',
  },
  {
    id: 'valuation',
    titulo: 'Olhar Valuation (intenção e conversão)',
    detalhe: 'O que o cliente quer e o que gera WhatsApp.',
    href: '/admin/ylada/valuation',
    linkLabel: 'Abrir Valuation',
  },
  {
    id: 'comportamental',
    titulo: 'Pico nos dados comportamentais (opcional)',
    detalhe: 'Volume geral de eventos e diagnósticos.',
    href: '/admin/ylada/behavioral-data',
    linkLabel: 'Abrir dados',
  },
  {
    id: 'uma_mudanca',
    titulo: 'Definir uma mudança só para testar',
    detalhe: 'Texto, página, nicho ou pergunta — anote o que mudou.',
  },
  {
    id: 'proxima_semana',
    titulo: 'Na próxima rodada: ver se o número melhorou',
    detalhe: 'Volte na Inteligência e compare com a semana anterior.',
    href: '/admin/inteligencia-ylada',
    linkLabel: 'Comparar na Inteligência',
  },
]

/** Chave da semana (segunda-feira) para resetar checklist naturalmente. */
export function getChecklistStorageKey(): string {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const mon = new Date(d.getFullYear(), d.getMonth(), diff)
  const y = mon.getFullYear()
  const m = String(mon.getMonth() + 1).padStart(2, '0')
  const da = String(mon.getDate()).padStart(2, '0')
  return `ylada_admin_checklist_${y}-${m}-${da}`
}
