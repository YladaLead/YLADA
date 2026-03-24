import {
  YLADA_MENU_GROUPS,
  getYladaAreaPathPrefix,
  getYladaLeadsPath,
  getYladaSuportePath,
} from '@/config/ylada-areas'

const SEGMENT_LABELS: Record<string, string> = {
  ylada: 'YLADA',
  med: 'Médicos',
  psi: 'Psicologia',
  psicanalise: 'Psicanálise',
  odonto: 'Odontologia',
  nutra: 'Nutra',
  nutri: 'Nutri',
  coach: 'Coach',
  perfumaria: 'Perfumaria',
  seller: 'Vendedores',
  estetica: 'Estética',
  fitness: 'Fitness',
}

/**
 * System prompt da Nina — suporte ao produto (navegação, telas), não mentoria de negócio.
 */
export function buildNinaSupportSystemPrompt(opts: {
  segment: string
  localeInstruction: string
  profileResumo: string
  linksAtivosBlock: string
}): string {
  const prefix = getYladaAreaPathPrefix(opts.segment)
  const lines: string[] = [
    'Você é a Nina, assistente virtual de suporte do app YLADA.',
    `O usuário está na área "${SEGMENT_LABELS[opts.segment] ?? opts.segment}" (segmento: ${opts.segment}).`,
    'Papel: explicar COMO USAR a plataforma — menu, Painel, Noel (mentor), Links, Leads, Crescimento, Como usar, Perfil, Assinatura, Configurações, Suporte.',
    'O Noel em "Noel (mentor)" é outro fluxo: estratégia, diagnósticos e marketing. Você não substitui o mentor; só ajuda com dúvidas do sistema.',
    'Responda em português do Brasil, objetivo e cordial. Use listas curtas quando ajudar.',
    'Não invente telas, botões ou URLs. Use apenas os caminhos listados abaixo.',
    'Se a dúvida for complexa, técnica demais ou fora do app, sugira falar com a Carol no WhatsApp da equipe (atendimento humano).',
    'Não dê orientação médica, jurídica ou financeira.',
    opts.localeInstruction.trim(),
    '',
    `[PREFIXO DAS ROTAS DESTA ÁREA: ${prefix}]`,
    '[ITENS DO MENU LATERAL]',
  ]

  for (const g of YLADA_MENU_GROUPS) {
    lines.push(`— ${g.label}:`)
    for (const it of g.items) {
      const path =
        it.key === 'leads'
          ? getYladaLeadsPath(opts.segment)
          : it.key === 'suporte'
            ? getYladaSuportePath(opts.segment)
            : it.path
      const hash = 'hash' in it && it.hash ? `#${it.hash}` : ''
      lines.push(`  • ${it.label}: ${prefix}/${path}${hash}`)
    }
  }

  lines.push('')
  lines.push('Outros:')
  lines.push('  • Chamados/tickets da plataforma: /pt/suporte/tickets')
  lines.push('  • Perfil empresarial (matriz central): /pt/perfil-empresarial')

  if (opts.profileResumo.trim()) {
    lines.push('')
    lines.push('[CONTEXTO DO PERFIL — personalize exemplos; não cite dados sensíveis literalmente]')
    lines.push(opts.profileResumo)
  }

  if (opts.linksAtivosBlock.trim()) {
    lines.push('')
    lines.push('[LINKS INTELIGENTES ATIVOS DO USUÁRIO — use se perguntarem onde estão os links]')
    lines.push(opts.linksAtivosBlock)
  }

  return lines.join('\n')
}
