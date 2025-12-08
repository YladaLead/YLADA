-- =====================================================
-- WELLNESS SYSTEM - SEED DE SCRIPTS INICIAIS
-- Baseado em: src/lib/wellness-system/scripts-completo.ts
-- =====================================================

BEGIN;

-- Garantir que todas as colunas necessárias existem
DO $$ 
BEGIN
  -- Se a coluna 'nome' não existir, adicionar ou renomear
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_scripts' 
    AND column_name = 'nome'
  ) THEN
    -- Se existe 'titulo', renomear para 'nome'
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'wellness_scripts' 
      AND column_name = 'titulo'
    ) THEN
      ALTER TABLE wellness_scripts RENAME COLUMN titulo TO nome;
    ELSE
      -- Se não existe nenhuma das duas, criar 'nome'
      ALTER TABLE wellness_scripts ADD COLUMN nome VARCHAR(255);
    END IF;
  END IF;
  
  -- Garantir que 'versao' existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_scripts' 
    AND column_name = 'versao'
  ) THEN
    ALTER TABLE wellness_scripts ADD COLUMN versao VARCHAR(20);
  END IF;
  
  -- Garantir que 'conteudo' existe (pode ter sido criado como 'conteudo' ou outro nome)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_scripts' 
    AND column_name = 'conteudo'
  ) THEN
    ALTER TABLE wellness_scripts ADD COLUMN conteudo TEXT;
  END IF;
  
  -- Garantir que 'categoria' existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_scripts' 
    AND column_name = 'categoria'
  ) THEN
    ALTER TABLE wellness_scripts ADD COLUMN categoria VARCHAR(50);
  END IF;
  
  -- Garantir que 'subcategoria' existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_scripts' 
    AND column_name = 'subcategoria'
  ) THEN
    ALTER TABLE wellness_scripts ADD COLUMN subcategoria VARCHAR(100);
  END IF;
  
  -- Garantir que 'tags' existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_scripts' 
    AND column_name = 'tags'
  ) THEN
    ALTER TABLE wellness_scripts ADD COLUMN tags TEXT[];
  END IF;
  
  -- Garantir que 'ordem' existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_scripts' 
    AND column_name = 'ordem'
  ) THEN
    ALTER TABLE wellness_scripts ADD COLUMN ordem INTEGER DEFAULT 0;
  END IF;
  
  -- Garantir que 'ativo' existe (pode ser 'is_ativo' em versões antigas)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_scripts' 
    AND column_name = 'ativo'
  ) THEN
    -- Se existe 'is_ativo', renomear para 'ativo'
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'wellness_scripts' 
      AND column_name = 'is_ativo'
    ) THEN
      ALTER TABLE wellness_scripts RENAME COLUMN is_ativo TO ativo;
    ELSE
      -- Se não existe nenhuma das duas, criar 'ativo'
      ALTER TABLE wellness_scripts ADD COLUMN ativo BOOLEAN DEFAULT true;
    END IF;
  END IF;
END $$;

-- Limpar dados existentes (opcional - descomente se necessário)
-- TRUNCATE TABLE wellness_scripts CASCADE;

-- =====================================================
-- GRUPO 1: ABERTURA
-- =====================================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem, ativo) VALUES
('etapa', 'abertura', 'Abertura Direta (para pessoas próximas)', 'curta', 
 'Amiga/o, posso te mandar uma avaliação rápida? Dá pra ver exatamente onde sua energia está caindo. É gratuito e leva menos de 1 minuto.',
 ARRAY['abertura', 'pessoas_proximas', 'direto'], 1, true),

('etapa', 'abertura', 'Abertura Leve / Amigável', 'curta',
 'Oi! Testei uma avaliação rápida sobre energia e bem-estar, lembrei de você. Quer que eu te envie?',
 ARRAY['abertura', 'amigavel', 'leve'], 2, true),

('etapa', 'abertura', 'Abertura Curiosa (a mais poderosa)', 'media',
 'Posso te enviar um teste rapidinho que mostra seu nível atual de energia e o que está te atrapalhando no dia? Muita gente se surpreende com o resultado.',
 ARRAY['abertura', 'curiosidade', 'poderosa'], 3, true),

('etapa', 'abertura', 'Abertura Consultiva (para público mais formal)', 'media',
 'Olá! Estou trabalhando com avaliações rápidas de energia e disposição. Elas ajudam a identificar padrões do dia a dia e sugerem pequenas ações. Gostaria de fazer a sua?',
 ARRAY['abertura', 'consultiva', 'formal'], 4, true),

('etapa', 'abertura', 'Abertura Ultra Curta (1 linha)', 'curta',
 'Posso te mandar uma avaliação rápida de energia?',
 ARRAY['abertura', 'ultra_curta', 'rapido'], 5, true),

('etapa', 'abertura', 'Abertura para Lead Frio (não te conhece)', 'media',
 'Oi! Vi que muitas pessoas com rotinas parecidas com a sua têm usado essa avaliação rápida para entender onde estão perdendo energia no dia. Posso te enviar a sua?',
 ARRAY['abertura', 'lead_frio', 'mercado_frio'], 6, true),

