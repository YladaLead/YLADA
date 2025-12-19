-- ============================================
-- MIGRAR PDFs DA ÁREA DE CURSOS PARA CARTILHAS
-- ============================================
-- 
-- Objetivo:
-- Localizar todos os PDFs que estavam na área de cursos
-- e movê-los para "Cartilhas de Treinamento" (wellness_materiais)
-- ============================================

-- ============================================
-- PARTE 1: VERIFICAR ESTRUTURAS DE CURSOS
-- ============================================

-- Verificar se existe tabela wellness_curso_materiais
DO $$
DECLARE
  v_tabela_existe BOOLEAN;
  v_total_pdfs INTEGER;
BEGIN
  -- Verificar se a tabela existe
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'wellness_curso_materiais'
  ) INTO v_tabela_existe;

  IF v_tabela_existe THEN
    -- Contar PDFs na tabela
    SELECT COUNT(*) INTO v_total_pdfs
    FROM wellness_curso_materiais
    WHERE tipo = 'pdf'
      AND arquivo_url IS NOT NULL
      AND arquivo_url NOT LIKE '%placeholder%';

    RAISE NOTICE '✅ Tabela wellness_curso_materiais encontrada';
    RAISE NOTICE '📊 Total de PDFs encontrados: %', v_total_pdfs;
  ELSE
    RAISE NOTICE '⚠️ Tabela wellness_curso_materiais não encontrada';
  END IF;
END $$;

-- ============================================
-- PARTE 2: MIGRAR PDFs DE wellness_curso_materiais
-- ============================================

DO $$
DECLARE
  v_material RECORD;
  v_codigo TEXT;
  v_contador INTEGER := 0;
BEGIN
  -- Verificar se a tabela existe antes de tentar migrar
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'wellness_curso_materiais'
  ) THEN
    
    RAISE NOTICE '';
    RAISE NOTICE '🔄 Migrando PDFs de wellness_curso_materiais para wellness_materiais...';
    RAISE NOTICE '';

    -- Loop através de todos os PDFs
    FOR v_material IN 
      SELECT 
        id,
        titulo,
        descricao,
        arquivo_url,
        ordem,
        created_at
      FROM wellness_curso_materiais
      WHERE tipo = 'pdf'
        AND arquivo_url IS NOT NULL
        AND arquivo_url NOT LIKE '%placeholder%'
        AND arquivo_url NOT LIKE '%example.com%'
      ORDER BY ordem, titulo
    LOOP
      -- Gerar código único baseado no título
      v_codigo := 'pdf-curso-' || LOWER(REGEXP_REPLACE(v_material.titulo, '[^a-zA-Z0-9]+', '-', 'g'));
      -- Limitar tamanho do código
      IF LENGTH(v_codigo) > 100 THEN
        v_codigo := LEFT(v_codigo, 100);
      END IF;
      -- Garantir unicidade
      v_codigo := v_codigo || '-' || SUBSTRING(v_material.id::TEXT, 1, 8);

      -- Inserir ou atualizar em wellness_materiais
      INSERT INTO wellness_materiais (
        codigo,
        titulo,
        descricao,
        tipo,
        categoria,
        url,
        ordem,
        tags,
        ativo,
        created_at
      )
      VALUES (
        v_codigo,
        v_material.titulo,
        COALESCE(v_material.descricao, 'PDF de treinamento migrado da área de cursos'),
        'pdf',
        'cartilha', -- Categoria: cartilha (Cartilhas de Treinamento)
        v_material.arquivo_url,
        COALESCE(v_material.ordem, 0),
        ARRAY['treinamento', 'curso', 'migrado', 'pdf'],
        true,
        COALESCE(v_material.created_at, NOW())
      )
      ON CONFLICT (codigo) DO UPDATE
      SET 
        titulo = EXCLUDED.titulo,
        descricao = EXCLUDED.descricao,
        url = EXCLUDED.url,
        ordem = EXCLUDED.ordem,
        ativo = true,
        updated_at = NOW();

      v_contador := v_contador + 1;
      RAISE NOTICE '✅ Migrado: %', v_material.titulo;
    END LOOP;

    RAISE NOTICE '';
    RAISE NOTICE '✅ Total de PDFs migrados: %', v_contador;
  ELSE
    RAISE NOTICE '⚠️ Tabela wellness_curso_materiais não existe. Pulando migração.';
  END IF;
END $$;

-- ============================================
-- PARTE 3: VERIFICAR OUTRAS ESTRUTURAS
-- ============================================
-- Verificar se há PDFs em wellness_modulo_topicos ou outras estruturas

DO $$
DECLARE
  v_tabela_existe BOOLEAN;
  v_total_pdfs INTEGER;
BEGIN
  -- Verificar wellness_modulo_topicos (se existir)
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'wellness_modulo_topicos'
  ) INTO v_tabela_existe;

  IF v_tabela_existe THEN
    RAISE NOTICE '✅ Tabela wellness_modulo_topicos encontrada';
    -- Verificar se tem campo com URLs de PDFs
    -- (ajustar conforme estrutura real)
  END IF;
END $$;

-- ============================================
-- PARTE 4: VERIFICAR RESULTADO
-- ============================================

-- Listar PDFs migrados para cartilhas
SELECT 
  codigo,
  titulo,
  CASE 
    WHEN url LIKE '%placeholder%' OR url LIKE '%example.com%' THEN '⚠️ URL inválida'
    WHEN url LIKE '%calculadora%' OR url LIKE '%quiz%' THEN '✅ URL válida (ferramenta)'
    ELSE '✅ URL válida (treinamento)'
  END as status_url,
  url,
  tags,
  ativo
FROM wellness_materiais
WHERE categoria = 'cartilha'
  AND tipo = 'pdf'
  AND (
    codigo LIKE 'pdf-curso-%' OR
    tags && ARRAY['treinamento', 'curso', 'migrado']
  )
ORDER BY ordem, titulo;

-- ============================================
-- RESUMO
-- ============================================
-- 
-- Esta migration:
-- 1. Verifica se existe a tabela wellness_curso_materiais
-- 2. Migra todos os PDFs encontrados para wellness_materiais
-- 3. Define categoria como 'cartilha' (Cartilhas de Treinamento)
-- 4. Adiciona tags: ['treinamento', 'curso', 'migrado', 'pdf']
-- 5. Mantém URLs originais
-- 
-- Os PDFs migrados aparecerão em:
-- /pt/wellness/biblioteca/cartilhas
-- 
-- ============================================








