-- =====================================================
-- SCRIPT 04: DUPLICAR TEMPLATES NUTRI → WELLNESS
-- =====================================================
-- Cria versões Wellness de todos os templates Nutri
-- Evita duplicatas se já existirem
-- =====================================================

-- Contar templates Nutri antes
SELECT COUNT(*) as total_nutri_templates
FROM templates_nutrition
WHERE profession = 'nutri';

-- Duplicar templates Nutri → Wellness
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
  'wellness' as profession  -- ← Mudar profession
FROM templates_nutrition
WHERE profession = 'nutri'
AND NOT EXISTS (
  -- Evitar duplicatas: verificar se já existe template com mesmo name+type+language
  SELECT 1 FROM templates_nutrition t2
  WHERE t2.name = templates_nutrition.name
  AND t2.type = templates_nutrition.type
  AND t2.language = templates_nutrition.language
  AND t2.profession = 'wellness'
);

-- Verificar duplicação
SELECT 
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
  SELECT name FROM templates_nutrition WHERE profession = 'nutri' LIMIT 5
)
AND profession IN ('nutri', 'wellness')
ORDER BY name, profession;

-- ✅ Templates Wellness duplicados com sucesso!

