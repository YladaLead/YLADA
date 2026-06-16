/**
 * WELLNESS SYSTEM - Biblioteca Completa de Scripts Oficiais
 * 
 * Scripts organizados por categoria e por fluxo específico
 * Baseado nas Lousas oficiais do Sistema Wellness
 */

import { Script, TipoScript, FluxoId } from '@/types/ylada-flow-legacy'

// ============================================
// SCRIPTS GERAIS (UNIVERSAIS PARA TODOS OS FLUXOS)
// ============================================

export const scriptsGerais: Record<TipoScript, Script[]> = {
  abertura: [
    {
      id: 'abertura-1',
      tipo: 'abertura',
      titulo: 'Abertura Direta (para pessoas próximas)',
      conteudo: `Amiga/o, posso te mandar uma avaliação rápida? Dá pra ver exatamente onde sua energia está caindo. É gratuito e leva menos de 1 minuto.`,
      contexto: 'Usar com pessoas próximas, familiares ou amigos',
      variacoes: []
    },
    {
      id: 'abertura-2',
      tipo: 'abertura',
      titulo: 'Abertura Leve / Amigável',
      conteudo: `Oi! Testei uma avaliação rápida sobre energia e bem-estar, lembrei de você. Quer que eu te envie?`,
      contexto: 'Usar quando há uma relação amigável mas não muito próxima',
      variacoes: []
    },
    {
      id: 'abertura-3',
      tipo: 'abertura',
      titulo: 'Abertura Curiosa (a mais poderosa)',
      conteudo: `Posso te enviar um teste rapidinho que mostra seu nível atual de energia e o que está te atrapalhando no dia? Muita gente se surpreende com o resultado.`,
      contexto: 'A mais eficaz - cria curiosidade e interesse',
      variacoes: []
    },
    {
      id: 'abertura-4',
      tipo: 'abertura',
      titulo: 'Abertura Consultiva (para público mais formal)',
      conteudo: `Olá! Estou trabalhando com avaliações rápidas de energia e disposição. Elas ajudam a identificar padrões do dia a dia e sugerem pequenas ações. Gostaria de fazer a sua?`,
      contexto: 'Usar com público mais formal ou profissional',
      variacoes: []
    },
    {
      id: 'abertura-5',
      tipo: 'abertura',
      titulo: 'Abertura Ultra Curta (1 linha)',
      conteudo: `Posso te mandar uma avaliação rápida de energia?`,
      contexto: 'Para mensagens rápidas ou quando o tempo é limitado',
      variacoes: []
    },
    {
      id: 'abertura-6',
      tipo: 'abertura',
      titulo: 'Abertura para Lead Frio (não te conhece)',
      conteudo: `Oi! Vi que muitas pessoas com rotinas parecidas com a sua têm usado essa avaliação rápida para entender onde estão perdendo energia no dia. Posso te enviar a sua?`,
      contexto: 'Para pessoas que não te conhecem bem',
      variacoes: []
    },
    {
      id: 'abertura-7',
      tipo: 'abertura',
      titulo: 'Abertura para Lead Morno (já interagiu)',
      conteudo: `Vi sua mensagem/curtida e lembrei: tenho uma avaliação rápida que mostra onde a energia está caindo. Quer fazer a sua?`,
      contexto: 'Para pessoas que já tiveram alguma interação',
      variacoes: []
    },
    {
      id: 'abertura-8',
      tipo: 'abertura',
      titulo: 'Abertura para Lead Quente (já demonstrou interesse)',
      conteudo: `Você comentou sobre cansaço… posso te mandar uma avaliação rápida que mostra exatamente o que está causando isso no seu dia?`,
      contexto: 'Para pessoas que já demonstraram interesse ou mencionaram o problema',
      variacoes: []
    },
    {
      id: 'abertura-9',
      tipo: 'abertura',
      titulo: 'Abertura via Indicação',
      conteudo: `Oi! A [NOME] me falou que você anda sentindo cansaço no dia a dia. Posso te enviar uma avaliação rápida que ela mesma fez e gostou?`,
      contexto: 'Quando a pessoa foi indicada por alguém',
      variacoes: []
    },
    {
      id: 'abertura-10',
      tipo: 'abertura',
      titulo: 'Abertura para Lista Antiga / Contatos Parados',
      conteudo: `Oi! Estou enviando para algumas pessoas uma avaliação rápida que mostra como melhorar energia e disposição. Se quiser, posso te mandar também?`,
      contexto: 'Para reativar contatos antigos ou parados',
      variacoes: []
    }
  ],
  'pos-link': [
    {
      id: 'pos-link-1',
      tipo: 'pos-link',
      titulo: 'Pós-link — poucos minutos depois (reforço suave)',
      conteudo: `Acabei de te enviar o link da avaliação 😊 Se não aparecer aí pra você, me avisa que eu te mando de novo.`,
      contexto: 'Enviar poucos minutos após compartilhar o link',
      momento: 'poucos minutos',
      variacoes: []
    },
    {
      id: 'pos-link-2',
      tipo: 'pos-link',
      titulo: 'Pós-link — 2 horas depois (sem resposta)',
      conteudo: `Conseguiu ver a avaliação que te mandei mais cedo? Ela é bem rapidinha e já mostra onde sua energia está caindo no dia.`,
      contexto: 'Enviar 2 horas após o link, se não houve resposta',
      momento: '2h',
      variacoes: []
    },
    {
      id: 'pos-link-3',
      tipo: 'pos-link',
      titulo: 'Pós-link — 24h depois (lembrete leve)',
      conteudo: `Passando aqui só pra lembrar da avaliação que te enviei ontem. Ela leva menos de 1 minuto e o resultado já te dá algumas ideias pra melhorar seu dia 😉`,
      contexto: 'Enviar 24 horas após o link',
      momento: '24h',
      variacoes: []
    },
    {
      id: 'pos-link-4',
      tipo: 'pos-link',
      titulo: 'Pós-link — 48h depois (último lembrete educado)',
      conteudo: `Vou encerrar essa avaliação para liberar espaço pra outras pessoas, tá? Se ainda quiser fazer, me avisa que eu seguro o link pra você.`,
      contexto: 'Último lembrete, 48 horas após',
      momento: '48h',
      variacoes: []
    },
    {
      id: 'pos-link-5',
      tipo: 'pos-link',
      titulo: 'Pós-link — pessoa disse "depois eu vejo"',
      conteudo: `Perfeito! Quando for um bom momento pra você fazer (leva menos de 1 minutinho), me avisa que eu te mando de novo ou deixo aqui separadinho 😊`,
      contexto: 'Quando a pessoa disse que vai ver depois',
      variacoes: []
    },
    {
      id: 'pos-link-6',
      tipo: 'pos-link',
      titulo: 'Pós-link — pessoa está ocupada (trabalho / filhos / correria)',
      conteudo: `Super entendo a correria! Deixa salvo aí que, na hora que você tiver 1 minutinho, vale a pena fazer. O resultado já te ajuda a entender o que está drenando sua energia.`,
      contexto: 'Quando a pessoa está ocupada',
      variacoes: []
    },
    {
      id: 'pos-link-7',
      tipo: 'pos-link',
      titulo: 'Pós-link — pessoa começou e não terminou',
      conteudo: `Vi aqui que você chegou a iniciar a avaliação mas não finalizou. Se quiser, eu posso segurar seu link e você termina quando tiver 1 minuto livre 😉`,
      contexto: 'Quando o sistema identificar que iniciou mas não completou',
      variacoes: []
    },
    {
      id: 'pos-link-8',
      tipo: 'pos-link',
      titulo: 'Pós-link — retomada com curiosidade',
      conteudo: `Te conto uma coisa curiosa: a maioria das pessoas se surpreende com o resultado dessa avaliação. Quando você fizer a sua, me conta se fez sentido pra você também?`,
      contexto: 'Para reativar interesse com curiosidade',
      variacoes: []
    }
  ],
  'pos-diagnostico': [
    {
      id: 'pos-diagnostico-1',
      tipo: 'pos-diagnostico',
      titulo: 'Pós-diagnóstico — Versão Curta (universal)',
      conteudo: `Vi aqui seu resultado! Ele mostra exatamente o que está drenando sua energia no dia. Quer que eu te explique como melhorar isso já nos próximos dias?`,
      contexto: 'Versão curta e direta, funciona para todos os fluxos',
      variacoes: []
    },
    {
      id: 'pos-diagnostico-2',
      tipo: 'pos-diagnostico',
      titulo: 'Pós-diagnóstico — Versão Média (mais consultiva)',
      conteudo: `Acabei de ver o seu diagnóstico. Ele mostra bem o que está atrapalhando sua energia e disposição. Se quiser, te explico de forma simples o que está acontecendo e o que você pode fazer para melhorar já essa semana.`,
      contexto: 'Versão mais consultiva e explicativa',
      variacoes: []
    },
    {
      id: 'pos-diagnostico-3',
      tipo: 'pos-diagnostico',
      titulo: 'Pós-diagnóstico — Versão Persuasiva (forte para conversão)',
      conteudo: `Seu diagnóstico é exatamente o tipo de padrão que, quando ajustado, muda completamente o dia da pessoa. Com pequenas ações, dá pra sentir diferença em poucos dias. Posso te mostrar o que seria mais eficiente no seu caso?`,
      contexto: 'Versão mais persuasiva, ideal para conversão',
      variacoes: []
    },
    {
      id: 'pos-diagnostico-4',
      tipo: 'pos-diagnostico',
      titulo: 'Pós-diagnóstico — Versão Emocional (ideal para fluxos de estresse, mães, exaustão)',
      conteudo: `Li seu diagnóstico e ele diz muito sobre a fase que você está vivendo. Isso não é frescura e não é normal sentir esse peso todos os dias. Com pequenas mudanças, você pode voltar a sentir leveza e energia de verdade. Quer que eu te oriente no passo a passo?`,
      contexto: 'Versão emocional, para dores mais profundas',
      variacoes: []
    },
    {
      id: 'pos-diagnostico-5',
      tipo: 'pos-diagnostico',
      titulo: 'Pós-diagnóstico — Se o diagnóstico for de ENERGIA',
      conteudo: `Seu resultado mostra queda de energia em momentos chave do dia. Isso explica muito da sua dificuldade de disposição e foco. Posso te mostrar a solução mais simples e leve pra ajustar isso?`,
      contexto: 'Específico para diagnósticos de energia',
      variacoes: []
    },
    {
      id: 'pos-diagnostico-6',
      tipo: 'pos-diagnostico',
      titulo: 'Pós-diagnóstico — Se o diagnóstico for de ACELERA (inchaço, retenção, peso)',
      conteudo: `Seu resultado mostra sinais de retenção e lentidão digestiva/metabólica. Isso geralmente causa inchaço, peso e cansaço. Quer que eu te mostre o protocolo mais simples para aliviar isso rápido?`,
      contexto: 'Específico para diagnósticos de acelera (retenção, inchaço)',
      variacoes: []
    },
    {
      id: 'pos-diagnostico-7',
      tipo: 'pos-diagnostico',
      titulo: 'Pós-diagnóstico — Se a pessoa reagiu ao resultado com surpresa',
      conteudo: `Normal mesmo! Muita gente se surpreende quando vê tudo tão claro no diagnóstico. A boa notícia é que o seu caso tem solução simples. Posso te explicar?`,
      contexto: 'Quando a pessoa demonstrou surpresa com o resultado',
      variacoes: []
    },
    {
      id: 'pos-diagnostico-8',
      tipo: 'pos-diagnostico',
      titulo: 'Pós-diagnóstico — Se a pessoa disse "É bem isso mesmo"',
      conteudo: `Fico feliz que você se identificou! Isso já é metade do caminho. Posso te mostrar agora o que funciona melhor para esse tipo de padrão?`,
      contexto: 'Quando a pessoa se identificou fortemente com o resultado',
      variacoes: []
    },
    {
      id: 'pos-diagnostico-9',
      tipo: 'pos-diagnostico',
      titulo: 'Pós-diagnóstico — Se a pessoa não reagiu ao resultado',
      conteudo: `Deu uma olhadinha no diagnóstico? Ele mostra o que está travando sua energia no dia. Quando quiser, te explico o passo a passo pra melhorar isso.`,
      contexto: 'Quando a pessoa não reagiu ou não respondeu',
      variacoes: []
    }
  ],
  oferta: [
    {
      id: 'oferta-1',
      tipo: 'oferta',
      titulo: 'Oferta Direta — Kit Energia (para fluxos de cansaço, foco, rotina pesada, manhã/tarde/noite)',
      conteudo: `Pelo seu diagnóstico, o protocolo mais eficiente para o seu caso é o *Kit Energia* (5 dias). Ele ajuda a estabilizar sua energia, melhorar o foco e evitar essas quedas do dia. Quer que eu te explique como funciona o kit e como usar no seu horário?`,
      contexto: 'Oferta direta do Kit Energia',
      variacoes: []
    },
    {
      id: 'oferta-2',
      tipo: 'oferta',
      titulo: 'Oferta Direta — Kit Acelera (para inchaço, retenção, metabolismo lento, peso)',
      conteudo: `No seu caso, o que traz resultado mais rápido é o *Kit Acelera* (5 dias). Ele ajuda na leveza, reduz retenção e melhora muito a sensação de peso. Quer que eu te envie como funciona certinho?`,
      contexto: 'Oferta direta do Kit Acelera',
      variacoes: []
    },
    {
      id: 'oferta-3',
      tipo: 'oferta',
      titulo: 'Oferta Consultiva — quando a pessoa pede orientação',
      conteudo: `Pelo seu diagnóstico, eu analisaria duas opções, mas a principal — e mais eficiente no seu caso — é este kit aqui (Energia/Acelera). Posso te mostrar como ele funciona na rotina e o que ele melhora primeiro?`,
      contexto: 'Quando a pessoa pediu orientação',
      variacoes: []
    },
    {
      id: 'oferta-4',
      tipo: 'oferta',
      titulo: 'Oferta Natural — sem parecer venda (ótimo para pessoas sensíveis a oferta)',
      conteudo: `Posso te mostrar a solução que eu recomendaria pra alguém com exatamente o mesmo diagnóstico que o seu? É algo simples, leve e que já muda sua semana.`,
      contexto: 'Para pessoas sensíveis a ofertas diretas',
      variacoes: []
    },
    {
      id: 'oferta-5',
      tipo: 'oferta',
      titulo: 'Oferta com validação (prova social indireta)',
      conteudo: `Esse mesmo kit que seu diagnóstico indica é o que mais funciona para pessoas com esse padrão. É simples de usar e os resultados costumam aparecer logo nos primeiros dias. Quer ver como funciona?`,
      contexto: 'Usa prova social para validar',
      variacoes: []
    },
    {
      id: 'oferta-6',
      tipo: 'oferta',
      titulo: 'Oferta com gatilho de autonomia (quando a pessoa tem receio de pressão)',
      conteudo: `Vou te passar a recomendação do seu diagnóstico, sem pressão nenhuma. Aí você vê se faz sentido pra você, ok? O kit indicado é o… (Energia/Acelera).`,
      contexto: 'Para pessoas que têm receio de pressão',
      variacoes: []
    },
    {
      id: 'oferta-7',
      tipo: 'oferta',
      titulo: 'Oferta curta (WhatsApp rápido)',
      conteudo: `Pelo seu resultado, o ideal é o Kit Energia/Acelera (5 dias). Quer detalhes?`,
      contexto: 'Versão ultra curta para WhatsApp',
      variacoes: []
    },
    {
      id: 'oferta-8',
      tipo: 'oferta',
      titulo: 'Oferta para quem teve diagnóstico de nível grave ou muito forte',
      conteudo: `Seu diagnóstico mostrou sinais mais intensos desse padrão. O kit que eu recomendo pra você é o Energia/Acelera, porque ele já atua exatamente no que apareceu no resultado. Te explico como usar?`,
      contexto: 'Para diagnósticos mais graves ou intensos',
      variacoes: []
    },
    {
      id: 'oferta-9',
      tipo: 'oferta',
      titulo: 'Oferta para pessoas indecisas',
      conteudo: `Pra simplificar: o melhor primeiro passo para o que apareceu no seu diagnóstico é este kit (Energia/Acelera). Ele já melhora muito sua disposição/leveza nessa semana. Quer ver como funciona?`,
      contexto: 'Para pessoas indecisas',
      variacoes: []
    },
    {
      id: 'oferta-10',
      tipo: 'oferta',
      titulo: 'Oferta elegante (sem pressão, apenas clareza)',
      conteudo: `O seu diagnóstico deixa bem claro qual é o kit ideal, e eu posso te mostrar como ele funciona — e aí você vê se faz sentido entrar no protocolo agora ou mais pra frente.`,
      contexto: 'Versão elegante, sem pressão',
      variacoes: []
    },
    {
      id: 'oferta-11',
      tipo: 'oferta',
      titulo: 'Oferta direcionada — Produto Fechado (para quem pediu mais tempo / quer experimentar mais longo prazo)',
      conteudo: `Se preferir algo que dure mais tempo, existe também a opção do produto fechado. Ele rende muitas doses e sai mais econômico. Quer que eu te envie as opções?`,
      contexto: 'Para oferecer produto fechado',
      variacoes: []
    },
    {
      id: 'oferta-12',
      tipo: 'oferta',
      titulo: 'Oferta — Cliente Premium (para quem pediu constância ou quer economia)',
      conteudo: `Como seu diagnóstico mostra que isso é algo que precisa de acompanhamento, existe a opção de você ter o protocolo completo com desconto pelo sistema *Cliente Premium*. Quer que eu te mostre como funciona?`,
      contexto: 'Para oferecer Cliente Premium',
      variacoes: []
    }
  ],
  fechamento: [
    {
      id: 'fechamento-1',
      tipo: 'fechamento',
      titulo: 'Fechamento Direto (simples e objetivo)',
      conteudo: `Quer que eu separe seu kit pra começar ainda hoje?`,
      contexto: 'Fechamento direto e objetivo',
      variacoes: []
    },
    {
      id: 'fechamento-2',
      tipo: 'fechamento',
      titulo: 'Fechamento Curto (WhatsApp rápido)',
      conteudo: `Posso reservar seu kit?`,
      contexto: 'Versão ultra curta',
      variacoes: []
    },
    {
      id: 'fechamento-3',
      tipo: 'fechamento',
      titulo: 'Fechamento Consultivo (sem pressão)',
      conteudo: `Pelo que apareceu no seu diagnóstico, esse kit é o que faz mais sentido pra você. Posso separar o seu e te explicar como usar no seu horário?`,
      contexto: 'Fechamento consultivo, sem pressão',
      variacoes: []
    },
    {
      id: 'fechamento-4',
      tipo: 'fechamento',
      titulo: 'Fechamento Emocional (para dores mais profundas)',
      conteudo: `Você não precisa continuar sentindo isso todos os dias. Posso separar seu kit pra você dar esse primeiro passo ainda hoje?`,
      contexto: 'Para dores emocionais mais profundas',
      variacoes: []
    },
    {
      id: 'fechamento-5',
      tipo: 'fechamento',
      titulo: 'Fechamento Elegante (profissional e leve)',
      conteudo: `Se você quiser, eu já deixo seu kit reservado aqui. Aí você decide se inicia hoje ou amanhã, sem problema.`,
      contexto: 'Fechamento elegante e profissional',
      variacoes: []
    },
    {
      id: 'fechamento-6',
      tipo: 'fechamento',
      titulo: 'Fechamento com Urgência (suave)',
      conteudo: `Se quiser garantir o seu kit com prioridade, posso separar agora. Me confirma?`,
      contexto: 'Cria urgência suave',
      variacoes: []
    },
    {
      id: 'fechamento-7',
      tipo: 'fechamento',
      titulo: 'Fechamento com Urgência (forte, mas educado)',
      conteudo: `Os kits que eu tenho para hoje já estão quase acabando. Quer que eu reserve o seu antes de fechar a lista?`,
      contexto: 'Cria urgência mais forte',
      variacoes: []
    },
    {
      id: 'fechamento-8',
      tipo: 'fechamento',
      titulo: 'Fechamento com Validação (prova social)',
      conteudo: `Esse mesmo protocolo tem ajudado muita gente com o mesmo diagnóstico que o seu. Quer que eu já reserve o seu também?`,
      contexto: 'Usa prova social',
      variacoes: []
    },
    {
      id: 'fechamento-9',
      tipo: 'fechamento',
      titulo: 'Fechamento com Comparação (mostra lógica)',
      conteudo: `Entre continuar sentindo tudo isso e iniciar um protocolo simples de 5 dias, qual opção faz mais sentido pra você hoje? Posso separar o seu kit?`,
      contexto: 'Usa comparação lógica',
      variacoes: []
    },
    {
      id: 'fechamento-10',
      tipo: 'fechamento',
      titulo: 'Fechamento para Indecisos (muito eficaz)',
      conteudo: `Pra facilitar: eu separo seu kit aqui. Se você decidir iniciar hoje, ótimo. Se preferir começar amanhã, ele já estará garantido.`,
      contexto: 'Para pessoas indecisas',
      variacoes: []
    },
    {
      id: 'fechamento-11',
      tipo: 'fechamento',
      titulo: 'Fechamento Premium (para quem quer economia)',
      conteudo: `Se quiser algo mais econômico e duradouro, posso separar o kit ou te mostrar a opção Premium. O que prefere?`,
      contexto: 'Para oferecer opção premium',
      variacoes: []
    },
    {
      id: 'fechamento-12',
      tipo: 'fechamento',
      titulo: 'Fechamento com Alternativa (sempre converte)',
      conteudo: `Prefere começar com o Kit de 5 dias ou já ir para o produto fechado para durar mais tempo?`,
      contexto: 'Oferece alternativas',
      variacoes: []
    },
    {
      id: 'fechamento-13',
      tipo: 'fechamento',
      titulo: 'Fechamento Final (última tentativa educada)',
      conteudo: `Posso confirmar seu kit por aqui? Se precisar de desconto ou outra opção, posso te passar.`,
      contexto: 'Última tentativa, educada',
      variacoes: []
    }
  ],
  objecoes: [
    {
      id: 'objecoes-1',
      tipo: 'objecoes',
      titulo: 'Objeção: "Vou ver depois."',
      conteudo: `Perfeito! Só te aviso que quanto mais cedo você começar, mais rápido seu corpo responde. Quer que eu já deixe seu kit reservado? Aí você decide a hora de iniciar.`,
      contexto: 'Quando a pessoa diz que vai ver depois',
      variacoes: []
    },
    {
      id: 'objecoes-2',
      tipo: 'objecoes',
      titulo: 'Objeção: "Estou sem dinheiro agora."',
      conteudo: `Super entendo! Por isso começamos com o protocolo de 5 dias — ele é leve, acessível e já te entrega resultado pra você sentir a diferença antes de qualquer compromisso maior. Posso te passar as opções mais econômicas?`,
      contexto: 'Quando a pessoa diz que está sem dinheiro',
      variacoes: []
    },
    {
      id: 'objecoes-3',
      tipo: 'objecoes',
      titulo: 'Objeção: "Preciso falar com alguém antes." (esposa, marido, mãe, etc.)',
      conteudo: `Sem problema nenhum! Quer que eu te envie um resumo pronto, bem simples, pra você mostrar pra ele(a)? Assim facilita sua conversa 😉`,
      contexto: 'Quando precisa consultar alguém',
      variacoes: []
    },
    {
      id: 'objecoes-4',
      tipo: 'objecoes',
      titulo: 'Objeção: "Será que funciona pra mim?"',
      conteudo: `Seu próprio diagnóstico já mostra o que está acontecendo com você — e o kit que te indiquei atua exatamente nesses pontos. A maioria das pessoas sente diferença já nos primeiros dias. Quer tentar e sentir na prática?`,
      contexto: 'Quando a pessoa tem dúvida se funciona',
      variacoes: []
    },
    {
      id: 'objecoes-5',
      tipo: 'objecoes',
      titulo: 'Objeção: "Não gosto de chá."',
      conteudo: `Fica tranquila(o)! O sabor é leve e você pode usar com gelo e limão — a maioria das pessoas que fala isso acaba gostando. E se quiser, também posso te mostrar outras formas de preparar 😉`,
      contexto: 'Quando a pessoa não gosta de chá',
      variacoes: []
    },
    {
      id: 'objecoes-6',
      tipo: 'objecoes',
      titulo: 'Objeção: "Tenho medo de passar mal."',
      conteudo: `Entendo totalmente. Por isso começamos com o protocolo leve de 5 dias, com acompanhamento. Ele é seguro, natural e você usa na sua intensidade. Qualquer sensação diferente, eu ajusto junto com você.`,
      contexto: 'Quando a pessoa tem medo de passar mal',
      variacoes: []
    },
    {
      id: 'objecoes-7',
      tipo: 'objecoes',
      titulo: 'Objeção: "Já tentei várias coisas e nada funcionou."',
      conteudo: `Eu entendo essa frustração. A diferença aqui é que seu diagnóstico mostrou exatamente o que está acontecendo — e o kit atua direto no ponto. Você não vai estar tentando ‚às cegas'. Quer fazer um teste leve de 5 dias?`,
      contexto: 'Quando a pessoa já tentou outras coisas',
      variacoes: []
    },
    {
      id: 'objecoes-8',
      tipo: 'objecoes',
      titulo: 'Objeção: "Não tenho tempo."',
      conteudo: `O legal é que você só precisa misturar e beber. Não leva 30 segundos. Muitas pessoas com rotina corrida usam justamente por isso. Quer começar com o menor protocolo de 5 dias?`,
      contexto: 'Quando a pessoa diz que não tem tempo',
      variacoes: []
    },
    {
      id: 'objecoes-9',
      tipo: 'objecoes',
      titulo: 'Objeção: "É caro."',
      conteudo: `Comparado ao que ele entrega em energia/leveza e ao custo de cafés, doces, lanches ou até cansaço acumulado, ele sai muito mais barato. E começamos com o menor protocolo justamente pra caber no dia a dia. Posso ver a opção mais econômica pra você?`,
      contexto: 'Quando a pessoa acha caro',
      variacoes: []
    },
    {
      id: 'objecoes-10',
      tipo: 'objecoes',
      titulo: 'Objeção: "Preciso pensar."',
      conteudo: `Claro! Só deixa eu te dizer uma coisa importante: sua energia de hoje não muda sozinha. Se quiser, eu deixo seu kit reservado e você decide com calma se inicia hoje ou amanhã.`,
      contexto: 'Quando a pessoa precisa pensar',
      variacoes: []
    },
    {
      id: 'objecoes-11',
      tipo: 'objecoes',
      titulo: 'Objeção: "Não posso agora." (genérica)',
      conteudo: `Sem problema! Quer que eu só deixe seu kit separado? Assim, quando você puder, já está garantido.`,
      contexto: 'Objeção genérica',
      variacoes: []
    },
    {
      id: 'objecoes-12',
      tipo: 'objecoes',
      titulo: 'Objeção: "Posso começar depois?"',
      conteudo: `Pode sim! Inclusive, posso deixar seu kit reservado pra você iniciar no dia que escolher. Quer que eu deixe separado?`,
      contexto: 'Quando a pessoa quer começar depois',
      variacoes: []
    },
    {
      id: 'objecoes-13',
      tipo: 'objecoes',
      titulo: 'Objeção: "Preciso ver se cabe no orçamento."',
      conteudo: `Claro! Me diz uma faixa confortável pra você que eu ajusto a recomendação e te passo a opção mais econômica sem perder resultado.`,
      contexto: 'Quando precisa verificar orçamento',
      variacoes: []
    },
    {
      id: 'objecoes-14',
      tipo: 'objecoes',
      titulo: 'Objeção: "Tenho medo de depender / criar hábito."',
      conteudo: `Totalmente compreensível. Mas aqui não é algo viciante — é um suporte funcional. Você usa pra ajustar seu corpo e depois mantém só se quiser. Podemos começar leve pra você sentir?`,
      contexto: 'Quando tem medo de dependência',
      variacoes: []
    },
    {
      id: 'objecoes-15',
      tipo: 'objecoes',
      titulo: 'Objeção: "Prefiro emagrecer com alimentação / academia."',
      conteudo: `Perfeito! Isso é ótimo. Na verdade, o kit entra como apoio justamente pra dar energia e leveza pra você conseguir fazer isso com mais constância. Quer que eu te mostre como combinar tudo?`,
      contexto: 'Quando prefere outras abordagens',
      variacoes: []
    }
  ],
  recuperacao: [
    {
      id: 'recuperacao-1',
      tipo: 'recuperacao',
      titulo: 'Lead que SUMIU após o diagnóstico',
      conteudo: `Oi! Vi aqui que você não conseguiu continuar aquele passo a passo. Quer que eu te envie novamente ou te explique rapidinho por aqui?`,
      contexto: 'Para leads que sumiram após diagnóstico',
      variacoes: []
    },
    {
      id: 'recuperacao-2',
      tipo: 'recuperacao',
      titulo: 'Lead que SUMIU após receber a oferta',
      conteudo: `Conseguiu ver a recomendação do seu diagnóstico? Se quiser, te explico rapidinho como funciona o kit pra você decidir com calma.`,
      contexto: 'Para leads que sumiram após oferta',
      variacoes: []
    },
    {
      id: 'recuperacao-3',
      tipo: 'recuperacao',
      titulo: 'Lead que NÃO RESPONDE nada há dias',
      conteudo: `Oi! Só passando pra ver se você ainda quer ajuda com a parte da energia/leveza que apareceu no seu diagnóstico. Posso te orientar quando quiser.`,
      contexto: 'Para leads que não respondem há dias',
      variacoes: []
    },
    {
      id: 'recuperacao-4',
      tipo: 'recuperacao',
      titulo: 'Lead que disse "vou ver" e sumiu',
      conteudo: `Lembra daquela avaliação que você fez? Ela mostra pontos importantes do seu dia. Se quiser, posso te ajudar com o próximo passo quando for um bom momento 🙂`,
      contexto: 'Para leads que disseram que iam ver',
      variacoes: []
    },
    {
      id: 'recuperacao-5',
      tipo: 'recuperacao',
      titulo: 'Lead que DEMONSTROU INTERESSE mas travou',
      conteudo: `Vi que você tinha gostado da recomendação! Quer que eu te mostre a forma mais simples de iniciar? É bem leve mesmo.`,
      contexto: 'Para leads que demonstraram interesse mas travou',
      variacoes: []
    },
    {
      id: 'recuperacao-6',
      tipo: 'recuperacao',
      titulo: 'Lead que estava QUASE FECHANDO e desapareceu',
      conteudo: `Oi! Só confirmando se você quer que eu reserve seu kit. Ele estava separado aqui pra você 😉`,
      contexto: 'Para leads que estavam quase fechando',
      variacoes: []
    },
    {
      id: 'recuperacao-7',
      tipo: 'recuperacao',
      titulo: 'Lead que viu o kit mas não respondeu',
      conteudo: `Conseguiu ver as opções que te enviei? Se quiser, te explico a diferença entre elas pra ficar mais fácil decidir.`,
      contexto: 'Para leads que viram mas não responderam',
      variacoes: []
    },
    {
      id: 'recuperacao-8',
      tipo: 'recuperacao',
      titulo: 'Lead que pediu preço e sumiu',
      conteudo: `Te mandei as opções! Se quiser, posso te passar a opção mais econômica ou a que faz mais sentido pro seu diagnóstico.`,
      contexto: 'Para leads que pediram preço',
      variacoes: []
    },
    {
      id: 'recuperacao-9',
      tipo: 'recuperacao',
      titulo: 'Lead que ficou inseguro',
      conteudo: `Se ficou alguma dúvida sobre o protocolo ou se quiser entender melhor como funciona, pode me chamar. Te explico tudo sem pressa 😊`,
      contexto: 'Para leads inseguros',
      variacoes: []
    },
    {
      id: 'recuperacao-10',
      tipo: 'recuperacao',
      titulo: 'Lead que disse que vai pensar e sumiu',
      conteudo: `Imagina, pensa com calma mesmo. Quando quiser dar o primeiro passo eu te ajudo! Quer que eu deixe um kit separado enquanto isso?`,
      contexto: 'Para leads que disseram que vão pensar',
      variacoes: []
    },
    {
      id: 'recuperacao-11',
      tipo: 'recuperacao',
      titulo: 'Lead que não clicou no link do fluxo',
      conteudo: `Você chegou a ver aquele teste que te mandei? Ele mostra coisas importantes do seu dia. Se quiser, te envio de novo!`,
      contexto: 'Para leads que não clicaram no link',
      variacoes: []
    },
    {
      id: 'recuperacao-12',
      tipo: 'recuperacao',
      titulo: 'Lead que clicou no link, mas não finalizou',
      conteudo: `Vi aqui que você iniciou a avaliação mas não conseguiu terminar. Quer que eu segure ela pra você concluir quando tiver 1 minutinho?`,
      contexto: 'Para leads que iniciaram mas não finalizaram',
      variacoes: []
    },
    {
      id: 'recuperacao-13',
      tipo: 'recuperacao',
      titulo: 'Lead que finalizou o diagnóstico mas não conversou',
      conteudo: `Teu diagnóstico ficou bem claro — posso te explicar rapidinho o que ele significa e qual seria o melhor primeiro passo pra você?`,
      contexto: 'Para leads que finalizaram mas não conversaram',
      variacoes: []
    },
    {
      id: 'recuperacao-14',
      tipo: 'recuperacao',
      titulo: 'Lead que continua vendo status mas não responde',
      conteudo: `Vi que você viu meus status! Se quiser ajuda com aquela parte da energia/leveza que apareceu na sua avaliação, é só me chamar 😊`,
      contexto: 'Para leads que veem status mas não respondem',
      variacoes: []
    },
    {
      id: 'recuperacao-15',
      tipo: 'recuperacao',
      titulo: 'Lead que responde só com emoji ou monossilábico',
      conteudo: `Sem problema! Se quiser, te explico de forma bem simples como funciona o passo a passo. Só me dizer 😊`,
      contexto: 'Para leads que respondem pouco',
      variacoes: []
    }
  ],
  indicacoes: [
    {
      id: 'indicacoes-1',
      tipo: 'indicacoes',
      titulo: 'Pedindo 1 indicação (leve)',
      conteudo: `Posso te pedir uma coisa rapidinha? Se você lembrar de alguém que vive reclamando de cansaço ou inchaço, me indica? Eu envio pra pessoa uma avaliação gratuita como a sua.`,
      contexto: 'Pedido leve de indicação',
      variacoes: []
    },
    {
      id: 'indicacoes-2',
      tipo: 'indicacoes',
      titulo: 'Pedindo 3 indicações (o mais efetivo)',
      conteudo: `Uma última coisa: você consegue me indicar 3 pessoas que vivem falando de falta de energia ou inchaço? Eu mando pra elas a avaliação gratuita também 😉`,
      contexto: 'Pedido de 3 indicações (mais efetivo)',
      variacoes: []
    },
    {
      id: 'indicacoes-3',
      tipo: 'indicacoes',
      titulo: 'Pedindo indicação para cliente satisfeito',
      conteudo: `Feliz que você gostou do resultado! Quer me indicar 2 ou 3 pessoas que também vivem cansadas/inchadas? Envio a avaliação gratuita pra elas também!`,
      contexto: 'Para clientes satisfeitos',
      variacoes: []
    },
    {
      id: 'indicacoes-4',
      tipo: 'indicacoes',
      titulo: 'Mensagem para a pessoa que recebeu a indicação',
      conteudo: `Oi! A [NOME] me falou que você anda sentindo cansaço/inchaço no dia a dia e pediu pra eu te enviar essa avaliação rápida. É gratuita e mostra exatamente onde sua energia está caindo. Posso te enviar?`,
      contexto: 'Mensagem para quem recebeu indicação',
      variacoes: []
    },
    {
      id: 'indicacoes-5',
      tipo: 'indicacoes',
      titulo: 'Mensagem de viralização leve (muito eficaz)',
      conteudo: `Estou enviando essa avaliação pra algumas pessoas porque tem ajudado muito quem vive cansado(a) ou sem disposição. Se quiser, posso te mandar também!`,
      contexto: 'Viralização leve',
      variacoes: []
    },
    {
      id: 'indicacoes-6',
      tipo: 'indicacoes',
      titulo: 'Mensagem de viralização forte (ideal pra listas grandes)',
      conteudo: `Enviei essa avaliação pra algumas pessoas e os resultados estão sendo incríveis. Se você quiser ver o seu também, me chama aqui que eu envio!`,
      contexto: 'Viralização forte para listas grandes',
      variacoes: []
    }
  ],
  'pos-venda': [
    {
      id: 'pos-venda-1',
      tipo: 'pos-venda',
      titulo: 'Boas-vindas (após efetuar a compra)',
      conteudo: `Seu kit está garantido! 🎉 A partir de agora eu te acompanho passo a passo pra você ter os melhores resultados. Quando chegar, me avisa que te passo tudo certinho 😊`,
      contexto: 'Enviar após confirmação da compra',
      variacoes: []
    },
    {
      id: 'pos-venda-2',
      tipo: 'pos-venda',
      titulo: 'Como preparar (quando o kit chega)',
      conteudo: `Seu kit chegou? Ótimo! 🙌 Vou te passar como preparar:

1. Coloque água gelada,

2. Adicione 1 medida do seu produto,

3. Agite bem,

4. Beba nos horários combinados.

Se quiser, te mando um vídeo curto também!`,
      contexto: 'Enviar quando o kit chega',
      variacoes: []
    },
    {
      id: 'pos-venda-3',
      tipo: 'pos-venda',
      titulo: 'Horários de uso (universal)',
      conteudo: `Vamos combinar assim?

• Se for Energia → manhã ou tarde, quando sentir queda.

• Se for Acelera → após o almoço ou conforme achar melhor.

E qualquer ajuste eu faço com você ao longo dos dias!`,
      contexto: 'Explicar horários de uso',
      variacoes: []
    },
    {
      id: 'pos-venda-4',
      tipo: 'pos-venda',
      titulo: 'Acompanhamento diário (mensagem leve)',
      conteudo: `Passando só pra saber: como você se sentiu hoje com o protocolo? Alguma diferença na energia ou na leveza?`,
      contexto: 'Acompanhamento diário',
      variacoes: []
    },
    {
      id: 'pos-venda-5',
      tipo: 'pos-venda',
      titulo: 'Acompanhamento com reforço (muito eficaz)',
      conteudo: `Hoje é dia de manter o foco! Se precisar ajustar horário, sabor ou intensidade, me avisa. Meu objetivo é que você sinta resultado rápido 😉`,
      contexto: 'Acompanhamento com reforço',
      variacoes: []
    },
    {
      id: 'pos-venda-6',
      tipo: 'pos-venda',
      titulo: 'Acompanhamento — ajuste fino (após 2 dias)',
      conteudo: `Com 2 dias usando já dá pra ajustar a dose se quiser um efeito mais forte ou mais leve. Quer que eu veja isso com você?`,
      contexto: 'Ajuste fino após 2 dias',
      variacoes: []
    },
    {
      id: 'pos-venda-7',
      tipo: 'pos-venda',
      titulo: 'Reforço motivacional (após 3–5 dias)',
      conteudo: `Você está quase no meio do seu protocolo! Muita gente começa a sentir diferença exatamente nessa fase. Me conta como você está hoje!`,
      contexto: 'Reforço após 3-5 dias',
      variacoes: []
    }
  ],
  recompra: [
    {
      id: 'recompra-1',
      tipo: 'recompra',
      titulo: 'Quando faltam 5 doses',
      conteudo: `Seu protocolo já está chegando na reta final! Quer que eu já deixe mais um kit separado pra você não ficar sem?`,
      contexto: 'Quando faltam 5 doses',
      variacoes: []
    },
    {
      id: 'recompra-2',
      tipo: 'recompra',
      titulo: 'Quando faltam 2 doses',
      conteudo: `Faltam só 2 doses! A maioria das pessoas já deixa o próximo kit reservado nessa fase pra não perder o ritmo. Quer que eu separe o seu?`,
      contexto: 'Quando faltam 2 doses',
      variacoes: []
    },
    {
      id: 'recompra-3',
      tipo: 'recompra',
      titulo: 'Quando ACABOU',
      conteudo: `Acabou seu kit? Quer manter os resultados e seguir pro próximo passo? Posso separar um kit ou te mostrar a opção do produto fechado (dura bem mais e sai mais econômico).`,
      contexto: 'Quando o kit acabou',
      variacoes: []
    },
    {
      id: 'recompra-4',
      tipo: 'recompra',
      titulo: 'Upgrade para pote fechado',
      conteudo: `Como você gostou do kit de teste, que tal pegar o produto fechado agora? Você economiza e tem produto para [TEMPO]. Quer que eu te passe os valores? 💰`,
      contexto: 'Oferecer upgrade para produto fechado',
      variacoes: []
    }
  ]
}

