-- =====================================================
-- Biblioteca YLADA: adiciona dor_principal e objetivo_principal.
-- Estrutura ideal: cada item pode ter uma dor e um objetivo principais
-- para filtros e sugestões do Noel.
-- @see src/config/ylada-segmentos-dores-objetivos.ts
-- =====================================================

ALTER TABLE ylada_biblioteca_itens
  ADD COLUMN IF NOT EXISTS dor_principal TEXT,
  ADD COLUMN IF NOT EXISTS objetivo_principal TEXT;

CREATE INDEX IF NOT EXISTS idx_ylada_biblioteca_itens_dor ON ylada_biblioteca_itens(dor_principal) WHERE dor_principal IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ylada_biblioteca_itens_objetivo ON ylada_biblioteca_itens(objetivo_principal) WHERE objetivo_principal IS NOT NULL;

COMMENT ON COLUMN ylada_biblioteca_itens.dor_principal IS 'Dor principal que o item aborda (ex: Dificuldade de emagrecer, Ansiedade constante).';
COMMENT ON COLUMN ylada_biblioteca_itens.objetivo_principal IS 'Objetivo principal que o item ajuda a alcançar (ex: Emagrecer com saúde, Melhorar foco).';
