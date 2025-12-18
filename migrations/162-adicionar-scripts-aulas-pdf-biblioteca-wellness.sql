-- ============================================
-- MIGRATION: Adicionar Scripts/Aulas em PDF da Primeira Versão
-- Biblioteca Wellness - Categoria: Script
-- ============================================
-- 
-- Esta migration adiciona os scripts e aulas em PDF da primeira versão
-- do Wellness System para a biblioteca.
-- 
-- Os PDFs físicos devem ser uploadados para o Supabase Storage
-- e as URLs devem ser atualizadas nos registros criados.
-- ============================================

-- ============================================
-- SCRIPTS DE CONVITE (PDFs)
-- ============================================

INSERT INTO wellness_materiais (codigo, titulo, descricao, tipo, categoria, url, tags, ordem, ativo) VALUES
(
  'pdf-script-convite-leve-completo',
  'Scripts de Convite Leve - Guia Completo',
  'PDF com todos os scripts de convite leve da primeira versão: clássico, curiosidade, com link, leads frios, pessoas próximas, espiritual e negócio.',
  'pdf',
  'script',
  'https://placeholder-url.com/scripts/convite-leve-completo.pdf',
  ARRAY['convite', 'script', 'leve', 'primeira-versao', 'pdf'],
  1,
  true
),
(
  'pdf-script-convite-pessoas-proximas',
  'Scripts de Convite - Pessoas Próximas',
  'PDF com scripts específicos para convidar pessoas próximas (família, amigos) de forma leve e natural.',
  'pdf',
  'script',
  'https://placeholder-url.com/scripts/convite-pessoas-proximas.pdf',
  ARRAY['convite', 'script', 'pessoas-proximas', 'primeira-versao', 'pdf'],
  2,
  true
),
(
  'pdf-script-convite-leads-frios',
  'Scripts de Convite - Leads Frios',
  'PDF com scripts para reativar e convidar leads frios de forma respeitosa e sem pressão.',
  'pdf',
  'script',
  'https://placeholder-url.com/scripts/convite-leads-frios.pdf',
  ARRAY['convite', 'script', 'leads-frios', 'reativacao', 'primeira-versao', 'pdf'],
  3,
  true
);

-- ============================================
-- SCRIPTS DE FOLLOW-UP (PDFs)
-- ============================================

INSERT INTO wellness_materiais (codigo, titulo, descricao, tipo, categoria, url, tags, ordem, ativo) VALUES
(
  'pdf-script-follow-up-completo',
  'Scripts de Follow-up - Guia Completo',
  'PDF com todos os scripts de follow-up: genuíno, após link, após produto, após apresentação e sutil.',
  'pdf',
  'script',
  'https://placeholder-url.com/scripts/follow-up-completo.pdf',
  ARRAY['follow-up', 'script', 'acompanhamento', 'primeira-versao', 'pdf'],
  10,
  true
),
(
  'pdf-script-follow-up-apos-link',
  'Scripts de Follow-up - Após Enviar Link',
  'PDF com scripts específicos para fazer follow-up após enviar links de ferramentas Wellness.',
  'pdf',
  'script',
  'https://placeholder-url.com/scripts/follow-up-apos-link.pdf',
  ARRAY['follow-up', 'script', 'link', 'ferramentas', 'primeira-versao', 'pdf'],
  11,
  true
);

-- ============================================
-- SCRIPTS DE APRESENTAÇÃO (PDFs)
-- ============================================

INSERT INTO wellness_materiais (codigo, titulo, descricao, tipo, categoria, url, tags, ordem, ativo) VALUES
(
  'pdf-script-apresentacao-produtos',
  'Scripts de Apresentação de Produtos',
  'PDF com scripts para apresentar produtos (Energia, Acelera, Turbo, Hype) de forma leve e eficaz.',
  'pdf',
  'script',
  'https://placeholder-url.com/scripts/apresentacao-produtos.pdf',
  ARRAY['apresentacao', 'script', 'produtos', 'vendas', 'primeira-versao', 'pdf'],
  20,
  true
),
(
  'pdf-script-apresentacao-oportunidade',
  'Scripts de Apresentação da Oportunidade',
  'PDF com scripts para apresentar a oportunidade de negócio de forma leve e sem pressão.',
  'pdf',
  'script',
  'https://placeholder-url.com/scripts/apresentacao-oportunidade.pdf',
  ARRAY['apresentacao', 'script', 'oportunidade', 'negocio', 'primeira-versao', 'pdf'],
  21,
  true
);

-- ============================================
-- SCRIPTS DE FECHAMENTO (PDFs)
-- ============================================

