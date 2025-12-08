-- =====================================================
-- SEED COMPLETO - RESPOSTAS ALTERNATIVAS GRUPOS C, D e E
-- Baseado em docs/noel-lousas/respostas-alternativas/
-- Este script ATUALIZA as objeções já inseridas com as respostas alternativas
-- =====================================================

BEGIN;

-- =====================================================
-- GRUPO C — OBJECÇÕES DE RECRUTAMENTO (C.1 a C.10)
-- =====================================================

-- C.1 — "Eu não tenho tempo para isso"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Te entendo demais, [nome]. 😊 O bom é que o Wellness cabe até na rotina mais corrida — porque começa simples, no seu ritmo.',
  versao_media = 'Super compreensível, [nome]. 🙏 Muita gente inicia dizendo que não tem tempo. O ponto é: você não precisa parar a vida pra começar no Wellness. Tudo começa com ações leves, simples e duplicáveis. E o melhor: o próprio Noel te guia com passos rápidos, que cabem em 2 a 5 minutos por dia. Se fizer sentido, posso te mostrar como seria sua rotina inicial — super leve.',
  versao_longa = 'Obrigado(a) por ser sincero(a), [nome]. ❤️ A sensação de falta de tempo é absolutamente real — todos nós lidamos com isso. A diferença aqui é que no Wellness você não precisa de horas livres, eventos longos ou dedicação pesada. Você começa de forma leve, no seu ritmo, com pequenas ações que somam ao longo do mês. Quem tem pouco tempo geralmente se destaca mais rápido, porque aprende a focar no essencial. E o Noel te acompanha diariamente, ajustando tudo conforme sua disponibilidade. Se quiser, te mostro exatamente como seria começar mesmo com a rotina mais corrida. Pode ser?',
  gatilho_retomada = '[nome], posso te mostrar como pessoas com rotina super corrida estão fazendo o Wellness em poucos minutos por dia? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Lembrei que você comentou sobre falta de tempo. Separei aqui uma rotina super leve de início — bem realista pra quem tem o dia cheio. Quer que eu te envie?',
  resposta_se_negativa = 'Super entendo, [nome]. ❤️ De verdade. O Wellness só funciona se encaixar de forma leve na sua vida. Se quiser, posso te mostrar uma versão ainda mais simples, sem cobrança e sem peso. Mas é sempre no seu tempo.',
  upgrade = 'Se fizer sentido pra você depois, posso te mostrar como transformar sua rotina corrida em uma vantagem — com ações de 3 minutos que multiplicam seus resultados. Mas só quando você quiser. Quer ver como funcionaria?'
WHERE categoria = 'recrutamento' AND codigo = 'C.1';

-- C.2 — "Eu não sou vendedor(a)"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Perfeito, [nome]! 😊 A boa notícia é que no Wellness você não precisa ser vendedor — você só compartilha algo que usa e gosta.',
  versao_media = 'Entendo totalmente, [nome]. 🙏 Muitas pessoas começam dizendo exatamente isso. Aqui no Wellness, você não ''vende'' nada no sentido tradicional. O que funciona é leve: você compartilha sua experiência, usa scripts simples e duplicáveis, e o Noel te guia com frases prontas. Nada de pressionar, nada de convencer. É natural, humano e funciona muito melhor do que ''vender''. Quer que eu te mostre como seria na prática?',
  versao_longa = 'Obrigado(a) por ser sincero(a), [nome]. ❤️ Essa é uma das frases que mais escuto, e faz total sentido — ninguém quer parecer vendedor, ninguém quer empurrar nada pra ninguém. A diferença aqui é que o Wellness não é sobre ''vender''. É sobre indicar algo que você usa, gosta e sabe que ajuda. Você não precisa inventar frases, não precisa criar argumentos, não precisa convencer ninguém. O Noel te entrega todas as mensagens prontas, leves, educadas e totalmente naturais. Você só encaminha e conversa como gente normal, sem pressão. E por isso funciona — porque é verdadeiro. Se você quiser, te mostro como seria começar sem precisar ser vendedor(a).',
  gatilho_retomada = '[nome], posso te mostrar as mensagens prontas que você usa sem precisar ''vender'' nada? É tudo super leve. 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Lembrei que você comentou que não é vendedor(a). Separei aqui os exemplos de como o Wellness funciona sem precisar ''vender'' — só compartilhar. Quer que eu te envie?',
  resposta_se_negativa = 'Imagina, [nome], super entendo. ❤️ Você não precisa virar vendedor(a) pra fazer o Wellness funcionar. Se quiser, te mostro só os scripts mais leves, que você apenas encaminha — nada forçado. Pode ser?',
  upgrade = 'Se em algum momento fizer sentido pra você, posso te mostrar como algumas pessoas que também não eram vendedoras se tornaram referência só compartilhando de forma natural — mas isso é totalmente opcional. Quer ver como elas fizeram?'
WHERE categoria = 'recrutamento' AND codigo = 'C.2';

