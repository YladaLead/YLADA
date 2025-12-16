-- ============================================
-- CORRIGIR VÍNCULOS ERRADOS DE PDFs NAS AULAS
-- ============================================
-- 
-- Problema identificado:
-- As aulas estão vinculadas a PDFs de ferramentas (calculadoras, quizzes)
-- em vez dos PDFs corretos das aulas.
-- 
-- Solução:
-- 1. Limpar todos os vínculos errados (PDFs de ferramentas)
-- 2. Verificar se existem PDFs corretos das aulas no wellness_materiais
-- 3. Se existirem, vincular corretamente
-- 4. Se não existirem, deixar NULL (PDFs precisam ser adicionados)
-- ============================================

DO $$
DECLARE
  v_trilha_id UUID;
  v_modulo_id UUID;
  v_aula_1_id UUID;
  v_aula_2_id UUID;
  v_aula_3_id UUID;
  v_aula_4_id UUID;
  v_aula_5_id UUID;
  v_pdf_aula_1_url TEXT;
  v_pdf_aula_2_url TEXT;
  v_pdf_aula_3_url TEXT;
  v_pdf_aula_4_url TEXT;
  v_pdf_aula_5_url TEXT;
  v_urls_erradas TEXT[];
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🔍 Verificando e corrigindo vínculos de PDFs nas aulas...';
  RAISE NOTICE '';

  -- Buscar trilha "Distribuidor Iniciante"
  SELECT id INTO v_trilha_id
  FROM wellness_trilhas
  WHERE slug = 'distribuidor-iniciante'
  LIMIT 1;

  IF v_trilha_id IS NULL THEN
    RAISE NOTICE '⚠️ Trilha "distribuidor-iniciante" não encontrada.';
    RETURN;
  END IF;

  -- Buscar Módulo 1: Fundamentos do Wellness System
  SELECT id INTO v_modulo_id
  FROM wellness_modulos
  WHERE trilha_id = v_trilha_id
    AND ordem = 1
  LIMIT 1;

  IF v_modulo_id IS NULL THEN
    RAISE NOTICE '⚠️ Módulo 1 não encontrado.';
    RETURN;
  END IF;

  -- ============================================
  -- PASSO 1: LIMPAR URLs ERRADAS NO wellness_materiais
  -- ============================================
  -- Primeiro, limpar as URLs erradas nos registros de materiais
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

  -- ============================================
  -- PASSO 2: LIMPAR VÍNCULOS ERRADOS NAS AULAS
  -- ============================================
  -- Remover vínculos que apontam para PDFs de ferramentas
  -- (calculadoras, quizzes, composição, planejador)
  
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
  RAISE NOTICE '';

  -- ============================================
  -- PASSO 3: BUSCAR PDFs CORRETOS DAS AULAS
  -- ============================================
  -- Verificar se existem PDFs corretos no wellness_materiais
  -- (mesmo que estejam desativados, podemos usar as URLs)
  
  SELECT url INTO v_pdf_aula_1_url
  FROM wellness_materiais
  WHERE codigo = 'pdf-aula-1-fundamentos-wellness'
    AND url IS NOT NULL
    AND url NOT LIKE '%placeholder%'
    AND url NOT LIKE '%AGUARDANDO-UPLOAD%'
    AND url NOT LIKE '%example.com%'
    AND url NOT LIKE '%calculadora%'
    AND url NOT LIKE '%quiz%'
    AND url NOT LIKE '%composicao%'
    AND url NOT LIKE '%planejador%'
  LIMIT 1;

  SELECT url INTO v_pdf_aula_2_url
  FROM wellness_materiais
  WHERE codigo = 'pdf-aula-2-3-pilares'
    AND url IS NOT NULL
    AND url NOT LIKE '%placeholder%'
    AND url NOT LIKE '%AGUARDANDO-UPLOAD%'
    AND url NOT LIKE '%example.com%'
    AND url NOT LIKE '%calculadora%'
    AND url NOT LIKE '%quiz%'
    AND url NOT LIKE '%composicao%'
    AND url NOT LIKE '%planejador%'
  LIMIT 1;

  SELECT url INTO v_pdf_aula_3_url
  FROM wellness_materiais
  WHERE codigo = 'pdf-aula-3-funcionamento-pratico'
    AND url IS NOT NULL
    AND url NOT LIKE '%placeholder%'
    AND url NOT LIKE '%AGUARDANDO-UPLOAD%'
    AND url NOT LIKE '%example.com%'
    AND url NOT LIKE '%calculadora%'
    AND url NOT LIKE '%quiz%'
    AND url NOT LIKE '%composicao%'
    AND url NOT LIKE '%planejador%'
  LIMIT 1;

  SELECT url INTO v_pdf_aula_4_url
  FROM wellness_materiais
  WHERE codigo = 'pdf-aula-4-por-que-converte'
    AND url IS NOT NULL
    AND url NOT LIKE '%placeholder%'
    AND url NOT LIKE '%AGUARDANDO-UPLOAD%'
    AND url NOT LIKE '%example.com%'
    AND url NOT LIKE '%calculadora%'
    AND url NOT LIKE '%quiz%'
    AND url NOT LIKE '%composicao%'
    AND url NOT LIKE '%planejador%'
  LIMIT 1;

  SELECT url INTO v_pdf_aula_5_url
  FROM wellness_materiais
  WHERE codigo = 'pdf-aula-5-ferramentas'
    AND url IS NOT NULL
    AND url NOT LIKE '%placeholder%'
    AND url NOT LIKE '%AGUARDANDO-UPLOAD%'
    AND url NOT LIKE '%example.com%'
    AND url NOT LIKE '%calculadora%'
    AND url NOT LIKE '%quiz%'
    AND url NOT LIKE '%composicao%'
    AND url NOT LIKE '%planejador%'
  LIMIT 1;

  -- ============================================
  -- PASSO 4: VINCULAR PDFs CORRETOS (SE EXISTIREM)
  -- ============================================
  
  -- Buscar IDs das aulas
  SELECT id INTO v_aula_1_id
  FROM wellness_aulas
  WHERE modulo_id = v_modulo_id
    AND ordem = 1
  LIMIT 1;

  SELECT id INTO v_aula_2_id
  FROM wellness_aulas
  WHERE modulo_id = v_modulo_id
    AND ordem = 2
  LIMIT 1;

  SELECT id INTO v_aula_3_id
  FROM wellness_aulas
  WHERE modulo_id = v_modulo_id
    AND ordem = 3
  LIMIT 1;

  SELECT id INTO v_aula_4_id
  FROM wellness_aulas
  WHERE modulo_id = v_modulo_id
    AND ordem = 4
  LIMIT 1;

  SELECT id INTO v_aula_5_id
  FROM wellness_aulas
  WHERE modulo_id = v_modulo_id
    AND ordem = 5
  LIMIT 1;

  -- Vincular Aula 1
  IF v_aula_1_id IS NOT NULL THEN
    IF v_pdf_aula_1_url IS NOT NULL THEN
      UPDATE wellness_aulas
      SET material_url = v_pdf_aula_1_url
      WHERE id = v_aula_1_id;
      RAISE NOTICE '✅ Aula 1: PDF vinculado corretamente';
    ELSE
      RAISE NOTICE '⚠️ Aula 1: PDF não encontrado (deixando NULL)';
    END IF;
  END IF;

  -- Vincular Aula 2
  IF v_aula_2_id IS NOT NULL THEN
    IF v_pdf_aula_2_url IS NOT NULL THEN
      UPDATE wellness_aulas
      SET material_url = v_pdf_aula_2_url
      WHERE id = v_aula_2_id;
      RAISE NOTICE '✅ Aula 2: PDF vinculado corretamente';
    ELSE
      RAISE NOTICE '⚠️ Aula 2: PDF não encontrado (deixando NULL)';
    END IF;
  END IF;

  -- Vincular Aula 3
  IF v_aula_3_id IS NOT NULL THEN
    IF v_pdf_aula_3_url IS NOT NULL THEN
      UPDATE wellness_aulas
      SET material_url = v_pdf_aula_3_url
      WHERE id = v_aula_3_id;
      RAISE NOTICE '✅ Aula 3: PDF vinculado corretamente';
    ELSE
      RAISE NOTICE '⚠️ Aula 3: PDF não encontrado (deixando NULL)';
    END IF;
  END IF;

  -- Vincular Aula 4
  IF v_aula_4_id IS NOT NULL THEN
    IF v_pdf_aula_4_url IS NOT NULL THEN
      UPDATE wellness_aulas
      SET material_url = v_pdf_aula_4_url
      WHERE id = v_aula_4_id;
      RAISE NOTICE '✅ Aula 4: PDF vinculado corretamente';
    ELSE
      RAISE NOTICE '⚠️ Aula 4: PDF não encontrado (deixando NULL)';
    END IF;
  END IF;

  -- Vincular Aula 5
  IF v_aula_5_id IS NOT NULL THEN
    IF v_pdf_aula_5_url IS NOT NULL THEN
      UPDATE wellness_aulas
      SET material_url = v_pdf_aula_5_url
      WHERE id = v_aula_5_id;
      RAISE NOTICE '✅ Aula 5: PDF vinculado corretamente';
    ELSE
      RAISE NOTICE '⚠️ Aula 5: PDF não encontrado (deixando NULL)';
    END IF;
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '✅ Correção concluída!';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Próximos passos:';
  RAISE NOTICE '   Se algum PDF não foi encontrado, você precisa:';
  RAISE NOTICE '   1. Fazer upload do PDF correto no Supabase Storage';
  RAISE NOTICE '   2. Atualizar a URL no registro wellness_materiais correspondente';
  RAISE NOTICE '   3. Re-executar esta migration para vincular';
  