// ============================================
// SCRIPTS ESPECÍFICOS POR FLUXO
// ============================================

// Função auxiliar para criar scripts específicos de fluxo
function criarScriptsFluxo(fluxoId: FluxoId, scripts: Partial<Record<TipoScript, string[]>>): Script[] {
  const scriptsArray: Script[] = []
  
  Object.entries(scripts).forEach(([tipo, conteudos]) => {
    conteudos?.forEach((conteudo, index) => {
      scriptsArray.push({
        id: `${fluxoId}-${tipo}-${index + 1}`,
        tipo: tipo as TipoScript,
        titulo: `${tipo} - ${fluxoId}`,
        conteudo,
        contexto: `Script específico para o fluxo ${fluxoId}`,
        fluxoId,
        variacoes: []
      })
    })
  })
  
  return scriptsArray
}

// Scripts específicos serão adicionados aqui conforme necessário
// Por enquanto, vamos exportar os scripts gerais e criar funções auxiliares

export function getScriptsGerais(): Record<TipoScript, Script[]> {
  return scriptsGerais
}

export function getScriptsByTipo(tipo: TipoScript): Script[] {
  return scriptsGerais[tipo] || []
}

export function getScriptsByFluxo(fluxoId: FluxoId): Script[] {
  // Por enquanto retorna scripts gerais
  // Pode ser expandido para incluir scripts específicos do fluxo
  return Object.values(scriptsGerais).flat()
}

export function getAllScripts(): Script[] {
  return Object.values(scriptsGerais).flat()
}

export function getScriptById(id: string): Script | undefined {
  for (const tipoScripts of Object.values(scriptsGerais)) {
    const script = tipoScripts.find(s => s.id === id)
    if (script) return script
  }
  return undefined
}

