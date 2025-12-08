-- =====================================================
-- WELLNESS SYSTEM - SEED DE OBJEÇÕES INICIAIS
-- Baseado na estrutura da Lousa de Objeções
-- =====================================================

BEGIN;

-- Limpar dados existentes (opcional - descomente se necessário)
-- TRUNCATE TABLE wellness_objecoes CASCADE;

-- =====================================================
-- CATEGORIA 1: OBJEÇÕES DE CLIENTES (Kit/Turbo/Hype)
-- Códigos: A.1 a A.10
-- =====================================================

INSERT INTO wellness_objecoes (categoria, codigo, objeção, versao_curta, versao_media, versao_longa, tags, ordem, ativo) VALUES
('clientes', 'A.1', 'Está caro', 
 'Comparado ao que ele entrega em energia/leveza e ao custo de cafés, doces, lanches ou até cansaço acumulado, ele sai muito mais barato. E começamos com o menor protocolo justamente pra caber no dia a dia. Posso ver a opção mais econômica pra você?',
 'Comparado ao que ele entrega em energia/leveza e ao custo de cafés, doces, lanches ou até cansaço acumulado, ele sai muito mais barato. E começamos com o menor protocolo justamente pra caber no dia a dia. Posso ver a opção mais econômica pra você?',
 'Comparado ao que ele entrega em energia/leveza e ao custo de cafés, doces, lanches ou até cansaço acumulado, ele sai muito mais barato. E começamos com o menor protocolo justamente pra caber no dia a dia. Posso ver a opção mais econômica pra você?',
 ARRAY['preco', 'caro', 'economia'], 1, true),

('clientes', 'A.2', 'Vou ver depois', 
 'Perfeito! Só te aviso que quanto mais cedo você começar, mais rápido seu corpo responde. Quer que eu já deixe seu kit reservado? Aí você decide a hora de iniciar.',
 'Perfeito! Só te aviso que quanto mais cedo você começar, mais rápido seu corpo responde. Quer que eu já deixe seu kit reservado? Aí você decide a hora de iniciar.',
 'Perfeito! Só te aviso que quanto mais cedo você começar, mais rápido seu corpo responde. Quer que eu já deixe seu kit reservado? Aí você decide a hora de iniciar.',
 ARRAY['depois', 'ver', 'reserva'], 2, true),

('clientes', 'A.3', 'Preciso pensar', 
 'Claro! Só deixa eu te dizer uma coisa importante: sua energia de hoje não muda sozinha. Se quiser, eu deixo seu kit reservado e você decide com calma se inicia hoje ou amanhã.',
 'Claro! Só deixa eu te dizer uma coisa importante: sua energia de hoje não muda sozinha. Se quiser, eu deixo seu kit reservado e você decide com calma se inicia hoje ou amanhã.',
 'Claro! Só deixa eu te dizer uma coisa importante: sua energia de hoje não muda sozinha. Se quiser, eu deixo seu kit reservado e você decide com calma se inicia hoje ou amanhã.',
 ARRAY['pensar', 'duvida', 'reserva'], 3, true),

('clientes', 'A.4', 'Estou sem dinheiro agora', 
 'Super entendo! Por isso começamos com o protocolo de 5 dias — ele é leve, acessível e já te entrega resultado pra você sentir a diferença antes de qualquer compromisso maior. Posso te passar as opções mais econômicas?',
 'Super entendo! Por isso começamos com o protocolo de 5 dias — ele é leve, acessível e já te entrega resultado pra você sentir a diferença antes de qualquer compromisso maior. Posso te passar as opções mais econômicas?',
 'Super entendo! Por isso começamos com o protocolo de 5 dias — ele é leve, acessível e já te entrega resultado pra você sentir a diferença antes de qualquer compromisso maior. Posso te passar as opções mais econômicas?',
 ARRAY['dinheiro', 'economia', 'acessivel'], 4, true),

