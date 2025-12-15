-- =====================================================
-- MIGRAÇÃO 162: MIGRAR CLIENTES ANTIGOS PARA COACH_CLIENTS
-- Data: Dezembro 2025
-- Descrição: Script para migrar clientes da tabela 'clients' para 'coach_clients'
-- =====================================================
-- ⚠️ ATENÇÃO: Execute apenas se os clientes estiverem na tabela errada
-- ⚠️ Este script migra clientes da tabela 'clients' para 'coach_clients' se necessário

-- =====================================================
-- 1. VERIFICAR CLIENTES NA TABELA ANTIGA
-- =====================================================
-- Ver quantos clientes existem na tabela antiga que precisam ser migrados
SELECT 
  u.email,
  u.id as user_id,
  COUNT(*) as total_na_tabela_antiga,
  COUNT(CASE WHEN c.converted_from_lead = true THEN 1 END) as convertidos_de_lead
FROM clients c
JOIN auth.users u ON u.id = c.user_id
WHERE NOT EXISTS (
  SELECT 1 FROM coach_clients cc WHERE cc.id = c.id
)
GROUP BY u.email, u.id
ORDER BY total_na_tabela_antiga DESC;

-- =====================================================
-- 2. MIGRAR CLIENTES DA TABELA CLIENTS PARA COACH_CLIENTS
-- =====================================================
-- ✅ RESULTADO DA VERIFICAÇÃO:
-- - demo.coach@ylada.com: 7 clientes (5 convertidos)
-- - faulaandre@gmail.com: 6 clientes (3 convertidos)
-- - demo.nutri@ylada.com: 6 clientes (4 convertidos)
-- - deisefaula@gmail.com: 3 clientes (0 convertidos)
-- TOTAL: 22 clientes para migrar

INSERT INTO coach_clients (
  id,
  user_id,
  name,
  email,
  phone,
  birth_date,
  gender,
  cpf,
  address_street,
  address_number,
  address_complement,
  address_neighborhood,
  address_city,
  address_state,
  address_zipcode,
  status,
  notes,
  tags,
  custom_fields,
  converted_from_lead,
  lead_source,
  lead_template_id,
  created_at,
  updated_at,
  created_by
)
SELECT 
  c.id,
  c.user_id,
  c.name,
  c.email,
  c.phone,
  c.birth_date,
  c.gender,
  c.cpf,
  c.address_street,
  c.address_number,
  c.address_complement,
  c.address_neighborhood,
  c.address_city,
  c.address_state,
  c.address_zipcode,
  CASE 
    WHEN c.status = 'finalizada' THEN 'encerrado'
    WHEN c.status = 'ativa' THEN 'ativo'
    WHEN c.status = 'pausa' THEN 'pausado'
    WHEN c.status = 'inativo' THEN 'encerrado'
    WHEN c.status = 'lead' THEN 'lead'
    WHEN c.status = 'pre_consulta' THEN 'pre_consulta'
    ELSE COALESCE(c.status, 'ativo')
  END as status,
  c.notes,
  c.tags,
  c.custom_fields,
  c.converted_from_lead,
  c.lead_source,
  c.lead_template_id,
  c.created_at,
  c.updated_at,
  c.created_by
FROM clients c
WHERE NOT EXISTS (
  SELECT 1 FROM coach_clients cc WHERE cc.id = c.id
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 3. VERIFICAR CLIENTES ORFÃOS (COM HISTÓRICO MAS SEM CLIENTE)
-- =====================================================
-- Identificar clientes que têm histórico mas não existem mais
SELECT DISTINCT
  h.client_id,
  h.activity_type,
  h.title,
  h.created_at as ultima_atividade,
  h.metadata
FROM coach_client_history h
WHERE NOT EXISTS (
  SELECT 1 FROM coach_clients cc WHERE cc.id = h.client_id
)
ORDER BY h.created_at DESC
LIMIT 50;

-- =====================================================
-- 4. RESTAURAR CLIENTES ENCERRADOS (OPCIONAL)
-- =====================================================
-- Se os clientes foram encerrados e você quer restaurá-los:
/*
UPDATE coach_clients
SET status = 'ativo'
WHERE status = 'encerrado'
AND updated_at > NOW() - INTERVAL '30 days';
*/

-- =====================================================
-- 5. VERIFICAR MIGRAÇÃO CONCLUÍDA
-- =====================================================
-- Após executar a migração, verifique se todos os clientes foram migrados:
SELECT 
  u.email,
  COUNT(DISTINCT c.id) as clientes_na_tabela_antiga,
  COUNT(DISTINCT cc.id) as clientes_na_tabela_nova,
  COUNT(DISTINCT c.id) - COUNT(DISTINCT cc.id) as clientes_nao_migrados
FROM clients c
JOIN auth.users u ON u.id = c.user_id
LEFT JOIN coach_clients cc ON cc.id = c.id
WHERE u.email IN (
  'demo.coach@ylada.com',
  'faulaandre@gmail.com',
  'demo.nutri@ylada.com',
  'deisefaula@gmail.com'
)
GROUP BY u.email
ORDER BY u.email;

-- =====================================================
-- FIM DO SCRIPT DE MIGRAÇÃO
-- =====================================================
-- ✅ MIGRAÇÃO PRONTA PARA EXECUTAR
-- Execute a seção 2 para migrar os 22 clientes identificados
-- Depois execute a seção 5 para verificar se a migração foi bem-sucedida
