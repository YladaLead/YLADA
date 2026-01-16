-- Remover instâncias de exemplo/teste da tabela z_api_instances
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

-- Verificar instâncias restantes
SELECT 
  id,
  name,
  instance_id,
  area,
  status,
  LENGTH(token) as token_length,
  updated_at
FROM z_api_instances
ORDER BY updated_at DESC;
