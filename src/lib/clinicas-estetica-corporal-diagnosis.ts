/**
 * Pré-diagnóstico automático (regras) — tom curto, direto, menos “relatório”.
 */

export type ClinicasEsteticaAnswers = {
  pain?: string
  main_focus?: string
  lead_prep_pricing?: string
  margin_qualification?: string
  time_waste?: string
  interest_attract?: string
  timeline?: string
}

function hookPorDor(pain: string): string {
  switch (pain) {
    case 'preco_nao_fecha':
      return 'Hoje você já tem movimento… mas boa parte das pessoas ainda chega perguntando preço — e não pronta pra fechar.'
    case 'whatsapp_sem_fecho':
      return 'Você perde tempo respondendo gente que não fecha — e isso quase sempre vem de quem chega sem critério.'
    case 'agenda_inconsistente':
      return 'Agenda indo de cheia a vazia costuma ser sinal de demanda entrando irregular — não só “sorte do mês”.'
    case 'depende_promocao':
      return 'Quando o fluxo depende de promoção, aperta a margem e muda o perfil que chega — você sente isso no fechamento.'
    case 'movimento_mais_faturamento':
      return 'Movimento sem faturamento proporcional aponta pra conversão, ticket ou qualificação — raramente é “falta de gente”.'
    default:
      return 'Pelo que você marcou, tem um padrão no dia a dia que está custando resultado — mesmo quando parece coisa solta.'
  }
}

export function buildClinicasEsteticaDiagnosis(a: Record<string, string>): string[] {
  const pain = a.pain || ''
  const lines: string[] = []

  lines.push('Analisei suas respostas 👇')
  lines.push(hookPorDor(pain))

  lines.push('Isso não é falta de cliente.')
  lines.push('É a forma como eles chegam até você.')

  lines.push(
    'O ponto sensível: pode estar sobrando dinheiro na mesa — não porque falta demanda, mas porque quem entra ainda não entende direito o valor do que você faz.'
  )

  if (a.lead_prep_pricing === 'sim' || a.margin_qualification === 'sim') {
    lines.push('Quando você mesma sente que poderia cobrar melhor ou ganhar mais com o mesmo esforço, o gargalo costuma estar antes do “sim”.')
  }

  if (a.time_waste === 'frequentemente' || a.time_waste === 'as_vezes') {
    lines.push('Tempo no WhatsApp com quem não avança é custo — de agenda e de cabeça.')
  }

  lines.push('Com pequenos ajustes antes do contato, dá pra fazer essas pessoas chegarem mais preparadas — e isso mexe na conversão.')
  lines.push('Mas isso precisa ser calibrado pro seu caso — clínica não é tudo igual.')

  if (a.interest_attract === 'sim_ver' || a.interest_attract === 'tenho_interesse') {
    lines.push('Você deixou claro que quer entender isso melhor — ótimo sinal.')
  }

  if (a.timeline === 'ja') {
    lines.push('Você marcou urgência: priorizar onde vaza (tempo, conversão ou ticket) costuma dar o retorno mais rápido.')
  }

  lines.push('Se fizer sentido, dá pra cruzar isso com o que rola no seu WhatsApp e na agenda — e enxergar o travamento com nome e endereço.')

  return lines
}
