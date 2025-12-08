-- ============================================
-- SEED: Scripts Oficiais Wellness (CORRIGIDO)
-- Baseado nas Lousas 3, 4, 5, 6
-- Estrutura compatível com migration 001
-- Usa INSERT ... ON CONFLICT para evitar duplicatas
-- ============================================

-- ============================================
-- SCRIPTS DE CONVITE LEVE (Lousa 3)
-- ============================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem) VALUES
('convite', 'leve', 'Convite Leve Clássico', 'padrao', 
'Oi [nome]! Lembrei de você hoje e queria te contar sobre uma novidade de bem-estar que pode te interessar. Posso te contar rapidinho?',
ARRAY['convite', 'leve', 'classico'], 1),

('convite', 'leve', 'Convite Leve de Curiosidade', 'padrao',
'Oi [nome]! Tenho algo interessante para te mostrar. É rápido e pode te ajudar bastante. Quer ver?',
ARRAY['convite', 'leve', 'curiosidade'], 2),

('convite', 'com-link', 'Convite Leve com Link Wellness', 'padrao',
'Oi [nome]! Tenho uma calculadora/quiz que pode te ajudar. Quer testar? [link]',
ARRAY['convite', 'leve', 'link', 'wellness'], 3),

('convite', 'frios', 'Convite Leve para Leads Frios', 'padrao',
'Oi [nome]! Faz tempo que não conversamos, né? Lembrei de você hoje e queria te contar sobre algo que pode te interessar. Posso te contar?',
ARRAY['convite', 'leve', 'frios', 'reativacao'], 4),

('convite', 'proximos', 'Convite Leve para Pessoas Próximas', 'padrao',
'Oi [nome]! Você sabe que eu sempre penso em você, né? Tenho algo que pode te ajudar e queria te mostrar. Posso?',
ARRAY['convite', 'leve', 'proximos', 'familia'], 5),

('convite', 'espiritual', 'Convite Leve Espiritual/Suave', 'padrao',
'Oi [nome]! Senti que você pode estar precisando de algo assim. Tenho uma forma leve de te ajudar. Posso te contar?',
ARRAY['convite', 'leve', 'espiritual', 'suave'], 6),

('convite', 'dor-beneficio', 'Convite Leve com Dor/Benefício', 'padrao',
'Oi [nome]! Sei que você [dor/necessidade]. Tenho algo que pode te ajudar com isso. Quer conhecer?',
ARRAY['convite', 'leve', 'dor', 'beneficio'], 7),

('convite', 'negocio', 'Convite Leve para Negócio', 'padrao',
'Oi [nome]! Tenho uma oportunidade que pode te interessar. É algo que você pode fazer de casa e pode gerar uma renda extra. Quer conhecer?',
ARRAY['convite', 'leve', 'negocio', 'renda'], 8);

-- ============================================
-- SCRIPTS DE FOLLOW-UP (Lousa 2)
-- ============================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem) VALUES
('acompanhamento', 'genuino', 'Follow-up Genuíno', 'padrao',
'Oi [nome]! Como você está? Lembrei de você e queria saber como está indo. Tudo bem?',
ARRAY['follow-up', 'genuino', 'interesse'], 9),

('acompanhamento', 'apos-link', 'Follow-up Após Link', 'padrao',
'Oi [nome]! Você conseguiu fazer o teste/calculadora que te enviei? O que achou do resultado?',
ARRAY['follow-up', 'link', 'teste'], 10),

('acompanhamento', 'apos-produto', 'Follow-up Após Apresentar Produto', 'padrao',
'Oi [nome]! Você pensou sobre o produto que te mostrei? Tem alguma dúvida?',
ARRAY['follow-up', 'produto', 'venda'], 11),

('acompanhamento', 'apos-apresentacao', 'Follow-up Após Apresentação', 'padrao',
'Oi [nome]! Você assistiu a apresentação? O que achou? Tem alguma dúvida?',
ARRAY['follow-up', 'apresentacao', 'negocio'], 12),

('acompanhamento', 'sutil', 'Follow-up Sutil', 'padrao',
'Oi [nome]! Só passando para ver como você está. Tudo bem?',
ARRAY['follow-up', 'sutil', 'sem-pressao'], 13);

-- ============================================
-- SCRIPTS DE VENDAS - ENERGIA (Lousa 4)
-- ============================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem) VALUES
('fechamento', 'energia-emocional', 'Venda Energia - Emocional', 'padrao',
'[nome], imagina você com energia para fazer tudo que precisa e ainda sobrar energia para você? O Energia te dá isso. É como ter uma bateria que nunca acaba. Quer experimentar?',
ARRAY['venda', 'energia', 'nrg', 'emocional'], 14),

('fechamento', 'energia-racional', 'Venda Energia - Racional', 'padrao',
'[nome], o Energia tem cafeína natural, vitaminas do complexo B e taurina. Isso te dá energia sustentada, sem picos e quedas. Quer conhecer?',
ARRAY['venda', 'energia', 'nrg', 'racional', 'tecnico'], 15),

