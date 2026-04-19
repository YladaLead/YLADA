-- Pro Líderes: slug opcional por membro no path público /l/[slug_link]/[share_path_slug|token].

ALTER TABLE pro_lideres_member_link_tokens
  ADD COLUMN IF NOT EXISTS share_path_slug TEXT;

COMMENT ON COLUMN pro_lideres_member_link_tokens.share_path_slug IS
  'Segmento opcional na URL /l/[ylada_slug]/[valor] — minúsculas, único por link; se null usa só o token.';

CREATE UNIQUE INDEX IF NOT EXISTS pro_lideres_mlt_link_share_slug_unique
  ON pro_lideres_member_link_tokens (ylada_link_id, share_path_slug)
  WHERE share_path_slug IS NOT NULL;
