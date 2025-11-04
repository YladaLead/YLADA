-- Verificar templates IMC duplicados no Wellness
SELECT 
  id,
  name,
  type,
  specialization,
  created_at,
  COUNT(*) OVER (PARTITION BY LOWER(TRIM(name))) as count_duplicates
FROM templates_wellness
WHERE LOWER(name) LIKE '%imc%' 
   OR LOWER(name) LIKE '%índice de massa corporal%'
   OR LOWER(name) LIKE '%indice de massa corporal%'
ORDER BY name, created_at;

-- Verificar se há templates com nomes muito similares
SELECT 
  name,
  type,
  COUNT(*) as quantidade
FROM templates_wellness
WHERE LOWER(name) LIKE '%imc%' 
   OR LOWER(name) LIKE '%índice de massa corporal%'
   OR LOWER(name) LIKE '%indice de massa corporal%'
GROUP BY name, type
HAVING COUNT(*) > 1;


