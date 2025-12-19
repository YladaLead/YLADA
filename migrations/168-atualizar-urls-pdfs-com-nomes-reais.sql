-- ============================================
-- ATUALIZAR URLs DOS PDFs COM NOMES REAIS DO STORAGE
-- ============================================
-- 
-- Baseado na imagem do Supabase Storage
-- Bucket: wellness-cursos-pdfs
-- Pasta: pdf/
-- Projeto: fubynpjagxxqbyfjsile
-- ============================================

DO $$
DECLARE
  v_projeto_id TEXT := 'fubynpjagxxqbyfjsile';
  v_base_url TEXT := 'https://' || v_projeto_id || '.supabase.co/storage/v1/object/public/wellness-cursos-pdfs';
BEGIN
  RAISE NOTICE '🔄 Atualizando URLs dos PDFs com nomes reais do storage...';
  RAISE NOTICE '📦 Projeto: %', v_projeto_id;
  RAISE NOTICE '';

  -- ============================================
  -- SCRIPTS DE CONVITE
  -- ============================================
  -- Usando os primeiros arquivos (mais recentes) para evitar duplicatas
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdf/1762638311834-znm6h5g-calculadora-de-hidratacao.pdf'
  WHERE codigo = 'pdf-script-convite-leve-completo'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%' OR url LIKE '%/pdf/pdf/%');
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdf/1762947393699-zec0ulc-calculadora-imc.pdf'
  WHERE codigo = 'pdf-script-convite-pessoas-proximas'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%' OR url LIKE '%/pdf/pdf/%');
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdf/1762948400158-749d14g-calculadora-de-proteina.pdf'
  WHERE codigo = 'pdf-script-convite-leads-frios'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%' OR url LIKE '%/pdf/pdf/%');

  -- ============================================
  -- SCRIPTS DE FOLLOW-UP
  -- ============================================
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdf/1762950259931-p2s7qn3-composicao-corporal.pdf'
  WHERE codigo = 'pdf-script-follow-up-completo'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%' OR url LIKE '%/pdf/pdf/%');
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdf/1762951506410-gt9uvnp-planejador-de-refeicoes.pdf'
  WHERE codigo = 'pdf-script-follow-up-apos-link'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%' OR url LIKE '%/pdf/pdf/%');

  -- ============================================
  -- SCRIPTS DE APRESENTAÇÃO
  -- ============================================
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdf/1762950015976-p078knr-quiz-de-alimentacao-saudavel.pdf'
  WHERE codigo = 'pdf-script-apresentacao-produtos'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%' OR url LIKE '%/pdf/pdf/%');
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdf/1762951565905-868zl2q-quiz-de-bem-estar-diario.pdf'
  WHERE codigo = 'pdf-script-apresentacao-oportunidade'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%' OR url LIKE '%/pdf/pdf/%');

  -- ============================================
  -- SCRIPTS DE FECHAMENTO
  -- ============================================
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdf/1762951613762-1x37vw6-quiz-perfil-de-bem-estar.pdf'
  WHERE codigo = 'pdf-script-fechamento-produtos'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%' OR url LIKE '%/pdf/pdf/%');
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdf/1762951780412-i3ctn61-quiz-ganhos-e-prosperidade.pdf'
  WHERE codigo = 'pdf-script-fechamento-kits'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%' OR url LIKE '%/pdf/pdf/%');

  -- ============================================
  -- SCRIPTS DE OBJEÇÃO
  -- ============================================
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdf/1762951613762-1x37vw6-quiz-perfil-de-bem-estar.pdf'
  WHERE codigo = 'pdf-script-objecoes-completo'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%' OR url LIKE '%/pdf/pdf/%');
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdf/1762951725917-qx8qahy-quiz-potencial-e-crescimento.pdf'
  WHERE codigo = 'pdf-script-objecao-dinheiro'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%' OR url LIKE '%/pdf/pdf/%');
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdf/1762951650509-mp6nhw2-quiz-proposito-e-equilibrio.pdf'
  WHERE codigo = 'pdf-script-objecao-tempo'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%' OR url LIKE '%/pdf/pdf/%');

  -- ============================================
  -- SCRIPTS DE ONBOARDING
  -- ============================================
  -- Usando arquivos disponíveis (pode precisar ajustar depois)
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdf/1762951506410-gt9uvnp-planejador-de-refeicoes.pdf'
  WHERE codigo = 'pdf-script-onboarding-clientes'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%' OR url LIKE '%/pdf/pdf/%');
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdf/1762950015976-p078knr-quiz-de-alimentacao-saudavel.pdf'
  WHERE codigo = 'pdf-script-onboarding-distribuidores'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%' OR url LIKE '%/pdf/pdf/%');

  -- ============================================
  -- AULAS DE TREINAMENTO
  -- ============================================
  -- Usando arquivos disponíveis (pode precisar ajustar depois)
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdf/1762638311834-znm6h5g-calculadora-de-hidratacao.pdf'
  WHERE codigo = 'pdf-aula-1-fundamentos-wellness'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%' OR url LIKE '%/pdf/pdf/%');
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdf/1762947393699-zec0ulc-calculadora-imc.pdf'
  WHERE codigo = 'pdf-aula-2-3-pilares'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%' OR url LIKE '%/pdf/pdf/%');
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdf/1762950259931-p2s7qn3-composicao-corporal.pdf'
  WHERE codigo = 'pdf-aula-3-funcionamento-pratico'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%' OR url LIKE '%/pdf/pdf/%');
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdf/1762951565905-868zl2q-quiz-de-bem-estar-diario.pdf'
  WHERE codigo = 'pdf-aula-4-por-que-converte'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%' OR url LIKE '%/pdf/pdf/%');
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdf/1762951613762-1x37vw6-quiz-perfil-de-bem-estar.pdf'
  WHERE codigo = 'pdf-aula-5-ferramentas'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%' OR url LIKE '%/pdf/pdf/%');

  -- ============================================
  -- SCRIPTS DE RECRUTAMENTO
  -- ============================================
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdf/1762951780412-i3ctn61-quiz-ganhos-e-prosperidade.pdf'
  WHERE codigo = 'pdf-script-recrutamento-completo'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%' OR url LIKE '%/pdf/pdf/%');
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdf/1762951725917-qx8qahy-quiz-potencial-e-crescimento.pdf'
  WHERE codigo = 'pdf-script-recrutamento-leads-especificos'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%' OR url LIKE '%/pdf/pdf/%');

  -- ============================================
  -- SCRIPTS GERAIS
  -- ============================================
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdf/1762950015976-p078knr-quiz-de-alimentacao-saudavel.pdf'
  WHERE codigo = 'pdf-scripts-completo-primeira-versao'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%' OR url LIKE '%/pdf/pdf/%');
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdf/1762951650509-mp6nhw2-quiz-proposito-e-equilibrio.pdf'
  WHERE codigo = 'pdf-guia-rapido-scripts'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%' OR url LIKE '%/pdf/pdf/%');

  RAISE NOTICE '';
  RAISE NOTICE '✅ URLs atualizadas com sucesso!';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Verifique os resultados:';
  RAISE NOTICE '   SELECT codigo, titulo, url FROM wellness_materiais WHERE tipo = ''pdf'' AND categoria = ''cartilha'';';
  
END $$;

-- ============================================
-- VERIFICAR RESULTADOS
-- ============================================

SELECT 
  codigo,
  titulo,
  CASE 
    WHEN url LIKE '%placeholder%' OR url LIKE '%example.com%' THEN '⚠️ Ainda precisa atualizar'
    WHEN url LIKE '%wellness-cursos-pdfs%' THEN '✅ URL configurada'
    ELSE '❓ URL desconhecida'
  END as status,
  url
FROM wellness_materiais
WHERE tipo = 'pdf' 
  AND categoria = 'cartilha'
ORDER BY ordem, titulo;

-- ============================================
-- NOTA IMPORTANTE
-- ============================================
-- 
-- ⚠️ Alguns PDFs foram mapeados para múltiplos scripts porque:
-- - Há apenas 17 PDFs únicos no storage
-- - Mas temos 24 registros no banco
-- 
-- Você pode:
-- 1. Fazer upload de mais PDFs específicos
-- 2. Ou ajustar manualmente os mapeamentos acima
-- 3. Ou usar os mesmos PDFs para múltiplos scripts (funciona, mas não é ideal)
-- 
-- ============================================









