-- ============================================
-- MAPEAR PDFs DE wellness-cursos-pdfs PARA BIBLIOTECA
-- ============================================
-- 
-- Os PDFs estão em: wellness-cursos-pdfs/pdf/
-- Precisamos mapear para os registros em wellness_materiais
-- 
-- INSTRUÇÕES:
-- 1. Execute: npx tsx scripts/listar-pdfs-wellness-cursos.ts
-- 2. Anote os nomes EXATOS dos arquivos
-- 3. Mapeie cada arquivo para o código correspondente
-- 4. Execute este script com os nomes corretos
-- 
-- ============================================

-- ID do projeto (já identificado)
DO $$
DECLARE
  v_projeto_id TEXT := 'fubynpjagxxqbyfjsile';
  v_base_url TEXT := 'https://' || v_projeto_id || '.supabase.co/storage/v1/object/public/wellness-cursos-pdfs';
BEGIN
  RAISE NOTICE '🔄 Mapeando PDFs de wellness-cursos-pdfs para biblioteca...';
  RAISE NOTICE '📦 Projeto: %', v_projeto_id;
  RAISE NOTICE '';

  -- ============================================
  -- MAPEAMENTO DOS PDFs
  -- ============================================
  -- 
  -- IMPORTANTE: Os arquivos no storage têm nomes com timestamp
  -- Exemplo: 1762638299950-mrmksx-Calculadora-de-Hidratacao.pdf
  -- 
  -- Você precisa:
  -- 1. Executar o script listar-pdfs-wellness-cursos.ts
  -- 2. Identificar qual arquivo corresponde a qual script
  -- 3. Substituir os nomes abaixo pelos nomes EXATOS do storage
  -- 
  -- ============================================

  -- Exemplo de mapeamento (AJUSTE OS NOMES):
  /*
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdf/1762638299950-mrmksx-Calculadora-de-Hidratacao.pdf'
  WHERE codigo = 'pdf-script-convite-leve-completo'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%');
  */

  -- ============================================
  -- ALTERNATIVA: Buscar por padrão no nome
  -- ============================================
  -- Se os arquivos contêm palavras-chave no nome, podemos tentar mapear automaticamente
  
  -- Scripts de Convite (procurar por "Calculadora" ou "Hidratacao")
  UPDATE wellness_materiais
  SET url = (
    SELECT v_base_url || '/pdf/' || name
    FROM storage.objects
    WHERE bucket_id = 'wellness-cursos-pdfs'
      AND name LIKE '%pdf/%'
      AND (name ILIKE '%calculadora%hidratacao%' OR name ILIKE '%hidratacao%')
    LIMIT 1
  )
  WHERE codigo = 'pdf-script-convite-leve-completo'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%')
    AND EXISTS (
      SELECT 1 FROM storage.objects
      WHERE bucket_id = 'wellness-cursos-pdfs'
        AND name LIKE '%pdf/%'
        AND (name ILIKE '%calculadora%hidratacao%' OR name ILIKE '%hidratacao%')
    );

  -- Repetir para outros scripts conforme necessário...
  -- (Este método é mais complexo, recomendo usar o método manual abaixo)

  RAISE NOTICE '✅ Mapeamento concluído!';
  
END $$;

-- ============================================
-- MÉTODO RECOMENDADO: Atualização Manual
-- ============================================
-- 
-- 1. Execute o script TypeScript para listar os PDFs:
--    npx tsx scripts/listar-pdfs-wellness-cursos.ts
-- 
-- 2. Para cada PDF listado, identifique qual script ele representa
-- 
-- 3. Execute UPDATEs manuais como este exemplo:
-- 
-- UPDATE wellness_materiais
-- SET url = 'https://fubynpjagxxqbyfjsile.supabase.co/storage/v1/object/public/wellness-cursos-pdfs/pdf/[NOME-EXATO-DO-ARQUIVO].pdf'
-- WHERE codigo = 'pdf-script-convite-leve-completo';
-- 
-- ============================================

-- ============================================
-- VERIFICAR STATUS ATUAL
-- ============================================

SELECT 
  codigo,
  titulo,
  CASE 
    WHEN url LIKE '%placeholder%' OR url LIKE '%example.com%' THEN '⚠️ Precisa atualizar'
    WHEN url LIKE '%wellness-cursos-pdfs%' THEN '✅ URL do wellness-cursos-pdfs'
    WHEN url LIKE '%wellness-biblioteca%' THEN '✅ URL do wellness-biblioteca'
    ELSE '❓ URL desconhecida'
  END as status,
  LEFT(url, 100) as url_preview
FROM wellness_materiais
WHERE tipo = 'pdf' 
  AND categoria = 'script'
ORDER BY ordem, titulo;

-- ============================================
-- LISTAR ARQUIVOS NO STORAGE (se tiver permissão)
-- ============================================
-- 
-- NOTA: Esta query pode não funcionar dependendo das permissões
-- Use o script TypeScript em vez disso
-- 
-- SELECT 
--   name,
--   bucket_id,
--   created_at,
--   metadata->>'size' as tamanho_bytes
-- FROM storage.objects
-- WHERE bucket_id = 'wellness-cursos-pdfs'
--   AND name LIKE 'pdf/%.pdf'
-- ORDER BY created_at DESC;
-- 
-- ============================================









