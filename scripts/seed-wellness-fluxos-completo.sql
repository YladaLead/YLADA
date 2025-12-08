-- ============================================
-- SEED: Fluxos Completos Wellness
-- Baseado nas Lousas 2, 3, 4, 5, 6, 8, 9
-- ============================================

-- Limpar dados existentes (opcional - descomente se necessário)
-- TRUNCATE TABLE wellness_fluxos_dicas CASCADE;
-- TRUNCATE TABLE wellness_fluxos_scripts CASCADE;
-- TRUNCATE TABLE wellness_fluxos_passos CASCADE;
-- TRUNCATE TABLE wellness_fluxos CASCADE;

-- ============================================
-- FLUXO 1: FLUXO 2-5-10 (Lousa 2)
-- ============================================

INSERT INTO wellness_fluxos (codigo, titulo, descricao, objetivo, quando_usar, categoria, ordem) VALUES
('fluxo-2-5-10', 'Fluxo 2-5-10', 'Rotina diária mínima: 2 convites leves, 5 follow-ups, 10 interações de relacionamento', 'Estabelecer rotina diária consistente de ações', 'Usar diariamente como base do negócio', 'acao-diaria', 1);

-- Passos do Fluxo 2-5-10
INSERT INTO wellness_fluxos_passos (fluxo_id, numero, titulo, descricao, ordem)
SELECT f.id, 1, '2 Convites Leves', 'Enviar 2 links wellness leves para captação', 1
FROM wellness_fluxos f WHERE f.codigo = 'fluxo-2-5-10';

INSERT INTO wellness_fluxos_passos (fluxo_id, numero, titulo, descricao, ordem)
SELECT f.id, 2, '5 Follow-ups', 'Fazer follow-up com 5 pessoas que já foram abordadas', 2
FROM wellness_fluxos f WHERE f.codigo = 'fluxo-2-5-10';

INSERT INTO wellness_fluxos_passos (fluxo_id, numero, titulo, descricao, ordem)
SELECT f.id, 3, '10 Interações', 'Manter 10 interações de relacionamento sem intenção comercial', 3
FROM wellness_fluxos f WHERE f.codigo = 'fluxo-2-5-10';

-- Scripts do Passo 1 (2 Convites)
INSERT INTO wellness_fluxos_scripts (fluxo_id, passo_id, texto, variacao, ordem)
SELECT f.id, p.id, 'Oi [nome]! Lembrei de você hoje e queria te contar sobre uma novidade de bem-estar. Posso te contar rapidinho?', 'padrao', 1
FROM wellness_fluxos f, wellness_fluxos_passos p
WHERE f.codigo = 'fluxo-2-5-10' AND p.numero = 1 AND p.fluxo_id = f.id;

INSERT INTO wellness_fluxos_scripts (fluxo_id, passo_id, texto, variacao, ordem)
SELECT f.id, p.id, 'Oi [nome]! Tenho uma calculadora/quiz que pode te ajudar. Quer testar? [link]', 'com-link', 2
FROM wellness_fluxos f, wellness_fluxos_passos p
WHERE f.codigo = 'fluxo-2-5-10' AND p.numero = 1 AND p.fluxo_id = f.id;

-- Scripts do Passo 2 (5 Follow-ups)
INSERT INTO wellness_fluxos_scripts (fluxo_id, passo_id, texto, variacao, ordem)
SELECT f.id, p.id, 'Oi [nome]! Como você está? Lembrei de você e queria saber como está indo. Tudo bem?', 'genuino', 1
FROM wellness_fluxos f, wellness_fluxos_passos p
WHERE f.codigo = 'fluxo-2-5-10' AND p.numero = 2 AND p.fluxo_id = f.id;

INSERT INTO wellness_fluxos_scripts (fluxo_id, passo_id, texto, variacao, ordem)
SELECT f.id, p.id, 'Oi [nome]! Você conseguiu fazer o teste que te enviei? O que achou do resultado?', 'apos-link', 2
FROM wellness_fluxos f, wellness_fluxos_passos p
WHERE f.codigo = 'fluxo-2-5-10' AND p.numero = 2 AND p.fluxo_id = f.id;

-- Dicas do Fluxo 2-5-10
INSERT INTO wellness_fluxos_dicas (fluxo_id, passo_id, texto, ordem)
SELECT f.id, p.id, 'Use Links Wellness leves para os 2 convites (Calculadora de Água, IMC, Calorias)', 1
FROM wellness_fluxos f, wellness_fluxos_passos p
WHERE f.codigo = 'fluxo-2-5-10' AND p.numero = 1 AND p.fluxo_id = f.id;