-- C.3 — "Tenho vergonha de chamar as pessoas"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Te entendo muito, [nome]. 😊 E a boa notícia é: você não precisa ''chamar''. Você só inicia conversas leves, humanas — e o Noel te dá tudo pronto.',
  versao_media = 'Super normal sentir isso, [nome]. 🙏 Muitas pessoas começam exatamente assim, com essa vergonha inicial. Mas no Wellness você não faz nada sozinho(a): o Noel te dá as mensagens exatas, prontas, leves e naturais. Você não precisa puxar assunto do nada, nem parecer vendedor(a). É só seguir o passo a passo, enviar conversas simples e deixar o fluxo acontecer. Quer que eu te mostre exemplos pra você ver como fica leve?',
  versao_longa = 'Obrigado(a) por abrir isso comigo, [nome]. ❤️ Vergonha é um sentimento muito comum — e totalmente normal. A maioria das pessoas sente exatamente isso antes de ter clareza de como o processo funciona. A verdade é que no Wellness você não chama pessoas, você conversa com pessoas. Conversas reais, humanas, leves. E o melhor: você não precisa criar nada sozinho(a). O Noel te entrega scripts prontos, adaptados ao tipo de pessoa que você vai falar. É só copiar, colar e seguir o fluxo. O que parecia vergonha vira naturalidade — porque você não está vendendo nada, você está oferecendo algo que te faz bem. Se quiser, te mostro como começar sem esse peso.',
  gatilho_retomada = '[nome], posso te mostrar as mensagens prontas que deixam tudo natural e sem vergonha? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Lembrei que você comentou que tinha vergonha de chamar as pessoas. Separei uns scripts bem leves que deixam tudo natural. Quer que eu te envie?',
  resposta_se_negativa = 'Entendo demais, [nome]. ❤️ E é exatamente por isso que o sistema foi criado com mensagens prontas: pra você não precisar se expor, nem inventar conversa. Se quiser, te mostro só as opções mais leves — sem parecer que você está chamando ninguém. Pode ser?',
  upgrade = 'Quando você estiver mais confortável, posso te mostrar variações de scripts que fazem as pessoas te responderem primeiro, reduzindo totalmente sua exposição. Quer ver esses exemplos depois?'
WHERE categoria = 'recrutamento' AND codigo = 'C.3';

-- C.4 — "Não conheço muita gente"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Fica tranquilo(a), [nome]. 😊 Muita gente começa assim — e mesmo assim cresce, porque o Wellness não depende de lista grande.',
  versao_media = 'Entendo totalmente, [nome]. 🙏 A maioria das pessoas acredita que precisa conhecer muita gente para começar — mas no Wellness isso não é verdade. Você começa com poucas pessoas, conversas leves, indicações simples… e o Noel te ajuda a encontrar oportunidades naturais no seu dia a dia. É muito mais sobre qualidade do que quantidade. Quer que eu te mostre como iniciar mesmo com poucas pessoas?',
  versao_longa = 'Obrigado(a) por compartilhar isso com sinceridade, [nome]. ❤️ É muito comum pensar que só quem conhece muita gente consegue ter resultado — mas no Wellness é exatamente o contrário. O sistema foi criado pra funcionar mesmo pra quem tem uma rede pequena. Você começa com 2 ou 3 pessoas próximas, segue conversas naturais, o Noel te dá scripts prontos, e essas primeiras pessoas naturalmente começam a indicar outras. É um crescimento orgânico, leve e duplicável. Não depende de você ter uma lista enorme, depende de você dar os primeiros passos com orientação. Se quiser, te mostro exatamente como começar mesmo com uma rede pequena. Pode ser?',
  gatilho_retomada = '[nome], posso te mostrar como pessoas que conheciam pouquíssima gente conseguiram começar no Wellness? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Lembrei que você comentou que não conhece muita gente. Separei um passo a passo leve de como começar mesmo assim. Quer que eu te envie?',
  resposta_se_negativa = 'Imagina, [nome], super respeito seu sentimento. ❤️ A boa notícia é que você não precisa de uma lista grande pra ter resultado — o que você precisa é de orientação simples, que eu e o Noel te damos. Se quiser, te mostro o caminho mais leve pra começar. Quer?',
  upgrade = 'Se quiser crescer mesmo começando pequeno(a), posso te mostrar como funciona o ''Círculo de 5 Pessoas'', uma técnica simples que multiplica sua rede sem esforço. Quer ver como funciona?'
WHERE categoria = 'recrutamento' AND codigo = 'C.4';

-- C.5 — "Tenho medo de não dar certo"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Te entendo muito, [nome]. 😊 E é justamente por isso que você não faz nada sozinho(a). O sistema te guia passo a passo.',
  versao_media = 'Super compreensível, [nome]. 🙏 Muitas pessoas começam com esse medo — e é normal sentir isso quando estamos diante de algo novo. A boa notícia é que no Wellness nada depende só de você: existe método, existe acompanhamento, existe duplicação, e o Noel te guia em cada etapa. Você não precisa saber tudo agora, só precisa dar pequenos passos. Quer que eu te mostre como fica leve?',
  versao_longa = 'Obrigado(a) por compartilhar esse sentimento comigo, [nome]. ❤️ Ter medo de não dar certo é totalmente natural — principalmente quando a gente não quer falhar com ninguém ou com nós mesmos. Mas deixa eu te tranquilizar: no Wellness, você não precisa ''acertar'' nada sozinho(a). Existe um sistema simples, leve e duplicável que te mostra exatamente o que fazer. O Noel te entrega as mensagens prontas, o passo a passo diário, o que dizer, quando dizer, como dizer. O sucesso aqui não é uma questão de talento — é uma questão de seguir um método que já funciona pra milhares de pessoas comuns. E você pode começar no seu ritmo, do seu jeito. Se fizer sentido, posso te mostrar como ficaria sua primeira semana — simples e sem pressão.',
  gatilho_retomada = '[nome], posso te mostrar como o método reduz completamente esse medo e deixa tudo mais simples? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Lembrei que você comentou que tinha medo de não dar certo. Separei um passo a passo leve que mostra exatamente como começar sem pressão. Quer que eu te envie?',
  resposta_se_negativa = 'Imagina, [nome], eu respeito totalmente seu sentimento. ❤️ O medo faz parte — e justamente por isso existe um sistema que te acompanha. Se quiser, posso te mostrar só a parte mais simples pra você ver como é possível começar mesmo com receio. Pode ser?',
  upgrade = 'Se em algum momento você quiser ir além, posso te mostrar como pessoas que tinham exatamente o mesmo medo se tornaram líderes só seguindo o método. Mas isso é totalmente opcional. Quer ver alguns exemplos depois?'
