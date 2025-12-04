-- ============================================
-- SEED INICIAL - BASE DE CONHECIMENTO NOEL
-- Scripts, frases, fluxos padrão
-- ============================================

-- ============================================
-- SCRIPTS DE VENDAS
-- ============================================

INSERT INTO ylada_wellness_base_conhecimento (categoria, subcategoria, titulo, conteudo, estagio_negocio, tempo_disponivel, tags, prioridade) VALUES
('script_vendas', 'abordagem_inicial', 'Script: Abordagem Inicial', 
'Olá! Vi que você tem interesse em melhorar sua saúde e bem-estar. Tenho uma solução que pode te ajudar! Posso te mostrar como funciona?',
ARRAY['iniciante', 'ativo', 'produtivo']::text[],
ARRAY['15-30 min', '30-60 min', '1-2h']::text[],
ARRAY['vendas', 'abordagem', 'inicial'],
8),

('script_vendas', 'apresentacao_produto', 'Script: Apresentação do Shake',
'O Shake Herbalife é uma refeição completa e balanceada. Ele fornece proteína de alta qualidade, vitaminas e minerais essenciais. É ideal para quem quer praticidade sem abrir mão da nutrição. Quer saber como preparar?',
ARRAY['iniciante', 'ativo', 'produtivo']::text[],
ARRAY['15-30 min', '30-60 min', '1-2h']::text[],
ARRAY['shake', 'produto', 'vendas'],
9),

('script_vendas', 'objeção_preco', 'Script: Lidando com Objeção de Preço',
'Entendo sua preocupação com o investimento. Vamos pensar assim: quanto você gasta por mês com refeições fora de casa ou produtos que não te trazem resultado? O Shake é um investimento na sua saúde e bem-estar. E você pode começar com um kit menor para testar. O que acha?',
ARRAY['iniciante', 'ativo']::text[],
ARRAY['15-30 min', '30-60 min']::text[],
ARRAY['objeção', 'preço', 'vendas'],
7),

('script_vendas', 'fechamento', 'Script: Fechamento de Venda',
'Perfeito! Vejo que faz sentido para você. Que tal começarmos hoje mesmo? Posso te ajudar a escolher o melhor kit para seu objetivo. Quando você gostaria de receber?',
ARRAY['iniciante', 'ativo', 'produtivo']::text[],
ARRAY['15-30 min', '30-60 min', '1-2h']::text[],
ARRAY['fechamento', 'vendas'],
9);

-- ============================================
-- SCRIPTS DE BEBIDAS
-- ============================================

INSERT INTO ylada_wellness_base_conhecimento (categoria, subcategoria, titulo, conteudo, estagio_negocio, tempo_disponivel, tags, prioridade) VALUES
('script_bebidas', 'preparo_basico', 'Script: Como Preparar Shake Básico',
'Para preparar o Shake: 1) Adicione 2 colheres (26g) do pó em 250ml de leite desnatado ou água. 2) Misture bem até dissolver. 3) Pode adicionar frutas ou gelo. 4) Consuma imediatamente. Dica: use leite para mais cremosidade!',
ARRAY['iniciante', 'ativo', 'produtivo', 'multiplicador', 'lider']::text[],
ARRAY['15-30 min']::text[],
ARRAY['shake', 'preparo', 'bebida'],
10),

('script_bebidas', 'variacoes_sabor', 'Script: Variações de Sabor do Shake',
'Você pode variar o sabor adicionando: frutas (banana, morango, abacaxi), especiarias (canela, cacau), ou gelo triturado. Cada variação mantém os benefícios nutricionais e torna a experiência mais prazerosa!',
ARRAY['iniciante', 'ativo', 'produtivo']::text[],
ARRAY['15-30 min']::text[],
ARRAY['shake', 'sabor', 'variação'],
7),

('script_bebidas', 'beneficios_permitidos', 'Script: Benefícios Permitidos do Shake',
'O Shake Herbalife é uma refeição completa e balanceada que fornece proteína de alta qualidade, vitaminas e minerais essenciais. Ele pode fazer parte de um estilo de vida saudável e ativo quando combinado com alimentação equilibrada e exercícios regulares.',
ARRAY['iniciante', 'ativo', 'produtivo', 'multiplicador', 'lider']::text[],
ARRAY['15-30 min', '30-60 min']::text[],
ARRAY['shake', 'benefícios', 'nutrição'],
9);

-- ============================================
-- SCRIPTS DE INDICAÇÃO
-- ============================================

INSERT INTO ylada_wellness_base_conhecimento (categoria, subcategoria, titulo, conteudo, estagio_negocio, tempo_disponivel, tags, prioridade) VALUES
('script_indicacao', 'pedir_indicacao', 'Script: Como Pedir Indicação',
'Olha, estou ajudando pessoas a melhorarem sua saúde e bem-estar. Você conhece alguém que também está buscando isso? Pode ser alguém que quer emagrecer, ganhar energia ou simplesmente ter mais praticidade no dia a dia. Se conhecer, me indica?',
ARRAY['iniciante', 'ativo', 'produtivo']::text[],
ARRAY['15-30 min', '30-60 min']::text[],
ARRAY['indicação', 'rede', 'contatos'],
8),