INSERT INTO wellness_materiais (codigo, titulo, descricao, tipo, categoria, url, tags, ordem, ativo) VALUES
(
  'pdf-script-fechamento-produtos',
  'Scripts de Fechamento - Produtos',
  'PDF com scripts de fechamento para cada produto: Energia, Acelera, Turbo Detox, Hype, Shake, Fiber, Chá, NRG, CR7, Creatina.',
  'pdf',
  'script',
  'https://placeholder-url.com/scripts/fechamento-produtos.pdf',
  ARRAY['fechamento', 'script', 'produtos', 'vendas', 'primeira-versao', 'pdf'],
  30,
  true
),
(
  'pdf-script-fechamento-kits',
  'Scripts de Fechamento - Kits',
  'PDF com scripts para fechar vendas de kits (Kit Iniciante, Kit Turbo, Kit Completo) de forma natural.',
  'pdf',
  'script',
  'https://placeholder-url.com/scripts/fechamento-kits.pdf',
  ARRAY['fechamento', 'script', 'kits', 'vendas', 'primeira-versao', 'pdf'],
  31,
  true
);

-- ============================================
-- SCRIPTS DE OBJEÇÃO (PDFs)
-- ============================================

INSERT INTO wellness_materiais (codigo, titulo, descricao, tipo, categoria, url, tags, ordem, ativo) VALUES
(
  'pdf-script-objecoes-completo',
  'Scripts de Objeções - Guia Completo',
  'PDF com todas as respostas para objeções comuns: dinheiro, tempo, já tentei, não acredito, não tenho tempo, etc.',
  'pdf',
  'script',
  'https://placeholder-url.com/scripts/objecoes-completo.pdf',
  ARRAY['objecao', 'script', 'respostas', 'vendas', 'primeira-versao', 'pdf'],
  40,
  true
),
(
  'pdf-script-objecao-dinheiro',
  'Scripts de Objeção - Falta de Dinheiro',
  'PDF com respostas específicas para a objeção de falta de dinheiro, incluindo opções de kit acessível e renda extra.',
  'pdf',
  'script',
  'https://placeholder-url.com/scripts/objecao-dinheiro.pdf',
  ARRAY['objecao', 'script', 'dinheiro', 'investimento', 'primeira-versao', 'pdf'],
  41,
  true
),
(
  'pdf-script-objecao-tempo',
  'Scripts de Objeção - Falta de Tempo',
  'PDF com respostas para a objeção de falta de tempo, mostrando como é possível trabalhar com pouco tempo diário.',
  'pdf',
  'script',
  'https://placeholder-url.com/scripts/objecao-tempo.pdf',
  ARRAY['objecao', 'script', 'tempo', 'rotina', 'primeira-versao', 'pdf'],
  42,
  true
);

-- ============================================
-- SCRIPTS DE ONBOARDING (PDFs)
-- ============================================

INSERT INTO wellness_materiais (codigo, titulo, descricao, tipo, categoria, url, tags, ordem, ativo) VALUES
(
  'pdf-script-onboarding-clientes',
  'Scripts de Onboarding - Novos Clientes',
  'PDF com scripts para onboarding de novos clientes: boas-vindas, explicação do produto, como usar, acompanhamento inicial.',
  'pdf',
  'script',
  'https://placeholder-url.com/scripts/onboarding-clientes.pdf',
  ARRAY['onboarding', 'script', 'clientes', 'novos', 'primeira-versao', 'pdf'],
  50,
  true
),
(
  'pdf-script-onboarding-distribuidores',
  'Scripts de Onboarding - Novos Distribuidores',
  'PDF com scripts para onboarding de novos distribuidores: apresentação do sistema, primeiros passos, treinamento inicial.',
  'pdf',
  'script',
  'https://placeholder-url.com/scripts/onboarding-distribuidores.pdf',
  ARRAY['onboarding', 'script', 'distribuidores', 'novos', 'treinamento', 'primeira-versao', 'pdf'],
  51,
  true
);

-- ============================================
-- AULAS DE TREINAMENTO (PDFs)
-- ============================================

