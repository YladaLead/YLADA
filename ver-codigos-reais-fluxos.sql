-- ============================================
-- VER QUAIS CÓDIGOS DE FLUXOS REALMENTE EXISTEM
-- ============================================

SELECT 
  codigo,
  titulo,
  categoria,
  ativo
FROM wellness_fluxos
WHERE ativo = true
ORDER BY codigo;
