INSERT INTO wellness_fluxos_dicas (fluxo_id, passo_id, texto, ordem)
SELECT f.id, p.id, 'Para follow-ups, use Links Wellness de diagnóstico (Metabolismo, Intestino, Detox)', 1
FROM wellness_fluxos f, wellness_fluxos_passos p
WHERE f.codigo = 'fluxo-2-5-10' AND p.numero = 2 AND p.fluxo_id = f.id;

INSERT INTO wellness_fluxos_dicas (fluxo_id, passo_id, texto, ordem)
SELECT f.id, p.id, 'As 10 interações devem ser sem intenção comercial - apenas relacionamento', 1
FROM wellness_fluxos f, wellness_fluxos_passos p
WHERE f.codigo = 'fluxo-2-5-10' AND p.numero = 3 AND p.fluxo_id = f.id;

-- ============================================
-- FLUXO 2: FLUXO DE CONVITE LEVE (Lousa 3)
-- ============================================

INSERT INTO wellness_fluxos (codigo, titulo, descricao, objetivo, quando_usar, categoria, ordem) VALUES
('fluxo-convite-leve', 'Fluxo de Convite Leve', '8 tipos de convites leves para diferentes situações', 'Abrir conversas de forma leve e natural', 'Usar para iniciar contato com leads', 'acao-diaria', 2);

-- Passos do Fluxo de Convite Leve
INSERT INTO wellness_fluxos_passos (fluxo_id, numero, titulo, descricao, ordem)
SELECT f.id, 1, 'Identificar Tipo de Lead', 'Identificar se é lead frio, morno, quente ou próximo', 1
FROM wellness_fluxos f WHERE f.codigo = 'fluxo-convite-leve';

INSERT INTO wellness_fluxos_passos (fluxo_id, numero, titulo, descricao, ordem)
SELECT f.id, 2, 'Escolher Tipo de Convite', 'Escolher entre: clássico, curiosidade, com link, frios, próximos, espiritual, dor/benefício, negócio', 2
FROM wellness_fluxos f WHERE f.codigo = 'fluxo-convite-leve';

INSERT INTO wellness_fluxos_passos (fluxo_id, numero, titulo, descricao, ordem)
SELECT f.id, 3, 'Enviar Convite', 'Enviar mensagem com script apropriado', 3
FROM wellness_fluxos f WHERE f.codigo = 'fluxo-convite-leve';

INSERT INTO wellness_fluxos_passos (fluxo_id, numero, titulo, descricao, ordem)
SELECT f.id, 4, 'Aguardar Resposta', 'Aguardar resposta e preparar próximo passo', 4
FROM wellness_fluxos f WHERE f.codigo = 'fluxo-convite-leve';

-- Scripts do Fluxo de Convite Leve
INSERT INTO wellness_fluxos_scripts (fluxo_id, passo_id, texto, variacao, ordem)
SELECT f.id, p.id, 'Oi [nome]! Lembrei de você hoje e queria te contar sobre uma novidade de bem-estar. Posso te contar rapidinho?', 'classico', 1
FROM wellness_fluxos f, wellness_fluxos_passos p
WHERE f.codigo = 'fluxo-convite-leve' AND p.numero = 3 AND p.fluxo_id = f.id;

INSERT INTO wellness_fluxos_scripts (fluxo_id, passo_id, texto, variacao, ordem)
SELECT f.id, p.id, 'Oi [nome]! Tenho algo interessante para te mostrar. É rápido e pode te ajudar bastante. Quer ver?', 'curiosidade', 2
FROM wellness_fluxos f, wellness_fluxos_passos p
WHERE f.codigo = 'fluxo-convite-leve' AND p.numero = 3 AND p.fluxo_id = f.id;

INSERT INTO wellness_fluxos_scripts (fluxo_id, passo_id, texto, variacao, ordem)
SELECT f.id, p.id, 'Oi [nome]! Faz tempo que não conversamos, né? Lembrei de você hoje e queria te contar sobre algo. Posso?', 'frios', 3
FROM wellness_fluxos f, wellness_fluxos_passos p
WHERE f.codigo = 'fluxo-convite-leve' AND p.numero = 3 AND p.fluxo_id = f.id;

-- ============================================
-- FLUXO 3: FLUXO DE VENDAS - ENERGIA (Lousa 4)
-- ============================================

