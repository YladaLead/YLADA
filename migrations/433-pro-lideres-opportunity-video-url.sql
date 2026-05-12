-- Pro Líderes (rede H-líder): URL do vídeo da oportunidade de negócio (YouTube, Vimeo ou MP4 HTTPS).
-- Consumido na página pública /pro-lideres/o/[slug]/oportunidade e editável no perfil do líder.

ALTER TABLE public.leader_tenants
  ADD COLUMN IF NOT EXISTS opportunity_video_url TEXT;

COMMENT ON COLUMN public.leader_tenants.opportunity_video_url IS
  'URL pública do vídeo da oportunidade (YouTube, Vimeo ou ficheiro .mp4 em HTTPS) para a landing de recrutamento do líder.';