('script_indicacao', 'agradecer_indicacao', 'Script: Agradecer Indicação',
'Muito obrigado pela indicação! Vou entrar em contato com [nome] e ver como posso ajudar. Se der certo, você também ganha! Fico no aguardo de mais indicações quando surgir a oportunidade.',
ARRAY['iniciante', 'ativo', 'produtivo']::text[],
ARRAY['15-30 min']::text[],
ARRAY['indicação', 'agradecimento'],
6);

-- ============================================
-- SCRIPTS DE RECRUTAMENTO
-- ============================================

INSERT INTO ylada_wellness_base_conhecimento (categoria, subcategoria, titulo, conteudo, estagio_negocio, tempo_disponivel, tags, prioridade) VALUES
('script_recrutamento', 'abordagem_recrutamento', 'Script: Abordagem para Recrutamento',
'Olá! Vi que você está gostando dos produtos e resultados. Já pensou em transformar isso em uma oportunidade de negócio? Posso te mostrar como funciona o modelo de negócio Herbalife. É uma forma de gerar renda extra fazendo o que você já faz: ajudar pessoas!',
ARRAY['ativo', 'produtivo', 'multiplicador', 'lider']::text[],
ARRAY['30-60 min', '1-2h', '2-3h']::text[],
ARRAY['recrutamento', 'negócio', 'oportunidade'],
9),

('script_recrutamento', 'vantagens_negocio', 'Script: Vantagens do Negócio',
'O negócio Herbalife oferece: flexibilidade de horários, trabalho de casa, produtos que você já conhece e usa, suporte da empresa, possibilidade de crescimento ilimitado. Você trabalha no seu ritmo e constrói sua renda progressivamente.',
ARRAY['ativo', 'produtivo']::text[],
ARRAY['30-60 min', '1-2h']::text[],
ARRAY['recrutamento', 'vantagens', 'negócio'],
8),

('script_recrutamento', 'fechamento_recrutamento', 'Script: Fechamento de Recrutamento',
'Que tal começarmos? Posso te ajudar a se cadastrar e te dar todo o suporte inicial. Você não precisa investir muito para começar. Vamos conversar melhor sobre isso?',
ARRAY['ativo', 'produtivo', 'multiplicador']::text[],
ARRAY['30-60 min', '1-2h']::text[],
ARRAY['recrutamento', 'fechamento'],
9);

-- ============================================
-- SCRIPTS DE FOLLOW-UP
-- ============================================

INSERT INTO ylada_wellness_base_conhecimento (categoria, subcategoria, titulo, conteudo, estagio_negocio, tempo_disponivel, tags, prioridade) VALUES
('script_followup', 'followup_24h', 'Script: Follow-up 24h Após Contato',
'Oi! Lembrei de você. Como está? Conseguiu pensar sobre o que conversamos? Se tiver alguma dúvida, estou aqui para ajudar!',
ARRAY['iniciante', 'ativo', 'produtivo']::text[],
ARRAY['15-30 min']::text[],
ARRAY['follow-up', 'acompanhamento'],
7),

('script_followup', 'followup_pos_venda', 'Script: Follow-up Pós-Venda',
'Oi! Você já recebeu o produto? Como está sendo a experiência? Está gostando? Se tiver qualquer dúvida sobre uso ou preparo, me chama!',
ARRAY['iniciante', 'ativo', 'produtivo']::text[],
ARRAY['15-30 min']::text[],
ARRAY['follow-up', 'pós-venda', 'acompanhamento'],
8),

('script_followup', 'followup_recompra', 'Script: Follow-up para Recompra',
'Oi! Como está indo com os produtos? Já está na hora de renovar seu estoque? Posso te ajudar a montar seu próximo pedido com os produtos que você mais usa!',
ARRAY['ativo', 'produtivo']::text[],
ARRAY['15-30 min']::text[],
ARRAY['follow-up', 'recompra'],
8);

-- ============================================
-- FRASES MOTIVACIONAIS
-- ============================================

INSERT INTO ylada_wellness_base_conhecimento (categoria, subcategoria, titulo, conteudo, estagio_negocio, tempo_disponivel, tags, prioridade) VALUES
('frase_motivacional', 'manha', 'Frase: Motivação Manhã',
'Bom dia! Hoje é um novo dia para fazer a diferença na vida das pessoas. Você tem tudo que precisa para ter sucesso. Vamos começar! 💪',
ARRAY['iniciante', 'ativo', 'produtivo', 'multiplicador', 'lider']::text[],
ARRAY['15-30 min', '30-60 min', '1-2h', '2-3h', '3-5h', '5h+']::text[],
ARRAY['motivação', 'manhã'],
6),

('frase_motivacional', 'consistencia', 'Frase: Sobre Consistência',
'Lembre-se: sucesso não é sobre perfeição, é sobre consistência. Pequenas ações diárias geram grandes resultados ao longo do tempo. Continue! 🌟',
ARRAY['iniciante', 'ativo', 'produtivo']::text[],
ARRAY['15-30 min', '30-60 min', '1-2h', '2-3h', '3-5h', '5h+']::text[],
ARRAY['motivação', 'consistência'],
7),

