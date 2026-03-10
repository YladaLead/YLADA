-- Adicionar colunas para solicitações de área (em breve)
-- area_interesse: profissional-liberal | vendedores-geral | psi | psicanalise | odonto | coach
-- source: area_solicitacao (para filtrar no admin)
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'contact_submissions' AND column_name = 'area_interesse'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN area_interesse VARCHAR(100);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'contact_submissions' AND column_name = 'source'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN source VARCHAR(100);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_contact_submissions_area_interesse ON contact_submissions(area_interesse);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_source ON contact_submissions(source);

COMMENT ON COLUMN contact_submissions.area_interesse IS 'Área de interesse quando source=area_solicitacao (profissional-liberal, vendedores-geral, psi, etc.)';
COMMENT ON COLUMN contact_submissions.source IS 'Origem: contato (padrão), area_solicitacao, workshop_landing_page';
