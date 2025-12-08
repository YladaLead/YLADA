-- ============================================
-- EXECUÇÃO COMPLETA - IMPLEMENTAÇÃO DAS LOUSAS
-- Execute este arquivo no Supabase SQL Editor
-- ============================================

-- ============================================
-- PARTE 1: CRIAR TABELAS
-- ============================================

-- Tabela: Links Wellness (Catálogo Oficial)
CREATE TABLE IF NOT EXISTS wellness_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL CHECK (categoria IN (
    'saude-bem-estar',
    'diagnostico-profundo',
    'transformacao-desafios',
    'oportunidade-negocio'
  )),
  objetivo TEXT NOT NULL CHECK (objetivo IN (
    'captacao',
    'diagnostico',
    'engajamento',
    'recrutamento'
  )),
  publico_alvo TEXT,
  quando_usar TEXT,
  script_curto TEXT,
  url_template TEXT,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para wellness_links
CREATE INDEX IF NOT EXISTS idx_wellness_links_categoria ON wellness_links(categoria);
CREATE INDEX IF NOT EXISTS idx_wellness_links_objetivo ON wellness_links(objetivo);
CREATE INDEX IF NOT EXISTS idx_wellness_links_ativo ON wellness_links(ativo);

-- Tabela: Treinos Wellness
CREATE TABLE IF NOT EXISTS wellness_treinos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('1min', '3min', '5min')),
  titulo TEXT NOT NULL,
  conceito TEXT NOT NULL,
  exemplo_pratico TEXT,
  acao_diaria TEXT,
  gatilho_noel TEXT,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para wellness_treinos
CREATE INDEX IF NOT EXISTS idx_wellness_treinos_tipo ON wellness_treinos(tipo);
CREATE INDEX IF NOT EXISTS idx_wellness_treinos_ativo ON wellness_treinos(ativo);

-- ============================================
-- PARTE 2: INSERIR LINKS WELLNESS (37 links)
-- ============================================

-- CATEGORIA 1: SAÚDE E BEM-ESTAR (10 links)
INSERT INTO wellness_links (codigo, nome, categoria, objetivo, publico_alvo, quando_usar, script_curto, ordem) VALUES
('calculadora-agua', 'Calculadora de Água', 'saude-bem-estar', 'captacao', 'Pessoas que querem melhorar hidratação, praticantes de atividade física, pessoas com problemas de pele ou cansaço', 'Para leads frios ou mornos que mencionam cansaço, pele seca, ou praticam exercícios', 'Olha, tenho uma calculadora que mostra exatamente quanta água você precisa por dia. Quer testar?', 1),
('calculadora-calorias', 'Calculadora de Calorias', 'saude-bem-estar', 'captacao', 'Pessoas que querem emagrecer, ganhar peso, ou entender seu consumo calórico', 'Para leads que mencionam alimentação, peso, ou objetivos de composição corporal', 'Tenho uma calculadora que mostra quantas calorias você precisa por dia. Quer ver?', 2),
('calculadora-imc', 'Calculadora de IMC', 'saude-bem-estar', 'captacao', 'Pessoas que querem entender seu índice de massa corporal', 'Para leads que mencionam peso, saúde, ou querem um diagnóstico inicial', 'Tenho uma calculadora rápida de IMC. Quer testar?', 3),
('calculadora-proteina', 'Calculadora de Proteína', 'saude-bem-estar', 'captacao', 'Pessoas que treinam, querem ganhar massa muscular, ou melhorar recuperação', 'Para leads que mencionam treino, academia, ou objetivos de força', 'Tenho uma calculadora que mostra quanta proteína você precisa. Quer ver?', 4),
('quiz-bem-estar', 'Quiz de Bem-estar', 'saude-bem-estar', 'engajamento', 'Pessoas que querem avaliar seu nível geral de bem-estar', 'Para leads mornos que já demonstraram interesse em saúde', 'Tenho um quiz rápido que avalia seu bem-estar geral. Quer fazer?', 5),
('quiz-energetico', 'Quiz Energético', 'saude-bem-estar', 'diagnostico', 'Pessoas que sentem cansaço, falta de energia, ou desânimo', 'Para leads que mencionam cansaço, falta de energia, ou desmotivação', 'Tenho um quiz que identifica o que pode estar afetando sua energia. Quer testar?', 6),
('quiz-alimentacao-saudavel', 'Quiz de Alimentação Saudável', 'saude-bem-estar', 'diagnostico', 'Pessoas que querem avaliar seus hábitos alimentares', 'Para leads que mencionam alimentação, dieta, ou querem melhorar hábitos', 'Tenho um quiz que avalia seus hábitos alimentares. Quer fazer?', 7),
('voce-conhece-seu-corpo', 'Você conhece o seu corpo?', 'saude-bem-estar', 'diagnostico', 'Pessoas que querem entender melhor seu corpo e necessidades', 'Para leads que demonstram curiosidade sobre saúde e autoconhecimento', 'Tenho um questionário que ajuda você a entender melhor seu corpo. Quer fazer?', 8),
('nutrido-ou-alimentado', 'Você está nutrido ou apenas alimentado?', 'saude-bem-estar', 'diagnostico', 'Pessoas que querem entender a diferença entre nutrição e alimentação', 'Para leads que mencionam alimentação mas não resultados de saúde', 'Tenho um questionário que mostra se você está nutrido ou só alimentado. Quer testar?', 9),
('alimentacao-conforme-rotina', 'Você está se alimentando conforme sua rotina?', 'saude-bem-estar', 'diagnostico', 'Pessoas com rotina corrida que querem otimizar alimentação', 'Para leads que mencionam rotina corrida, falta de tempo, ou alimentação desorganizada', 'Tenho um questionário que avalia se sua alimentação está alinhada com sua rotina. Quer fazer?', 10)
ON CONFLICT (codigo) DO NOTHING;