WHERE categoria = 'recrutamento' AND codigo = 'C.5';

-- C.6 — "Não tenho dinheiro para começar"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Te entendo demais, [nome]. 🙏 E o bom é que pra começar no Wellness você não precisa investir nada alto — dá pra começar leve.',
  versao_media = 'Super compreensível, [nome]. 🙏 Muita gente começa com essa mesma preocupação. A boa notícia é que o Wellness foi feito justamente pra quem quer começar leve, sem risco e sem investimento pesado. Você pode iniciar só com ações simples, conversas leves e ferramentas gratuitas — e o Noel te guia em tudo. Quer que eu te mostre como começar gastando quase nada?',
  versao_longa = 'Obrigado(a) por compartilhar isso com sinceridade, [nome]. ❤️ O medo financeiro é real e totalmente legítimo — ninguém quer assumir algo que aperte o orçamento. Mas deixa eu te tranquilizar: no Wellness você não precisa investir dinheiro pra começar. Você pode iniciar apenas com as ações leves, conversas guiadas pelo Noel e a duplicação do método. O sistema foi criado pra você gerar resultado primeiro e depois, se quiser, reinvestir. Nada te prende, nada te pressiona, nada exige compra. Você entra leve, aprende leve e cresce leve. Se quiser, te explico exatamente como iniciar sem investimento. Pode ser?',
  gatilho_retomada = '[nome], quer que eu te mostre como começar no Wellness mesmo sem colocar dinheiro agora? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Lembrei que você comentou sobre não ter dinheiro pra começar. Separei um caminho super leve, sem investimento, só pra você iniciar no seu ritmo. Quer que eu envie?',
  resposta_se_negativa = 'Perfeito, [nome], super respeito seu momento. ❤️ Se quiser, posso te mostrar só as ações gratuitas pra você ir aprendendo e aquecendo sem gastar nada. É totalmente no seu tempo.',
  upgrade = 'Se em algum momento você quiser dar um passo a mais, posso te mostrar como começar com o kit mais leve, mas isso é totalmente opcional. Antes disso, você já pode avançar no método sem gastar nada. Quer ver como ficaria?'
WHERE categoria = 'recrutamento' AND codigo = 'C.6';

-- C.7 — "Não entendo nada de Herbalife / Wellness"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Perfeito, [nome]! 😊 A maioria começa exatamente assim — e o sistema já foi feito pra quem está começando do zero.',
  versao_media = 'Super normal você sentir isso, [nome]. 🙏 Muitas pessoas entram sem saber nada de Herbalife ou Wellness. Aqui ninguém precisa ser expert: o Noel te guia com o passo a passo, te diz o que fazer, o que falar e quando falar. Você aprende fazendo, de forma leve e natural. Quer que eu te mostre como funciona na prática?',
  versao_longa = 'Obrigado(a) por compartilhar isso, [nome]. ❤️ Saber nada no começo não é um problema — é o normal. Ninguém entra no Wellness sabendo tudo, e o sistema foi criado justamente pra pessoas comuns, sem experiência, sem conhecimento técnico e sem pressão. O Noel te entrega tudo pronto: as frases, os scripts, o que enviar, como conversar, como iniciar… você literalmente só copia e cola enquanto aprende no seu ritmo. É por isso que tantas pessoas que começaram ''do zero'' hoje têm resultados incríveis. Se quiser, te mostro como funciona para quem está começando totalmente do início. Pode ser?',
  gatilho_retomada = '[nome], posso te mostrar como quem começou do zero hoje está indo super bem com a ajuda do Noel? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Lembrei que você comentou que não entende nada de Herbalife/Wellness. Separei aqui uma explicação super leve de como começar do zero com orientação total do Noel. Quer que eu envie?',
  resposta_se_negativa = 'Imagina, [nome], sem problema nenhum. ❤️ Você não precisa dominar nada agora. O sistema te ensina tudo de forma leve, no seu ritmo. Se quiser, posso te mostrar só o básico, sem complicação. Pode ser?',
  upgrade = 'Se quiser ir um pouquinho além depois, posso te mostrar como funciona a trilha de evolução para iniciantes, que o Noel acompanha passo a passo. Mas isso é totalmente opcional. Quer ver como fica?'
WHERE categoria = 'recrutamento' AND codigo = 'C.7';

-- C.8 — "Isso não é para mim"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Super entendo, [nome]. 😊 Só deixa eu te mostrar como isso aqui é muito mais simples e leve do que parece.',
  versao_media = 'Perfeito você falar isso, [nome]. 🙏 Muitas pessoas tiveram exatamente essa mesma sensação no começo. Mas quando viram como o Wellness funciona na prática — leve, guiado, no ritmo da pessoa — perceberam que não era nada do que imaginavam. Você não precisa ter perfil, talento ou experiência. Só seguir o método simples que o Noel te entrega. Quer que eu te mostre como seria no seu caso?',
  versao_longa = 'Obrigado(a) por sua sinceridade, [nome]. ❤️ Essa frase é muito comum porque, quando olhamos de fora, parece que o Wellness é ''pra quem já sabe'', ''pra quem é comunicativo'', ''pra quem tem tempo''… mas na realidade o sistema foi criado justamente pra pessoas comuns, que achavam que não tinham perfil. Aqui você não precisa improvisar, não precisa convencer ninguém, não precisa saber nada antes. O Noel te dá tudo pronto: o que dizer, como dizer, quando dizer — e você aprende no seu ritmo. O ''isso não é pra mim'' normalmente vira ''eu nem sabia que era tão simples''. Se quiser, posso te mostrar como ficaria sua primeira semana pra você ver com clareza.',
  gatilho_retomada = '[nome], posso te mostrar rapidinho como pessoas que pensavam exatamente como você hoje estão indo super bem? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Lembrei que você comentou que achava que isso não era pra você. Separei um exemplo simples de como o Wellness funciona na prática — leve, guiado e zero pressão. Quer que eu te envie?',
  resposta_se_negativa = 'Entendo totalmente, [nome]. ❤️ E respeito seu ritmo. Se quiser, posso te mostrar só a parte mais leve do processo, sem compromisso — só pra você ver que talvez seja muito mais simples do que parece. Pode ser?',
  upgrade = 'Se fizer sentido depois, posso te mostrar histórias reais de pessoas que tinham exatamente essa dúvida e hoje estão crescendo lindamente no Wellness. Mas só se você quiser. Quer ver depois?'
