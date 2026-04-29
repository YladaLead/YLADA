-- Feedback rápido nas respostas do Noel (Pro Estética Capilar): thumbs gravados para análise de qualidade.
-- Escrita apenas via API (service role); sem políticas SELECT públicas.

CREATE TABLE IF NOT EXISTS public.pro_estetica_capilar_noel_message_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  message_id text NOT NULL,
  rating text NOT NULL CHECK (rating IN ('up', 'down')),
  excerpt text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pecap_noel_feedback_user_created
  ON public.pro_estetica_capilar_noel_message_feedback (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_pecap_noel_feedback_created
  ON public.pro_estetica_capilar_noel_message_feedback (created_at DESC);

COMMENT ON TABLE public.pro_estetica_capilar_noel_message_feedback IS
  'Votos úteis/não úteis por mensagem do assistente no chat Noel capilar (POST /api/pro-estetica-capilar/noel-feedback).';

ALTER TABLE public.pro_estetica_capilar_noel_message_feedback ENABLE ROW LEVEL SECURITY;

-- Sem políticas para anon/authenticated: acesso só via service role na rota API.