-- CATEGORIA 2: DIAGNÓSTICO PROFUNDO (11 links)
INSERT INTO wellness_links (codigo, nome, categoria, objetivo, publico_alvo, quando_usar, script_curto, ordem) VALUES
('avaliacao-fome-emocional', 'Avaliação de Fome Emocional', 'diagnostico-profundo', 'diagnostico', 'Pessoas que comem por ansiedade, estresse, ou emoções', 'Para leads que mencionam comer por ansiedade, estresse, ou dificuldade de controle', 'Tenho uma avaliação que identifica se você come por fome ou por emoção. Quer fazer?', 11),
('avaliacao-intolerancias', 'Avaliação de Intolerâncias/Sensibilidades', 'diagnostico-profundo', 'diagnostico', 'Pessoas com desconfortos digestivos, inchaço, ou sintomas após comer', 'Para leads que mencionam desconforto digestivo, inchaço, ou reações a alimentos', 'Tenho uma avaliação que identifica possíveis intolerâncias alimentares. Quer testar?', 12),
('avaliacao-perfil-metabolico', 'Avaliação de Perfil Metabólico', 'diagnostico-profundo', 'diagnostico', 'Pessoas que querem entender seu metabolismo e como otimizá-lo', 'Para leads que mencionam dificuldade de emagrecer, metabolismo lento, ou resultados lentos', 'Tenho uma avaliação que identifica seu perfil metabólico. Quer fazer?', 13),
('diagnostico-eletrolitos', 'Diagnóstico de Eletrólitos', 'diagnostico-profundo', 'diagnostico', 'Pessoas que sentem câimbras, fadiga muscular, ou desidratação', 'Para leads que mencionam câimbras, fadiga, ou praticam exercícios intensos', 'Tenho um diagnóstico que avalia seus níveis de eletrólitos. Quer testar?', 14),
('diagnostico-sintomas-intestinais', 'Diagnóstico de Sintomas Intestinais', 'diagnostico-profundo', 'diagnostico', 'Pessoas com problemas digestivos, intestino preso, ou desconforto abdominal', 'Para leads que mencionam problemas digestivos, intestino, ou desconforto abdominal', 'Tenho um diagnóstico que avalia sintomas intestinais. Quer fazer?', 15),
('teste-retencao-liquidos', 'Teste de Retenção de Líquidos', 'diagnostico-profundo', 'diagnostico', 'Pessoas que sentem inchaço, retenção, ou dificuldade de perder peso', 'Para leads que mencionam inchaço, retenção, ou dificuldade de perder peso', 'Tenho um teste que identifica se você retém líquidos. Quer fazer?', 16),
('risco-sindrome-metabolica', 'Risco de Síndrome Metabólica', 'diagnostico-profundo', 'diagnostico', 'Pessoas com fatores de risco para síndrome metabólica', 'Para leads que mencionam pressão alta, glicemia, ou histórico familiar', 'Tenho uma avaliação que identifica risco de síndrome metabólica. Quer testar?', 17),
('quiz-detox', 'Quiz Detox', 'diagnostico-profundo', 'diagnostico', 'Pessoas que querem avaliar necessidade de desintoxicação', 'Para leads que mencionam cansaço, pele ruim, ou querem limpar o organismo', 'Tenho um quiz que avalia se você precisa de um detox. Quer fazer?', 18),
('quiz-tipo-fome', 'Quiz de Tipo de Fome', 'diagnostico-profundo', 'diagnostico', 'Pessoas que querem entender seus tipos de fome', 'Para leads que mencionam fome constante, dificuldade de controle, ou comer demais', 'Tenho um quiz que identifica seus tipos de fome. Quer testar?', 19),
('pronto-emagrecer-saude', 'Pronto para Emagrecer com Saúde?', 'diagnostico-profundo', 'diagnostico', 'Pessoas que querem emagrecer de forma saudável e sustentável', 'Para leads que mencionam querer emagrecer, perder peso, ou melhorar composição corporal', 'Tenho um questionário que avalia se você está pronto para emagrecer com saúde. Quer fazer?', 20),
('quiz-interativo', 'Quiz Interativo', 'diagnostico-profundo', 'engajamento', 'Pessoas que querem uma experiência interativa de diagnóstico', 'Para leads que gostam de interatividade e querem uma experiência diferente', 'Tenho um quiz interativo personalizado. Quer testar?', 21)
ON CONFLICT (codigo) DO NOTHING;

