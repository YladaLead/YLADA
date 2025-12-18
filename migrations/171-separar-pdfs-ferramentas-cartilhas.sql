-- ============================================
-- SEPARAR PDFs DE FERRAMENTAS PARA CARTILHAS
-- ============================================
-- 
-- Esta migration garante que apenas PDFs de uso de ferramentas
-- fiquem ativos na categoria 'cartilha'
-- ============================================

-- Lista de PDFs que DEVEM ficar em cartilhas (uso de ferramentas)
-- Baseado nos arquivos do storage:
-- - Calculadoras
-- - Quizzes
-- - Guias práticos de ferramentas

-- Atualizar tags e garantir que estão ativos
UPDATE wellness_materiais
SET 
  ativo = true,
  tags = ARRAY['ferramenta', 'cartilha', 'guia-pratico', 'primeira-versao', 'pdf']
WHERE categoria = 'cartilha'
  AND tipo = 'pdf'
  AND (
    -- Calculadoras
    codigo LIKE '%calculadora%' OR
    titulo ILIKE '%calculadora%' OR
    -- Quizzes
    codigo LIKE '%quiz%' OR
    titulo ILIKE '%quiz%' OR
    -- Guias práticos
    codigo LIKE '%composicao%' OR
    titulo ILIKE '%composicao%' OR
    codigo LIKE '%planejador%' OR
    titulo ILIKE '%planejador%'
  );

-- Garantir que PDFs de scripts e aulas estão desativados
UPDATE wellness_materiais
SET ativo = false
WHERE categoria = 'cartilha'
  AND tipo = 'pdf'
  AND (
    codigo LIKE '%script%' OR
    codigo LIKE '%aula%' OR
    titulo ILIKE '%script%' OR
    titulo ILIKE '%aula%'
  );

-- Verificar resultado final
SELECT 
  codigo,
  titulo,
  CASE 
    WHEN ativo = true THEN '✅ Ativo (Cartilha)'
    ELSE '❌ Desativado'
  END as status,
  tags
FROM wellness_materiais
WHERE categoria = 'cartilha'
  AND tipo = 'pdf'
ORDER BY 
  CASE WHEN ativo = true THEN 0 ELSE 1 END,
  ordem,
  titulo;