INSERT INTO wellness_materiais (codigo, titulo, descricao, tipo, categoria, url, tags, ordem, ativo) VALUES
(
  'pdf-aula-1-fundamentos-wellness',
  'Aula 1: Fundamentos do Wellness System',
  'PDF da primeira aula sobre os fundamentos do Wellness System: o que é, como funciona, os 3 pilares.',
  'pdf',
  'script',
  'https://placeholder-url.com/aulas/aula-1-fundamentos.pdf',
  ARRAY['aula', 'treinamento', 'fundamentos', 'wellness-system', 'primeira-versao', 'pdf'],
  60,
  true
),
(
  'pdf-aula-2-3-pilares',
  'Aula 2: Os 3 Pilares do Wellness System',
  'PDF da segunda aula explicando os 3 pilares: Atração Inteligente, Diagnóstico WOW e Oferta e Conversão.',
  'pdf',
  'script',
  'https://placeholder-url.com/aulas/aula-2-3-pilares.pdf',
  ARRAY['aula', 'treinamento', '3-pilares', 'wellness-system', 'primeira-versao', 'pdf'],
  61,
  true
),
(
  'pdf-aula-3-funcionamento-pratico',
  'Aula 3: Como o Modelo Funciona na Prática',
  'PDF da terceira aula mostrando o funcionamento prático do Wellness System: fluxos, ferramentas e exemplos reais.',
  'pdf',
  'script',
  'https://placeholder-url.com/aulas/aula-3-funcionamento-pratico.pdf',
  ARRAY['aula', 'treinamento', 'pratica', 'fluxos', 'primeira-versao', 'pdf'],
  62,
  true
),
(
  'pdf-aula-4-por-que-converte',
  'Aula 4: Por que o Wellness System Converte Tanto',
  'PDF da quarta aula explicando os fatores que fazem o Wellness System ter alta taxa de conversão.',
  'pdf',
  'script',
  'https://placeholder-url.com/aulas/aula-4-por-que-converte.pdf',
  ARRAY['aula', 'treinamento', 'conversao', 'estrategia', 'primeira-versao', 'pdf'],
  63,
  true
),
(
  'pdf-aula-5-ferramentas',
  'Aula 5: Visão Geral das Ferramentas',
  'PDF da quinta aula com visão geral de todas as ferramentas disponíveis no Wellness System.',
  'pdf',
  'script',
  'https://placeholder-url.com/aulas/aula-5-ferramentas.pdf',
  ARRAY['aula', 'treinamento', 'ferramentas', 'overview', 'primeira-versao', 'pdf'],
  64,
  true
);

-- ============================================
-- SCRIPTS DE RECRUTAMENTO (PDFs)
-- ============================================

INSERT INTO wellness_materiais (codigo, titulo, descricao, tipo, categoria, url, tags, ordem, ativo) VALUES
(
  'pdf-script-recrutamento-completo',
  'Scripts de Recrutamento - Guia Completo',
  'PDF com todos os scripts de recrutamento: abertura, apresentação da oportunidade, fechamento, follow-up.',
  'pdf',
  'script',
  'https://placeholder-url.com/scripts/recrutamento-completo.pdf',
  ARRAY['recrutamento', 'script', 'oportunidade', 'negocio', 'primeira-versao', 'pdf'],
  70,
  true
),
(
  'pdf-script-recrutamento-leads-especificos',
  'Scripts de Recrutamento - Leads Específicos',
  'PDF com scripts para recrutar leads específicos: mães, desempregadas, empreendedoras, jovens, etc.',
  'pdf',
  'script',
  'https://placeholder-url.com/scripts/recrutamento-leads-especificos.pdf',
  ARRAY['recrutamento', 'script', 'leads-especificos', 'publico-alvo', 'primeira-versao', 'pdf'],
  71,
  true
);

-- ============================================
-- SCRIPTS GERAIS (PDFs)
-- ============================================

INSERT INTO wellness_materiais (codigo, titulo, descricao, tipo, categoria, url, tags, ordem, ativo) VALUES
(
  'pdf-scripts-completo-primeira-versao',
  'Scripts Completos - Primeira Versão',
  'PDF completo com todos os scripts da primeira versão do Wellness System organizados por categoria.',
  'pdf',
  'script',
  'https://placeholder-url.com/scripts/scripts-completo-primeira-versao.pdf',
  ARRAY['script', 'completo', 'primeira-versao', 'biblioteca', 'pdf'],
  100,
  true
),
(
  'pdf-guia-rapido-scripts',
  'Guia Rápido de Scripts',
  'PDF com guia rápido de referência para todos os scripts principais do Wellness System.',
  'pdf',
  'script',
  'https://placeholder-url.com/scripts/guia-rapido-scripts.pdf',
  ARRAY['script', 'guia-rapido', 'referencia', 'primeira-versao', 'pdf'],
  101,
  true
);

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================
-- 
-- 1. As URLs são placeholders e devem ser atualizadas quando os PDFs
--    forem uploadados para o Supabase Storage.
-- 
-- 2. Para atualizar as URLs após upload:
--    UPDATE wellness_materiais 
--    SET url = 'https://seu-projeto.supabase.co/storage/v1/object/public/wellness-biblioteca/...'
--    WHERE codigo = 'pdf-script-...';
-- 
-- 3. Os PDFs devem ser organizados no bucket 'wellness-biblioteca' do Supabase Storage
--    na pasta 'pdfs/scripts/' ou 'pdfs/aulas/'.
-- 
-- 4. Todos os materiais estão marcados como ativos (ativo = true) e podem ser
--    desativados individualmente se necessário.
-- 
-- ============================================