-- CATEGORIA 3: TRANSFORMAÇÃO/DESAFIOS (2 links)
INSERT INTO wellness_links (codigo, nome, categoria, objetivo, publico_alvo, quando_usar, script_curto, ordem) VALUES
('desafio-7-dias', 'Desafio 7 Dias', 'transformacao-desafios', 'engajamento', 'Pessoas que querem um desafio curto e transformador', 'Para leads quentes que demonstraram interesse em mudança e estão prontos para ação', 'Tenho um desafio de 7 dias que pode transformar seus hábitos. Quer participar?', 22),
('desafio-21-dias', 'Desafio 21 Dias', 'transformacao-desafios', 'engajamento', 'Pessoas que querem um desafio completo para formar hábitos', 'Para leads quentes que querem uma transformação mais profunda e estão comprometidos', 'Tenho um desafio de 21 dias para formar hábitos duradouros. Quer participar?', 23)
ON CONFLICT (codigo) DO NOTHING;

-- CATEGORIA 4: OPORTUNIDADE DE NEGÓCIO (14 links)
INSERT INTO wellness_links (codigo, nome, categoria, objetivo, publico_alvo, quando_usar, script_curto, ordem) VALUES
('renda-extra-imediata', 'Renda Extra Imediata', 'oportunidade-negocio', 'recrutamento', 'Pessoas que precisam de renda extra urgente', 'Para leads que mencionam necessidade financeira, dívidas, ou querem complementar renda', 'Tenho uma oportunidade de renda extra que pode começar hoje. Quer conhecer?', 24),
('maes-trabalhar-casa', 'Mães que Querem Trabalhar de Casa', 'oportunidade-negocio', 'recrutamento', 'Mães que querem trabalhar de casa e ter flexibilidade', 'Para mães que mencionam querer trabalhar de casa, ter flexibilidade, ou estar com filhos', 'Tenho uma oportunidade perfeita para mães trabalharem de casa. Quer conhecer?', 25),
('ja-consome-produtos-bem-estar', 'Já Consome Produtos de Bem-estar', 'oportunidade-negocio', 'recrutamento', 'Pessoas que já consomem produtos de bem-estar e podem transformar em renda', 'Para leads que já consomem produtos de bem-estar e mencionam interesse em negócio', 'Você já consome produtos de bem-estar? Que tal transformar isso em renda?', 26),
('trabalhar-apenas-links', 'Trabalhar Apenas com Links (Sem Estoque)', 'oportunidade-negocio', 'recrutamento', 'Pessoas que querem trabalhar de forma digital sem estoque', 'Para leads que mencionam querer trabalhar online, sem estoque, ou de forma digital', 'Tenho uma forma de trabalhar apenas com links, sem precisar de estoque. Quer conhecer?', 27),
('ja-usa-energia-acelera', 'Já Usa Energia e Acelera', 'oportunidade-negocio', 'recrutamento', 'Pessoas que já usam produtos Energia ou Acelera', 'Para leads que já consomem produtos da marca e demonstraram satisfação', 'Você já usa nossos produtos? Que tal transformar isso em uma oportunidade de negócio?', 28),
('cansadas-insatisfeitas-trabalho', 'Cansadas/Insatisfeitas no Trabalho Atual', 'oportunidade-negocio', 'recrutamento', 'Pessoas insatisfeitas com trabalho atual', 'Para leads que mencionam insatisfação no trabalho, burnout, ou querem mudança', 'Você está insatisfeita com seu trabalho atual? Tenho uma alternativa. Quer conhecer?', 29),
('ja-tentaram-outros-negocios', 'Já Tentaram Outros Negócios', 'oportunidade-negocio', 'recrutamento', 'Pessoas que já tentaram outros negócios e querem uma nova oportunidade', 'Para leads que mencionam ter tentado outros negócios, MLM, ou querem uma nova chance', 'Você já tentou outros negócios? Tenho uma oportunidade diferente. Quer conhecer?', 30),
('querem-trabalhar-digital-online', 'Querem Trabalhar Só Digital/Online', 'oportunidade-negocio', 'recrutamento', 'Pessoas que querem trabalhar apenas de forma digital', 'Para leads que mencionam querer trabalhar online, digital, ou remotamente', 'Tenho uma oportunidade 100% digital e online. Quer conhecer?', 31),
('ja-empreendem', 'Já Empreendem (Salões, Clínicas, Lojas)', 'oportunidade-negocio', 'recrutamento', 'Empreendedores que querem adicionar nova linha de produtos', 'Para leads que já têm negócio próprio e querem adicionar nova linha de produtos', 'Você já tem um negócio? Que tal adicionar uma linha de produtos de bem-estar?', 32),
('querem-emagrecer-renda-extra', 'Querem Emagrecer + Renda Extra', 'oportunidade-negocio', 'recrutamento', 'Pessoas que querem emagrecer e ganhar renda ao mesmo tempo', 'Para leads que mencionam querer emagrecer e também precisam de renda extra', 'Que tal emagrecer e ganhar renda extra ao mesmo tempo? Quer conhecer?', 33),
('boas-venda-comunicativas', 'Boas de Venda/Comunicativas', 'oportunidade-negocio', 'recrutamento', 'Pessoas com perfil de vendedor ou comunicativo', 'Para leads que demonstram facilidade de comunicação, vendas, ou relacionamento', 'Você é boa de venda? Tenho uma oportunidade perfeita para seu perfil. Quer conhecer?', 34),
('desempregadas-sem-renda', 'Desempregadas/Sem Renda/Transição', 'oportunidade-negocio', 'recrutamento', 'Pessoas desempregadas ou em transição de carreira', 'Para leads que mencionam estar desempregadas, sem renda, ou em transição', 'Você está em busca de uma nova oportunidade? Tenho algo que pode te interessar. Quer conhecer?', 35),
('transformar-consumo-renda', 'Transformar o Próprio Consumo em Renda', 'oportunidade-negocio', 'recrutamento', 'Pessoas que já consomem e querem transformar em negócio', 'Para leads que já consomem produtos e demonstraram interesse em transformar em renda', 'Você já consome nossos produtos? Que tal transformar seu consumo em renda?', 36),
('jovens-empreendedores', 'Jovens Empreendedores/Começar Cedo', 'oportunidade-negocio', 'recrutamento', 'Jovens que querem começar a empreender cedo', 'Para leads jovens que demonstram interesse em empreendedorismo ou começar cedo', 'Você quer começar a empreender cedo? Tenho uma oportunidade para jovens. Quer conhecer?', 37)
ON CONFLICT (codigo) DO NOTHING;