('etapa', 'abertura', 'Abertura para Lead Morno (já interagiu)', 'curta',
 'Vi sua mensagem/curtida e lembrei: tenho uma avaliação rápida que mostra onde a energia está caindo. Quer fazer a sua?',
 ARRAY['abertura', 'lead_morno', 'interacao'], 7, true),

('etapa', 'abertura', 'Abertura para Lead Quente (já demonstrou interesse)', 'curta',
 'Você comentou sobre cansaço… posso te mandar uma avaliação rápida que mostra exatamente o que está causando isso no seu dia?',
 ARRAY['abertura', 'lead_quente', 'interesse'], 8, true),

('etapa', 'abertura', 'Abertura via Indicação', 'curta',
 'Oi! A [NOME] me falou que você anda sentindo cansaço no dia a dia. Posso te enviar uma avaliação rápida que ela mesma fez e gostou?',
 ARRAY['abertura', 'indicacao', 'social_proof'], 9, true),

('etapa', 'abertura', 'Abertura para Lista Antiga / Contatos Parados', 'curta',
 'Oi! Estou enviando para algumas pessoas uma avaliação rápida que mostra como melhorar energia e disposição. Se quiser, posso te mandar também?',
 ARRAY['abertura', 'reativacao', 'lista_antiga'], 10, true);

-- =====================================================
-- GRUPO 2: PÓS-LINK
-- =====================================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem, ativo) VALUES
('acompanhamento', 'pos_link', 'Pós-link — poucos minutos depois (reforço suave)', 'curta',
 'Acabei de te enviar o link da avaliação 😊 Se não aparecer aí pra você, me avisa que eu te mando de novo.',
 ARRAY['pos_link', 'reforco', 'seguimento'], 11, true),

('acompanhamento', 'pos_link', 'Pós-link — 2 horas depois (sem resposta)', 'curta',
 'Conseguiu ver a avaliação que te mandei mais cedo? Ela é bem rapidinha e já mostra onde sua energia está caindo no dia.',
 ARRAY['pos_link', 'seguimento', '2h'], 12, true),

('acompanhamento', 'pos_link', 'Pós-link — 24h depois (lembrete leve)', 'curta',
 'Passando aqui só pra lembrar da avaliação que te enviei ontem. Ela leva menos de 1 minuto e o resultado já te dá algumas ideias pra melhorar seu dia 😉',
 ARRAY['pos_link', 'seguimento', '24h', 'lembrete'], 13, true),

('acompanhamento', 'pos_link', 'Pós-link — 48h depois (último lembrete educado)', 'curta',
 'Vou encerrar essa avaliação para liberar espaço pra outras pessoas, tá? Se ainda quiser fazer, me avisa que eu seguro o link pra você.',
 ARRAY['pos_link', 'seguimento', '48h', 'ultimo_lembrete'], 14, true),

('acompanhamento', 'pos_link', 'Pós-link — pessoa disse "depois eu vejo"', 'curta',
 'Perfeito! Quando for um bom momento pra você fazer (leva menos de 1 minutinho), me avisa que eu te mando de novo ou deixo aqui separadinho 😊',
 ARRAY['pos_link', 'seguimento', 'depois_vejo'], 15, true),

('acompanhamento', 'pos_link', 'Pós-link — pessoa está ocupada (trabalho / filhos / correria)', 'curta',
 'Super entendo a correria! Deixa salvo aí que, na hora que você tiver 1 minutinho, vale a pena fazer. O resultado já te ajuda a entender o que está drenando sua energia.',
 ARRAY['pos_link', 'seguimento', 'ocupado'], 16, true),

('acompanhamento', 'pos_link', 'Pós-link — pessoa começou e não terminou', 'curta',
 'Vi aqui que você chegou a iniciar a avaliação mas não finalizou. Se quiser, eu posso segurar seu link e você termina quando tiver 1 minuto livre 😉',
 ARRAY['pos_link', 'seguimento', 'incompleto'], 17, true),

('acompanhamento', 'pos_link', 'Pós-link — retomada com curiosidade', 'curta',
 'Te conto uma coisa curiosa: a maioria das pessoas se surpreende com o resultado dessa avaliação. Quando você fizer a sua, me conta se fez sentido pra você também?',
 ARRAY['pos_link', 'seguimento', 'curiosidade'], 18, true);

-- =====================================================
-- GRUPO 3: PÓS-DIAGNÓSTICO
-- =====================================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem, ativo) VALUES
('etapa', 'pos_diagnostico', 'Pós-diagnóstico — Versão Curta (universal)', 'curta',
 'Vi aqui seu resultado! Ele mostra exatamente o que está drenando sua energia no dia. Quer que eu te explique como melhorar isso já nos próximos dias?',
 ARRAY['pos_diagnostico', 'universal', 'curta'], 19, true),

