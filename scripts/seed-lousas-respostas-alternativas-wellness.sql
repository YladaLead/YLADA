-- =====================================================
-- SEED COMPLETO - RESPOSTAS ALTERNATIVAS PARA OBJEÇÕES
-- Baseado em docs/noel-lousas/respostas-alternativas/
-- Este script ATUALIZA as objeções já inseridas com as respostas alternativas
-- =====================================================

BEGIN;

-- =====================================================
-- GRUPO A — OBJECÇÕES DE CLIENTES (A.1 a A.10)
-- =====================================================

-- A.1 — "Está caro"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Claro, [nome]! O kit é só um teste leve — a ideia não é pesar pra você. 😊',
  versao_media = 'Entendo totalmente você achar caro à primeira vista, [nome]. 🙏 Só que o kit é justamente pra ser a forma mais leve de testar e sentir diferença no seu dia sem precisar investir em nada maior agora. A maioria começa assim porque é simples e sem compromisso. Posso te mostrar a forma mais econômica de começar?',
  versao_longa = 'Obrigado por ser sincero(a), [nome]. ❤️ Te entendo de verdade — todo mundo tem um momento financeiro diferente, e ninguém aqui está querendo te apertar. O que muitas pessoas percebem é que o kit não é um gasto, mas um teste curto pra realmente sentir se vale a pena. Não tem fidelidade, não tem assinatura, não tem risco. É só você experimentar no seu ritmo, e eu te acompanho nos 5 dias pra você aproveitar ao máximo. Se fizer sentido, te mostro a opção mais leve e confortável possível. Quer?',
  gatilho_retomada = '[nome], posso te mostrar rapidinho como outras pessoas começaram leve sem pesar no bolso? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem por aí? 😊 Só passei pra te mandar uma versão super leve da opção que comentei — sem compromisso nenhum. Se quiser ver, te envio aqui rapidinho.',
  resposta_se_negativa = 'Imagina, [nome], sem problema nenhum. ❤️ Minha intenção nunca é te pressionar — é só te mostrar algo que pode te ajudar no seu ritmo. Se preferir, posso te mostrar outras opções mais leves, ou deixamos pra outro momento. O que fizer mais sentido pra você.',
  upgrade = 'Se você sentir que quer um resultado um pouquinho mais forte nesses primeiros dias, posso te sugerir uma opção que vem com o Turbo. Mas só se fizer sentido pra você — tudo aqui é zero pressão. Quer que eu te mostre a diferença entre eles?'
WHERE categoria = 'clientes' AND codigo = 'A.1';

-- A.2 — "Vou pensar"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Claro, [nome], super tranquilo! Só quero te ajudar a decidir com clareza. 😊',
  versao_media = 'Perfeito, [nome], pensar faz parte do processo. 🙏 A única coisa que sempre ajuda é ter uma visão rápida do que você está avaliando. Se quiser, te mando uma explicação de 20 segundos pra facilitar sua decisão — sem pressa e sem compromisso. Te envio?',
  versao_longa = 'Entendo totalmente sua resposta, [nome]. ❤️ A gente vive tomando decisões o tempo todo e é natural querer pensar com calma. O kit existe justamente para facilitar esse momento, porque ele não cria nenhum compromisso: é só um teste leve de 5 dias pra você sentir se faz sentido pra sua rotina. Muitas pessoas que disseram ''vou pensar'' voltaram depois dizendo que ter visto a explicação simples ajudou muito. Se fizer sentido, te envio essa visão leve e rápida pra te ajudar a decidir com mais segurança. Pode ser?',
  gatilho_retomada = '[nome], posso te enviar aquela explicação curtinha que ajuda a decidir? É bem leve. 😊',
  resposta_se_some = 'Oi, [nome]! Tudo certinho por aí? 😊 Só passei pra te mandar uma versão super simples do que conversamos — sem compromisso nenhum, só pra te ajudar a ver se faz sentido pra você. Quer que eu envie?',
  resposta_se_negativa = 'Imagina, [nome], zero pressão. ❤️ Só quero facilitar sua análise, não te empurrar nada. Se preferir, deixamos isso pra outro momento ou te mostro algo ainda mais leve. O que te deixa mais confortável?',
  upgrade = 'Se quiser pensar com mais clareza ainda, posso te mostrar também a diferença entre o kit básico e a versão com o Turbo — às vezes isso ajuda a visualizar o que você realmente quer alcançar. Quer ver as opções?'
