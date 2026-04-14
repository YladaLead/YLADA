-- Pro Líderes: vertical operador (ex. h-lider = Herbalife) + tokens de partilha por membro para métricas por pessoa.

ALTER TABLE leader_tenants
  ADD COLUMN IF NOT EXISTS vertical_code TEXT NOT NULL DEFAULT 'h-lider';

COMMENT ON COLUMN leader_tenants.vertical_code IS
  'Código do operador/vertical (ex. h-lider Herbalife). Mesmas URLs Pro Líderes; catálogo e copy podem variar por valor.';

CREATE TABLE IF NOT EXISTS pro_lideres_member_link_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  leader_tenant_id UUID NOT NULL REFERENCES leader_tenants (id) ON DELETE CASCADE,
  member_user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  ylada_link_id UUID NOT NULL REFERENCES ylada_links (id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  CONSTRAINT pro_lideres_member_link_tokens_token_unique UNIQUE (token),
  CONSTRAINT pro_lideres_member_link_tokens_tenant_member_link_unique UNIQUE (leader_tenant_id, member_user_id, ylada_link_id)
);

CREATE INDEX IF NOT EXISTS idx_pro_lideres_mlt_token ON pro_lideres_member_link_tokens (token);
CREATE INDEX IF NOT EXISTS idx_pro_lideres_mlt_tenant_link ON pro_lideres_member_link_tokens (leader_tenant_id, ylada_link_id);

COMMENT ON TABLE pro_lideres_member_link_tokens IS
  'URL pública /l/[slug]?pl_m=[token] atribui cliques e WhatsApp ao membro da equipe no painel do líder.';

ALTER TABLE pro_lideres_member_link_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS pro_lideres_mlt_select_leader ON pro_lideres_member_link_tokens;
CREATE POLICY pro_lideres_mlt_select_leader ON pro_lideres_member_link_tokens
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = pro_lideres_member_link_tokens.leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
    OR member_user_id = auth.uid()
  );

-- Escrita apenas via service role (APIs servidor).