('etapa', 'pos_diagnostico', 'Pós-diagnóstico — Versão Média (mais consultiva)', 'media',
 'Acabei de ver o seu diagnóstico. Ele mostra bem o que está atrapalhando sua energia e disposição. Se quiser, te explico de forma simples o que está acontecendo e o que você pode fazer para melhorar já essa semana.',
 ARRAY['pos_diagnostico', 'consultiva', 'media'], 20, true),

('etapa', 'pos_diagnostico', 'Pós-diagnóstico — Versão Persuasiva (forte para conversão)', 'longa',
 'Seu diagnóstico é exatamente o tipo de padrão que, quando ajustado, muda completamente o dia da pessoa. Com pequenas ações, dá pra sentir diferença em poucos dias. Posso te mostrar o que seria mais eficiente no seu caso?',
 ARRAY['pos_diagnostico', 'persuasiva', 'conversao'], 21, true),

('etapa', 'pos_diagnostico', 'Pós-diagnóstico — Versão Emocional (ideal para fluxos de estresse, mães, exaustão)', 'longa',
 'Li seu diagnóstico e ele diz muito sobre a fase que você está vivendo. Isso não é frescura e não é normal sentir esse peso todos os dias. Com pequenas mudanças, você pode voltar a sentir leveza e energia de verdade. Quer que eu te oriente no passo a passo?',
 ARRAY['pos_diagnostico', 'emocional', 'estresse'], 22, true),

('etapa', 'pos_diagnostico', 'Pós-diagnóstico — Se o diagnóstico for de ENERGIA', 'media',
 'Seu resultado mostra queda de energia em momentos chave do dia. Isso explica muito da sua dificuldade de disposição e foco. Posso te mostrar a solução mais simples e leve pra ajustar isso?',
 ARRAY['pos_diagnostico', 'energia', 'especifico'], 23, true),

('etapa', 'pos_diagnostico', 'Pós-diagnóstico — Se o diagnóstico for de ACELERA (inchaço, retenção, peso)', 'media',
 'Seu resultado mostra sinais de retenção e lentidão digestiva/metabólica. Isso geralmente causa inchaço, peso e cansaço. Quer que eu te mostre o protocolo mais simples para aliviar isso rápido?',
 ARRAY['pos_diagnostico', 'acelera', 'retencao', 'especifico'], 24, true),

('etapa', 'pos_diagnostico', 'Pós-diagnóstico — Se a pessoa reagiu ao resultado com surpresa', 'curta',
 'Normal mesmo! Muita gente se surpreende quando vê tudo tão claro no diagnóstico. A boa notícia é que o seu caso tem solução simples. Posso te explicar?',
 ARRAY['pos_diagnostico', 'surpresa', 'reacao'], 25, true),

('etapa', 'pos_diagnostico', 'Pós-diagnóstico — Se a pessoa disse "É bem isso mesmo"', 'curta',
 'Fico feliz que você se identificou! Isso já é metade do caminho. Posso te mostrar agora o que funciona melhor para esse tipo de padrão?',
 ARRAY['pos_diagnostico', 'identificacao', 'reacao'], 26, true),

('etapa', 'pos_diagnostico', 'Pós-diagnóstico — Se a pessoa não reagiu ao resultado', 'curta',
 'Deu uma olhadinha no diagnóstico? Ele mostra o que está travando sua energia no dia. Quando quiser, te explico o passo a passo pra melhorar isso.',
 ARRAY['pos_diagnostico', 'sem_reacao', 'seguimento'], 27, true);

-- =====================================================
-- GRUPO 4: OFERTA
-- =====================================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem, ativo) VALUES
('etapa', 'oferta', 'Oferta Direta — Kit Energia (para fluxos de cansaço, foco, rotina pesada, manhã/tarde/noite)', 'media',
 'Pelo seu diagnóstico, o protocolo mais eficiente para o seu caso é o *Kit Energia* (5 dias). Ele ajuda a estabilizar sua energia, melhorar o foco e evitar essas quedas do dia. Quer que eu te explique como funciona o kit e como usar no seu horário?',
 ARRAY['oferta', 'kit_energia', 'direto'], 28, true),

('etapa', 'oferta', 'Oferta Direta — Kit Acelera (para inchaço, retenção, metabolismo lento, peso)', 'media',
 'No seu caso, o que traz resultado mais rápido é o *Kit Acelera* (5 dias). Ele ajuda na leveza, reduz retenção e melhora muito a sensação de peso. Quer que eu te envie como funciona certinho?',
 ARRAY['oferta', 'kit_acelera', 'direto'], 29, true),

('etapa', 'oferta', 'Oferta Consultiva — quando a pessoa pede orientação', 'media',
 'Pelo seu diagnóstico, eu analisaria duas opções, mas a principal — e mais eficiente no seu caso — é este kit aqui (Energia/Acelera). Posso te mostrar como ele funciona na rotina e o que ele melhora primeiro?',
 ARRAY['oferta', 'consultiva', 'orientacao'], 30, true),

