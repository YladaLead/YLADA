-- ============================================
-- ATUALIZAR URLs DOS PDFs - BUCKET CORRETO
-- ============================================
-- 
-- IMPORTANTE: Os PDFs estão no bucket wellness-cursos-pdfs
-- Mas precisam estar acessíveis via wellness-biblioteca
-- 
-- OPÇÕES:
-- 1. Mover os PDFs para wellness-biblioteca/pdfs/scripts/
-- 2. OU atualizar URLs para apontar para wellness-cursos-pdfs
-- 
-- Este script atualiza as URLs para o bucket onde os PDFs estão
-- ============================================

-- ID do projeto (já identificado na URL)
DO $$
DECLARE
  v_projeto_id TEXT := 'fubynpjagxxqbyfjsile'; -- ID do projeto Supabase
  v_base_url_cursos TEXT := 'https://' || v_projeto_id || '.supabase.co/storage/v1/object/public/wellness-cursos-pdfs';
  v_base_url_biblioteca TEXT := 'https://' || v_projeto_id || '.supabase.co/storage/v1/object/public/wellness-biblioteca';
BEGIN
  RAISE NOTICE '🔄 Atualizando URLs dos PDFs...';
  RAISE NOTICE '📦 Projeto: %', v_projeto_id;
  RAISE NOTICE '';

  -- ============================================
  -- OPÇÃO 1: Se os PDFs estão em wellness-cursos-pdfs/pdf/
  -- ============================================
  -- Descomente e ajuste os nomes dos arquivos conforme estão no storage
  
  /*
  -- Scripts de Convite
  UPDATE wellness_materiais
  SET url = v_base_url_cursos || '/pdf/Calculadora-de-Hidratacao.pdf'
  WHERE codigo = 'pdf-script-convite-leve-completo'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%');
  
  UPDATE wellness_materiais
  SET url = v_base_url_cursos || '/pdf/Calculadora-IMC.pdf'
  WHERE codigo = 'pdf-script-convite-pessoas-proximas'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%');
  
  UPDATE wellness_materiais
  SET url = v_base_url_cursos || '/pdf/Calculadora-de-proteina.pdf'
  WHERE codigo = 'pdf-script-convite-leads-frios'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%');
  */

  -- ============================================
  -- OPÇÃO 2: Se os PDFs estão em wellness-biblioteca/pdfs/scripts/
  -- ============================================
  -- Use esta opção se você mover os PDFs para o bucket correto
  
  -- Scripts de Convite
  UPDATE wellness_materiais
  SET url = v_base_url_biblioteca || '/pdfs/scripts/Calculadora-de-Hidratacao.pdf'
  WHERE codigo = 'pdf-script-convite-leve-completo'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%');
  
  UPDATE wellness_materiais
  SET url = v_base_url_biblioteca || '/pdfs/scripts/Calculadora-IMC.pdf'
  WHERE codigo = 'pdf-script-convite-pessoas-proximas'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%');
  
  UPDATE wellness_materiais
  SET url = v_base_url_biblioteca || '/pdfs/scripts/Calculadora-de-proteina.pdf'
  WHERE codigo = 'pdf-script-convite-leads-frios'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%');

  -- Scripts de Follow-up
  UPDATE wellness_materiais
  SET url = v_base_url_biblioteca || '/pdfs/scripts/Como-Se-Compor...a.pdf' -- ⚠️ Ajuste o nome exato
  WHERE codigo = 'pdf-script-follow-up-completo'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%');
  
  UPDATE wellness_materiais
  SET url = v_base_url_biblioteca || '/pdfs/scripts/Composicao-Corporal.pdf'
  WHERE codigo = 'pdf-script-follow-up-apos-link'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%');

  -- Scripts de Apresentação
  UPDATE wellness_materiais
  SET url = v_base_url_biblioteca || '/pdfs/scripts/Planejador-de-Refeicoes.pdf'
  WHERE codigo = 'pdf-script-apresentacao-produtos'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%');
  
  UPDATE wellness_materiais
  SET url = v_base_url_biblioteca || '/pdfs/scripts/Quiz-de-Aliment...el.pdf' -- ⚠️ Ajuste o nome exato
  WHERE codigo = 'pdf-script-apresentacao-oportunidade'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%');

  -- Scripts de Fechamento
  UPDATE wellness_materiais
  SET url = v_base_url_biblioteca || '/pdfs/scripts/Quiz-de-Bem-Estar-Di...o.pdf' -- ⚠️ Ajuste o nome exato
  WHERE codigo = 'pdf-script-fechamento-produtos'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%');
  
  UPDATE wellness_materiais
  SET url = v_base_url_biblioteca || '/pdfs/scripts/QUIZ-Ganhos-e-Prosperi...e.pdf' -- ⚠️ Ajuste o nome exato
  WHERE codigo = 'pdf-script-fechamento-kits'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%');

  -- Scripts de Objeção
  UPDATE wellness_materiais
  SET url = v_base_url_biblioteca || '/pdfs/scripts/Quiz-Perfil-de-Bem-Estar.pdf'
  WHERE codigo = 'pdf-script-objecoes-completo'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%');
  
  UPDATE wellness_materiais
  SET url = v_base_url_biblioteca || '/pdfs/scripts/Quiz-Potencial-e-Crescim...o.pdf' -- ⚠️ Ajuste o nome exato
  WHERE codigo = 'pdf-script-objecao-dinheiro'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%');
  
  UPDATE wellness_materiais
  SET url = v_base_url_biblioteca || '/pdfs/scripts/Quiz-Proposito-e-Equilibrio.pdf'
  WHERE codigo = 'pdf-script-objecao-tempo'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%');

  RAISE NOTICE '';
  RAISE NOTICE '✅ URLs atualizadas!';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Verifique os resultados:';
  RAISE NOTICE '   SELECT codigo, titulo, url FROM wellness_materiais WHERE tipo = ''pdf'' AND categoria = ''script'';';
  