END $$;

-- ============================================
-- VERIFICAR RESULTADO FINAL
-- ============================================

SELECT 
  a.id,
  a.titulo,
  a.ordem,
  CASE 
    WHEN a.material_url IS NULL THEN '⚠️ Sem PDF'
    WHEN a.material_url LIKE '%calculadora%' OR 
         a.material_url LIKE '%quiz%' OR 
         a.material_url LIKE '%composicao%' OR 
         a.material_url LIKE '%planejador%' THEN '❌ PDF ERRADO (ferramenta)'
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
-- VERIFICAR PDFs DAS AULAS NO wellness_materiais
-- ============================================

SELECT 
  codigo,
  titulo,
  CASE 
    WHEN url LIKE '%AGUARDANDO-UPLOAD%' OR url LIKE '%placeholder%' OR url LIKE '%example.com%' THEN '⚠️ URL placeholder (precisa ser atualizada)'
    WHEN url LIKE '%calculadora%' OR url LIKE '%quiz%' OR url LIKE '%composicao%' OR url LIKE '%planejador%' THEN '❌ URL errada (ferramenta)'
    ELSE '✅ URL válida'
  END as status_url,
  url,
  ativo
FROM wellness_materiais
WHERE codigo IN (
  'pdf-aula-1-fundamentos-wellness',
  'pdf-aula-2-3-pilares',
  'pdf-aula-3-funcionamento-pratico',
  'pdf-aula-4-por-que-converte',
  'pdf-aula-5-ferramentas'
)
ORDER BY codigo;