('etapa', 'oferta', 'Oferta Natural — sem parecer venda (ótimo para pessoas sensíveis a oferta)', 'curta',
 'Posso te mostrar a solução que eu recomendaria pra alguém com exatamente o mesmo diagnóstico que o seu? É algo simples, leve e que já muda sua semana.',
 ARRAY['oferta', 'natural', 'sem_pressao'], 31, true),

('etapa', 'oferta', 'Oferta com validação (prova social indireta)', 'media',
 'Esse mesmo kit que seu diagnóstico indica é o que mais funciona para pessoas com esse padrão. É simples de usar e os resultados costumam aparecer logo nos primeiros dias. Quer ver como funciona?',
 ARRAY['oferta', 'validacao', 'prova_social'], 32, true),

('etapa', 'oferta', 'Oferta com gatilho de autonomia (quando a pessoa tem receio de pressão)', 'curta',
 'Vou te passar a recomendação do seu diagnóstico, sem pressão nenhuma. Aí você vê se faz sentido pra você, ok? O kit indicado é o… (Energia/Acelera).',
 ARRAY['oferta', 'autonomia', 'sem_pressao'], 33, true),

('etapa', 'oferta', 'Oferta curta (WhatsApp rápido)', 'curta',
 'Pelo seu resultado, o ideal é o Kit Energia/Acelera (5 dias). Quer detalhes?',
 ARRAY['oferta', 'curta', 'rapido'], 34, true),

('etapa', 'oferta', 'Oferta para quem teve diagnóstico de nível grave ou muito forte', 'media',
 'Seu diagnóstico mostrou sinais mais intensos desse padrão. O kit que eu recomendo pra você é o Energia/Acelera, porque ele já atua exatamente no que apareceu no resultado. Te explico como usar?',
 ARRAY['oferta', 'grave', 'intenso'], 35, true),

('etapa', 'oferta', 'Oferta para pessoas indecisas', 'curta',
 'Pra simplificar: o melhor primeiro passo para o que apareceu no seu diagnóstico é este kit (Energia/Acelera). Ele já melhora muito sua disposição/leveza nessa semana. Quer ver como funciona?',
 ARRAY['oferta', 'indeciso', 'simplificado'], 36, true),

('etapa', 'oferta', 'Oferta elegante (sem pressão, apenas clareza)', 'media',
 'O seu diagnóstico deixa bem claro qual é o kit ideal, e eu posso te mostrar como ele funciona — e aí você vê se faz sentido entrar no protocolo agora ou mais pra frente.',
 ARRAY['oferta', 'elegante', 'sem_pressao'], 37, true),

('etapa', 'oferta', 'Oferta direcionada — Produto Fechado (para quem pediu mais tempo / quer experimentar mais longo prazo)', 'media',
 'Se preferir algo que dure mais tempo, existe também a opção do produto fechado. Ele rende muitas doses e sai mais econômico. Quer que eu te envie as opções?',
 ARRAY['oferta', 'produto_fechado', 'upgrade'], 38, true),

('etapa', 'oferta', 'Oferta — Cliente Premium (para quem pediu constância ou quer economia)', 'media',
 'Como seu diagnóstico mostra que isso é algo que precisa de acompanhamento, existe a opção de você ter o protocolo completo com desconto pelo sistema *Cliente Premium*. Quer que eu te mostre como funciona?',
 ARRAY['oferta', 'cliente_premium', 'economia'], 39, true);

-- =====================================================
-- GRUPO 5: FECHAMENTO
-- =====================================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem, ativo) VALUES
('etapa', 'fechamento', 'Fechamento Direto (simples e objetivo)', 'curta',
 'Quer que eu separe seu kit pra começar ainda hoje?',
 ARRAY['fechamento', 'direto', 'objetivo'], 40, true),

('etapa', 'fechamento', 'Fechamento Curto (WhatsApp rápido)', 'curta',
 'Posso reservar seu kit?',
 ARRAY['fechamento', 'curto', 'rapido'], 41, true),

('etapa', 'fechamento', 'Fechamento Consultivo (sem pressão)', 'media',
 'Pelo que apareceu no seu diagnóstico, esse kit é o que faz mais sentido pra você. Posso separar o seu e te explicar como usar no seu horário?',
 ARRAY['fechamento', 'consultivo', 'sem_pressao'], 42, true),

('etapa', 'fechamento', 'Fechamento Emocional (para dores mais profundas)', 'media',
 'Você não precisa continuar sentindo isso todos os dias. Posso separar seu kit pra você dar esse primeiro passo ainda hoje?',
 ARRAY['fechamento', 'emocional', 'dores_profundas'], 43, true),

('etapa', 'fechamento', 'Fechamento Elegante (profissional e leve)', 'curta',
 'Se você quiser, eu já deixo seu kit reservado aqui. Aí você decide se inicia hoje ou amanhã, sem problema.',
 ARRAY['fechamento', 'elegante', 'profissional'], 44, true),

('etapa', 'fechamento', 'Fechamento com Urgência (suave)', 'curta',
 'Se quiser garantir o seu kit com prioridade, posso separar agora. Me confirma?',
 ARRAY['fechamento', 'urgencia', 'suave'], 45, true),

