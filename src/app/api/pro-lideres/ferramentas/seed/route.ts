import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { sanitizeProLideresScriptCopy } from '@/lib/pro-lideres-script-copy-sanitize'
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
    description: 'Scripts para convidar para o espaço, fazer delivery e acompanhar membros',
    scripts: [
      // ── GERAR CONTATO ─────────────────────────────────────────────
      {
        stage: 'gerar_contato',
        contexto: 'lista_quente',
        canal: 'geral',
        title: 'Convidar amigo para conhecer o espaço',
        content: `[Nome], posso te fazer uma pergunta?

Você tem sentido mais cansaço, aquela sensação de corpo pesado ou dificuldade de manter energia ao longo do dia?

Pergunto porque tenho um espaço aqui perto onde as pessoas vêm tomar um shake nutritivo, bater um papo e entender melhor o que está acontecendo com o corpo. Já vi muita gente transformar a disposição só com isso.

Você toparia aparecer um dia? A primeira visita é por minha conta 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'lista_quente',
        canal: 'geral',
        title: 'Compartilhar resultado próprio',
        content: `[Nome], você me permite compartilhar algo que tem acontecido comigo?

[Resultado seu — ex: estou com muito mais energia, reduzi o inchaço, durmo melhor] e algumas pessoas próximas me perguntaram o que eu estava fazendo.

Tenho um espaço aqui perto onde a gente se reúne toda manhã pra tomar um shake e cuidar da saúde junto. Seria legal te ver por aqui. Posso reservar um horário pra você? 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'lista_fria',
        canal: 'geral',
        title: 'Convidar desconhecido para o espaço',
        content: `Oi [nome]! Posso te fazer uma pergunta rápida? 🙂

Você cuida da alimentação no dia a dia ou sente que isso anda em segundo plano pela correria?

Pergunto porque tenho um espaço aqui perto onde as pessoas vêm tomar um shake nutritivo, fazer uma medição do corpo e entender o que está acontecendo com a saúde — tudo de graça na primeira visita, sem compromisso.

Se quiser conhecer, posso reservar um horário. Só me responde se fizer sentido pra você 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'lista_fria',
        canal: 'geral',
        title: 'Oferecer delivery do shake',
        content: `Oi [nome]! Uma pergunta rápida:

Você tem sentido cansaço, falta de energia ou aquela sensação de corpo pesado no final do dia?

Tenho um shake nutritivo que estou levando pra algumas pessoas experimentarem em casa — sem precisar vir a nenhum lugar. Só quero entender se faz sentido pro seu caso antes de oferecer.

Me fala: o que mais te incomoda hoje quando o assunto é disposição e saúde? 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'indicacao',
        canal: 'geral',
        title: 'Pedir indicação ao membro satisfeito',
        content: `[Nome], fico feliz em ver como você evoluiu! 🙌

Posso te fazer uma pergunta? Tem alguém próximo — amigo, familiar, colega — que você acha que se beneficiaria de vir aqui também?

Às vezes a pessoa que mais precisa é quem a gente menos esperaria. Quem veio na sua cabeça agora? 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'indicacao',
        canal: 'geral',
        title: 'Colher indicação com convite especial',
        content: `[Nome], você toparia me ajudar com uma coisa?

Estou abrindo horários novos no espaço esse mês e queria trazer pessoas que realmente se beneficiariam. Pensando na sua rede — tem alguém que você sabe que está reclamando de cansaço, inchaço ou que sente que o corpo não responde?

Posso te dar um convite pra você oferecer — primeira visita por minha conta. Você decide se faz sentido 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'geral',
        canal: 'presencial',
        title: 'Abordagem presencial — convidar para o espaço',
        content: `Com licença! Me chamou atenção sua energia — posso te fazer uma pergunta rápida?

Você costuma cuidar da alimentação ou anda difícil manter isso na correria do dia a dia?

Tenho um espaço aqui perto onde as pessoas vêm de manhã tomar um shake nutritivo, fazer medição do corpo e cuidar da saúde numa comunidade. Posso te contar mais em 2 minutinhos? 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'geral',
        canal: 'online',
        title: 'Primeiro contato via DM — convidar para o espaço',
        content: `Oi [nome]! Aqui é [seu nome] 😊

Vi [seu post / que temos amigos em comum / que você busca mais saúde] e fiquei com vontade de te perguntar:

O que mais te trava hoje quando o assunto é saúde e disposição — é a correria, a falta de consistência ou outra coisa?

Pergunto porque tenho um espaço de bem-estar aqui perto onde isso pode ser mais simples do que parece. Mas só quero te contar se realmente fizer sentido pra você 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'geral',
        canal: 'online',
        title: 'Oferecer delivery pelo WhatsApp',
        content: `Oi [nome]! Aqui é [seu nome] 😊

Tenho levado shakes nutritivos pra algumas pessoas experimentarem em casa — sem precisar ir a nenhum lugar.

Antes de te oferecer, quero entender se faz sentido: você sente cansaço, falta de energia ou aquela sensação de inchaço que não passa?

Me conta, só quero saber se pode ser útil pra você 😊`,
      },

      // ── PRIMEIRO CONTATO ──────────────────────────────────────────
      {
        stage: 'abordagem',
        contexto: 'geral',
        canal: 'geral',
        title: 'Entender o objetivo de saúde',
        content: `Que bom que você respondeu!

Me conta um pouco mais: o que você mais quer mudar hoje — é mais o peso, a disposição, o sono, o inchaço, ou outra coisa?

Pergunto porque no espaço cada pessoa tem um foco diferente, e quero entender o seu antes de qualquer coisa 😊`,
      },
      {
        stage: 'abordagem',
        contexto: 'geral',
        canal: 'geral',
        title: 'Explicar o que é o espaço',
        content: `Então te explico como funciona:

É um espaço de bem-estar onde as pessoas vêm toda manhã — tomam um shake nutritivo, fazem uma medição do corpo (peso, gordura, hidratação), batem um papo e seguem o dia com mais energia.

Não é academia, não é consultório. É mais como um clube de saúde — simples, acolhedor, sem pressão.

O que mais chamou sua atenção nisso? 😊`,
      },
      {
        stage: 'abordagem',
        contexto: 'lista_quente',
        canal: 'geral',
        title: 'Conversa direta com amigo ou conhecido',
        content: `[Nome], você sabe que eu não te chamaria pra algo que eu não acreditasse, né?

Me conta uma coisa honesta: como você está se sentindo com a sua saúde hoje — de 0 a 10, onde está?

Pergunto porque tenho algo que acho que pode fazer diferença real pra você, mas quero entender se é o momento certo antes de te explicar 😊`,
      },
      {
        stage: 'abordagem',
        contexto: 'lista_fria',
        canal: 'geral',
        title: 'Aprofundar com quem não te conhece',
        content: `Que bom que você respondeu!

Me conta: quando você pensa em cuidar da saúde, o que mais te trava — é a falta de tempo, a dificuldade de manter consistência, ou já tentou antes e não funcionou?

Pergunto porque o espaço é diferente dependendo da situação de cada pessoa. Quero entender o seu caso antes de qualquer coisa 😊`,
      },
      {
        stage: 'abordagem',
        contexto: 'indicacao',
        canal: 'geral',
        title: 'Abordagem com quem foi indicado',
        content: `Oi [nome]! Que bom que você topou conversar 😊

[Nome de quem indicou] falou de você — então quero entender melhor a sua situação antes de qualquer coisa.

Me conta: o que está te incomodando hoje na saúde? É algo que você já tentou resolver ou ainda não sabe por onde começar?`,
      },
      {
        stage: 'abordagem',
        contexto: 'geral',
        canal: 'presencial',
        title: 'Após a primeira visita ao espaço',
        content: `E aí, o que você achou da experiência?

Teve alguma coisa que chamou atenção — o shake, a medição, a energia do lugar, ou ficou com alguma dúvida?

(Pode falar à vontade — prefiro saber o que você realmente achou 😄)`,
      },
      {
        stage: 'abordagem',
        contexto: 'geral',
        canal: 'online',
        title: 'Após experimentar o shake em casa (delivery)',
        content: `Oi [nome]! E aí, você conseguiu experimentar o shake?

O que achou — gostou do sabor, sentiu alguma coisa diferente depois, ou ficou com alguma dúvida?

Sua opinião honesta me ajuda muito 😊`,
      },

      // ── ACOMPANHAMENTO ────────────────────────────────────────────
      {
        stage: 'followup',
        contexto: 'geral',
        canal: 'presencial',
        title: 'Após primeira visita — 24h',
        content: `Oi [nome]! Tudo bem?

Só passando pra saber como você se sentiu depois de ontem — teve algo que ficou na cabeça ou alguma dúvida que surgiu depois que foi embora?

Fico à disposição 😊`,
      },
      {
        stage: 'followup',
        contexto: 'geral',
        canal: 'online',
        title: 'Follow-up após conversa ou delivery — 48h',
        content: `Oi [nome]! Tudo bem?

Fiquei pensando na nossa conversa. Você conseguiu refletir um pouco sobre o que conversamos?

Tem alguma dúvida que surgiu ou algo que ficou na cabeça? Fico feliz em responder 😊`,
      },
      {
        stage: 'followup',
        contexto: 'geral',
        canal: 'geral',
        title: 'Membro frequente — celebrar progresso',
        content: `Oi [nome]! Passando aqui pra reconhecer o quanto você tem aparecido 🙌

Me conta: o que você está sentindo de diferente desde que começou a vir? No corpo, na disposição, no humor...

Quero ouvir sua versão — com detalhes 😊`,
      },
      {
        stage: 'followup',
        contexto: 'geral',
        canal: 'geral',
        title: 'Silêncio após convite',
        content: `Oi [nome]! Aqui é [seu nome].

Não quero incomodar — só queria saber se você ainda tem curiosidade em conhecer o espaço ou se mudou de ideia. Tudo bem de qualquer jeito, só preciso saber pra organizar a agenda 😊

Uma pergunta direta: o que precisaria acontecer pra você se sentir confortável em aparecer?`,
      },

      // ── OBJEÇÕES ─────────────────────────────────────────────────
      {
        stage: 'objecoes',
        contexto: 'geral',
        canal: 'geral',
        title: 'Não tenho tempo para ir ao espaço',
        content: `Faz sentido — todo mundo está corrido.

Me conta: em que horário do dia você costuma ter uns 20 ou 30 minutos mais tranquilos? Mesmo que seja cedo, no almoço ou no intervalo?

Pergunto porque o espaço funciona de manhã cedo justamente pra encaixar antes do trabalho. Muita gente que disse "não tenho tempo" acabou tornando isso parte da rotina 😊`,
      },
      {
        stage: 'objecoes',
        contexto: 'geral',
        canal: 'geral',
        title: 'Não quero gastar dinheiro',
        content: `Completamente válido!

E olha — a primeira visita é por minha conta: você vem, toma o shake, faz a medição do corpo e conhece o espaço sem gastar nada e sem compromisso nenhum.

A ideia é você entender o que é antes de qualquer decisão. Você toparia vir só pra conhecer? 😊`,
      },
      {
        stage: 'objecoes',
        contexto: 'geral',
        canal: 'geral',
        title: 'Não sei se funciona pra mim',
        content: `É uma dúvida honesta e eu respeito muito isso.

Me conta: o que você precisaria ver ou sentir pra acreditar que poderia funcionar pra você? Resultado de alguém que você conhece? Experimentar antes? Uma explicação técnica?

Pergunto porque pessoas diferentes precisam de evidências diferentes — e às vezes consigo mostrar exatamente o que você precisa ver 😊`,
      },
      {
        stage: 'objecoes',
        contexto: 'geral',
        canal: 'geral',
        title: 'O que é isso? É Herbalife?',
        content: `Sim, os produtos são da Herbalife — empresa líder mundial em bem-estar, presente em mais de 90 países há 45 anos, com mais de 300 cientistas na equipe.

Mas o espaço em si é meu — é um clube de bem-estar que eu opero aqui no bairro. O foco é na experiência, no resultado e na comunidade, não na marca.

O que fez você perguntar? Tem alguma dúvida específica sobre os produtos ou sobre como funciona? 😊`,
      },
      {
        stage: 'objecoes',
        contexto: 'geral',
        canal: 'geral',
        title: 'Já tentei shake e não funcionou',
        content: `Entendo — e faz sentido você ser cético depois de uma experiência que não entregou.

Me conta: o que você usou antes? Era um shake de farmácia, de academia, ou outro?

Pergunto porque a composição nutricional faz toda a diferença — e às vezes o que não funcionou foi justamente pela qualidade do produto, não pela ideia em si. Mas quero entender o seu histórico antes de qualquer coisa 😊`,
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
  {
    name: 'Oportunidade de Negócio',
    emoji: '💼',
    description: 'Scripts para apresentar e recrutar novos distribuidores',
    scripts: [

      // ── GERAR CONTATO ─────────────────────────────────────────────
      {
        stage: 'gerar_contato',
        contexto: 'lista_quente',
        canal: 'geral',
        title: 'Despertar curiosidade sobre renda extra',
        content: `[Nome], posso te fazer uma pergunta?

Você está aberto a uma conversa sobre renda extra — algo que encaixe na sua rotina sem precisar larga o que você já faz?

Pergunto porque estou montando um time pequeno aqui e lembrei de você. Mas só quero te contar se você tiver curiosidade real 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'lista_quente',
        canal: 'geral',
        title: 'Convidar com base no perfil da pessoa',
        content: `[Nome], você tem um perfil que eu respeito muito — [organizado / comunicativo / determinado / que gosta de gente] — e fiquei pensando em você.

Estou com uma oportunidade de negócio aqui que combina muito com isso. Não vou te explicar tudo agora, mas queria saber: você estaria aberto a ouvir em 15 minutos?

Só me fala se quiser 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'lista_fria',
        canal: 'geral',
        title: 'Abrir conversa sobre negócio próprio',
        content: `Oi [nome]! Posso te fazer uma pergunta direta?

Você já pensou em ter um negócio próprio ou uma renda extra — mas sempre ficou travado pela falta de tempo, de capital ou de não saber por onde começar?

Pergunto porque tenho algo que pode fazer sentido pro seu perfil. Mas só quero te contar se você tiver abertura real pra ouvir 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'lista_fria',
        canal: 'geral',
        title: 'Despertar curiosidade pelo resultado',
        content: `Oi [nome]! Uma pergunta rápida:

O que te motivaria a montar um negócio do zero — seria mais a liberdade de horário, a renda extra, ou a possibilidade de crescer com uma equipe?

Pergunto porque tenho uma oportunidade aqui que combina essas três coisas — e quando vejo alguém com perfil, gosto de perguntar. Só me responde se fizer sentido pra você 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'indicacao',
        canal: 'geral',
        title: 'Abordar indicação para o negócio',
        content: `Oi [nome]! Aqui é [seu nome].

[Nome de quem indicou] me falou de você e disse que você tem perfil empreendedor. Posso te fazer uma pergunta?

Você está aberto a conhecer uma oportunidade de negócio com baixo investimento inicial e suporte completo? Não precisa decidir nada agora — só quero saber se faz sentido te contar mais 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'indicacao',
        canal: 'geral',
        title: 'Pedir indicação de empreendedores',
        content: `[Nome], você toparia me ajudar com uma coisa?

Estou montando um time de distribuidores esse mês e queria pessoas com perfil certo. Pensando nas pessoas que você conhece — tem alguém que está buscando renda extra, tem vontade de empreender mas ainda não encontrou a oportunidade certa?

Se vier alguém na sua cabeça, posso te dar uma indicação especial pra você oferecer 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'geral',
        canal: 'presencial',
        title: 'Abordagem presencial — oportunidade de negócio',
        content: `Com licença! Posso te fazer uma pergunta rápida?

Você já pensou em ter um negócio próprio ou uma renda extra que encaixe na sua rotina?

Tenho uma oportunidade aqui que muita gente está usando pra isso — e quando vejo alguém com perfil, gosto de perguntar. Posso te contar em 2 minutinhos? 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'geral',
        canal: 'online',
        title: 'Primeiro contato via DM — oportunidade',
        content: `Oi [nome]! Aqui é [seu nome] 😊

Vi [seu perfil / seus posts / que você está buscando novas oportunidades] e fiquei com vontade de te perguntar uma coisa:

Você estaria aberto a conhecer uma oportunidade de negócio com baixo investimento, suporte completo e possibilidade real de renda extra já no primeiro mês?

Só quero te contar se você tiver curiosidade real 😊`,
      },

      // ── PRIMEIRO CONTATO ──────────────────────────────────────────
      {
        stage: 'abordagem',
        contexto: 'geral',
        canal: 'geral',
        title: 'Entender a motivação principal',
        content: `Que bom que você topou conversar!

Me conta: se você fosse montar um negócio ou ter uma renda extra, o que seria mais importante pra você — a liberdade de horário, o quanto pode ganhar, ou ter suporte e não precisar se virar sozinho?

Pergunto porque dependendo da resposta, te mostro o que faz mais sentido pro seu perfil 😊`,
      },
      {
        stage: 'abordagem',
        contexto: 'geral',
        canal: 'geral',
        title: 'Entender a situação atual',
        content: `Antes de te explicar tudo, quero entender seu momento.

Me conta: você está empregado, tem um negócio próprio, ou está buscando algo novo agora?

Pergunto porque a oportunidade se encaixa diferente dependendo da situação — quero te mostrar o que faz mais sentido pro seu caso 😊`,
      },
      {
        stage: 'abordagem',
        contexto: 'lista_quente',
        canal: 'geral',
        title: 'Conversa aberta com quem você conhece',
        content: `[Nome], você sabe que eu não te chamaria pra algo que eu não acreditasse de verdade, né?

Me conta uma coisa honesta: você está satisfeito com o que você ganha hoje, ou tem vontade de mudar isso — mas ainda não encontrou o caminho certo?

Pergunto porque o que tenho pra te mostrar pode ser exatamente o que você estava procurando. Mas quero entender seu momento antes de qualquer coisa 😊`,
      },
      {
        stage: 'abordagem',
        contexto: 'lista_fria',
        canal: 'geral',
        title: 'Aprofundar com desconhecido',
        content: `Que bom que você respondeu!

Me conta: o que te travou até hoje de montar um negócio próprio — foi o medo de investir, a falta de tempo, a falta de um produto bom, ou outra coisa?

Pergunto porque cada obstáculo tem uma resposta diferente — e quero entender o seu antes de te explicar qualquer coisa 😊`,
      },
      {
        stage: 'abordagem',
        contexto: 'indicacao',
        canal: 'geral',
        title: 'Aprofundar com indicação',
        content: `Oi [nome]! Que bom que você topou conversar 😊

[Nome de quem indicou] falou bem do seu perfil. Antes de te explicar tudo, quero entender sua situação:

O que você buscaria numa oportunidade de negócio — mais autonomia, mais renda, um produto em que você acredita, ou outra coisa?`,
      },
      {
        stage: 'abordagem',
        contexto: 'geral',
        canal: 'presencial',
        title: 'Após mostrar a oportunidade pessoalmente',
        content: `E aí, o que você achou do que eu te mostrei?

Teve alguma coisa que te chamou atenção — ou alguma dúvida que surgiu agora que a gente está frente a frente?

(Pode ser honesto — prefiro saber o que você está realmente pensando 😊)`,
      },
      {
        stage: 'abordagem',
        contexto: 'geral',
        canal: 'online',
        title: 'Convidar para apresentação no Zoom',
        content: `Que bom que você tem interesse!

O próximo passo é assistir a uma apresentação de 40 minutos pelo Zoom onde tudo fica bem claro — o produto, o modelo de negócio, os números e como começar.

Você prefere [segunda às 10h / terça às 8h30 / quarta às 20h / quinta às 15h]?

Me fala qual encaixa melhor na sua semana 😊`,
      },

      // ── ACOMPANHAMENTO ────────────────────────────────────────────
      {
        stage: 'followup',
        contexto: 'geral',
        canal: 'geral',
        title: 'Após apresentação no Zoom — 24h',
        content: `Oi [nome]! Tudo bem?

Só passando pra saber o que você achou da apresentação — teve alguma coisa que chamou mais atenção ou ficou alguma dúvida?

Fico à disposição pra responder 😊`,
      },
      {
        stage: 'followup',
        contexto: 'geral',
        canal: 'geral',
        title: 'Silêncio após apresentação',
        content: `Oi [nome]! Aqui é [seu nome].

Não quero incomodar — só queria saber se você ainda tem interesse na oportunidade ou se mudou de ideia. Tudo bem de qualquer jeito 😊

Uma pergunta direta: o que te travou? É o investimento, a dúvida se funciona, o tempo, ou outra coisa?`,
      },
      {
        stage: 'followup',
        contexto: 'geral',
        canal: 'geral',
        title: 'Novo distribuidor — primeiros dias',
        content: `Oi [nome]! Bem-vindo ao time! 🎉

Só passando pra saber como está sendo o início — você já começou a falar com alguém da sua lista? Como está se sentindo?

Fico aqui pra qualquer dúvida — o começo é a parte mais importante 😊`,
      },
      {
        stage: 'followup',
        contexto: 'geral',
        canal: 'presencial',
        title: 'Follow-up após reunião presencial',
        content: `Oi [nome]! Passando rapidinho.

Ficou com alguma dúvida depois que a gente se viu — às vezes a pessoa vai embora e a dúvida aparece depois 😄

Tem alguma coisa que ficou na sua cabeça?`,
      },
      {
        stage: 'followup',
        contexto: 'geral',
        canal: 'online',
        title: 'Follow-up 48h após conversa online',
        content: `Oi [nome]! Passando rapidinho.

Você conseguiu pensar um pouco no que conversamos? Tem alguma coisa que ficou na cabeça — boa ou ruim?

Pode me perguntar à vontade 😊`,
      },

      // ── OBJEÇÕES ─────────────────────────────────────────────────
      {
        stage: 'objecoes',
        contexto: 'geral',
        canal: 'geral',
        title: 'Não tenho dinheiro para investir',
        content: `Faz sentido se preocupar com isso — é uma dúvida importante.

Me conta: o que você conseguiria reservar pra começar um negócio do zero, se soubesse que teria resultado garantido em 30 dias?

Pergunto porque o Kit Básico cabe em 3 parcelas — e com 12 sacolas vendidas na semana, você já recupera o investimento. Mas quero entender o que é possível pro seu caso 😊`,
      },
      {
        stage: 'objecoes',
        contexto: 'geral',
        canal: 'geral',
        title: 'Parece pirâmide / marketing multinível',
        content: `Entendo a desconfiança — é uma dúvida que muita gente tem e eu respeito muito isso.

Me conta: quando você pensa em "pirâmide", o que te vem na cabeça? O que te preocupa especificamente?

Pergunto porque existe uma diferença real entre pirâmide financeira (ilegal) e venda direta com produto real. A Herbalife é registrada na CVM, paga impostos e tem mais de 45 anos no mercado. Mas quero responder à dúvida específica que você tem 😊`,
      },
      {
        stage: 'objecoes',
        contexto: 'geral',
        canal: 'geral',
        title: 'Não tenho tempo para isso',
        content: `Faz sentido — todo mundo está corrido.

Me conta: como é a sua rotina hoje? Você tem uns 30 minutos por dia disponíveis, ou está realmente sem margem nenhuma?

Pergunto porque muita gente no time começa com 1 hora por dia. O modelo funciona encaixado na rotina — não precisa largar o que você já faz 😊`,
      },
      {
        stage: 'objecoes',
        contexto: 'geral',
        canal: 'geral',
        title: 'Não sei vender',
        content: `Olha, admiro você falar isso — a maioria das pessoas não assume.

Me conta: você já indicou alguma coisa pra alguém — um restaurante, um serviço, um produto — e a pessoa foi por causa de você?

Pergunto porque isso é exatamente o que a gente faz aqui. Não é venda de pressão — é indicação de algo que você acredita. E tem treinamento pra tudo 😊`,
      },
      {
        stage: 'objecoes',
        contexto: 'geral',
        canal: 'geral',
        title: 'Já tentei algo parecido e não funcionou',
        content: `Entendo esse cansaço — é frustrante investir tempo e energia e não ver resultado.

Me conta: o que você tentou antes? O que funcionou e o que não funcionou?

Pergunto porque os motivos pelos quais as coisas não funcionam costumam ser sempre os mesmos — falta de produto bom, falta de suporte ou falta de método. Quero entender o seu caso antes de qualquer coisa 😊`,
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
      title: sanitizeProLideresScriptCopy(s.title),
      content: sanitizeProLideresScriptCopy(s.content),
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
    message: '3 ferramentas criadas com sucesso.',
    results,
  })
}