WHERE categoria = 'recrutamento' AND codigo = 'C.8';

-- C.9 — "Não quero incomodar as pessoas"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Te entendo totalmente, [nome]. 😊 E o melhor é que no Wellness você não incomoda ninguém — você inicia conversas leves, naturais e no seu ritmo.',
  versao_media = 'Super compreensível, [nome]. 🙏 Muita gente sente exatamente isso no começo. A verdade é que, no Wellness, você não ''incomoda'' ninguém porque não existe pressão, não existe convite forçado e não existe abordagem pesada. O que você faz é conversar com pessoas de forma humana, leve, educada — e sempre no momento certo. O Noel te dá as mensagens prontas justamente pra deixar tudo natural. Quer que eu te mostre como isso funciona na prática?',
  versao_longa = 'Obrigado(a) por abrir isso comigo, [nome]. ❤️ Esse medo de ''incomodar'' é absolutamente normal — ninguém gosta da sensação de estar atrapalhando alguém. Mas deixa eu te mostrar a verdade do Wellness: você não interrompe pessoas, você não força conversas, você não pressiona ninguém. O sistema foi criado para conversas humanas, leves, naturais e respeitosas. Você fala com a pessoa certa, do jeito certo, no momento certo — e sempre com mensagens educadas que mostram cuidado, não peso. E o Noel te guia em cada passo, pra você nunca soar invasivo(a). Quando a conversa é leve e genuína, ninguém sente incômodo — sente reciprocidade. Se quiser, te mostro como isso fica simples.',
  gatilho_retomada = '[nome], posso te enviar exemplos de conversas levezinhas e naturais, sem parecer que você está incomodando? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Só lembrei do que você falou sobre não querer incomodar as pessoas. Separei aqui exemplos de conversas super leves e educadas — do jeitinho que funciona sem pesar pra ninguém. Quer que eu te envie?',
  resposta_se_negativa = 'Imagina, [nome], super respeito seu sentimento. ❤️ E justamente por isso o sistema foi criado pra você nunca parecer invasivo(a). Se quiser, te mostro só as opções mais leves, que iniciam conversas naturais, sem pressão e sem aquele desconforto de ''parece que estou incomodando''. Quer ver?',
  upgrade = 'Se quiser depois, posso te mostrar mensagens que fazem as pessoas virem até você, reduzindo ainda mais essa sensação de incômodo. São técnicas leves que o Noel já domina. Quer que eu deixe separadas pra você?'
WHERE categoria = 'recrutamento' AND codigo = 'C.9';

-- C.10 — "Eu já tentei antes e não funcionou"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Entendo 100%, [nome]. 😊 A diferença é que agora você não caminha sozinho(a) — existe um sistema pronto e um mentor te guiando.',
  versao_media = 'Super compreensível, [nome]. 🙏 Muita gente já tentou algo no passado e não deu certo — e isso gera receio mesmo. Mas o Wellness é diferente porque você não precisa adivinhar nada: tudo é guiado, leve e duplicável. O Noel te entrega as mensagens prontas, os passos diários e o que fazer em cada situação. Não é tentar de novo — é tentar com método. Quer que eu te mostre a diferença?',
  versao_longa = 'Obrigado(a) por confiar e dizer isso abertamente, [nome]. ❤️ Essa sensação de ''já tentei e não funcionou'' é mais comum do que você imagina — e totalmente legítima. Mas deixa eu te dar uma clareza importante: o que geralmente falha não é a pessoa, é a falta de método. Antes, você provavelmente teve que improvisar, criar mensagens, adivinhar o que dizer… e isso é pesado mesmo. No Wellness é diferente: você tem um sistema simples, testado, duplicável, com conversas leves e scripts prontos. O Noel te guia passo a passo e você não precisa acertar tudo sozinho(a). Não é repetir o passado — é começar com estrutura. Se fizer sentido, posso te mostrar como seria seus primeiros dias dentro do método.',
  gatilho_retomada = '[nome], quer que eu te mostre rapidinho o que muda agora em relação ao que você tentou antes? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Lembrei que você comentou que já tinha tentado antes e não funcionou. Separei aqui uma explicação bem clara de por que o Wellness é diferente. Quer que eu te envie?',
  resposta_se_negativa = 'Super entendo, [nome]. ❤️ E respeito seu receio. Se quiser, posso te mostrar só a parte do método que torna tudo mais leve e guiado — sem repetir nada do que não funcionou no passado. Pode ser?',
  upgrade = 'Se fizer sentido depois, posso te mostrar histórias de pessoas que também tinham tentado antes e só deram certo quando começaram a usar o método do Wellness. Mas é totalmente opcional. Quer ver depois?'
WHERE categoria = 'recrutamento' AND codigo = 'C.10';

-- =====================================================
-- GRUPO D — OBJECÇÕES DE DISTRIBUIDORES (D.1 a D.10)
-- =====================================================

