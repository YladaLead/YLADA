/** Detecta auto-resposta de bots/assistentes de WhatsApp Business (clínicas). */
export function isAutoResponse(text: string): boolean {
  const t = text.toLowerCase().replace(/\s+/g, ' ').trim()
  const patterns = [
    'seja bem-vindo',
    'seja bem-vinda',
    'seja muito bem-vindo',
    'seja muito bem-vinda',
    'bem-vindo(a)',
    'bem vindo(a)',
    'bem-vinda!',
    'bem vinda!',
    'olá, seja',
    'agradecemos sua mensagem',
    'agradecemos o contato',
    'agradecemos por entrar em contato',
    'obrigada pelo contato',
    'obrigado pelo contato',
    'obrigada por entrar em contato',
    'obrigado por entrar em contato',
    'obrigada por nos contatar',
    'obrigado por nos contatar',
    'não estamos disponíveis no momento',
    'nao estamos disponiveis no momento',
    'no momento não estamos disponíveis',
    'no momento nao estamos disponiveis',
    'responderemos assim que possível',
    'responderemos assim que for possível',
    'responderemos assim que possivel',
    'assim que possível responderemos',
    'sua mensagem é muito importante',
    'sua mensagem e muito importante',
    'mensagem recebida com sucesso',
    'recebemos sua mensagem',
    'recebemos o seu contato',
    'nossa equipe retornará',
    'nossa equipe responderá',
    'nossa equipe responde em breve',
    'nossa equipe entrará em contato',
    'assim que possível, nossa equipe',
    'assim que possível nossa equipe',
    'retornará para te atender',
    'retornaremos para te atender',
    'nossa equipe vai retornar',
    'atendimento está encerrado',
    'atendimento encerrado',
    'fora do horário de atendimento',
    'fora de horário',
    'nosso horário de atendimento',
    'no momento, nosso atendimento',
    'em breve retornarei',
    'retornarei sua mensagem',
    'retornaremos em breve',
    'retornaremos o contato',
    'entraremos em contato em breve',
    'voltarei assim que possível',
    'fora do expediente',
    'expediente encerrado',
    'estamos fechados',
    'horário comercial',
    'horario comercial',
    'assistente de atendimento',
    'assistente virtual',
    'secretária virtual',
    'secretaria virtual',
    'atendimento virtual',
    'atendimento online',
    'chatbot',
    'menu de opções',
    'menu de opcoes',
    'escolha uma opção',
    'escolha uma opcao',
    'digite 1 para',
    'digite 2 para',
    'mensagem automática',
    'resposta automática',
    'este é um atendimento automático',
    'você entrou em contato com',
    'estamos fora do ar',
    'deixe sua mensagem por aqui',
    'aguardo sua mensagem',
    'adorar conversar com você',
    'pode responder com o nome',
    'estou à disposição para tirar',
    'estou a disposição para tirar',
    'vagas deste mês estão',
    'garantir seu horário',
    'aguarde um momento',
    'aguarda um momento',
    'aguarde um instante',
    'já irei te responder',
    'já vou te responder',
    'logo irei te responder',
    'logo te respondo',
    'logo te atendo',
    'logo estarei com você',
    'já te atendo',
    'em instantes te atendo',
    'em instantes irei te atender',
    'vou te responder em breve',
    'responderei em breve',
    'respondo em breve',
    'em breve entrarei em contato',
    'em breve entraremos em contato',
    'fico feliz por entrar em contato',
    'feliz por entrar em contato',
    'informe seu nome completo',
    'melhor data e horário',
    'melhor data e horario',
    'método exclusivo',
    'metodo exclusivo',
    'jornada de saúde',
    'jornada de saude',
    'descubra como é',
    'ansiosa por essa transformação',
    'ansioso por essa transformação',
    'retornar. em breve',
    'te retornar',
    'clínica de estética',
    'clinica de estetica',
    'estética e bem-estar',
    'estetica e bem-estar',
    'spa e estética',
    'nosso atendimento é de segunda',
    'atendimento de segunda a sexta',
    'horário de funcionamento',
    'horario de funcionamento',
    'tire suas dúvidas',
    'tire suas duvidas',
    'como posso ajudar você hoje',
    'como posso ajudar voce hoje',
    'selecione uma opção',
    'selecione uma opcao',
    'pressione 1',
    'toque em uma opção',
    'toque em uma opcao',
    'whatsapp business',
    'mensagem fora do horário',
    'mensagem fora do horario',
  ]

  const stripped = t.replace(/[\s​-‍﻿]/g, '')
  const emojiOnlyPattern = /^(\p{Emoji})+$/u
  if (stripped.length <= 6 && emojiOnlyPattern.test(stripped)) return true

  const hasLink = t.includes('http') || t.includes('www.') || t.includes('.com.br')
  const foreignWelcomeBot =
    hasLink &&
    (t.includes('método exclusivo') ||
      t.includes('metodo exclusivo') ||
      t.includes('jornada de') ||
      t.includes('informe seu nome') ||
      t.includes('em breve entrarei') ||
      t.includes('fico feliz por entrar em contato'))

  const isBotStructure =
    t.length > 180 &&
    (t.includes('especialista em') ||
      t.includes('procedimento') ||
      t.includes('horário disponível')) &&
    (t.includes('aguardo') ||
      t.includes('disposição') ||
      t.includes('disposicao') ||
      t.includes('adorar'))

  const regexAuto =
    /(agradecemos\s+(sua\s+mensagem|o\s+contato|por\s+entrar\s+em\s+contato)|obrigad[oa]\s+por\s+(entrar\s+em\s+contato|seu\s+contato|sua\s+mensagem|nos\s+contatar)|n[aã]o\s+estamos\s+dispon[ií]veis|responderemos\s+assim\s+que\s+(poss[ií]vel|for\s+poss[ií]vel)|em\s+breve\s+(retornaremos|entraremos\s+em\s+contato|te\s+responderemos)|nossa\s+equipe\s+(retornar[aá]|responder[aá]|entrar[aá]\s+em\s+contato))/i

  return (
    patterns.some((p) => t.includes(p)) ||
    regexAuto.test(t) ||
    isBotStructure ||
    foreignWelcomeBot
  )
}

const IGNORED_AUTO_PREFIX = '[auto-resposta ignorada]'

/** Texto bruto da mensagem do lead (sem prefixo de auto-resposta ignorada). */
export function stripIgnoredAutoPrefix(content: string): string {
  if (content.startsWith(IGNORED_AUTO_PREFIX)) {
    return content.slice(IGNORED_AUTO_PREFIX.length).trim()
  }
  return content.trim()
}

export function isIgnoredAutoReplyMessage(content: string): boolean {
  return content.startsWith(IGNORED_AUTO_PREFIX)
}