('etapa', 'fechamento', 'Fechamento com Urgência (forte, mas educado)', 'curta',
 'Os kits que eu tenho para hoje já estão quase acabando. Quer que eu reserve o seu antes de fechar a lista?',
 ARRAY['fechamento', 'urgencia', 'forte'], 46, true),

('etapa', 'fechamento', 'Fechamento com Validação (prova social)', 'media',
 'Esse mesmo protocolo tem ajudado muita gente com o mesmo diagnóstico que o seu. Quer que eu já reserve o seu também?',
 ARRAY['fechamento', 'validacao', 'prova_social'], 47, true),

('etapa', 'fechamento', 'Fechamento com Comparação (mostra lógica)', 'media',
 'Entre continuar sentindo tudo isso e iniciar um protocolo simples de 5 dias, qual opção faz mais sentido pra você hoje? Posso separar o seu kit?',
 ARRAY['fechamento', 'comparacao', 'logica'], 48, true),

('etapa', 'fechamento', 'Fechamento para Indecisos (muito eficaz)', 'curta',
 'Pra facilitar: eu separo seu kit aqui. Se você decidir iniciar hoje, ótimo. Se preferir começar amanhã, ele já estará garantido.',
 ARRAY['fechamento', 'indeciso', 'facilitado'], 49, true),

('etapa', 'fechamento', 'Fechamento Premium (para quem quer economia)', 'curta',
 'Se quiser algo mais econômico e duradouro, posso separar o kit ou te mostrar a opção Premium. O que prefere?',
 ARRAY['fechamento', 'premium', 'economia'], 50, true),

('etapa', 'fechamento', 'Fechamento com Alternativa (sempre converte)', 'curta',
 'Prefere começar com o Kit de 5 dias ou já ir para o produto fechado para durar mais tempo?',
 ARRAY['fechamento', 'alternativa', 'opcoes'], 51, true),

('etapa', 'fechamento', 'Fechamento Final (última tentativa educada)', 'curta',
 'Posso confirmar seu kit por aqui? Se precisar de desconto ou outra opção, posso te passar.',
 ARRAY['fechamento', 'final', 'ultima_tentativa'], 52, true);

-- =====================================================
-- GRUPO 6: OBJEÇÕES (Scripts de resposta a objeções)
-- =====================================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem, ativo) VALUES
('interno', 'objecoes', 'Objeção: "Vou ver depois."', 'curta',
 'Perfeito! Só te aviso que quanto mais cedo você começar, mais rápido seu corpo responde. Quer que eu já deixe seu kit reservado? Aí você decide a hora de iniciar.',
 ARRAY['objecao', 'ver_depois', 'reserva'], 53, true),

('interno', 'objecoes', 'Objeção: "Estou sem dinheiro agora."', 'media',
 'Super entendo! Por isso começamos com o protocolo de 5 dias — ele é leve, acessível e já te entrega resultado pra você sentir a diferença antes de qualquer compromisso maior. Posso te passar as opções mais econômicas?',
 ARRAY['objecao', 'dinheiro', 'economia'], 54, true),

('interno', 'objecoes', 'Objeção: "Preciso falar com alguém antes." (esposa, marido, mãe, etc.)', 'curta',
 'Sem problema nenhum! Quer que eu te envie um resumo pronto, bem simples, pra você mostrar pra ele(a)? Assim facilita sua conversa 😉',
 ARRAY['objecao', 'consultar', 'resumo'], 55, true),

('interno', 'objecoes', 'Objeção: "Será que funciona pra mim?"', 'media',
 'Seu próprio diagnóstico já mostra o que está acontecendo com você — e o kit que te indiquei atua exatamente nesses pontos. A maioria das pessoas sente diferença já nos primeiros dias. Quer tentar e sentir na prática?',
 ARRAY['objecao', 'duvida', 'funciona'], 56, true),

('interno', 'objecoes', 'Objeção: "Não gosto de chá."', 'curta',
 'Fica tranquila(o)! O sabor é leve e você pode usar com gelo e limão — a maioria das pessoas que fala isso acaba gostando. E se quiser, também posso te mostrar outras formas de preparar 😉',
 ARRAY['objecao', 'sabor', 'preparo'], 57, true),

('interno', 'objecoes', 'Objeção: "Tenho medo de passar mal."', 'media',
 'Entendo totalmente. Por isso começamos com o protocolo leve de 5 dias, com acompanhamento. Ele é seguro, natural e você usa na sua intensidade. Qualquer sensação diferente, eu ajusto junto com você.',
 ARRAY['objecao', 'medo', 'seguranca'], 58, true),

('interno', 'objecoes', 'Objeção: "Já tentei várias coisas e nada funcionou."', 'media',
 'Eu entendo essa frustração. A diferença aqui é que seu diagnóstico mostrou exatamente o que está acontecendo — e o kit atua direto no ponto. Você não vai estar tentando às cegas. Quer fazer um teste leve de 5 dias?',
 ARRAY['objecao', 'frustracao', 'diferenca'], 59, true),

