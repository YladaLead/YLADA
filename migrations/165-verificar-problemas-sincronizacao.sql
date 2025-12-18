-- =====================================================
-- MIGRAÇÃO 165: VERIFICAR PROBLEMAS DE SINCRONIZAÇÃO
-- Data: Dezembro 2025
-- Descrição: Verificar se há problemas de sincronização que causaram perda de clientes
-- Email: paula@gmail.com
-- =====================================================

-- =====================================================
-- 1. VERIFICAR SE HÁ CLIENTES COM USER_ID INCORRETO
-- =====================================================
-- Buscar clientes que podem ter sido atribuídos a outro usuário
-- por erro de sincronização ou migração

-- Verificar se há clientes criados pela Deise mas com user_id diferente
SELECT 
  cc.id,
  cc.name,
  cc.email,
  cc.phone,
  cc.user_id as user_id_atual,
  u.email as email_usuario_atual,
  cc.created_at,
  cc.lead_source,
  -- Verificar se há leads da Deise com mesmo email/telefone
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM coach_leads l 
      WHERE l.user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
      AND (l.email = cc.email OR l.phone = cc.phone)
    ) THEN '⚠️ POSSÍVEL CLIENTE DA DEISE'
    ELSE 'OK'
  END as possivel_erro
FROM coach_clients cc
JOIN auth.users u ON u.id = cc.user_id
WHERE (
  -- Buscar por email/telefone que aparecem nos leads da Deise
  cc.email IN (
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
)
AND cc.user_id != (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
ORDER BY cc.created_at DESC;

-- =====================================================
-- 2. VERIFICAR SE HÁ CLIENTES CRIADOS RECENTEMENTE QUE SUMIRAM
-- =====================================================
-- Verificar histórico de criação de clientes
SELECT 
  DATE(h.created_at) as data,
  COUNT(*) as total_criacoes,
  STRING_AGG(DISTINCT h.metadata->>'name', ', ') as nomes_criados
FROM coach_client_history h
WHERE h.user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
AND h.activity_type = 'cliente_criado'
GROUP BY DATE(h.created_at)
ORDER BY data DESC
LIMIT 30;

-- =====================================================
-- 3. VERIFICAR SE HÁ CLIENTES COM DATAS DE CRIAÇÃO RECENTES
-- =====================================================
-- Verificar se os clientes foram criados e depois deletados rapidamente
SELECT 
  DATE(created_at) as data_criacao,
  COUNT(*) as total_criados,
  COUNT(CASE WHEN deleted_at IS NOT NULL THEN 1 END) as deletados,
  STRING_AGG(name, ', ' ORDER BY created_at) as nomes
FROM coach_clients
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
GROUP BY DATE(created_at)
ORDER BY data_criacao DESC
LIMIT 30;

-- =====================================================
-- 4. VERIFICAR SE HÁ PROBLEMA COM RLS (Row Level Security)
-- =====================================================
-- Verificar se as políticas RLS estão bloqueando a visualização
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'coach_clients'
ORDER BY policyname;

-- =====================================================
-- 5. VERIFICAR SE HÁ CLIENTES COM STATUS QUE IMPEDEM VISUALIZAÇÃO
-- =====================================================
-- Verificar distribuição de status
SELECT 
  status,
  COUNT(*) as total,
  COUNT(CASE WHEN deleted_at IS NULL THEN 1 END) as ativos,
  COUNT(CASE WHEN deleted_at IS NOT NULL THEN 1 END) as deletados,
  STRING_AGG(name, ', ' ORDER BY created_at) as nomes
FROM coach_clients
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
GROUP BY status
ORDER BY total DESC;

-- =====================================================
-- 6. VERIFICAR SE HÁ CLIENTES COM USER_ID NULL OU INVÁLIDO
-- =====================================================
SELECT 
  id,
  name,
  email,
  phone,
  user_id,
  created_at,
  status
FROM coach_clients
WHERE user_id IS NULL
OR user_id NOT IN (SELECT id FROM auth.users)
ORDER BY created_at DESC
LIMIT 20;

-- =====================================================
-- 7. VERIFICAR SE HÁ DUPLICATAS (MESMO CLIENTE COM IDs DIFERENTES)
-- =====================================================
-- Identificar possíveis duplicatas por email/telefone
SELECT 
  email,
  phone,
  COUNT(*) as total_duplicatas,
  STRING_AGG(id::text, ', ') as ids,
  STRING_AGG(name, ', ') as nomes,
  STRING_AGG(user_id::text, ', ') as user_ids
FROM coach_clients
WHERE (email IS NOT NULL OR phone IS NOT NULL)
AND user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
GROUP BY email, phone
HAVING COUNT(*) > 1;

-- =====================================================
-- 8. VERIFICAR LOGS DE ERRO OU EXCLUSÃO EM MASSA
-- =====================================================
-- Verificar se há padrão de exclusão em massa
SELECT 
  DATE(created_at) as data,
  activity_type,
  COUNT(*) as total,
  STRING_AGG(DISTINCT title, ' | ') as titulos
FROM coach_client_history
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
AND (
  activity_type = 'cliente_deletado'
  OR activity_type = 'status_alterado'
  OR title ILIKE '%delet%'
  OR title ILIKE '%exclu%'
)
GROUP BY DATE(created_at), activity_type
ORDER BY data DESC, total DESC
LIMIT 20;

-- =====================================================
-- 9. VERIFICAR SE HÁ CLIENTES CRIADOS POR OUTRO MÉTODO
-- =====================================================
-- Verificar se há clientes criados via API diferente ou importação
SELECT 
  id,
  name,
  email,
  phone,
  status,
  converted_from_lead,
  lead_source,
  created_at,
  created_by,
  CASE 
    WHEN created_by != user_id THEN '⚠️ Criado por outro usuário'
    ELSE 'OK'
  END as observacao
FROM coach_clients
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
ORDER BY created_at DESC;

-- =====================================================
-- 10. VERIFICAR SE HÁ PROBLEMA COM FILTROS NA API
-- =====================================================
-- Verificar se há clientes que não aparecem por causa de filtros
SELECT 
  'Clientes com status ativo' as filtro,
  COUNT(*) as total
FROM coach_clients
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
AND status = 'ativo'
AND deleted_at IS NULL
UNION ALL
SELECT 
  'Clientes com qualquer status',
  COUNT(*)
FROM coach_clients
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
AND deleted_at IS NULL
UNION ALL
SELECT 
  'Clientes incluindo deletados',
  COUNT(*)
FROM coach_clients
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com');

-- =====================================================
-- FIM DA VERIFICAÇÃO DE SINCRONIZAÇÃO
-- =====================================================








