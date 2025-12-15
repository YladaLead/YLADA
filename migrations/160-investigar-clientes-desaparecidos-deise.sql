-- =====================================================
-- MIGRAÇÃO 160: INVESTIGAR CLIENTES DESAPARECIDOS - DEISE
-- Data: Dezembro 2025
-- Descrição: Investigar por que os clientes da usuária Deise desapareceram
-- Email: paula@gmail.com
-- =====================================================

-- =====================================================
-- 1. IDENTIFICAR USUÁRIA
-- =====================================================
SELECT 
  id as user_id,
  email,
  raw_user_meta_data->>'name' as nome,
  created_at as data_criacao
FROM auth.users
WHERE email = 'paula@gmail.com';

-- Guardar o user_id encontrado para usar nas próximas queries
-- Exemplo: se o user_id for '123e4567-e89b-12d3-a456-426614174000'

-- =====================================================
-- 2. VERIFICAR CLIENTES NA TABELA COACH_CLIENTS (NOVA)
-- =====================================================
-- Substitua 'USER_ID_AQUI' pelo user_id encontrado acima
SELECT 
  id,
  name,
  email,
  phone,
  status,
  created_at,
  updated_at,
  converted_from_lead,
  lead_source,
  deleted_at
FROM coach_clients
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'paula@gmail.com'
)
ORDER BY created_at DESC;

-- Contar total de clientes
SELECT 
  COUNT(*) as total_clientes_coach,
  COUNT(CASE WHEN deleted_at IS NULL THEN 1 END) as clientes_ativos,
  COUNT(CASE WHEN deleted_at IS NOT NULL THEN 1 END) as clientes_deletados
FROM coach_clients
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'paula@gmail.com'
);

-- =====================================================
-- 3. VERIFICAR CLIENTES NA TABELA CLIENTS (ANTIGA - NUTRI)
-- =====================================================
-- Pode ser que os clientes estejam na tabela antiga
SELECT 
  id,
  name,
  email,
  phone,
  status,
  created_at,
  updated_at,
  converted_from_lead,
  lead_source
FROM clients
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'paula@gmail.com'
)
ORDER BY created_at DESC;

-- Contar total na tabela antiga
SELECT 
  COUNT(*) as total_clientes_nutri
FROM clients
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'paula@gmail.com'
);

-- =====================================================
-- 4. VERIFICAR HISTÓRICO DE ATIVIDADES DOS CLIENTES
-- =====================================================
-- Verificar se há histórico de clientes que existiam
SELECT 
  h.id,
  h.client_id,
  h.activity_type,
  h.title,
  h.description,
  h.metadata,
  h.created_at
FROM coach_client_history h
WHERE h.user_id = (
  SELECT id FROM auth.users WHERE email = 'paula@gmail.com'
)
ORDER BY h.created_at DESC
LIMIT 50;

-- Verificar se há clientes referenciados no histórico que não existem mais
SELECT DISTINCT
  h.client_id,
  h.activity_type,
  h.title,
  h.created_at as ultima_atividade,
  CASE 
    WHEN cc.id IS NULL THEN 'CLIENTE NÃO ENCONTRADO'
    ELSE 'CLIENTE EXISTE'
  END as status_cliente
FROM coach_client_history h
LEFT JOIN coach_clients cc ON cc.id = h.client_id
WHERE h.user_id = (
  SELECT id FROM auth.users WHERE email = 'paula@gmail.com'
)
ORDER BY h.created_at DESC;

-- =====================================================
-- 5. VERIFICAR LEADS QUE PODERIAM TER SIDO CONVERTIDOS
-- =====================================================
SELECT 
  id,
  name,
  email,
  phone,
  source,
  status,
  converted_to_client,
  created_at
FROM coach_leads
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'paula@gmail.com'
)
ORDER BY created_at DESC;

-- =====================================================
-- 6. VERIFICAR AVALIAÇÕES E OUTROS DADOS RELACIONADOS
-- =====================================================
-- Verificar avaliações físicas
SELECT 
  a.id,
  a.client_id,
  a.assessment_type,
  a.assessment_name,
  a.created_at,
  CASE 
    WHEN cc.id IS NULL THEN 'CLIENTE NÃO ENCONTRADO'
    ELSE cc.name
  END as nome_cliente
FROM coach_assessments a
LEFT JOIN coach_clients cc ON cc.id = a.client_id
WHERE a.user_id = (
  SELECT id FROM auth.users WHERE email = 'paula@gmail.com'
)
ORDER BY a.created_at DESC
LIMIT 20;

-- =====================================================
-- 7. VERIFICAR SE HÁ CLIENTES COM USER_ID DIFERENTE (ERRO DE ATRIBUIÇÃO)
-- =====================================================
-- Buscar clientes por email/telefone que podem ter sido atribuídos ao usuário errado
SELECT 
  cc.id,
  cc.name,
  cc.email,
  cc.phone,
  cc.user_id,
  u.email as email_usuario,
  cc.created_at
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
);

-- =====================================================
-- 8. VERIFICAR LOGS DE EXCLUSÃO OU MUDANÇAS DE STATUS
-- =====================================================
-- Verificar histórico de mudanças de status para 'encerrado' ou exclusões
SELECT 
  h.id,
  h.client_id,
  h.activity_type,
  h.title,
  h.description,
  h.metadata->>'status_anterior' as status_anterior,
  h.metadata->>'status_novo' as status_novo,
  h.created_at
FROM coach_client_history h
WHERE h.user_id = (
  SELECT id FROM auth.users WHERE email = 'paula@gmail.com'
)
AND (
  h.activity_type = 'status_alterado' 
  OR h.activity_type = 'cliente_deletado'
  OR h.metadata->>'status_novo' = 'encerrado'
)
ORDER BY h.created_at DESC;

-- =====================================================
-- 9. RESUMO COMPLETO
-- =====================================================
SELECT 
  'Total de clientes em coach_clients' as metrica,
  COUNT(*)::text as valor
FROM coach_clients
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
UNION ALL
SELECT 
  'Clientes ativos (não deletados)',
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
  'Total de clientes em clients (tabela antiga)',
  COUNT(*)::text
FROM clients
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
UNION ALL
SELECT 
  'Total de leads',
  COUNT(*)::text
FROM coach_leads
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
UNION ALL
SELECT 
  'Leads convertidos',
  COUNT(*)::text
FROM coach_leads
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
AND converted_to_client = true
UNION ALL
SELECT 
  'Total de avaliações',
  COUNT(*)::text
FROM coach_assessments
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
UNION ALL
SELECT 
  'Total de registros no histórico',
  COUNT(*)::text
FROM coach_client_history
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com');

-- =====================================================
-- 10. VERIFICAR SE HÁ CLIENTES COM DATAS RECENTES DE CRIAÇÃO
-- =====================================================
-- Verificar se os clientes foram criados recentemente ou se são antigos
SELECT 
  DATE(created_at) as data_criacao,
  COUNT(*) as quantidade,
  STRING_AGG(name, ', ' ORDER BY created_at) as nomes
FROM coach_clients
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
GROUP BY DATE(created_at)
ORDER BY data_criacao DESC;

-- =====================================================
-- FIM DA INVESTIGAÇÃO
-- =====================================================
-- Execute estas queries no Supabase SQL Editor para identificar:
-- 1. Se os clientes estão na tabela coach_clients
-- 2. Se estão na tabela clients (antiga)
-- 3. Se foram deletados (soft delete)
-- 4. Se há histórico de atividades que indicam que existiam
-- 5. Se há problema de atribuição de user_id