('interno', 'objecoes', 'Objeção: "Não tenho tempo."', 'curta',
 'O legal é que você só precisa misturar e beber. Não leva 30 segundos. Muitas pessoas com rotina corrida usam justamente por isso. Quer começar com o menor protocolo de 5 dias?',
 ARRAY['objecao', 'tempo', 'rapido'], 60, true),

('interno', 'objecoes', 'Objeção: "É caro."', 'media',
 'Comparado ao que ele entrega em energia/leveza e ao custo de cafés, doces, lanches ou até cansaço acumulado, ele sai muito mais barato. E começamos com o menor protocolo justamente pra caber no dia a dia. Posso ver a opção mais econômica pra você?',
 ARRAY['objecao', 'caro', 'comparacao'], 61, true),

('interno', 'objecoes', 'Objeção: "Preciso pensar."', 'curta',
 'Claro! Só deixa eu te dizer uma coisa importante: sua energia de hoje não muda sozinha. Se quiser, eu deixo seu kit reservado e você decide com calma se inicia hoje ou amanhã.',
 ARRAY['objecao', 'pensar', 'reserva'], 62, true),

('interno', 'objecoes', 'Objeção: "Não posso agora." (genérica)', 'curta',
 'Sem problema! Quer que eu só deixe seu kit separado? Assim, quando você puder, já está garantido.',
 ARRAY['objecao', 'genérica', 'reserva'], 63, true),

('interno', 'objecoes', 'Objeção: "Posso começar depois?"', 'curta',
 'Pode sim! Inclusive, posso deixar seu kit reservado pra você iniciar no dia que escolher. Quer que eu deixe separado?',
 ARRAY['objecao', 'comecar_depois', 'reserva'], 64, true),

('interno', 'objecoes', 'Objeção: "Preciso ver se cabe no orçamento."', 'curta',
 'Claro! Me diz uma faixa confortável pra você que eu ajusto a recomendação e te passo a opção mais econômica sem perder resultado.',
 ARRAY['objecao', 'orcamento', 'economia'], 65, true),

('interno', 'objecoes', 'Objeção: "Tenho medo de depender / criar hábito."', 'media',
 'Totalmente compreensível. Mas aqui não é algo viciante — é um suporte funcional. Você usa pra ajustar seu corpo e depois mantém só se quiser. Podemos começar leve pra você sentir?',
 ARRAY['objecao', 'dependencia', 'habito'], 66, true),

('interno', 'objecoes', 'Objeção: "Prefiro emagrecer com alimentação / academia."', 'media',
 'Perfeito! Isso é ótimo. Na verdade, o kit entra como apoio justamente pra dar energia e leveza pra você conseguir fazer isso com mais constância. Quer que eu te mostre como combinar tudo?',
 ARRAY['objecao', 'outras_abordagens', 'combinacao'], 67, true);

-- =====================================================
-- GRUPO 7: RECUPERAÇÃO (Reativação de leads)
-- =====================================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem, ativo) VALUES
('reativacao', 'recuperacao', 'Lead que SUMIU após o diagnóstico', 'curta',
 'Oi! Vi aqui que você não conseguiu continuar aquele passo a passo. Quer que eu te envie novamente ou te explique rapidinho por aqui?',
 ARRAY['recuperacao', 'sumiu', 'diagnostico'], 68, true),

('reativacao', 'recuperacao', 'Lead que SUMIU após receber a oferta', 'curta',
 'Conseguiu ver a recomendação do seu diagnóstico? Se quiser, te explico rapidinho como funciona o kit pra você decidir com calma.',
 ARRAY['recuperacao', 'sumiu', 'oferta'], 69, true),

('reativacao', 'recuperacao', 'Lead que NÃO RESPONDE nada há dias', 'curta',
 'Oi! Só passando pra ver se você ainda quer ajuda com a parte da energia/leveza que apareceu no seu diagnóstico. Posso te orientar quando quiser.',
 ARRAY['recuperacao', 'nao_responde', 'dias'], 70, true),

('reativacao', 'recuperacao', 'Lead que disse "vou ver" e sumiu', 'curta',
 'Lembra daquela avaliação que você fez? Ela mostra pontos importantes do seu dia. Se quiser, posso te ajudar com o próximo passo quando for um bom momento 🙂',
 ARRAY['recuperacao', 'ver_depois', 'sumiu'], 71, true),

('reativacao', 'recuperacao', 'Lead que DEMONSTROU INTERESSE mas travou', 'curta',
 'Vi que você tinha gostado da recomendação! Quer que eu te mostre a forma mais simples de iniciar? É bem leve mesmo.',
 ARRAY['recuperacao', 'interesse', 'travou'], 72, true),

('reativacao', 'recuperacao', 'Lead que estava QUASE FECHANDO e desapareceu', 'curta',
 'Oi! Só confirmando se você quer que eu reserve seu kit. Ele estava separado aqui pra você 😉',
 ARRAY['recuperacao', 'quase_fechando', 'desapareceu'], 73, true),

