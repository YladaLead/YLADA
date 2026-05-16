import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'

/**
 * POST /api/pro-lideres/ferramentas/seed
 * Cria as 2 ferramentas padrão com scripts para o tenant do líder.
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
        title: 'Primeira pergunta — entender a situação',
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
    description: 'Scripts para apresentar e vender o Reset Metabólico — bebida funcional de 5 dias',
    scripts: [

      // ── GERAR CONTATO ─────────────────────────────────────────────
      {
        stage: 'gerar_contato',
        contexto: 'lista_fria',
        canal: 'geral',
        title: 'Despertar curiosidade — desconhecido',
        content: `Oi [nome]! Posso te fazer uma pergunta rápida?

Você costuma sentir aquele cansaço que não passa, mesmo dormindo bem? Ou aquela sensação de inchaço no final do dia?

Pergunto porque tenho algo que tem ajudado muita gente com exatamente isso — e é bem simples. Posso te contar mais? 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'lista_fria',
        canal: 'geral',
        title: 'Abrir conversa com benefício específico',
        content: `Oi [nome]! Uma pergunta bem direta:

Você sente que o seu metabolismo está travado — que independente do que você faz, o corpo não responde como deveria?

Descobri uma bebida funcional de 5 dias que muita gente aqui está usando pra "zerar" isso. Se quiser entender como funciona, posso te contar 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'lista_quente',
        canal: 'geral',
        title: 'Convite direto para quem você conhece',
        content: `[Nome], lembrei de você agora e precisei te perguntar uma coisa:

Você anda sentindo mais cansaço, inchaço ou aquela sensação de que o corpo está pesado mesmo sem comer mal?

Pergunto porque tenho uma sacola do Reset Metabólico aqui — são 5 dias de uma bebida funcional que está bombando. Já vi resultado em gente próxima e acho que você ia gostar de experimentar. Posso te contar? 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'lista_quente',
        canal: 'geral',
        title: 'Compartilhar resultado próprio ou de cliente',
        content: `[Nome], você me permite compartilhar algo que aconteceu aqui?

[Fulano / eu mesmo] fez o Reset Metabólico — são 5 dias de uma bebida funcional — e o que mais chamou atenção foi [energia, leveza, foco, menos inchaço].

Não to fazendo propaganda — só queria saber se você teria curiosidade em entender como funciona. Me fala se quiser 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'indicacao',
        canal: 'geral',
        title: 'Pedir indicação após resultado',
        content: `[Nome]! Os seus 5 dias de Reset foram incríveis 🎉

Posso te fazer uma pergunta? Tem alguém na sua vida — amigo, familiar, colega — que você acha que se beneficiaria do mesmo jeito?

Às vezes a pessoa que mais precisa é quem a gente menos esperaria. Quem veio na sua cabeça agora? 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'indicacao',
        canal: 'geral',
        title: 'Colher indicação com contexto do produto',
        content: `[Nome], você toparia me ajudar com uma coisa?

Estou com sacolas do Reset Metabólico disponíveis esse mês — 5 dias de bebida funcional pra energia, leveza e metabolismo. Pensando nas pessoas que você conhece, tem alguém que está reclamando de cansaço, inchaço ou que sente que o corpo "não responde"?

Se quiser, posso te dar um convite pra você oferecer. Você decide se faz sentido 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'geral',
        canal: 'presencial',
        title: 'Abordagem presencial com sacola na mão',
        content: `Com licença! Posso te fazer uma pergunta rápida?

Você sente aquele cansaço que não passa, ou aquela sensação de inchaço no final do dia?

Tenho uma bebida funcional de 5 dias aqui que muita gente está usando pra "dar um reset" no metabolismo — energia, leveza, foco. Posso te mostrar em 2 minutinhos? 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'geral',
        canal: 'online',
        title: 'Primeiro contato via DM ou WhatsApp',
        content: `Oi [nome]! Aqui é [seu nome] 😊

Vi [seu post / que temos amigos em comum] e fiquei com vontade de te perguntar uma coisa:

Você costuma sentir cansaço, inchaço ou aquela sensação de que o metabolismo está "travado"?

Pergunto porque tenho uma bebida funcional de 5 dias que pode fazer sentido pro seu caso — mas só quero te contar se você tiver curiosidade real 😊`,
      },

      // ── PRIMEIRO CONTATO ──────────────────────────────────────────
      {
        stage: 'abordagem',
        contexto: 'geral',
        canal: 'geral',
        title: 'Entender qual benefício interessa mais',
        content: `Que bom que você respondeu!

Me conta: o que mais te incomoda hoje — é mais o cansaço, o inchaço, a falta de foco, ou a sensação de que o metabolismo está lento?

Pergunto porque o Reset age nas duas primeiras horas e cada pessoa sente diferente — quero entender o que seria mais impactante pra você 😊`,
      },
      {
        stage: 'abordagem',
        contexto: 'geral',
        canal: 'geral',
        title: 'Explicar o produto de forma simples',
        content: `Então te explico em poucas palavras:

O Reset Metabólico é uma bebida funcional em sachê — você mistura com água e toma por 5 dias. Não é dieta, não muda sua rotina. O que as pessoas relatam: mais energia já no primeiro dia, menos inchaço, menos vontade de doce, e uma sensação geral de leveza.

O que mais te chamou atenção nessa descrição? 😊`,
      },
      {
        stage: 'abordagem',
        contexto: 'lista_quente',
        canal: 'geral',
        title: 'Conversa direta com quem você conhece',
        content: `[Nome], você sabe que só te falei porque acho que pode fazer diferença real pra você, né?

Me conta uma coisa honesta: o que mais está te incomodando agora — é cansaço, inchaço, falta de energia, ou outra coisa?

Com isso entendo se o Reset faz sentido pro seu momento 😊`,
      },
      {
        stage: 'abordagem',
        contexto: 'lista_fria',
        canal: 'geral',
        title: 'Aprofundar com quem não te conhece',
        content: `Que bom que você respondeu!

Me conta: quando você fala que o corpo não está respondendo bem, como isso aparece no seu dia a dia? É cansaço logo de manhã, inchaço à tarde, dificuldade de foco, ou outra coisa?

Quero entender o que é mais real pra você antes de qualquer coisa 😊`,
      },
      {
        stage: 'abordagem',
        contexto: 'indicacao',
        canal: 'geral',
        title: 'Abordagem com quem foi indicado',
        content: `Oi [nome]! Que bom que você topou conversar 😊

[Nome de quem indicou] comentou que você poderia se interessar no Reset Metabólico. Antes de te explicar qualquer coisa, me conta:

O que está te incomodando hoje — é mais cansaço, inchaço, falta de energia, ou outra coisa?`,
      },
      {
        stage: 'abordagem',
        contexto: 'geral',
        canal: 'presencial',
        title: 'Após mostrar a sacola pessoalmente',
        content: `E aí, o que você achou?

Alguma coisa chamou sua atenção — nos benefícios, na simplicidade, ou ficou com alguma dúvida?

(Pode falar à vontade — prefiro entender o que você está pensando de verdade 😊)`,
      },
      {
        stage: 'abordagem',
        contexto: 'geral',
        canal: 'online',
        title: 'Aprofundar por DM ou WhatsApp',
        content: `Que bom que você respondeu!

Antes de te explicar tudo, me conta: o que mais te incomoda no dia a dia — é o cansaço, o inchaço, a falta de foco ou a sensação de que o metabolismo está lento?

Com isso consigo te mostrar o que o Reset faz especificamente pro seu caso 😊`,
      },

      // ── ACOMPANHAMENTO ────────────────────────────────────────────
      {
        stage: 'followup',
        contexto: 'geral',
        canal: 'geral',
        title: 'Dia 1 — confirmar que começou',
        content: `Oi [nome]! Só passando pra saber: você conseguiu tomar a primeira sacola hoje?

O que achou do sabor? Sentiu alguma coisa diferente nas primeiras horas — mais energia, menos fome, alguma sensação nova?

Conte aqui 😊`,
      },
      {
        stage: 'followup',
        contexto: 'geral',
        canal: 'geral',
        title: 'Dia 3 — meio do caminho',
        content: `Oi [nome]! Dia 3 — metade do caminho! Como está sendo?

Às vezes nessa fase a pessoa já começa a sentir diferença no metabolismo — menos inchaço, mais energia, menos vontade de doce. Em outras, o corpo ainda está se ajustando.

Como você está se sentindo? Alguma dúvida? 😊`,
      },
      {
        stage: 'followup',
        contexto: 'geral',
        canal: 'geral',
        title: 'Dia 5 — último dia',
        content: `[Nome]! Hoje é o último dia do Reset 🎉

Me conta: o que você sentiu nesses 5 dias — teve mais energia, menos inchaço, menos vontade de doce, ou outra coisa?

Quero ouvir sua versão com detalhes 😊`,
      },
      {
        stage: 'followup',
        contexto: 'geral',
        canal: 'geral',
        title: 'Silêncio após apresentação',
        content: `Oi [nome]! Aqui é [seu nome].

Não quero incomodar — só queria saber se você ainda tem interesse no Reset ou se mudou de ideia. Tudo bem de qualquer jeito, só preciso saber pra organizar as sacolas 😊

Uma pergunta direta: o que faria você querer experimentar?`,
      },
      {
        stage: 'followup',
        contexto: 'geral',
        canal: 'presencial',
        title: 'Follow-up após mostrar pessoalmente',
        content: `Oi [nome]! Passando rapidinho.

Ficou com alguma dúvida depois que a gente conversou — às vezes a gente vai embora e a dúvida aparece só depois 😄

Tem alguma coisa que ficou na sua cabeça?`,
      },
      {
        stage: 'followup',
        contexto: 'geral',
        canal: 'online',
        title: 'Follow-up 48h — DM ou WhatsApp',
        content: `Oi [nome]! Passando rapidinho.

Você conseguiu pensar um pouco no que conversamos sobre o Reset? Tem alguma coisa que ficou na cabeça — boa ou ruim?

Pode me perguntar à vontade 😊`,
      },

      // ── OBJEÇÕES ─────────────────────────────────────────────────
      {
        stage: 'objecoes',
        contexto: 'geral',
        canal: 'geral',
        title: 'O que é isso exatamente?',
        content: `Boa pergunta!

O Reset Metabólico é uma bebida funcional em sachê — você mistura com água e toma por 5 dias. É da Herbalife, empresa líder mundial em bem-estar, presente em mais de 90 países.

Não é remédio, não é dieta. É uma bebida que apoia o metabolismo, dá energia, reduz o inchaço e ajuda a controlar a vontade de doce.

Teve alguma outra dúvida que ficou? 😊`,
      },
      {
        stage: 'objecoes',
        contexto: 'geral',
        canal: 'geral',
        title: 'Não acredito que funciona',
        content: `Faz sentido querer ter certeza antes.

Me conta: o que você precisaria ver pra acreditar que poderia funcionar pra você? Depoimento de alguém que você conhece, resultado em mim mesmo, alguma informação técnica?

Pergunto porque cada pessoa precisa de um tipo de evidência — e às vezes consigo mostrar exatamente o que você precisa ver 😊`,
      },
      {
        stage: 'objecoes',
        contexto: 'geral',
        canal: 'geral',
        title: 'É caro',
        content: `Entendo a preocupação — faz sentido querer ter certeza antes de investir.

Me conta: o que você gasta por semana com café, energético, suplemento ou qualquer coisa pra manter a disposição no dia a dia?

Pergunto porque quando a gente faz essa conta, os 5 dias do Reset geralmente custam menos do que parece — e ainda entrega resultado. Mas quero que você chegue nessa conclusão sozinho 😊`,
      },
      {
        stage: 'objecoes',
        contexto: 'geral',
        canal: 'geral',
        title: 'Não tenho tempo pra isso',
        content: `Faz sentido — todo mundo está corrido.

Me conta: o que você imagina que precisa fazer? O Reset é só misturar o sachê na água e tomar. Não muda sua alimentação, não exige horário específico.

Pergunto porque às vezes a gente imagina que é mais complicado do que é na prática 😊`,
      },
      {
        stage: 'objecoes',
        contexto: 'geral',
        canal: 'geral',
        title: 'Já tentei de tudo e nada funcionou',
        content: `Entendo esse cansaço — é frustrante investir e não ver resultado.

Me conta: das coisas que você tentou, o que você acha que faltou pra funcionar de verdade?

Pergunto porque o Reset é diferente de dieta ou treino — é uma bebida funcional. Muitas pessoas que chegam aqui dizendo "já tentei tudo" ficam surpresas porque é algo que elas nunca experimentaram de verdade 😊`,
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
    message: '2 ferramentas criadas com sucesso.',
    results,
  })
}
