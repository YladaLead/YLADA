-- Script para migrar templates para profession='wellness'
-- Execute este SQL quando quiser migrar os templates para o banco

-- ATENÇÃO: Este script atualiza templates existentes para profession='wellness'
-- Se você quiser criar novos templates ao invés de atualizar, use o script de INSERT

-- Opção 1: Atualizar templates existentes para profession='wellness'
-- (Se você já tem templates no banco mas sem profession definido)
UPDATE templates_nutrition
SET profession = 'wellness'
WHERE language IN ('pt', 'pt-PT')
AND is_active = true
AND (profession IS NULL OR profession != 'wellness');

-- Opção 2: Verificar quantos templates serão afetados ANTES de atualizar
SELECT 
    COUNT(*) as total_templates,
    language,
    profession,
    is_active
FROM templates_nutrition
WHERE language IN ('pt', 'pt-PT')
AND is_active = true
GROUP BY language, profession, is_active
ORDER BY language, profession;

-- Opção 3: Ver templates que serão migrados
SELECT 
    id,
    name,
    type,
    profession,
    language,
    is_active
FROM templates_nutrition
WHERE language IN ('pt', 'pt-PT')
AND is_active = true
ORDER BY name
LIMIT 50;

-- Depois de executar o UPDATE, verificar resultado:
SELECT COUNT(*) as total_wellness
FROM templates_nutrition
WHERE profession = 'wellness'
AND language IN ('pt', 'pt-PT')
AND is_active = true;

