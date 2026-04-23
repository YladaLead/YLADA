-- Consultoria estética (capilar/corporal): cliente comercial, materiais por estética, links públicos e respostas.

CREATE TABLE IF NOT EXISTS ylada_estetica_consult_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  business_name TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  phone TEXT,
  segment TEXT NOT NULL DEFAULT 'capilar'
    CHECK (segment IN ('capilar', 'corporal', 'ambos')),
  leader_tenant_id UUID REFERENCES leader_tenants (id) ON DELETE SET NULL,
  consulting_paid_amount NUMERIC(12, 2),
  payment_currency TEXT NOT NULL DEFAULT 'BRL',
  last_payment_at TIMESTAMPTZ,
  is_annual_plan BOOLEAN NOT NULL DEFAULT FALSE,
  annual_plan_start DATE,
  annual_plan_end DATE,
  admin_notes TEXT,
  created_by_user_id UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  CONSTRAINT ylada_estetica_consult_clients_business_nonempty CHECK (length(trim(business_name)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_ylada_estetica_consult_clients_segment ON ylada_estetica_consult_clients (segment);
CREATE INDEX IF NOT EXISTS idx_ylada_estetica_consult_clients_tenant ON ylada_estetica_consult_clients (leader_tenant_id);
CREATE INDEX IF NOT EXISTS idx_ylada_estetica_consult_clients_annual_end ON ylada_estetica_consult_clients (annual_plan_end);

CREATE OR REPLACE FUNCTION ylada_estetica_consult_clients_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_ylada_estetica_consult_clients_updated_at ON ylada_estetica_consult_clients;
CREATE TRIGGER tr_ylada_estetica_consult_clients_updated_at
  BEFORE UPDATE ON ylada_estetica_consult_clients
  FOR EACH ROW EXECUTE FUNCTION ylada_estetica_consult_clients_set_updated_at();

CREATE TABLE IF NOT EXISTS ylada_estetica_consultancy_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  client_id UUID NOT NULL REFERENCES ylada_estetica_consult_clients (id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  material_kind TEXT NOT NULL,
  description TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_by_user_id UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  CONSTRAINT ylada_estetica_consultancy_materials_title_nonempty CHECK (length(trim(title)) > 0),
  CONSTRAINT ylada_estetica_consultancy_materials_kind_check CHECK (
    material_kind IN ('roteiro', 'formulario', 'checklist', 'dicas', 'documento')
  )
);

CREATE INDEX IF NOT EXISTS idx_ylada_estetica_consultancy_materials_client ON ylada_estetica_consultancy_materials (client_id, sort_order, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ylada_estetica_consultancy_materials_kind ON ylada_estetica_consultancy_materials (material_kind);

CREATE OR REPLACE FUNCTION ylada_estetica_consultancy_materials_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_ylada_estetica_consultancy_materials_updated_at ON ylada_estetica_consultancy_materials;
CREATE TRIGGER tr_ylada_estetica_consultancy_materials_updated_at
  BEFORE UPDATE ON ylada_estetica_consultancy_materials
  FOR EACH ROW EXECUTE FUNCTION ylada_estetica_consultancy_materials_set_updated_at();

CREATE TABLE IF NOT EXISTS ylada_estetica_consultancy_share_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES ylada_estetica_consultancy_materials (id) ON DELETE CASCADE,
  estetica_consult_client_id UUID NOT NULL REFERENCES ylada_estetica_consult_clients (id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  label TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ylada_estetica_consultancy_share_links_token_unique UNIQUE (token)
);

CREATE INDEX IF NOT EXISTS idx_ylada_estetica_consultancy_share_token ON ylada_estetica_consultancy_share_links (token);
CREATE INDEX IF NOT EXISTS idx_ylada_estetica_consultancy_share_material ON ylada_estetica_consultancy_share_links (material_id, created_at DESC);

CREATE TABLE IF NOT EXISTS ylada_estetica_consultancy_form_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES ylada_estetica_consultancy_materials (id) ON DELETE CASCADE,
  share_link_id UUID REFERENCES ylada_estetica_consultancy_share_links (id) ON DELETE SET NULL,
  estetica_consult_client_id UUID NOT NULL REFERENCES ylada_estetica_consult_clients (id) ON DELETE CASCADE,
  respondent_name TEXT,
  respondent_email TEXT,
  answers JSONB NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ylada_estetica_consultancy_resp_material ON ylada_estetica_consultancy_form_responses (material_id, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_ylada_estetica_consultancy_resp_client ON ylada_estetica_consultancy_form_responses (estetica_consult_client_id, submitted_at DESC);

ALTER TABLE ylada_estetica_consult_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE ylada_estetica_consultancy_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE ylada_estetica_consultancy_share_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE ylada_estetica_consultancy_form_responses ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE ylada_estetica_consult_clients IS
  'Cliente de consultoria estética (YLADA admin): segmento, pagamento, plano anual e renovação.';
COMMENT ON TABLE ylada_estetica_consultancy_materials IS
  'Materiais por estética (formulários, roteiros, etc.) ligados a ylada_estetica_consult_clients.';
COMMENT ON TABLE ylada_estetica_consultancy_share_links IS
  'Token público para a dona preencher formulário de consultoria estética.';
COMMENT ON TABLE ylada_estetica_consultancy_form_responses IS
  'Respostas dos formulários de consultoria estética.';