-- D.1 — "Tenho medo de errar a abordagem"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Fica tranquilo(a), [nome]. 😊 Você não cria nada sozinho(a) — o Noel te dá exatamente o que falar, palavra por palavra.',
  versao_media = 'Entendo muito esse medo, [nome]. 🙏 Normalmente ele aparece quando a pessoa acha que precisa ''inventar'' a conversa. Mas aqui no Wellness é diferente: você não improvisa. O Noel te dá a mensagem exata, pronta, leve e educada, já no tom certo. Você só copia, cola e envia. Assim não tem erro — você sempre sabe o que dizer. Quer que eu te mostre um exemplo?',
  versao_longa = 'Obrigado(a) por compartilhar esse sentimento comigo, [nome]. ❤️ Esse medo de ''errar a abordagem'' é um dos mais comuns entre novos distribuidores — e é totalmente compreensível. A maioria das pessoas teme parecer chata, invasiva ou perder alguém por não saber como iniciar a conversa. Mas aqui está a boa notícia: no Wellness você não cria as abordagens. Você não tenta adivinhar o que funciona. Você não improvisa. O Noel te entrega tudo pronto — a frase, o tom, a abertura, a continuação, o que responder se a pessoa reagir de tal forma… tudo pensado para ser leve, natural e duplicável. Ou seja: você não tem como errar. Você segue o passo a passo, e o sistema faz o restante. Se quiser, posso te mostrar como isso fica simples na prática.',
  gatilho_retomada = '[nome], quer que eu te envie um exemplo de abordagem pronta pra você ver como fica impossível errar? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Lembrei que você comentou ter medo de errar a abordagem. Separei algumas mensagens prontas que deixam tudo leve e natural. Quer que eu te envie?',
  resposta_se_negativa = 'Imagina, [nome], super normal sentir isso. ❤️ E é justamente por isso que o sistema foi criado: para você não ter que criar nada sozinho(a). Se quiser, te mostro apenas as abordagens mais leves pra você usar com total segurança. Pode ser?',
  upgrade = 'Quando você estiver confortável, posso te mostrar também como o Noel adapta abordagens diferentes conforme o tipo de pessoa que você vai falar — mas só se você quiser. Quer ver depois?'
WHERE categoria = 'distribuidores' AND codigo = 'D.1';

-- D.2 — "Não sei o que dizer para as pessoas"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Fica tranquilo(a), [nome]. 😊 O Noel te entrega tudo pronto — você nunca precisa inventar nada.',
  versao_media = 'Isso é super normal, [nome]. 🙏 A maioria das pessoas trava justamente porque acha que precisa ''saber o que dizer''. Mas no Wellness você não cria as mensagens — você só segue os scripts leves, educados e naturais que o Noel te envia conforme o tipo de pessoa que você vai falar. É literalmente copiar, colar e conversar com leveza. Quer ver um exemplo?',
  versao_longa = '[nome], obrigado(a) por ser tão sincero(a). ❤️ Esse medo de ''não saber o que falar'' é uma das principais barreiras de quem está começando. Mas deixa eu te dar clareza: você não precisa ser bom(a) de conversa, não precisa inventar frases, não precisa ter criatividade, e não precisa ter ''jeito''. No Wellness, você só segue o método. O Noel te entrega: a mensagem inicial, a continuação, a resposta caso a pessoa diga X, a resposta caso a pessoa diga Y, o fechamento leve. Ou seja: você não fala sozinho(a), você fala guiado(a). O sistema te dá segurança e naturalidade. Se quiser, te mostro agora um modelo real de conversa.',
  gatilho_retomada = '[nome], posso te enviar agora um script pronto pra você ver como fica simples saber exatamente o que dizer? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Lembrei que você comentou que não sabia o que dizer pras pessoas. Separei aqui alguns scripts prontos pra você usar sem medo de errar. Quer que eu te envie?',
  resposta_se_negativa = 'Imagina, [nome]. ❤️ Totalmente compreensível. E é justamente por isso que existe um sistema inteiro de mensagens prontas — pra você não ter que criar nada. Posso te mostrar só as opções mais leves?',
  upgrade = 'Quando você estiver confortável, posso te mostrar também como o Noel adapta scripts conforme o tipo de relacionamento — amigos, conhecidos, indicações ou mercado frio. Isso multiplica seus resultados sem esforço. Quer ver depois?'
WHERE categoria = 'distribuidores' AND codigo = 'D.2';

-- D.3 — "Tenho medo de rejeição"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Te entendo muito, [nome]. ❤️ E é exatamente por isso que o método existe: para que você não sinta a rejeição como algo pessoal.',
  versao_media = 'Esse medo é super normal, [nome]. 🙏 Todo mundo sente um pouco no começo. Mas no Wellness você aprende que a rejeição não é sobre você — é sobre o momento da outra pessoa. E como o Noel te dá as mensagens prontas, leves e educadas, você sempre se sente seguro(a) na conversa. Aqui ninguém força nada. Por isso o processo não machuca, não pesa e não desgasta. Quer que eu te mostre como lidar com isso de um jeito leve?',
  versao_longa = 'Obrigado(a) por confiar e falar isso de forma tão aberta, [nome]. ❤️ O medo de rejeição é um dos sentimentos mais comuns entre novos distribuidores — e também um dos mais mal compreendidos. A rejeição não é um julgamento sobre você, sua capacidade ou seu valor. Na maioria das vezes, é apenas uma questão de timing, momento de vida, prioridades ou até distração da outra pessoa. E é exatamente por isso que o método do Wellness funciona: você não faz abordagens pesadas, não pressiona ninguém, não cria desconforto. As conversas são leves, educadas e guiadas pelo Noel. Quando você entende que a resposta da outra pessoa não define quem você é, tudo fica mais leve. O sistema te protege emocionalmente e te ensina como continuar sem se machucar. Se quiser, te mostro como transformar esse medo em segurança.',
  gatilho_retomada = '[nome], posso te mostrar como o método deixa a rejeição leve, natural e sem impacto emocional? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Lembrei que você comentou que tinha medo de rejeição. Separei aqui um passo a passo leve de como o sistema te protege e te guia. Quer que eu te envie?',
  resposta_se_negativa = 'Totalmente compreensível, [nome]. ❤️ Esse medo é real e eu respeito. Se quiser, posso te mostrar só as abordagens mais seguras, que reduzem quase a zero qualquer sensação de rejeição. Tudo sempre no seu ritmo.',
  upgrade = 'Quando você estiver mais confortável, posso te mostrar também como líderes que tinham esse mesmo medo desenvolveram segurança emocional usando o método. É inspirador e totalmente duplicável. Quer ver depois?'
