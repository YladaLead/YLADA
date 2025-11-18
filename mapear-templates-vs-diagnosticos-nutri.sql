-- =====================================================
-- MAPEAR: TEMPLATES NUTRI vs DIAGNÓSTICOS NUTRI
-- Identificar correspondência entre Supabase e código
-- =====================================================

-- 1. LISTAR TODOS OS TEMPLATES NUTRI DO SUPABASE
SELECT 
    id,
    name,
    slug,
    type,
    profession,
    is_active,
    created_at
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND is_active = true
ORDER BY type, name;

-- 2. CONTAR TEMPLATES POR TIPO (NUTRI)
SELECT 
    type,
    COUNT(*) as total,
    STRING_AGG(name, ', ' ORDER BY name) as templates
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND is_active = true
GROUP BY type
ORDER BY type;

-- 3. LISTAR SLUGS DOS TEMPLATES NUTRI (para comparar com diagnósticos)
SELECT 
    slug,
    name,
    type
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND is_active = true
ORDER BY slug;

-- 4. VERIFICAR TEMPLATES COM SLUGS ESPECÍFICOS (mapear com diagnósticos)
-- Diagnósticos Nutri conhecidos do código:
-- quiz-interativo, quiz-bem-estar, quiz-perfil-nutricional, quiz-detox, quiz-energetico
-- calculadora-imc, calculadora-proteina, calculadora-agua, calculadora-calorias
-- checklist-detox, checklist-alimentar
-- desafio-7-dias, desafio-21-dias
-- guia-hidratacao, guia-nutraceutico, guia-proteico
-- mini-ebook
-- avaliacao-inicial
-- etc.

SELECT 
    slug,
    name,
    type,
    CASE 
        WHEN slug IN (
            'quiz-interativo', 'quiz-bem-estar', 'quiz-perfil-nutricional', 
            'quiz-detox', 'quiz-energetico',
            'calculadora-imc', 'calculadora-proteina', 'calculadora-agua', 
            'calculadora-calorias',
            'checklist-detox', 'checklist-alimentar',
            'desafio-7-dias', 'desafio-21-dias',
            'guia-hidratacao', 'guia-nutraceutico', 'guia-proteico',
            'mini-ebook', 'avaliacao-inicial'
        ) THEN '✅ TEM DIAGNÓSTICO'
        ELSE '❌ SEM DIAGNÓSTICO (verificar)'
    END as status_diagnostico
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND is_active = true
ORDER BY status_diagnostico, type, name;

-- 5. RESUMO: TEMPLATES COM/SEM DIAGNÓSTICOS
SELECT 
    CASE 
        WHEN slug IN (
            'quiz-interativo', 'quiz-bem-estar', 'quiz-perfil-nutricional', 
            'quiz-detox', 'quiz-energetico',
            'calculadora-imc', 'calculadora-proteina', 'calculadora-agua', 
            'calculadora-calorias',
            'checklist-detox', 'checklist-alimentar',
            'desafio-7-dias', 'desafio-21-dias',
            'guia-hidratacao', 'guia-nutraceutico', 'guia-proteico',
            'mini-ebook', 'avaliacao-inicial'
        ) THEN 'COM DIAGNÓSTICO'
        ELSE 'SEM DIAGNÓSTICO'
    END as status,
    COUNT(*) as total,
    STRING_AGG(name, ', ' ORDER BY name) as templates
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND is_active = true
GROUP BY status
ORDER BY status;



