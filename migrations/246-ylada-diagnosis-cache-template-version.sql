-- =====================================================
-- Cache: versão de template para invalidar diagnósticos antigos.
-- Quando mudamos templates (ex.: estética vs genérico), cache v1 não
-- deve ser retornado — forçar regeneração com templates corretos.
-- =====================================================

ALTER TABLE ylada_diagnosis_cache
  ADD COLUMN IF NOT EXISTS template_version INTEGER NOT NULL DEFAULT 1;

CREATE INDEX IF NOT EXISTS idx_ylada_diagnosis_cache_lookup_v2
  ON ylada_diagnosis_cache(link_id, answers_hash)
  WHERE template_version = 2;

COMMENT ON COLUMN ylada_diagnosis_cache.template_version IS 'Versão dos templates. v2 = estética/nutrição/pele específicos. Cache lookup só retorna v2.';
