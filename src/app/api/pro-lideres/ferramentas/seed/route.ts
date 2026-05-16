import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'

/**
 * POST /api/pro-lideres/ferramentas/seed
 * Cria as 2 ferramentas padrão com scripts socráticos para o tenant do líder.
 * Seguro: não apaga nada existente — só adiciona se não houver ferramentas ainda.
 */

type ScriptSeed = { stage: string; title: string; contexto: string; canal: string; content: string }
type ToolSeed = { name: string; emoji: string; description: string; scripts: ScriptSeed[] }

const FERRAMENTAS_SEED: ToolSeed[] = [
  {
    name: 'Espaço Vida Saudável',
    emoji: '🏠',
    description: 'Scripts para convidar, abordar e acompanhar no Espaço Vida Saudável',
    scripts: [
      // ── GERAR CONTATO ─────────────────────────────────────────────
      {
        stage: 'gerar_contato',
        contexto: 'lista_quente',
        canal: 'geral',
        title: 'Compartilhar resultado com quem você conhece',
        content: `[Nome], você me permitiria compartilhar algo que achei que poderia te interessar?

Tenho acompanhado alguns amigos aqui no espaço e os resultados de 30 dias têm me surpreendido — não só no peso, mas na disposição e no sono.

Seria legal te ver por aqui algum dia. Posso te contar mais? Só me fala se quiser 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'lista_quente',
        canal: 'geral',
        title: 'Convite via resultado próprio',
        content: `[Nome], você me permite compartilhar algo que tem acontecido comigo?

[Breve resultado seu — ex: perdi X kg, durmo melhor, tenho mais disposição] e algumas pessoas me perguntaram o que eu estava fazendo.

Não quero fazer propaganda — só queria saber se você teria curiosidade em entender como funciona. Posso te explicar em 5 minutos quando quiser 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'lista_fria',
        canal: 'geral',
        title: 'Abordagem curiosidade — desconhecido',
        content: `Oi [nome]! Posso te fazer uma pergunta rápida? 🙂

Você cuida da sua alimentação no dia a dia ou sente que isso anda em segundo plano?

Pergunto porque tenho um espaço aqui perto onde as pessoas vêm tomar um shake, medir o corpo e entender o que está acontecendo com a saúde delas — de graça, sem compromisso.

Se quiser conhecer, posso reservar um horário pra você. Mas só me responde se sentir que faz sentido 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'lista_fria',
        canal: 'geral',
        title: 'Pergunta de abertura — lista fria',
        content: `Oi [nome]! Posso te fazer uma pergunta curta?

Como está sendo sua alimentação nos últimos meses — você sente que está onde queria estar ou algo ainda incomoda?

Pergunto porque descobri algo que tem ajudado muitas pessoas aqui perto, e quando vejo alguém que pode se beneficiar, gosto de perguntar. Mas só me responde se fizer sentido pra você 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'indicacao',
        canal: 'geral',
        title: 'Pedir indicação ao cliente satisfeito',
        content: `[Nome], fico feliz em ver o quanto você avançou! 🙌

Posso te fazer uma pergunta? Você tem alguém próximo — amigo, familiar, colega — que você acha que poderia se beneficiar do mesmo jeito?

Não precisa ser "o ideal" — às vezes a pessoa que mais precisa é quem a gente menos esperaria. Quem veio na sua cabeça agora? 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'indicacao',
        canal: 'geral',
        title: 'Colher indicação com permissão',
        content: `[Nome], você toparia me ajudar com uma coisa?

Estou abrindo mais horários no espaço este mês, e queria trazer pessoas que realmente se beneficiariam. Pensando na sua rede — tem alguém que você sabe que está lutando com alimentação, peso ou disposição?

Se quiser, posso te dar um convite especial pra você oferecer pra essa pessoa. Você decide se faz sentido 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'geral',
        canal: 'presencial',
        title: 'Abordagem presencial — evento ou espaço público',
        content: `Com licença! Me chamou atenção sua energia, posso te fazer uma pergunta rápida?

Você cuida bastante da alimentação ou está em algum processo de mudança na saúde?

Pergunto porque tenho um espaço aqui perto onde as pessoas vêm entender melhor o que está acontecendo com o corpo — e quando vejo alguém que pode se interessar, gosto de perguntar. Posso te contar mais em 2 minutinhos? 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'geral',
        canal: 'online',
        title: 'Primeiro contato via DM ou WhatsApp',
        content: `Oi [nome]! Aqui é [seu nome] 😊

Vi [algum post seu / que a gente tem amigos em comum / que você está buscando mais saúde] e fiquei com vontade de te perguntar uma coisa:

O que está te travando hoje quando o assunto é saúde e alimentação — é mais falta de tempo, de consistência ou de saber por onde começar?

Pergunto porque tenho algo que pode ser relevante pro seu caso — mas só quero te contar se realmente fizer sentido pra você 😊`,
      },

      // ── ABORDAGEM ─────────────────────────────────────────────────
      {
        stage: 'abordagem',
        contexto: 'geral',
        canal: 'geral',
        title: 'Primeira pergunta socrática',
        content: `Que bom que você respondeu! Antes de te explicar tudo, me conta uma coisa:

O que você sente que mais atrapalha a sua saúde hoje — a rotina corrida, a alimentação fora de casa ou outra coisa?

Pergunto porque o espaço é diferente pra cada pessoa, e quero entender o seu caso antes de qualquer coisa 😊`,
      },
      {
        stage: 'abordagem',
        contexto: 'geral',
        canal: 'geral',
        title: 'Entender o objetivo',
        content: `Que bom que você me respondeu!

Me conta um pouco mais: o que você mais quer mudar na sua saúde hoje — é mais o peso, a disposição, o sono, ou outra coisa?

Pergunto porque o programa funciona diferente pra cada objetivo, e quero te explicar a parte que faz mais sentido pro seu caso 😊`,
      },
      {
        stage: 'abordagem',
        contexto: 'geral',
        canal: 'geral',
        title: 'Entender o histórico',
        content: `Legal você falar isso!

Antes de te explicar tudo, uma pergunta: você já tentou alguma coisa parecida antes? O que funcionou e o que não funcionou?

Quero entender seu histórico pra não te contar algo que você já sabe — e pra focar no que pode ser diferente desta vez 😊`,
      },
      {
        stage: 'abordagem',
        contexto: 'geral',
        canal: 'presencial',
        title: 'Após visitar o espaço — sondagem',
        content: `E aí, o que você achou?

Me conta — teve alguma coisa que chamou sua atenção ou que te surpreendeu?

(Não precisa ter uma resposta "certa" — fico curioso mesmo 😄)`,
      },
      {
        stage: 'abordagem',
        contexto: 'lista_quente',
        canal: 'geral',
        title: 'Conversa casual com conhecido',
        content: `Oi [nome]! Você sabe que eu nunca te ofereceria algo que eu não acreditasse, né?

Posso te fazer uma pergunta honesta? Como você está se sentindo com sua saúde hoje — de 0 a 10, onde está?

Pergunto porque tenho algo que acho que pode te interessar, mas quero entender primeiro se é o momento certo pra você 😊`,
      },
      {
        stage: 'abordagem',
        contexto: 'lista_fria',
        canal: 'geral',
        title: 'Aprofundar com quem não te conhece',
        content: `Que bom que você respondeu!

Me conta uma coisa: quando você pensa em cuidar da saúde, qual é a primeira coisa que te trava — é mais a falta de tempo, a falta de informação ou já tentou antes e não funcionou?

Pergunto porque dependendo da resposta, o que tenho pra te mostrar pode ser muito diferente do que você imagina 😊`,
      },
      {
        stage: 'abordagem',
        contexto: 'indicacao',
        canal: 'geral',
        title: 'Abordagem com quem foi indicado',
        content: `Oi [nome]! Que bom que você aceitou conversar 😊

[Nome de quem indicou] falou bem de você — então quero entender melhor o seu caso antes de qualquer coisa.

Me conta: o que está te incomodando hoje quando o assunto é saúde? É algo que você já tentou resolver ou ainda não sabe por onde começar?`,
      },
      {
        stage: 'abordagem',
        contexto: 'geral',
        canal: 'online',
        title: 'Aprofundar por DM ou WhatsApp',
        content: `Que bom que você respondeu!

Antes de te explicar tudo, quero entender melhor o seu caso. Me conta: no dia a dia, o que é mais difícil pra você — é manter uma alimentação consistente, é a falta de energia pra criar o hábito, ou outra coisa?

Pergunto porque o que tenho pra compartilhar faz muito mais sentido quando eu entendo a situação real de cada pessoa 😊`,
      },

      // ── FOLLOW-UP ─────────────────────────────────────────────────
      {
        stage: 'followup',
        contexto: 'geral',
        canal: 'presencial',
        title: 'Após visita — 24h',
        content: `Oi [nome]! Tudo bem?

Só passando pra saber como você se sentiu depois de ontem — teve algo que ficou na cabeça ou alguma dúvida que surgiu depois que foi embora?

Fico à disposição 😊`,
      },
      {
        stage: 'followup',
        contexto: 'geral',
        canal: 'online',
        title: 'Follow-up 48h — online',
        content: `Oi [nome]! Tudo bem?

Fiquei pensando na nossa conversa. Você conseguiu refletir um pouco sobre o que conversamos?

Tem alguma dúvida que surgiu ou algo que ficou na cabeça? Fico feliz em responder 😊`,
      },
      {
        stage: 'followup',
        contexto: 'geral',
        canal: 'geral',
        title: 'Após experimentar o shake',
        content: `Oi [nome]! E aí, como foi experimentar?

O que você achou — gostou do sabor, sentiu alguma diferença na disposição, ou ficou com alguma dúvida?

Sua opinião honesta me ajuda muito 😊`,
      },
      {
        stage: 'followup',
        contexto: 'geral',
        canal: 'geral',
        title: 'Silêncio de 3 dias',
        content: `Oi [nome]! Aqui é [seu nome].

Não quero incomodar, mas fiquei pensando na nossa conversa. Queria saber se você ainda tem interesse em conhecer o espaço ou se mudou de ideia — tudo bem de qualquer jeito, só quero saber pra organizar a agenda 😊

Uma pergunta rápida: o que teria que acontecer pra você se sentir confortável em experimentar?`,
      },

      // ── OBJEÇÕES ─────────────────────────────────────────────────
      {
        stage: 'objecoes',
        contexto: 'geral',
        canal: 'geral',
        title: 'Não tenho tempo',
        content: `Faz todo sentido você falar isso — a maioria das pessoas que vêm aqui disse a mesma coisa antes de conhecer.

Me conta: você costuma ter uns 30 minutinhos livres em algum momento da semana? Mesmo que seja antes do trabalho ou no intervalo?

Pergunto porque muita gente encontrou um jeito de encaixar quando viu o que era de verdade 😊`,
      },
      {
        stage: 'objecoes',
        contexto: 'geral',
        canal: 'geral',
        title: 'Não quero gastar dinheiro',
        content: `Completamente válido! E olha — a primeira visita é sem custo nenhum, sem pressão pra comprar nada.

A ideia é só você entender o que o seu corpo precisa. Muitas vezes a gente descobre que o problema é diferente do que pensava.

Você toparia conhecer só pra saber? Sem compromisso mesmo 😊`,
      },
      {
        stage: 'objecoes',
        contexto: 'geral',
        canal: 'geral',
        title: 'Não sei se funciona pra mim',
        content: `É uma dúvida super honesta e eu respeito muito isso.

Me conta: o que você precisaria ver ou sentir pra acreditar que poderia funcionar pra você?

Pergunto porque pessoas diferentes precisam de evidências diferentes — e às vezes eu consigo mostrar exatamente o que você precisa ver 😊`,
      },
      {
        stage: 'objecoes',
        contexto: 'geral',
        canal: 'geral',
        title: 'Produto caro',
        content: `Entendo a preocupação com o investimento — faz sentido querer ter certeza antes.

Posso te perguntar: quanto você gasta hoje por mês com alimentação fora de casa, cafés, lanches?

Pergunto porque quando a gente faz essa conta, o programa muitas vezes custa menos do que parece — e ainda entrega resultado. Mas quero que você chegue nessa conclusão sozinho 😊`,
      },
      {
        stage: 'objecoes',
        contexto: 'geral',
        canal: 'geral',
        title: 'Já tentei de tudo',
        content: `Entendo bem esse cansaço — é frustrante tentar e não ver resultado.

Posso te perguntar uma coisa? Das vezes que você tentou, o que você acha que faltou pra realmente funcionar?

Pergunto porque aqui a gente não começa pelo produto — começa entendendo o seu caso. Pode ser que a resposta seja diferente do que você esperava 😊`,
      },
    ],
  },
  {
    name: 'Reset Metabólico',
    emoji: '🔄',
    description: 'Scripts para o programa Reset Metabólico',
    scripts: [
      {
        stage: 'gerar_contato',
        contexto: 'lista_fria',
        canal: 'geral',
        title: 'Despertar curiosidade — desconhecido',
        content: `Oi [nome]! Posso te fazer uma pergunta?

Você já sentiu que mesmo comendo bem e se exercitando, o seu corpo não responde como deveria?

Pergunto porque descobri algo que pode explicar isso — e que ajudou muitas pessoas aqui. Posso te contar mais se você quiser 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'lista_quente',
        canal: 'geral',
        title: 'Convite com urgência e exclusividade',
        content: `[Nome], estou fazendo uma coisa diferente esse mês e lembrei de você.

Um grupo pequeno — umas 5 pessoas só — vai fazer um reset de 10 dias focado em metabolismo e disposição. Não é dieta radical, é uma reeducação guiada.

Você teria interesse em saber mais antes de eu fechar as vagas? 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'indicacao',
        canal: 'geral',
        title: 'Pedir indicação após resultado',
        content: `[Nome]! Você concluiu o Reset e os resultados foram incríveis 🎉

Posso te fazer uma pergunta? Tem alguém na sua vida que você acha que passaria pela mesma transformação se tivesse a oportunidade?

Às vezes a pessoa que mais precisa é quem a gente não esperaria. Quem veio na sua cabeça agora? 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'geral',
        canal: 'presencial',
        title: 'Abordagem presencial — Reset',
        content: `Com licença! Posso te fazer uma pergunta rápida?

Você já sentiu que o seu corpo não responde mais como antes — mesmo quando você tenta comer melhor ou se movimentar mais?

Pergunto porque tenho um programa de 10 dias que muita gente aqui fez pra "zerar o sistema" e voltar a sentir diferença. Posso te contar mais em 2 minutos? 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'geral',
        canal: 'online',
        title: 'Primeiro contato via DM — Reset',
        content: `Oi [nome]! Aqui é [seu nome] 😊

Vi [seu post / que você busca mais saúde / que temos amigos em comum] e fiquei curioso:

Você já sentiu que o metabolismo tá "travado" — que independente do que você faz, o corpo não responde?

Pergunto porque tenho algo que pode fazer sentido pro seu caso. Mas só quero te contar se você tiver curiosidade real 😊`,
      },
      {
        stage: 'abordagem',
        contexto: 'lista_quente',
        canal: 'geral',
        title: 'Aprofundar com amigo ou conhecido — Reset',
        content: `[Nome], você sabe que só te falei porque acho que pode fazer diferença de verdade pra você, né?

Me conta uma coisa honesta: o que mais te incomoda hoje — é mais estético, é disposição, é o sono, ou é uma mistura de tudo?

Pergunto porque o Reset age diferente dependendo do caso. Quero entender o seu antes de te explicar qualquer coisa 😊`,
      },
      {
        stage: 'abordagem',
        contexto: 'lista_fria',
        canal: 'geral',
        title: 'Aprofundar com desconhecido — Reset',
        content: `Que bom que você respondeu!

Me conta: quando você fala que o corpo não responde, como isso aparece no dia a dia — é cansaço, é peso que não sai, é falta de disposição pra começar o dia?

Quero entender o que é mais real pra você antes de qualquer coisa 😊`,
      },
      {
        stage: 'abordagem',
        contexto: 'indicacao',
        canal: 'geral',
        title: 'Abordagem com quem foi indicado — Reset',
        content: `Oi [nome]! Que bom que você topou conversar 😊

[Nome de quem indicou] comentou que você poderia se interessar — mas quero entender o seu caso antes de qualquer coisa.

Me conta: o que está te incomodando hoje? É mais relacionado a peso, energia, ou algo diferente?`,
      },
      {
        stage: 'abordagem',
        contexto: 'geral',
        canal: 'presencial',
        title: 'Após mostrar o Reset pessoalmente',
        content: `E aí, o que você achou do que eu te expliquei?

Teve alguma coisa que te chamou mais atenção — ou alguma dúvida que surgiu agora que a gente está frente a frente?

(Fique à vontade pra ser honesto — prefiro entender o que você está pensando de verdade 😊)`,
      },
      {
        stage: 'abordagem',
        contexto: 'geral',
        canal: 'online',
        title: 'Aprofundar por DM — Reset',
        content: `Que bom que você respondeu!

Antes de te explicar como funciona o Reset, me conta uma coisa: você já fez algum programa de 10 dias ou curto assim antes? O que aconteceu — funcionou, desistiu, ou o resultado não ficou?

Pergunto porque o Reset tem um jeito diferente de funcionar, e quero saber se vai fazer sentido pro seu histórico 😊`,
      },
      {
        stage: 'followup',
        contexto: 'geral',
        canal: 'presencial',
        title: 'Follow-up após conversa presencial — Reset',
        content: `Oi [nome]! Tudo bem?

Passando pra saber se ficou com alguma dúvida depois que a gente conversou — às vezes a pessoa vai embora e aí a dúvida aparece 😄

Tem alguma coisa que ficou na sua cabeça?`,
      },
      {
        stage: 'followup',
        contexto: 'geral',
        canal: 'online',
        title: 'Follow-up 48h — DM/WhatsApp — Reset',
        content: `Oi [nome]! Passando rapidinho.

Você conseguiu pensar um pouco no que conversamos sobre o Reset? Tem alguma coisa que ficou na cabeça — boa ou ruim — que você queira perguntar?

Pode me mandar à vontade 😊`,
      },
      {
        stage: 'abordagem',
        contexto: 'geral',
        canal: 'geral',
        title: 'Entender o histórico',
        content: `Que bom que você topou conversar!

Me conta: você já fez alguma dieta ou programa de saúde antes? O que aconteceu — teve resultado, desistiu no meio, ou o resultado não durou?

Pergunto porque o Reset funciona diferente dependendo do histórico da pessoa. Quero entender o seu caso antes de explicar tudo 😊`,
      },
      {
        stage: 'abordagem',
        contexto: 'geral',
        canal: 'geral',
        title: 'Identificar a dor principal',
        content: `Legal! Antes de te explicar como funciona, quero entender uma coisa:

O que te incomoda mais hoje — a balança, a falta de energia, o inchaço, ou outra coisa?

Com isso em mente consigo te mostrar a parte do programa que vai fazer mais diferença pra você especificamente 😊`,
      },
      {
        stage: 'followup',
        contexto: 'geral',
        canal: 'geral',
        title: 'Follow-up pós explicação',
        content: `Oi [nome]! Passando rapidinho.

Você conseguiu pensar um pouco no que conversamos sobre o Reset? Tem alguma dúvida que surgiu — sobre como funciona, sobre os dias, sobre o que é permitido?

Pode me perguntar à vontade 😊`,
      },
      {
        stage: 'followup',
        contexto: 'geral',
        canal: 'geral',
        title: 'Suporte no dia 3 do programa',
        content: `Oi [nome]! Dia 3 — como está sendo?

Às vezes nessa fase a gente sente um pouco de diferença no corpo — pode ser uma leve dor de cabeça, mais disposição, ou até nada ainda.

Como você está se sentindo? Alguma dúvida ou dificuldade?`,
      },
      {
        stage: 'followup',
        contexto: 'geral',
        canal: 'geral',
        title: 'Celebrar o fim do programa',
        content: `[Nome]! Parabéns por concluir os 10 dias! 🎉

Me conta: o que mudou pra você? Tanto no físico quanto em como você se sente no dia a dia.

Quero ouvir sua versão — sem pressa, com detalhes 😊`,
      },
      {
        stage: 'objecoes',
        contexto: 'geral',
        canal: 'geral',
        title: 'É muito radical / restritivo',
        content: `Faz sentido essa preocupação — a palavra "reset" às vezes assusta um pouco.

Me conta: o que você imagina que vai ter que abrir mão? Quero entender o que está te preocupando especificamente.

Pergunto porque a maioria das pessoas fica surpresa com o quanto é mais tranquilo do que parecia 😊`,
      },
      {
        stage: 'objecoes',
        contexto: 'geral',
        canal: 'geral',
        title: 'Não tenho disciplina',
        content: `Olha, admiro muito você ser honesto com isso — a maioria das pessoas não fala.

Me faz uma pergunta: o que acontece nas vezes que você começa algo e não continua? É falta de tempo, de motivação, ou a metodologia não te ajuda a manter?

Pergunto porque o Reset foi desenhado justamente pra quem já tentou e caiu — tem suporte diário. Mas quero entender se faria diferença pra você 😊`,
      },
    ],
  },
]

export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, auth.user)
  if (!ctx) return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  if (ctx.role !== 'leader') return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })

  // Verifica se já existem ferramentas — não sobrescreve
  const { data: existing } = await supabaseAdmin
    .from('prolider_tools')
    .select('id')
    .eq('tenant_id', ctx.tenant.id)
    .limit(1)

  if (existing && existing.length > 0) {
    return NextResponse.json({
      ok: false,
      message: 'Ferramentas já existem para este tenant. Seed não foi aplicado.',
    })
  }

  const results: { tool: string; scripts: number }[] = []

  for (let order = 0; order < FERRAMENTAS_SEED.length; order++) {
    const toolSeed = FERRAMENTAS_SEED[order]

    // Cria a ferramenta
    const { data: tool, error: toolErr } = await supabaseAdmin
      .from('prolider_tools')
      .insert({
        tenant_id: ctx.tenant.id,
        name: toolSeed.name,
        emoji: toolSeed.emoji,
        description: toolSeed.description,
        is_active: true,
        display_order: order + 1,
      })
      .select('id')
      .single()

    if (toolErr || !tool) {
      return NextResponse.json({ error: `Erro ao criar ${toolSeed.name}: ${toolErr?.message}` }, { status: 500 })
    }

    // Cria os scripts
    const scriptsToInsert = toolSeed.scripts.map((s, idx) => ({
      tenant_id: ctx.tenant.id,
      tool_id: tool.id,
      stage: s.stage,
      contexto: s.contexto ?? 'geral',
      canal: s.canal ?? 'geral',
      title: s.title,
      content: s.content,
      is_active: true,
      display_order: idx + 1,
    }))

    const { error: scriptsErr } = await supabaseAdmin
      .from('prolider_scripts')
      .insert(scriptsToInsert)

    if (scriptsErr) {
      return NextResponse.json({ error: `Erro ao criar scripts de ${toolSeed.name}: ${scriptsErr.message}` }, { status: 500 })
    }

    results.push({ tool: toolSeed.name, scripts: toolSeed.scripts.length })
  }

  return NextResponse.json({
    ok: true,
    message: '2 ferramentas criadas com scripts socráticos.',
    results,
  })
}
