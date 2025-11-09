-- ============================================
-- LISTAR TEMPLATES FALTANTES - WELLNESS
-- Faltam 4 templates para completar os 35
-- ============================================

WITH templates_esperados AS (
  SELECT name, type FROM (VALUES
    -- Calculadoras (4)
    ('Calculadora de IMC', 'calculadora'),
    ('Calculadora de Proteína', 'calculadora'),
    ('Calculadora de Água', 'calculadora'),
    ('Calculadora de Calorias', 'calculadora'),
    
    -- Planilhas (2)
    ('Checklist Alimentar', 'planilha'),
    ('Checklist Detox', 'planilha'),
    
    -- Guias (4)
    ('Guia de Hidratação', 'guia'),
    ('Guia Nutracêutico', 'guia'),
    ('Guia Proteico', 'guia'),
    ('Mini E-book', 'guia'),
    
    -- Quizzes (24: 22 normais + 2 desafios)
    ('Quiz de Bem-Estar', 'quiz'),
    ('Quiz Detox', 'quiz'),
    ('Quiz Interativo', 'quiz'),
    ('Quiz Energético', 'quiz'),
    ('Quiz Perfil Nutricional', 'quiz'),
    ('Quiz: Alimentação Saudável', 'quiz'),
    ('Quiz: Potencial e Crescimento', 'quiz'),
    ('Quiz: Ganhos e Prosperidade', 'quiz'),
    ('Quiz: Propósito e Equilíbrio', 'quiz'),
    ('Avaliação Inicial', 'quiz'),
    ('Avaliação de Fome Emocional', 'quiz'),
    ('Avaliação de Intolerâncias/Sensibilidades', 'quiz'),
    ('Avaliação do Perfil Metabólico', 'quiz'),
    ('Diagnóstico de Eletrólitos', 'quiz'),
    ('Diagnóstico de Sintomas Intestinais', 'quiz'),
    ('Pronto para Emagrecer com Saúde?', 'quiz'),
    ('Qual é o seu Tipo de Fome?', 'quiz'),
    ('Risco de Síndrome Metabólica', 'quiz'),
    ('Teste de Retenção de Líquidos', 'quiz'),
    ('Você conhece o seu corpo?', 'quiz'),
    ('Você é mais disciplinado ou emocional com a comida?', 'quiz'),
    ('Você está nutrido ou apenas alimentado?', 'quiz'),
    ('Você está se alimentando conforme sua rotina?', 'quiz'),
    ('Desafio 7 Dias', 'quiz'),
    ('Desafio 21 Dias', 'quiz')
  ) AS t(name, type)
),
templates_ativos AS (
  SELECT name, type
  FROM templates_nutrition
  WHERE profession = 'wellness'
    AND language = 'pt'
    AND is_active = true
)
SELECT 
  ROW_NUMBER() OVER (ORDER BY te.type, te.name) as num,
  te.type as tipo,
  te.name as nome_faltante,
  'Este template precisa ser criado ou ativado' as observacao
FROM templates_esperados te
LEFT JOIN templates_ativos ta ON te.name = ta.name AND te.type = ta.type
WHERE ta.name IS NULL
ORDER BY te.type, te.name;