WHERE categoria = 'clientes' AND codigo = 'A.2';

-- A.3 — "Não sei se funciona para mim"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Super normal pensar isso, [nome]. 😊 O kit existe justamente pra você testar sem compromisso.',
  versao_media = 'Entendo totalmente, [nome]. 🙏 Cada pessoa reage de um jeito mesmo — e é por isso que o kit é só um teste leve, pra você sentir na prática se funciona pra você, sem precisar investir em nada maior. Quer que eu te mostre como ficaria sua rotina de 5 dias?',
  versao_longa = 'Essa dúvida é muito comum, [nome], e faz todo sentido. ❤️ A verdade é que ninguém sabe se algo funciona antes de experimentar — por isso o kit é leve, rápido e sem compromisso. Ele foi criado justamente pra te dar essa resposta na prática, em poucos dias, sem risco e no seu ritmo. Eu te acompanho passo a passo, então você não faz nada sozinho(a). Se fizer sentido, te mostro como funciona o teste de 5 dias pra você sentir antes de decidir qualquer coisa. Pode ser?',
  gatilho_retomada = '[nome], posso te mostrar como outras pessoas testaram por 5 dias antes de decidir? É bem leve. 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Só voltei porque lembrei que você estava na dúvida se funcionaria pra você. Tem uma forma bem tranquila de testar sem compromisso. Quer que eu te envie?',
  resposta_se_negativa = 'Imagina, [nome], tudo bem mesmo. ❤️ É super natural ter receio. Se quiser, posso te mostrar uma opção ainda mais leve, só pra você ter clareza sem precisar decidir nada agora. Posso te enviar?',
  upgrade = 'Se você quiser um teste com resultado um pouco mais perceptível, posso te mostrar também a versão com o Turbo. Mas só se fizer sentido — tudo leve e no seu ritmo. Quer ver a diferença?'
WHERE categoria = 'clientes' AND codigo = 'A.3';

-- A.4 — "Preciso falar com meu marido/esposa"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Claro, [nome], super importante vocês alinharem juntos. 😊 Posso te mandar uma explicação bem curtinha pra facilitar?',
  versao_media = 'Totalmente compreensível, [nome]. ❤️ É normal querer compartilhar isso com quem divide a rotina com você. Pra facilitar essa conversa, posso te enviar um resumo simples e direto do que é o kit, sem nada complicado. Assim você só repassa e pronto. Quer que eu te envie?',
  versao_longa = 'Acho muito bonito isso, [nome]. ❤️ Ter transparência com o marido/esposa faz toda diferença mesmo. A maioria das pessoas prefere conversar com o parceiro(a) antes, e isso é super saudável. O que ajuda muito é ter uma explicação leve e clara, sem detalhes demais, só o essencial pra ele(a) entender que é um teste de 5 dias, sem compromisso e de baixo custo. Se quiser, preparo uma explicação simples pra você mandar e deixar tudo mais tranquilo na hora de conversar. Te envio?',
  gatilho_retomada = '[nome], preparo pra você aquela explicação curtinha pra facilitar a conversa aí em casa? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem por aí? 😊 Só passando pra te mandar o resumo que facilita explicar em casa. Se quiser, envio rapidinho.',
  resposta_se_negativa = 'Imagina, [nome], super respeito. ❤️ Cada casal funciona de um jeito e isso é totalmente normal. Posso te mandar uma explicação bem leve, sem compromisso, só pra vocês dois decidirem juntos com mais tranquilidade. Pode ser?',
  upgrade = 'Se quando você conversar com ele(a) fizer sentido ver também a versão com o Turbo, preparo um comparativo bem simples pra vocês analisarem juntos. Quer que eu deixe pronto?'
WHERE categoria = 'clientes' AND codigo = 'A.4';

