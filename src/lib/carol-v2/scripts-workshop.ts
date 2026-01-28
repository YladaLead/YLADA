/**
 * Scripts do workshop — fonte única, espelhando FLUXO-COMPLETO-WHATSAPP-SCRIPTS.md.
 * Cada função retorna o texto exato com placeholders substituídos.
 */

export interface OpcaoAula {
  diasemana: string
  data: string
  hora: string
  linkZoom?: string
}

const LINK_CADASTRO_PADRAO = 'https://www.ylada.com/pt/nutri#oferta'

function sub(template: string, vars: Record<string, string>): string {
  let out = template
  for (const [k, v] of Object.entries(vars)) {
    out = out.replace(new RegExp(`\\[${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]`, 'gi'), v ?? '')
  }
  return out
}

// --- 1.1 Boas-vindas com clique (cadastro + clicou WhatsApp) ---
const TMPL_BOAS_VINDAS_COM_CLIQUE = `Olá [NOME], seja bem-vindo! 👋

Obrigada por fazer sua inscrição na Aula Prática ao Vivo de Como Encher a Agenda! 🎉

Teremos aula na próxima [DIA_DA_SEMANA], [DATA]. Aqui estão as opções:

📅 Opção 1:
[DIASEMANA_1], [DATA_1]
🕒 [HORA_1] (Brasília)

📅 Opção 2:
[DIASEMANA_2], [DATA_2]
🕒 [HORA_2] (Brasília)

Qual você prefere? 💚`

export function getScriptBoasVindasComClique(
  nome: string,
  opcao1: OpcaoAula,
  opcao2: OpcaoAula
): string {
  return sub(TMPL_BOAS_VINDAS_COM_CLIQUE, {
    NOME: nome || '',
    DIA_DA_SEMANA: opcao1.diasemana || '',
    DATA: opcao1.data || '',
    DIASEMANA_1: opcao1.diasemana || '',
    DATA_1: opcao1.data || '',
    HORA_1: opcao1.hora || '',
    DIASEMANA_2: opcao2.diasemana || '',
    DATA_2: opcao2.data || '',
    HORA_2: opcao2.hora || '',
  })
}

// --- 1.2 Boas-vindas sem clique (agendado, horário comercial) ---
const TMPL_BOAS_VINDAS_SEM_CLIQUE = `Olá [NOME], seja bem-vindo! 👋

Obrigada por fazer sua inscrição na Aula Prática ao Vivo de Como Encher a Agenda! 🎉

Aqui estão as duas próximas opções de aula:

🗓️ **Opção 1:**
[DIASEMANA_1], [DATA_1]
🕒 [HORA_1] (Brasília)
🔗 [LINK_ZOOM_1]

🗓️ **Opção 2:**
[DIASEMANA_2], [DATA_2]
🕒 [HORA_2] (Brasília)
🔗 [LINK_ZOOM_2]

✅ Se precisar reagendar, responda REAGENDAR.

Qualquer dúvida, é só me chamar! 💚

Carol - Secretária YLADA Nutri`

export function getScriptBoasVindasSemClique(
  nome: string,
  opcao1: OpcaoAula,
  opcao2: OpcaoAula
): string {
  return sub(TMPL_BOAS_VINDAS_SEM_CLIQUE, {
    NOME: nome || '',
    DIASEMANA_1: opcao1.diasemana || '',
    DATA_1: opcao1.data || '',
    HORA_1: opcao1.hora || '',
    LINK_ZOOM_1: opcao1.linkZoom || '',
    DIASEMANA_2: opcao2.diasemana || '',
    DATA_2: opcao2.data || '',
    HORA_2: opcao2.hora || '',
    LINK_ZOOM_2: opcao2.linkZoom || '',
  })
}

