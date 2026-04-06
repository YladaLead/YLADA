/**
 * Pré-diagnóstico automático (regras) pós-formulário B2B estética corporal.
 * Tom: insight + tensão + potencial, sem prometer solução fechada.
 */

export type ClinicasEsteticaAnswers = {
  pain?: string
  main_focus?: string
  lead_prep_pricing?: string
  margin_qualification?: string
  time_waste?: string
  team_structure?: string
  interest_attract?: string
  timeline?: string
}

function painNuance(pain: string): string | null {
  switch (pain) {
    case 'preco_nao_fecha':
      return 'Pelo que você descreveu, muitas conversas parecem girar em torno de preço antes da pessoa entender o valor do tratamento — e isso costuma travar o fechamento.'
    case 'agenda_inconsistente':
      return 'A oscilação entre dias cheios e dias vazios costuma refletir inconsistência na entrada de demanda qualificada, não só “sorte” da agenda.'
    case 'depende_promocao':
      return 'Depender de promoções para manter o fluxo tende a comprimir margem e atrair um perfil menos alinhado com o que você realmente quer vender.'
    case 'whatsapp_sem_fecho':
      return 'Perder tempo no WhatsApp com quem não avança é um sinal de que o contato muitas vezes chega cedo demais ou sem critério — e isso drena energia da equipe.'
    case 'movimento_mais_faturamento':
      return 'Ter movimento sem faturamento proporcional indica que conversão, ticket ou qualificação podem estar abaixo do potencial da sua operação.'
    default:
      return null
  }
}

function openingLine(a: ClinicasEsteticaAnswers): string {
  const focus = a.main_focus
  if (focus === 'corporal') {
    return 'Pelo que você respondeu, sua clínica tem forte foco em estética corporal — um nicho em que a forma como a pessoa chega até você faz diferença direta na conversão e no valor percebido.'
  }
  if (focus === 'corporal_facial') {
    return 'Pelo que você respondeu, sua clínica equilibra corporal e facial: isso amplia oportunidades, mas também exige clareza na mensagem para não diluir o que você quer priorizar.'
  }
  if (focus === 'mais_facial') {
    return 'Pelo que você respondeu, o peso maior está no facial — mesmo assim, como as pessoas entram em contato e qualificam interesse ainda define quanto da agenda vira faturamento real.'
  }
  return 'Pelo que você respondeu, sua operação tem particularidades — e o ponto de travamento quase nunca é “só falta divulgar mais”, e sim como a demanda entra e é conduzida até o sim.'
}

export function buildClinicasEsteticaDiagnosis(a: Record<string, string>): string[] {
  const pain = a.pain || ''
  const nuance = painNuance(pain)

  const blocks: string[] = []

  blocks.push('Analisamos suas respostas 👇')

  blocks.push(openingLine(a))

  if (nuance) {
    blocks.push(nuance)
  } else if (pain === 'outro') {
    blocks.push(
      'Há um gargalo específico no seu dia a dia — quando ele não está nomeado, ele continua custando agenda e margem sem você perceber o padrão.'
    )
  }

  blocks.push(
    'Isso normalmente não é “falta de cliente” no sentido bruto de volume — é falta de um filtro e de uma condução antes do contato, para quem chega já vir mais preparado para avançar.'
  )

  if (a.lead_prep_pricing === 'sim') {
    blocks.push(
      'Você sinalizou que poderia cobrar melhor se as pessoas chegassem mais preparadas — isso é um indicador forte de que o gargalo está antes da consulta, não só na hora de passar o valor.'
    )
  } else if (a.lead_prep_pricing === 'talvez') {
    blocks.push(
      'Você está em dúvida se o preço “trava” ou se a preparação do cliente é que falha — na prática, os dois se misturam: quem chega desalinhado força negociação e desgaste.'
    )
  }

  if (a.margin_qualification === 'sim') {
    blocks.push(
      'Quando a margem sofre mesmo com demanda, muitas vezes o caldo grosso é qualificação: sem filtro, você ocupa slot de agenda com perfil que não sustenta o ticket que sua operação precisa.'
    )
  } else if (a.margin_qualification === 'talvez') {
    blocks.push(
      'Se a margem “poderia ser melhor”, vale olhar com honestidade quanto da sua energia vai para conversas que nunca viram retorno — isso é custo invisível.'
    )
  }

  if (a.time_waste === 'frequentemente') {
    blocks.push(
      'Você indicou que tempo com atendimentos que não viram venda é frequente — isso não é preguiça da equipe; é sintoma de processo e de entrada de lead desalinhada.'
    )
  } else if (a.time_waste === 'as_vezes') {
    blocks.push(
      'Mesmo quando isso acontece “às vezes”, em escala isso vira horas de agenda que poderiam ir para quem realmente fecha.'
    )
  }

  blocks.push(
    'Isso sugere que pode haver faturamento e previsibilidade na mesa — não por falta de procura em si, mas pela forma como as pessoas chegam e como a conversa é conduzida até a decisão.'
  )

  blocks.push(
    'Com pequenos ajustes na captação e na condução (sem mudar seu posicionamento de uma hora para outra), dá para aumentar conversão e até o valor que você consegue sustentar — desde que o ajuste seja coerente com a sua realidade.'
  )

  blocks.push(
    'O ponto exato de travamento muda de clínica para clínica: estrutura de equipe, canal principal, ticket médio e tipo de procedimento puxam cenários diferentes.'
  )

  if (a.interest_attract === 'sim_ver' || a.interest_attract === 'tenho_interesse') {
    blocks.push(
      'Você demonstrou abertura para entender como atrair gente mais preparada antes do contato — esse é o tipo de alavanca que costuma destravar agenda e margem ao mesmo tempo.'
    )
  }

  if (a.timeline === 'ja') {
    blocks.push('Você marcou urgência — priorizar onde está o vazamento (tempo, conversão ou ticket) costuma dar o retorno mais rápido.')
  } else if (a.timeline === '30d') {
    blocks.push('Um horizonte de cerca de 30 dias é realista para testar mudanças pontuais e medir impacto na conversão.')
  }

  blocks.push(
    'Se fizer sentido no seu momento, o próximo passo é cruzar essas respostas com o que acontece no seu WhatsApp e na agenda — e aí sim enxergar o “ponto específico” do seu caso, com clareza para agir.'
  )

  return blocks
}
