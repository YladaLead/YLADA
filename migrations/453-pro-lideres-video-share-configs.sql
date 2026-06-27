-- Pró Líderes: config das páginas "vídeo compartilhável" por tenant (vídeo + textos).
-- Espelho de prolider_hom_config / prolider_reset_config, para os botões novos
-- HOM Herbalife e Início Rápido. Acesso sempre via service-role (supabaseAdmin).

-- ── HOM Herbalife ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.prolider_hom_herbalife_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.leader_tenants (id) ON DELETE CASCADE,
  video_url TEXT,
  headline TEXT NOT NULL DEFAULT 'Oportunidade Herbalife',
  subheadline TEXT NOT NULL DEFAULT 'Assista à apresentação e descubra como começar',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT prolider_hom_herbalife_config_tenant_unique UNIQUE (tenant_id)
);

CREATE INDEX IF NOT EXISTS idx_prolider_hom_herbalife_config_tenant
  ON public.prolider_hom_herbalife_config (tenant_id);

COMMENT ON TABLE public.prolider_hom_herbalife_config IS
  'Vídeo e textos da página HOM Herbalife (Pro Líderes) — compartilhada pela equipe com link pessoal por membro.';

-- ── Início Rápido ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.prolider_inicio_rapido_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.leader_tenants (id) ON DELETE CASCADE,
  video_url TEXT,
  headline TEXT NOT NULL DEFAULT 'Início Rápido',
  subheadline TEXT NOT NULL DEFAULT 'Seu primeiro passo para começar com o pé direito',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT prolider_inicio_rapido_config_tenant_unique UNIQUE (tenant_id)
);

CREATE INDEX IF NOT EXISTS idx_prolider_inicio_rapido_config_tenant
  ON public.prolider_inicio_rapido_config (tenant_id);

COMMENT ON TABLE public.prolider_inicio_rapido_config IS
  'Vídeo e textos da página Início Rápido (Pro Líderes) — compartilhada pela equipe com link pessoal por membro.';

-- ── Limpeza: zera links antigos do YouTube na HOM (agora "HM Reset") ──────────
-- A página da HOM já IGNORA YouTube e usa o MP4 interno; este UPDATE só limpa o
-- campo salvo (cosmético) para o líder não ver o link velho. Mantém qualquer
-- vídeo .mp4 custom que algum líder tenha colado.
UPDATE public.prolider_hom_config
SET video_url = NULL, updated_at = NOW()
WHERE video_url ILIKE '%youtu%';
