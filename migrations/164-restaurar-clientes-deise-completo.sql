-- =====================================================
-- MIGRAÇÃO 164: RESTAURAR CLIENTES DA DEISE - SCRIPT COMPLETO
-- Data: Dezembro 2025
-- Descrição: Script completo para restaurar clientes da usuária Deise
-- Email: paula@gmail.com
-- ⚠️ Execute apenas após investigação completa
-- =====================================================

-- =====================================================
-- PARTE 1: RESTAURAR CLIENTES DELETADOS (SOFT DELETE)
-- =====================================================
-- Se os clientes foram deletados com soft delete, restaurar:
/*
UPDATE coach_clients
SET deleted_at = NULL
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'paula@gmail.com'
)
AND deleted_at IS NOT NULL;

-- Verificar quantos foram restaurados
SELECT COUNT(*) as clientes_restaurados
FROM coach_clients
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
AND deleted_at IS NULL;
*/

-- =====================================================
-- PARTE 2: RECRIAR CLIENTES A PARTIR DO HISTÓRICO
-- =====================================================
-- Se há clientes órfãos no histórico, recriar a partir dos dados do histórico
/*
-- Primeiro, identificar clientes únicos no histórico que não existem
WITH clientes_orfaos AS (
  SELECT DISTINCT
    h.client_id,
    MIN(h.created_at) as primeira_atividade,
    MAX(h.created_at) as ultima_atividade,
    COUNT(*) as total_atividades,
    -- Tentar extrair nome do histórico
    (SELECT h2.metadata->>'name' FROM coach_client_history h2 
     WHERE h2.client_id = h.client_id AND h2.metadata->>'name' IS NOT NULL 
     LIMIT 1) as nome_do_historico,
    -- Tentar extrair email do histórico
    (SELECT h2.metadata->>'email' FROM coach_client_history h2 
     WHERE h2.client_id = h.client_id AND h2.metadata->>'email' IS NOT NULL 
     LIMIT 1) as email_do_historico
  FROM coach_client_history h
  WHERE h.user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
  AND NOT EXISTS (
    SELECT 1 FROM coach_clients cc 
    WHERE cc.id = h.client_id
  )
  GROUP BY h.client_id
)
INSERT INTO coach_clients (
  id,
  user_id,
  name,
  email,
  status,
  created_at,
  updated_at,
  notes
)
SELECT 
  co.client_id,
  (SELECT id FROM auth.users WHERE email = 'paula@gmail.com'),
  COALESCE(co.nome_do_historico, 'Cliente Recuperado ' || co.client_id::text) as name,
  co.email_do_historico,
  'ativo' as status,
  co.primeira_atividade as created_at,
  co.ultima_atividade as updated_at,
  'Cliente recuperado automaticamente a partir do histórico de atividades' as notes
FROM clientes_orfaos co
ON CONFLICT (id) DO NOTHING;
*/

-- =====================================================
-- PARTE 3: RECRIAR CLIENTES A PARTIR DE AVALIAÇÕES
-- =====================================================
-- Se há avaliações de clientes que não existem, recriar:
/*
WITH avaliacoes_sem_cliente AS (
  SELECT DISTINCT
    a.client_id,
    MIN(a.created_at) as primeira_avaliacao,
    MAX(a.created_at) as ultima_avaliacao,
    COUNT(*) as total_avaliacoes,
    -- Tentar extrair nome dos dados da avaliação
    (SELECT a2.data->>'name' FROM coach_assessments a2 
     WHERE a2.client_id = a.client_id AND a2.data->>'name' IS NOT NULL 
     LIMIT 1) as nome_da_avaliacao
  FROM coach_assessments a
  WHERE a.user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
  AND NOT EXISTS (
    SELECT 1 FROM coach_clients cc WHERE cc.id = a.client_id
  )
  GROUP BY a.client_id
)
INSERT INTO coach_clients (
  id,
  user_id,
  name,
  status,
  created_at,
  updated_at,
  notes
)
SELECT 
  av.client_id,
  (SELECT id FROM auth.users WHERE email = 'paula@gmail.com'),
  COALESCE(av.nome_da_avaliacao, 'Cliente Recuperado ' || av.client_id::text) as name,
  'ativo' as status,
  av.primeira_avaliacao as created_at,
  av.ultima_avaliacao as updated_at,
  'Cliente recuperado automaticamente a partir de avaliações físicas' as notes
FROM avaliacoes_sem_cliente av
ON CONFLICT (id) DO NOTHING;
*/

