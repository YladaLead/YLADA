/**
 * Gera mensagem e botões contextuais do Noel com base em dashboard e links.
 * Formato: Observação → Sugestão → Botões (mentor ativo, não chat passivo).
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

  // 1) Sem diagnósticos
  if (safeLinks.length === 0) {
    return {
      message: `Olá! Eu sou o Noel.

Você ainda tem poucos diagnósticos ativos. Criar mais diagnósticos aumenta suas chances de iniciar conversas com clientes.

Quer criar um novo?`,
      actions: [
        { label: '🧪 Criar diagnóstico', href: `${prefix}/links` },
        { label: '💡 Ideias de conteúdo', prompt: 'Preciso de ideias de conteúdo para meu marketing' },
      ],
    }
  }

  // Link mais recente (para "não compartilhado" ou "sem respostas")
  const maisRecente = safeLinks[0]
  const views = maisRecente.stats?.view ?? 0
  const respostas = maisRecente.stats?.diagnosis_count ?? maisRecente.stats?.complete ?? 0
  const url = maisRecente.url ?? `${typeof window !== 'undefined' ? window.location.origin : ''}/l/${maisRecente.slug}`

  // 2) Diagnóstico criado mas nunca compartilhado (0 visualizações)
  if (views === 0) {
    const titulo = maisRecente.title || maisRecente.slug || 'Seu diagnóstico'
    return {
      message: `Olá! Eu sou o Noel.

Você criou um diagnóstico, mas ele ainda não foi compartilhado.

Compartilhar o link é o que permite que as pessoas respondam e iniciem conversas com você. Quer compartilhar agora?`,
      actions: [
        { label: '📲 Compartilhar no WhatsApp', whatsappShareUrl: url },
        { label: '🔗 Copiar link', copyUrl: url },
        { label: '🧪 Criar outro diagnóstico', href: `${prefix}/links` },
      ],
    }
  }

  // 3) Compartilhado mas sem respostas ainda
  if (respostas === 0 && respostasSemana === 0) {
    const titulo = maisRecente.title || maisRecente.slug || 'Seu diagnóstico'
    return {
      message: `Olá! Eu sou o Noel.

Seu diagnóstico ainda não recebeu respostas. Talvez o título possa despertar mais curiosidade — ou seja um bom momento para compartilhar novamente.

Quer melhorar o diagnóstico ou copiar o link?`,
      actions: [
        { label: '✏️ Melhorar diagnóstico', href: `${prefix}/links/editar/${maisRecente.id}` },
        { label: '🔗 Copiar link', copyUrl: url },
        { label: '👥 Ver leads', href: `${prefix}/${leadsPath}` },
      ],
    }
  }

  // 4) Atividade hoje
  if (respostasHoje > 0 || conversasHoje > 0) {
    const partes: string[] = ['Olá! Eu sou o Noel.', '']
    if (respostasHoje > 0) {
      partes.push(`Hoje ${respostasHoje} ${respostasHoje === 1 ? 'pessoa respondeu' : 'pessoas responderam'} seus diagnósticos.`)
    }
    if (conversasHoje > 0) {
      partes.push(`${conversasHoje} ${conversasHoje === 1 ? 'conversa foi iniciada' : 'conversas foram iniciadas'}.`)
    }
    if (linkMaisAtivo) {
      partes.push(`O diagnóstico "${linkMaisAtivo.title}" está entre os mais ativos esta semana.`)
    }
    partes.push('', 'Quer ver os leads ou criar um novo diagnóstico?')
    return {
      message: partes.join('\n'),
      actions: [
        { label: '👥 Ver leads', href: `${prefix}/${leadsPath}` },
        { label: '🧪 Criar diagnóstico', href: `${prefix}/links` },
        ...(linkMaisAtivo
          ? [{ label: '📈 Melhorar diagnóstico', href: `${prefix}/links/editar/${linkMaisAtivo.id}` } as NoelContextualAction]
          : []),
      ],
    }
  }

  // 5) Atividade na semana (sem atividade hoje)
  if (respostasSemana > 0) {
    return {
      message: `Olá! Eu sou o Noel.

Seu diagnóstico recebeu ${respostasSemana} ${respostasSemana === 1 ? 'resposta' : 'respostas'} esta semana.

Talvez seja um bom momento para ver quem respondeu ou compartilhar novamente nas redes. O que você prefere?`,
      actions: [
        { label: '👥 Ver leads', href: `${prefix}/${leadsPath}` },
        { label: '🧪 Criar novo diagnóstico', href: `${prefix}/links` },
        ...(linkMaisAtivo
          ? [{ label: '📈 Melhorar diagnóstico', href: `${prefix}/links/editar/${linkMaisAtivo.id}` } as NoelContextualAction]
          : []),
      ],
    }
  }

  // 6) Default: tem links mas pouca atividade
  return {
    message: `Olá! Eu sou o Noel.

Você já tem diagnósticos criados. O próximo passo é compartilhar o link para começar a receber respostas e conversas.

Quer ver seus diagnósticos ou criar um novo?`,
    actions: [
      { label: '👥 Ver leads', href: `${prefix}/${leadsPath}` },
      { label: '🧪 Criar diagnóstico', href: `${prefix}/links` },
      { label: '📈 Melhorar marketing', prompt: 'Como posso melhorar meus diagnósticos?' },
    ],
  }
}
