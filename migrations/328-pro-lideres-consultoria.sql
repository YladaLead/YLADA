-- Pro Líderes — consultoria YLADA: materiais (roteiros, formulários, etc.), links partilháveis e respostas.

CREATE TABLE IF NOT EXISTS pro_lideres_consultancy_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title TEXT NOT NULL,
  material_kind TEXT NOT NULL,
  description TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_by_user_id UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  CONSTRAINT pro_lideres_consultancy_materials_title_nonempty CHECK (length(trim(title)) > 0),
  CONSTRAINT pro_lideres_consultancy_materials_kind_check CHECK (
    material_kind IN ('roteiro', 'formulario', 'checklist', 'dicas', 'documento')
  )
);

CREATE INDEX IF NOT EXISTS idx_pl_consultancy_materials_kind ON pro_lideres_consultancy_materials (material_kind);
CREATE INDEX IF NOT EXISTS idx_pl_consultancy_materials_sort ON pro_lideres_consultancy_materials (sort_order, created_at DESC);

CREATE OR REPLACE FUNCTION pro_lideres_consultancy_materials_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_pl_consultancy_materials_updated_at ON pro_lideres_consultancy_materials;
CREATE TRIGGER tr_pl_consultancy_materials_updated_at
  BEFORE UPDATE ON pro_lideres_consultancy_materials
  FOR EACH ROW EXECUTE FUNCTION pro_lideres_consultancy_materials_set_updated_at();

CREATE TABLE IF NOT EXISTS pro_lideres_consultancy_share_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES pro_lideres_consultancy_materials (id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  label TEXT,
  leader_tenant_id UUID REFERENCES leader_tenants (id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT pro_lideres_consultancy_share_links_token_unique UNIQUE (token)
);

CREATE INDEX IF NOT EXISTS idx_pl_consultancy_share_token ON pro_lideres_consultancy_share_links (token);
CREATE INDEX IF NOT EXISTS idx_pl_consultancy_share_material ON pro_lideres_consultancy_share_links (material_id, created_at DESC);

CREATE TABLE IF NOT EXISTS pro_lideres_consultancy_form_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES pro_lideres_consultancy_materials (id) ON DELETE CASCADE,
  share_link_id UUID REFERENCES pro_lideres_consultancy_share_links (id) ON DELETE SET NULL,
  leader_tenant_id UUID REFERENCES leader_tenants (id) ON DELETE SET NULL,
  respondent_name TEXT,
  respondent_email TEXT,
  answers JSONB NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pl_consultancy_resp_material ON pro_lideres_consultancy_form_responses (material_id, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_pl_consultancy_resp_share ON pro_lideres_consultancy_form_responses (share_link_id);

ALTER TABLE pro_lideres_consultancy_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE pro_lideres_consultancy_share_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE pro_lideres_consultancy_form_responses ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE pro_lideres_consultancy_materials IS
  'Materiais internos da consultoria Pro Líderes (YLADA admin): roteiro, formulário, checklist, dicas, documento.';
COMMENT ON TABLE pro_lideres_consultancy_share_links IS
  'Token público para abrir formulário de consultoria (líder preenche sem login obrigatório).';
COMMENT ON TABLE pro_lideres_consultancy_form_responses IS
  'Respostas submetidas via link público ou futuras integrações.';
