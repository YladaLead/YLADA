-- ============================================
-- ELIMINAR DUPLICATA DE IMC
-- ============================================

-- Verificar os dois templates IMC
SELECT 
  id,
  name,
  type,
  created_at,
  is_active
FROM templates_nutrition
WHERE profession = 'wellness' 
  AND language = 'pt'
  AND (
    LOWER(name) LIKE '%imc%' 
    OR LOWER(name) LIKE '%índice de massa corporal%'
  )
ORDER BY created_at;

-- Eliminar o mais recente (manter "Calculadora de IMC" que é mais completo)
-- ID para eliminar: 4db486d1... (Calculadora IMC - mais recente)
UPDATE templates_nutrition
SET is_active = false
WHERE id = '4db486d1-...' -- Substitua pelos primeiros caracteres do ID completo
  AND profession = 'wellness' 
  AND language = 'pt'
  AND name = 'Calculadora IMC'; -- Nome exato do mais recente

-- OU usar esta query para eliminar automaticamente o mais recente:
UPDATE templates_nutrition
SET is_active = false
WHERE id IN (
  SELECT id
  FROM (
    SELECT 
      id,
      name,
      created_at,
      ROW_NUMBER() OVER (PARTITION BY LOWER(TRIM(name)) ORDER BY created_at DESC) as rn
    FROM templates_nutrition
    WHERE profession = 'wellness' 
      AND language = 'pt'
      AND (
        LOWER(name) LIKE '%imc%' 
        OR LOWER(name) LIKE '%índice de massa corporal%'
      )
      AND is_active = true
  ) sub
  WHERE rn > 1 -- Manter apenas o mais antigo (rn = 1)
);


