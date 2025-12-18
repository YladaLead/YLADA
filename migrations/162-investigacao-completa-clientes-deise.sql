-- =====================================================
-- MIGRAÇÃO 162: INVESTIGAÇÃO COMPLETA - CLIENTES DA DEISE
-- Data: Dezembro 2025
-- Descrição: Investigação detalhada após confirmar que não há clientes na tabela antiga
-- Email: paula@gmail.com
-- =====================================================

-- =====================================================
-- 1. IDENTIFICAR USUÁRIA E VERIFICAR PERFIL
-- =====================================================
SELECT 
  u.id as user_id,
  u.email,
  u.raw_user_meta_data->>'name' as nome,
  u.created_at as data_criacao_conta,
  up.profile_type as tipo_perfil
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
WHERE u.email = 'paula@gmail.com';

-- =====================================================
-- 2. VERIFICAR CLIENTES EM COACH_CLIENTS (TODOS OS STATUS)
-- =====================================================
-- Ver TODOS os clientes, incluindo deletados
SELECT 
  id,
  name,
  email,
  phone,
  status,
  deleted_at,
  created_at,
  updated_at,
  converted_from_lead,
  lead_source
FROM coach_clients
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'paula@gmail.com'
)
ORDER BY created_at DESC;

-- Contar por status
SELECT 
  status,
  COUNT(*) as total,
  COUNT(CASE WHEN deleted_at IS NULL THEN 1 END) as ativos,
  COUNT(CASE WHEN deleted_at IS NOT NULL THEN 1 END) as deletados
FROM coach_clients
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'paula@gmail.com'
)
GROUP BY status
ORDER BY total DESC;

-- =====================================================
-- 3. VERIFICAR HISTÓRICO COMPLETO (PODE REVELAR CLIENTES QUE EXISTIRAM)
-- =====================================================
-- Ver todas as atividades no histórico
SELECT 
  h.id,
  h.client_id,
  h.activity_type,
  h.title,
  h.description,
  h.metadata,
  h.created_at,
  CASE 
    WHEN cc.id IS NULL THEN '❌ CLIENTE NÃO EXISTE'
    WHEN cc.deleted_at IS NOT NULL THEN '⚠️ CLIENTE DELETADO'
    ELSE '✅ CLIENTE EXISTE'
  END as status_cliente,
  cc.name as nome_cliente_atual
FROM coach_client_history h
LEFT JOIN coach_clients cc ON cc.id = h.client_id
WHERE h.user_id = (
  SELECT id FROM auth.users WHERE email = 'paula@gmail.com'
)
ORDER BY h.created_at DESC
LIMIT 100;

-- =====================================================
-- 4. IDENTIFICAR CLIENTES ÚNICOS NO HISTÓRICO
-- =====================================================
-- Listar todos os client_ids que aparecem no histórico
SELECT DISTINCT
  h.client_id,
  MIN(h.created_at) as primeira_atividade,
  MAX(h.created_at) as ultima_atividade,
  COUNT(*) as total_atividades,
  STRING_AGG(DISTINCT h.activity_type, ', ' ORDER BY h.activity_type) as tipos_atividade,
  CASE 
    WHEN cc.id IS NULL THEN '❌ NÃO EXISTE'
    WHEN cc.deleted_at IS NOT NULL THEN '⚠️ DELETADO'
    ELSE '✅ EXISTE'
  END as status
FROM coach_client_history h
LEFT JOIN coach_clients cc ON cc.id = h.client_id
WHERE h.user_id = (
  SELECT id FROM auth.users WHERE email = 'paula@gmail.com'
)
GROUP BY h.client_id, cc.id, cc.deleted_at
ORDER BY ultima_atividade DESC;

-- =====================================================
-- 5. VERIFICAR AVALIAÇÕES (PODE REVELAR CLIENTES)
-- =====================================================
SELECT 
  a.id,
  a.client_id,
  a.assessment_type,
  a.assessment_name,
  a.created_at,
  CASE 
    WHEN cc.id IS NULL THEN '❌ CLIENTE NÃO EXISTE'
    WHEN cc.deleted_at IS NOT NULL THEN '⚠️ CLIENTE DELETADO'
    ELSE cc.name
  END as nome_cliente,
  cc.deleted_at as cliente_deletado_em
FROM coach_assessments a
LEFT JOIN coach_clients cc ON cc.id = a.client_id
WHERE a.user_id = (
  SELECT id FROM auth.users WHERE email = 'paula@gmail.com'
)
ORDER BY a.created_at DESC;

-- =====================================================
-- 6. VERIFICAR REGISTROS EMOCIONAIS/COMPORTAMENTAIS
-- =====================================================
SELECT 
  e.id,
  e.client_id,
  e.record_type,
  e.record_date,
  e.created_at,
  CASE 
    WHEN cc.id IS NULL THEN '❌ CLIENTE NÃO EXISTE'
    WHEN cc.deleted_at IS NOT NULL THEN '⚠️ CLIENTE DELETADO'
    ELSE cc.name
  END as nome_cliente
FROM coach_emotional_behavioral_history e
LEFT JOIN coach_clients cc ON cc.id = e.client_id
WHERE e.user_id = (
  SELECT id FROM auth.users WHERE email = 'paula@gmail.com'
)
ORDER BY e.created_at DESC
LIMIT 50;

-- =====================================================
-- 7. VERIFICAR LEADS (PODE INDICAR CLIENTES QUE DEVERIAM TER SIDO CRIADOS)
-- =====================================================
SELECT 
  id,
  name,
  email,
  phone,
  source,
  status,
  converted_to_client,
  converted_at,
  created_at
FROM coach_leads
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'paula@gmail.com'
)
ORDER BY created_at DESC;

