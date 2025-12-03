-- Execute esta query para ver todas as tabelas relacionadas a jornada
SELECT 
  table_name,
  table_schema
FROM information_schema.tables
WHERE table_schema = 'public'
  AND (
    table_name LIKE '%jornada%' 
    OR table_name LIKE '%journey%'
    OR table_name LIKE '%ylada%'
  )
ORDER BY table_name;