-- A.5 — "Não tenho tempo"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Totalmente compreensível, [nome]. O kit é feito justamente pra quem tem a vida corrida. 😊',
  versao_media = 'Te entendo demais, [nome]. 🙏 A rotina hoje é puxada pra todo mundo. A boa notícia é que o kit não exige tempo: é só misturar e beber, coisa de segundos. Ele foi criado exatamente pra quem vive na correria. Quer ver como cabe no seu dia sem esforço?',
  versao_longa = 'Faz todo sentido você falar isso, [nome]. ❤️ A vida corrida acaba fazendo a gente acreditar que só funciona aquilo que exige muito tempo — e é justamente o contrário aqui. O kit é pensado pra encaixar nos dias mais apertados: são segundos pra preparar, e eu ainda te ajudo com uma rotina simples pra você não precisar pensar em nada. Você não precisa parar sua rotina, não precisa mudar sua agenda, não precisa ter tempo sobrando. Só precisa querer sentir uma diferença no seu dia com algo leve. Posso te mostrar como ajustar ao seu ritmo?',
  gatilho_retomada = '[nome], posso te mostrar como outras pessoas com rotina super corrida estão usando sem perder tempo? É bem simples. 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Lembrei que você comentou sobre falta de tempo — e justamente por isso te mandei uma forma bem prática de usar sem mudar nada na rotina. Quer que eu te envie?',
  resposta_se_negativa = 'Sem problema nenhum, [nome]. ❤️ De verdade. Se quiser, posso te mostrar uma versão ainda mais leve, que praticamente se encaixa sozinha no dia. Mas só se fizer sentido pra você, tá?',
  upgrade = 'Se em algum momento você quiser um resultado mais perceptível com o mesmo tempo investido, o Turbo é uma opção forte — e continua super rápido de preparar. Se quiser, te mostro como fica no seu dia.'
WHERE categoria = 'clientes' AND codigo = 'A.5';

-- A.6 — "Tenho medo de não usar certinho"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Relaxa, [nome]. É mais simples do que parece — e eu te acompanho nos 5 dias. 😊',
  versao_media = 'Super entendo esse medo, [nome]. 🙏 Muita gente sente isso no começo. A boa notícia é que é tudo muito simples e eu te envio o passo a passo certinho. Você não precisa decorar nada — só seguir comigo. Quer que eu te mostre como funciona?',
  versao_longa = 'Fico feliz que você falou isso, [nome]. ❤️ Muita gente tem exatamente esse receio no início: medo de fazer errado, de não usar no horário certo, de não aproveitar tudo. E deixa eu te tranquilizar: você não vai fazer nada sozinho(a). Eu te envio o passo a passo certinho, te lembro como usar e te acompanho durante os 5 dias pra garantir que você tenha o melhor resultado possível. Não existe ''usar errado'' — existe usar no seu ritmo, com orientação. Se quiser, já te explico a rotina que facilita tudo. Pode ser?',
  gatilho_retomada = '[nome], quer que eu te envie a rotina simplificada pra você ver como é fácil? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Lembrei que você comentou sobre medo de não usar certinho. Preparei um passo a passo simples, só pra te mostrar como é fácil. Quer que eu te envie?',
  resposta_se_negativa = 'Imagina, [nome], super normal se sentir inseguro(a). ❤️ A maioria começa assim mesmo. Se fizer sentido, posso te enviar a versão mais simples da rotina pra você ver como é tranquilo. Posso te mandar?',
  upgrade = 'Se você quiser, posso te mostrar também a rotina do Turbo, que é tão simples quanto — só muda o benefício. Mas só te mostro se fizer sentido pra você. Quer ver as duas pra decidir com calma?'
WHERE categoria = 'clientes' AND codigo = 'A.6';

