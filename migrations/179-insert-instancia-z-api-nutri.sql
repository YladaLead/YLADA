-- =====================================================
-- INSERIR OU ATUALIZAR INSTÂNCIA Z-API - YLADA NUTRI
-- =====================================================

-- Usar INSERT ... ON CONFLICT para atualizar se já existir
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
  name = EXCLUDED.name,
  token = EXCLUDED.token,
  area = EXCLUDED.area,
  phone_number = EXCLUDED.phone_number,
  status = EXCLUDED.status,
  updated_at = NOW();

-- Verificar se foi inserido/atualizado corretamente
SELECT 
  id,
  name,
  instance_id,
  area,
  phone_number,
  status,
  created_at,
  updated_at
FROM z_api_instances
WHERE instance_id = '3ED484E8415CF126D6009EBD599F8B90';