INSERT INTO wellness_fluxos (codigo, titulo, descricao, objetivo, quando_usar, categoria, ordem) VALUES
('fluxo-venda-energia', 'Fluxo de Venda - Energia', 'Fluxo completo para vender produto Energia (NRG)', 'Fechar venda do produto Energia', 'Usar quando lead demonstra interesse em energia', 'vendas', 3);

-- Passos do Fluxo de Venda Energia
INSERT INTO wellness_fluxos_passos (fluxo_id, numero, titulo, descricao, ordem)
SELECT f.id, 1, 'Identificar Necessidade', 'Identificar se lead precisa de energia', 1
FROM wellness_fluxos f WHERE f.codigo = 'fluxo-venda-energia';

INSERT INTO wellness_fluxos_passos (fluxo_id, numero, titulo, descricao, ordem)
SELECT f.id, 2, 'Apresentar Benefício', 'Apresentar benefício do Energia de forma personalizada', 2
FROM wellness_fluxos f WHERE f.codigo = 'fluxo-venda-energia';

INSERT INTO wellness_fluxos_passos (fluxo_id, numero, titulo, descricao, ordem)
SELECT f.id, 3, 'Mostrar Resultados', 'Compartilhar resultados de outros clientes', 3
FROM wellness_fluxos f WHERE f.codigo = 'fluxo-venda-energia';

INSERT INTO wellness_fluxos_passos (fluxo_id, numero, titulo, descricao, ordem)
SELECT f.id, 4, 'Fazer Fechamento', 'Fazer fechamento leve oferecendo opções', 4
FROM wellness_fluxos f WHERE f.codigo = 'fluxo-venda-energia';

-- Scripts do Fluxo de Venda Energia
INSERT INTO wellness_fluxos_scripts (fluxo_id, passo_id, texto, variacao, ordem)
SELECT f.id, p.id, '[nome], imagina você com energia para fazer tudo que precisa e ainda sobrar energia para você? O Energia te dá isso. É como ter uma bateria que nunca acaba. Quer experimentar?', 'emocional', 1
FROM wellness_fluxos f, wellness_fluxos_passos p
WHERE f.codigo = 'fluxo-venda-energia' AND p.numero = 2 AND p.fluxo_id = f.id;

INSERT INTO wellness_fluxos_scripts (fluxo_id, passo_id, texto, variacao, ordem)
SELECT f.id, p.id, '[nome], o Energia tem cafeína natural, vitaminas do complexo B e taurina. Isso te dá energia sustentada, sem picos e quedas. Quer conhecer?', 'racional', 2
FROM wellness_fluxos f, wellness_fluxos_passos p
WHERE f.codigo = 'fluxo-venda-energia' AND p.numero = 2 AND p.fluxo_id = f.id;

INSERT INTO wellness_fluxos_scripts (fluxo_id, passo_id, texto, variacao, ordem)
SELECT f.id, p.id, 'Tenho 2 opções para você: o kit inicial ou o kit completo. Qual faz mais sentido?', 'fechamento', 1
FROM wellness_fluxos f, wellness_fluxos_passos p
WHERE f.codigo = 'fluxo-venda-energia' AND p.numero = 4 AND p.fluxo_id = f.id;

-- ============================================
-- FLUXO 4: FLUXO DE RECRUTAMENTO INICIAL (Lousa 5)
-- ============================================

INSERT INTO wellness_fluxos (codigo, titulo, descricao, objetivo, quando_usar, categoria, ordem) VALUES
('fluxo-recrutamento-inicial', 'Fluxo de Recrutamento Inicial', 'Fluxo para recrutar novos distribuidores', 'Recrutar novos distribuidores para a equipe', 'Usar quando lead demonstra interesse em oportunidade de negócio', 'recrutamento', 4);

-- Passos do Fluxo de Recrutamento
INSERT INTO wellness_fluxos_passos (fluxo_id, numero, titulo, descricao, ordem)
SELECT f.id, 1, 'Identificar Interesse', 'Identificar se lead tem interesse em oportunidade de negócio', 1
FROM wellness_fluxos f WHERE f.codigo = 'fluxo-recrutamento-inicial';

INSERT INTO wellness_fluxos_passos (fluxo_id, numero, titulo, descricao, ordem)
SELECT f.id, 2, 'Contar História Pessoal', 'Contar sua história de transformação', 2
FROM wellness_fluxos f WHERE f.codigo = 'fluxo-recrutamento-inicial';