-- A.7 — "Já tentei outras coisas e não funcionou"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Te entendo muito, [nome]. ❤️ Esse kit é diferente porque é leve e você sente rápido. Sem compromisso.',
  versao_media = 'Totalmente compreensível, [nome]. 🙏 Muitas pessoas chegaram até mim dizendo exatamente isso. A diferença aqui é que o kit é só um teste leve de 5 dias — nada pesado, nada longo — só pra você sentir algo real antes de decidir qualquer coisa. Quer que eu te mostre como funciona?',
  versao_longa = '[nome], obrigado(a) por abrir isso comigo. ❤️ Quando a gente tenta várias coisas e não vê resultado, é normal criar essa sensação de ''não funciona pra mim''. Mas deixa eu te trazer clareza: o kit não é uma dieta, não é um programa longo, não exige mudança radical. É só um teste leve de 5 dias pra você sentir energia, leveza e bem-estar no seu ritmo. Nada te prende, nada te força. Eu te acompanho passo a passo, pra você realmente sentir a diferença antes de decidir. Se quiser, te explico como funciona na prática. Pode ser?',
  gatilho_retomada = '[nome], posso te mostrar como outras pessoas que já tinham tentado de tudo sentiram diferença logo nos primeiros dias? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Só lembrei do que você falou sobre já ter tentado outras coisas. Por isso mesmo preparei uma explicação leve do porquê esse teste de 5 dias é diferente. Quer que eu te mande?',
  resposta_se_negativa = 'Entendo totalmente, [nome]. ❤️ De verdade. E não quero te convencer de nada — só te mostrar uma forma leve de testar sem se frustrar de novo. Se quiser, te envio a opção mais simples, sem compromisso. Pode ser?',
  upgrade = 'Se quiser uma experiência ainda mais perceptível nesses primeiros dias, posso te mostrar como fica usando o Turbo junto. Mas é totalmente opcional — só te mostro se fizer sentido. Quer ver a diferença?'
WHERE categoria = 'clientes' AND codigo = 'A.7';

-- A.8 — "Não gosto de bebida"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Super entendo, [nome]. 😊 As bebidas são bem leves e têm vários sabores — dá pra ajustar ao seu gosto.',
  versao_media = 'Perfeito você falar isso, [nome]. 🙏 Muitas pessoas também tinham essa impressão no começo. O lado bom é que as bebidas são bem suaves, tipo um chazinho, e a gente tem opções diferentes de sabor pra combinar com o seu paladar. Se quiser, te mando as alternativas pra você escolher a mais leve pra você. Pode ser?',
  versao_longa = 'Totalmente compreensível, [nome]. ❤️ Cada pessoa tem um paladar diferente mesmo. A boa notícia é que as bebidas são bem leves, tipo um chazinho suave, e a gente tem várias opções de sabor pra você encontrar uma que combine com você. Além disso, dá pra misturar com frutas ou ajustar a quantidade de água pra ficar no seu gosto. Se quiser, te mando todas as opções e você me diz qual te agrada mais. Pode ser?',
  gatilho_retomada = '[nome], posso te enviar as opções de sabores pra você escolher a que mais combina com você? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Lembrei que você comentou sobre não gostar de bebida. Preparei uma lista com todas as opções de sabores pra você ver se alguma te agrada. Quer que eu te envie?',
  resposta_se_negativa = 'Imagina, [nome], super respeito seu paladar. ❤️ Se quiser, posso te mostrar outras formas de usar os produtos que não sejam bebidas. Mas só se fizer sentido pra você, tá?',
  upgrade = NULL
WHERE categoria = 'clientes' AND codigo = 'A.8';

-- A.9 — "Estou sem dinheiro agora"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Super respeito isso, [nome]. 🙏 O kit é justamente a opção mais leve pra testar sem peso financeiro.',
  versao_media = 'Totalmente compreensível, [nome]. ❤️ O momento de cada pessoa é diferente, e ninguém aqui está querendo te apertar. A ideia do kit é justamente ser a forma mais leve possível de testar, sem compromisso financeiro grande. Se quiser, posso te avisar quando eu montar uma rodada mais econômica. Quer?',
  versao_longa = 'Obrigado por confiar em mim pra falar isso, [nome]. ❤️ De verdade, eu entendo que cada pessoa tem um momento financeiro diferente, e minha intenção nunca é te pressionar. O kit existe justamente pra ser a opção mais leve possível: é um teste curto, sem compromisso, sem fidelidade, sem risco. Se fizer sentido, posso te avisar quando eu montar uma rodada mais econômica, ou te mostrar a forma mais simples de começar quando você estiver pronto(a). O que te deixa mais confortável?',
  gatilho_retomada = '[nome], posso te avisar quando eu montar uma rodada mais econômica? É bem leve. 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem por aí? 😊 Só passei pra te avisar que quando você estiver pronto(a), posso te mostrar a forma mais leve de começar. Sem pressa nenhuma.',
  resposta_se_negativa = 'Imagina, [nome], super respeito seu momento. ❤️ Quando fizer sentido pra você, estarei aqui. Sem pressão nenhuma.',
  upgrade = NULL
