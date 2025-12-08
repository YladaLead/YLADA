-- ============================================
-- SEED: Scripts Oficiais Wellness
-- Baseado nas Lousas 3, 4, 5, 6
-- ============================================

-- Limpar dados existentes (opcional - descomente se necessário)
-- TRUNCATE TABLE wellness_scripts CASCADE;

-- ============================================
-- SCRIPTS DE CONVITE LEVE (Lousa 3)
-- ============================================

INSERT INTO wellness_scripts (codigo, titulo, descricao, categoria, texto, variacoes, tags) VALUES
('convite-leve-classico', 'Convite Leve Clássico', 'Convite leve padrão para qualquer situação', 'convite', 
'Oi [nome]! Lembrei de você hoje e queria te contar sobre uma novidade de bem-estar que pode te interessar. Posso te contar rapidinho?',
'{"var1": "Oi [nome]! Lembrei de você hoje e queria te contar sobre algo que pode te ajudar. Posso te contar rapidinho?", "var2": "Oi [nome]! Tenho uma novidade que pode te interessar. Posso te contar?"}'::jsonb,
ARRAY['convite', 'leve', 'classico']),

('convite-leve-curiosidade', 'Convite Leve de Curiosidade', 'Convite que desperta curiosidade', 'convite',
'Oi [nome]! Tenho algo interessante para te mostrar. É rápido e pode te ajudar bastante. Quer ver?',
'{"var1": "Oi [nome]! Tenho algo que pode te interessar. Quer conhecer?", "var2": "Oi [nome]! Tenho uma surpresa para você. Quer ver?"}'::jsonb,
ARRAY['convite', 'leve', 'curiosidade']),

('convite-leve-com-link', 'Convite Leve com Link Wellness', 'Convite incluindo um link wellness', 'convite',
'Oi [nome]! Tenho uma calculadora/quiz que pode te ajudar. Quer testar? [link]',
'{"var1": "Oi [nome]! Tenho um teste rápido que pode te interessar. Quer fazer? [link]", "var2": "Oi [nome]! Tenho algo legal para você testar. Quer ver? [link]"}'::jsonb,
ARRAY['convite', 'leve', 'link', 'wellness']),

('convite-leve-frios', 'Convite Leve para Leads Frios', 'Convite para pessoas que você não fala há tempo', 'convite',
'Oi [nome]! Faz tempo que não conversamos, né? Lembrei de você hoje e queria te contar sobre algo que pode te interessar. Posso te contar?',
'{"var1": "Oi [nome]! Faz tempo! Lembrei de você e queria te mostrar algo. Posso?", "var2": "Oi [nome]! Faz tempo que não falamos. Tenho algo para te contar. Posso?"}'::jsonb,
ARRAY['convite', 'leve', 'frios', 'reativacao']),

('convite-leve-proximos', 'Convite Leve para Pessoas Próximas', 'Convite para pessoas próximas (amigos, família)', 'convite',
'Oi [nome]! Você sabe que eu sempre penso em você, né? Tenho algo que pode te ajudar e queria te mostrar. Posso?',
'{"var1": "Oi [nome]! Lembrei de você e tenho algo legal para te mostrar. Quer ver?", "var2": "Oi [nome]! Tenho uma novidade que pode te interessar. Quer conhecer?"}'::jsonb,
ARRAY['convite', 'leve', 'proximos', 'familia']),

('convite-leve-espiritual', 'Convite Leve Espiritual/Suave', 'Convite com tom espiritual e suave', 'convite',
'Oi [nome]! Senti que você pode estar precisando de algo assim. Tenho uma forma leve de te ajudar. Posso te contar?',
'{"var1": "Oi [nome]! Senti que você pode gostar disso. Quer conhecer?", "var2": "Oi [nome]! Tenho algo que pode te fazer bem. Quer ver?"}'::jsonb,
ARRAY['convite', 'leve', 'espiritual', 'suave']),

('convite-leve-dor-beneficio', 'Convite Leve com Dor/Benefício', 'Convite que toca na dor ou benefício', 'convite',
'Oi [nome]! Sei que você [dor/necessidade]. Tenho algo que pode te ajudar com isso. Quer conhecer?',
'{"var1": "Oi [nome]! Sei que você quer [beneficio]. Tenho algo que pode te ajudar. Quer ver?", "var2": "Oi [nome]! Tenho uma solução para [dor]. Quer conhecer?"}'::jsonb,
ARRAY['convite', 'leve', 'dor', 'beneficio']),