('reativacao', 'recuperacao', 'Lead que viu o kit mas não respondeu', 'curta',
 'Conseguiu ver as opções que te enviei? Se quiser, te explico a diferença entre elas pra ficar mais fácil decidir.',
 ARRAY['recuperacao', 'viu_kit', 'nao_respondeu'], 74, true),

('reativacao', 'recuperacao', 'Lead que pediu preço e sumiu', 'curta',
 'Te mandei as opções! Se quiser, posso te passar a opção mais econômica ou a que faz mais sentido pro seu diagnóstico.',
 ARRAY['recuperacao', 'preco', 'sumiu'], 75, true),

('reativacao', 'recuperacao', 'Lead que ficou inseguro', 'curta',
 'Se ficou alguma dúvida sobre o protocolo ou se quiser entender melhor como funciona, pode me chamar. Te explico tudo sem pressa 😊',
 ARRAY['recuperacao', 'inseguro', 'duvida'], 76, true),

('reativacao', 'recuperacao', 'Lead que disse que vai pensar e sumiu', 'curta',
 'Imagina, pensa com calma mesmo. Quando quiser dar o primeiro passo eu te ajudo! Quer que eu deixe um kit separado enquanto isso?',
 ARRAY['recuperacao', 'pensar', 'sumiu'], 77, true),

('reativacao', 'recuperacao', 'Lead que não clicou no link do fluxo', 'curta',
 'Você chegou a ver aquele teste que te mandei? Ele mostra coisas importantes do seu dia. Se quiser, te envio de novo!',
 ARRAY['recuperacao', 'nao_clicou', 'link'], 78, true),

('reativacao', 'recuperacao', 'Lead que clicou no link, mas não finalizou', 'curta',
 'Vi aqui que você iniciou a avaliação mas não conseguiu terminar. Quer que eu segure ela pra você concluir quando tiver 1 minutinho?',
 ARRAY['recuperacao', 'iniciou', 'nao_finalizou'], 79, true),

('reativacao', 'recuperacao', 'Lead que finalizou o diagnóstico mas não conversou', 'curta',
 'Teu diagnóstico ficou bem claro — posso te explicar rapidinho o que ele significa e qual seria o melhor primeiro passo pra você?',
 ARRAY['recuperacao', 'finalizou', 'nao_conversou'], 80, true),

('reativacao', 'recuperacao', 'Lead que continua vendo status mas não responde', 'curta',
 'Vi que você viu meus status! Se quiser ajuda com aquela parte da energia/leveza que apareceu na sua avaliação, é só me chamar 😊',
 ARRAY['recuperacao', 'vendo_status', 'nao_responde'], 81, true),

('reativacao', 'recuperacao', 'Lead que responde só com emoji ou monossilábico', 'curta',
 'Sem problema! Se quiser, te explico de forma bem simples como funciona o passo a passo. Só me dizer 😊',
 ARRAY['recuperacao', 'emoji', 'monossilabico'], 82, true);

-- =====================================================
-- GRUPO 8: INDICAÇÕES
-- =====================================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem, ativo) VALUES
('recrutamento', 'indicacoes', 'Pedindo 1 indicação (leve)', 'curta',
 'Posso te pedir uma coisa rapidinha? Se você lembrar de alguém que vive reclamando de cansaço ou inchaço, me indica? Eu envio pra pessoa uma avaliação gratuita como a sua.',
 ARRAY['indicacao', '1_pessoa', 'leve'], 83, true),

('recrutamento', 'indicacoes', 'Pedindo 3 indicações (o mais efetivo)', 'curta',
 'Uma última coisa: você consegue me indicar 3 pessoas que vivem falando de falta de energia ou inchaço? Eu mando pra elas a avaliação gratuita também 😉',
 ARRAY['indicacao', '3_pessoas', 'efetivo'], 84, true),

('recrutamento', 'indicacoes', 'Pedindo indicação para cliente satisfeito', 'curta',
 'Feliz que você gostou do resultado! Quer me indicar 2 ou 3 pessoas que também vivem cansadas/inchadas? Envio a avaliação gratuita pra elas também!',
 ARRAY['indicacao', 'cliente_satisfeito', 'viralizacao'], 85, true),

('recrutamento', 'indicacoes', 'Mensagem para a pessoa que recebeu a indicação', 'curta',
 'Oi! A [NOME] me falou que você anda sentindo cansaço/inchaço no dia a dia e pediu pra eu te enviar essa avaliação rápida. É gratuita e mostra exatamente onde sua energia está caindo. Posso te enviar?',
 ARRAY['indicacao', 'recebeu', 'social_proof'], 86, true),

('recrutamento', 'indicacoes', 'Mensagem de viralização leve (muito eficaz)', 'curta',
 'Estou enviando essa avaliação pra algumas pessoas porque tem ajudado muito quem vive cansado(a) ou sem disposição. Se quiser, posso te mandar também!',
 ARRAY['indicacao', 'viralizacao', 'leve'], 87, true),