('clientes', 'A.5', 'Será que funciona pra mim?', 
 'Seu próprio diagnóstico já mostra o que está acontecendo com você — e o kit que te indiquei atua exatamente nesses pontos. A maioria das pessoas sente diferença já nos primeiros dias. Quer tentar e sentir na prática?',
 'Seu próprio diagnóstico já mostra o que está acontecendo com você — e o kit que te indiquei atua exatamente nesses pontos. A maioria das pessoas sente diferença já nos primeiros dias. Quer tentar e sentir na prática?',
 'Seu próprio diagnóstico já mostra o que está acontecendo com você — e o kit que te indiquei atua exatamente nesses pontos. A maioria das pessoas sente diferença já nos primeiros dias. Quer tentar e sentir na prática?',
 ARRAY['duvida', 'funciona', 'diagnostico'], 5, true),

('clientes', 'A.6', 'Não tenho tempo', 
 'O legal é que você só precisa misturar e beber. Não leva 30 segundos. Muitas pessoas com rotina corrida usam justamente por isso. Quer começar com o menor protocolo de 5 dias?',
 'O legal é que você só precisa misturar e beber. Não leva 30 segundos. Muitas pessoas com rotina corrida usam justamente por isso. Quer começar com o menor protocolo de 5 dias?',
 'O legal é que você só precisa misturar e beber. Não leva 30 segundos. Muitas pessoas com rotina corrida usam justamente por isso. Quer começar com o menor protocolo de 5 dias?',
 ARRAY['tempo', 'rapido', 'facil'], 6, true),

('clientes', 'A.7', 'Preciso falar com alguém antes', 
 'Sem problema nenhum! Quer que eu te envie um resumo pronto, bem simples, pra você mostrar pra ele(a)? Assim facilita sua conversa 😉',
 'Sem problema nenhum! Quer que eu te envie um resumo pronto, bem simples, pra você mostrar pra ele(a)? Assim facilita sua conversa 😉',
 'Sem problema nenhum! Quer que eu te envie um resumo pronto, bem simples, pra você mostrar pra ele(a)? Assim facilita sua conversa 😉',
 ARRAY['consultar', 'resumo', 'facilita'], 7, true),

('clientes', 'A.8', 'Tenho medo de passar mal', 
 'Entendo totalmente. Por isso começamos com o protocolo leve de 5 dias, com acompanhamento. Ele é seguro, natural e você usa na sua intensidade. Qualquer sensação diferente, eu ajusto junto com você.',
 'Entendo totalmente. Por isso começamos com o protocolo leve de 5 dias, com acompanhamento. Ele é seguro, natural e você usa na sua intensidade. Qualquer sensação diferente, eu ajusto junto com você.',
 'Entendo totalmente. Por isso começamos com o protocolo leve de 5 dias, com acompanhamento. Ele é seguro, natural e você usa na sua intensidade. Qualquer sensação diferente, eu ajusto junto com você.',
 ARRAY['medo', 'seguranca', 'acompanhamento'], 8, true),

('clientes', 'A.9', 'Já tentei várias coisas e nada funcionou', 
 'Eu entendo essa frustração. A diferença aqui é que seu diagnóstico mostrou exatamente o que está acontecendo — e o kit atua direto no ponto. Você não vai estar tentando às cegas. Quer fazer um teste leve de 5 dias?',
 'Eu entendo essa frustração. A diferença aqui é que seu diagnóstico mostrou exatamente o que está acontecendo — e o kit atua direto no ponto. Você não vai estar tentando às cegas. Quer fazer um teste leve de 5 dias?',
 'Eu entendo essa frustração. A diferença aqui é que seu diagnóstico mostrou exatamente o que está acontecendo — e o kit atua direto no ponto. Você não vai estar tentando às cegas. Quer fazer um teste leve de 5 dias?',
 ARRAY['frustracao', 'diferenca', 'teste'], 9, true),

('clientes', 'A.10', 'Não gosto de chá', 
 'Fica tranquila(o)! O sabor é leve e você pode usar com gelo e limão — a maioria das pessoas que fala isso acaba gostando. E se quiser, também posso te mostrar outras formas de preparar 😉',
 'Fica tranquila(o)! O sabor é leve e você pode usar com gelo e limão — a maioria das pessoas que fala isso acaba gostando. E se quiser, também posso te mostrar outras formas de preparar 😉',
 'Fica tranquila(o)! O sabor é leve e você pode usar com gelo e limão — a maioria das pessoas que fala isso acaba gostando. E se quiser, também posso te mostrar outras formas de preparar 😉',
 ARRAY['sabor', 'preparo', 'alternativas'], 10, true);

