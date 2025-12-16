-- ============================================
-- ATUALIZAR URLs DOS PDFs DA BIBLIOTECA WELLNESS
-- ============================================
-- 
-- INSTRUÇÕES:
-- 1. Execute primeiro: migrations/163-verificar-e-atualizar-pdfs-biblioteca-wellness.sql
-- 2. Verifique os nomes EXATOS dos PDFs no Supabase Storage
-- 3. Ajuste as URLs abaixo com os nomes corretos
-- 4. Substitua [SEU-PROJETO] pelo ID do seu projeto Supabase
-- 5. Execute este script
-- 
-- ============================================

-- Substitua [SEU-PROJETO] pelo ID do seu projeto Supabase
-- Exemplo: fubynpjagxxqbyfjsile
-- Você encontra isso na URL do Supabase Dashboard ou nas variáveis de ambiente

DO $$
DECLARE
  v_projeto_id TEXT := '[SEU-PROJETO]'; -- ⚠️ SUBSTITUA AQUI
  v_base_url TEXT := 'https://' || v_projeto_id || '.supabase.co/storage/v1/object/public/wellness-biblioteca';
BEGIN
  RAISE NOTICE '🔄 Atualizando URLs dos PDFs...';
  RAISE NOTICE '📦 Projeto: %', v_projeto_id;
  RAISE NOTICE '🔗 Base URL: %', v_base_url;
  RAISE NOTICE '';

  -- ============================================
  -- SCRIPTS DE CONVITE
  -- ============================================
  -- Ajuste os nomes dos arquivos conforme estão no storage
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdfs/scripts/Calculadora-de-Hidratacao.pdf'
  WHERE codigo = 'pdf-script-convite-leve-completo'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%');
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdfs/scripts/Calculadora-IMC.pdf'
  WHERE codigo = 'pdf-script-convite-pessoas-proximas'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%');
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdfs/scripts/Calculadora-de-proteina.pdf'
  WHERE codigo = 'pdf-script-convite-leads-frios'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%');

  -- ============================================
  -- SCRIPTS DE FOLLOW-UP
  -- ============================================
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdfs/scripts/Como-Se-Compor...a.pdf' -- ⚠️ Ajuste o nome exato
  WHERE codigo = 'pdf-script-follow-up-completo'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%');
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdfs/scripts/Composicao-Corporal.pdf'
  WHERE codigo = 'pdf-script-follow-up-apos-link'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%');

  -- ============================================
  -- SCRIPTS DE APRESENTAÇÃO
  -- ============================================
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdfs/scripts/Planejador-de-Refeicoes.pdf'
  WHERE codigo = 'pdf-script-apresentacao-produtos'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%');
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdfs/scripts/Quiz-de-Aliment...el.pdf' -- ⚠️ Ajuste o nome exato
  WHERE codigo = 'pdf-script-apresentacao-oportunidade'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%');

  -- ============================================
  -- SCRIPTS DE FECHAMENTO
  -- ============================================
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdfs/scripts/Quiz-de-Bem-Estar-Di...o.pdf' -- ⚠️ Ajuste o nome exato
  WHERE codigo = 'pdf-script-fechamento-produtos'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%');
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdfs/scripts/QUIZ-Ganhos-e-Prosperi...e.pdf' -- ⚠️ Ajuste o nome exato
  WHERE codigo = 'pdf-script-fechamento-kits'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%');

  -- ============================================
  -- SCRIPTS DE OBJEÇÃO
  -- ============================================
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdfs/scripts/Quiz-Perfil-de-Bem-Estar.pdf'
  WHERE codigo = 'pdf-script-objecoes-completo'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%');
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdfs/scripts/Quiz-Potencial-e-Crescim...o.pdf' -- ⚠️ Ajuste o nome exato
  WHERE codigo = 'pdf-script-objecao-dinheiro'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%');
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdfs/scripts/Quiz-Proposito-e-Equilibrio.pdf'
  WHERE codigo = 'pdf-script-objecao-tempo'
    AND (url LIKE '%placeholder%' OR url LIKE '%example.com%');

  -- ============================================
  -- SCRIPTS DE ONBOARDING
  -- ============================================
  -- Se você tiver PDFs para onboarding, adicione aqui
  
  -- ============================================
  -- AULAS DE TREINAMENTO
  -- ============================================
  -- Se você tiver PDFs de aulas, adicione aqui
  -- Exemplo:
  -- UPDATE wellness_materiais
  -- SET url = v_base_url || '/pdfs/aulas/Aula-1-Fundamentos.pdf'
  -- WHERE codigo = 'pdf-aula-1-fundamentos-wellness';

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
    ELSE '✅ URL configurada'
  END as status,
  url
FROM wellness_materiais
WHERE tipo = 'pdf' 
  AND categoria = 'script'
ORDER BY ordem, titulo;