WHERE categoria = 'clientes' AND codigo = 'A.9';

-- A.10 — "Não quero me comprometer com nada"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Perfeito, e nem precisa! 😊 O kit não cria compromisso nenhum — é só um teste leve.',
  versao_media = 'Totalmente compreensível, [nome]. ❤️ O kit não cria compromisso nenhum: é só um teste leve de 5 dias pra você sentir se faz bem. Nada de assinaturas, nada recorrente, nada que te prenda. Quer que eu te mostre como funciona?',
  versao_longa = 'Perfeito você falar isso, [nome]. ❤️ Muita gente tem exatamente essa preocupação, e faz todo sentido. O kit foi criado justamente pra isso: é um teste leve de 5 dias, sem compromisso, sem assinatura, sem fidelidade, sem nada que te prenda. Você experimenta no seu ritmo, e se não fizer sentido, simplesmente não continua. É só isso. Se quiser, te mostro como funciona esse teste sem compromisso. Pode ser?',
  gatilho_retomada = '[nome], posso te mostrar como funciona esse teste sem compromisso? É bem leve. 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Só passei pra te mandar uma explicação rápida do teste sem compromisso. Se quiser, envio rapidinho.',
  resposta_se_negativa = 'Imagina, [nome], super respeito. ❤️ Se preferir, deixamos pra outro momento. Sem pressão nenhuma.',
  upgrade = NULL
WHERE categoria = 'clientes' AND codigo = 'A.10';

-- =====================================================
-- GRUPO B — OBJECÇÕES DE CLIENTES RECORRENTES (B.1 a B.5)
-- =====================================================

-- B.1 — "Quero esperar mais um pouco"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Super tranquilo, [nome]. 😊 Só quero te ajudar a manter o que você já conquistou.',
  versao_media = 'Entendo totalmente, [nome]. 🙏 Às vezes a gente sente que dá pra esperar um pouco sim. Só queria te lembrar que, quando a gente pausa por muito tempo, o corpo sente — e a manutenção mensal é justamente o mínimo necessário pra você não perder os benefícios. Posso te mostrar uma opção bem leve só pra manter o ritmo?',
  versao_longa = 'Perfeito você me falar isso com sinceridade, [nome]. ❤️ Muitas pessoas têm essa sensação de ''dá pra esperar um pouco'', e faz sentido quando pensamos só no momento. O ponto é que o corpo funciona muito bem com constância leve — não precisa ser muito, só precisa ser mantido. Quando você deixa um intervalo grande, começa a perder os pequenos ajustes positivos que já conquistou. Por isso existe a reposição mensal: ela não é um peso, é só uma forma de manter o que você construiu. Se quiser, te mostro a opção mais suave pra continuar sem esforço. Pode ser?',
  gatilho_retomada = '[nome], posso te mandar uma alternativa bem leve só pra manter o que você já conquistou? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Lembrei que você falou sobre esperar mais um pouco. Separei a opção mais leve possível só pra você manter os resultados sem perder ritmo quando acabar. Quer que eu envie?',
  resposta_se_negativa = 'Imagina, [nome], eu entendo totalmente. ❤️ Zero pressão. Se quiser, posso te mostrar só as opções mais leves — ou deixamos pra outro momento. O importante é você seguir no seu tempo.',
  upgrade = 'Se você quiser manter e ainda dar um passinho a mais, posso te mostrar como fica com 75 PV ou 100 PV — mas só se fizer sentido. Quer ver as diferenças?'
