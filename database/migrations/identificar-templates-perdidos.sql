-- =====================================================
-- IDENTIFICAR TEMPLATES PERDIDOS ENTRE ONTEM E HOJE
-- =====================================================
-- Este script compara os templates que existem hoje
-- com os que deveriam existir e identifica quais foram perdidos
-- =====================================================

-- 1. LISTA COMPLETA DE TEMPLATES QUE DEVERIAM EXISTIR (do arquivo migrar-38-templates-wellness.sql)
-- Total esperado: 52 templates

WITH templates_esperados AS (
  SELECT name, type FROM (VALUES
    -- Calculadoras (4)
    ('Calculadora de IMC', 'calculadora'),
    ('Calculadora de Proteína', 'calculadora'),
    ('Calculadora de Água', 'calculadora'),
    ('Calculadora de Calorias', 'calculadora'),
    -- Quizzes (35)
    ('Quiz de Perfil Nutricional', 'quiz'),
    ('Quiz: Perfil de Bem-Estar', 'quiz'),
    ('Quiz: Alimentação Saudável', 'quiz'),
    ('Quiz: Ganhos e Prosperidade', 'quiz'),
    ('Quiz: Potencial e Crescimento', 'quiz'),
    ('Quiz: Propósito e Equilíbrio', 'quiz'),
    ('Quiz: Diagnóstico de Parasitas', 'quiz'),
    ('Avaliação Nutricional', 'quiz'),
    ('Avaliação Inicial', 'quiz'),
    ('Story Interativo', 'quiz'),
    ('Formulário de Recomendações', 'quiz'),
    ('Simulador de Resultados', 'quiz'),
    ('Quiz Interativo', 'quiz'),
    ('Quiz de Bem-Estar', 'quiz'),
    ('Quiz Detox', 'quiz'),
    ('Quiz Energético', 'quiz'),
    ('Diagnóstico de Parasitose', 'quiz'),
    ('Diagnóstico de Eletrólitos', 'quiz'),
    ('Avaliação do Perfil Metabólico', 'quiz'),
    ('Diagnóstico de Sintomas Intestinais', 'quiz'),
    ('Avaliação do Sono e Energia', 'quiz'),
    ('Teste de Retenção de Líquidos', 'quiz'),
    ('Avaliação de Fome Emocional', 'quiz'),
    ('Diagnóstico do Tipo de Metabolismo', 'quiz'),
    ('Você é mais disciplinado ou emocional com a comida?', 'quiz'),
    ('Você está nutrido ou apenas alimentado?', 'quiz'),
    ('Qual é seu perfil de intestino?', 'quiz'),
    ('Avaliação de Intolerâncias/Sensibilidades', 'quiz'),
    ('Risco de Síndrome Metabólica', 'quiz'),
    ('Descubra seu Perfil de Bem-Estar', 'quiz'),
    ('Qual é o seu Tipo de Fome?', 'quiz'),
    ('Seu corpo está pedindo Detox?', 'quiz'),
    ('Você está se alimentando conforme sua rotina?', 'quiz'),
    ('Pronto para Emagrecer com Saúde?', 'quiz'),
    ('Você conhece o seu corpo?', 'quiz'),
    -- Checklists (2)
    ('Checklist Detox', 'planilha'),
    ('Checklist Alimentar', 'planilha'),
    -- Planilhas (14)
    ('Tabela Bem-Estar Diário', 'planilha'),
    ('Diário Alimentar', 'planilha'),
    ('Rastreador de Alimentos', 'planilha'),
    ('Guia de Hidratação', 'planilha'),
    ('Metas Semanais', 'planilha'),
    ('Desafio 21 Dias', 'planilha'),
    ('Desafio 7 Dias', 'planilha'),
    ('Cardápio Detox', 'planilha'),
    ('Receitas Saudáveis', 'planilha'),
    ('Infográfico', 'planilha'),
    ('Planejador Semanal', 'planilha')
  ) AS t(name, type)
)
SELECT 
  '📋 TEMPLATES QUE DEVERIAM EXISTIR' as info,
  COUNT(*) as total_esperado
FROM templates_esperados;

-- 2. TEMPLATES QUE EXISTEM NO BANCO HOJE
SELECT 
  '✅ TEMPLATES QUE EXISTEM NO BANCO' as info,
  COUNT(*) as total_no_banco,
  COUNT(CASE WHEN DATE(created_at) = '2025-11-05' THEN 1 END) as criados_ontem,
  COUNT(CASE WHEN DATE(created_at) = '2025-11-06' THEN 1 END) as criados_hoje
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt';