('convite-leve-negocio', 'Convite Leve para Negócio', 'Convite focado em oportunidade de negócio', 'convite',
'Oi [nome]! Tenho uma oportunidade que pode te interessar. É algo que você pode fazer de casa e pode gerar uma renda extra. Quer conhecer?',
'{"var1": "Oi [nome]! Tenho uma forma de você ganhar uma renda extra trabalhando de casa. Quer conhecer?", "var2": "Oi [nome]! Tenho uma oportunidade de negócio que pode te interessar. Posso te contar?"}'::jsonb,
ARRAY['convite', 'leve', 'negocio', 'renda']);

-- ============================================
-- SCRIPTS DE FOLLOW-UP (Lousa 2)
-- ============================================

INSERT INTO wellness_scripts (codigo, titulo, descricao, categoria, texto, variacoes, tags) VALUES
('follow-up-1', 'Follow-up Genuíno', 'Follow-up mostrando interesse real', 'follow-up',
'Oi [nome]! Como você está? Lembrei de você e queria saber como está indo. Tudo bem?',
'{"var1": "Oi [nome]! Como está? Queria saber como você está.", "var2": "Oi [nome]! Faz tempo que não conversamos. Como está?"}'::jsonb,
ARRAY['follow-up', 'genuino', 'interesse']),

('follow-up-link', 'Follow-up Após Link', 'Follow-up após enviar link wellness', 'follow-up',
'Oi [nome]! Você conseguiu fazer o teste/calculadora que te enviei? O que achou do resultado?',
'{"var1": "Oi [nome]! Você fez o teste? Queria saber o que achou.", "var2": "Oi [nome]! Como foi o resultado do teste que te enviei?"}'::jsonb,
ARRAY['follow-up', 'link', 'teste']),

('follow-up-produto', 'Follow-up Após Apresentar Produto', 'Follow-up após apresentar produto', 'follow-up',
'Oi [nome]! Você pensou sobre o produto que te mostrei? Tem alguma dúvida?',
'{"var1": "Oi [nome]! Você teve tempo de pensar sobre o produto? Tem alguma dúvida?", "var2": "Oi [nome]! Queria saber se você tem alguma dúvida sobre o produto."}'::jsonb,
ARRAY['follow-up', 'produto', 'venda']),

('follow-up-apresentacao', 'Follow-up Após Apresentação', 'Follow-up após apresentação de negócio', 'follow-up',
'Oi [nome]! Você assistiu a apresentação? O que achou? Tem alguma dúvida?',
'{"var1": "Oi [nome]! Como foi a apresentação? Queria saber sua opinião.", "var2": "Oi [nome]! Você assistiu? Queria saber o que achou."}'::jsonb,
ARRAY['follow-up', 'apresentacao', 'negocio']),

('follow-up-sutil', 'Follow-up Sutil', 'Follow-up muito sutil, sem pressão', 'follow-up',
'Oi [nome]! Só passando para ver como você está. Tudo bem?',
'{"var1": "Oi [nome]! Só queria saber se está tudo bem.", "var2": "Oi [nome]! Como você está? Só passando para ver."}'::jsonb,
ARRAY['follow-up', 'sutil', 'sem-pressao']);

-- ============================================
-- SCRIPTS DE VENDAS - ENERGIA (Lousa 4)
-- ============================================

INSERT INTO wellness_scripts (codigo, titulo, descricao, categoria, texto, variacoes, tags) VALUES
('venda-energia-emocional', 'Venda Energia - Emocional', 'Venda de Energia focada em emoção', 'fechamento',
'[nome], imagina você com energia para fazer tudo que precisa e ainda sobrar energia para você? O Energia te dá isso. É como ter uma bateria que nunca acaba. Quer experimentar?',
'{"var1": "[nome], você já pensou como seria ter energia o dia todo? O Energia pode te dar isso.", "var2": "[nome], imagina acordar com energia e manter ela o dia todo. O Energia faz isso."}'::jsonb,
ARRAY['venda', 'energia', 'nrg', 'emocional']),

('venda-energia-racional', 'Venda Energia - Racional', 'Venda de Energia focada em benefícios técnicos', 'fechamento',
'[nome], o Energia tem cafeína natural, vitaminas do complexo B e taurina. Isso te dá energia sustentada, sem picos e quedas. Quer conhecer?',
'{"var1": "[nome], o Energia tem ingredientes que te dão energia de forma natural e sustentada.", "var2": "[nome], o Energia é formulado para te dar energia sem os efeitos colaterais do café."}'::jsonb,
ARRAY['venda', 'energia', 'nrg', 'racional', 'tecnico']),