-- =====================================================
-- CATEGORIA 2: OBJEÇÕES DE CLIENTES RECORRENTES (PV 50/75/100)
-- Códigos: B.1 a B.6
-- =====================================================

INSERT INTO wellness_objecoes (categoria, codigo, objeção, versao_curta, versao_media, versao_longa, tags, ordem, ativo) VALUES
('clientes_recorrentes', 'B.1', 'Não preciso mais, já estou bem', 
 'Que ótimo que você está se sentindo bem! Manter a constância é o que garante que você continue assim. Quer que eu te mostre como manter os resultados de forma mais econômica?',
 'Que ótimo que você está se sentindo bem! Manter a constância é o que garante que você continue assim. Quer que eu te mostre como manter os resultados de forma mais econômica?',
 'Que ótimo que você está se sentindo bem! Manter a constância é o que garante que você continue assim. Quer que eu te mostre como manter os resultados de forma mais econômica?',
 ARRAY['manutencao', 'constancia', 'economia'], 11, true),

('clientes_recorrentes', 'B.2', 'Vou pausar um tempo', 
 'Sem problema! Só te aviso que quando você voltar, pode levar alguns dias pra seu corpo se ajustar de novo. Quer que eu deixe anotado aqui pra te lembrar quando você quiser retomar?',
 'Sem problema! Só te aviso que quando você voltar, pode levar alguns dias pra seu corpo se ajustar de novo. Quer que eu deixe anotado aqui pra te lembrar quando você quiser retomar?',
 'Sem problema! Só te aviso que quando você voltar, pode levar alguns dias pra seu corpo se ajustar de novo. Quer que eu deixe anotado aqui pra te lembrar quando você quiser retomar?',
 ARRAY['pausa', 'retomada', 'lembrete'], 12, true),

('clientes_recorrentes', 'B.3', 'Quero tentar outra coisa', 
 'Claro! Só uma coisa: se depois você quiser voltar, é só me chamar. O importante é você encontrar o que funciona melhor pra você.',
 'Claro! Só uma coisa: se depois você quiser voltar, é só me chamar. O importante é você encontrar o que funciona melhor pra você.',
 'Claro! Só uma coisa: se depois você quiser voltar, é só me chamar. O importante é você encontrar o que funciona melhor pra você.',
 ARRAY['alternativa', 'retorno', 'aberto'], 13, true),

('clientes_recorrentes', 'B.4', 'Está muito caro manter', 
 'Entendo! Por isso existe a opção do Cliente Premium — você economiza bastante e mantém os resultados. Quer que eu te mostre como funciona?',
 'Entendo! Por isso existe a opção do Cliente Premium — você economiza bastante e mantém os resultados. Quer que eu te mostre como funciona?',
 'Entendo! Por isso existe a opção do Cliente Premium — você economiza bastante e mantém os resultados. Quer que eu te mostre como funciona?',
 ARRAY['economia', 'premium', 'manutencao'], 14, true),

('clientes_recorrentes', 'B.5', 'Não estou vendo mais resultado', 
 'Isso pode acontecer quando o corpo se acostuma. Que tal ajustarmos a dose ou o horário? Às vezes uma pequena mudança já traz a diferença de volta.',
 'Isso pode acontecer quando o corpo se acostuma. Que tal ajustarmos a dose ou o horário? Às vezes uma pequena mudança já traz a diferença de volta.',
 'Isso pode acontecer quando o corpo se acostuma. Que tal ajustarmos a dose ou o horário? Às vezes uma pequena mudança já traz a diferença de volta.',
 ARRAY['resultado', 'ajuste', 'dose'], 15, true),

('clientes_recorrentes', 'B.6', 'Vou reduzir a frequência', 
 'Perfeito! Podemos ajustar pra uma frequência que caiba melhor no seu dia a dia. O importante é manter alguma constância. Quer que eu te mostre as opções?',
 'Perfeito! Podemos ajustar pra uma frequência que caiba melhor no seu dia a dia. O importante é manter alguma constância. Quer que eu te mostre as opções?',
 'Perfeito! Podemos ajustar pra uma frequência que caiba melhor no seu dia a dia. O importante é manter alguma constância. Quer que eu te mostre as opções?',
 ARRAY['frequencia', 'ajuste', 'constancia'], 16, true);

