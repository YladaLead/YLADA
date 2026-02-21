-- =====================================================
-- Colunas em leads para vínculo ao link (link_source, link_id, area).
-- Permite contagem por link e por área a partir da tabela leads.
-- @see docs/CONTAGEM-3-EVENTOS-LINK-DEFINITIVO.md
-- =====================================================

-- link_id pode já existir (generated_links); adicionar só se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'leads' AND column_name = 'link_id'
  ) THEN
    ALTER TABLE leads ADD COLUMN link_id UUID NULL;
  END IF;
END $$;

ALTER TABLE leads ADD COLUMN IF NOT EXISTS link_source TEXT NULL;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS area TEXT NULL;

COMMENT ON COLUMN leads.link_source IS 'Tipo do recurso que gerou o lead: user_template, quiz, form, ylada_link, generated_link';
COMMENT ON COLUMN leads.area IS 'Área do dono: nutri, wellness, coach, ylada';

CREATE INDEX IF NOT EXISTS idx_leads_user_link ON leads(user_id, link_id) WHERE link_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_user_area_created ON leads(user_id, area, created_at DESC) WHERE area IS NOT NULL;