WHERE categoria = 'clientes_recorrentes' AND codigo = 'B.1';

-- B.2 — "Ainda tenho produto em casa"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Ótimo, [nome]! Isso significa que você está usando no seu ritmo. 😊 Podemos fazer uma reposição bem leve só pra você não ficar sem.',
  versao_media = 'Perfeito, [nome]. 🙏 É super comum sobrar um pouquinho mesmo. A ideia não é te fazer acumular produto — é só garantir que você não fique sem quando acabar. Podemos ajustar uma reposição menor, só pra manter os benefícios sem pesar no bolso nem na rotina. Quer que eu te mostre uma opção leve?',
  versao_longa = 'Fico feliz que você comentou isso com sinceridade, [nome]. ❤️ Muitas pessoas usam no ritmo delas e às vezes sobra um pouco mesmo — isso é natural. O importante é que você mantenha constância, porque é isso que faz seu corpo continuar respondendo bem. Uma reposição menor te ajuda a manter seus resultados sem ter que comprar muita coisa agora. Eu posso ajustar direitinho pra você não acumular nada e continuar no seu ritmo. Quer que eu te mostre como fica?',
  gatilho_retomada = '[nome], posso te sugerir uma reposição bem leve só pra garantir que você não fique sem? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Lembrei que você comentou que ainda tinha produto. Preparei uma sugestão bem leve de reposição só pra você não perder ritmo quando acabar. Quer que eu te envie?',
  resposta_se_negativa = 'Sem problema algum, [nome]. ❤️ A ideia nunca é te fazer comprar mais do que precisa. Só te ajudo a ajustar pra você não interromper o que já conquistou. Se quiser, te mostro uma opção ainda menor — ou deixamos pra depois. Você que decide.',
  upgrade = 'Se você quiser aproveitar e intensificar um pouquinho os resultados, posso te mostrar como fica uma reposição de 75 PV ou até 100 PV — mas só se fizer sentido pra você. Quer ver a diferença entre elas?'
WHERE categoria = 'clientes_recorrentes' AND codigo = 'B.2';

-- B.3 — "Acho que não preciso todo mês"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Super entendo, [nome]. 😊 A constância leve é o que mantém o resultado — não precisa ser muito.',
  versao_media = 'Faz sentido você pensar assim, [nome]. 🙏 Muitas pessoas acreditam que só precisam usar quando ''sentem algo''. Mas, na verdade, o corpo responde melhor com constância leve — não é sobre usar muito, é sobre manter o mínimo pra não perder os resultados. Posso te mostrar uma opção bem suave pra manter seu ritmo?',
  versao_longa = 'Obrigado por ser sincero(a) comigo, [nome]. ❤️ É muito comum ter essa sensação de ''não preciso todo mês'', e às vezes isso vem porque você não está sentindo sintomas ou desconfortos. Mas deixa eu te trazer clareza: o corpo funciona muito bem com manutenção — uma rotina leve, contínua, que evita oscilações. Não é sobre volume grande, é sobre constância. Quando você pausa por longos períodos, você perde justamente aquilo que conquistou. A reposição mensal é o mínimo necessário para manter tudo funcionando bem, sem exigir nada pesado. Se quiser, posso te mostrar uma reposição mais leve que cabe no seu momento. Pode ser?',
  gatilho_retomada = '[nome], posso te enviar uma opção de manutenção bem leve só pra você ver como fica simples manter seus resultados? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Lembrei que você comentou que achava que não precisava todo mês. Separei uma sugestão super leve de manutenção — sem peso e sem exagero — só pra manter o que você já construiu. Quer que eu envie?',
  resposta_se_negativa = 'Imagina, [nome], sem problema. ❤️ Aqui tudo é no seu tempo. Se quiser, posso te mostrar só as opções mais leves mesmo — ou deixamos pra outro momento. Você escolhe o que te deixa mais confortável.',
  upgrade = 'Se em algum momento você quiser manter e ainda intensificar um pouco os benefícios, posso te mostrar como fica uma manutenção de 75 PV ou 100 PV — mas só se fizer sentido pra você. Quer ver as diferenças sem compromisso?'
