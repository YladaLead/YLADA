-- =====================================================
-- MIGRAÇÃO 166: SCRIPT DE EXECUÇÃO SEGURA - DEISE
-- Data: Dezembro 2025
-- Descrição: Script seguro para restaurar clientes da Deise
-- Email: paula@gmail.com
-- ⚠️ Execute em ordem: 1, 2, 3, 4...
-- =====================================================

-- =====================================================
-- ETAPA 1: DIAGNÓSTICO (SOMENTE LEITURA - SEGURO)
-- =====================================================
-- Execute esta etapa primeiro para ver o estado atual

-- 1.1. Resumo geral
SELECT 
  'Clientes totais' as metrica,
  COUNT(*)::text as valor
FROM coach_clients
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
UNION ALL
SELECT 
  'Clientes ativos',
  COUNT(*)::text
FROM coach_clients
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
AND deleted_at IS NULL
UNION ALL
SELECT 
  'Clientes deletados',
  COUNT(*)::text
FROM coach_clients
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
AND deleted_at IS NOT NULL
UNION ALL
SELECT 
  'Clientes no histórico',
  COUNT(DISTINCT client_id)::text
FROM coach_client_history
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
UNION ALL
SELECT 
  'Clientes órfãos (histórico sem cliente)',
  COUNT(DISTINCT h.client_id)::text
FROM coach_client_history h
WHERE h.user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
AND NOT EXISTS (
  SELECT 1 FROM coach_clients cc 
  WHERE cc.id = h.client_id AND cc.deleted_at IS NULL
);

-- 1.2. Listar clientes deletados
SELECT 
  id,
  name,
  email,
  phone,
  status,
  created_at,
  deleted_at
FROM coach_clients
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
AND deleted_at IS NOT NULL
ORDER BY deleted_at DESC;

-- 1.3. Listar clientes órfãos do histórico
SELECT DISTINCT
  h.client_id,
  MIN(h.created_at) as primeira_atividade,
  MAX(h.created_at) as ultima_atividade,
  COUNT(*) as total_atividades
FROM coach_client_history h
WHERE h.user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
AND NOT EXISTS (
  SELECT 1 FROM coach_clients cc 
  WHERE cc.id = h.client_id AND cc.deleted_at IS NULL
)
GROUP BY h.client_id
ORDER BY ultima_atividade DESC;

-- =====================================================
-- ETAPA 2: RESTAURAR CLIENTES DELETADOS (SOFT DELETE)
-- =====================================================
-- ⚠️ DESCOMENTE APENAS SE HOUVER CLIENTES DELETADOS
-- Execute primeiro a ETAPA 1 para verificar

/*
-- 2.1. Ver quantos serão restaurados
SELECT COUNT(*) as clientes_que_serao_restaurados
FROM coach_clients
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
AND deleted_at IS NOT NULL;

-- 2.2. Restaurar (descomente para executar)
UPDATE coach_clients
SET deleted_at = NULL
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
AND deleted_at IS NOT NULL;

-- 2.3. Verificar restauração
SELECT 
  'Clientes restaurados' as resultado,
  COUNT(*)::text as total
FROM coach_clients
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
AND deleted_at IS NULL;
*/

-- =====================================================
-- ETAPA 3: RECRIAR CLIENTES ÓRFÃOS DO HISTÓRICO
-- =====================================================
-- ⚠️ DESCOMENTE APENAS SE HOUVER CLIENTES ÓRFÃOS
-- Execute primeiro a ETAPA 1 para verificar

/*
-- 3.1. Ver quantos serão recriados
SELECT COUNT(DISTINCT h.client_id) as clientes_que_serao_recriados
FROM coach_client_history h
WHERE h.user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
AND NOT EXISTS (
  SELECT 1 FROM coach_clients cc 
  WHERE cc.id = h.client_id
);

-- 3.2. Recriar clientes do histórico (descomente para executar)
INSERT INTO coach_clients (
  id,
  user_id,
  name,
  status,
  created_at,
  updated_at,
  notes
)
SELECT DISTINCT
  h.client_id,
  (SELECT id FROM auth.users WHERE email = 'paula@gmail.com'),
  'Cliente Recuperado ' || h.client_id::text as name,
  'ativo' as status,
  MIN(h.created_at) as created_at,
  MAX(h.created_at) as updated_at,
  'Cliente recuperado automaticamente a partir do histórico' as notes
FROM coach_client_history h
WHERE h.user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
AND NOT EXISTS (
  SELECT 1 FROM coach_clients cc WHERE cc.id = h.client_id
)
GROUP BY h.client_id
ON CONFLICT (id) DO NOTHING;

-- 3.3. Verificar recriação
SELECT 
  'Clientes recriados do histórico' as resultado,
  COUNT(*)::text as total
FROM coach_clients
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
AND notes LIKE '%recuperado automaticamente a partir do histórico%';
*/

-- =====================================================
-- ETAPA 4: CORRIGIR STATUS INCORRETOS
-- =====================================================
-- ⚠️ DESCOMENTE APENAS SE HOUVER STATUS INCORRETOS

/*
-- 4.1. Ver quais status serão corrigidos
SELECT 
  status,
  COUNT(*) as total
FROM coach_clients
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
AND status NOT IN ('ativo', 'inativo', 'pausado', 'encerrado')
GROUP BY status;

-- 4.2. Corrigir status (descomente para executar)
UPDATE coach_clients
SET status = CASE 
  WHEN status = 'finalizada' THEN 'encerrado'
  WHEN status = 'ativa' THEN 'ativo'
  WHEN status = 'pausa' THEN 'pausado'
  WHEN status = 'inativo' THEN 'encerrado'
  WHEN status = 'lead' THEN 'ativo'
  WHEN status = 'pre_consulta' THEN 'ativo'
  WHEN status IS NULL THEN 'ativo'
  ELSE status
END
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
AND (
  status NOT IN ('ativo', 'inativo', 'pausado', 'encerrado')
  OR status IS NULL
);

-- 4.3. Verificar correção
SELECT 
  status,
  COUNT(*) as total
FROM coach_clients
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
GROUP BY status
ORDER BY total DESC;
*/

-- =====================================================
-- ETAPA 5: VERIFICAÇÃO FINAL
-- =====================================================
-- Execute sempre após qualquer recuperação

SELECT 
  '=== VERIFICAÇÃO FINAL ===' as secao,
  COUNT(*)::text as total_clientes,
  COUNT(CASE WHEN deleted_at IS NULL THEN 1 END)::text as clientes_ativos,
  COUNT(CASE WHEN status = 'ativo' THEN 1 END)::text as com_status_ativo
FROM coach_clients
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com');

-- Listar todos os clientes finais
SELECT 
  id,
  name,
  email,
  phone,
  status,
  created_at,
  deleted_at,
  CASE 
    WHEN deleted_at IS NOT NULL THEN '⚠️ DELETADO'
    WHEN status NOT IN ('ativo', 'inativo', 'pausado', 'encerrado') THEN '⚠️ STATUS INVÁLIDO'
    ELSE '✅ OK'
  END as observacao
FROM coach_clients
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
ORDER BY 
  CASE WHEN deleted_at IS NULL THEN 0 ELSE 1 END,
  created_at DESC;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
-- INSTRUÇÕES:
-- 1. Execute a ETAPA 1 primeiro (só leitura, seguro)
-- 2. Me envie os resultados
-- 3. Com base nos resultados, descomente apenas as etapas necessárias
-- 4. Execute uma etapa por vez
-- 5. Verifique os resultados antes de continuar




