-- =====================================================
-- CATEGORIA 3: OBJEÇÕES DE RECRUTAMENTO
-- Códigos: C.1 a C.10
-- NOTA: Lembrar da REGRA DE OURO - NUNCA mencionar PV para novos prospects
-- =====================================================

INSERT INTO wellness_objecoes (categoria, codigo, objeção, versao_curta, versao_media, versao_longa, tags, ordem, ativo) VALUES
('recrutamento', 'C.1', 'Não tenho tempo para isso', 
 'Entendo! Por isso o negócio é flexível — você trabalha no seu ritmo, nos seus horários. Muita gente usa como renda extra sem mudar a rotina. Quer que eu te mostre como funciona?',
 'Entendo! Por isso o negócio é flexível — você trabalha no seu ritmo, nos seus horários. Muita gente usa como renda extra sem mudar a rotina. Quer que eu te mostre como funciona?',
 'Entendo! Por isso o negócio é flexível — você trabalha no seu ritmo, nos seus horários. Muita gente usa como renda extra sem mudar a rotina. Quer que eu te mostre como funciona?',
 ARRAY['tempo', 'flexibilidade', 'renda_extra'], 17, true),

('recrutamento', 'C.2', 'Não sei vender', 
 'Não precisa saber vender! Você só compartilha o que funcionou pra você. É sobre ajudar pessoas, não sobre técnicas de venda. Quer que eu te mostre como é simples?',
 'Não precisa saber vender! Você só compartilha o que funcionou pra você. É sobre ajudar pessoas, não sobre técnicas de venda. Quer que eu te mostre como é simples?',
 'Não precisa saber vender! Você só compartilha o que funcionou pra você. É sobre ajudar pessoas, não sobre técnicas de venda. Quer que eu te mostre como é simples?',
 ARRAY['vender', 'simples', 'compartilhar'], 18, true),

('recrutamento', 'C.3', 'Não tenho contatos', 
 'Todo mundo tem contatos! Família, amigos, colegas de trabalho, pessoas do Instagram. Você não precisa de uma lista gigante pra começar. Quer que eu te mostre como?',
 'Todo mundo tem contatos! Família, amigos, colegas de trabalho, pessoas do Instagram. Você não precisa de uma lista gigante pra começar. Quer que eu te mostre como?',
 'Todo mundo tem contatos! Família, amigos, colegas de trabalho, pessoas do Instagram. Você não precisa de uma lista gigante pra começar. Quer que eu te mostre como?',
 ARRAY['contatos', 'rede', 'comecar'], 19, true),

('recrutamento', 'C.4', 'Não acredito nisso', 
 'Tudo bem! Você não precisa acreditar em mim — só precisa ver o que funcionou pra você. Se funcionou, pode funcionar pra outras pessoas também. Quer que eu te mostre como é simples começar?',
 'Tudo bem! Você não precisa acreditar em mim — só precisa ver o que funcionou pra você. Se funcionou, pode funcionar pra outras pessoas também. Quer que eu te mostre como é simples começar?',
 'Tudo bem! Você não precisa acreditar em mim — só precisa ver o que funcionou pra você. Se funcionou, pode funcionar pra outras pessoas também. Quer que eu te mostre como é simples começar?',
 ARRAY['crenca', 'resultado', 'simples'], 20, true),

('recrutamento', 'C.5', 'Já tentei e não deu certo', 
 'O que mudou desde então? Agora você tem experiência com os produtos, sabe o que funciona. Isso já é uma vantagem enorme. Quer que eu te mostre como começar diferente dessa vez?',
 'O que mudou desde então? Agora você tem experiência com os produtos, sabe o que funciona. Isso já é uma vantagem enorme. Quer que eu te mostre como começar diferente dessa vez?',
 'O que mudou desde então? Agora você tem experiência com os produtos, sabe o que funciona. Isso já é uma vantagem enorme. Quer que eu te mostre como começar diferente dessa vez?',
 ARRAY['tentou', 'experiencia', 'diferente'], 21, true),