// --- 2.1 Pré-aula 24h ---
const TMPL_PRE_AULA_24H = `Olá [NOME]! 👋

Lembrete: Sua aula é amanhã!

🗓️ [DIASEMANA], [DATA]
🕒 [HORA] (horário de Brasília)

🔗 [LINK_ZOOM]

Nos vemos lá! 😊

Carol - Secretária YLADA Nutri`

export function getScriptPreAula24h(
  nome: string,
  sessao: OpcaoAula
): string {
  return sub(TMPL_PRE_AULA_24H, {
    NOME: nome || '',
    DIASEMANA: sessao.diasemana || '',
    DATA: sessao.data || '',
    HORA: sessao.hora || '',
    LINK_ZOOM: sessao.linkZoom || '',
  })
}

// --- 2.2 Pré-aula 12h ---
const TMPL_PRE_AULA_12H = `Olá [NOME]! 

Sua aula é hoje às [HORA]! 

💻 *Recomendação importante:*

O ideal é participar pelo computador ou notebook, pois:
* Compartilhamos slides
* Fazemos explicações visuais
* É importante acompanhar e anotar

Pelo celular, a experiência fica limitada e você pode perder partes importantes da aula.

🔗 [LINK_ZOOM]

Carol - Secretária YLADA Nutri`

export function getScriptPreAula12h(nome: string, sessao: OpcaoAula): string {
  return sub(TMPL_PRE_AULA_12H, {
    NOME: nome || '',
    HORA: sessao.hora || '',
    LINK_ZOOM: sessao.linkZoom || '',
  })
}

// --- 2.3 Pré-aula 2h ---
const TMPL_PRE_AULA_2H = `Olá [NOME]! 

Sua aula começa em 2 horas! ⏰

⚠️ *Aviso importante:*

A sala do Zoom será aberta 10 minutos antes do horário da aula.

⏰ Após o início da aula, não será permitido entrar, ok?

Isso porque os 10 primeiros minutos são essenciais:
é nesse momento que identificamos os principais desafios das participantes para que a aula seja realmente prática e personalizada.

🔗 [LINK_ZOOM]

Nos vemos em breve! 😊

Carol - Secretária YLADA Nutri`

export function getScriptPreAula2h(nome: string, sessao: OpcaoAula): string {
  return sub(TMPL_PRE_AULA_2H, {
    NOME: nome || '',
    LINK_ZOOM: sessao.linkZoom || '',
  })
}

// --- 2.4 Pré-aula 30min — "Começamos em 30 minutos" ---
const TMPL_PRE_AULA_30MIN = `Olá [NOME]! 

Começamos em 30 minutos! ⏰

🔗 [LINK_ZOOM]

Nos vemos em breve! 😊

Carol - Secretária YLADA Nutri`

export function getScriptPreAula30min(nome: string, sessao: OpcaoAula): string {
  return sub(TMPL_PRE_AULA_30MIN, {
    NOME: nome || '',
    LINK_ZOOM: sessao.linkZoom || '',
  })
}

// --- 2.5 Pré-aula 10min — "A sala está aberta" ---
const TMPL_PRE_AULA_10MIN = `Olá [NOME]! 

A sala está aberta! 🎉

🔗 [LINK_ZOOM]

Você pode entrar agora e já começar a se preparar. 

Nos vemos em breve! 😊

Carol - Secretária YLADA Nutri`

export function getScriptPreAula10min(nome: string, sessao: OpcaoAula): string {
  return sub(TMPL_PRE_AULA_10MIN, {
    NOME: nome || '',
    LINK_ZOOM: sessao.linkZoom || '',
  })
}

// --- 3.1 Link pós-participou ---
const TMPL_LINK_POS_PARTICIPOU = `Olá [NOME]! 💚

Excelente! Parabéns por ter participado! 🎉

Espero que tenha gostado e tenho certeza que isso realmente pode fazer diferença na sua vida.

Agora me conta: o que você mais gostou? E como você prefere começar?

Você prefere começar com o plano mensal para validar e verificar, ou você já está determinado a mudar sua vida e prefere o plano anual?

🔗 [LINK_CADASTRO]

O que você acha? 😊

Carol - Secretária YLADA Nutri`