('venda-energia-rapida', 'Venda Energia - Rápida', 'Venda de Energia rápida e direta', 'fechamento',
'[nome], Energia = mais energia no seu dia. Quer experimentar?',
'{"var1": "[nome], Energia te dá energia. Quer testar?", "var2": "[nome], precisa de energia? Energia resolve. Quer conhecer?"}'::jsonb,
ARRAY['venda', 'energia', 'nrg', 'rapida']);

-- ============================================
-- SCRIPTS DE VENDAS - ACELERA (Lousa 4)
-- ============================================

INSERT INTO wellness_scripts (codigo, titulo, descricao, categoria, texto, variacoes, tags) VALUES
('venda-acelera-emocional', 'Venda Acelera - Emocional', 'Venda de Acelera focada em emoção', 'fechamento',
'[nome], imagina você acelerando seu metabolismo de forma natural e saudável? O Acelera faz isso. É como ter um turbo no seu corpo. Quer experimentar?',
'{"var1": "[nome], você já pensou em acelerar seu metabolismo naturalmente? O Acelera faz isso.", "var2": "[nome], imagina seu corpo funcionando mais rápido e queimando mais. O Acelera te dá isso."}'::jsonb,
ARRAY['venda', 'acelera', 'metabolismo', 'emocional']),

('venda-acelera-racional', 'Venda Acelera - Racional', 'Venda de Acelera focada em benefícios técnicos', 'fechamento',
'[nome], o Acelera tem ingredientes que aceleram seu metabolismo de forma natural. Isso te ajuda a queimar mais calorias e ter mais energia. Quer conhecer?',
'{"var1": "[nome], o Acelera tem componentes que aceleram seu metabolismo de forma saudável.", "var2": "[nome], o Acelera é formulado para acelerar seu metabolismo naturalmente."}'::jsonb,
ARRAY['venda', 'acelera', 'metabolismo', 'racional', 'tecnico']);

-- ============================================
-- SCRIPTS DE OBJEÇÕES (Lousa 5)
-- ============================================

INSERT INTO wellness_scripts (codigo, titulo, descricao, categoria, texto, variacoes, tags) VALUES
('objecao-muito-caro', 'Objeção: Muito Caro', 'Resposta para objeção de preço', 'objecao',
'Entendo, [nome]. O investimento pode parecer alto, mas quando você pensa que é para sua saúde e bem-estar, vale muito a pena. Além disso, você pode começar com o kit menor. Quer ver as opções?',
'{"var1": "Entendo sua preocupação, [nome]. Mas pense: quanto você gasta com coisas que não te fazem bem? Este investimento é na sua saúde.", "var2": "[nome], entendo. Mas você pode começar com um investimento menor e ver os resultados."}'::jsonb,
ARRAY['objecao', 'preco', 'caro']),

('objecao-nao-acredito', 'Objeção: Não Acredito', 'Resposta para objeção de descrença', 'objecao',
'Entendo, [nome]. É normal ter essa dúvida. Que tal você experimentar e ver os resultados? Tenho vários clientes que também duvidavam e hoje são os maiores fãs. Quer conhecer algumas histórias?',
'{"var1": "[nome], entendo sua dúvida. Que tal você testar e ver? Tenho resultados reais para te mostrar.", "var2": "[nome], é normal duvidar. Mas os resultados falam por si. Quer ver?"}'::jsonb,
ARRAY['objecao', 'crenca', 'duvida']),

('objecao-nao-tempo', 'Objeção: Não Tenho Tempo', 'Resposta para objeção de falta de tempo', 'objecao',
'Entendo, [nome]. Você tem uma rotina corrida. Por isso mesmo que nossos produtos são práticos - você só precisa tomar. Não precisa preparar nada, não precisa mudar sua rotina. Quer ver como é simples?',
'{"var1": "[nome], entendo que você está sem tempo. Por isso nossos produtos são práticos - só tomar e pronto.", "var2": "[nome], você não precisa de tempo extra. Só tomar e pronto. Quer ver?"}'::jsonb,
ARRAY['objecao', 'tempo', 'rotina']),

('objecao-ja-tentei', 'Objeção: Já Tentei Outras Coisas', 'Resposta para objeção de já ter tentado', 'objecao',
'Entendo, [nome]. Você já tentou outras coisas. O que fazemos diferente é que nossos produtos são naturais, sem químicos pesados, e você tem acompanhamento. Quer ver a diferença?',
'{"var1": "[nome], entendo que você já tentou. Mas nossos produtos são diferentes - naturais e com acompanhamento.", "var2": "[nome], você já tentou outras coisas, mas esta é diferente. Quer conhecer a diferença?"}'::jsonb,
ARRAY['objecao', 'tentou', 'outros']),