-- =====================================================
-- PARTE 4: RECRIAR CLIENTES A PARTIR DE REGISTROS EMOCIONAIS
-- =====================================================
-- Se há registros emocionais de clientes que não existem:
/*
WITH registros_sem_cliente AS (
  SELECT DISTINCT
    e.client_id,
    MIN(e.created_at) as primeiro_registro,
    MAX(e.created_at) as ultimo_registro,
    COUNT(*) as total_registros
  FROM coach_emotional_behavioral_history e
  WHERE e.user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
  AND NOT EXISTS (
    SELECT 1 FROM coach_clients cc WHERE cc.id = e.client_id
  )
  GROUP BY e.client_id
)
INSERT INTO coach_clients (
  id,
  user_id,
  name,
  status,
  created_at,
  updated_at,
  notes
)
SELECT 
  r.client_id,
  (SELECT id FROM auth.users WHERE email = 'paula@gmail.com'),
  'Cliente Recuperado ' || r.client_id::text as name,
  'ativo' as status,
  r.primeiro_registro as created_at,
  r.ultimo_registro as updated_at,
  'Cliente recuperado automaticamente a partir de registros emocionais/comportamentais' as notes
FROM registros_sem_cliente r
ON CONFLICT (id) DO NOTHING;
*/

-- =====================================================
-- PARTE 5: RECRIAR CLIENTES A PARTIR DE PROGRAMAS
-- =====================================================
-- Se há programas de clientes que não existem:
/*
WITH programas_sem_cliente AS (
  SELECT DISTINCT
    p.client_id,
    MIN(p.created_at) as primeiro_programa,
    MAX(p.created_at) as ultimo_programa,
    COUNT(*) as total_programas,
    STRING_AGG(p.name, ', ' ORDER BY p.created_at) as nomes_programas
  FROM coach_programs p
  WHERE p.user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
  AND NOT EXISTS (
    SELECT 1 FROM coach_clients cc WHERE cc.id = p.client_id
  )
  GROUP BY p.client_id
)
INSERT INTO coach_clients (
  id,
  user_id,
  name,
  status,
  created_at,
  updated_at,
  notes
)
SELECT 
  pr.client_id,
  (SELECT id FROM auth.users WHERE email = 'paula@gmail.com'),
  'Cliente Recuperado ' || pr.client_id::text as name,
  'ativo' as status,
  pr.primeiro_programa as created_at,
  pr.ultimo_programa as updated_at,
  'Cliente recuperado automaticamente a partir de programas. Programas: ' || pr.nomes_programas as notes
FROM programas_sem_cliente pr
ON CONFLICT (id) DO NOTHING;
*/

-- =====================================================
-- PARTE 6: CORRIGIR STATUS INCORRETOS
-- =====================================================
-- Corrigir status que podem estar impedindo a visualização:
/*
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
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'paula@gmail.com'
)
AND (
  status NOT IN ('ativo', 'inativo', 'pausado', 'encerrado')
  OR status IS NULL
);
*/

-- =====================================================
-- PARTE 7: VERIFICAÇÃO FINAL APÓS RECUPERAÇÃO
-- =====================================================
-- Execute esta query após qualquer recuperação para verificar:
SELECT 
  '=== VERIFICAÇÃO PÓS-RECUPERAÇÃO ===' as secao,
  COUNT(*)::text as total_clientes,
  COUNT(CASE WHEN deleted_at IS NULL THEN 1 END)::text as clientes_ativos,
  COUNT(CASE WHEN status = 'ativo' THEN 1 END)::text as com_status_ativo
FROM coach_clients
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com');

-- Listar todos os clientes recuperados
SELECT 
  id,
  name,
  email,
  phone,
  status,
  created_at,
  deleted_at,
  notes
FROM coach_clients
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paula@gmail.com')
ORDER BY created_at DESC;

-- =====================================================
-- INSTRUÇÕES DE USO
-- =====================================================
-- 1. Execute primeiro a migração 163 para diagnóstico
-- 2. Analise os resultados
-- 3. Descomente APENAS as partes necessárias desta migração 164
-- 4. Execute uma parte por vez
-- 5. Verifique os resultados antes de continuar
-- 6. Faça backup antes de executar qualquer UPDATE ou INSERT