-- ============================================
-- PARTE 3: INSERIR TREINOS (35 treinos)
-- ============================================

-- TREINOS DE 1 MINUTO (15 treinos)
INSERT INTO wellness_treinos (codigo, tipo, titulo, conceito, exemplo_pratico, acao_diaria, gatilho_noel, ordem) VALUES
('treino-1min-01', '1min', 'O Poder do Primeiro Passo', 'O primeiro passo é sempre o mais difícil, mas também o mais importante. Não precisa ser perfeito, só precisa ser dado.', 'Em vez de pensar em "preciso fazer 10 convites", pense "vou fazer 1 convite agora".', 'Faça 1 ação agora, mesmo que pequena. Pode ser 1 mensagem, 1 link enviado, 1 contato.', 'Quando distribuidor está procrastinando ou travado no início do dia', 1),
('treino-1min-02', '1min', 'O Simples Funciona', 'Sistemas complexos falham. O que funciona é o simples feito consistentemente.', 'Em vez de criar 10 estratégias diferentes, use 1 estratégia 10 vezes.', 'Escolha 1 script e use ele hoje. Não mude, só execute.', 'Quando distribuidor está complicando demais ou buscando soluções complexas', 2),
('treino-1min-03', '1min', 'Não Pare 2 Dias Seguidos', 'Consistência não é fazer todo dia. É não parar 2 dias seguidos.', 'Se você parou hoje, amanhã precisa voltar. Não deixe passar 2 dias.', 'Se você parou ontem, faça algo hoje. Mesmo que seja mínimo.', 'Quando distribuidor parou de agir ou está desanimado', 3),
('treino-1min-04', '1min', 'Você Não Precisa Saber Tudo', 'Você não precisa ser expert para começar. Você aprende fazendo.', 'Não espere saber tudo sobre produtos. Comece vendendo o que você já sabe.', 'Faça 1 ação hoje mesmo sem saber tudo. Você aprende no caminho.', 'Quando distribuidor está travado por falta de conhecimento', 4),
('treino-1min-05', '1min', 'Microvitórias Constroem o Macro', 'Grandes resultados são a soma de pequenas vitórias diárias.', '1 venda hoje + 1 venda amanhã = 2 vendas. Pequeno hoje, grande no mês.', 'Celebre cada pequena vitória. 1 mensagem enviada já é vitória.', 'Quando distribuidor está desanimado por não ver resultados grandes', 5),
('treino-1min-06', '1min', 'Movimento Gera Clareza', 'Ação gera clareza. Você não precisa ter tudo claro para começar.', 'Em vez de planejar por horas, aja por 10 minutos. A clareza vem na ação.', 'Faça 1 ação agora. A clareza do que fazer vem depois.', 'Quando distribuidor está muito tempo planejando sem agir', 6),
('treino-1min-07', '1min', 'Uma Conversa Muda Tudo', 'Uma única conversa pode mudar sua semana. Uma venda, um recruta, uma conexão.', 'A mensagem que você não enviou hoje poderia ser a venda de amanhã.', 'Envie 1 mensagem agora. Pode ser a que muda tudo.', 'Quando distribuidor está hesitando em enviar mensagens', 7),
('treino-1min-08', '1min', 'A Energia Vem da Ação', 'Você não precisa estar motivado para agir. A motivação vem depois da ação.', 'Em vez de esperar motivação, aja. A energia vem quando você começa.', 'Faça 1 ação agora, mesmo sem vontade. A energia vem depois.', 'Quando distribuidor está sem energia ou motivação', 8),
('treino-1min-09', '1min', 'Feito é Melhor que Perfeito', 'Perfeição paralisa. Ação gera resultados.', 'Um script "ok" enviado hoje é melhor que um script "perfeito" que nunca sai.', 'Envie algo hoje, mesmo que não esteja perfeito. Feito é melhor.', 'Quando distribuidor está travado buscando perfeição', 9),
('treino-1min-10', '1min', 'Você Nunca Começa do Zero', 'Cada ação que você fez antes conta. Você não está começando do zero.', 'Mesmo que tenha parado, você já tem experiência, contatos, conhecimento.', 'Lembre-se: você já tem algo. Use isso para começar hoje.', 'Quando distribuidor sente que está começando do zero', 10),
('treino-1min-11', '1min', 'Se Travou, Reduza', 'Se você travou, não force. Reduza a meta e continue.', 'Em vez de 10 convites, faça 2. Em vez de 5 follow-ups, faça 1.', 'Reduza sua meta de hoje pela metade. Continue, mas com menos pressão.', 'Quando distribuidor está travado por metas muito altas', 11),
('treino-1min-12', '1min', 'Confie no Sistema', 'O sistema funciona. Você só precisa executar consistentemente.', 'O 2-5-10 funciona. Os Links Wellness funcionam. Só execute.', 'Use o sistema hoje. Não invente, só execute o que já funciona.', 'Quando distribuidor está duvidando do sistema ou querendo inventar', 12),
('treino-1min-13', '1min', 'Seu Ritmo Cria Seu Resultado', 'Não importa o ritmo dos outros. Seu ritmo constante cria seus resultados.', '1 ação por dia por 30 dias é melhor que 30 ações em 1 dia e depois parar.', 'Mantenha seu ritmo hoje. Não precisa ser o mais rápido, só consistente.', 'Quando distribuidor está se comparando com outros', 13),
('treino-1min-14', '1min', 'Avance Mesmo Sem Vontade', 'Dias sem vontade são normais. Avance mesmo assim.', 'Você não precisa estar animado para agir. Ação gera animação.', 'Faça 1 ação hoje mesmo sem vontade. A vontade vem depois.', 'Quando distribuidor está sem vontade ou desanimado', 14),
('treino-1min-15', '1min', 'Você Está Criando Sua Própria Liberdade', 'Cada ação hoje é um passo em direção à sua liberdade financeira.', '1 venda hoje + 1 recruta esta semana = você está construindo seu futuro.', 'Lembre-se: cada ação hoje constrói sua liberdade. Continue.', 'Quando distribuidor precisa de motivação de longo prazo', 15)
ON CONFLICT (codigo) DO NOTHING;

