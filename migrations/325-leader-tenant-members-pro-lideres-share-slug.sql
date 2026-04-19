-- Pro Líderes: slug público obrigatório por membro no convite (segmento /l/[link]/[slug]).
-- Único por espaço (tenant): dois membros não podem escolher o mesmo texto.

ALTER TABLE leader_tenant_members
  ADD COLUMN IF NOT EXISTS pro_lideres_share_slug TEXT;

COMMENT ON COLUMN leader_tenant_members.pro_lideres_share_slug IS
  'Slug escolhido no convite; usado como share_path_slug padrão nos links por membro. Líder: normalmente NULL.';

CREATE UNIQUE INDEX IF NOT EXISTS leader_tenant_members_tenant_share_slug_unique
  ON leader_tenant_members (leader_tenant_id, pro_lideres_share_slug)
  WHERE pro_lideres_share_slug IS NOT NULL;