('fechamento', 'energia-rapida', 'Venda Energia - Rápida', 'padrao',
'[nome], Energia = mais energia no seu dia. Quer experimentar?',
ARRAY['venda', 'energia', 'nrg', 'rapida'], 16);

-- ============================================
-- SCRIPTS DE VENDAS - ACELERA (Lousa 4)
-- ============================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem) VALUES
('fechamento', 'acelera-emocional', 'Venda Acelera - Emocional', 'padrao',
'[nome], imagina você acelerando seu metabolismo de forma natural e saudável? O Acelera faz isso. É como ter um turbo no seu corpo. Quer experimentar?',
ARRAY['venda', 'acelera', 'metabolismo', 'emocional'], 17),

('fechamento', 'acelera-racional', 'Venda Acelera - Racional', 'padrao',
'[nome], o Acelera tem ingredientes que aceleram seu metabolismo de forma natural. Isso te ajuda a queimar mais calorias e ter mais energia. Quer conhecer?',
ARRAY['venda', 'acelera', 'metabolismo', 'racional', 'tecnico'], 18);

-- ============================================
-- SCRIPTS DE OBJEÇÕES (Lousa 5)
-- ============================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem) VALUES
('objecao', 'muito-caro', 'Objeção: Muito Caro', 'padrao',
'Entendo, [nome]. O investimento pode parecer alto, mas quando você pensa que é para sua saúde e bem-estar, vale muito a pena. Além disso, você pode começar com o kit menor. Quer ver as opções?',
ARRAY['objecao', 'preco', 'caro'], 19),

('objecao', 'nao-acredito', 'Objeção: Não Acredito', 'padrao',
'Entendo, [nome]. É normal ter essa dúvida. Que tal você experimentar e ver os resultados? Tenho vários clientes que também duvidavam e hoje são os maiores fãs. Quer conhecer algumas histórias?',
ARRAY['objecao', 'crenca', 'duvida'], 20),

('objecao', 'nao-tempo', 'Objeção: Não Tenho Tempo', 'padrao',
'Entendo, [nome]. Você tem uma rotina corrida. Por isso mesmo que nossos produtos são práticos - você só precisa tomar. Não precisa preparar nada, não precisa mudar sua rotina. Quer ver como é simples?',
ARRAY['objecao', 'tempo', 'rotina'], 21),

('objecao', 'ja-tentei', 'Objeção: Já Tentei Outras Coisas', 'padrao',
'Entendo, [nome]. Você já tentou outras coisas. O que fazemos diferente é que nossos produtos são naturais, sem químicos pesados, e você tem acompanhamento. Quer ver a diferença?',
ARRAY['objecao', 'tentou', 'outros'], 22),

('objecao', 'pensar', 'Objeção: Preciso Pensar', 'padrao',
'Claro, [nome]. É importante pensar. Enquanto você pensa, que tal você experimentar com um investimento menor? Assim você vê os resultados e decide. Quer ver as opções?',
ARRAY['objecao', 'pensar', 'duvida'], 23);

-- ============================================
-- SCRIPTS DE RECRUTAMENTO (Lousa 5)
-- ============================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem) VALUES
('recrutamento', 'inicial', 'Recrutamento Inicial', 'padrao',
'[nome], você já pensou em transformar seu consumo em renda? Eu faço isso e queria te mostrar como. É uma forma de você ganhar uma renda extra trabalhando de casa. Quer conhecer?',
ARRAY['recrutamento', 'inicial', 'renda'], 24),

('recrutamento', 'apresentacao', 'Recrutamento com Apresentação', 'padrao',
'[nome], tenho uma apresentação rápida que mostra como funciona. São só alguns minutos e pode te interessar. Quer assistir?',
ARRAY['recrutamento', 'apresentacao', 'video'], 25),

('recrutamento', 'historia', 'Recrutamento com História Pessoal', 'padrao',
'[nome], eu também não acreditava no início. Mas comecei e hoje estou transformando minha vida. Queria te mostrar como você também pode. Quer conhecer minha história?',
ARRAY['recrutamento', 'historia', 'pessoal'], 26);

-- ============================================
-- SCRIPTS DE ONBOARDING (Lousa 6)
-- ============================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem) VALUES
('onboarding', 'cliente-dia1', 'Onboarding Cliente - Dia 1', 'padrao',
'Olá [nome]! Seja muito bem-vindo(a)! Fico feliz que você escolheu cuidar da sua saúde conosco. Hoje vou te enviar um link inicial para você conhecer melhor seus hábitos. Quer fazer?',
ARRAY['onboarding', 'cliente', 'dia1', 'boas-vindas'], 27),

('onboarding', 'distribuidor-dia1', 'Onboarding Distribuidor - Dia 1', 'padrao',
'Olá [nome]! Seja muito bem-vindo(a) à equipe! Estou animado(a) para te ajudar a construir seu negócio. Hoje vou te ensinar o método 2-5-10, que é a base de tudo. Pronto para começar?',
ARRAY['onboarding', 'distribuidor', 'dia1', 'boas-vindas'], 28);

-- Verificar inserção
SELECT COUNT(*) as total_scripts, categoria, COUNT(*) as por_categoria 
FROM wellness_scripts 
GROUP BY categoria 
ORDER BY categoria;