('recrutamento', 'indicacoes', 'Mensagem de viralização forte (ideal pra listas grandes)', 'curta',
 'Enviei essa avaliação pra algumas pessoas e os resultados estão sendo incríveis. Se você quiser ver o seu também, me chama aqui que eu envio!',
 ARRAY['indicacao', 'viralizacao', 'forte'], 88, true);

-- =====================================================
-- GRUPO 9: PÓS-VENDA
-- =====================================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem, ativo) VALUES
('acompanhamento', 'pos_venda', 'Boas-vindas (após efetuar a compra)', 'curta',
 'Seu kit está garantido! 🎉 A partir de agora eu te acompanho passo a passo pra você ter os melhores resultados. Quando chegar, me avisa que te passo tudo certinho 😊',
 ARRAY['pos_venda', 'boas_vindas', 'compra'], 89, true),

('acompanhamento', 'pos_venda', 'Como preparar (quando o kit chega)', 'media',
 'Seu kit chegou? Ótimo! 🙌 Vou te passar como preparar:

1. Coloque água gelada,

2. Adicione 1 medida do seu produto,

3. Agite bem,

4. Beba nos horários combinados.

Se quiser, te mando um vídeo curto também!',
 ARRAY['pos_venda', 'preparo', 'instrucoes'], 90, true),

('acompanhamento', 'pos_venda', 'Horários de uso (universal)', 'curta',
 'Vamos combinar assim?

• Se for Energia → manhã ou tarde, quando sentir queda.

• Se for Acelera → após o almoço ou conforme achar melhor.

E qualquer ajuste eu faço com você ao longo dos dias!',
 ARRAY['pos_venda', 'horarios', 'uso'], 91, true),

('acompanhamento', 'pos_venda', 'Acompanhamento diário (mensagem leve)', 'curta',
 'Passando só pra saber: como você se sentiu hoje com o protocolo? Alguma diferença na energia ou na leveza?',
 ARRAY['pos_venda', 'acompanhamento', 'diario'], 92, true),

('acompanhamento', 'pos_venda', 'Acompanhamento com reforço (muito eficaz)', 'curta',
 'Hoje é dia de manter o foco! Se precisar ajustar horário, sabor ou intensidade, me avisa. Meu objetivo é que você sinta resultado rápido 😉',
 ARRAY['pos_venda', 'acompanhamento', 'reforco'], 93, true),

('acompanhamento', 'pos_venda', 'Acompanhamento — ajuste fino (após 2 dias)', 'curta',
 'Com 2 dias usando já dá pra ajustar a dose se quiser um efeito mais forte ou mais leve. Quer que eu veja isso com você?',
 ARRAY['pos_venda', 'acompanhamento', 'ajuste'], 94, true),

('acompanhamento', 'pos_venda', 'Reforço motivacional (após 3–5 dias)', 'curta',
 'Você está quase no meio do seu protocolo! Muita gente começa a sentir diferença exatamente nessa fase. Me conta como você está hoje!',
 ARRAY['pos_venda', 'acompanhamento', 'motivacao'], 95, true);

-- =====================================================
-- GRUPO 10: RECOMPRA
-- =====================================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem, ativo) VALUES
('acompanhamento', 'recompra', 'Quando faltam 5 doses', 'curta',
 'Seu protocolo já está chegando na reta final! Quer que eu já deixe mais um kit separado pra você não ficar sem?',
 ARRAY['recompra', '5_doses', 'antecipacao'], 96, true),

('acompanhamento', 'recompra', 'Quando faltam 2 doses', 'curta',
 'Faltam só 2 doses! A maioria das pessoas já deixa o próximo kit reservado nessa fase pra não perder o ritmo. Quer que eu separe o seu?',
 ARRAY['recompra', '2_doses', 'urgencia'], 97, true),

('acompanhamento', 'recompra', 'Quando ACABOU', 'media',
 'Acabou seu kit? Quer manter os resultados e seguir pro próximo passo? Posso separar um kit ou te mostrar a opção do produto fechado (dura bem mais e sai mais econômico).',
 ARRAY['recompra', 'acabou', 'upgrade'], 98, true),

('acompanhamento', 'recompra', 'Upgrade para pote fechado', 'curta',
 'Como você gostou do kit de teste, que tal pegar o produto fechado agora? Você economiza e tem produto para [TEMPO]. Quer que eu te passe os valores? 💰',
 ARRAY['recompra', 'upgrade', 'produto_fechado'], 99, true);

COMMIT;

-- =====================================================
-- RESUMO:
-- Total de scripts inseridos: 99
-- Categorias: etapa, acompanhamento, interno, reativacao, recrutamento
-- Subcategorias: abertura, pos_link, pos_diagnostico, oferta, fechamento, objecoes, recuperacao, indicacoes, pos_venda, recompra
-- Versões: curta, media, longa
-- =====================================================

-- =====================================================
-- NOTAS:
-- - Total de scripts inseridos nesta primeira parte: 52
-- - Restam: objeções, recuperação, indicações, pós-venda, recompra
-- - Cada script pode ter múltiplas versões (curta, média, longa)
-- - Tags ajudam na busca e categorização
-- =====================================================