-- Verificar leads convertidos que não têm cliente correspondente
SELECT 
  l.id as lead_id,
  l.name,
  l.email,
  l.phone,
  l.converted_to_client,
  l.converted_at,
  CASE 
    WHEN cc.id IS NULL THEN '❌ CLIENTE NÃO ENCONTRADO'
    ELSE '✅ CLIENTE EXISTE: ' || cc.name
  END as status_cliente
FROM coach_leads l
LEFT JOIN coach_clients cc ON cc.converted_from_lead = true 
  AND (cc.email = l.email OR cc.phone = l.phone OR cc.lead_source = l.source)
WHERE l.user_id = (
  SELECT id FROM auth.users WHERE email = 'paula@gmail.com'
)
AND l.converted_to_client = true
ORDER BY l.converted_at DESC;

-- =====================================================
-- 8. VERIFICAR SE HÁ CLIENTES COM USER_ID DIFERENTE (ERRO DE ATRIBUIÇÃO)
-- =====================================================
-- Buscar por email/telefone em TODOS os clientes
SELECT 
  cc.id,
  cc.name,
  cc.email,
  cc.phone,
  cc.user_id,
  u.email as email_usuario,
  cc.created_at,
  cc.deleted_at
FROM coach_clients cc
JOIN auth.users u ON u.id = cc.user_id
WHERE cc.email IN (
  SELECT DISTINCT email 
  FROM coach_leads 
  WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
  AND email IS NOT NULL
)
OR cc.phone IN (
  SELECT DISTINCT phone 
  FROM coach_leads 
  WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
  AND phone IS NOT NULL
)
ORDER BY cc.created_at DESC;

-- =====================================================
-- 9. VERIFICAR PROGRAMAS (PODE REVELAR CLIENTES)
-- =====================================================
SELECT 
  p.id,
  p.client_id,
  p.name as nome_programa,
  p.status,
  p.created_at,
  CASE 
    WHEN cc.id IS NULL THEN '❌ CLIENTE NÃO EXISTE'
    WHEN cc.deleted_at IS NOT NULL THEN '⚠️ CLIENTE DELETADO'
    ELSE cc.name
  END as nome_cliente
FROM coach_programs p
LEFT JOIN coach_clients cc ON cc.id = p.client_id
WHERE p.user_id = (
  SELECT id FROM auth.users WHERE email = 'paula@gmail.com'
)
ORDER BY p.created_at DESC;

-- =====================================================
-- 10. RESUMO COMPLETO
-- =====================================================
SELECT 
  '=== RESUMO DE INVESTIGAÇÃO ===' as secao,
  '' as metrica,
  '' as valor
UNION ALL
SELECT 
  '1. Clientes em coach_clients (TODOS)',
  '',
  COUNT(*)::text
FROM coach_clients
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
UNION ALL
SELECT 
  '2. Clientes ativos (não deletados)',
  '',
  COUNT(*)::text
FROM coach_clients
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
AND deleted_at IS NULL
UNION ALL
SELECT 
  '3. Clientes deletados (soft delete)',
  '',
  COUNT(*)::text
FROM coach_clients
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
AND deleted_at IS NOT NULL
UNION ALL
SELECT 
  '4. Total de leads',
  '',
  COUNT(*)::text
FROM coach_leads
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
UNION ALL
SELECT 
  '5. Leads convertidos',
  '',
  COUNT(*)::text
FROM coach_leads
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
AND converted_to_client = true
UNION ALL
SELECT 
  '6. Total de atividades no histórico',
  '',
  COUNT(*)::text
FROM coach_client_history
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
UNION ALL
SELECT 
  '7. Clientes únicos no histórico',
  '',
  COUNT(DISTINCT client_id)::text
FROM coach_client_history
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
UNION ALL
SELECT 
  '8. Clientes órfãos (histórico sem cliente)',
  '',
  COUNT(DISTINCT h.client_id)::text
FROM coach_client_history h
WHERE h.user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
AND NOT EXISTS (
  SELECT 1 FROM coach_clients cc WHERE cc.id = h.client_id AND cc.deleted_at IS NULL
)
UNION ALL
SELECT 
  '9. Total de avaliações',
  '',
  COUNT(*)::text
FROM coach_assessments
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
UNION ALL
SELECT 
  '10. Avaliações de clientes inexistentes',
  '',
  COUNT(*)::text
FROM coach_assessments a
WHERE a.user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
AND NOT EXISTS (
  SELECT 1 FROM coach_clients cc WHERE cc.id = a.client_id AND cc.deleted_at IS NULL
);

-- =====================================================
-- 11. VERIFICAR DATAS DE CRIAÇÃO (QUANDO OS CLIENTES FORAM CRIADOS)
-- =====================================================
-- Ver distribuição por data
SELECT 
  DATE(created_at) as data_criacao,
  COUNT(*) as quantidade_clientes,
  STRING_AGG(name, ', ' ORDER BY created_at) as nomes
FROM coach_clients
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
GROUP BY DATE(created_at)
ORDER BY data_criacao DESC;

-- =====================================================
-- 12. VERIFICAR SE HÁ CLIENTES CRIADOS RECENTEMENTE QUE FORAM DELETADOS
-- =====================================================
SELECT 
  id,
  name,
  email,
  phone,
  status,
  created_at,
  deleted_at,
  EXTRACT(EPOCH FROM (deleted_at - created_at))/86400 as dias_entre_criacao_e_exclusao
FROM coach_clients
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
AND deleted_at IS NOT NULL
ORDER BY deleted_at DESC;

-- =====================================================
-- FIM DA INVESTIGAÇÃO
-- =====================================================
-- Execute todas essas queries e me envie os resultados
-- Isso vai nos ajudar a identificar exatamente o que aconteceu









