-- =====================================================
-- Script: Remover duplicata específica (Desafio 7 Dias)
-- Objetivo: manter apenas a versão correta (quiz) e excluir a planilha
-- =====================================================

BEGIN;

-- =====================================================
-- Bloco 1: Remover planilhas/guia duplicados
-- =====================================================
WITH target_planilhas AS (
  SELECT id
  FROM templates_nutrition
  WHERE profession = 'nutri'
    AND language = 'pt'
    AND name IN (
      'Guia Nutracêutico',
      'Guia Proteico',
      'Mini E-book Educativo',
      'Tabela Comparativa',
      'Planilha Dieta Emagrecimento',
      'Tabela de Substituições',
      'Desafio 7 Dias'
    )
)
DELETE FROM user_templates
WHERE template_id IN (SELECT id FROM target_planilhas);

WITH target_planilhas AS (
  SELECT id
  FROM templates_nutrition
  WHERE profession = 'nutri'
    AND language = 'pt'
    AND name IN (
      'Guia Nutracêutico',
      'Guia Proteico',
      'Mini E-book Educativo',
      'Tabela Comparativa',
      'Planilha Dieta Emagrecimento',
      'Tabela de Substituições',
      'Desafio 7 Dias'
    )
)
DELETE FROM templates_nutrition
WHERE id IN (SELECT id FROM target_planilhas);

-- =====================================================
-- Bloco 2: Eliminar duplicados (manter o mais recente)
-- =====================================================
WITH duplicados AS (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY LOWER(name) ORDER BY created_at DESC) AS rn
  FROM templates_nutrition
  WHERE profession = 'nutri'
    AND language = 'pt'
    AND name IN (
      'Avaliação de Intolerâncias/Sensibilidades',
      'Descubra seu Perfil de Bem-Estar',
      'Avaliação do Perfil Metabólico',
      'Diagnóstico de Eletrólitos',
      'Pronto para Emagrecer com Saúde?',
      'Qual é o seu Tipo de Fome?',
      'Quiz de Bem-Estar',
      'Quiz Detox',
      'Quiz Energético',
      'Quiz: Ganhos e Prosperidade',
      'Quiz: Potencial e Crescimento',
      'Quiz: Propósito e Equilíbrio',
      'Risco de Síndrome Metabólica',
      'Teste de Retenção de Líquidos',
      'Você conhece o seu corpo?',
      'Você é mais disciplinado ou emocional com a comida?',
      'Você está nutrido ou apenas alimentado?',
      'Você está se alimentando conforme sua rotina?'
    )
)
, remover AS (
  SELECT id
  FROM duplicados
  WHERE name IN ('Quiz: Ganhos e Prosperidade', 'Quiz: Potencial e Crescimento')
     OR name IN ('Quiz: Propósito e Equilíbrio') -- remove ambos
     OR (name = 'Quiz Energético' AND rn > 1) -- manter apenas 1
     OR (name = 'Teste de Retenção de Líquidos' AND rn > 1) -- manter apenas 1
     OR (name NOT IN (
          'Quiz: Ganhos e Prosperidade',
          'Quiz: Potencial e Crescimento',
          'Quiz: Propósito e Equilíbrio',
          'Quiz Energético',
          'Teste de Retenção de Líquidos'
        ) AND rn > 1)
)
DELETE FROM user_templates
WHERE template_id IN (SELECT id FROM remover);

WITH duplicados AS (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY LOWER(name) ORDER BY created_at DESC) AS rn
  FROM templates_nutrition
  WHERE profession = 'nutri'
    AND language = 'pt'
    AND name IN (
      'Avaliação de Intolerâncias/Sensibilidades',
      'Descubra seu Perfil de Bem-Estar',
      'Avaliação do Perfil Metabólico',
      'Diagnóstico de Eletrólitos',
      'Pronto para Emagrecer com Saúde?',
      'Qual é o seu Tipo de Fome?',
      'Quiz de Bem-Estar',
      'Quiz Detox',
      'Quiz Energético',
      'Quiz: Ganhos e Prosperidade',
      'Quiz: Potencial e Crescimento',
      'Quiz: Propósito e Equilíbrio',
      'Risco de Síndrome Metabólica',
      'Teste de Retenção de Líquidos',
      'Você conhece o seu corpo?',
      'Você é mais disciplinado ou emocional com a comida?',
      'Você está nutrido ou apenas alimentado?',
      'Você está se alimentando conforme sua rotina?'
    )
)
, remover AS (
  SELECT id, name, rn
  FROM duplicados
  WHERE name IN ('Quiz: Ganhos e Prosperidade', 'Quiz: Potencial e Crescimento')
     OR name IN ('Quiz: Propósito e Equilíbrio')
     OR (name = 'Quiz Energético' AND rn > 1)
     OR (name = 'Teste de Retenção de Líquidos' AND rn > 1)
     OR (name NOT IN (
          'Quiz: Ganhos e Prosperidade',
          'Quiz: Potencial e Crescimento',
          'Quiz: Propósito e Equilíbrio',
          'Quiz Energético',
          'Teste de Retenção de Líquidos'
        ) AND rn > 1)
)
DELETE FROM templates_nutrition
WHERE id IN (SELECT id FROM remover);

COMMIT;

