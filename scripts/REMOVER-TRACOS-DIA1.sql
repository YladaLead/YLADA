-- =====================================================
-- REMOVER TRAVESSÕES (—) DO DIA 1
-- =====================================================
-- Substituir travessões por vírgulas para evitar confusão com "tração"

-- =====================================================
-- DIA 1: Corrigir travessões na Orientação
-- =====================================================
UPDATE journey_days
SET
  -- Substituir "esforço — é" por "esforço, é"
  guidance = REPLACE(guidance, 'esforço — é', 'esforço, é'),
  updated_at = NOW()
WHERE day_number = 1;

-- =====================================================
-- CORRIGIR PILAR 1: Filosofia YLADA
-- =====================================================
-- O subtítulo do Pilar 1 está em src/types/pilares.ts
-- Mas vamos verificar se há no banco também

-- Se houver tabela de pilares no banco, corrigir:
-- UPDATE pilares SET subtitulo = REPLACE(subtitulo, '—', ',') WHERE id = '1';
-- UPDATE pilares SET descricao_introducao = REPLACE(descricao_introducao, '—', ',') WHERE id = '1';

-- =====================================================
-- CORRIGIR TODOS OS TRAVESSÕES EM TODOS OS DIAS
-- =====================================================
UPDATE journey_days
SET
  objective = REPLACE(objective, ' — ', ', '),
  guidance = REPLACE(guidance, ' — ', ', '),
  action_title = REPLACE(action_title, ' — ', ', '),
  motivational_phrase = REPLACE(motivational_phrase, ' — ', ', '),
  updated_at = NOW()
WHERE 
  day_number BETWEEN 1 AND 30
  AND (
    objective LIKE '% — %' OR
    guidance LIKE '% — %' OR
    action_title LIKE '% — %' OR
    motivational_phrase LIKE '% — %'
  );

-- =====================================================
-- VERIFICAÇÃO: Ver o que está no Dia 1 agora
-- =====================================================
SELECT 
  day_number,
  title,
  objective,
  guidance,
  action_title,
  motivational_phrase
FROM journey_days
WHERE day_number = 1;