export function getScriptLinkPosParticipou(
  nome: string,
  linkCadastro: string = LINK_CADASTRO_PADRAO
): string {
  return sub(TMPL_LINK_POS_PARTICIPOU, {
    NOME: nome || '',
    LINK_CADASTRO: linkCadastro || LINK_CADASTRO_PADRAO,
  })
}

// --- 4.1 Remarketing (não participou) ---
const TMPL_REMARKETING = `Olá [NOME]! 👋

Vi que você não conseguiu participar da aula anterior. Tudo bem, acontece! 😊

Que tal tentarmos novamente? Aqui estão novas opções de dias e horários:

🗓️ **Opção 1:**
[DIASEMANA_1], [DATA_1]
🕒 [HORA_1] (Brasília)
🔗 [LINK_ZOOM_1]

🗓️ **Opção 2:**
[DIASEMANA_2], [DATA_2]
🕒 [HORA_2] (Brasília)
🔗 [LINK_ZOOM_2]

Se alguma dessas opções funcionar para você, é só me avisar! 

Qualquer dúvida, estou aqui! 💚

Carol - Secretária YLADA Nutri`

export function getScriptRemarketing(
  nome: string,
  opcao1: OpcaoAula,
  opcao2: OpcaoAula
): string {
  return sub(TMPL_REMARKETING, {
    NOME: nome || '',
    DIASEMANA_1: opcao1.diasemana || '',
    DATA_1: opcao1.data || '',
    HORA_1: opcao1.hora || '',
    LINK_ZOOM_1: opcao1.linkZoom || '',
    DIASEMANA_2: opcao2.diasemana || '',
    DATA_2: opcao2.data || '',
    HORA_2: opcao2.hora || '',
    LINK_ZOOM_2: opcao2.linkZoom || '',
  })
}

// --- 6.1 Follow-up não respondeu 24h ---
const TMPL_FOLLOW_UP_24H = `Olá! 👋

Vi que você ainda não escolheu um horário para a aula. 

Ainda está disponível? Se precisar de ajuda, é só me chamar! 😊

Carol - Secretária YLADA Nutri`

export function getScriptFollowUpNaoRespondeu24h(): string {
  return TMPL_FOLLOW_UP_24H
}

// --- 6.2 Follow-up não respondeu 48h ---
const TMPL_FOLLOW_UP_48H = `Olá! 

Ainda estou aqui caso queira agendar a aula. 

Se alguma dessas opções funcionar, é só me avisar:

🗓️ *Opções Disponíveis:*

*Opção 1:*
[DIASEMANA_1], [DATA_1]
🕒 [HORA_1] (horário de Brasília)

*Opção 2:*
[DIASEMANA_2], [DATA_2]
🕒 [HORA_2] (horário de Brasília)

Qualquer dúvida, estou à disposição! 💚

Carol - Secretária YLADA Nutri`

export function getScriptFollowUpNaoRespondeu48h(
  opcao1: OpcaoAula,
  opcao2: OpcaoAula
): string {
  return sub(TMPL_FOLLOW_UP_48H, {
    DIASEMANA_1: opcao1.diasemana || '',
    DATA_1: opcao1.data || '',
    HORA_1: opcao1.hora || '',
    DIASEMANA_2: opcao2.diasemana || '',
    DATA_2: opcao2.data || '',
    HORA_2: opcao2.hora || '',
  })
}

// --- 6.3 Follow-up não respondeu 72h (última) ---
const TMPL_FOLLOW_UP_72H = `Olá! 

Esta é minha última mensagem sobre a aula. Se ainda tiver interesse, me avise! 

Caso contrário, tudo bem também. 😊

Carol - Secretária YLADA Nutri`

export function getScriptFollowUpNaoRespondeu72h(): string {
  return TMPL_FOLLOW_UP_72H
}
