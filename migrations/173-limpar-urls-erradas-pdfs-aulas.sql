-- ============================================
-- LIMPAR URLs ERRADAS DOS PDFs DAS AULAS
-- ============================================
-- 
-- Esta migration limpa as URLs erradas (PDFs de ferramentas)
-- que foram atribuídas aos registros de aulas no wellness_materiais.
-- 
-- Os PDFs corretos das aulas precisam ser adicionados ao storage
-- e suas URLs atualizadas manualmente depois.
-- ============================================

-- ============================================
-- PARTE 1: LIMPAR URLs ERRADAS NO wellness_materiais
-- ============================================

DO $$
BEGIN
  -- Como a coluna url tem NOT NULL, usamos um placeholder
  UPDATE wellness_materiais
  SET url = 'https://placeholder-pdf-aula-aguardando-upload.supabase.co/storage/v1/object/public/wellness-cursos-pdfs/pdf/AGUARDANDO-UPLOAD.pdf'
  WHERE codigo IN (
    'pdf-aula-1-fundamentos-wellness',
    'pdf-aula-2-3-pilares',
    'pdf-aula-3-funcionamento-pratico',
    'pdf-aula-4-por-que-converte',
    'pdf-aula-5-ferramentas'
  )
  AND (
    url LIKE '%calculadora%' OR
    url LIKE '%quiz%' OR
    url LIKE '%composicao%' OR
    url LIKE '%planejador%'
  );

  RAISE NOTICE '✅ URLs erradas substituídas por placeholder no wellness_materiais';
END $$;

-- ============================================
-- PARTE 2: LIMPAR VÍNCULOS ERRADOS NAS AULAS
-- ============================================

DO $$
DECLARE
  v_trilha_id UUID;
  v_modulo_id UUID;
BEGIN
  -- Buscar trilha "Distribuidor Iniciante"
  SELECT id INTO v_trilha_id
  FROM wellness_trilhas
  WHERE slug = 'distribuidor-iniciante'
  LIMIT 1;

  IF v_trilha_id IS NULL THEN
    RAISE NOTICE '⚠️ Trilha "distribuidor-iniciante" não encontrada.';
    RETURN;
  END IF;

  -- Buscar Módulo 1
  SELECT id INTO v_modulo_id
  FROM wellness_modulos
  WHERE trilha_id = v_trilha_id
    AND ordem = 1
  LIMIT 1;

  IF v_modulo_id IS NULL THEN
    RAISE NOTICE '⚠️ Módulo 1 não encontrado.';
    RETURN;
  END IF;

  -- Limpar todos os vínculos que apontam para PDFs de ferramentas
  UPDATE wellness_aulas
  SET material_url = NULL
  WHERE modulo_id = v_modulo_id
    AND material_url IS NOT NULL
    AND (
      material_url LIKE '%calculadora%' OR
      material_url LIKE '%quiz%' OR
      material_url LIKE '%composicao%' OR
      material_url LIKE '%planejador%'
    );

  RAISE NOTICE '✅ Vínculos errados removidos das aulas';
  
END $$;

-- ============================================
-- VERIFICAR RESULTADO
-- ============================================

-- Verificar wellness_materiais
SELECT 
  codigo,
  titulo,
  CASE 
    WHEN url LIKE '%AGUARDANDO-UPLOAD%' OR url LIKE '%placeholder%' THEN '⚠️ URL placeholder (precisa ser atualizada)'
    WHEN url LIKE '%calculadora%' OR url LIKE '%quiz%' OR url LIKE '%composicao%' OR url LIKE '%planejador%' THEN '❌ URL ainda errada'
    ELSE '✅ URL válida'
  END as status_url,
  url
FROM wellness_materiais
WHERE codigo IN (
  'pdf-aula-1-fundamentos-wellness',
  'pdf-aula-2-3-pilares',
  'pdf-aula-3-funcionamento-pratico',
  'pdf-aula-4-por-que-converte',
  'pdf-aula-5-ferramentas'
)
ORDER BY codigo;

-- Verificar aulas
SELECT 
  a.id,
  a.titulo,
  a.ordem,
  CASE 
    WHEN a.material_url IS NULL THEN '⚠️ Sem PDF (aguardando upload)'
    WHEN a.material_url LIKE '%calculadora%' OR 
         a.material_url LIKE '%quiz%' OR 
         a.material_url LIKE '%composicao%' OR 
         a.material_url LIKE '%planejador%' THEN '❌ PDF ainda errado'
    ELSE '✅ PDF vinculado'
  END as status,
  a.material_url
FROM wellness_aulas a
INNER JOIN wellness_modulos m ON m.id = a.modulo_id
INNER JOIN wellness_trilhas t ON t.id = m.trilha_id
WHERE t.slug = 'distribuidor-iniciante'
  AND m.ordem = 1
ORDER BY a.ordem;

-- ============================================
-- INSTRUÇÕES PARA ADICIONAR PDFs DAS AULAS
-- ============================================
-- 
-- Para adicionar os PDFs corretos das aulas:
-- 
-- 1. Faça upload dos PDFs no Supabase Storage:
--    - Bucket: wellness-cursos-pdfs
--    - Pasta: pdf/
--    - Nomes sugeridos:
--      * aula-1-fundamentos-wellness.pdf
--      * aula-2-3-pilares.pdf
--      * aula-3-funcionamento-pratico.pdf
--      * aula-4-por-que-converte.pdf
--      * aula-5-ferramentas.pdf
-- 
-- 2. Após o upload, atualize as URLs no wellness_materiais:
-- 
--    UPDATE wellness_materiais
--    SET url = 'https://fubynpjagxxqbyfjsile.supabase.co/storage/v1/object/public/wellness-cursos-pdfs/pdf/[NOME-DO-ARQUIVO].pdf'
--    WHERE codigo = 'pdf-aula-1-fundamentos-wellness';
-- 
--    (Repetir para as outras 4 aulas)
-- 
-- 3. Execute a migration 172 novamente para vincular às aulas:
--    migrations/172-corrigir-vinculos-pdfs-aulas.sql
-- 
-- ============================================
