-- ============================================
-- SEED: Links Wellness (37 links oficiais)
-- Baseado na Lousa 1 - Catálogo Oficial dos Links Wellness
-- ============================================

-- Limpar dados existentes (opcional - descomente se necessário)
-- TRUNCATE TABLE wellness_links CASCADE;

-- ============================================
-- CATEGORIA 1: SAÚDE E BEM-ESTAR (10 links)
-- ============================================

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
('alimentacao-conforme-rotina', 'Você está se alimentando conforme sua rotina?', 'saude-bem-estar', 'diagnostico', 'Pessoas com rotina corrida que querem otimizar alimentação', 'Para leads que mencionam rotina corrida, falta de tempo, ou alimentação desorganizada', 'Tenho um questionário que avalia se sua alimentação está alinhada com sua rotina. Quer fazer?', 10);

-- ============================================
-- CATEGORIA 2: DIAGNÓSTICO PROFUNDO (11 links)
-- ============================================

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
('quiz-interativo', 'Quiz Interativo', 'diagnostico-profundo', 'engajamento', 'Pessoas que querem uma experiência interativa de diagnóstico', 'Para leads que gostam de interatividade e querem uma experiência diferente', 'Tenho um quiz interativo personalizado. Quer testar?', 21);

-- ============================================
-- CATEGORIA 3: TRANSFORMAÇÃO/DESAFIOS (2 links)
-- ============================================

INSERT INTO wellness_links (codigo, nome, categoria, objetivo, publico_alvo, quando_usar, script_curto, ordem) VALUES
('desafio-7-dias', 'Desafio 7 Dias', 'transformacao-desafios', 'engajamento', 'Pessoas que querem um desafio curto e transformador', 'Para leads quentes que demonstraram interesse em mudança e estão prontos para ação', 'Tenho um desafio de 7 dias que pode transformar seus hábitos. Quer participar?', 22),
('desafio-21-dias', 'Desafio 21 Dias', 'transformacao-desafios', 'engajamento', 'Pessoas que querem um desafio completo para formar hábitos', 'Para leads quentes que querem uma transformação mais profunda e estão comprometidos', 'Tenho um desafio de 21 dias para formar hábitos duradouros. Quer participar?', 23);

-- ============================================
-- CATEGORIA 4: OPORTUNIDADE DE NEGÓCIO (14 links)
-- ============================================

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
('jovens-empreendedores', 'Jovens Empreendedores/Começar Cedo', 'oportunidade-negocio', 'recrutamento', 'Jovens que querem começar a empreender cedo', 'Para leads jovens que demonstram interesse em empreendedorismo ou começar cedo', 'Você quer começar a empreender cedo? Tenho uma oportunidade para jovens. Quer conhecer?', 37);

-- Verificar inserção
SELECT COUNT(*) as total_links, categoria, COUNT(*) as por_categoria 
FROM wellness_links 
GROUP BY categoria 
ORDER BY categoria;