INSERT INTO wellness_fluxos_passos (fluxo_id, numero, titulo, descricao, ordem)
SELECT f.id, 3, 'Oferecer Apresentação', 'Oferecer apresentação do negócio', 3
FROM wellness_fluxos f WHERE f.codigo = 'fluxo-recrutamento-inicial';

INSERT INTO wellness_fluxos_passos (fluxo_id, numero, titulo, descricao, ordem)
SELECT f.id, 4, 'Fazer Follow-up', 'Fazer follow-up após apresentação', 4
FROM wellness_fluxos f WHERE f.codigo = 'fluxo-recrutamento-inicial';

-- Scripts do Fluxo de Recrutamento
INSERT INTO wellness_fluxos_scripts (fluxo_id, passo_id, texto, variacao, ordem)
SELECT f.id, p.id, '[nome], você já pensou em transformar seu consumo em renda? Eu faço isso e queria te mostrar como. É uma forma de você ganhar uma renda extra trabalhando de casa. Quer conhecer?', 'inicial', 1
FROM wellness_fluxos f, wellness_fluxos_passos p
WHERE f.codigo = 'fluxo-recrutamento-inicial' AND p.numero = 1 AND p.fluxo_id = f.id;

INSERT INTO wellness_fluxos_scripts (fluxo_id, passo_id, texto, variacao, ordem)
SELECT f.id, p.id, '[nome], eu também não acreditava no início. Mas comecei e hoje estou transformando minha vida. Queria te mostrar como você também pode. Quer conhecer minha história?', 'historia', 1
FROM wellness_fluxos f, wellness_fluxos_passos p
WHERE f.codigo = 'fluxo-recrutamento-inicial' AND p.numero = 2 AND p.fluxo_id = f.id;

INSERT INTO wellness_fluxos_scripts (fluxo_id, passo_id, texto, variacao, ordem)
SELECT f.id, p.id, '[nome], tenho uma apresentação rápida que mostra como funciona. São só alguns minutos e pode te interessar. Quer assistir?', 'apresentacao', 1
FROM wellness_fluxos f, wellness_fluxos_passos p
WHERE f.codigo = 'fluxo-recrutamento-inicial' AND p.numero = 3 AND p.fluxo_id = f.id;

-- ============================================
-- FLUXO 5: FLUXO DE ONBOARDING CLIENTE (Lousa 6)
-- ============================================

INSERT INTO wellness_fluxos (codigo, titulo, descricao, objetivo, quando_usar, categoria, ordem) VALUES
('fluxo-onboarding-cliente', 'Fluxo de Onboarding - Cliente', 'Onboarding de 7 dias para novos clientes', 'Garantir engajamento e resultados do cliente', 'Usar nos primeiros 7 dias após primeira compra', 'acompanhamento', 5);

-- Passos do Fluxo de Onboarding Cliente (7 dias)
INSERT INTO wellness_fluxos_passos (fluxo_id, numero, titulo, descricao, ordem)
SELECT f.id, 1, 'Dia 1: Boas-vindas', 'Enviar boas-vindas e link inicial', 1
FROM wellness_fluxos f WHERE f.codigo = 'fluxo-onboarding-cliente';

INSERT INTO wellness_fluxos_passos (fluxo_id, numero, titulo, descricao, ordem)
SELECT f.id, 2, 'Dia 2: Explicação + Hábito', 'Explicar produto e sugerir hábito simples', 2
FROM wellness_fluxos f WHERE f.codigo = 'fluxo-onboarding-cliente';

INSERT INTO wellness_fluxos_passos (fluxo_id, numero, titulo, descricao, ordem)
SELECT f.id, 3, 'Dia 3: Orientação Personalizada', 'Dar orientação baseada no perfil do cliente', 3
FROM wellness_fluxos f WHERE f.codigo = 'fluxo-onboarding-cliente';

INSERT INTO wellness_fluxos_passos (fluxo_id, numero, titulo, descricao, ordem)
SELECT f.id, 4, 'Dia 4: Apresentar Produto Ideal', 'Apresentar produto ideal para o cliente', 4
FROM wellness_fluxos f WHERE f.codigo = 'fluxo-onboarding-cliente';

INSERT INTO wellness_fluxos_passos (fluxo_id, numero, titulo, descricao, ordem)
SELECT f.id, 5, 'Dia 5: Micro Meta', 'Estabelecer micro meta com cliente', 5
FROM wellness_fluxos f WHERE f.codigo = 'fluxo-onboarding-cliente';

