-- =====================================================
-- QUERY RÁPIDA: INVESTIGAR CLIENTES DA DEISE
-- Email: paula@gmail.com
-- Execute esta query primeiro para diagnóstico rápido
-- =====================================================

-- QUERY ÚNICA COM TODOS OS RESULTADOS
WITH user_info AS (
  SELECT id as user_id, email FROM auth.users WHERE email = 'paula@gmail.com'
)
SELECT 
  '=== DIAGNÓSTICO RÁPIDO ===' as tipo,
  '' as id,
  '' as nome,
  '' as email,
  '' as telefone,
  '' as status,
  '' as data,
  '' as observacao
UNION ALL
SELECT 
  '1. Clientes em coach_clients (TODOS)',
  '',
  '',
  '',
  '',
  '',
  '',
  COUNT(*)::text || ' total'
FROM coach_clients, user_info
WHERE user_id = user_info.user_id
UNION ALL
SELECT 
  '2. Clientes ATIVOS (não deletados)',
  '',
  '',
  '',
  '',
  '',
  '',
  COUNT(*)::text || ' ativos'
FROM coach_clients, user_info
WHERE user_id = user_info.user_id AND deleted_at IS NULL
UNION ALL
SELECT 
  '3. Clientes DELETADOS',
  '',
  '',
  '',
  '',
  '',
  '',
  COUNT(*)::text || ' deletados'
FROM coach_clients, user_info
WHERE user_id = user_info.user_id AND deleted_at IS NOT NULL
UNION ALL
SELECT 
  '4. Total de LEADS',
  '',
  '',
  '',
  '',
  '',
  '',
  COUNT(*)::text || ' leads'
FROM coach_leads, user_info
WHERE user_id = user_info.user_id
UNION ALL
SELECT 
  '5. Total de ATIVIDADES no histórico',
  '',
  '',
  '',
  '',
  '',
  '',
  COUNT(*)::text || ' atividades'
FROM coach_client_history, user_info
WHERE user_id = user_info.user_id
UNION ALL
SELECT 
  '6. Clientes ÚNICOS no histórico',
  '',
  '',
  '',
  '',
  '',
  '',
  COUNT(DISTINCT client_id)::text || ' clientes diferentes'
FROM coach_client_history, user_info
WHERE user_id = user_info.user_id
UNION ALL
SELECT 
  '7. Clientes ÓRFÃOS (histórico sem cliente)',
  '',
  '',
  '',
  '',
  '',
  '',
  COUNT(DISTINCT h.client_id)::text || ' clientes órfãos'
FROM coach_client_history h, user_info
WHERE h.user_id = user_info.user_id
AND NOT EXISTS (
  SELECT 1 FROM coach_clients cc 
  WHERE cc.id = h.client_id AND cc.deleted_at IS NULL
);

-- =====================================================
-- LISTAR CLIENTES DELETADOS (SE HOUVER)
-- =====================================================
SELECT 
  id,
  name as nome,
  email,
  phone as telefone,
  status,
  created_at as criado_em,
  deleted_at as deletado_em,
  EXTRACT(EPOCH FROM (deleted_at - created_at))/86400 as dias_antes_de_excluir
FROM coach_clients
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
AND deleted_at IS NOT NULL
ORDER BY deleted_at DESC;

-- =====================================================
-- LISTAR CLIENTES ÚNICOS DO HISTÓRICO (PODE REVELAR CLIENTES QUE EXISTIRAM)
-- =====================================================
SELECT DISTINCT
  h.client_id,
  MIN(h.created_at) as primeira_atividade,
  MAX(h.created_at) as ultima_atividade,
  COUNT(*) as total_atividades,
  CASE 
    WHEN cc.id IS NULL THEN '❌ CLIENTE NÃO EXISTE'
    WHEN cc.deleted_at IS NOT NULL THEN '⚠️ CLIENTE DELETADO'
    ELSE '✅ CLIENTE EXISTE: ' || cc.name
  END as status
FROM coach_client_history h
LEFT JOIN coach_clients cc ON cc.id = h.client_id
WHERE h.user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
GROUP BY h.client_id, cc.id, cc.deleted_at, cc.name
ORDER BY ultima_atividade DESC
LIMIT 20;





















