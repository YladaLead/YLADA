/**
 * Mensagem inicial do Noel na home (com base em links/dashboard).
 * Copy curta: primeiro a pessoa age no banner; aqui só apoio, sem texto longo.
 */

export type NoelContextualAction = {
  label: string
  /** Envia como mensagem ao Noel. */
  prompt?: string
  /** Navega para a URL. */
  href?: string
  /** Abre WhatsApp com texto (ex.: link do diagnóstico). */
  whatsappShareUrl?: string
  /** Copia a URL para a área de transferência. */
  copyUrl?: string
}

export type NoelContextualWelcome = {
  message: string
  actions: NoelContextualAction[]
}

type DashboardData = {
  respostas_hoje: number
  conversas_hoje: number
  respostas_semana: number
  conversas_semana: number
  links_criados_semana: number
  link_mais_ativo_semana: { id: string; title: string; respostas: number; conversas: number } | null
}

type LinkRow = {
  id: string
  slug: string
  title: string | null
  url: string
  stats?: { view: number; start: number; complete: number; cta_click: number; diagnosis_count?: number }
}

export function buildNoelContextualWelcome(
  dashboard: DashboardData | null,
  links: LinkRow[],
  prefix: string,
  leadsPath: string
): NoelContextualWelcome {
  const safeLinks = links ?? []
  const respostasHoje = dashboard?.respostas_hoje ?? 0
  const conversasHoje = dashboard?.conversas_hoje ?? 0
  const respostasSemana = dashboard?.respostas_semana ?? 0
  const linkMaisAtivo = dashboard?.link_mais_ativo_semana ?? null

  const novoLinkHref = `${prefix}/links/novo`

  if (safeLinks.length === 0) {
    return {
      message: 'Vamos montar seu primeiro link agora.',
      actions: [
        { label: 'Criar meu primeiro link', href: novoLinkHref },
        { label: 'Atrair mais clientes', prompt: 'Quero ideias para atrair mais clientes com meu link' },
        { label: 'Melhorar minhas conversas', prompt: 'Como melhorar minhas conversas quando alguém responde o link?' },
      ],
    }
  }

  const maisRecente = safeLinks[0]
  const views = maisRecente.stats?.view ?? 0
  const respostas = maisRecente.stats?.diagnosis_count ?? maisRecente.stats?.complete ?? 0
  const url = maisRecente.url ?? `${typeof window !== 'undefined' ? window.location.origin : ''}/l/${maisRecente.slug}`

  if (views === 0) {
    return {
      message: 'Seu link ainda não foi compartilhado. Quando você envia, as pessoas começam a responder.',
      actions: [
        { label: 'Compartilhar no WhatsApp', whatsappShareUrl: url },
        { label: 'Copiar link', copyUrl: url },
        { label: 'Criar outro link', href: novoLinkHref },
      ],
    }
  }

  if (respostas === 0 && respostasSemana === 0) {
    return {
      message: 'Seu link já está no ar, mas ainda sem respostas. Vale compartilhar de novo ou ajustar o título.',
      actions: [
        { label: 'Copiar link', copyUrl: url },
        { label: 'Atrair mais clientes', prompt: 'Como melhorar meu link para gerar mais respostas?' },
        { label: 'Ver leads', href: `${prefix}/${leadsPath}` },
      ],
    }
  }

  if (respostasHoje > 0 || conversasHoje > 0) {
    const partes: string[] = []
    if (respostasHoje > 0) {
      partes.push(
        `Hoje ${respostasHoje} ${respostasHoje === 1 ? 'pessoa respondeu' : 'pessoas responderam'} seu link.`
      )
    }
    if (conversasHoje > 0) {
      partes.push(`${conversasHoje} ${conversasHoje === 1 ? 'conversa começou' : 'conversas começaram'}.`)
    }
    if (linkMaisAtivo) {
      partes.push(`“${linkMaisAtivo.title}” está entre os mais ativos esta semana.`)
    }
    return {
      message: partes.join(' '),
      actions: [
        { label: 'Ver leads', href: `${prefix}/${leadsPath}` },
        { label: 'Criar outro link', href: novoLinkHref },
        ...(linkMaisAtivo
          ? [{ label: 'Melhorar minhas conversas', href: `${prefix}/links/editar/${linkMaisAtivo.id}` } as NoelContextualAction]
          : []),
      ],
    }
  }

  if (respostasSemana > 0) {
    return {
      message: `Esta semana: ${respostasSemana} ${respostasSemana === 1 ? 'resposta' : 'respostas'} no seu link.`,
      actions: [
        { label: 'Ver leads', href: `${prefix}/${leadsPath}` },
        { label: 'Criar outro link', href: novoLinkHref },
        ...(linkMaisAtivo
          ? [{ label: 'Melhorar minhas conversas', href: `${prefix}/links/editar/${linkMaisAtivo.id}` } as NoelContextualAction]
          : []),
      ],
    }
  }

  return {
    message: 'Seu link está ativo. O próximo passo é compartilhar de novo ou acompanhar quem respondeu.',
    actions: [
      { label: 'Ver leads', href: `${prefix}/${leadsPath}` },
      { label: 'Criar outro link', href: novoLinkHref },
      { label: 'Atrair mais clientes', prompt: 'Como atrair mais pessoas para responder meu link?' },
    ],
  }
}