INSERT INTO wellness_fluxos_passos (fluxo_id, numero, titulo, descricao, ordem)
SELECT f.id, 6, 'Dia 6: Pergunta Emocional', 'Fazer pergunta emocional para engajamento', 6
FROM wellness_fluxos f WHERE f.codigo = 'fluxo-onboarding-cliente';

INSERT INTO wellness_fluxos_passos (fluxo_id, numero, titulo, descricao, ordem)
SELECT f.id, 7, 'Dia 7: Consolidação', 'Consolidar aprendizado e convidar para continuar', 7
FROM wellness_fluxos f WHERE f.codigo = 'fluxo-onboarding-cliente';

-- Scripts do Onboarding Cliente
INSERT INTO wellness_fluxos_scripts (fluxo_id, passo_id, texto, variacao, ordem)
SELECT f.id, p.id, 'Olá [nome]! Seja muito bem-vindo(a)! Fico feliz que você escolheu cuidar da sua saúde conosco. Hoje vou te enviar um link inicial para você conhecer melhor seus hábitos. Quer fazer?', 'dia1', 1
FROM wellness_fluxos f, wellness_fluxos_passos p
WHERE f.codigo = 'fluxo-onboarding-cliente' AND p.numero = 1 AND p.fluxo_id = f.id;

-- ============================================
-- FLUXO 6: FLUXO DE RETENÇÃO CLIENTE (Lousa 8)
-- ============================================

INSERT INTO wellness_fluxos (codigo, titulo, descricao, objetivo, quando_usar, categoria, ordem) VALUES
('fluxo-retencao-cliente', 'Fluxo de Retenção - Cliente', 'Fluxo para reter clientes que estão sumindo', 'Reativar e reter clientes inativos', 'Usar quando cliente não responde há 2+ dias', 'acompanhamento', 6);

-- Passos do Fluxo de Retenção
INSERT INTO wellness_fluxos_passos (fluxo_id, numero, titulo, descricao, ordem)
SELECT f.id, 1, 'Identificar Inatividade', 'Identificar que cliente sumiu ou não responde', 1
FROM wellness_fluxos f WHERE f.codigo = 'fluxo-retencao-cliente';

INSERT INTO wellness_fluxos_passos (fluxo_id, numero, titulo, descricao, ordem)
SELECT f.id, 2, 'Enviar Mensagem de Reconexão', 'Enviar mensagem leve de reconexão', 2
FROM wellness_fluxos f WHERE f.codigo = 'fluxo-retencao-cliente';

INSERT INTO wellness_fluxos_passos (fluxo_id, numero, titulo, descricao, ordem)
SELECT f.id, 3, 'Oferecer Ajuda', 'Oferecer ajuda sem pressionar', 3
FROM wellness_fluxos f WHERE f.codigo = 'fluxo-retencao-cliente';

-- Scripts do Fluxo de Retenção
INSERT INTO wellness_fluxos_scripts (fluxo_id, passo_id, texto, variacao, ordem)
SELECT f.id, p.id, 'Oi [nome]! Faz um tempo que não conversamos. Como você está? Tudo bem?', 'reconexao', 1
FROM wellness_fluxos f, wellness_fluxos_passos p
WHERE f.codigo = 'fluxo-retencao-cliente' AND p.numero = 2 AND p.fluxo_id = f.id;

INSERT INTO wellness_fluxos_scripts (fluxo_id, passo_id, texto, variacao, ordem)
SELECT f.id, p.id, 'Oi [nome]! Senti sua falta. Está tudo bem? Se precisar de algo, estou aqui.', 'ajuda', 1
FROM wellness_fluxos f, wellness_fluxos_passos p
WHERE f.codigo = 'fluxo-retencao-cliente' AND p.numero = 3 AND p.fluxo_id = f.id;

-- Verificar inserção
SELECT 
  f.codigo,
  f.titulo,
  COUNT(DISTINCT p.id) as total_passos,
  COUNT(DISTINCT s.id) as total_scripts,
  COUNT(DISTINCT d.id) as total_dicas
FROM wellness_fluxos f
LEFT JOIN wellness_fluxos_passos p ON p.fluxo_id = f.id
LEFT JOIN wellness_fluxos_scripts s ON s.fluxo_id = f.id
LEFT JOIN wellness_fluxos_dicas d ON d.fluxo_id = f.id
GROUP BY f.id, f.codigo, f.titulo
ORDER BY f.ordem;
