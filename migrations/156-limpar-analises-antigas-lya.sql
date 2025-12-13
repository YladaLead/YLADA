-- =====================================================
-- LIMPAR ANÁLISES ANTIGAS DA LYA (OPCIONAL)
-- Migração 156: Deletar análises antigas para forçar nova geração
-- =====================================================
-- 
-- ⚠️ ATENÇÃO: Este script deleta todas as análises antigas
-- Use apenas se quiser forçar nova geração no formato fixo
-- =====================================================

-- Deletar análises que não têm formato novo (opcional)
-- Descomente a linha abaixo se quiser limpar análises antigas:
-- DELETE FROM lya_analise_nutri 
-- WHERE foco_prioritario IS NULL 
--    OR acoes_recomendadas IS NULL 
--    OR acoes_recomendadas = '[]'::jsonb;

-- OU: Deletar todas as análises (força nova geração para todos)
-- DELETE FROM lya_analise_nutri;

-- =====================================================
-- NOTA: Se você não executar este script, o sistema
-- vai gerar novas análises automaticamente quando
-- detectar formato antigo.
-- =====================================================