-- 3. TEMPLATES QUE ESTÃO FALTANDO (esperados mas não existem no banco)
WITH templates_esperados AS (
  SELECT name, type FROM (VALUES
    ('Calculadora de IMC', 'calculadora'),
    ('Calculadora de Proteína', 'calculadora'),
    ('Calculadora de Água', 'calculadora'),
    ('Calculadora de Calorias', 'calculadora'),
    ('Quiz de Perfil Nutricional', 'quiz'),
    ('Quiz: Perfil de Bem-Estar', 'quiz'),
    ('Quiz: Alimentação Saudável', 'quiz'),
    ('Quiz: Ganhos e Prosperidade', 'quiz'),
    ('Quiz: Potencial e Crescimento', 'quiz'),
    ('Quiz: Propósito e Equilíbrio', 'quiz'),
    ('Quiz: Diagnóstico de Parasitas', 'quiz'),
    ('Avaliação Nutricional', 'quiz'),
    ('Avaliação Inicial', 'quiz'),
    ('Story Interativo', 'quiz'),
    ('Formulário de Recomendações', 'quiz'),
    ('Simulador de Resultados', 'quiz'),
    ('Quiz Interativo', 'quiz'),
    ('Quiz de Bem-Estar', 'quiz'),
    ('Quiz Detox', 'quiz'),
    ('Quiz Energético', 'quiz'),
    ('Diagnóstico de Parasitose', 'quiz'),
    ('Diagnóstico de Eletrólitos', 'quiz'),
    ('Avaliação do Perfil Metabólico', 'quiz'),
    ('Diagnóstico de Sintomas Intestinais', 'quiz'),
    ('Avaliação do Sono e Energia', 'quiz'),
    ('Teste de Retenção de Líquidos', 'quiz'),
    ('Avaliação de Fome Emocional', 'quiz'),
    ('Diagnóstico do Tipo de Metabolismo', 'quiz'),
    ('Você é mais disciplinado ou emocional com a comida?', 'quiz'),
    ('Você está nutrido ou apenas alimentado?', 'quiz'),
    ('Qual é seu perfil de intestino?', 'quiz'),
    ('Avaliação de Intolerâncias/Sensibilidades', 'quiz'),
    ('Risco de Síndrome Metabólica', 'quiz'),
    ('Descubra seu Perfil de Bem-Estar', 'quiz'),
    ('Qual é o seu Tipo de Fome?', 'quiz'),
    ('Seu corpo está pedindo Detox?', 'quiz'),
    ('Você está se alimentando conforme sua rotina?', 'quiz'),
    ('Pronto para Emagrecer com Saúde?', 'quiz'),
    ('Você conhece o seu corpo?', 'quiz'),
    ('Checklist Detox', 'planilha'),
    ('Checklist Alimentar', 'planilha'),
    ('Tabela Bem-Estar Diário', 'planilha'),
    ('Diário Alimentar', 'planilha'),
    ('Rastreador de Alimentos', 'planilha'),
    ('Guia de Hidratação', 'planilha'),
    ('Metas Semanais', 'planilha'),
    ('Desafio 21 Dias', 'planilha'),
    ('Desafio 7 Dias', 'planilha'),
    ('Cardápio Detox', 'planilha'),
    ('Receitas Saudáveis', 'planilha'),
    ('Infográfico', 'planilha'),
    ('Planejador Semanal', 'planilha')
  ) AS t(name, type)
)
SELECT 
  '❌ TEMPLATES QUE ESTÃO FALTANDO' as info,
  e.name as nome,
  e.type as tipo
FROM templates_esperados e
LEFT JOIN templates_nutrition t ON t.name = e.name 
  AND t.type = e.type
  AND t.profession = 'wellness'
  AND t.language = 'pt'
WHERE t.id IS NULL
ORDER BY e.type, e.name;

