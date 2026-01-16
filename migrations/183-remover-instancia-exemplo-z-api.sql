-- =====================================================
-- REMOVER INSTÂNCIAS DE EXEMPLO E GARANTIR INSTÂNCIA CORRETA
-- =====================================================

-- 1. Remover instâncias de exemplo/teste da tabela z_api_instances
-- Essas instâncias têm valores placeholder como 'SEU_INSTANCE_ID_AQUI'

DELETE FROM z_api_instances
WHERE instance_id IN (
  'SEU_INSTANCE_ID_AQUI',
  'YOUR_INSTANCE_ID',
  'INSTANCE_ID_AQUI',
  'SEU_TOKEN_AQUI',
  'YOUR_TOKEN'
)
OR instance_id LIKE '%EXEMPLO%'
OR instance_id LIKE '%EXAMPLE%'
OR instance_id LIKE '%TESTE%'
OR instance_id LIKE '%TEST%'
OR token IN (
  'SEU_TOKEN_AQUI',
  'YOUR_TOKEN',
  'SEU_TOKEN',
  'TOKEN_AQUI'
)
OR token LIKE '%EXEMPLO%'
OR token LIKE '%EXAMPLE%'
OR token LIKE '%TESTE%'
OR token LIKE '%TEST%';

-- 2. Garantir que a instância correta existe e está atualizada
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

-- 3. Verificar instâncias restantes
SELECT 
  id,
  name,
  instance_id,
  area,
  status,
  phone_number,
  LENGTH(token) as token_length,
  updated_at
FROM z_api_instances
ORDER BY updated_at DESC;

-- 4. Verificar se a instância correta está configurada
SELECT 
  CASE 
    WHEN COUNT(*) = 1 
    THEN '✅ Instância correta configurada'
    ELSE '❌ ERRO: Instância não encontrada ou incorreta'
  END as status_verificacao,
  COUNT(*) as total_instancias,
  MAX(instance_id) as instance_id_encontrado,
  MAX(token) as token_encontrado,
  MAX(status) as status_encontrado
FROM z_api_instances
WHERE instance_id = '3ED484E8415CF126D6009EBD599F8B90'
  AND token = '6633B5CACF7FC081FCAC3611'
  AND status = 'connected';