-- TREINOS DE 3 MINUTOS (10 treinos)
INSERT INTO wellness_treinos (codigo, tipo, titulo, conceito, exemplo_pratico, acao_diaria, gatilho_noel, ordem) VALUES
('treino-3min-01', '3min', 'Como usar links para abrir conversas', 'Links Wellness são portas de entrada. Use para abrir conversas, não para fechar vendas.', 'Envie um link de curiosidade (ex: Calculadora de Água) e depois pergunte o resultado. Isso abre a conversa naturalmente.', 'Hoje, envie 1 link para alguém e depois pergunte o resultado. Use isso para abrir a conversa.', 'Quando distribuidor não sabe como iniciar conversas', 16),
('treino-3min-02', '3min', 'O método 2-5-10 explicado', '2 convites leves, 5 follow-ups, 10 interações. Isso é o mínimo diário que constrói seu negócio.', '2 convites = 2 links enviados. 5 follow-ups = 5 pessoas que você já abordou. 10 interações = 10 conversas sem intenção comercial.', 'Hoje, faça pelo menos: 2 convites, 5 follow-ups, 10 interações. Anote e complete.', 'Quando distribuidor não entende o método 2-5-10', 17),
('treino-3min-03', '3min', 'Como fazer follow-up sem parecer insistente', 'Follow-up é cuidado, não insistência. Mostre interesse genuíno, não apenas venda.', 'Em vez de "você comprou?", pergunte "como está indo com o produto que te mostrei?". Mostre interesse real.', 'Hoje, faça 1 follow-up genuíno. Pergunte como a pessoa está, não apenas sobre venda.', 'Quando distribuidor está com dificuldade em fazer follow-up', 18),
('treino-3min-04', '3min', 'Como interpretar resultados dos Links Wellness', 'Cada resultado de link mostra uma necessidade. Use isso para personalizar sua abordagem.', 'Se alguém preencheu "Calculadora de Água" e o resultado foi baixo, essa pessoa precisa de hidratação. Ofereça produtos relacionados.', 'Hoje, analise 1 resultado de link que você enviou. O que ele revela sobre a pessoa?', 'Quando distribuidor recebe resultados de links mas não sabe o que fazer', 19),
('treino-3min-05', '3min', 'Como vender sem vender (venda leve)', 'Venda leve é mostrar benefício, não pressionar compra. Conte histórias, mostre resultados, deixe a pessoa querer.', 'Em vez de "compre agora", diga "tenho uma cliente que usou e teve esse resultado. Quer conhecer?".', 'Hoje, faça 1 abordagem de venda leve. Mostre benefício, não pressione.', 'Quando distribuidor está sendo muito direto na venda', 20),
('treino-3min-06', '3min', 'Como identificar um lead quente', 'Lead quente faz perguntas, demonstra interesse, responde rápido. Identifique e priorize.', 'Se alguém pergunta preço, como funciona, ou demonstra interesse real, esse é um lead quente. Priorize esse contato.', 'Hoje, identifique 1 lead quente na sua lista. Priorize esse contato hoje.', 'Quando distribuidor tem muitos contatos mas não sabe priorizar', 21),
('treino-3min-07', '3min', 'Como fazer fechamento leve', 'Fechamento leve é oferecer, não pressionar. Dê opções, mostre facilidade, deixe a pessoa escolher.', 'Em vez de "você vai comprar?", diga "tenho 2 opções para você. Qual faz mais sentido?".', 'Hoje, pratique 1 fechamento leve. Ofereça opções, não pressione.', 'Quando distribuidor está com dificuldade em fechar vendas', 22),
('treino-3min-08', '3min', 'Como recrutar naturalmente', 'Recrutamento natural é mostrar oportunidade, não forçar entrada. Conte sua história, mostre possibilidades.', 'Em vez de "quer entrar no negócio?", diga "eu transformei meu consumo em renda. Quer saber como?".', 'Hoje, faça 1 abordagem de recrutamento natural. Conte sua história, não force.', 'Quando distribuidor quer recrutar mas não sabe como abordar', 23),
('treino-3min-09', '3min', 'Como duplicar usando o NOEL', 'NOEL pode ajudar sua equipe. Ensine seus recrutas a usarem o NOEL para vender e recrutar.', 'Mostre para seu recruta: "usa o NOEL assim para vender" e "usa o NOEL assim para recrutar". Duplique seu conhecimento.', 'Hoje, ensine 1 pessoa da sua equipe a usar o NOEL. Duplique seu conhecimento.', 'Quando distribuidor tem equipe mas não sabe como duplicar', 24),
('treino-3min-10', '3min', 'Como organizar sua semana de vendas', 'Semana organizada = resultados consistentes. Planeje dias para convites, follow-ups, fechamentos.', 'Segunda: planejar. Terça-Quinta: ação. Sexta: fechamentos. Sábado: revisão. Domingo: descanso.', 'Hoje, planeje sua semana: quais dias para convites, follow-ups, fechamentos?', 'Quando distribuidor está desorganizado ou sem planejamento', 25)
ON CONFLICT (codigo) DO NOTHING;