WHERE categoria = 'distribuidores' AND codigo = 'D.3';

-- D.4 — "Não tenho disciplina"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Te entendo, [nome]! 😊 E o melhor é que no Wellness você não precisa de disciplina alta — só de pequenos passos guiados.',
  versao_media = 'Isso é super comum, [nome]. 🙏 Muitas pessoas começam achando que precisam ter muita disciplina, mas no Wellness é o oposto: o sistema foi criado justamente pra quem se sente bagunçado(a), ansioso(a) ou indisciplinado(a). O Noel te dá as ações diárias prontas, simples e rápidas — você só segue. A disciplina não vem antes: ela aparece depois, quando o método começa a funcionar. Quer que eu te mostre como fica leve?',
  versao_longa = 'Obrigado(a) por ser sincero(a), [nome]. ❤️ Esse sentimento de ''não tenho disciplina'' é muito comum e totalmente compreensível — principalmente quando a pessoa já tentou outras coisas na vida e desistiu no meio. Mas deixa eu te trazer clareza: o Wellness não exige disciplina, ele constrói disciplina. Você não precisa acordar motivado(a), não precisa ser organizado(a), não precisa ter rotina perfeita. O Noel te entrega: a ação do dia, o que dizer, quando dizer, como seguir o fluxo, como não travar. Com isso, você só faz pequenas micro-ações diárias que não exigem força de vontade. O sistema foi feito pra funcionar mesmo pra quem é indisciplinado(a). Quer que eu te mostre como seria sua rotina inicial?',
  gatilho_retomada = '[nome], quer que eu te envie as micro-ações do dia pra você ver como é impossível não conseguir seguir? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Lembrei que você comentou sobre não ter disciplina. Separei aqui um modelo de rotina leve, com passos simples pra você seguir sem esforço. Quer que eu te envie?',
  resposta_se_negativa = 'Imagina, [nome]. ❤️ Totalmente compreensível! A disciplina não precisa estar pronta — ela aparece com o método. Se quiser, posso te mostrar só a versão mais leve das ações, zero pressão. Pode ser?',
  upgrade = 'Quando você se sentir mais seguro(a), posso te mostrar como algumas pessoas que eram completamente indisciplinadas chegaram ao GET só seguindo micro-ações. Isso é totalmente duplicável. Quer ver depois?'
WHERE categoria = 'distribuidores' AND codigo = 'D.4';

-- D.5 — "Sou tímido(a)"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Perfeito, [nome]. 😊 Sabia que as pessoas mais tímidas geralmente são as que mais têm resultado no Wellness?',
  versao_media = 'Entendo totalmente, [nome]. 🙏 A timidez não é um obstáculo aqui — na verdade, é até uma vantagem. Pessoas tímidas costumam ser mais gentis, mais educadas, mais naturais… e isso funciona muito bem no método. Como o Noel te dá todas as mensagens prontas, você não precisa ''se expor'' ou improvisar nada. É só seguir no seu ritmo, de forma leve. Quer que eu te mostre como fica simples mesmo sendo tímido(a)?',
  versao_longa = 'Obrigado(a) por compartilhar isso com sinceridade, [nome]. ❤️ Muitas pessoas acreditam que ser tímido(a) atrapalha — mas no Wellness acontece exatamente o contrário. Os tímidos costumam ter resultados incríveis porque: não forçam conversas, não soam ''vendedores'', passam confiança naturalmente, seguem o método com mais cuidado. E o melhor: você não precisa falar muito, não precisa gravar vídeo, não precisa aparecer se não quiser. O Noel te entrega tudo pronto. Você só encaminha mensagens simples, leves e educadas. O sistema foi feito pra pessoas comuns, introvertidas ou extrovertidas — qualquer perfil funciona. Quer que eu te mostre como seria seu primeiro passo, de forma bem leve?',
  gatilho_retomada = '[nome], posso te enviar os scripts que funcionam super bem pra quem é tímido(a)? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Você comentou que era tímido(a), e eu lembrei de separar aqui modelos de conversas bem leves — perfeitos pra quem prefere ficar mais na sua. Quer que eu envie?',
  resposta_se_negativa = 'Imagina, [nome], super respeito. ❤️ E justamente por isso o método foi criado: pra você não precisar mudar seu jeito. Se quiser, te mostro só as abordagens mais discretas — zero exposição. Quer ver?',
  upgrade = 'Se quiser depois, posso te mostrar histórias de pessoas tímidas que chegaram ao GET e até ao Milionário só seguindo o método, sem nunca precisar se ''transformar'' em algo que não são. É totalmente duplicável. Quer ver depois?'
WHERE categoria = 'distribuidores' AND codigo = 'D.5';