('recrutamento', 'C.6', 'Não quero incomodar ninguém', 
 'Não é sobre incomodar — é sobre ajudar. Você já ajudou você mesma, pode ajudar outras pessoas também. E ninguém é obrigado a nada. Quer que eu te mostre como fazer de forma leve?',
 'Não é sobre incomodar — é sobre ajudar. Você já ajudou você mesma, pode ajudar outras pessoas também. E ninguém é obrigado a nada. Quer que eu te mostre como fazer de forma leve?',
 'Não é sobre incomodar — é sobre ajudar. Você já ajudou você mesma, pode ajudar outras pessoas também. E ninguém é obrigado a nada. Quer que eu te mostre como fazer de forma leve?',
 ARRAY['incomodar', 'ajudar', 'leve'], 22, true),

('recrutamento', 'C.7', 'Não tenho dinheiro para investir', 
 'O investimento inicial é bem baixo e você já recupera nas primeiras vendas. Quer que eu te mostre os números e como começar com o mínimo?',
 'O investimento inicial é bem baixo e você já recupera nas primeiras vendas. Quer que eu te mostre os números e como começar com o mínimo?',
 'O investimento inicial é bem baixo e você já recupera nas primeiras vendas. Quer que eu te mostre os números e como começar com o mínimo?',
 ARRAY['investimento', 'baixo', 'recuperacao'], 23, true),

('recrutamento', 'C.8', 'Tenho medo de não conseguir', 
 'Todo mundo tem esse medo no começo. Mas você já conseguiu ajudar você mesma — isso já mostra que você consegue. Quer que eu te mostre como começar passo a passo?',
 'Todo mundo tem esse medo no começo. Mas você já conseguiu ajudar você mesma — isso já mostra que você consegue. Quer que eu te mostre como começar passo a passo?',
 'Todo mundo tem esse medo no começo. Mas você já conseguiu ajudar você mesma — isso já mostra que você consegue. Quer que eu te mostre como começar passo a passo?',
 ARRAY['medo', 'conseguir', 'passo_a_passo'], 24, true),

('recrutamento', 'C.9', 'Não sei por onde começar', 
 'Por isso eu estou aqui! Te mostro o passo a passo completo, desde o primeiro contato até a primeira venda. É mais simples do que parece. Quer que eu te mostre?',
 'Por isso eu estou aqui! Te mostro o passo a passo completo, desde o primeiro contato até a primeira venda. É mais simples do que parece. Quer que eu te mostre?',
 'Por isso eu estou aqui! Te mostro o passo a passo completo, desde o primeiro contato até a primeira venda. É mais simples do que parece. Quer que eu te mostre?',
 ARRAY['comecar', 'passo_a_passo', 'simples'], 25, true),

('recrutamento', 'C.10', 'Vou pensar', 
 'Claro! Pensa com calma. Só te aviso que quanto antes você começar, mais rápido você vê resultado. Quer que eu deixe as informações aqui pra você revisar quando quiser?',
 'Claro! Pensa com calma. Só te aviso que quanto antes você começar, mais rápido você vê resultado. Quer que eu deixe as informações aqui pra você revisar quando quiser?',
 'Claro! Pensa com calma. Só te aviso que quanto antes você começar, mais rápido você vê resultado. Quer que eu deixe as informações aqui pra você revisar quando quiser?',
 ARRAY['pensar', 'tempo', 'informacoes'], 26, true);

-- =====================================================
-- NOTAS IMPORTANTES:
-- 
-- 1. REGRA DE OURO: Para novos prospects em recrutamento,
--    NUNCA mencionar PV. Focar em:
--    - Resultado financeiro (renda extra)
--    - Tempo livre
--    - Interesse principal da pessoa
--
-- 2. As objeções acima são uma base inicial.
--    A Lousa completa terá mais objeções e versões.
--
-- 3. Cada objeção pode ter:
--    - versao_curta: Resposta rápida
--    - versao_media: Resposta completa
--    - versao_longa: Resposta detalhada
--    - gatilho_retomada: Mensagem para retomar depois
--    - resposta_se_some: Se a pessoa sumir
--    - resposta_se_negativa: Se a resposta for negativa
--    - upgrade: Para oferecer upgrade
--
-- 4. Total inicial: 26 objeções
--    - Clientes: 10 (A.1 a A.10)
--    - Clientes Recorrentes: 6 (B.1 a B.6)
--    - Recrutamento: 10 (C.1 a C.10)
--
-- 5. Faltam ainda:
--    - Distribuidores: 10 (D.1 a D.10)
--    - Avançadas: 28 (E.1 a E.28)
-- =====================================================

COMMIT;





