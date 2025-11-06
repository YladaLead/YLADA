-- =====================================================
-- SCRIPT 04: DUPLICAR TEMPLATES WELLNESS → NUTRI
-- =====================================================
-- Completa templates Nutri duplicando de Wellness
-- Evita duplicatas se já existir template com mesmo name+type+language
-- =====================================================

-- Contar templates Wellness antes
SELECT 
  'Antes' as etapa,
  COUNT(*) as total_wellness
FROM templates_nutrition
WHERE profession = 'wellness';

-- Contar templates Nutri antes
SELECT 
  'Antes' as etapa,
  COUNT(*) as total_nutri
FROM templates_nutrition
WHERE profession = 'nutri';

-- Duplicar templates Wellness → Nutri (apenas os que não existem)
INSERT INTO templates_nutrition (
  name,
  type,
  language,
  specialization,
  objective,
  title,
  description,
  content,
  cta_text,
  whatsapp_message,
  is_active,
  profession
)
SELECT 
  name,
  type,
  language,
  specialization,
  objective,
  title,
  description,
  content,
  cta_text,
  whatsapp_message,
  is_active,
  'nutri' as profession  -- ← Mudar profession para nutri
FROM templates_nutrition
WHERE profession = 'wellness'
AND NOT EXISTS (
  -- Evitar duplicatas: verificar se já existe template Nutri com mesmo name+type+language
  SELECT 1 FROM templates_nutrition t2
  WHERE t2.name = templates_nutrition.name
  AND t2.type = templates_nutrition.type
  AND t2.language = templates_nutrition.language
  AND t2.profession = 'nutri'
);

-- Verificar duplicação
SELECT 
  'Depois' as etapa,
  profession,
  COUNT(*) as total_templates
FROM templates_nutrition
WHERE profession IN ('nutri', 'wellness')
GROUP BY profession
ORDER BY profession;

-- Listar alguns templates duplicados
SELECT 
  name,
  type,
  profession,
  is_active
FROM templates_nutrition
WHERE name IN (
  SELECT name FROM templates_nutrition WHERE profession = 'wellness' LIMIT 5
)
AND profession IN ('nutri', 'wellness')
ORDER BY name, profession;

-- ✅ Templates Nutri completados com sucesso!