-- D.6 — "Não sei usar as ferramentas"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Super normal, [nome]! 😊 E o melhor: você aprende usando. O Noel te guia passo a passo.',
  versao_media = 'Entendo muito isso, [nome]. 🙏 Quase ninguém começa sabendo mexer em tudo — e nem precisa! As ferramentas do Wellness foram feitas pra serem simples, práticas e guiadas. Você não precisa decorar nada, nem entender tudo de primeira. O Noel te mostra exatamente onde clicar, o que fazer e como usar cada recurso no momento certo. Quer que eu te mostre como funciona na prática?',
  versao_longa = 'Obrigado(a) por compartilhar isso com sinceridade, [nome]. ❤️ A sensação de ''não sei usar as ferramentas'' é muito comum, principalmente entre quem nunca teve contato com sistemas digitais. Mas aqui vai a clareza: as ferramentas do Wellness foram criadas para pessoas comuns, não para especialistas. Você não precisa aprender tudo antes; você aprende usando, com orientação do Noel. Cada etapa é simples, intuitiva e totalmente guiada. O próprio sistema te conduz, mostrando: onde clicar, como enviar mensagens, como acessar scripts, como acompanhar clientes, como seguir o plano de carreira. Você nunca fica perdido(a). E se travar, o Noel te mostra exatamente o que fazer. Quer que eu te mostre o primeiro passo agora?',
  gatilho_retomada = '[nome], posso te enviar um passo a passo simples pra você ver como é fácil usar as ferramentas? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Lembrei que você comentou que não sabia usar as ferramentas. Separei aqui um mini-guia super simples do que você precisa pra começar. Quer que eu envie?',
  resposta_se_negativa = 'Imagina, [nome], super compreensível. ❤️ E é justamente por isso que o sistema existe: você não precisa ser bom(a) em tecnologia. Se quiser, te mostro só o básico agora — e o Noel vai te guiando no resto, sem pressa. Pode ser?',
  upgrade = 'Quando você estiver confortável, posso te mostrar alguns recursos extras que facilitam ainda mais o seu dia — mas só quando você quiser. Por agora, o sistema já te leva pelo essencial. Quer ver depois?'
WHERE categoria = 'distribuidores' AND codigo = 'D.6';

-- D.7 — "Não consigo vender"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Perfeito, [nome]. 😊 A boa notícia é que no Wellness você não ''vende'' — você compartilha. E isso qualquer pessoa consegue.',
  versao_media = 'Entendo totalmente, [nome]. 🙏 Muitas pessoas travam quando pensam em ''venda'', mas aqui no Wellness a lógica é outra. Você não fica oferecendo nada, não tenta convencer ninguém e não precisa ter habilidade comercial. O que funciona é leve: você compartilha sua rotina, seus resultados e usa as mensagens prontas do Noel. As pessoas se interessam naturalmente. Quer que eu te mostre como isso acontece na prática?',
  versao_longa = 'Obrigado(a) pela sinceridade, [nome]. ❤️ A frase ''não consigo vender'' aparece muito, e quase sempre é porque a pessoa imagina venda como algo pesado, insistente, desconfortável. No Wellness é completamente diferente: você não vende — você indica. Você conversa, compartilha, mostra algo que faz parte do seu dia. O Noel te entrega todas as frases prontas, com abertura leve, zero pressão e gatilhos naturais de interesse. As pessoas compram porque se identificam, não porque você força. O método funciona para pessoas tímidas, discretas, iniciantes, sem experiência e até para quem odeia vender. Se quiser, te mostro como começamos do jeito mais leve possível.',
  gatilho_retomada = '[nome], posso te mostrar os scripts que fazem as pessoas se interessarem sem você ''vender'' nada? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Lembrei que você comentou que não conseguia vender. Separei aqui exemplos de conversas reais que funcionam sem precisar fazer oferta nenhuma. Quer que eu te envie?',
  resposta_se_negativa = 'Imagina, [nome], super entendo. ❤️ E é justamente por isso que o método foi criado pra ser leve — você nunca precisa pressionar ninguém. Se quiser, posso te mostrar só a parte de compartilhamento, que é a mais simples de todas. Pode ser?',
  upgrade = 'Quando você estiver confortável, posso te mostrar como algumas pessoas que nunca tinham vendido nada começaram a ter resultados só usando o método do Noel — sem mudar o jeito de ser. Quer ver depois?'
WHERE categoria = 'distribuidores' AND codigo = 'D.7';

-- D.8 — "Não consigo recrutar"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Totalmente normal, [nome]. 😊 Recrutamento não é talento — é método. E o Noel te entrega tudo pronto.',
  versao_media = 'Entendo muito isso, [nome]. 🙏 Muitas pessoas acham que ''não nasceram para recrutar'', mas no Wellness não existe isso. Você não precisa convencer ninguém, não precisa ser extrovertido(a) e não precisa ter discurso. O Noel te dá as mensagens prontas, o fluxo certo e a orientação de quando falar com cada pessoa. Recrutar aqui é leve, natural e duplicável. Quer que eu te mostre como funciona?',
  versao_longa = 'Obrigado(a) por abrir isso comigo, [nome]. ❤️ Essa sensação de ''não consigo recrutar'' é extremamente comum — e geralmente vem de experiências passadas em que tudo dependia da pessoa improvisar. Mas aqui no Wellness é diferente: você não cria nada sozinho(a). O Noel te guia palavra por palavra, te mostra quem abordar, quando abordar e com qual mensagem abordar. Recrutar aqui é: leve, educado, nada invasivo, baseado em interesse genuíno, duplicável mesmo para iniciantes. Você não ''recruta'' no sentido tradicional — você convida pessoas para conhecer algo que você pratica. Quem se identifica, entra. Quem não se identifica, continua na jornada. Não tem peso, não tem insistência, não tem pressão. Quer que eu te mostre o fluxo real de um convite leve que funciona demais?',
  gatilho_retomada = '[nome], posso te enviar os convites prontos que fazem pessoas se interessarem de forma natural, sem você ''recrutar'' de verdade? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Só lembrando que você comentou que não conseguia recrutar. Separei aqui alguns convites leves, naturais e super duplicáveis pra você usar sem medo. Quer que eu envie?',
  resposta_se_negativa = 'Imagina, [nome]. ❤️ Totalmente compreensível. Muita gente sente isso no começo. Se quiser, posso te mostrar só os convites mais simples — aqueles que não parecem convite, sabe? A conversa flui normal e a pessoa demonstra interesse sozinha. Quer ver?',
  upgrade = 'Quando você estiver mais seguro(a), posso te mostrar como líderes que achavam que nunca iriam recrutar hoje têm equipes grandes — só usando as mensagens leves do método. É totalmente duplicável. Quer ver depois?'
