-- =====================================================
-- MIGRAÇÃO 161: RECUPERAR CLIENTES DA DEISE (SE NECESSÁRIO)
-- Data: Dezembro 2025
-- Descrição: Script para recuperar clientes da usuária Deise caso estejam na tabela errada
-- Email: paula@gmail.com
-- =====================================================
-- ⚠️ ATENÇÃO: Execute apenas após investigação com a migração 160
-- ⚠️ Este script migra clientes da tabela 'clients' para 'coach_clients' se necessário

-- =====================================================
-- 1. VERIFICAR SE HÁ CLIENTES NA TABELA ANTIGA QUE PRECISAM SER MIGRADOS
-- =====================================================
-- Primeiro, veja quantos clientes existem na tabela antiga
SELECT 
  COUNT(*) as total_na_tabela_antiga,
  COUNT(CASE WHEN converted_from_lead = true THEN 1 END) as convertidos_de_lead
FROM clients
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'paula@gmail.com'
);

-- =====================================================
-- 2. MIGRAR CLIENTES DA TABELA CLIENTS PARA COACH_CLIENTS
-- =====================================================
-- ⚠️ DESCOMENTE APENAS SE CONFIRMAR QUE OS CLIENTES ESTÃO NA TABELA ANTIGA
/*
INSERT INTO coach_clients (
  id, -- Manter o mesmo ID para preservar relacionamentos
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
WHERE c.user_id = (
  SELECT id FROM auth.users WHERE email = 'paula@gmail.com'
)
AND NOT EXISTS (
  SELECT 1 FROM coach_clients cc WHERE cc.id = c.id
)
ON CONFLICT (id) DO NOTHING;
*/

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
WHERE h.user_id = (
  SELECT id FROM auth.users WHERE email = 'paula@gmail.com'
)
AND NOT EXISTS (
  SELECT 1 FROM coach_clients cc WHERE cc.id = h.client_id
)
ORDER BY h.created_at DESC;

-- =====================================================
-- 4. RESTAURAR CLIENTES ENCERRADOS
-- =====================================================
-- Se os clientes foram encerrados, restaurar para ativo:
/*
UPDATE coach_clients
SET status = 'ativo'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'paula@gmail.com'
)
AND status = 'encerrado';
*/

-- =====================================================
-- 5. VERIFICAR E CORRIGIR STATUS INCORRETOS
-- =====================================================
-- Se houver clientes com status inválido, corrigir:
/*
UPDATE coach_clients
SET status = CASE 
  WHEN status = 'finalizada' THEN 'encerrado'
  WHEN status = 'ativa' THEN 'ativo'
  WHEN status = 'pausa' THEN 'pausado'
  WHEN status = 'inativo' THEN 'encerrado'
  ELSE status
END
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'paula@gmail.com'
)
AND status NOT IN ('ativo', 'inativo', 'pausado', 'encerrado');
*/

-- =====================================================
-- FIM DO SCRIPT DE RECUPERAÇÃO
-- =====================================================
-- ⚠️ IMPORTANTE: 
-- 1. Execute primeiro a migração 160 para investigar
-- 2. Analise os resultados
-- 3. Descomente apenas as seções necessárias da migração 161
-- 4. Faça backup antes de executar qualquer UPDATE ou INSERT

