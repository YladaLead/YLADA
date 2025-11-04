-- Verificar os quizzes de negócio inseridos
SELECT 
  id,
  name,
  type,
  profession,
  language,
  is_active,
  created_at
FROM templates_nutrition
WHERE (
  LOWER(name) LIKE '%ganhos%' OR
  LOWER(name) LIKE '%prosperidade%' OR
  LOWER(name) LIKE '%potencial%' OR
  LOWER(name) LIKE '%crescimento%' OR
  LOWER(name) LIKE '%propósito%' OR
  LOWER(name) LIKE '%proposito%' OR
  LOWER(name) LIKE '%equilíbrio%' OR
  LOWER(name) LIKE '%equilibrio%'
)
ORDER BY name;