END $$;

-- ============================================
-- VERIFICAR RESULTADOS
-- ============================================

SELECT 
  codigo,
  titulo,
  CASE 
    WHEN url LIKE '%placeholder%' OR url LIKE '%example.com%' THEN '⚠️ Ainda precisa atualizar'
    WHEN url LIKE '%wellness-cursos-pdfs%' THEN '📦 URL aponta para wellness-cursos-pdfs'
    WHEN url LIKE '%wellness-biblioteca%' THEN '✅ URL aponta para wellness-biblioteca'
    ELSE '❓ URL desconhecida'
  END as status,
  url
FROM wellness_materiais
WHERE tipo = 'pdf' 
  AND categoria = 'script'
ORDER BY ordem, titulo;

-- ============================================
-- INSTRUÇÕES IMPORTANTES
-- ============================================
-- 
-- 1. Os PDFs que você mostrou estão em: wellness-cursos-pdfs/pdf/
-- 2. Para a biblioteca funcionar corretamente, você tem 2 opções:
-- 
-- OPÇÃO A: Mover os PDFs para wellness-biblioteca
--   - No Supabase Dashboard, vá em Storage
--   - Abra wellness-cursos-pdfs
--   - Selecione os PDFs na pasta pdf/
--   - Baixe ou copie para wellness-biblioteca/pdfs/scripts/
-- 
-- OPÇÃO B: Usar URLs do wellness-cursos-pdfs
--   - Descomente a OPÇÃO 1 no script acima
--   - Comente a OPÇÃO 2
--   - Ajuste os nomes dos arquivos
--   - Execute o script
-- 
-- RECOMENDAÇÃO: Use a OPÇÃO A (mover para wellness-biblioteca)
--   para manter a organização correta
-- 
-- ============================================



















