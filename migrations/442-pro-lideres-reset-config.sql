-- Pro Líderes: config da página pública Reset Metabólico (vídeo + textos por tenant).

CREATE TABLE IF NOT EXISTS public.prolider_reset_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.leader_tenants (id) ON DELETE CASCADE,
  video_url TEXT,
  headline TEXT NOT NULL DEFAULT 'Reset Metabólico',
  subheadline TEXT NOT NULL DEFAULT 'Energia Natural em Movimento',
  description TEXT NOT NULL DEFAULT 'Conheça o projeto de bebidas funcionais: a bebida que revitaliza.',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT prolider_reset_config_tenant_unique UNIQUE (tenant_id)
);

CREATE INDEX IF NOT EXISTS idx_prolider_reset_config_tenant ON public.prolider_reset_config (tenant_id);

COMMENT ON TABLE public.prolider_reset_config IS
  'Vídeo e textos da landing Reset Metabólico (Pro Líderes) — compartilhada pela equipe com link pessoal por membro.';
