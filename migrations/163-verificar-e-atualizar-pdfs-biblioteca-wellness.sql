-- ============================================
-- VERIFICAR E ATUALIZAR PDFs DA BIBLIOTECA WELLNESS
-- ============================================
-- 
-- Este script ajuda a:
-- 1. Verificar quais materiais existem no banco
-- 2. Listar os PDFs que precisam de URLs atualizadas
-- 3. Atualizar as URLs baseado nos PDFs no Supabase Storage
-- ============================================

-- ============================================
-- PARTE 1: VERIFICAR MATERIAIS EXISTENTES
-- ============================================

-- Listar todos os materiais PDF de scripts que precisam de URLs atualizadas
SELECT 
  codigo,
  titulo,
  url,
  CASE 
    WHEN url LIKE '%placeholder%' OR url LIKE '%example.com%' THEN '⚠️ URL placeholder - precisa atualizar'
    ELSE '✅ URL configurada'
  END as status_url
FROM wellness_materiais
WHERE tipo = 'pdf' 
  AND categoria = 'script'
ORDER BY ordem, titulo;

-- ============================================
-- PARTE 2: VERIFICAR ARQUIVOS NO STORAGE
-- ============================================
-- 
-- NOTA: Para ver os arquivos no Supabase Storage:
-- 1. Acesse: Supabase Dashboard → Storage
-- 2. Clique no bucket: wellness-biblioteca
-- 3. Navegue pelas pastas: pdfs/scripts/
-- 
-- Os PDFs devem estar em:
-- - wellness-biblioteca/pdfs/scripts/
-- - wellness-biblioteca/pdfs/aulas/
-- 
-- ============================================

-- ============================================
-- PARTE 3: ATUALIZAR URLs DOS PDFs
-- ============================================
-- 
-- IMPORTANTE: Substitua [SEU-PROJETO] pelo ID do seu projeto Supabase
-- Exemplo: fubynpjagxxqbyfjsile
-- 
-- Formato da URL: 
-- https://[SEU-PROJETO].supabase.co/storage/v1/object/public/wellness-biblioteca/pdfs/scripts/[NOME-ARQUIVO].pdf
-- 
-- ============================================

-- Exemplo de como atualizar (descomente e ajuste):

/*
-- Substitua [SEU-PROJETO] pelo ID do seu projeto Supabase
DO $$
DECLARE
  v_projeto_id TEXT := '[SEU-PROJETO]'; -- Exemplo: 'fubynpjagxxqbyfjsile'
  v_base_url TEXT := 'https://' || v_projeto_id || '.supabase.co/storage/v1/object/public/wellness-biblioteca';
BEGIN
  -- Scripts de Convite
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdfs/scripts/Calculadora-de-Hidratacao.pdf'
  WHERE codigo = 'pdf-script-convite-leve-completo';
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdfs/scripts/Calculadora-IMC.pdf'
  WHERE codigo = 'pdf-script-convite-pessoas-proximas';
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdfs/scripts/Calculadora-de-proteina.pdf'
  WHERE codigo = 'pdf-script-convite-leads-frios';
  
  -- Scripts de Follow-up
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdfs/scripts/Como-Se-Compor...a.pdf'
  WHERE codigo = 'pdf-script-follow-up-completo';
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdfs/scripts/Composicao-Corporal.pdf'
  WHERE codigo = 'pdf-script-follow-up-apos-link';
  
  -- Scripts de Apresentação
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdfs/scripts/Planejador-de-Refeicoes.pdf'
  WHERE codigo = 'pdf-script-apresentacao-produtos';
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdfs/scripts/Quiz-de-Aliment...el.pdf'
  WHERE codigo = 'pdf-script-apresentacao-oportunidade';
  
  -- Scripts de Fechamento
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdfs/scripts/Quiz-de-Bem-Estar-Di...o.pdf'
  WHERE codigo = 'pdf-script-fechamento-produtos';
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdfs/scripts/QUIZ-Ganhos-e-Prosperi...e.pdf'
  WHERE codigo = 'pdf-script-fechamento-kits';
  
  -- Scripts de Objeção
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdfs/scripts/Quiz-Perfil-de-Bem-Estar.pdf'
  WHERE codigo = 'pdf-script-objecoes-completo';
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdfs/scripts/Quiz-Potencial-e-Crescim...o.pdf'
  WHERE codigo = 'pdf-script-objecao-dinheiro';
  
  UPDATE wellness_materiais
  SET url = v_base_url || '/pdfs/scripts/Quiz-Proposito-e-Equilibrio.pdf'
  WHERE codigo = 'pdf-script-objecao-tempo';
  
  RAISE NOTICE '✅ URLs atualizadas com sucesso!';
END $$;
*/

-- ============================================
-- PARTE 4: MAPEAMENTO DOS PDFs DA IMAGEM
-- ============================================
-- 
-- Baseado na imagem fornecida, aqui estão os PDFs:
-- 
-- 1. Calculadora-de-Hidratacao.pdf
-- 2. Calculadora-IMC.pdf
-- 3. Calculadora-de-proteina.pdf
-- 4. Como-Se-Compor...a.pdf (nome truncado)
-- 5. Composicao-Corporal.pdf
-- 6. Planejador-de-Refeicoes.pdf
-- 7. Quiz-de-Aliment...el.pdf (nome truncado)
-- 8. Quiz-de-Bem-Estar-Di...o.pdf (nome truncado)
-- 9. QUIZ-Ganhos-e-Prosperi...e.pdf (nome truncado)
-- 10. Quiz-Perfil-de-Bem-Estar.pdf
-- 11. Quiz-Potencial-e-Crescim...o.pdf (nome truncado)
-- 12. Quiz-Proposito-e-Equilibrio.pdf
-- 
-- ============================================

-- ============================================
-- PARTE 5: SCRIPT DE ATUALIZAÇÃO AUTOMÁTICA
-- ============================================
-- 
-- Este script tenta encontrar os PDFs no storage e atualizar automaticamente
-- Execute APENAS após verificar os nomes exatos dos arquivos no Supabase Storage
-- 
-- ============================================

-- Função helper para construir URL do Supabase
CREATE OR REPLACE FUNCTION get_supabase_storage_url(
  projeto_id TEXT,
  caminho_arquivo TEXT
) RETURNS TEXT AS $$
BEGIN
  RETURN 'https://' || projeto_id || '.supabase.co/storage/v1/object/public/wellness-biblioteca/' || caminho_arquivo;
END;
$$ LANGUAGE plpgsql;

-- Exemplo de uso (ajuste os nomes dos arquivos conforme estão no storage):
/*
SELECT get_supabase_storage_url('fubynpjagxxqbyfjsile', 'pdfs/scripts/Calculadora-de-Hidratacao.pdf');
*/

-- ============================================
-- INSTRUÇÕES FINAIS
-- ============================================
-- 
-- 1. Execute a PARTE 1 para ver quais materiais existem
-- 2. Acesse Supabase Dashboard → Storage → wellness-biblioteca
-- 3. Verifique os nomes EXATOS dos arquivos PDF
-- 4. Descomente e ajuste a PARTE 3 com os nomes corretos
-- 5. Execute a PARTE 3 para atualizar as URLs
-- 
-- ============================================









