-- =====================================================
-- ATUALIZAR TABELA LYA_ANALISE_NUTRI PARA FORMATO FIXO
-- Migração 155: Adicionar colunas do novo formato fixo de 4 blocos
-- =====================================================

-- Adicionar novas colunas do formato fixo
ALTER TABLE lya_analise_nutri
ADD COLUMN IF NOT EXISTS foco_prioritario TEXT,
ADD COLUMN IF NOT EXISTS acoes_recomendadas JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS onde_aplicar TEXT,
ADD COLUMN IF NOT EXISTS metrica_sucesso TEXT;

-- Migrar dados antigos para novo formato (se existirem)
-- foco_principal -> foco_prioritario
UPDATE lya_analise_nutri
SET foco_prioritario = foco_principal
WHERE foco_prioritario IS NULL AND foco_principal IS NOT NULL;

-- acao_pratica -> acoes_recomendadas (converter string para array)
UPDATE lya_analise_nutri
SET acoes_recomendadas = jsonb_build_array(acao_pratica)
WHERE (acoes_recomendadas IS NULL OR acoes_recomendadas = '[]'::jsonb)
  AND acao_pratica IS NOT NULL;

-- metrica_simples -> metrica_sucesso
UPDATE lya_analise_nutri
SET metrica_sucesso = metrica_simples
WHERE metrica_sucesso IS NULL AND metrica_simples IS NOT NULL;

-- Criar índice para busca por foco_prioritario
CREATE INDEX IF NOT EXISTS idx_lya_analise_foco_prioritario 
ON lya_analise_nutri(user_id, foco_prioritario) 
WHERE foco_prioritario IS NOT NULL;

-- Comentários para documentação
COMMENT ON COLUMN lya_analise_nutri.foco_prioritario IS 'Bloco 1: Foco prioritário (formato fixo)';
COMMENT ON COLUMN lya_analise_nutri.acoes_recomendadas IS 'Bloco 2: Ações recomendadas (array JSON)';
COMMENT ON COLUMN lya_analise_nutri.onde_aplicar IS 'Bloco 3: Onde aplicar a ação';
COMMENT ON COLUMN lya_analise_nutri.metrica_sucesso IS 'Bloco 4: Métrica de sucesso (24-72h)';

-- =====================================================
-- NOTA: As colunas antigas (foco_principal, acao_pratica, metrica_simples)
-- foram mantidas para compatibilidade, mas não devem ser mais usadas.
-- O novo formato fixo usa:
-- - foco_prioritario (substitui foco_principal)
-- - acoes_recomendadas (substitui acao_pratica)
-- - onde_aplicar (novo)
-- - metrica_sucesso (substitui metrica_simples)
-- =====================================================