('frase_motivacional', 'superacao', 'Frase: Superação de Desafios',
'Cada desafio é uma oportunidade de crescimento. Você é mais forte do que pensa. Continue persistindo e os resultados virão! 🚀',
ARRAY['iniciante', 'ativo']::text[],
ARRAY['15-30 min', '30-60 min', '1-2h', '2-3h', '3-5h', '5h+']::text[],
ARRAY['motivação', 'superação'],
6),

('frase_motivacional', 'lideranca', 'Frase: Liderança',
'Líderes não nascem prontos, eles se desenvolvem através da prática e do comprometimento. Você está no caminho certo! 👑',
ARRAY['multiplicador', 'lider']::text[],
ARRAY['2-3h', '3-5h', '5h+']::text[],
ARRAY['motivação', 'liderança'],
7);

-- ============================================
-- FLUXOS PADRÃO
-- ============================================

INSERT INTO ylada_wellness_base_conhecimento (categoria, subcategoria, titulo, conteudo, estagio_negocio, tempo_disponivel, tags, prioridade) VALUES
('fluxo_padrao', 'fluxo_venda', 'Fluxo: Processo de Venda Completo',
'1) Abordagem inicial - Apresente-se e crie conexão\n2) Identifique necessidade - Faça perguntas para entender o objetivo\n3) Apresente solução - Mostre como o produto resolve\n4) Trate objeções - Escute e responda com empatia\n5) Feche a venda - Peça a decisão de forma natural\n6) Follow-up - Acompanhe após a venda',
ARRAY['iniciante', 'ativo', 'produtivo']::text[],
ARRAY['30-60 min', '1-2h', '2-3h']::text[],
ARRAY['fluxo', 'vendas', 'processo'],
9),

('fluxo_padrao', 'fluxo_recrutamento', 'Fluxo: Processo de Recrutamento',
'1) Identifique potencial - Observe quem tem perfil\n2) Abordagem sutil - Mencione a oportunidade naturalmente\n3) Apresente benefícios - Mostre vantagens do negócio\n4) Responda dúvidas - Seja transparente e honesto\n5) Convide para conhecer - Ofereça mais informações\n6) Acompanhe processo - Dê suporte no início',
ARRAY['ativo', 'produtivo', 'multiplicador', 'lider']::text[],
ARRAY['1-2h', '2-3h', '3-5h']::text[],
ARRAY['fluxo', 'recrutamento', 'processo'],
9),

('fluxo_padrao', 'ritual_2_5_10', 'Fluxo: Ritual 2-5-10',
'RITUAL 2 (Manhã): 2 contatos - Envie mensagens para 2 pessoas\nRITUAL 5 (Tarde): 5 ações - Faça 5 ações de vendas/recrutamento\nRITUAL 10 (Noite): 10 minutos - Revise o dia e planeje o próximo\n\nEste ritual garante consistência e resultados progressivos.',
ARRAY['iniciante', 'ativo', 'produtivo', 'multiplicador', 'lider']::text[],
ARRAY['15-30 min', '30-60 min', '1-2h']::text[],
ARRAY['ritual', 'rotina', 'consistência'],
10);

-- ============================================
-- INSTRUÇÕES
-- ============================================

INSERT INTO ylada_wellness_base_conhecimento (categoria, subcategoria, titulo, conteudo, estagio_negocio, tempo_disponivel, tags, prioridade) VALUES
('instrucao', 'como_comecar', 'Instrução: Como Começar no Negócio',
'Para começar: 1) Faça seu cadastro como consultor 2) Conheça os produtos pessoalmente 3) Defina seus objetivos (PV, financeiro) 4) Crie sua lista de contatos 5) Comece com o Ritual 2-5-10 6) Acompanhe seu progresso diariamente',
ARRAY['iniciante']::text[],
ARRAY['30-60 min', '1-2h', '2-3h']::text[],
ARRAY['início', 'começar', 'primeiros passos'],
9),

('instrucao', 'aumentar_pv', 'Instrução: Como Aumentar PV',
'Para aumentar PV: 1) Foque em recompra de clientes ativos 2) Apresente novos produtos 3) Crie combos e ofertas 4) Aumente sua base de clientes 5) Desenvolva sua equipe 6) Mantenha consistência nas vendas',
ARRAY['ativo', 'produtivo', 'multiplicador']::text[],
ARRAY['1-2h', '2-3h', '3-5h']::text[],
ARRAY['pv', 'vendas', 'crescimento'],
8),

('instrucao', 'desenvolver_equipe', 'Instrução: Como Desenvolver Equipe',
'Para desenvolver equipe: 1) Recrute pessoas comprometidas 2) Treine continuamente 3) Dê suporte e acompanhamento 4) Celebre conquistas 5) Crie ambiente de crescimento 6) Seja exemplo de liderança',
ARRAY['multiplicador', 'lider']::text[],
ARRAY['2-3h', '3-5h', '5h+']::text[],
ARRAY['equipe', 'liderança', 'desenvolvimento'],
9);

-- Total: 20 itens na base de conhecimento inicial

