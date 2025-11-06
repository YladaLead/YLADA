-- =====================================================
-- SCRIPT 05: DUPLICAR TEMPLATES NUTRI → COACH E NUTRA
-- =====================================================
-- Cria versões Coach e Nutra de todos os templates Nutri
-- Templates desativados por padrão (ativar depois)
-- =====================================================

-- =====================================================
-- PARTE 1: DUPLICAR NUTRI → COACH
-- =====================================================

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
  false as is_active,  -- ← Desativar por padrão (ativar depois)
  'coach' as profession
FROM templates_nutrition
WHERE profession = 'nutri'
AND NOT EXISTS (
  SELECT 1 FROM templates_nutrition t2
  WHERE t2.name = templates_nutrition.name
  AND t2.type = templates_nutrition.type
  AND t2.language = templates_nutrition.language
  AND t2.profession = 'coach'
);

-- =====================================================
-- PARTE 2: DUPLICAR NUTRI → NUTRA
-- =====================================================

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
  false as is_active,  -- ← Desativar por padrão (ativar depois)
  'nutra' as profession
FROM templates_nutrition
WHERE profession = 'nutri'
AND NOT EXISTS (
  SELECT 1 FROM templates_nutrition t2
  WHERE t2.name = templates_nutrition.name
  AND t2.type = templates_nutrition.type
  AND t2.language = templates_nutrition.language
  AND t2.profession = 'nutra'
);

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

-- Contagem por área
SELECT 
  profession,
  COUNT(*) as total_templates,
  SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as templates_ativos,
  SUM(CASE WHEN NOT is_active THEN 1 ELSE 0 END) as templates_inativos
FROM templates_nutrition
WHERE profession IN ('nutri', 'wellness', 'coach', 'nutra')
GROUP BY profession
ORDER BY profession;

-- Verificar exemplo de template duplicado
SELECT 
  name,
  type,
  profession,
  is_active
FROM templates_nutrition
WHERE name = 'Checklist Alimentar'  -- Exemplo
ORDER BY profession;

-- ✅ Templates Coach e Nutra duplicados com sucesso!
-- ⚠️ Lembre-se: Templates Coach e Nutra estão DESATIVADOS por padrão
--    Ative-os quando estiver pronto para usar