-- TREINOS DE 5 MINUTOS (10 treinos)
INSERT INTO wellness_treinos (codigo, tipo, titulo, conceito, exemplo_pratico, acao_diaria, gatilho_noel, ordem) VALUES
('treino-5min-01', '5min', 'O que realmente constrói um líder', 'Líder não é quem tem mais pessoas, é quem ajuda mais pessoas a terem resultados.', 'Em vez de focar em recrutar muitos, foque em ajudar poucos a terem resultados. Líderes são feitos ajudando, não recrutando.', 'Esta semana, foque em ajudar 1 pessoa da sua equipe a ter resultado. Isso te torna líder.', 'Quando distribuidor quer ser líder mas não sabe como', 26),
('treino-5min-02', '5min', 'Como construir uma equipe forte', 'Equipe forte é feita de pessoas comprometidas, não de muitas pessoas.', 'Melhor ter 3 pessoas comprometidas que 10 pessoas descomprometidas. Qualidade > quantidade.', 'Esta semana, identifique quem está realmente comprometido na sua equipe. Foque neles.', 'Quando distribuidor tem equipe mas não sabe como fortalecer', 27),
('treino-5min-03', '5min', 'Como ativar sua lista quente', 'Lista quente são pessoas que já demonstraram interesse. Ative com Links Wellness e follow-up.', 'Pessoas que já compraram, demonstraram interesse, ou são próximas = lista quente. Envie links e faça follow-up.', 'Hoje, identifique 5 pessoas da sua lista quente. Envie 1 link para cada e faça follow-up.', 'Quando distribuidor tem lista mas não sabe como ativar', 28),
('treino-5min-04', '5min', 'Como crescer com consistência e leveza', 'Crescimento consistente é melhor que crescimento rápido. Leveza é melhor que pressão.', '1 venda por semana por 1 ano = 52 vendas. Melhor que 10 vendas em 1 mês e depois parar.', 'Esta semana, foque em consistência. 1 ação por dia, sem pressão, sem estresse.', 'Quando distribuidor está pressionado ou estressado', 29),
('treino-5min-05', '5min', 'Como agir mesmo nos dias ruins', 'Dias ruins são normais. A diferença é que líderes agem mesmo nos dias ruins.', 'Mesmo sem vontade, faça 1 ação mínima. 1 mensagem, 1 link, 1 follow-up. Isso mantém o momentum.', 'Hoje, mesmo que esteja difícil, faça 1 ação mínima. Mantenha o momentum.', 'Quando distribuidor está tendo um dia ruim', 30),
('treino-5min-06', '5min', 'Como virar referência para sua equipe', 'Referência é quem tem resultados e ajuda outros a terem. Seja exemplo, não apenas chefe.', 'Em vez de mandar outros fazerem, faça você primeiro. Mostre resultados, depois ensine.', 'Esta semana, tenha 1 resultado pessoal (venda ou recruta) e depois ensine sua equipe a fazer igual.', 'Quando distribuidor quer ser referência mas não sabe como', 31),
('treino-5min-07', '5min', 'Como entender a filosofia YLADA', 'YLADA é sobre transformação através de bem-estar. Não é só vender, é transformar vidas.', 'Cada produto que você vende pode transformar uma vida. Cada recruta que você traz pode transformar uma família.', 'Hoje, lembre-se: você não está só vendendo, está transformando vidas. Isso dá propósito.', 'Quando distribuidor precisa de propósito ou significado', 32),
('treino-5min-08', '5min', 'Como trabalhar com metas semanais', 'Metas semanais são mais alcançáveis que mensais. Quebre grandes metas em pequenas semanas.', 'Em vez de "vou vender 10 este mês", pense "vou vender 2-3 esta semana". Mais alcançável.', 'Esta semana, defina 1 meta pequena e alcançável. Foque nela.', 'Quando distribuidor está com metas muito grandes ou desanimado', 33),
('treino-5min-09', '5min', 'Como usar a energia emocional ao seu favor', 'Emoções são energia. Use a energia positiva para vender, e transforme a negativa em ação.', 'Se está animado, use para vender. Se está desanimado, use para fazer follow-up (ação que não precisa de animação).', 'Hoje, identifique sua energia emocional. Use ela estrategicamente para suas ações.', 'Quando distribuidor está com emoções fortes (positivas ou negativas)', 34),
('treino-5min-10', '5min', 'Como criar um mês explosivo', 'Mês explosivo é feito de semanas consistentes. Não espere o mês, construa semana a semana.', 'Semana 1: base. Semana 2: aceleração. Semana 3: fechamentos. Semana 4: resultados. Construa semana a semana.', 'Esta semana, foque em construir a base. Próxima semana, acelere. Mês explosivo vem depois.', 'Quando distribuidor quer resultados rápidos ou está impaciente', 35)
ON CONFLICT (codigo) DO NOTHING;

