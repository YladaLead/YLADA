DROP INDEX IF EXISTS idx_templates_nutrition_slug;

UPDATE templates_nutrition SET slug = NULL WHERE slug = 'disciplinado-emocional' AND id != '9b674ed9-2119-48f7-a2aa-849150097a01';

UPDATE templates_nutrition SET slug = 'disciplinado-emocional' WHERE id = '9b674ed9-2119-48f7-a2aa-849150097a01';

CREATE UNIQUE INDEX IF NOT EXISTS idx_templates_nutrition_slug ON templates_nutrition(slug) WHERE slug IS NOT NULL;

SELECT name, slug, type FROM templates_nutrition WHERE profession = 'wellness' AND language = 'pt' AND is_active = true ORDER BY CASE type WHEN 'calculadora' THEN 1 WHEN 'guia' THEN 2 WHEN 'planilha' THEN 3 WHEN 'quiz' THEN 4 ELSE 5 END, name;

