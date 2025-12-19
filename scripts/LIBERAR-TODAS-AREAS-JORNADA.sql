-- ==========================================
-- LIBERAR TODAS AS ÁREAS - Jornada 30 Dias
-- ==========================================
-- Data: 2025-12-18
-- Objetivo: Liberar todos os 30 dias da jornada automaticamente
-- Para: Conta demo/teste sem precisar fazer a jornada completa
-- ==========================================

-- ==========================================
-- PASSO 1: Descobrir seu USER_ID
-- ==========================================
-- Execute esta query para ver seus usuários:

SELECT 
  id as user_id,
  email,
  created_at::date as criado_em,
  CASE 
    WHEN email LIKE '%demo%' THEN '👤 CONTA DEMO'
    WHEN email LIKE '%test%' THEN '🧪 CONTA TESTE'
    ELSE '✅ CONTA NORMAL'
  END as tipo
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- ⚠️ COPIE O USER_ID (UUID) do usuário que você quer liberar

-- ==========================================
-- PASSO 2: Verificar Progresso Atual
-- ==========================================
-- Substitua 'SEU-USER-ID-AQUI' pelo UUID copiado acima:

SELECT 
  '📊 PROGRESSO ATUAL' as status,
  COUNT(*) FILTER (WHERE completed = true) as dias_completos,
  COUNT(*) FILTER (WHERE completed = false OR completed IS NULL) as dias_bloqueados,
  30 as total_dias
FROM journey_progress
WHERE user_id = 'SEU-USER-ID-AQUI'::uuid;

-- Se retornar 0 linhas = nenhum progresso registrado ainda (normal)

-- ==========================================
-- PASSO 3: LIBERAR TODOS OS 30 DIAS
-- ==========================================
-- ⚠️ SUBSTITUA 'SEU-USER-ID-AQUI' pelo seu UUID

-- Este script cria progresso para TODOS os 30 dias
-- E marca TODOS como completos

INSERT INTO journey_progress (
  user_id,
  day_number,
  week_number,
  completed,
  completed_at,
  checklist_completed,
  created_at,
  updated_at
)
SELECT 
  'SEU-USER-ID-AQUI'::uuid as user_id,
  day_number,
  week_number,
  true as completed, -- ✅ MARCA COMO COMPLETO
  NOW() as completed_at,
  -- Marca todos os itens do checklist como completos
  (
    SELECT jsonb_agg(true)
    FROM jsonb_array_elements(COALESCE(checklist_items, '[]'::jsonb))
  ) as checklist_completed,
  NOW() as created_at,
  NOW() as updated_at
FROM journey_days
WHERE day_number BETWEEN 1 AND 30
ON CONFLICT (user_id, day_number) 
DO UPDATE SET
  completed = true,
  completed_at = NOW(),
  checklist_completed = (
    SELECT jsonb_agg(true)
    FROM jsonb_array_elements(COALESCE(EXCLUDED.checklist_completed, '[]'::jsonb))
  ),
  updated_at = NOW();

-- ==========================================
-- PASSO 4: VERIFICAR SE FUNCIONOU
-- ==========================================
-- Substitua 'SEU-USER-ID-AQUI' pelo seu UUID:

SELECT 
  '✅ RESULTADO FINAL' as status,
  COUNT(*) as total_dias_liberados,
  COUNT(*) FILTER (WHERE completed = true) as dias_completos,
  COUNT(*) FILTER (WHERE completed = false) as dias_pendentes,
  MIN(day_number) as primeiro_dia,
  MAX(day_number) as ultimo_dia
FROM journey_progress
WHERE user_id = 'SEU-USER-ID-AQUI'::uuid;

-- Deve mostrar: 30 dias liberados, 30 completos, 0 pendentes

-- ==========================================
-- PASSO 5: DETALHAR POR SEMANA
-- ==========================================
SELECT 
  week_number as semana,
  COUNT(*) as dias_na_semana,
  COUNT(*) FILTER (WHERE completed = true) as completos,
  STRING_AGG(day_number::text, ', ' ORDER BY day_number) as dias
FROM journey_progress
WHERE user_id = 'SEU-USER-ID-AQUI'::uuid
GROUP BY week_number
ORDER BY week_number;

-- Deve mostrar todas as 5 semanas completas

-- ==========================================
-- RESUMO VISUAL
-- ==========================================
SELECT 
  jp.day_number as dia,
  jd.title as titulo,
  jp.week_number as semana,
  CASE 
    WHEN jp.completed THEN '✅ Completo'
    ELSE '❌ Pendente'
  END as status,
  jp.completed_at::date as concluido_em
FROM journey_progress jp
JOIN journey_days jd ON jd.day_number = jp.day_number
WHERE jp.user_id = 'SEU-USER-ID-AQUI'::uuid
ORDER BY jp.day_number;

-- ==========================================
-- ALTERNATIVA: Liberar apenas dias 1-7 (Semana 1)
-- ==========================================
-- Se quiser liberar apenas a primeira semana:

/*
INSERT INTO journey_progress (user_id, day_number, week_number, completed, completed_at, created_at, updated_at)
SELECT 
  'SEU-USER-ID-AQUI'::uuid,
  day_number,
  week_number,
  true,
  NOW(),
  NOW(),
  NOW()
FROM journey_days
WHERE day_number BETWEEN 1 AND 7
ON CONFLICT (user_id, day_number) DO UPDATE SET completed = true, completed_at = NOW();
*/

-- ==========================================
-- RESETAR PROGRESSO (se quiser recomeçar)
-- ==========================================
-- ⚠️ CUIDADO: Apaga TODO o progresso deste usuário

/*
DELETE FROM journey_progress 
WHERE user_id = 'SEU-USER-ID-AQUI'::uuid;
*/

-- ==========================================
-- FIM - Todas as áreas liberadas! 🎉
-- ==========================================