WHERE categoria = 'distribuidores' AND codigo = 'D.8';

-- D.9 — "Acho que não sirvo para isso"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Te entendo muito, [nome]. 😊 Mas ninguém ''nasce'' sabendo — aqui você aprende fazendo, com tudo pronto e guiado.',
  versao_media = 'Esse sentimento é super comum, [nome]. 🙏 A maioria das pessoas começa achando que não serve para isso… e justamente por isso o método existe. No Wellness, você não precisa ser comunicativo(a), experiente, vendedor(a) ou influenciador(a). Você só precisa seguir os passos. O Noel te mostra o que fazer, o que falar e como agir em cada situação. Você serve sim — só ainda não teve o sistema certo te guiando. Quer que eu te mostre como fica leve?',
  versao_longa = 'Obrigado(a) por confiar e falar isso com sinceridade, [nome]. ❤️ Esse pensamento ''acho que não sirvo para isso'' quase sempre nasce de experiências anteriores, comparação com outras pessoas ou insegurança natural do começo. Mas deixa eu trazer clareza: ninguém serve para isso antes de aprender. Você não precisa ser ''bom(a)'' — você precisa ser guiado(a). O Wellness foi criado exatamente para pessoas comuns, que têm dúvidas, medos, inseguranças, que nunca trabalharam com vendas ou recrutamento. O Noel te conduz em cada passo, desde a primeira abordagem até construir sua equipe. O método te transforma no processo. Não é sobre servir ou não servir — é sobre evoluir com apoio. E isso você já está fazendo. Quer que eu te mostre como começamos de forma bem leve e prática?',
  gatilho_retomada = '[nome], posso te mostrar agora o primeiro passo que qualquer pessoa consegue dar, mesmo achando que ''não serve''? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Lembrei do que você falou sobre achar que não servia para isso. Separei aqui um exemplo de como o método transforma qualquer iniciante. Quer que eu te envie?',
  resposta_se_negativa = 'Super compreensível, [nome]. ❤️ Eu respeito totalmente seu sentimento. Se quiser, posso te mostrar só a parte mais leve do processo, sem pressão, só pra você sentir como realmente qualquer pessoa consegue. Pode ser?',
  upgrade = 'Quando você estiver pronto(a), posso te mostrar histórias reais de pessoas que tinham certeza absoluta de que ''não serviam para isso'' e hoje estão encaminhadas para GET, Milionário e até Presidente — tudo seguindo o método simples e duplicável. Quer ver depois?'
WHERE categoria = 'distribuidores' AND codigo = 'D.9';

-- D.10 — "Minha equipe não anda"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Te entendo muito, [nome]. 😊 E a boa notícia é: equipe para de andar quando falta método — e o Noel agora resolve isso com você.',
  versao_media = 'Super compreensível esse sentimento, [nome]. 🙏 Muitas equipes travam porque cada pessoa faz algo diferente, sem rotina, sem acompanhamento e sem direcionamento claro. No Wellness, tudo muda porque existe um método único, simples e duplicável — e você não carrega isso sozinho(a). O Noel ensina sua equipe, acompanha, orienta e cria movimento diário. A equipe volta a andar quando todos seguem o mesmo caminho. Quer que eu te mostre como destravar isso?',
  versao_longa = 'Obrigado(a) por abrir isso comigo, [nome]. ❤️ Quando você diz que ''minha equipe não anda'', geralmente o problema não é a equipe — é a falta de direção, de rotina simples, de microações diárias e de um sistema único que todos seguem. Sem isso, cada um age de um jeito, alguns param, outros desanimam, outros se perdem. Mas a partir de agora, o cenário muda: o Wellness System foi criado para dar movimento. O Noel guia cada pessoa da sua equipe: nas ações do dia, nas mensagens prontas, nos scripts de acompanhamento, na meta semanal, no plano de carreira, na postura emocional e profissional. Você deixa de ser responsável por ''empurrar'' a equipe. O sistema puxa por você. Quando todos seguem o mesmo método, a equipe volta a andar — e anda melhor, com constância e segurança. Se quiser, posso te mostrar como reorganizar sua equipe já nos próximos dias.',
  gatilho_retomada = '[nome], posso te mostrar um passo simples pra destravar sua equipe esta semana? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Lembrei que você comentou que sua equipe não estava andando. Separei aqui um passo a passo leve de como o sistema cria movimento novamente. Quer que eu te envie?',
  resposta_se_negativa = 'Entendo completamente, [nome]. ❤️ Às vezes parece mesmo que nada funciona. Mas é justamente por isso que existe um método estruturado — pra você não carregar tudo sozinho(a). Se quiser, posso te mostrar só as primeiras ações que já dão resultado imediato. Pode ser?',
  upgrade = 'Quando você estiver pronto(a), posso te mostrar também como líderes reconstróem equipes inteiras usando apenas o método diário do Noel — e como isso acelera o caminho para GET, Milionário e Presidente. Quer ver depois?'
WHERE categoria = 'distribuidores' AND codigo = 'D.10';

COMMIT;

-- =====================================================
-- NOTA: Grupo E (Avançadas) será adicionado em próximo script
-- devido ao tamanho do conteúdo
-- =====================================================

