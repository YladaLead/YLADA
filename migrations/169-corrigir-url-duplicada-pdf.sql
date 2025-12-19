-- ============================================
-- CORRIGIR URL DUPLICADA (/pdf/pdf/)
-- ============================================
-- 
-- Algumas URLs foram criadas com /pdf/pdf/ duplicado
-- Este script corrige removendo o /pdf/ extra
-- ============================================

-- Corrigir URLs que têm /pdf/pdf/ duplicado
UPDATE wellness_materiais
SET url = REPLACE(url, '/pdf/pdf/', '/pdf/')
WHERE url LIKE '%/pdf/pdf/%'
  AND tipo = 'pdf'
  AND categoria = 'cartilha';

-- Verificar resultado - mostrar todas as URLs corrigidas
SELECT 
  codigo,
  titulo,
  CASE 
    WHEN url LIKE '%/pdf/pdf/%' THEN '⚠️ Ainda tem duplicado'
    WHEN url LIKE '%/pdf/%' AND url NOT LIKE '%/pdf/pdf/%' THEN '✅ URL corrigida'
    WHEN url LIKE '%wellness-cursos-pdfs%' THEN '✅ URL configurada'
    ELSE '❓ URL diferente'
  END as status,
  url
FROM wellness_materiais
WHERE tipo = 'pdf' 
  AND categoria = 'cartilha'
ORDER BY codigo;