-- ============================================
-- PARTE 4: VERIFICAÇÃO
-- ============================================

-- Verificar Links Wellness
SELECT 
  'Links Wellness' as tabela,
  COUNT(*) as total,
  COUNT(CASE WHEN categoria = 'saude-bem-estar' THEN 1 END) as saude_bem_estar,
  COUNT(CASE WHEN categoria = 'diagnostico-profundo' THEN 1 END) as diagnostico_profundo,
  COUNT(CASE WHEN categoria = 'transformacao-desafios' THEN 1 END) as transformacao_desafios,
  COUNT(CASE WHEN categoria = 'oportunidade-negocio' THEN 1 END) as oportunidade_negocio
FROM wellness_links;

-- Verificar Treinos
SELECT 
  'Treinos' as tabela,
  COUNT(*) as total,
  COUNT(CASE WHEN tipo = '1min' THEN 1 END) as um_minuto,
  COUNT(CASE WHEN tipo = '3min' THEN 1 END) as tres_minutos,
  COUNT(CASE WHEN tipo = '5min' THEN 1 END) as cinco_minutos
FROM wellness_treinos;

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE '✅ Execução completa!';
  RAISE NOTICE '✅ Tabelas criadas: wellness_links, wellness_treinos';
  RAISE NOTICE '✅ 37 Links Wellness inseridos';
  RAISE NOTICE '✅ 35 Treinos inseridos';
  RAISE NOTICE '✅ Pronto para uso!';
END $$;