WHERE categoria = 'clientes_recorrentes' AND codigo = 'B.3';

-- B.4 — "Esqueci de usar"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Super normal, [nome]! 😊 A rotina é bem leve — e dá pra ajustar rapidinho sem perder resultado.',
  versao_media = 'Entendo totalmente, [nome]. 🙏 A correria do dia faz a gente esquecer mesmo. O bom é que nada está perdido: a manutenção é super simples e você pode retomar sem dificuldade. Quer que eu te envie uma rotina ajustada pra facilitar pra você?',
  versao_longa = '[nome], fico feliz que você falou isso com sinceridade. ❤️ Esquecer faz parte — acontece com muita gente. A vida é corrida mesmo. O importante é que seu corpo responde muito bem quando a gente volta com uma rotina leve, sem culpa e sem complicação. Eu posso montar uma rotina ajustada pra você, bem prática, pra garantir que você continue sentindo os benefícios no seu ritmo, sem pressão e sem aquela sensação de ''fracasso''. Aqui é tudo leve e contínuo. Quer que eu organize pra você?',
  gatilho_retomada = '[nome], posso te mandar uma rotina simples pra você retomar sem esforço? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Lembrei que você comentou que tinha esquecido de usar. Preparei uma rotina super prática pra facilitar sua volta. Quer que eu te envie?',
  resposta_se_negativa = 'Imagina, [nome], está tudo bem mesmo. ❤️ De verdade. Aqui ninguém te cobra nada. Se quiser, te mando só uma rotina bem leve pra encaixar no seu dia — ou deixamos pra outro momento. Você decide.',
  upgrade = 'Se quiser dar um passo a mais agora que vai retomar, posso te mostrar como fica uma manutenção de 75 PV ou até 100 PV. Mas só se fizer sentido — tudo no seu ritmo. Quer ver as opções?'
WHERE categoria = 'clientes_recorrentes' AND codigo = 'B.4';

-- B.5 — "Vou ver depois"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Claro, [nome]! 😊 Só não quero que você perca o ritmo — posso te mandar uma opção leve pra você decidir com calma.',
  versao_media = 'Super entendo, [nome]. 🙏 A rotina é corrida mesmo e às vezes a gente deixa pra depois sem querer. O único ponto é que, quando você espera demais, o corpo costuma perder a constância — e aí você precisa começar tudo do zero. Posso te mandar a opção mais leve só pra você olhar quando puder?',
  versao_longa = 'Perfeito você me falar isso com sinceridade, [nome]. ❤️ ''Vou ver depois'' é algo que muita gente sente, e geralmente é só falta de tempo mesmo — não é falta de vontade. Mas deixa eu te trazer clareza: o corpo funciona muito melhor quando você mantém uma constância mínima. Não é sobre comprar muito, é sobre não deixar o progresso esfriar. Se quiser, preparo pra você uma sugestão bem leve, dentro da sua realidade, só pra você avaliar quando tiver um tempinho. Sem peso, sem cobrança. Que acha?',
  gatilho_retomada = '[nome], posso te mandar a opção mais leve só pra você ver sem pressa? 😊',
  resposta_se_some = 'Oi, [nome]! 😊 Tudo bem? Só passei pra te enviar aquela sugestão leve que comentei — sem pressa pra decidir. Quer que eu envie aqui?',
  resposta_se_negativa = 'Imagina, [nome], sem problema nenhum. ❤️ Aqui tudo é no seu tempo. Se quiser, deixo só uma opção mínima pronta pra você olhar quando quiser — ou deixamos pra outro momento sem compromisso. Você que decide.',
  upgrade = 'Se quiser aproveitar pra manter o ritmo e ainda dar um passinho a mais, posso te mostrar como fica uma manutenção de 75 PV ou 100 PV — mas só se fizer sentido pra você. Quer ver as diferenças?'
WHERE categoria = 'clientes_recorrentes' AND codigo = 'B.5';

COMMIT;

-- =====================================================
-- NOTA: Grupos C, D e E serão adicionados em script separado
-- devido ao tamanho do conteúdo
-- =====================================================

