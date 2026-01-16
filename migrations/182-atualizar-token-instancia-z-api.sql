-- =====================================================
-- ATUALIZAR TOKEN E INSTANCE ID Z-API
-- =====================================================

-- Atualizar token e verificar instance_id
UPDATE z_api_instances
SET 
  token = '6633B5CACF7FC081FCAC3611',
  instance_id = '3ED484E8415CF126D6009EBD599F8B90',
  status = 'connected',
  updated_at = NOW()
WHERE instance_id = '3ED484E8415CF126D6009EBD599F8B90';

-- Se não existir, inserir
INSERT INTO z_api_instances (
  name,
  instance_id,
  token,
  area,
  phone_number,
  status
) VALUES (
  'Ylada Nutri',
  '3ED484E8415CF126D6009EBD599F8B90',
  '6633B5CACF7FC081FCAC3611',
  'nutri',
  '5519997230912',
  'connected'
)
ON CONFLICT (instance_id) 
DO UPDATE SET
  token = EXCLUDED.token,
  status = EXCLUDED.status,
  updated_at = NOW();

-- Verificar se foi atualizado corretamente
SELECT 
  id,
  name,
  instance_id,
  token,
  LENGTH(token) as token_length,
  area,
  phone_number,
  status,
  updated_at
FROM z_api_instances
WHERE instance_id = '3ED484E8415CF126D6009EBD599F8B90';