-- 4. TEMPLATES QUE EXISTEM NO BANCO MAS NÃO ESTÃO NA LISTA ESPERADA
WITH templates_esperados AS (
  SELECT name, type FROM (VALUES
    ('Calculadora de IMC', 'calculadora'),
    ('Calculadora de Proteína', 'calculadora'),
    ('Calculadora de Água', 'calculadora'),
    ('Calculadora de Calorias', 'calculadora'),
    ('Quiz de Perfil Nutricional', 'quiz'),
    ('Quiz: Perfil de Bem-Estar', 'quiz'),
    ('Quiz: Alimentação Saudável', 'quiz'),
    ('Quiz: Ganhos e Prosperidade', 'quiz'),
    ('Quiz: Potencial e Crescimento', 'quiz'),
    ('Quiz: Propósito e Equilíbrio', 'quiz'),
    ('Quiz: Diagnóstico de Parasitas', 'quiz'),
    ('Avaliação Nutricional', 'quiz'),
    ('Avaliação Inicial', 'quiz'),
    ('Story Interativo', 'quiz'),
    ('Formulário de Recomendações', 'quiz'),
    ('Simulador de Resultados', 'quiz'),
    ('Quiz Interativo', 'quiz'),
    ('Quiz de Bem-Estar', 'quiz'),
    ('Quiz Detox', 'quiz'),
    ('Quiz Energético', 'quiz'),
    ('Diagnóstico de Parasitose', 'quiz'),
    ('Diagnóstico de Eletrólitos', 'quiz'),
    ('Avaliação do Perfil Metabólico', 'quiz'),
    ('Diagnóstico de Sintomas Intestinais', 'quiz'),
    ('Avaliação do Sono e Energia', 'quiz'),
    ('Teste de Retenção de Líquidos', 'quiz'),
    ('Avaliação de Fome Emocional', 'quiz'),
    ('Diagnóstico do Tipo de Metabolismo', 'quiz'),
    ('Você é mais disciplinado ou emocional com a comida?', 'quiz'),
    ('Você está nutrido ou apenas alimentado?', 'quiz'),
    ('Qual é seu perfil de intestino?', 'quiz'),
    ('Avaliação de Intolerâncias/Sensibilidades', 'quiz'),
    ('Risco de Síndrome Metabólica', 'quiz'),
    ('Descubra seu Perfil de Bem-Estar', 'quiz'),
    ('Qual é o seu Tipo de Fome?', 'quiz'),
    ('Seu corpo está pedindo Detox?', 'quiz'),
    ('Você está se alimentando conforme sua rotina?', 'quiz'),
    ('Pronto para Emagrecer com Saúde?', 'quiz'),
    ('Você conhece o seu corpo?', 'quiz'),
    ('Checklist Detox', 'planilha'),
    ('Checklist Alimentar', 'planilha'),
    ('Tabela Bem-Estar Diário', 'planilha'),
    ('Diário Alimentar', 'planilha'),
    ('Rastreador de Alimentos', 'planilha'),
    ('Guia de Hidratação', 'planilha'),
    ('Metas Semanais', 'planilha'),
    ('Desafio 21 Dias', 'planilha'),
    ('Desafio 7 Dias', 'planilha'),
    ('Cardápio Detox', 'planilha'),
    ('Receitas Saudáveis', 'planilha'),
    ('Infográfico', 'planilha'),
    ('Planejador Semanal', 'planilha')
  ) AS t(name, type)
)
SELECT 
  '⚠️ TEMPLATES NO BANCO QUE NÃO ESTÃO NA LISTA ESPERADA' as info,
  t.name as nome,
  t.type as tipo,
  DATE(t.created_at) as data_criacao
FROM templates_nutrition t
LEFT JOIN templates_esperados e ON e.name = t.name AND e.type = t.type
WHERE t.profession = 'wellness'
  AND t.language = 'pt'
  AND e.name IS NULL
ORDER BY t.type, t.name;

-- 5. RESUMO: QUAIS TEMPLATES FORAM PERDIDOS ENTRE ONTEM E HOJE
-- (Templates que existiam ontem mas não existem mais hoje)
-- Como não temos histórico, vamos assumir que os 8 de ontem são os que restaram
-- e os outros 26-28 que você tinha foram perdidos

SELECT 
  '📊 RESUMO: TEMPLATES PERDIDOS' as info,
  'Você tinha aproximadamente 34-36 templates ontem de madrugada' as situacao_ontem,
  'Hoje restam apenas 8 templates com data de ontem' as situacao_hoje,
  'Foram perdidos aproximadamente 26-28 templates' as templates_perdidos,
  'Hoje foram inseridos 44 templates novos' as templates_inseridos_hoje,
  'Total atual: 52 templates' as total_atual;