('objecao-pensar', 'Objeção: Preciso Pensar', 'Resposta para objeção de precisar pensar', 'objecao',
'Claro, [nome]. É importante pensar. Enquanto você pensa, que tal você experimentar com um investimento menor? Assim você vê os resultados e decide. Quer ver as opções?',
'{"var1": "[nome], entendo que você precisa pensar. Que tal começar pequeno e ver os resultados?", "var2": "[nome], é bom pensar. Mas você pode experimentar primeiro. Quer ver?"}'::jsonb,
ARRAY['objecao', 'pensar', 'duvida']);

-- ============================================
-- SCRIPTS DE RECRUTAMENTO (Lousa 5)
-- ============================================

INSERT INTO wellness_scripts (codigo, titulo, descricao, categoria, texto, variacoes, tags) VALUES
('recrutamento-inicial', 'Recrutamento Inicial', 'Abordagem inicial para recrutamento', 'apresentacao',
'[nome], você já pensou em transformar seu consumo em renda? Eu faço isso e queria te mostrar como. É uma forma de você ganhar uma renda extra trabalhando de casa. Quer conhecer?',
'{"var1": "[nome], você já pensou em ganhar uma renda extra de forma simples? Queria te mostrar como.", "var2": "[nome], tenho uma forma de você ganhar renda trabalhando de casa. Quer conhecer?"}'::jsonb,
ARRAY['recrutamento', 'inicial', 'renda']),

('recrutamento-apresentacao', 'Recrutamento com Apresentação', 'Convite para assistir apresentação', 'apresentacao',
'[nome], tenho uma apresentação rápida que mostra como funciona. São só alguns minutos e pode te interessar. Quer assistir?',
'{"var1": "[nome], tenho um vídeo rápido que explica tudo. Quer ver?", "var2": "[nome], tenho uma apresentação que pode te interessar. Quer assistir?"}'::jsonb,
ARRAY['recrutamento', 'apresentacao', 'video']),

('recrutamento-historia', 'Recrutamento com História Pessoal', 'Recrutamento contando história pessoal', 'apresentacao',
'[nome], eu também não acreditava no início. Mas comecei e hoje estou transformando minha vida. Queria te mostrar como você também pode. Quer conhecer minha história?',
'{"var1": "[nome], eu comecei assim como você. Hoje estou transformando minha vida. Quer saber como?", "var2": "[nome], minha vida mudou quando comecei. Queria te mostrar como você também pode."}'::jsonb,
ARRAY['recrutamento', 'historia', 'pessoal']);

-- ============================================
-- SCRIPTS DE ONBOARDING (Lousa 6)
-- ============================================

INSERT INTO wellness_scripts (codigo, titulo, descricao, categoria, texto, variacoes, tags) VALUES
('onboarding-cliente-dia1', 'Onboarding Cliente - Dia 1', 'Boas-vindas para novo cliente', 'onboarding',
'Olá [nome]! Seja muito bem-vindo(a)! Fico feliz que você escolheu cuidar da sua saúde conosco. Hoje vou te enviar um link inicial para você conhecer melhor seus hábitos. Quer fazer?',
'{"var1": "Olá [nome]! Bem-vindo(a)! Vamos começar sua jornada de bem-estar. Tenho algo para você.", "var2": "[nome], seja bem-vindo(a)! Estou aqui para te ajudar. Vamos começar?"}'::jsonb,
ARRAY['onboarding', 'cliente', 'dia1', 'boas-vindas']),

('onboarding-distribuidor-dia1', 'Onboarding Distribuidor - Dia 1', 'Boas-vindas para novo distribuidor', 'onboarding',
'Olá [nome]! Seja muito bem-vindo(a) à equipe! Estou animado(a) para te ajudar a construir seu negócio. Hoje vou te ensinar o método 2-5-10, que é a base de tudo. Pronto para começar?',
'{"var1": "[nome], bem-vindo(a) à equipe! Vamos começar sua jornada de sucesso. Hoje te ensino o básico.", "var2": "[nome], seja bem-vindo(a)! Estou aqui para te ajudar a ter sucesso. Vamos começar?"}'::jsonb,
ARRAY['onboarding', 'distribuidor', 'dia1', 'boas-vindas']);

-- Verificar inserção
SELECT COUNT(*) as total_scripts, categoria, COUNT(*) as por_categoria 
FROM wellness_scripts 
GROUP BY categoria 
ORDER BY categoria;
