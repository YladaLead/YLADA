-- =====================================================
-- Perfil YLADA: adicionar category e sub_category (filtragem de público).
-- @see docs/PROGRAMACAO-ESTRUTURAL-YLADA.md (Etapa 1.1)
-- @see docs/PERFIL-EMPRESARIAL-YLADA-MODELO.md
-- =====================================================

ALTER TABLE ylada_noel_profile
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS sub_category TEXT;

COMMENT ON COLUMN ylada_noel_profile.category IS 'Mercado/segmento (ex.: estetica, automoveis, nutricao, odontologia). Usado para vocabulário e exemplos.';
COMMENT ON COLUMN ylada_noel_profile.sub_category IS 'Subcategoria opcional (ex.: cabelo, seminovos, high_ticket). Ajuste fino de linguagem.';

CREATE INDEX IF NOT EXISTS idx_ylada_noel_profile_category ON ylada_noel_profile(category) WHERE category IS NOT NULL;
